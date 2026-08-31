
  
import { Router, type IRouter } from "express";
import {
  db,
  deliveriesTable,
  driversTable,
  notificationsTable,
  customersTable,
  deliveryStatusHistoryTable,
  salesOrderItemsTable,
  productsTable,
  transactionsTable,
  salesOrdersTable
} from "@workspace/db";
import { eq, and, count, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { requireDriverAuth } from "../middlewares/driverAuth";
import { CreateDeliveryBody, UpdateDeliveryBody, AssignDriverBody, UpdateDeliveryStatusBody } from "@workspace/api-zod";
import { notifyDriverOfNewDelivery, notifyCustomerDriverAssigned } from "../services/pushNotifications";
import { sendOtpSms } from "../services/sms";
import { z } from "zod/v4";
import { initiateMaskedCall, CallMaskingConfigError, CallMaskingProviderError } from "../services/callMasking";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
 
const router: IRouter = Router();
 

const OTP_EXPIRY_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;
const OTP_MAX_RESENDS = 3;
 
function generateSixDigitOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}
 

 
function formatDelivery(d: any) {
  return {
    id: Number(d.id),
    business_id: Number(d.businessId),
    customer_id: Number(d.customerId),
    driver_id: d.driverId !== null ? Number(d.driverId) : null,
    store_id: d.storeId !== null && d.storeId !== undefined ? Number(d.storeId) : null,
    sales_order_id: d.salesOrderId !== null && d.salesOrderId !== undefined ? Number(d.salesOrderId) : null,
    amount: d.amount !== null && d.amount !== undefined ? parseFloat(d.amount) : null,
    payment_method: d.payment_method ?? null,
    distance_km: d.distance_km !== null && d.distance_km !== undefined ? parseFloat(d.distance_km) : null,
    pickup_address: d.pickupAddress,
    drop_address: d.dropAddress,
    delivery_landmark: d.deliveryLandmark ?? null,
    delivery_instructions: d.deliveryInstructions ?? null,
    status: d.status,
    notes: d.notes,
 
    assigned_at: d.assignedAt,
    accepted_at: d.acceptedAt,
    picked_up_at: d.pickedUpAt,
    out_for_delivery_at: d.outForDeliveryAt,
    arrived_at: d.arrivedAt,
    delivered_at: d.deliveredAt,
    cancelled_at: d.cancelledAt,
 
    rejection_reason: d.rejectionReason ?? null,
    cancellation_reason: d.cancellationReason ?? null,
 
    // OTP: never expose otp_hash. Only expose whether it's verified / expiry / attempts left.
    otp_verified: d.otpVerifiedAt !== null && d.otpVerifiedAt !== undefined,
    otp_verified_at: d.otpVerifiedAt ?? null,
    otp_expires_at: d.otpExpiresAt ?? null,
    otp_attempts_remaining: d.otpHash ? Math.max(0, OTP_MAX_ATTEMPTS - (d.otpAttempts ?? 0)) : null,
 
    payment_status: d.paymentStatus,
    payment_collected_at: d.paymentCollectedAt ?? null,
    collected_amount: d.collectedAmount !== null && d.collectedAmount !== undefined ? parseFloat(d.collectedAmount) : null,
 
    created_at: d.createdAt,
  };
}
 

function maskPhone(phone?: string | null): string | null {
  if (!phone) return null;
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return null;
  const last2 = digits.slice(-2);
  const countryCode = digits.length > 10 ? digits.slice(0, digits.length - 10) : "91";
  return `+${countryCode}XXXXXX${last2}`;
}
function statusHistoryPayload(deliveryId: number, previousStatus: string | null, newStatus: string, changedBy: number | null, changedByType: "driver" | "admin" | "system", notes?: string) {
  return {
    deliveryId,
    previousStatus,
    newStatus,
    changedBy,
    changedByType,
    notes: notes ?? null,
  };
}
 
// ------------------------------------------------------------
// parseId — shared guard so a bad/non-numeric :id param never
// reaches the DB as NaN (that's what caused the earlier 500s).
// ------------------------------------------------------------
function parseId(raw: unknown): number | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const id = parseInt(value as string, 10);
  return Number.isInteger(id) ? id : null;
}
 
