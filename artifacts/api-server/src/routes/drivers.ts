import { Router, type IRouter } from "express";
import { db, driversTable, deliveriesTable, customersTable, driverSessionsTable } from "@workspace/db";
import { eq, and, or, ilike, count, desc, gte, sum, sql, isNull } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { requireDriverAuth } from "../middlewares/driverAuth";
import { signDriverToken } from "../middlewares/driverAuth";
import { verifyOtpSms , sendOtpSms } from "../services/sms";
import { CreateDriverBody, UpdateDriverBody } from "@workspace/api-zod";
import { z } from "zod/v4";

const router: IRouter = Router();

function formatDriver(d: any) {
  return {
    id: Number(d.id),
    business_id: Number(d.businessId),
    name: d.name,
    phone: d.phone,
    email: d.email ?? null,
    vehicle_number: d.vehicleNumber,
    vehicle_type: d.vehicleType,
    status: d.status,
    last_lat: d.lastLat,
    last_lng: d.lastLng,
    rating: d.rating !== null && d.rating !== undefined ? parseFloat(d.rating) : null,
    date_of_birth: d.dateOfBirth ?? null,
    gender: d.gender ?? null,
    address: d.address ?? null,
    emergency_contact_name: d.emergencyContactName ?? null,
    emergency_contact_relation: d.emergencyContactRelation ?? null,
    emergency_contact_phone: d.emergencyContactPhone ?? null,
    created_at: d.createdAt,
  };
}

// ============================================================
// EXISTING ADMIN ROUTES (unchanged — used by khata-mobile POS)
// ============================================================

// GET /drivers
router.get("/drivers", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = (page - 1) * limit;
  const search = req.query.search as string | undefined;
  const status = req.query.status as string | undefined;

  const conditions: any[] = [eq(driversTable.businessId, businessId), eq(driversTable.isDeleted, false)];
  if (search) {
    conditions.push(or(ilike(driversTable.name, `%${search}%`), ilike(driversTable.phone, `%${search}%`)));
  }
  if (status) conditions.push(eq(driversTable.status, status as any));

  const [drivers, totalResult] = await Promise.all([
    db.select().from(driversTable).where(and(...conditions)).limit(limit).offset(offset).orderBy(desc(driversTable.createdAt)),
    db.select({ count: count() }).from(driversTable).where(and(...conditions)),
  ]);

  res.json({
    data: drivers.map(formatDriver),
    total: Number(totalResult[0].count),
    page,
    limit,
  });
});

// POST /drivers
router.post("/drivers", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateDriverBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;
  const [driver] = await db.insert(driversTable).values({
    businessId: d.business_id,
    name: d.name,
    phone: d.phone,
    vehicleNumber: d.vehicle_number,
    vehicleType: (d.vehicle_type ?? "bike") as any,
    status: (d.status ?? "offline") as any,
  }).returning();
  res.status(201).json(formatDriver(driver));
});

// GET /drivers/:id
router.get("/drivers/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [driver] = await db.select().from(driversTable)
    .where(and(eq(driversTable.id, id), eq(driversTable.isDeleted, false)));
  if (!driver) {
    res.status(404).json({ error: "Driver not found" });
    return;
  }
  res.json(formatDriver(driver));
});

// PUT /drivers/:id
router.put("/drivers/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const parsed = UpdateDriverBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;

  // Look up current status BEFORE updating, so we can detect the transition
  const [currentDriver] = await db.select().from(driversTable)
    .where(and(eq(driversTable.id, id), eq(driversTable.isDeleted, false)));
  if (!currentDriver) {
    res.status(404).json({ error: "Driver not found" });
    return;
  }

  const updates: any = {};
  if (d.name !== undefined) updates.name = d.name;
  if (d.phone !== undefined) updates.phone = d.phone;
  if (d.vehicle_number !== undefined) updates.vehicleNumber = d.vehicle_number;
  if (d.vehicle_type !== undefined) updates.vehicleType = d.vehicle_type;
  if (d.status !== undefined) updates.status = d.status;
  if (d.last_lat !== undefined) updates.lastLat = d.last_lat;
  if (d.last_lng !== undefined) updates.lastLng = d.last_lng;
  if (d.email !== undefined) updates.email = d.email;
  if (d.rating !== undefined) updates.rating = d.rating;
  if (d.date_of_birth !== undefined) updates.dateOfBirth = d.date_of_birth;
  if (d.gender !== undefined) updates.gender = d.gender;
  if (d.address !== undefined) updates.address = d.address;
  if (d.emergency_contact_name !== undefined) updates.emergencyContactName = d.emergency_contact_name;
  if (d.emergency_contact_relation !== undefined) updates.emergencyContactRelation = d.emergency_contact_relation;
  if (d.emergency_contact_phone !== undefined) updates.emergencyContactPhone = d.emergency_contact_phone;

  const [driver] = await db.update(driversTable).set(updates)
    .where(and(eq(driversTable.id, id), eq(driversTable.isDeleted, false))).returning();
  if (!driver) {
    res.status(404).json({ error: "Driver not found" });
    return;
  }

  // ── NEW: track online/offline sessions for Working Hours ──
  if (d.status !== undefined && d.status !== currentDriver.status) {
    if (d.status === "available") {
      const [openSession] = await db.select().from(driverSessionsTable)
        .where(and(eq(driverSessionsTable.driverId, id), isNull(driverSessionsTable.wentOfflineAt)));
      if (!openSession) {
        await db.insert(driverSessionsTable).values({
          driverId: id,
          businessId: Number(currentDriver.businessId),
        });
      }
    } else if (d.status === "offline") {
      await db.update(driverSessionsTable)
        .set({ wentOfflineAt: new Date() })
        .where(and(eq(driverSessionsTable.driverId, id), isNull(driverSessionsTable.wentOfflineAt)));
    }
  }

  res.json(formatDriver(driver));
});

