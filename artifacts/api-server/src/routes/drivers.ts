// // import { Router, type IRouter } from "express";
// // import { db, driversTable } from "@workspace/db";
// // import { eq, and, or, ilike, count, desc} from "drizzle-orm";
// // import { requireAuth } from "../middlewares/auth";
// // import { requireDriverAuth } from "../middlewares/driverAuth";
// // import { signDriverToken } from "../middlewares/driverAuth";
// // import { generateOtp, sendOtpSms } from "../services/sms";
// // import { CreateDriverBody, UpdateDriverBody } from "@workspace/api-zod";
// // import { z } from "zod/v4";

// // const router: IRouter = Router();

// // function formatDriver(d: any) {
// //   return {
// //     id: Number(d.id),
// //     business_id: Number(d.businessId),
// //     name: d.name,
// //     phone: d.phone,
// //     vehicle_number: d.vehicleNumber,
// //     vehicle_type: d.vehicleType,
// //     status: d.status,
// //     last_lat: d.lastLat,
// //     last_lng: d.lastLng,
// //     created_at: d.createdAt,
// //   };
// // }

// // // ============================================================
// // // EXISTING ADMIN ROUTES (unchanged — used by khata-mobile POS)
// // // ============================================================

// // // GET /drivers
// // router.get("/drivers", requireAuth, async (req, res): Promise<void> => {
// //   const businessId = parseInt(req.query.business_id as string, 10);
// //   if (isNaN(businessId)) {
// //     res.status(400).json({ error: "business_id is required" });
// //     return;
// //   }
// //   const page = parseInt(req.query.page as string) || 1;
// //   const limit = parseInt(req.query.limit as string) || 50;
// //   const offset = (page - 1) * limit;
// //   const search = req.query.search as string | undefined;
// //   const status = req.query.status as string | undefined;

// //   const conditions: any[] = [eq(driversTable.businessId, businessId), eq(driversTable.isDeleted, false)];
// //   if (search) {
// //     conditions.push(or(ilike(driversTable.name, `%${search}%`), ilike(driversTable.phone, `%${search}%`)));
// //   }
// //   if (status) conditions.push(eq(driversTable.status, status as any));

// //   const [drivers, totalResult] = await Promise.all([
// //     db.select().from(driversTable).where(and(...conditions)).limit(limit).offset(offset).orderBy(desc(driversTable.createdAt)),
// //     db.select({ count: count() }).from(driversTable).where(and(...conditions)),
// //   ]);

// //   res.json({
// //     data: drivers.map(formatDriver),
// //     total: Number(totalResult[0].count),
// //     page,
// //     limit,
// //   });
// // });

// // // POST /drivers
// // router.post("/drivers", requireAuth, async (req, res): Promise<void> => {
// //   const parsed = CreateDriverBody.safeParse(req.body);
// //   if (!parsed.success) {
// //     res.status(400).json({ error: parsed.error.message });
// //     return;
// //   }
// //   const d = parsed.data;
// //   const [driver] = await db.insert(driversTable).values({
// //     businessId: d.business_id,
// //     name: d.name,
// //     phone: d.phone,
// //     vehicleNumber: d.vehicle_number,
// //     vehicleType: (d.vehicle_type ?? "bike") as any,
// //     status: (d.status ?? "offline") as any,
// //   }).returning();
// //   res.status(201).json(formatDriver(driver));
// // });

// // // GET /drivers/:id
// // router.get("/drivers/:id", requireAuth, async (req, res): Promise<void> => {
// //   const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
// //   const id = parseInt(raw, 10);
// //   const [driver] = await db.select().from(driversTable)
// //     .where(and(eq(driversTable.id, id), eq(driversTable.isDeleted, false)));
// //   if (!driver) {
// //     res.status(404).json({ error: "Driver not found" });
// //     return;
// //   }
// //   res.json(formatDriver(driver));
// // });