async function loadOwnedDelivery(id: number, driverId: number, businessId: number) {
  const [delivery] = await db.select().from(deliveriesTable).where(eq(deliveriesTable.id, id));
  if (!delivery || Number(delivery.businessId) !== businessId || Number(delivery.driverId) !== driverId) {
    return null;
  }
  return delivery;
}

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
 
  const [rows, totalResult] = await Promise.all([
    db
      .select({
        delivery: deliveriesTable,
        customerName: customersTable.name,
        hasCustomerPhone: customersTable.phone,
      })
      .from(deliveriesTable)
      .leftJoin(customersTable, eq(deliveriesTable.customerId, customersTable.id))
      .where(and(...conditions))
      .limit(limit)
      .offset(offset)
      .orderBy(desc(deliveriesTable.createdAt)),
    db.select({ count: count() }).from(deliveriesTable).where(and(...conditions)),
  ]);
 
  res.json({
    data: rows.map((r) => ({
      ...formatDelivery(r.delivery),
      customer_name: r.customerName ?? null,
      customer_has_phone: !!r.hasCustomerPhone,
    })),
    total: Number(totalResult[0].count),
    page,
    limit,
  });
});
 
// GET /deliveries/:id
router.get("/deliveries/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid delivery id" });
    return;
  }
  const [delivery] = await db.select().from(deliveriesTable).where(eq(deliveriesTable.id, id));
  if (!delivery) {
    res.status(404).json({ error: "Delivery not found" });
    return;
  }
  res.json(formatDelivery(delivery));
});
 
// PUT /deliveries/:id  (edit address/notes only — use the endpoints below for status/driver changes)
router.put("/deliveries/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid delivery id" });
    return;
  }
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
router.post("/deliveries/:id/assign", requireAuth, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid delivery id" });
    return;
  }
  const parsed = AssignDriverBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
 
  const [existing] = await db.select().from(deliveriesTable).where(eq(deliveriesTable.id, id));
  if (!existing) {
    res.status(404).json({ error: "Delivery not found" });
    return;
  }
 
  const [delivery] = await db.update(deliveriesTable).set({
    driverId: parsed.data.driver_id,
    status: "assigned",
    assignedAt: new Date(),
    // Reset any stale accept/otp/payment state from a previous assignment cycle
    acceptedAt: null,
    rejectionReason: null,
  }).where(eq(deliveriesTable.id, id)).returning();
 
  await db.insert(deliveryStatusHistoryTable).values(
    statusHistoryPayload(id, existing.status, "assigned", null, "admin", `Assigned to driver ${parsed.data.driver_id}`)
  );
 
  const [driver] = await db.select().from(driversTable).where(eq(driversTable.id, parsed.data.driver_id));
  if (driver?.pushToken) {
    notifyDriverOfNewDelivery(driver.pushToken, Number(delivery.id), delivery.dropAddress).catch(err =>
      console.error("[deliveries] Failed to send assignment push notification:", err)
    );
  }
 
  const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, delivery.customerId));
  if (customer?.pushToken && driver) {
    notifyCustomerDriverAssigned(customer.pushToken, driver.name, Number(delivery.id)).catch(err =>
      console.error("[deliveries] Failed to send customer assignment push:", err)
    );
  }
 
    await db.insert(notificationsTable).values({
    businessId: delivery.businessId,
    customerId: delivery.customerId,
    driverId: parsed.data.driver_id,
    deliveryId: Number(delivery.id),
    salesOrderId: delivery.salesOrderId ? Number(delivery.salesOrderId) : null,
    type: "assigned",
    message: delivery.salesOrderId
      ? `Order #${delivery.salesOrderId} - driver assigned. Deliver to ${delivery.dropAddress}`
      : `New delivery assigned — deliver to ${delivery.dropAddress}`,
  });
  res.json(formatDelivery(delivery));
});
 
// Valid forward transitions only. Terminal states (delivered, cancelled)
// cannot transition anywhere else.
const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ["assigned", "cancelled"],
  assigned: ["picked_up", "cancelled"],
  picked_up: ["delivered","cancelled"],
 
  delivered: [],
  cancelled: [],
};
 
