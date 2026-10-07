import { Router, type IRouter } from "express";
import { db, customersTable, salesOrdersTable, deliveriesTable, driversTable, businessesTable, salesOrderItemsTable, productsTable, orderReturnsTable } from "@workspace/db";
import { eq, and, or, ilike, count, desc, inArray } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import {
  CreateCustomerBody,
  UpdateCustomerBody,
  GetCustomerParams,
  UpdateCustomerParams,
  DeleteCustomerParams,
} from "@workspace/api-zod";
import { requireCustomerAuth } from "../middlewares/customerAuth";
import { createOrderCancelledNotification } from "../services/adminNotifications.service";

const router: IRouter = Router();

// ── Cancel / Return rules ────────────────────────────────────────────────
const CANCEL_WINDOW_MS = 24 * 60 * 60 * 1000; // customer can cancel only within 1 day of placing
const RETURN_WINDOW_MS = 2 * 24 * 60 * 60 * 1000; // keep same as RETURN_WINDOW_MS in OrdersScreen.tsx
const RETURN_REASONS = ["EXPIRED_PRODUCT", "WRONG_PRODUCT", "DAMAGED", "MISSING_ITEM", "OTHER"];

function formatCustomer(c: any) {
  return {
    id: Number(c.id),
    business_id: Number(c.businessId),
    name: c.name,
    phone: c.phone,
    email: c.email,
    address: c.address,
    opening_balance: parseFloat(c.openingBalance ?? "0"),
    opening_balance_type: c.openingBalanceType,
    current_balance: parseFloat(c.currentBalance ?? "0"),
    category: c.category,
    profile_image: c.profileImage,
    created_at: c.createdAt,
  };
}

// GET /customers
router.get("/customers", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = (page - 1) * limit;
  const search = req.query.search as string | undefined;
  const category = req.query.category as string | undefined;

  const conditions: any[] = [eq(customersTable.businessId, businessId), eq(customersTable.isDeleted, false)];
  if (search) {
    conditions.push(
      or(
        ilike(customersTable.name, `%${search}%`),
        ilike(customersTable.phone, `%${search}%`),
      ),
    );
  }
  if (category) conditions.push(eq(customersTable.category, category as any));

  const [customers, totalResult] = await Promise.all([
    db.select().from(customersTable).where(and(...conditions)).limit(limit).offset(offset).orderBy(desc(customersTable.createdAt)),
    db.select({ count: count() }).from(customersTable).where(and(...conditions)),
  ]);

  res.json({
    data: customers.map(formatCustomer),
    total: Number(totalResult[0].count),
    page,
    limit,
  });
});

// POST /customers
router.post("/customers", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateCustomerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;

  // ---- Opening balance sign fix ----
  // opening_balance is always stored as the positive magnitude the user
  // entered (for display: "Opening balance: ₹500, type: debit"). But the
  // ledger balance (current_balance) must carry the correct sign so it's
  // consistent with how transactions.ts adjusts it later:
  //   type "you_gave" (credit sale)      -> current_balance INCREASES
  //   type "you_got"  (payment received) -> current_balance DECREASES
  // Same convention applies to opening balance:
  //   "credit" -> customer owes the shop      -> current_balance = +amount
  //   "debit"  -> shop owes the customer       -> current_balance = -amount
  const openingBalanceType = (d.opening_balance_type ?? "credit") as string;
  const openingBalanceRaw = d.opening_balance ?? 0;
  const signedOpeningBalance = openingBalanceType === "debit" ? -openingBalanceRaw : openingBalanceRaw;

  const [customer] = await db.insert(customersTable).values({
    businessId: d.business_id,
    name: d.name,
    phone: d.phone,
    email: d.email,
    address: d.address,
    openingBalance: openingBalanceRaw.toString(),
    openingBalanceType: openingBalanceType as any,
    currentBalance: signedOpeningBalance.toString(),
    category: (d.category ?? "customer") as any,
  }).returning();
  res.status(201).json(formatCustomer(customer));
});