// DELETE /drivers/:id
router.delete("/drivers/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [driver] = await db.update(driversTable).set({ isDeleted: true })
    .where(eq(driversTable.id, id)).returning();
  if (!driver) {
    res.status(404).json({ error: "Driver not found" });
    return;
  }
  res.json({ message: "Driver deleted" });
});

// ============================================================
// NEW: driver-app (delivery-app) login + push token routes
// ============================================================

const RequestOtpBody = z.object({
  phone: z.string().min(10).max(20),
  // business_id is intentionally NOT accepted from the client anymore —
  // the delivery-app is shared across businesses (Zomato-style), so the
  // driver's business is resolved server-side from their phone number.
});

// POST /drivers/login/request-otp
// delivery-app calls this first — sends a 6-digit OTP to the driver's phone.
// router.post("/drivers/login/request-otp", async (req, res): Promise<void> => {
//   const parsed = RequestOtpBody.safeParse(req.body);
//   if (!parsed.success) {
//     res.status(400).json({ error: parsed.error.message });
//     return;
//   }
//   const { phone } = parsed.data;

//   const matches = await db.select().from(driversTable).where(
//     and(
//       eq(driversTable.phone, phone),
//       eq(driversTable.isDeleted, false)
//     )
//   );

//   if (matches.length === 0) {
//     // Don't reveal whether the phone exists — generic message either way.
//     res.status(404).json({ error: "No driver found with this phone number" });
//     return;
//   }
//   if (matches.length > 1) {
//     // Phone number is expected to be unique across all drivers/businesses.
//     // If it isn't (e.g. legacy duplicate data), fail loudly instead of
//     // silently picking one business — this needs a data fix, not a guess.
//     console.error(`[drivers] Phone ${phone} matches ${matches.length} driver records — expected unique.`);
//     res.status(409).json({ error: "This phone number is linked to multiple accounts. Please contact support." });
//     return;
//   }

//   const driver = matches[0];

//   const otp = generateOtp();
//   const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

//   await db.update(driversTable)
//     .set({ otpCode: otp, otpExpiresAt: expiresAt })
//     .where(eq(driversTable.id, driver.id));

//   try {
//     await sendOtpSms(phone, otp);
//   } catch (err) {
//     console.error("[drivers] Failed to send OTP SMS:", err);
//     res.status(502).json({ error: "Failed to send OTP. Please try again." });
//     return;
//   }

//   res.json({ message: "OTP sent" });
// });
// POST /drivers/login/request-otp
// delivery-app calls this first — triggers 2Factor to generate + send an OTP.
router.post("/drivers/login/request-otp", async (req, res): Promise<void> => {
  const parsed = RequestOtpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { phone } = parsed.data;

  const matches = await db.select().from(driversTable).where(
    and(
      eq(driversTable.phone, phone),
      eq(driversTable.isDeleted, false)
    )
  );

  if (matches.length === 0) {
    res.status(404).json({ error: "No driver found with this phone number" });
    return;
  }
  if (matches.length > 1) {
    console.error(`[drivers] Phone ${phone} matches ${matches.length} driver records — expected unique.`);
    res.status(409).json({ error: "This phone number is linked to multiple accounts. Please contact support." });
    return;
  }

  try {
    await sendOtpSms(phone);
  } catch (err) {
    console.error("[drivers] Failed to send OTP SMS:", err);
    res.status(502).json({ error: "Failed to send OTP. Please try again." });
    return;
  }

  res.json({ message: "OTP sent" });
});
// const VerifyOtpBody = z.object({
//   phone: z.string().min(10).max(20),
//   otp: z.string().length(6).or(z.string().length(5)), // 5 while using the "12345" test OTP
// });