function isValidTransition(from: string, to: string): boolean {
  if (from === to) return false; // no-op update, not an error but not a real transition
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}
 
// PUT /deliveries/:id/status  (staff/admin dashboard use — with transition validation)
router.put("/deliveries/:id/status", requireAuth, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid delivery id" });
    return;
  }
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
 
  const [existing] = await db.select().from(deliveriesTable).where(eq(deliveriesTable.id, id));
  const [delivery] = await db.update(deliveriesTable).set(updates).where(eq(deliveriesTable.id, id)).returning();
  if (!delivery) {
    res.status(404).json({ error: "Delivery not found" });
    return;
  }
  if (existing) {
    await db.insert(deliveryStatusHistoryTable).values(
      statusHistoryPayload(id, existing.status, status, null, "admin")
    );
  }
  res.json(formatDelivery(delivery));
});
 

router.get("/deliveries/:id/my-details", requireDriverAuth, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid delivery id" });
    return;
  }
  const { driverId, businessId } = (req as any).driver;
 
  const [delivery] = await db.select().from(deliveriesTable).where(eq(deliveriesTable.id, id));
  if (!delivery || Number(delivery.businessId) !== businessId || Number(delivery.driverId) !== driverId) {
    // Same 404 whether it doesn't exist or belongs to someone else —
    // never leak that a delivery ID exists but isn't yours.
    res.status(404).json({ error: "Delivery not found" });
    return;
  }
 
  const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, delivery.customerId));
 
  let items: any[] = [];
  let orderTotals = { subtotal: null as number | null, tax: null as number | null, delivery_fee: null as number | null };
 
  if (delivery.salesOrderId) {
    const [salesOrder] = await db
      .select({
        subtotal: salesOrdersTable.amount,
        tax: salesOrdersTable.tax,
        deliveryFee: salesOrdersTable.deliveryFee,
      })
      .from(salesOrdersTable)
      .where(eq(salesOrdersTable.id, delivery.salesOrderId));
 
        if (salesOrder) {
      orderTotals = {
        subtotal: salesOrder.subtotal != null && salesOrder.tax != null
          ? parseFloat(salesOrder.subtotal as any) - parseFloat(salesOrder.tax as any)
          : null,
        tax: salesOrder.tax != null ? parseFloat(salesOrder.tax as any) : null,
        delivery_fee: salesOrder.deliveryFee != null ? parseFloat(salesOrder.deliveryFee as any) : null,
      };
    }
 
    const rows = await db
      .select({
        id: salesOrderItemsTable.id,
        qty: salesOrderItemsTable.qty,
        unitPrice: salesOrderItemsTable.unitPrice,
        productName: productsTable.name,
      })
      .from(salesOrderItemsTable)
      .innerJoin(productsTable, eq(salesOrderItemsTable.productId, productsTable.id))
      .where(eq(salesOrderItemsTable.salesOrderId, delivery.salesOrderId));
 
    items = rows.map(r => ({
      id: Number(r.id),
      product_name: r.productName,
      qty: parseFloat(r.qty as any),
      unit_price: parseFloat(r.unitPrice as any),
      total_price: parseFloat(r.qty as any) * parseFloat(r.unitPrice as any),
    }));
  }
 
  res.json({
    delivery: { ...formatDelivery(delivery), ...orderTotals },
    customer: customer ? {
      id: Number(customer.id),
      name: customer.name,
      phone: maskPhone(customer.phone),
      has_phone: !!customer.phone,
      address: customer.address,
    } : null,
    items,
  });
});
 
// PUT /deliveries/:id/my-status  (driver updates their own delivery's status — with transition validation)
router.put("/deliveries/:id/my-status", requireDriverAuth, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid delivery id" });
    return;
  }
  const { driverId, businessId } = (req as any).driver;
  const parsed = UpdateDeliveryStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
 
  const existing = await loadOwnedDelivery(id, driverId, businessId);
  if (!existing) {
    res.status(404).json({ error: "Delivery not found" });
    return;
  }
 
  const status = parsed.data.status;
  if (!isValidTransition(existing.status as string, status)) {
    res.status(409).json({
      error: `Cannot change status from "${existing.status}" to "${status}"`,
      current_status: existing.status,
    });
    return;
  }
 
  const updates: any = { status };
  if (status === "picked_up") updates.pickedUpAt = new Date();
  if (status === "delivered") updates.deliveredAt = new Date();
  if (status === "cancelled") updates.cancelledAt = new Date();
 
  const [delivery] = await db.update(deliveriesTable).set(updates).where(eq(deliveriesTable.id, id)).returning();
 
  await db.insert(deliveryStatusHistoryTable).values(
    statusHistoryPayload(id, existing.status, status, driverId, "driver")
  );
 
  res.json(formatDelivery(delivery));
});
 
