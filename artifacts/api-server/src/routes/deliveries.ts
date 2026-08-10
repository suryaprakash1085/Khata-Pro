// import { Router, type IRouter } from "express";
// import { db, deliveriesTable } from "@workspace/db";
// import { eq, and, count, desc } from "drizzle-orm";
// import { requireAuth } from "../middlewares/auth";
// import { CreateDeliveryBody, UpdateDeliveryBody, AssignDriverBody, UpdateDeliveryStatusBody } from "@workspace/api-zod";

// const router: IRouter = Router();

// function formatDelivery(d: any) {
//   return {
//     id: Number(d.id),
//     business_id: Number(d.businessId),
//     customer_id: Number(d.customerId),
//     driver_id: d.driverId !== null ? Number(d.driverId) : null,
//     pickup_address: d.pickupAddress,
//     drop_address: d.dropAddress,
//     status: d.status,
//     notes: d.notes,
//     assigned_at: d.assignedAt,
//     picked_up_at: d.pickedUpAt,
//     delivered_at: d.deliveredAt,
//     cancelled_at: d.cancelledAt,
//     created_at: d.createdAt,
//   };
// }

// // GET /deliveries
// router.get("/deliveries", requireAuth, async (req, res): Promise<void> => {
//   const businessId = parseInt(req.query.business_id as string, 10);
//   if (isNaN(businessId)) {
//     res.status(400).json({ error: "business_id is required" });
//     return;
//   }
//   const page = parseInt(req.query.page as string) || 1;
//   const limit = parseInt(req.query.limit as string) || 50;
//   const offset = (page - 1) * limit;
//   const status = req.query.status as string | undefined;
//   const driverId = req.query.driver_id ? parseInt(req.query.driver_id as string, 10) : undefined;
//   const customerId = req.query.customer_id ? parseInt(req.query.customer_id as string, 10) : undefined;

//   const conditions: any[] = [eq(deliveriesTable.businessId, businessId)];
//   if (status) conditions.push(eq(deliveriesTable.status, status as any));
//   if (driverId) conditions.push(eq(deliveriesTable.driverId, driverId));
//   if (customerId) conditions.push(eq(deliveriesTable.customerId, customerId));

//   const [deliveries, totalResult] = await Promise.all([
//     db.select().from(deliveriesTable).where(and(...conditions)).limit(limit).offset(offset).orderBy(desc(deliveriesTable.createdAt)),
//     db.select({ count: count() }).from(deliveriesTable).where(and(...conditions)),
//   ]);

//   res.json({
//     data: deliveries.map(formatDelivery),
//     total: Number(totalResult[0].count),
//     page,
//     limit,
//   });
// });

// // POST /deliveries  (creates in "pending" status — no driver yet)
// router.post("/deliveries", requireAuth, async (req, res): Promise<void> => {
//   const parsed = CreateDeliveryBody.safeParse(req.body);
//   if (!parsed.success) {
//     res.status(400).json({ error: parsed.error.message });
//     return;
//   }
//   const d = parsed.data;
//   const [delivery] = await db.insert(deliveriesTable).values({
//     businessId: d.business_id,
//     customerId: d.customer_id,
//     pickupAddress: d.pickup_address,
//     dropAddress: d.drop_address,
//     notes: d.notes,
//     status: "pending",
//   }).returning();
//   res.status(201).json(formatDelivery(delivery));
// });

// // GET /deliveries/:id
// router.get("/deliveries/:id", requireAuth, async (req, res): Promise<void> => {
//   const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
//   const id = parseInt(raw, 10);
//   const [delivery] = await db.select().from(deliveriesTable).where(eq(deliveriesTable.id, id));
//   if (!delivery) {
//     res.status(404).json({ error: "Delivery not found" });
//     return;
//   }
//   res.json(formatDelivery(delivery));
// });

// // PUT /deliveries/:id  (edit address/notes only — use the endpoints below for status/driver changes)
// router.put("/deliveries/:id", requireAuth, async (req, res): Promise<void> => {
//   const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
//   const id = parseInt(raw, 10);
//   const parsed = UpdateDeliveryBody.safeParse(req.body);
//   if (!parsed.success) {
//     res.status(400).json({ error: parsed.error.message });
//     return;
//   }
//   const d = parsed.data;
//   const updates: any = {};
//   if (d.pickup_address !== undefined) updates.pickupAddress = d.pickup_address;
//   if (d.drop_address !== undefined) updates.dropAddress = d.drop_address;
//   if (d.notes !== undefined) updates.notes = d.notes;

//   const [delivery] = await db.update(deliveriesTable).set(updates).where(eq(deliveriesTable.id, id)).returning();
//   if (!delivery) {
//     res.status(404).json({ error: "Delivery not found" });
//     return;
//   }
//   res.json(formatDelivery(delivery));
// });

