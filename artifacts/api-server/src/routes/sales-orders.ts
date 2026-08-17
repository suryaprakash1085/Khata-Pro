import { Router, type IRouter } from "express";
import { requireAuth, AuthPayload } from "../middlewares/auth";
import {
  db,
  salesOrdersTable,
  salesOrderItemsTable,
  customersTable,
  productsTable,
  businessesTable,
  deliveriesTable,
  notificationsTable
} from "@workspace/db";
import { CreateSalesOrderBody, UpdateSalesOrderBody, UpdateSalesOrderStatusBody } from "@workspace/api-zod";
import { eq, and, gte, sql, desc, count, inArray } from "drizzle-orm";
import { notifyCustomerOrderConfirmed } from "../services/pushNotifications";

const router: IRouter = Router();

function formatSalesOrder(so: any, customerName?: string, itemCount?: number) {
  return {
    id: Number(so.id),
    business_id: Number(so.businessId),
    customer_id: Number(so.customerId),
    customer_name: customerName ?? "",
    channel: so.channel,
    status: so.status,
    amount: parseFloat(so.amount ?? "0"),
    tax: parseFloat(so.tax ?? "0"),
    gst_rate: parseFloat(so.gstRate ?? "0"),
    invoice_no: so.invoiceNo ?? null,
    description: so.description,
    shipping_address: so.shippingAddress,
    entry_date: so.entryDate,
    transaction_id: so.transactionId ? Number(so.transactionId) : null,
    item_count: itemCount ?? 0,
    created_by: Number(so.createdBy),
    created_at: so.createdAt,
  };
}

// Shared helper — resolves a business's pickup address for auto-created
// deliveries. Used by both the admin and public order-creation routes.
async function resolvePickupAddress(businessId: number): Promise<string> {
  const [business] = await db.select().from(businessesTable).where(eq(businessesTable.id, businessId));
  return (
    [business?.addressLine1, business?.addressLine2].filter(Boolean).join(", ") ||
    business?.businessName ||
    "Store"
  );
}

// GET /sales-orders
router.get("/sales-orders", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) { res.status(400).json({ error: "business_id is required" }); return; }

  const customerId = req.query.customer_id ? parseInt(req.query.customer_id as string, 10) : undefined;
  const status = req.query.status as string | undefined;
  const channel = req.query.channel as string | undefined;
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = (page - 1) * limit;

  const conditions: any[] = [eq(salesOrdersTable.businessId, businessId), eq(salesOrdersTable.isDeleted, false)];
  if (customerId) conditions.push(eq(salesOrdersTable.customerId, customerId));
  if (status) conditions.push(eq(salesOrdersTable.status, status as any));
  if (channel) conditions.push(eq(salesOrdersTable.channel, channel as any));
  if (from) conditions.push(gte(salesOrdersTable.entryDate, from));
  if (to) conditions.push(sql`${salesOrdersTable.entryDate} <= ${to}`);

  const [orders, totalResult] = await Promise.all([
    db.select().from(salesOrdersTable).where(and(...conditions)).limit(limit).offset(offset).orderBy(desc(salesOrdersTable.entryDate)),
    db.select({ count: count() }).from(salesOrdersTable).where(and(...conditions)),
  ]);

  const orderIds = orders.map((o: any) => Number(o.id));
  const customerIds = [...new Set(orders.map((o: any) => Number(o.customerId)))];

  const [customers, itemCounts] = await Promise.all([
    customerIds.length > 0
      ? db.select({ id: customersTable.id, name: customersTable.name }).from(customersTable).where(inArray(customersTable.id, customerIds))
      : Promise.resolve([] as any[]),
    orderIds.length > 0
      ? db.select({ salesOrderId: salesOrderItemsTable.salesOrderId, count: count() }).from(salesOrderItemsTable)
          .where(inArray(salesOrderItemsTable.salesOrderId, orderIds)).groupBy(salesOrderItemsTable.salesOrderId)
      : Promise.resolve([] as any[]),
  ]);

  const customerMap = new Map(customers.map((c: any) => [Number(c.id), c.name]));
  const itemCountMap = new Map(itemCounts.map((r: any) => [Number(r.salesOrderId), Number(r.count)]));

  res.json({
    data: orders.map((o: any) =>
      formatSalesOrder(o, customerMap.get(Number(o.customerId)), itemCountMap.get(Number(o.id))),
    ),
    total: Number(totalResult[0].count),
    page,
    limit,
  });
});