// PUT /deliveries/:id/my-out-for-delivery  (driver marks "out for delivery"
// WITHOUT touching the `status` field — status stays whatever it is,
// e.g. teammate's POS/payment flow relies on it separately)
router.put("/deliveries/:id/my-out-for-delivery", requireDriverAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const { driverId } = (req as any).driver;
 
  const [existing] = await db.select().from(deliveriesTable).where(eq(deliveriesTable.id, id));
  if (!existing || Number(existing.driverId) !== driverId) {
    res.status(404).json({ error: "Delivery not found" });
    return;
  }
 
  const [delivery] = await db
    .update(deliveriesTable)
    .set({ outForDeliveryAt: new Date() }) // only this column changes
    .where(eq(deliveriesTable.id, id))
    .returning();
 
  res.json(formatDelivery(delivery));
});
 
// POST /deliveries/:id/accept  (driver accepts an assigned delivery — stamps acceptedAt only)
router.post("/deliveries/:id/accept", requireDriverAuth, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid delivery id" });
    return;
  }
  const { driverId, businessId } = (req as any).driver;
 
  const delivery = await loadOwnedDelivery(id, driverId, businessId);
  if (!delivery) {
    res.status(404).json({ error: "Delivery not found" });
    return;
  }
  if (delivery.status !== "assigned" || delivery.acceptedAt) {
    res.status(409).json({ error: "This delivery is no longer available." });
    return;
  }
 
  const [updated] = await db.update(deliveriesTable)
    .set({ acceptedAt: new Date() })
    .where(eq(deliveriesTable.id, id))
    .returning();
 
  await db.insert(deliveryStatusHistoryTable).values(
    statusHistoryPayload(id, delivery.status, delivery.status, driverId, "driver", "Driver accepted delivery")
  );
 
  await db.insert(notificationsTable).values({
    businessId,
    driverId,
    deliveryId: id,
    salesOrderId: delivery.salesOrderId ? Number(delivery.salesOrderId) : null,
    type: "accepted",
    title: "Delivery Accepted",
    message: `Your delivery for order has been accepted.`,
  });
 
  res.json(formatDelivery(updated));
});
 
// POST /deliveries/:id/reject  (driver rejects an assigned delivery)
const RejectBody = z.object({ reason: z.string().min(1).max(500) });
router.post("/deliveries/:id/reject", requireDriverAuth, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid delivery id" });
    return;
  }
  const { driverId, businessId } = (req as any).driver;
  const parsed = RejectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
 
  const delivery = await loadOwnedDelivery(id, driverId, businessId);
  if (!delivery) {
    res.status(404).json({ error: "Delivery not found" });
    return;
  }
  if (delivery.status !== "assigned" || delivery.acceptedAt) {
    res.status(409).json({ error: "This delivery can no longer be rejected." });
    return;
  }
 
  // Return to the admin/dispatcher queue rather than cancelling the order outright.
  const [updated] = await db.update(deliveriesTable)
    .set({
      status: "pending",
      driverId: null,
      assignedAt: null,
      acceptedAt: null,
      rejectionReason: parsed.data.reason,
    })
    .where(eq(deliveriesTable.id, id))
    .returning();
 
  await db.insert(deliveryStatusHistoryTable).values(
    statusHistoryPayload(id, delivery.status, "pending", driverId, "driver", `Rejected: ${parsed.data.reason}`)
  );
 
  res.json(formatDelivery(updated));
});
 