// // POST /drivers/login/verify-otp
// // delivery-app calls this with the OTP the driver typed in. Returns a driver JWT
// // plus the driver record — the client reads business_id from `driver.business_id`
// // dynamically instead of sending/assuming one.
// router.post("/drivers/login/verify-otp", async (req, res): Promise<void> => {
//   const parsed = VerifyOtpBody.safeParse(req.body);
//   if (!parsed.success) {
//     res.status(400).json({ error: parsed.error.message });
//     return;
//   }
//   const { phone, otp } = parsed.data;

//   const matches = await db.select().from(driversTable).where(
//     and(
//       eq(driversTable.phone, phone),
//       eq(driversTable.isDeleted, false)
//     )
//   );

//   if (matches.length === 0) {
//     res.status(404).json({ error: "Driver not found" });
//     return;
//   }
//   if (matches.length > 1) {
//     console.error(`[drivers] Phone ${phone} matches ${matches.length} driver records — expected unique.`);
//     res.status(409).json({ error: "This phone number is linked to multiple accounts. Please contact support." });
//     return;
//   }

//   const driver = matches[0];

//   if (!driver.otpCode || driver.otpCode !== otp) {
//     res.status(401).json({ error: "Invalid OTP" });
//     return;
//   }
//   if (!driver.otpExpiresAt || new Date(driver.otpExpiresAt) < new Date()) {
//     res.status(401).json({ error: "OTP expired, please request a new one" });
//     return;
//   }

//   // OTP consumed — clear it so it can't be reused
//   await db.update(driversTable)
//     .set({ otpCode: null, otpExpiresAt: null })
//     .where(eq(driversTable.id, driver.id));

//   const token = signDriverToken({
//     driverId: Number(driver.id),
//     businessId: Number(driver.businessId),
//     role: "driver",
//   });

//   res.json({ token, driver: formatDriver(driver) });
// });
const VerifyOtpBody = z.object({
  phone: z.string().min(10).max(20),
  otp: z.string().min(4).max(6), // 2Factor OTPs are typically 4 or 6 digits
});

// POST /drivers/login/verify-otp
router.post("/drivers/login/verify-otp", async (req, res): Promise<void> => {
  const parsed = VerifyOtpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { phone, otp } = parsed.data;

  const matches = await db.select().from(driversTable).where(
    and(
      eq(driversTable.phone, phone),
      eq(driversTable.isDeleted, false)
    )
  );

  if (matches.length === 0) {
    res.status(404).json({ error: "Driver not found" });
    return;
  }
  if (matches.length > 1) {
    console.error(`[drivers] Phone ${phone} matches ${matches.length} driver records — expected unique.`);
    res.status(409).json({ error: "This phone number is linked to multiple accounts. Please contact support." });
    return;
  }

  const driver = matches[0];

  const isValid = await verifyOtpSms(phone, otp);
  if (!isValid) {
    res.status(401).json({ error: "Invalid or expired OTP" });
    return;
  }

  const token = signDriverToken({
    driverId: Number(driver.id),
    businessId: Number(driver.businessId),
    role: "driver",
  });

  res.json({ token, driver: formatDriver(driver) });
});
const RegisterPushTokenBody = z.object({
  push_token: z.string().min(1),
});

// POST /drivers/push-token
// delivery-app calls this after login (and again if the token ever refreshes)
// to register where push notifications should be sent.
router.post("/drivers/push-token", requireDriverAuth, async (req, res): Promise<void> => {
  const parsed = RegisterPushTokenBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { driverId } = (req as any).driver;

  await db.update(driversTable)
    .set({ pushToken: parsed.data.push_token })
    .where(eq(driversTable.id, driverId));

  res.json({ message: "Push token registered" });
});

// GET /drivers/me
// delivery-app calls this to get the logged-in driver's own record.
router.get("/drivers/me", requireDriverAuth, async (req, res): Promise<void> => {
  const { driverId } = (req as any).driver;
  const [driver] = await db.select().from(driversTable)
    .where(and(eq(driversTable.id, driverId), eq(driversTable.isDeleted, false)));
  if (!driver) {
    res.status(404).json({ error: "Driver not found" });
    return;
  }
  res.json(formatDriver(driver));
});