// GET /sales-orders/:id
router.get("/sales-orders/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const [order] = await db.select().from(salesOrdersTable)
    .where(and(eq(salesOrdersTable.id, id), eq(salesOrdersTable.isDeleted, false)));
  if (!order) { res.status(404).json({ error: "Sales order not found" }); return; }

  const [customer] = await db.select({ name: customersTable.name }).from(customersTable).where(eq(customersTable.id, Number(order.customerId)));
  const items = await db.select({
    id: salesOrderItemsTable.id,
    productId: salesOrderItemsTable.productId,
    productName: productsTable.name,
    qty: salesOrderItemsTable.qty,
    unitPrice: salesOrderItemsTable.unitPrice,
  }).from(salesOrderItemsTable)
    .innerJoin(productsTable, eq(salesOrderItemsTable.productId, productsTable.id))
    .where(eq(salesOrderItemsTable.salesOrderId, id));

  res.json({
    ...formatSalesOrder(order, customer?.name, items.length),
    items: items.map((it: any) => ({
      id: Number(it.id),
      product_id: Number(it.productId),
      product_name: it.productName,
      qty: parseFloat(it.qty),
      unit_price: parseFloat(it.unitPrice),
    })),
  });
});

// ============================================================
// POST /sales-orders — admin/staff create (authenticated).
// Does NOT touch stock; order is only "placed" here, not fulfilled.
// Auto-creates a matching `deliveries` row when a shipping_address
// is provided (home-delivery order, not in-store pickup).
// ============================================================
router.post("/sales-orders", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateSalesOrderBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const d = parsed.data;
  const { userId } = (req as any).user as AuthPayload;

  const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, d.customer_id));
  if (!customer) { res.status(404).json({ error: "Customer not found" }); return; }

  const itemsTotal = d.items.reduce((sum, it) => sum + it.qty * it.unit_price, 0);
  const tax = d.tax ?? 0;
  const amount = itemsTotal + tax;

  const toDateStr = (v: string | Date | null | undefined): string | undefined =>
    v instanceof Date ? v.toISOString().split("T")[0] : (v as string | undefined);

  const [order] = await db.insert(salesOrdersTable).values({
    businessId: d.business_id,
    customerId: d.customer_id,
    channel: d.channel ?? "online",
    status: "pending",
    amount: amount.toString(),
    tax: tax.toString(),
    gstRate: (d.tax ?? 0).toString(),
    description: d.description,
    shippingAddress: d.shipping_address,
    entryDate: toDateStr(d.entry_date) ?? new Date().toISOString().split("T")[0],
    createdBy: userId,
  }).returning();

  if (d.items.length > 0) {
    await db.insert(salesOrderItemsTable).values(
      d.items.map((it) => ({
        salesOrderId: order.id,
        productId: it.product_id,
        qty: it.qty.toString(),
        unitPrice: it.unit_price.toString(),
      })),
    );
  }

  if (d.shipping_address) {
    const pickupAddress = await resolvePickupAddress(d.business_id);
    await db.insert(deliveriesTable).values({
      businessId: d.business_id,
      customerId: d.customer_id,
      salesOrderId: order.id,
      pickupAddress,
      dropAddress: d.shipping_address,
      amount: amount.toString(),
      status: "pending",
    });
  }

  res.status(201).json(formatSalesOrder(order, customer.name, d.items.length));
});

// ============================================================
// POST /public/sales-orders — customer-facing order placement (no auth).
// Mirrors the admin route above, including the delivery auto-create,
// but is unauthenticated since the customer app doesn't hold a staff JWT.
// ============================================================
router.post("/public/sales-orders", async (req, res): Promise<void> => {
  const parsed = CreateSalesOrderBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const d = parsed.data;

  const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, d.customer_id));
  if (!customer) { res.status(404).json({ error: "Customer not found" }); return; }

  const itemsTotal = d.items.reduce((sum, it) => sum + it.qty * it.unit_price, 0);
  const tax = d.tax ?? 0;
  const amount = itemsTotal + tax;

  const [order] = await db.insert(salesOrdersTable).values({
    businessId: d.business_id,
    customerId: d.customer_id,
    channel: d.channel ?? "online",
    status: "pending",
    amount: amount.toString(),
    tax: tax.toString(),
    gstRate: (d.tax ?? 0).toString(),
    description: d.description,
    shippingAddress: d.shipping_address,
    entryDate: new Date().toISOString().split("T")[0],
    createdBy: customer.id, // no staff user for public orders — attribute to the customer
  }).returning();

  if (d.items.length > 0) {
    await db.insert(salesOrderItemsTable).values(
      d.items.map((it) => ({
        salesOrderId: order.id,
        productId: it.product_id,
        qty: it.qty.toString(),
        unitPrice: it.unit_price.toString(),
      })),
    );
  }

  if (d.shipping_address) {
    const pickupAddress = await resolvePickupAddress(d.business_id);
    await db.insert(deliveriesTable).values({
      businessId: d.business_id,
      customerId: d.customer_id,
      salesOrderId: order.id,
      pickupAddress,
      dropAddress: d.shipping_address,
      amount: amount.toString(),
      status: "pending",
    });
  }

  res.status(201).json(formatSalesOrder(order, customer.name, d.items.length));
});