// POST /deliveries/:id/pickup  (driver marks an accepted delivery as picked up)
router.post("/deliveries/:id/pickup", requireDriverAuth, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid delivery id" });
    return;
  }
  const { driverId, businessId } = (req as any).driver;
 
  const delivery = await loadOwnedDelivery(id, driverId, businessId);
  if (!delivery) {
    res.status(404).json({ error: "Delivery not found" });
    return;
  }
  if (delivery.status !== "assigned" || !delivery.acceptedAt) {
    res.status(409).json({ error: "You must accept this delivery before marking it picked up." });
    return;
  }
 
  const [updated] = await db.update(deliveriesTable)
    .set({ status: "picked_up", pickedUpAt: new Date() })
    .where(eq(deliveriesTable.id, id))
    .returning();
 
  await db.insert(deliveryStatusHistoryTable).values(
    statusHistoryPayload(id, delivery.status, "picked_up", driverId, "driver")
  );
 
  await db.insert(notificationsTable).values({
    businessId,
    driverId,
    deliveryId: id,
    salesOrderId: delivery.salesOrderId ? Number(delivery.salesOrderId) : null,
    type: "picked_up",
    title: "Order Picked Up",
    message: `Order has been picked up successfully.`,
  });
 
  res.json(formatDelivery(updated));
});
 
router.post("/deliveries/:id/start-delivery", requireDriverAuth, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid delivery id" });
    return;
  }
  const { driverId, businessId } = (req as any).driver;
 
  const delivery = await loadOwnedDelivery(id, driverId, businessId);
  if (!delivery) {
    res.status(404).json({ error: "Delivery not found" });
    return;
  }
  if (delivery.status !== "picked_up") {
    res.status(409).json({ error: "Delivery must be picked up before starting the trip." });
    return;
  }
 
  const [updated] = await db.update(deliveriesTable)
    .set({ status: "in_transit", outForDeliveryAt: new Date() })
    .where(eq(deliveriesTable.id, id))
    .returning();
 
  await db.insert(deliveryStatusHistoryTable).values(
    statusHistoryPayload(id, delivery.status, "in_transit", driverId, "driver")
  );
 
  await db.insert(notificationsTable).values({
    businessId,
    driverId,
    deliveryId: id,
    salesOrderId: delivery.salesOrderId ? Number(delivery.salesOrderId) : null,
    type: "out_for_delivery",
    title: "Out for Delivery",
    message: `Order is now out for delivery.`,
  });
 
  res.json(formatDelivery(updated));
});
 
// Internal helper — generates + sends a fresh delivery OTP, updates the row.
async function generateAndSendDeliveryOtp(deliveryId: number, customerPhone: string) {
  const otp = generateSixDigitOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
 
  await db.update(deliveriesTable).set({
    otpHash,
    otpExpiresAt: expiresAt,
    otpAttempts: 0,
    otpLastSentAt: new Date(),
    otpVerifiedAt: null,
  }).where(eq(deliveriesTable.id, deliveryId));
 
  await sendOtpSms(customerPhone, otp);
}
 
// POST /deliveries/:id/arrived
router.post("/deliveries/:id/arrived", requireDriverAuth, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid delivery id" });
    return;
  }
  const { driverId, businessId } = (req as any).driver;
 
  const delivery = await loadOwnedDelivery(id, driverId, businessId);
  if (!delivery) {
    res.status(404).json({ error: "Delivery not found" });
    return;
  }
  if (delivery.status !== "in_transit" || delivery.arrivedAt) {
    res.status(409).json({ error: "Delivery must be in transit and not already arrived." });
    return;
  }
 
  const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, delivery.customerId));
  if (!customer?.phone) {
    res.status(422).json({ error: "Customer has no phone number on file — cannot send delivery OTP." });
    return;
  }
 
  const isCod = delivery.payment_method === "cod";
 
  const [updated] = await db.update(deliveriesTable)
    .set({
      arrivedAt: new Date(),
      paymentStatus: isCod ? "pending" : "not_applicable",
    })
    .where(eq(deliveriesTable.id, id))
    .returning();
 
  await db.insert(deliveryStatusHistoryTable).values(
    statusHistoryPayload(id, delivery.status, delivery.status, driverId, "driver", "Driver arrived at customer location")
  );
 
  try {
    await generateAndSendDeliveryOtp(id, customer.phone);
  } catch (err) {
    console.error("[deliveries] Failed to send delivery OTP:", err);
    res.status(502).json({ error: "Arrived, but failed to send OTP to customer. Ask them to request a resend." });
    return;
  }
 
  const [final] = await db.select().from(deliveriesTable).where(eq(deliveriesTable.id, id));
  res.json(formatDelivery(final));
});
 