// // // PUT /drivers/:id
// // router.put("/drivers/:id", requireAuth, async (req, res): Promise<void> => {
// //   const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
// //   const id = parseInt(raw, 10);
// //   const parsed = UpdateDriverBody.safeParse(req.body);
// //   if (!parsed.success) {
// //     res.status(400).json({ error: parsed.error.message });
// //     return;
// //   }
// //   const d = parsed.data;
// //   const updates: any = {};
// //   if (d.name !== undefined) updates.name = d.name;
// //   if (d.phone !== undefined) updates.phone = d.phone;
// //   if (d.vehicle_number !== undefined) updates.vehicleNumber = d.vehicle_number;
// //   if (d.vehicle_type !== undefined) updates.vehicleType = d.vehicle_type;
// //   if (d.status !== undefined) updates.status = d.status;
// //   if (d.last_lat !== undefined) updates.lastLat = d.last_lat;
// //   if (d.last_lng !== undefined) updates.lastLng = d.last_lng;

// //   const [driver] = await db.update(driversTable).set(updates)
// //     .where(and(eq(driversTable.id, id), eq(driversTable.isDeleted, false))).returning();
// //   if (!driver) {
// //     res.status(404).json({ error: "Driver not found" });
// //     return;
// //   }
// //   res.json(formatDriver(driver));
// // });

// // // DELETE /drivers/:id
// // router.delete("/drivers/:id", requireAuth, async (req, res): Promise<void> => {
// //   const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
// //   const id = parseInt(raw, 10);
// //   const [driver] = await db.update(driversTable).set({ isDeleted: true })
// //     .where(eq(driversTable.id, id)).returning();
// //   if (!driver) {
// //     res.status(404).json({ error: "Driver not found" });
// //     return;
// //   }
// //   res.json({ message: "Driver deleted" });
// // });

// // // ============================================================
// // // NEW: driver-app (delivery-app) login + push token routes
// // // ============================================================

// // const RequestOtpBody = z.object({
// //   phone: z.string().min(10).max(20),
// //   business_id: z.number(),
// // });

// // // POST /drivers/login/request-otp
// // // delivery-app calls this first — sends a 6-digit OTP to the driver's phone.
// // router.post("/drivers/login/request-otp", async (req, res): Promise<void> => {
// //   const parsed = RequestOtpBody.safeParse(req.body);
// //   if (!parsed.success) {
// //     res.status(400).json({ error: parsed.error.message });
// //     return;
// //   }
// //   const { phone, business_id } = parsed.data;

// //   const [driver] = await db.select().from(driversTable).where(
// //     and(
// //       eq(driversTable.phone, phone),
// //       eq(driversTable.businessId, business_id),
// //       eq(driversTable.isDeleted, false)
// //     )
// //   );

// //   if (!driver) {
// //     // Don't reveal whether the phone exists — generic message either way.
// //     res.status(404).json({ error: "No driver found with this phone number for this business" });
// //     return;
// //   }

// //   const otp = generateOtp();
// //   const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

// //   await db.update(driversTable)
// //     .set({ otpCode: otp, otpExpiresAt: expiresAt })
// //     .where(eq(driversTable.id, driver.id));

// //   try {
// //     await sendOtpSms(phone, otp);
// //   } catch (err) {
// //     console.error("[drivers] Failed to send OTP SMS:", err);
// //     res.status(502).json({ error: "Failed to send OTP. Please try again." });
// //     return;
// //   }

// //   res.json({ message: "OTP sent" });
// // });

// // const VerifyOtpBody = z.object({
// //   phone: z.string().min(10).max(20),
// //   business_id: z.number(),
// //   otp: z.string().length(6).or(z.string().length(5)), // 5 while using the "12345" test OTP
// // });

// // // POST /drivers/login/verify-otp
// // // delivery-app calls this with the OTP the driver typed in. Returns a driver JWT.
// // router.post("/drivers/login/verify-otp", async (req, res): Promise<void> => {
// //   const parsed = VerifyOtpBody.safeParse(req.body);
// //   if (!parsed.success) {
// //     res.status(400).json({ error: parsed.error.message });
// //     return;
// //   }
// //   const { phone, business_id, otp } = parsed.data;