// ============================================================
// NEW: driver home-screen stats + earnings
// (these were missing entirely — the frontend was calling routes that
// didn't exist yet, hence the 404s)
// ============================================================

// GET /drivers/:id/stats
// delivery-app's home screen — delivery counts by status for this driver.
router.get("/drivers/:id/stats", requireDriverAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { driverId } = (req as any).driver;

  // A driver can only see their own stats.
  if (id !== driverId) {
    res.status(403).json({ error: "Not authorized to view this driver's stats" });
    return;
  }

  const rows = await db
    .select({ status: deliveriesTable.status, count: count() })
    .from(deliveriesTable)
    .where(eq(deliveriesTable.driverId, driverId))
    .groupBy(deliveriesTable.status);

  const byStatus: Record<string, number> = {};
  for (const r of rows) byStatus[r.status as string] = Number(r.count);

  const total = Object.values(byStatus).reduce((sum, n) => sum + n, 0);

  // "Today" = deliveries assigned to this driver whose deliveredAt falls
  // on the current calendar date.
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [todayResult] = await db
    .select({ count: count() })
    .from(deliveriesTable)
    .where(
      and(
        eq(deliveriesTable.driverId, driverId),
        eq(deliveriesTable.status, "delivered" as any),
        gte(deliveriesTable.deliveredAt, startOfToday),
      ),
    );

  const [todayAssignedResult] = await db
    .select({ count: count() })
    .from(deliveriesTable)
    .where(
      and(
        eq(deliveriesTable.driverId, driverId),
        gte(deliveriesTable.assignedAt, startOfToday),
      ),
    );

  // Sum today's online→offline stretches, clipping any still-open
  // session (offline_at IS NULL) to "now".
  const todaySessions = await db.select().from(driverSessionsTable)
    .where(and(
      eq(driverSessionsTable.driverId, driverId),
      gte(driverSessionsTable.wentOnlineAt, startOfToday),
    ));

  const totalOnlineMs = todaySessions.reduce((sum, s) => {
    const end = s.wentOfflineAt ? new Date(s.wentOfflineAt) : new Date();
    return sum + (end.getTime() - new Date(s.wentOnlineAt).getTime());
  }, 0);

  const today_working_hours = +(totalOnlineMs / 3600000).toFixed(1);

  res.json({
    total_deliveries: total,
    today_assigned_deliveries: Number(todayAssignedResult.count),
    today_working_hours,
    pending_deliveries: byStatus["pending"] ?? 0,
    assigned_deliveries: byStatus["assigned"] ?? 0,
    picked_up_deliveries: byStatus["picked_up"] ?? 0,
    in_transit_deliveries: byStatus["in_transit"] ?? 0,
    completed_deliveries: byStatus["delivered"] ?? 0,
    cancelled_deliveries: byStatus["cancelled"] ?? 0,
    today_completed_deliveries: Number(todayResult.count),
  });
});