// PUT /sales-orders/:id — meta only
router.put("/sales-orders/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const parsed = UpdateSalesOrderBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const d = parsed.data;

  const [existing] = await db.select().from(salesOrdersTable)
    .where(and(eq(salesOrdersTable.id, id), eq(salesOrdersTable.isDeleted, false)));
  if (!existing) { res.status(404).json({ error: "Sales order not found" }); return; }

  const updates: any = {};
  if (d.description !== undefined) updates.description = d.description;
  if (d.shipping_address !== undefined) updates.shippingAddress = d.shipping_address;
  if (d.entry_date) updates.entryDate = d.entry_date instanceof Date ? d.entry_date.toISOString().split("T")[0] : d.entry_date;

  const [order] = await db.update(salesOrdersTable).set(updates)
    .where(and(eq(salesOrdersTable.id, id), eq(salesOrdersTable.isDeleted, false))).returning();

  const [customer] = await db.select({ name: customersTable.name }).from(customersTable).where(eq(customersTable.id, Number(order.customerId)));
  res.json(formatSalesOrder(order, customer?.name));
});

// PUT /sales-orders/:id/status — moves order through the pipeline.
// When status becomes "invoiced", stock is reduced (order is fulfilled here).
router.put("/sales-orders/:id/status", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const parsed = UpdateSalesOrderStatusBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const { status } = parsed.data;

  const [existing] = await db.select().from(salesOrdersTable)
    .where(and(eq(salesOrdersTable.id, id), eq(salesOrdersTable.isDeleted, false)));
  if (!existing) { res.status(404).json({ error: "Sales order not found" }); return; }

  const updates: any = { status: status as any };

  // Only reduce stock + assign invoice number the first time an order transitions INTO invoiced
  if (status === "invoiced" && existing.status !== "invoiced") {
    const items = await db.select().from(salesOrderItemsTable).where(eq(salesOrderItemsTable.salesOrderId, id));

    // Validate stock BEFORE touching anything
    const productIds = items.map((it) => Number(it.productId));
    const products = productIds.length > 0
      ? await db.select().from(productsTable).where(inArray(productsTable.id, productIds))
      : [];
    const stockMap = new Map(products.map((p: any) => [Number(p.id), p.stockQty]));

    const shortages = items
      .map((item) => {
        const needed = Math.round(parseFloat(item.qty));
        const available = stockMap.get(Number(item.productId)) ?? 0;
        return { productId: Number(item.productId), needed, available };
      })
      .filter((s) => s.needed > s.available);

    if (shortages.length > 0) {
      const productNames = new Map(products.map((p: any) => [Number(p.id), p.name]));
      res.status(409).json({
        error: "Insufficient stock",
        shortages: shortages.map((s) => ({
          product_id: s.productId,
          product_name: productNames.get(s.productId) ?? "",
          needed: s.needed,
          available: s.available,
        })),
      });
      return;
    }

    for (const item of items) {
      await db.update(productsTable)
        .set({ stockQty: sql`${productsTable.stockQty} - ${Math.round(parseFloat(item.qty))}` })
        .where(eq(productsTable.id, Number(item.productId)));
    }
    updates.invoiceNo = `INV-${existing.businessId}-${String(id).padStart(5, "0")}`;
  }

  const [order] = await db.update(salesOrdersTable).set(updates)
    .where(and(eq(salesOrdersTable.id, id), eq(salesOrdersTable.isDeleted, false))).returning();

  // Notify the customer when the order gets confirmed (invoiced)
// Notify the customer when the order gets confirmed (invoiced)
if (status === "invoiced" && existing.status !== "invoiced") {
  await db.insert(notificationsTable).values({
    businessId: order.businessId,
    customerId: order.customerId,
    type: "order_confirmed",
    message: `Your order #${order.id} has been confirmed!`,
  });

  const [customerForPush] = await db.select().from(customersTable).where(eq(customersTable.id, order.customerId));
  if (customerForPush?.pushToken) {
    notifyCustomerOrderConfirmed(customerForPush.pushToken, Number(order.id)).catch(err =>
      console.error("[sales-orders] Failed to send order-confirmed push:", err)
    );
  }
}

  const [customer] = await db.select({ name: customersTable.name }).from(customersTable).where(eq(customersTable.id, Number(order.customerId)));
  res.json(formatSalesOrder(order, customer?.name));
});

// DELETE /sales-orders/:id
router.delete("/sales-orders/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const [order] = await db.update(salesOrdersTable).set({ isDeleted: true }).where(eq(salesOrdersTable.id, id)).returning();
  if (!order) { res.status(404).json({ error: "Sales order not found" }); return; }
  res.json({ message: "Sales order deleted" });
});

export default router;