// //   const [driver] = await db.select().from(driversTable).where(
// //     and(
// //       eq(driversTable.phone, phone),
// //       eq(driversTable.businessId, business_id),
// //       eq(driversTable.isDeleted, false)
// //     )
// //   );

// //   if (!driver) {
// //     res.status(404).json({ error: "Driver not found" });
// //     return;
// //   }
// //   if (!driver.otpCode || driver.otpCode !== otp) {
// //     res.status(401).json({ error: "Invalid OTP" });
// //     return;
// //   }
// //   if (!driver.otpExpiresAt || new Date(driver.otpExpiresAt) < new Date()) {
// //     res.status(401).json({ error: "OTP expired, please request a new one" });
// //     return;
// //   }

// //   // OTP consumed — clear it so it can't be reused
// //   await db.update(driversTable)
// //     .set({ otpCode: null, otpExpiresAt: null })
// //     .where(eq(driversTable.id, driver.id));

// //   const token = signDriverToken({
// //     driverId: Number(driver.id),
// //     businessId: Number(driver.businessId),
// //     role: "driver",
// //   });

// //   res.json({ token, driver: formatDriver(driver) });
// // });

// // const RegisterPushTokenBody = z.object({
// //   push_token: z.string().min(1),
// // });

// // // POST /drivers/push-token
// // // delivery-app calls this after login (and again if the token ever refreshes)
// // // to register where push notifications should be sent.
// // router.post("/drivers/push-token", requireDriverAuth, async (req, res): Promise<void> => {
// //   const parsed = RegisterPushTokenBody.safeParse(req.body);
// //   if (!parsed.success) {
// //     res.status(400).json({ error: parsed.error.message });
// //     return;
// //   }
// //   const { driverId } = (req as any).driver;

// //   await db.update(driversTable)
// //     .set({ pushToken: parsed.data.push_token })
// //     .where(eq(driversTable.id, driverId));

// //   res.json({ message: "Push token registered" });
// // });

// // // GET /drivers/me
// // // delivery-app calls this to get the logged-in driver's own record.
// // router.get("/drivers/me", requireDriverAuth, async (req, res): Promise<void> => {
// //   const { driverId } = (req as any).driver;
// //   const [driver] = await db.select().from(driversTable)
// //     .where(and(eq(driversTable.id, driverId), eq(driversTable.isDeleted, false)));
// //   if (!driver) {
// //     res.status(404).json({ error: "Driver not found" });
// //     return;
// //   }
// //   res.json(formatDriver(driver));
// // });

// // export default router;
// import { Router, type IRouter } from "express";
// import { db, driversTable } from "@workspace/db";
// import { eq, and, or, ilike, count, desc} from "drizzle-orm";
// import { requireAuth } from "../middlewares/auth";
// import { requireDriverAuth } from "../middlewares/driverAuth";
// import { signDriverToken } from "../middlewares/driverAuth";
// import { generateOtp, sendOtpSms } from "../services/sms";
// import { CreateDriverBody, UpdateDriverBody } from "@workspace/api-zod";
// import { z } from "zod/v4";

// const router: IRouter = Router();

// function formatDriver(d: any) {
//   return {
//     id: Number(d.id),
//     business_id: Number(d.businessId),
//     name: d.name,
//     phone: d.phone,
//     vehicle_number: d.vehicleNumber,
//     vehicle_type: d.vehicleType,
//     status: d.status,
//     last_lat: d.lastLat,
//     last_lng: d.lastLng,
//     created_at: d.createdAt,
//   };
// }

// // ============================================================
// // EXISTING ADMIN ROUTES (unchanged — used by khata-mobile POS)
// // ============================================================