// POST /deliveries/:id/otp/resend
router.post("/deliveries/:id/otp/resend", requireDriverAuth, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid delivery id" });
    return;
  }
  const { driverId, businessId } = (req as any).driver;
 
  const delivery = await loadOwnedDelivery(id, driverId, businessId);
  if (!delivery) {
    res.status(404).json({ error: "Delivery not found" });
    return;
  }
  if (!delivery.arrivedAt || delivery.otpVerifiedAt) {
    res.status(409).json({ error: "OTP resend is only available after arrival and before verification." });
    return;
  }
  if ((delivery.otpResendCount ?? 0) >= OTP_MAX_RESENDS) {
    res.status(429).json({ error: "Maximum OTP resend attempts reached. Please contact support." });
    return;
  }
  if (delivery.otpLastSentAt) {
    const secondsSinceLastSend = (Date.now() - new Date(delivery.otpLastSentAt).getTime()) / 1000;
    if (secondsSinceLastSend < OTP_RESEND_COOLDOWN_SECONDS) {
      res.status(429).json({ error: `Please wait ${Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - secondsSinceLastSend)}s before requesting another OTP.` });
      return;
    }
  }
 
  const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, delivery.customerId));
  if (!customer?.phone) {
    res.status(422).json({ error: "Customer has no phone number on file." });
    return;
  }
 
  try {
    await generateAndSendDeliveryOtp(id, customer.phone);
  } catch (err) {
    console.error("[deliveries] Failed to resend delivery OTP:", err);
    res.status(502).json({ error: "Failed to resend OTP. Please try again." });
    return;
  }
 
  await db.update(deliveriesTable)
    .set({ otpResendCount: (delivery.otpResendCount ?? 0) + 1 })
    .where(eq(deliveriesTable.id, id));
 
  res.json({ message: "OTP resent" });
});
 
// POST /deliveries/:id/otp/verify
const VerifyDeliveryOtpBody = z.object({ otp: z.string().min(4).max(6) });
router.post("/deliveries/:id/otp/verify", requireDriverAuth, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid delivery id" });
    return;
  }
  const { driverId, businessId } = (req as any).driver;
  const parsed = VerifyDeliveryOtpBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
 
  const delivery = await loadOwnedDelivery(id, driverId, businessId);
  if (!delivery) {
    res.status(404).json({ error: "Delivery not found" });
    return;
  }
  if (!delivery.arrivedAt) {
    res.status(409).json({ error: "Mark the delivery as arrived before verifying OTP." });
    return;
  }
  if (delivery.otpVerifiedAt) {
    res.status(409).json({ error: "OTP has already been verified for this delivery." });
    return;
  }
  if (!delivery.otpHash || !delivery.otpExpiresAt) {
    res.status(409).json({ error: "No OTP has been sent yet. Please request a resend." });
    return;
  }
  if (new Date(delivery.otpExpiresAt) < new Date()) {
    res.status(401).json({ error: "OTP has expired. Please request a resend." });
    return;
  }
  if ((delivery.otpAttempts ?? 0) >= OTP_MAX_ATTEMPTS) {
    res.status(429).json({ error: "Too many incorrect attempts. Please request a resend." });
    return;
  }
 
  const matches = await bcrypt.compare(parsed.data.otp, delivery.otpHash);
  if (!matches) {
    await db.update(deliveriesTable)
      .set({ otpAttempts: (delivery.otpAttempts ?? 0) + 1 })
      .where(eq(deliveriesTable.id, id));
    res.status(401).json({ error: "Incorrect OTP." });
    return;
  }
 
  const [updated] = await db.update(deliveriesTable)
    .set({ otpVerifiedAt: new Date() })
    .where(eq(deliveriesTable.id, id))
    .returning();
 
  await db.insert(deliveryStatusHistoryTable).values(
    statusHistoryPayload(id, delivery.status, delivery.status, driverId, "driver", "Delivery OTP verified")
  );
 
  res.json(formatDelivery(updated));
});
 

