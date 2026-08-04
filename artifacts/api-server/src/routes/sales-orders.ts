import { Router, type IRouter } from "express";
import { requireAuth, AuthPayload } from "../middlewares/auth";
import {
  db,
  salesOrdersTable,
  salesOrderItemsTable,
  customersTable,
  productsTable,
} from "@workspace/db";
import { CreateSalesOrderBody, UpdateSalesOrderBody, UpdateSalesOrderStatusBody } from "@workspace/api-zod";
import { eq, and, gte, sql, desc, count, inArray } from "drizzle-orm";

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
    gst_rate: parseFloat(so.gstRate ?? "0"), // ← NEW
    invoice_no: so.invoiceNo ?? null, // ← NEW
    description: so.description,
    shipping_address: so.shippingAddress,
    entry_date: so.entryDate,
    transaction_id: so.transactionId ? Number(so.transactionId) : null,
    item_count: itemCount ?? 0,
    created_by: Number(so.createdBy),
    created_at: so.createdAt,
  };
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

// POST /sales-orders — does NOT touch stock (order is only "placed" here, not fulfilled)
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
    gstRate: (d.tax ?? 0).toString(), // ← NEW
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
    for (const item of items) {
      await db.update(productsTable)
        .set({ stockQty: sql`${productsTable.stockQty} - ${Math.round(parseFloat(item.qty))}` })
        .where(eq(productsTable.id, Number(item.productId)));
    }
    updates.invoiceNo = `INV-${existing.businessId}-${String(id).padStart(5, "0")}`; // ← NEW
  }

  const [order] = await db.update(salesOrdersTable).set(updates)
    .where(and(eq(salesOrdersTable.id, id), eq(salesOrdersTable.isDeleted, false))).returning();

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