// // GET /drivers
// router.get("/drivers", requireAuth, async (req, res): Promise<void> => {
//   const businessId = parseInt(req.query.business_id as string, 10);
//   if (isNaN(businessId)) {
//     res.status(400).json({ error: "business_id is required" });
//     return;
//   }
//   const page = parseInt(req.query.page as string) || 1;
//   const limit = parseInt(req.query.limit as string) || 50;
//   const offset = (page - 1) * limit;
//   const search = req.query.search as string | undefined;
//   const status = req.query.status as string | undefined;

//   const conditions: any[] = [eq(driversTable.businessId, businessId), eq(driversTable.isDeleted, false)];
//   if (search) {
//     conditions.push(or(ilike(driversTable.name, `%${search}%`), ilike(driversTable.phone, `%${search}%`)));
//   }
//   if (status) conditions.push(eq(driversTable.status, status as any));

//   const [drivers, totalResult] = await Promise.all([
//     db.select().from(driversTable).where(and(...conditions)).limit(limit).offset(offset).orderBy(desc(driversTable.createdAt)),
//     db.select({ count: count() }).from(driversTable).where(and(...conditions)),
//   ]);

//   res.json({
//     data: drivers.map(formatDriver),
//     total: Number(totalResult[0].count),
//     page,
//     limit,
//   });
// });

// // POST /drivers
// router.post("/drivers", requireAuth, async (req, res): Promise<void> => {
//   const parsed = CreateDriverBody.safeParse(req.body);
//   if (!parsed.success) {
//     res.status(400).json({ error: parsed.error.message });
//     return;
//   }
//   const d = parsed.data;
//   const [driver] = await db.insert(driversTable).values({
//     businessId: d.business_id,
//     name: d.name,
//     phone: d.phone,
//     vehicleNumber: d.vehicle_number,
//     vehicleType: (d.vehicle_type ?? "bike") as any,
//     status: (d.status ?? "offline") as any,
//   }).returning();
//   res.status(201).json(formatDriver(driver));
// });

// // GET /drivers/:id
// router.get("/drivers/:id", requireAuth, async (req, res): Promise<void> => {
//   const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
//   const id = parseInt(raw, 10);
//   const [driver] = await db.select().from(driversTable)
//     .where(and(eq(driversTable.id, id), eq(driversTable.isDeleted, false)));
//   if (!driver) {
//     res.status(404).json({ error: "Driver not found" });
//     return;
//   }
//   res.json(formatDriver(driver));
// });

// // PUT /drivers/:id
// router.put("/drivers/:id", requireAuth, async (req, res): Promise<void> => {
//   const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
//   const id = parseInt(raw, 10);
//   const parsed = UpdateDriverBody.safeParse(req.body);
//   if (!parsed.success) {
//     res.status(400).json({ error: parsed.error.message });
//     return;
//   }
//   const d = parsed.data;
//   const updates: any = {};
//   if (d.name !== undefined) updates.name = d.name;
//   if (d.phone !== undefined) updates.phone = d.phone;
//   if (d.vehicle_number !== undefined) updates.vehicleNumber = d.vehicle_number;
//   if (d.vehicle_type !== undefined) updates.vehicleType = d.vehicle_type;
//   if (d.status !== undefined) updates.status = d.status;
//   if (d.last_lat !== undefined) updates.lastLat = d.last_lat;
//   if (d.last_lng !== undefined) updates.lastLng = d.last_lng;

//   const [driver] = await db.update(driversTable).set(updates)
//     .where(and(eq(driversTable.id, id), eq(driversTable.isDeleted, false))).returning();
//   if (!driver) {
//     res.status(404).json({ error: "Driver not found" });
//     return;
//   }
//   res.json(formatDriver(driver));
// });

// // DELETE /drivers/:id
// router.delete("/drivers/:id", requireAuth, async (req, res): Promise<void> => {
//   const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
//   const id = parseInt(raw, 10);
//   const [driver] = await db.update(driversTable).set({ isDeleted: true })
//     .where(eq(driversTable.id, id)).returning();
//   if (!driver) {
//     res.status(404).json({ error: "Driver not found" });
//     return;
//   }
//   res.json({ message: "Driver deleted" });
// });