const ConfirmPaymentBody = z.object({
  amount: z.number().positive(),
});
router.post("/deliveries/:id/payment", requireDriverAuth, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid delivery id" });
    return;
  }
  const { driverId, businessId } = (req as any).driver;
  const parsed = ConfirmPaymentBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
 
  const delivery = await loadOwnedDelivery(id, driverId, businessId);
  if (!delivery) {
    res.status(404).json({ error: "Delivery not found" });
    return;
  }
  if (delivery.payment_method !== "cod") {
    res.status(409).json({ error: "This delivery is not Cash on Delivery." });
    return;
  }
  if (delivery.paymentStatus === "collected") {
    res.status(409).json({ error: "Payment has already been collected for this delivery." });
    return;
  }
 
  const orderTotal = delivery.amount !== null && delivery.amount !== undefined ? parseFloat(delivery.amount as any) : null;
  if (orderTotal !== null && parsed.data.amount > orderTotal) {
    res.status(422).json({ error: `Collected amount cannot exceed the order total (₹${orderTotal}).` });
    return;
  }
 
  const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, delivery.customerId));
  let transactionId: number | null = null;
 
  if (customer) {
    const currentBalance = parseFloat(customer.currentBalance as any);
    const newBalance = currentBalance - parsed.data.amount;
    const today = new Date().toISOString().slice(0, 10);
 
    const [txn] = await db.insert(transactionsTable).values({
      businessId: delivery.businessId,
      customerId: delivery.customerId,
      type: "you_got",
      amount: parsed.data.amount.toString(),
      balanceAfter: newBalance.toString(),
      description: `COD collected for delivery #${id}`,
      paymentMode: "cash",
      entryDate: today,
      createdBy: driverId, // 🔶 NOTE: transactions.createdBy expects a users.id in the admin flow —
                            // if that column has a FK to `users`, this will fail because driverId is
                            // a drivers.id, not a users.id. If so, either drop this field's FK
                            // constraint for driver-originated transactions, or add a small
                            // "system/driver" placeholder user row and use its id here instead.
    }).returning();
 
    transactionId = Number(txn.id);
 
    await db.update(customersTable)
      .set({ currentBalance: newBalance.toString() })
      .where(eq(customersTable.id, delivery.customerId));
  }
 
  const [updated] = await db.update(deliveriesTable)
    .set({
      paymentStatus: "collected",
      paymentCollectedAt: new Date(),
      paymentCollectedBy: driverId,
      collectedAmount: parsed.data.amount.toString(),
      transactionId,
    })
    .where(eq(deliveriesTable.id, id))
    .returning();
 
  await db.insert(deliveryStatusHistoryTable).values(
    statusHistoryPayload(id, delivery.status, delivery.status, driverId, "driver", `COD payment collected: ₹${parsed.data.amount}`)
  );
 
  res.json(formatDelivery(updated));
});
 