// GET /customers/:id
router.get("/customers/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [customer] = await db.select().from(customersTable)
    .where(and(eq(customersTable.id, id), eq(customersTable.isDeleted, false)));
  if (!customer) {
    res.status(404).json({ error: "Customer not found" });
    return;
  }
  res.json(formatCustomer(customer));
});

// PUT /customers/:id
router.put("/customers/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const parsed = UpdateCustomerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updates: any = {};
  if (parsed.data.name) updates.name = parsed.data.name;
  if (parsed.data.phone) updates.phone = parsed.data.phone;
  if (parsed.data.email !== undefined) updates.email = parsed.data.email;
  if (parsed.data.address !== undefined) updates.address = parsed.data.address;
  if (parsed.data.category) updates.category = parsed.data.category;

  const [customer] = await db.update(customersTable).set(updates)
    .where(and(eq(customersTable.id, id), eq(customersTable.isDeleted, false))).returning();
  if (!customer) {
    res.status(404).json({ error: "Customer not found" });
    return;
  }
  res.json(formatCustomer(customer));
});

// DELETE /customers/:id
router.delete("/customers/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [customer] = await db.update(customersTable).set({ isDeleted: true })
    .where(eq(customersTable.id, id)).returning();
  if (!customer) {
    res.status(404).json({ error: "Customer not found" });
    return;
  }
  res.json({ message: "Customer deleted" });
});

// PUT /customers/me/push-token  (customer app calls this after login/permission grant)
router.put("/customers/me/push-token", requireCustomerAuth, async (req, res): Promise<void> => {
  const { customerId } = (req as any).customer;
  const { push_token } = req.body;
  if (!push_token || typeof push_token !== "string") {
    res.status(400).json({ error: "push_token is required" });
    return;
  }
  await db.update(customersTable).set({ pushToken: push_token }).where(eq(customersTable.id, customerId));
  res.json({ success: true });
});