// // ============================================================
// // NEW: driver-app (delivery-app) login + push token routes
// // ============================================================

// const RequestOtpBody = z.object({
//   phone: z.string().min(10).max(20),
//   // business_id is intentionally NOT accepted from the client anymore —
//   // the delivery-app is shared across businesses (Zomato-style), so the
//   // driver's business is resolved server-side from their phone number.
// });

// // POST /drivers/login/request-otp
// // delivery-app calls this first — sends a 6-digit OTP to the driver's phone.
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

// const RegisterPushTokenBody = z.object({
//   push_token: z.string().min(1),
// });

// // POST /drivers/push-token
// // delivery-app calls this after login (and again if the token ever refreshes)
// // to register where push notifications should be sent.
// router.post("/drivers/push-token", requireDriverAuth, async (req, res): Promise<void> => {
//   const parsed = RegisterPushTokenBody.safeParse(req.body);
//   if (!parsed.success) {
//     res.status(400).json({ error: parsed.error.message });
//     return;
//   }
//   const { driverId } = (req as any).driver;

//   await db.update(driversTable)
//     .set({ pushToken: parsed.data.push_token })
//     .where(eq(driversTable.id, driverId));

//   res.json({ message: "Push token registered" });
// });

// // GET /drivers/me
// // delivery-app calls this to get the logged-in driver's own record.
// router.get("/drivers/me", requireDriverAuth, async (req, res): Promise<void> => {
//   const { driverId } = (req as any).driver;
//   const [driver] = await db.select().from(driversTable)
//     .where(and(eq(driversTable.id, driverId), eq(driversTable.isDeleted, false)));
//   if (!driver) {
//     res.status(404).json({ error: "Driver not found" });
//     return;
//   }
//   res.json(formatDriver(driver));
// });

// export default router;
import { Router, type IRouter } from "express";
import { db, driversTable, deliveriesTable } from "@workspace/db";
import { eq, and, or, ilike, count, desc, gte, sum } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { requireDriverAuth } from "../middlewares/driverAuth";
import { signDriverToken } from "../middlewares/driverAuth";
import { generateOtp, sendOtpSms } from "../services/sms";
import { CreateDriverBody, UpdateDriverBody } from "@workspace/api-zod";
import { z } from "zod/v4";

const router: IRouter = Router();

function formatDriver(d: any) {
  return {
    id: Number(d.id),
    business_id: Number(d.businessId),
    name: d.name,
    phone: d.phone,
    vehicle_number: d.vehicleNumber,
    vehicle_type: d.vehicleType,
    status: d.status,
    last_lat: d.lastLat,
    last_lng: d.lastLng,
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
  const updates: any = {};
  if (d.name !== undefined) updates.name = d.name;
  if (d.phone !== undefined) updates.phone = d.phone;
  if (d.vehicle_number !== undefined) updates.vehicleNumber = d.vehicle_number;
  if (d.vehicle_type !== undefined) updates.vehicleType = d.vehicle_type;
  if (d.status !== undefined) updates.status = d.status;
  if (d.last_lat !== undefined) updates.lastLat = d.last_lat;
  if (d.last_lng !== undefined) updates.lastLng = d.last_lng;

  const [driver] = await db.update(driversTable).set(updates)
    .where(and(eq(driversTable.id, id), eq(driversTable.isDeleted, false))).returning();
  if (!driver) {
    res.status(404).json({ error: "Driver not found" });
    return;
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
    // Don't reveal whether the phone exists — generic message either way.
    res.status(404).json({ error: "No driver found with this phone number" });
    return;
  }
  if (matches.length > 1) {
    // Phone number is expected to be unique across all drivers/businesses.
    // If it isn't (e.g. legacy duplicate data), fail loudly instead of
    // silently picking one business — this needs a data fix, not a guess.
    console.error(`[drivers] Phone ${phone} matches ${matches.length} driver records — expected unique.`);
    res.status(409).json({ error: "This phone number is linked to multiple accounts. Please contact support." });
    return;
  }

  const driver = matches[0];

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min

  await db.update(driversTable)
    .set({ otpCode: otp, otpExpiresAt: expiresAt })
    .where(eq(driversTable.id, driver.id));

  try {
    await sendOtpSms(phone, otp);
  } catch (err) {
    console.error("[drivers] Failed to send OTP SMS:", err);
    res.status(502).json({ error: "Failed to send OTP. Please try again." });
    return;
  }

  res.json({ message: "OTP sent" });
});