// // POST /deliveries/:id/assign  (admin assigns a driver -> status becomes "assigned")
// router.post("/deliveries/:id/assign", requireAuth, async (req, res): Promise<void> => {
//   const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
//   const id = parseInt(raw, 10);
//   const parsed = AssignDriverBody.safeParse(req.body);
//   if (!parsed.success) {
//     res.status(400).json({ error: parsed.error.message });
//     return;
//   }
//   const [delivery] = await db.update(deliveriesTable).set({
//     driverId: parsed.data.driver_id,
//     status: "assigned",
//     assignedAt: new Date(),
//   }).where(eq(deliveriesTable.id, id)).returning();
//   if (!delivery) {
//     res.status(404).json({ error: "Delivery not found" });
//     return;
//   }
//   res.json(formatDelivery(delivery));
// });

// // PUT /deliveries/:id/status  (driver updates status as the delivery progresses)
// router.put("/deliveries/:id/status", requireAuth, async (req, res): Promise<void> => {
//   const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
//   const id = parseInt(raw, 10);
//   const parsed = UpdateDeliveryStatusBody.safeParse(req.body);
//   if (!parsed.success) {
//     res.status(400).json({ error: parsed.error.message });
//     return;
//   }
//   const status = parsed.data.status;
//   const updates: any = { status };
//   if (status === "picked_up") updates.pickedUpAt = new Date();
//   if (status === "delivered") updates.deliveredAt = new Date();
//   if (status === "cancelled") updates.cancelledAt = new Date();

//   const [delivery] = await db.update(deliveriesTable).set(updates).where(eq(deliveriesTable.id, id)).returning();
//   if (!delivery) {
//     res.status(404).json({ error: "Delivery not found" });
//     return;
//   }
//   res.json(formatDelivery(delivery));
// });

// export default router;


import { Router, type IRouter } from "express";
import { db, deliveriesTable, driversTable } from "@workspace/db";
import { eq, and, count, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { requireDriverAuth } from "../middlewares/driverAuth";
import { CreateDeliveryBody, UpdateDeliveryBody, AssignDriverBody, UpdateDeliveryStatusBody } from "@workspace/api-zod";
import { notifyDriverOfNewDelivery } from "../services/pushNotifications";

const router: IRouter = Router();

function formatDelivery(d: any) {
  return {
    id: Number(d.id),
    business_id: Number(d.businessId),
    customer_id: Number(d.customerId),
    driver_id: d.driverId !== null ? Number(d.driverId) : null,
    pickup_address: d.pickupAddress,
    drop_address: d.dropAddress,
    status: d.status,
    notes: d.notes,
    assigned_at: d.assignedAt,
    picked_up_at: d.pickedUpAt,
    delivered_at: d.deliveredAt,
    cancelled_at: d.cancelledAt,
    created_at: d.createdAt,
  };
}

// ============================================================
// EXISTING ADMIN ROUTES (unchanged — used by khata-mobile POS)
// ============================================================

// GET /deliveries
router.get("/deliveries", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = (page - 1) * limit;
  const status = req.query.status as string | undefined;
  const driverId = req.query.driver_id ? parseInt(req.query.driver_id as string, 10) : undefined;
  const customerId = req.query.customer_id ? parseInt(req.query.customer_id as string, 10) : undefined;

  const conditions: any[] = [eq(deliveriesTable.businessId, businessId)];
  if (status) conditions.push(eq(deliveriesTable.status, status as any));
  if (driverId) conditions.push(eq(deliveriesTable.driverId, driverId));
  if (customerId) conditions.push(eq(deliveriesTable.customerId, customerId));

  const [deliveries, totalResult] = await Promise.all([
    db.select().from(deliveriesTable).where(and(...conditions)).limit(limit).offset(offset).orderBy(desc(deliveriesTable.createdAt)),
    db.select({ count: count() }).from(deliveriesTable).where(and(...conditions)),
  ]);

  res.json({
    data: deliveries.map(formatDelivery),
    total: Number(totalResult[0].count),
    page,
    limit,
  });
});

// POST /deliveries  (creates in "pending" status — no driver yet)
router.post("/deliveries", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateDeliveryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;
  const [delivery] = await db.insert(deliveriesTable).values({
    businessId: d.business_id,
    customerId: d.customer_id,
    pickupAddress: d.pickup_address,
    dropAddress: d.drop_address,
    notes: d.notes,
    status: "pending",
  }).returning();
  res.status(201).json(formatDelivery(delivery));
});