const CUSTOMER_TRACKING_STEPS = [
  "ORDER_PLACED",
  "ORDER_CONFIRMED",
  "DRIVER_ASSIGNED",
  "PICKED_UP",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const;

function mapToCustomerStatus(
  salesOrderStatus: string,
  deliveryStatus?: string | null,
  outForDeliveryAt?: Date | string | null,
): string {
  if (deliveryStatus && deliveryStatus !== "pending") {
    switch (deliveryStatus) {
      case "assigned": return "DRIVER_ASSIGNED";
      case "picked_up":
        // Once the driver marks "out for delivery" (our own flag),
        // show that stage even though `status` is still "picked_up".
        return outForDeliveryAt ? "OUT_FOR_DELIVERY" : "PICKED_UP";
      case "in_transit": return "OUT_FOR_DELIVERY";
      case "delivered": return "DELIVERED";
      case "cancelled": return "CANCELLED";
    }
  }
  // 🔶 CHANGED — any admin-confirmed stage now shows as ORDER_CONFIRMED
  // (previously only "invoiced"), so the app hides the Cancel button
  // as soon as the admin confirms the order.
  if (
    salesOrderStatus === "invoiced" ||
    salesOrderStatus === "confirmed" ||
    salesOrderStatus === "packed" ||
    salesOrderStatus === "shipped"
  ) {
    return "ORDER_CONFIRMED";
  }
  if (salesOrderStatus === "cancelled") return "CANCELLED";
  return "ORDER_PLACED";
}

// 🔶 NEW — fetch return requests for a set of orders in one query
async function getReturnsByOrder(orderIds: number[]): Promise<Map<number, any>> {
  if (!orderIds.length) return new Map();
  const rows = await db
    .select()
    .from(orderReturnsTable)
    .where(inArray(orderReturnsTable.salesOrderId, orderIds));
  return new Map(
    rows.map((r: any) => [
      Number(r.salesOrderId),
      { id: Number(r.id), status: r.status, reason: r.reason, items: r.items ?? [] },
    ]),
  );
}

function formatCustomerOrder(
  order: any,
  delivery: any | null,
  driver: any | null,
  businessName?: string | null,
  items?: any[],
  returnRequest?: any | null, // 🔶 NEW
) {
  const trackingStatus = mapToCustomerStatus(
    order.status, delivery?.status ?? null,
    delivery?.outForDeliveryAt ?? null,
  );
  return {
    id: Number(order.id),
    business_id: Number(order.businessId),
    business_name: businessName ?? null,
    customer_id: Number(order.customerId),
    amount: parseFloat(order.amount ?? "0"),
    tax: parseFloat(order.tax ?? "0"),
    discount: parseFloat(order.discount ?? "0"),
    promo_code: order.promoCode ?? null,
    delivery_fee:
      order.deliveryFee !== null && order.deliveryFee !== undefined
        ? parseFloat(order.deliveryFee)
        : null,
    delivery_distance_km:
      order.deliveryDistanceKm !== null && order.deliveryDistanceKm !== undefined
        ? parseFloat(order.deliveryDistanceKm)
        : null,
    entry_date: order.entryDate,
    created_at: order.createdAt,
    sales_order_status: order.status,
    delivery_status: delivery?.status ?? null,
    tracking_status: trackingStatus,
    tracking_steps: CUSTOMER_TRACKING_STEPS,
    items: items ?? [],
    return_request: returnRequest ?? null, // 🔶 NEW
    delivery: delivery
      ? {
          id: Number(delivery.id),
          driver_id: delivery.driverId !== null ? Number(delivery.driverId) : null,
          driver_name: driver?.name ?? null,
          driver_phone: driver?.phone ?? null,
          pickup_address: delivery.pickupAddress,
          drop_address: delivery.dropAddress,
          assigned_at: delivery.assignedAt,
          picked_up_at: delivery.pickedUpAt,
          delivered_at: delivery.deliveredAt,
        }
      : null,
  };
}

// GET /customers/me/orders — customer's own order list (tracking summary)
router.get("/customers/me/orders", requireCustomerAuth, async (req, res): Promise<void> => {
  const { customerId } = (req as any).customer;

  const orders = await db
    .select()
    .from(salesOrdersTable)
    .where(and(eq(salesOrdersTable.customerId, customerId), eq(salesOrdersTable.isDeleted, false)))
    .orderBy(desc(salesOrdersTable.id));
  const orderIds = orders.map((o: any) => Number(o.id));

  const deliveries = orderIds.length
    ? await db.select().from(deliveriesTable).where(inArray(deliveriesTable.salesOrderId, orderIds))
    : [];
  const deliveryByOrder = new Map(deliveries.map((d: any) => [Number(d.salesOrderId), d]));

  const driverIds = [...new Set(deliveries.map((d: any) => d.driverId).filter((id: any) => id !== null))];
  const drivers = driverIds.length
    ? await db.select().from(driversTable).where(inArray(driversTable.id, driverIds as number[]))
    : [];
  const driverById = new Map(drivers.map((d: any) => [Number(d.id), d]));

  // business names for all orders in one query
  const businessIds = [...new Set(orders.map((o: any) => Number(o.businessId)))];
  const businesses = businessIds.length
    ? await db.select({ id: businessesTable.id, businessName: businessesTable.businessName }).from(businessesTable).where(inArray(businessesTable.id, businessIds))
    : [];
  const businessNameById = new Map(businesses.map((b: any) => [Number(b.id), b.businessName]));

  // 🔶 NEW — return requests for all orders in one query
  const returnByOrder = await getReturnsByOrder(orderIds);

  res.json({
    data: orders.map((o: any) => {
      const delivery = deliveryByOrder.get(Number(o.id)) ?? null;
      const driver = delivery?.driverId ? driverById.get(Number(delivery.driverId)) ?? null : null;
      const businessName = businessNameById.get(Number(o.businessId)) ?? null;
      return formatCustomerOrder(
        o,
        delivery,
        driver,
        businessName,
        undefined,
        returnByOrder.get(Number(o.id)) ?? null, // 🔶 NEW
      );
    }),
  });
});

// GET /customers/me/orders/:id/tracking — single order tracking detail
router.get("/customers/me/orders/:id/tracking", requireCustomerAuth, async (req, res): Promise<void> => {
  const { customerId } = (req as any).customer;
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const orderId = parseInt(raw, 10);
  if (isNaN(orderId)) {
    res.status(400).json({ error: "Invalid order id" });
    return;
  }

  const [order] = await db
    .select()
    .from(salesOrdersTable)
    .where(
      and(
        eq(salesOrdersTable.id, orderId),
        eq(salesOrdersTable.customerId, customerId),
        eq(salesOrdersTable.isDeleted, false),
      ),
    );

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const [delivery] = await db.select().from(deliveriesTable).where(eq(deliveriesTable.salesOrderId, orderId));
  let driver = null;
  if (delivery?.driverId) {
    [driver] = await db.select().from(driversTable).where(eq(driversTable.id, delivery.driverId));
  }

  // shop name
  const [business] = await db
    .select({ businessName: businessesTable.businessName })
    .from(businessesTable)
    .where(eq(businessesTable.id, Number(order.businessId)));

  // order items (what was ordered)
  const items = await db
    .select({
      id: salesOrderItemsTable.id,
      productId: salesOrderItemsTable.productId,
      productName: productsTable.name,
      qty: salesOrderItemsTable.qty,
      unitPrice: salesOrderItemsTable.unitPrice,
    })
    .from(salesOrderItemsTable)
    .innerJoin(productsTable, eq(salesOrderItemsTable.productId, productsTable.id))
    .where(eq(salesOrderItemsTable.salesOrderId, orderId));

  const formattedItems = items.map((it: any) => ({
    id: Number(it.id),
    product_id: Number(it.productId),
    product_name: it.productName,
    qty: parseFloat(it.qty),
    unit_price: parseFloat(it.unitPrice),
  }));

  // 🔶 NEW
  const returnByOrder = await getReturnsByOrder([orderId]);

  res.json(
    formatCustomerOrder(
      order,
      delivery ?? null,
      driver,
      business?.businessName ?? null,
      formattedItems,
      returnByOrder.get(orderId) ?? null,
    ),
  );
});

// PUT /customers/me/orders/:id/cancel — customer cancels their own order.
// Touches sales_orders.status -> "cancelled", syncs the linked delivery's
// status too (so the Deliveries screen reflects it), and notifies the
// business admin.
// Rules: only while the order is still "pending" (admin has not confirmed),
// no driver activity yet, and within 1 day of placing the order.
router.put("/customers/me/orders/:id/cancel", requireCustomerAuth, async (req, res): Promise<void> => {
  const { customerId } = (req as any).customer;
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const orderId = parseInt(raw, 10);
  if (isNaN(orderId)) {
    res.status(400).json({ error: "Invalid order id" });
    return;
  }

  const [order] = await db
    .select()
    .from(salesOrdersTable)
    .where(
      and(
        eq(salesOrdersTable.id, orderId),
        eq(salesOrdersTable.customerId, customerId),
        eq(salesOrdersTable.isDeleted, false),
      ),
    );

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  // Rule 1: admin already confirmed (or order moved on) => cannot cancel
  if (order.status !== "pending") {
    res.status(409).json({
      error: "This order has been confirmed and can no longer be cancelled.",
    });
    return;
  }

  // 🔶 NEW — Rule 2: driver already assigned / moving => cannot cancel
  const [existingDelivery] = await db
    .select()
    .from(deliveriesTable)
    .where(eq(deliveriesTable.salesOrderId, orderId));
  if (existingDelivery?.status && existingDelivery.status !== "pending") {
    res.status(409).json({
      error: "This order is already being processed and can no longer be cancelled.",
    });
    return;
  }

  // 🔶 NEW — Rule 3: only within 1 day of placing the order
  const placedAt = new Date(order.createdAt as any).getTime();
  if (!isNaN(placedAt) && Date.now() - placedAt > CANCEL_WINDOW_MS) {
    res.status(409).json({
      error: "Orders can only be cancelled within 1 day of placing them.",
    });
    return;
  }

  const [updatedOrder] = await db
    .update(salesOrdersTable)
    .set({ status: "cancelled" as any })
    .where(eq(salesOrdersTable.id, orderId))
    .returning();

  // sync the linked delivery's status too, so the business
  // Deliveries screen (badge + Assign Driver button) reflects the
  // cancellation instead of staying "pending" forever.
  await db
    .update(deliveriesTable)
    .set({ status: "cancelled" as any, cancelledAt: new Date() })
    .where(eq(deliveriesTable.salesOrderId, orderId));

  // notify the business admin (bell icon).
  const [customer] = await db.select({ name: customersTable.name }).from(customersTable).where(eq(customersTable.id, customerId));
  await createOrderCancelledNotification({
    businessId: Number(order.businessId),
    salesOrderId: Number(order.id),
    customerName: customer?.name ?? "Customer",
  }).catch((err) =>
    console.error("[customers] Failed to create order-cancelled notification:", err),
  );

  res.json(formatCustomerOrder(updatedOrder, null, null));
});

// 🔶 NEW — POST /customers/me/orders/:id/return
// Customer requests a return for a DELIVERED order within RETURN_WINDOW_MS.
// body: { reason: EXPIRED_PRODUCT | WRONG_PRODUCT | DAMAGED | MISSING_ITEM | OTHER, description?: string }
router.post("/customers/me/orders/:id/return", requireCustomerAuth, async (req, res): Promise<void> => {
  const { customerId } = (req as any).customer;
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const orderId = parseInt(raw, 10);
  const reason = req.body?.reason as string;
  const description = (typeof req.body?.description === "string" ? req.body.description.trim() : "") || null;

  if (isNaN(orderId)) {
    res.status(400).json({ error: "Invalid order id" });
    return;
  }
  if (!RETURN_REASONS.includes(reason)) {
    res.status(400).json({ error: "Invalid return reason" });
    return;
  }
  if (reason === "OTHER" && !description) {
    res.status(400).json({ error: "Please describe the issue" });
    return;
  }

  const [order] = await db
    .select()
    .from(salesOrdersTable)
    .where(
      and(
        eq(salesOrdersTable.id, orderId),
        eq(salesOrdersTable.customerId, customerId),
        eq(salesOrdersTable.isDeleted, false),
      ),
    );
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  const [delivery] = await db.select().from(deliveriesTable).where(eq(deliveriesTable.salesOrderId, orderId));
  const tracking = mapToCustomerStatus(order.status, delivery?.status ?? null, delivery?.outForDeliveryAt ?? null);
  if (tracking !== "DELIVERED") {
    res.status(409).json({ error: "Only delivered orders can be returned." });
    return;
  }

  const deliveredAt = delivery?.deliveredAt ? new Date(delivery.deliveredAt as any).getTime() : NaN;
  if (isNaN(deliveredAt) || Date.now() - deliveredAt > RETURN_WINDOW_MS) {
    res.status(409).json({ error: "The return window has expired for this order." });
    return;
  }

  const [existing] = await db
    .select()
    .from(orderReturnsTable)
    .where(eq(orderReturnsTable.salesOrderId, orderId));
  if (existing) {
    res.status(409).json({ error: "A return has already been requested for this order." });
    return;
  }
 
    // 🔶 Which product(s) are being returned
  const orderItems = await db
    .select({
      productId: salesOrderItemsTable.productId,
      productName: productsTable.name,
      qty: salesOrderItemsTable.qty,
      unitPrice: salesOrderItemsTable.unitPrice,
    })
    .from(salesOrderItemsTable)
    .innerJoin(productsTable, eq(salesOrderItemsTable.productId, productsTable.id))
    .where(eq(salesOrderItemsTable.salesOrderId, orderId));

  const requested: any[] = Array.isArray(req.body?.items) ? req.body.items : [];
  let returnItems: { product_id: number; product_name: string; qty: number; unit_price: number }[] = [];

  if (requested.length === 0) {
    if (orderItems.length === 1) {
      const only = orderItems[0];
      returnItems = [{
        product_id: Number(only.productId),
        product_name: only.productName,
        qty: parseFloat(only.qty as any),
        unit_price: parseFloat(only.unitPrice as any),
      }];
    } else {
      res.status(400).json({ error: "Please select the product(s) you want to return." });
      return;
    }
  } else {
    for (const r of requested) {
      const productId = parseInt(r?.product_id, 10);
      const qty = Number(r?.qty);
      const orderedItem = orderItems.find((oi: any) => Number(oi.productId) === productId);
      if (!orderedItem) {
        res.status(400).json({ error: "Selected product is not part of this order." });
        return;
      }
      if (!qty || qty <= 0 || qty > parseFloat(orderedItem.qty as any)) {
        res.status(400).json({ error: `Invalid return quantity for ${orderedItem.productName}.` });
        return;
      }
      returnItems.push({
        product_id: productId,
        product_name: orderedItem.productName,
        qty,
        unit_price: parseFloat(orderedItem.unitPrice as any),
      });
    }
  }
  
  const [created] = await db
    .insert(orderReturnsTable)
    .values({
      salesOrderId: orderId,
      businessId: Number(order.businessId),
      customerId,
      reason,
      description,
    })
    .returning();

  res.status(201).json({ id: Number(created.id), status: created.status, reason: created.reason });
});

// 🔶 NEW — GET /order-returns?business_id=1  (admin panel: list customer return requests)
router.get("/order-returns", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }

  const rows = await db
    .select({
      id: orderReturnsTable.id,
      salesOrderId: orderReturnsTable.salesOrderId,
      reason: orderReturnsTable.reason,
      description: orderReturnsTable.description,
      status: orderReturnsTable.status,
      adminNote: orderReturnsTable.adminNote,
      createdAt: orderReturnsTable.createdAt,
      customerName: customersTable.name,
      customerPhone: customersTable.phone,
    })
    .from(orderReturnsTable)
    .innerJoin(customersTable, eq(orderReturnsTable.customerId, customersTable.id))
    .where(eq(orderReturnsTable.businessId, businessId))
    .orderBy(desc(orderReturnsTable.id));

  res.json({
    data: rows.map((r: any) => ({
      id: Number(r.id),
      sales_order_id: Number(r.salesOrderId),
      reason: r.reason,
      description: r.description,
      status: r.status,
      admin_note: r.adminNote,
      created_at: r.createdAt,
      customer_name: r.customerName,
      customer_phone: r.customerPhone,
    })),
  });
});

// 🔶 NEW — PUT /order-returns/:id/status  body: { status: "APPROVED" | "REJECTED", admin_note?: string }
router.put("/order-returns/:id/status", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const status = req.body?.status as string;

  if (isNaN(id) || !["APPROVED", "REJECTED"].includes(status)) {
    res.status(400).json({ error: "status must be APPROVED or REJECTED" });
    return;
  }

  const [updated] = await db
    .update(orderReturnsTable)
    .set({
      status,
      adminNote: typeof req.body?.admin_note === "string" ? req.body.admin_note : null,
      resolvedAt: new Date(),
    })
    .where(and(eq(orderReturnsTable.id, id), eq(orderReturnsTable.status, "REQUESTED")))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Return request not found or already resolved" });
    return;
  }

  res.json({ id: Number(updated.id), status: updated.status, reason: updated.reason });
});

export default router;