const VerifyOtpBody = z.object({
  phone: z.string().min(10).max(20),
  otp: z.string().length(6).or(z.string().length(5)), // 5 while using the "12345" test OTP
});

// POST /drivers/login/verify-otp
// delivery-app calls this with the OTP the driver typed in. Returns a driver JWT
// plus the driver record — the client reads business_id from `driver.business_id`
// dynamically instead of sending/assuming one.
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

  if (!driver.otpCode || driver.otpCode !== otp) {
    res.status(401).json({ error: "Invalid OTP" });
    return;
  }
  if (!driver.otpExpiresAt || new Date(driver.otpExpiresAt) < new Date()) {
    res.status(401).json({ error: "OTP expired, please request a new one" });
    return;
  }

  // OTP consumed — clear it so it can't be reused
  await db.update(driversTable)
    .set({ otpCode: null, otpExpiresAt: null })
    .where(eq(driversTable.id, driver.id));

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

  res.json({
    total_deliveries: total,
    pending_deliveries: byStatus["pending"] ?? 0,
    assigned_deliveries: byStatus["assigned"] ?? 0,
    picked_up_deliveries: byStatus["picked_up"] ?? 0,
    in_transit_deliveries: byStatus["in_transit"] ?? 0,
    completed_deliveries: byStatus["delivered"] ?? 0,
    cancelled_deliveries: byStatus["cancelled"] ?? 0,
    today_completed_deliveries: Number(todayResult.count),
  });
});

// GET /drivers/:id/earnings
// delivery-app's home screen — earnings summary for this driver.
//
// 🔶 NOTE: there is no dedicated commission/earning-per-delivery field in
// the schema today, so this sums the `amount` on DELIVERED deliveries as a
// stand-in for earnings. If you're paying drivers a fixed fee or % per
// delivery rather than the full order amount, add an `earning` (or
// `driverFee`) column to deliveriesTable and swap the SUM below to use it
// instead of `amount` — the query shape stays the same either way.
router.get("/drivers/:id/earnings", requireDriverAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { driverId } = (req as any).driver;

  if (id !== driverId) {
    res.status(403).json({ error: "Not authorized to view this driver's earnings" });
    return;
  }

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const startOfMonth = new Date(startOfToday.getFullYear(), startOfToday.getMonth(), 1);

  const sumEarnings = async (since?: Date) => {
    const conditions: any[] = [
      eq(deliveriesTable.driverId, driverId),
      eq(deliveriesTable.status, "delivered" as any),
    ];
    if (since) conditions.push(gte(deliveriesTable.deliveredAt, since));

    const [result] = await db
      .select({ total: sum(deliveriesTable.amount), deliveries: count() })
      .from(deliveriesTable)
      .where(and(...conditions));

    return {
      amount: parseFloat(result.total ?? "0"),
      deliveries: Number(result.deliveries),
    };
  };

  const [today, week, month, allTime] = await Promise.all([
    sumEarnings(startOfToday),
    sumEarnings(startOfWeek),
    sumEarnings(startOfMonth),
    sumEarnings(undefined),
  ]);

  res.json({
    today_earnings: today.amount,
    today_deliveries: today.deliveries,
    week_earnings: week.amount,
    week_deliveries: week.deliveries,
    month_earnings: month.amount,
    month_deliveries: month.deliveries,
    total_earnings: allTime.amount,
    total_deliveries: allTime.deliveries,
  });
});

export default router;