// ============================================================
// GET /drivers/:id/earnings  (EXTENDED — Option A)
//
// 🔶 IMPORTANT — inherited limitation, not new:
// There is still no dedicated driver-commission/payout field in the
// schema. This sums deliveriesTable.amount (the customer's order/
// delivery amount) on DELIVERED rows as the earnings stand-in — this is
// the SAME calculation the original endpoint already used, just now
// also broken down by day (chart) and per-delivery (history).
//
// "pending" is NOT a real payout-settlement state in the current schema
// (paymentStatus tracks COD collection FROM the customer, not payout TO
// the driver). We return pending.amount = 0 rather than fake a number —
// wire this up for real once/if a driver_earnings ledger or payout
// field exists.
// ============================================================
router.get("/drivers/:id/earnings", requireDriverAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { driverId, businessId } = (req as any).driver;

  if (id !== driverId) {
    res.status(403).json({ error: "Not authorized to view this driver's earnings" });
    return;
  }

  // ---- date range resolution --------------------------------------
  const period = req.query.period as string | undefined; // today | week | month
  const fromQuery = req.query.from as string | undefined;
  const toQuery = req.query.to as string | undefined;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const startOfMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);

  // Range used for the chart + history sections (defaults to last 7 days
  // if nothing specified, mirrors the "7-day chart" default in the spec)
  let rangeStart: Date;
  let rangeEnd: Date = new Date(); // now
  if (fromQuery && toQuery) {
    rangeStart = new Date(fromQuery + "T00:00:00");
    rangeEnd = new Date(toQuery + "T23:59:59");
  } else if (period === "today") {
    rangeStart = startOfToday;
  } else if (period === "week") {
    rangeStart = startOfWeek;
  } else if (period === "month") {
    rangeStart = startOfMonth;
  } else {
    rangeStart = new Date(startOfToday);
    rangeStart.setDate(rangeStart.getDate() - 6); // last 7 days incl. today
  }

  // ---- summary cards (today / week / month) -------------------------
  const sumEarnings = async (since: Date, until?: Date) => {
    const conditions: any[] = [
      eq(deliveriesTable.driverId, driverId),
      eq(deliveriesTable.businessId, businessId),
      eq(deliveriesTable.status, "delivered" as any),
      gte(deliveriesTable.deliveredAt, since),
    ];
    if (until) conditions.push(sql`${deliveriesTable.deliveredAt} <= ${until}`);

    const [result] = await db
      .select({ total: sum(deliveriesTable.amount), deliveries: count() })
      .from(deliveriesTable)
      .where(and(...conditions));

    return {
      amount: (parseFloat(result.total ?? "0")).toFixed(2),
      deliveries: Number(result.deliveries),
    };
  };

  const [today, week, month] = await Promise.all([
    sumEarnings(startOfToday),
    sumEarnings(startOfWeek),
    sumEarnings(startOfMonth),
  ]);

  // ---- chart: per-day totals within the resolved range ---------------
  const chartRows = await db
    .select({
      date: sql<string>`DATE(${deliveriesTable.deliveredAt})`,
      amount: sum(deliveriesTable.amount),
      deliveries: count(),
    })
    .from(deliveriesTable)
    .where(
      and(
        eq(deliveriesTable.driverId, driverId),
        eq(deliveriesTable.businessId, businessId),
        eq(deliveriesTable.status, "delivered" as any),
        gte(deliveriesTable.deliveredAt, rangeStart),
        sql`${deliveriesTable.deliveredAt} <= ${rangeEnd}`,
      ),
    )
    .groupBy(sql`DATE(${deliveriesTable.deliveredAt})`)
    .orderBy(sql`DATE(${deliveriesTable.deliveredAt})`);

  const chart = chartRows.map((r: any) => ({
    date: r.date,
    amount: parseFloat(r.amount ?? "0").toFixed(2),
    deliveries: Number(r.deliveries),
  }));

  // ---- history: per-delivery rows, paginated --------------------------
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;

  const historyConditions = [
    eq(deliveriesTable.driverId, driverId),
    eq(deliveriesTable.businessId, businessId),
    eq(deliveriesTable.status, "delivered" as any),
    gte(deliveriesTable.deliveredAt, rangeStart),
    sql`${deliveriesTable.deliveredAt} <= ${rangeEnd}`,
  ];

  const [historyRows, historyTotal] = await Promise.all([
    db
      .select({
        deliveryId: deliveriesTable.id,
        salesOrderId: deliveriesTable.salesOrderId,
        amount: deliveriesTable.amount,
        distanceKm: deliveriesTable.distance_km,
        deliveredAt: deliveriesTable.deliveredAt,
        customerName: customersTable.name,
      })
      .from(deliveriesTable)
      .leftJoin(customersTable, eq(deliveriesTable.customerId, customersTable.id))
      .where(and(...historyConditions))
      .orderBy(desc(deliveriesTable.deliveredAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(deliveriesTable).where(and(...historyConditions)),
  ]);

  const history = historyRows.map((r: any) => {
    const d = r.deliveredAt ? new Date(r.deliveredAt) : null;
    return {
      delivery_id: Number(r.deliveryId),
      order_id: r.salesOrderId !== null && r.salesOrderId !== undefined ? Number(r.salesOrderId) : Number(r.deliveryId),
      customer_name: r.customerName ?? "Customer",
      date: d ? d.toISOString().slice(0, 10) : null,
      time: d ? d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : null,
      distance_km: r.distanceKm !== null && r.distanceKm !== undefined ? parseFloat(r.distanceKm) : null,
      amount: parseFloat(r.amount ?? "0").toFixed(2),
      status: "earned", // only value the current schema actually supports — see note above
    };
  });

  res.json({
    summary: {
      today: { amount: today.amount, deliveries: today.deliveries },
      week: { amount: week.amount, deliveries: week.deliveries },
      month: { amount: month.amount, deliveries: month.deliveries },
      pending: { amount: "0.00" }, // not supported by current schema — see note above
    },
    chart,
    history,
    history_total: Number(historyTotal[0].count),
    page,
    limit,
    range: {
      from: rangeStart.toISOString().slice(0, 10),
      to: rangeEnd.toISOString().slice(0, 10),
    },
  });
});

export default router;