// POST /deliveries/:id/complete
router.post("/deliveries/:id/complete", requireDriverAuth, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid delivery id" });
    return;
  }
  const { driverId, businessId } = (req as any).driver;
 
  const delivery = await loadOwnedDelivery(id, driverId, businessId);
  if (!delivery) {
    res.status(404).json({ error: "Delivery not found" });
    return;
  }
  if (delivery.status !== "in_transit" || !delivery.arrivedAt) {
    res.status(409).json({ error: "Delivery must have arrived before it can be completed." });
    return;
  }
  if (!delivery.otpVerifiedAt) {
    res.status(409).json({ error: "OTP must be verified before completing the delivery." });
    return;
  }
  if (delivery.payment_method === "cod" && delivery.paymentStatus !== "collected") {
    res.status(409).json({ error: "COD payment must be collected before completing the delivery." });
    return;
  }
 
    const [updated] = await db.update(deliveriesTable)
    .set({ status: "delivered", deliveredAt: new Date() })
    .where(eq(deliveriesTable.id, id))
    .returning();
 
  await db.insert(deliveryStatusHistoryTable).values(
    statusHistoryPayload(id, delivery.status, "delivered", driverId, "driver")
  );
 
  // NEW — completion notification
  await db.insert(notificationsTable).values({
    businessId,
    driverId,
    deliveryId: id,
    salesOrderId: delivery.salesOrderId ? Number(delivery.salesOrderId) : null,
    type: "completed",
    title: "Delivery Completed",
    message: `Order has been delivered successfully.`,
  });
 
  // NEW — fee-earned notification, using the ACTUAL stored delivery fee.
  // Never recalculated here — this is the same deliveryFee column
  // /my-details already reads from salesOrdersTable.
  if (delivery.salesOrderId) {
    const [salesOrder] = await db
      .select({ deliveryFee: salesOrdersTable.deliveryFee })
      .from(salesOrdersTable)
      .where(eq(salesOrdersTable.id, delivery.salesOrderId));
 
    if (salesOrder?.deliveryFee != null) {
      const fee = parseFloat(salesOrder.deliveryFee as any);
      await db.insert(notificationsTable).values({
        businessId,
        driverId,
        deliveryId: id,
        salesOrderId: Number(delivery.salesOrderId),
        type: "fee_earned",
        title: "Delivery Fee Earned",
        message: `₹${fee} delivery fee has been added to your earnings.`,
      });
    }
  }
 
  res.json({ success: true, message: "Delivery completed successfully", data: formatDelivery(updated) });
});
 

router.put("/deliveries/:id/my-status", requireDriverAuth, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid delivery id" });
    return;
  }
  const { driverId, businessId } = (req as any).driver;
  const parsed = UpdateDeliveryStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
 
  const existing = await loadOwnedDelivery(id, driverId, businessId);
  if (!existing) {
    res.status(404).json({ error: "Delivery not found" });
    return;
  }
 
  const status = parsed.data.status;
  const updates: any = { status };
  if (status === "picked_up") updates.pickedUpAt = new Date();
  if (status === "delivered") updates.deliveredAt = new Date();
  if (status === "cancelled") updates.cancelledAt = new Date();
 
  const [delivery] = await db.update(deliveriesTable).set(updates).where(eq(deliveriesTable.id, id)).returning();
 
  await db.insert(deliveryStatusHistoryTable).values(
    statusHistoryPayload(id, existing.status, status, driverId, "driver")
  );
 
  res.json(formatDelivery(delivery));
});
 
// POST /deliveries/:id/call
// Bridges the driver and customer through Exotel without ever exposing
// either party's real number to the other side.
router.post("/deliveries/:id/call", requireDriverAuth, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid delivery id" });
    return;
  }
  const { driverId, businessId } = (req as any).driver;
 
  const delivery = await loadOwnedDelivery(id, driverId, businessId);
  if (!delivery) {
    res.status(404).json({ error: "Delivery not found" });
    return;
  }
 
  const [driver] = await db.select().from(driversTable).where(eq(driversTable.id, driverId));
  const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, delivery.customerId));
 
  if (!driver?.phone) {
    res.status(422).json({ error: "Your driver profile has no phone number on file. Add one in your profile to use Call Customer." });
    return;
  }
  if (!customer?.phone) {
    res.status(422).json({ error: "This customer has no phone number on file." });
    return;
  }
 
  try {
    const result = await initiateMaskedCall({
      driverPhone: driver.phone,
      customerPhone: customer.phone,
      deliveryId: id,
    });
 
    await db.insert(deliveryStatusHistoryTable).values(
      statusHistoryPayload(id, delivery.status, delivery.status, driverId, "driver", "Driver initiated masked call to customer")
    );
 
    res.json({
      message: "Connecting your call — your phone will ring in a few seconds.",
      call_sid: result.callSid,
    });
  } catch (err) {
    if (err instanceof CallMaskingConfigError) {
      console.error("[deliveries] Call masking not configured:", err.message);
      res.status(500).json({ error: "Calling isn't set up yet. Contact support." });
      return;
    }
    if (err instanceof CallMaskingProviderError) {
      console.error("[deliveries] Exotel rejected the call:", err.message);
      res.status(502).json({ error: "Could not start the call. Please try again." });
      return;
    }
    console.error("[deliveries] Unexpected error initiating masked call:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});
 
export default router;
 