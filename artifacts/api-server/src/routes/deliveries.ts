
 
import { Router, type IRouter } from "express";
import { db, deliveriesTable, driversTable, notificationsTable, customersTable,salesOrdersTable, deliveryStatusHistoryTable,   salesOrderItemsTable,  productsTable,} from "@workspace/db";
import { eq, and, count, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { requireDriverAuth } from "../middlewares/driverAuth";
import { CreateDeliveryBody, UpdateDeliveryBody, AssignDriverBody, UpdateDeliveryStatusBody } from "@workspace/api-zod";
import { notifyDriverOfNewDelivery, notifyCustomerDriverAssigned } from "../services/pushNotifications";
import { sendOtpSms } from "../services/sms";
import { z } from "zod/v4";
import { initiateMaskedCall, CallMaskingConfigError, CallMaskingProviderError } from "../services/callMasking";
import crypto from "node:crypto";
const router: IRouter = Router();
 
// ============================================================
// OTP / payment config
// ============================================================
const OTP_EXPIRY_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;
const OTP_RESEND_COOLDOWN_SECONDS = 60;
const OTP_MAX_RESENDS = 3;
 
function generateSixDigitOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}
 
// ============================================================
// Formatters
// ============================================================
 
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
 
// ------------------------------------------------------------
// maskPhone — hides all but the last 2 digits of a customer's
// number so drivers never see the real number in the UI.
// Calling still works via the Exotel masked-call endpoint.
// ------------------------------------------------------------
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
 
// ============================================================
// driver-app (delivery-app) routes — secured with requireDriverAuth
//
// ⚠️ IMPORTANT: static routes like "/deliveries/my" MUST be registered
// BEFORE any "/deliveries/:id" route. Express matches routes top-to-bottom,
// so if a "/deliveries/:id" route is registered first, a request to
// "/deliveries/my" gets caught by it and "my" gets parsed as the id
// (parseInt("my") -> NaN), which then blows up the DB query. This block
// used to live further down the file, after the admin :id routes — that
// was the bug. Keep it here, above GET /deliveries/:id.
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
 
  const [existing] = await db.select().from(deliveriesTable).where(eq(deliveriesTable.id, id));
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
  res.json(formatDelivery(delivery));
});
 
// GET /deliveries/:id/my-details
// Full driver-facing view: delivery + customer contact + order items.
// This is the endpoint the Order Details screen should call.
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
 
export default router;
 