// GET /deliveries/:id
router.get("/deliveries/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [delivery] = await db.select().from(deliveriesTable).where(eq(deliveriesTable.id, id));
  if (!delivery) {
    res.status(404).json({ error: "Delivery not found" });
    return;
  }
  res.json(formatDelivery(delivery));
});

// PUT /deliveries/:id  (edit address/notes only — use the endpoints below for status/driver changes)
router.put("/deliveries/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const parsed = UpdateDeliveryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;
  const updates: any = {};
  if (d.pickup_address !== undefined) updates.pickupAddress = d.pickup_address;
  if (d.drop_address !== undefined) updates.dropAddress = d.drop_address;
  if (d.notes !== undefined) updates.notes = d.notes;

  const [delivery] = await db.update(deliveriesTable).set(updates).where(eq(deliveriesTable.id, id)).returning();
  if (!delivery) {
    res.status(404).json({ error: "Delivery not found" });
    return;
  }
  res.json(formatDelivery(delivery));
});

// POST /deliveries/:id/assign  (admin assigns a driver -> status becomes "assigned")
// NEW: also fires a push notification to the driver's phone.
router.post("/deliveries/:id/assign", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const parsed = AssignDriverBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [delivery] = await db.update(deliveriesTable).set({
    driverId: parsed.data.driver_id,
    status: "assigned",
    assignedAt: new Date(),
  }).where(eq(deliveriesTable.id, id)).returning();
  if (!delivery) {
    res.status(404).json({ error: "Delivery not found" });
    return;
  }

  // Fire-and-forget push notification — don't let a bad token/Expo hiccup
  // block the assignment response.
  const [driver] = await db.select().from(driversTable).where(eq(driversTable.id, parsed.data.driver_id));
  if (driver?.pushToken) {
    notifyDriverOfNewDelivery(driver.pushToken, Number(delivery.id), delivery.dropAddress).catch(err =>
      console.error("[deliveries] Failed to send assignment push notification:", err)
    );
  }

  res.json(formatDelivery(delivery));
});

// PUT /deliveries/:id/status  (staff/admin dashboard use — unchanged)
router.put("/deliveries/:id/status", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const parsed = UpdateDeliveryStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const status = parsed.data.status;
  const updates: any = { status };
  if (status === "picked_up") updates.pickedUpAt = new Date();
  if (status === "delivered") updates.deliveredAt = new Date();
  if (status === "cancelled") updates.cancelledAt = new Date();

  const [delivery] = await db.update(deliveriesTable).set(updates).where(eq(deliveriesTable.id, id)).returning();
  if (!delivery) {
    res.status(404).json({ error: "Delivery not found" });
    return;
  }
  res.json(formatDelivery(delivery));
});

// ============================================================
// NEW: driver-app (delivery-app) routes — secured with requireDriverAuth,
// automatically scoped to the logged-in driver's own id/business from
// the JWT (not a client-supplied query param — can't see other drivers' deliveries)
// ============================================================

// GET /deliveries/my
router.get("/deliveries/my", requireDriverAuth, async (req, res): Promise<void> => {
  const { driverId, businessId } = (req as any).driver;
  const status = req.query.status as string | undefined;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = (page - 1) * limit;

  const conditions: any[] = [
    eq(deliveriesTable.businessId, businessId),
    eq(deliveriesTable.driverId, driverId),
  ];
  if (status) conditions.push(eq(deliveriesTable.status, status as any));

  const [deliveries, totalResult] = await Promise.all([
    db.select().from(deliveriesTable).where(and(...conditions)).limit(limit).offset(offset).orderBy(desc(deliveriesTable.createdAt)),
    db.select({ count: count() }).from(deliveriesTable).where(and(...conditions)),
  ]);

  res.json({
    data: deliveries.map(formatDelivery),
    total: Number(totalResult[0].count),
    page,
    limit,
  });
});

// PUT /deliveries/:id/my-status  (driver updates their own delivery's status)
router.put("/deliveries/:id/my-status", requireDriverAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { driverId } = (req as any).driver;
  const parsed = UpdateDeliveryStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // Ownership check — driver can only update deliveries assigned to them
  const [existing] = await db.select().from(deliveriesTable).where(eq(deliveriesTable.id, id));
  if (!existing || Number(existing.driverId) !== driverId) {
    res.status(404).json({ error: "Delivery not found" });
    return;
  }

  const status = parsed.data.status;
  const updates: any = { status };
  if (status === "picked_up") updates.pickedUpAt = new Date();
  if (status === "delivered") updates.deliveredAt = new Date();
  if (status === "cancelled") updates.cancelledAt = new Date();

  const [delivery] = await db.update(deliveriesTable).set(updates).where(eq(deliveriesTable.id, id)).returning();
  res.json(formatDelivery(delivery));
});

export default router;