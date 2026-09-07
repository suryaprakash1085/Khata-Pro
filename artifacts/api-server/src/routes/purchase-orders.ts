import { Router, type IRouter } from "express";
import { requireAuth, AuthPayload } from "../middlewares/auth";
import {
  db,
  purchaseOrdersTable,
  purchaseOrderItemsTable,
  purchaseOrderPaymentsTable,
  purchaseOrderCountersTable,
  vendorsTable,
  productsTable,
} from "@workspace/db";
import { eq, and, gte, sql, desc, count, inArray } from "drizzle-orm";
import { z } from "zod/v4";

const router: IRouter = Router();

// ---------------------------------------------------------------------------
// Validation — mirrors the shape of CreatePurchaseBody/UpdatePurchaseBody in
// @workspace/api-zod. Move these there once confirmed, to match convention.
// ---------------------------------------------------------------------------
const PO_STATUSES = ["pending", "ordered", "partially_received", "received", "cancelled"] as const;
const PAYMENT_METHODS = ["cash", "upi", "bank_transfer", "cheque", "other"] as const;

const CreatePurchaseOrderBody = z.object({
  business_id: z.number().int().positive(),
  vendor_id: z.number().int().positive(),
  notes: z.string().max(1000).optional(),
  items: z
    .array(
      z.object({
        product_id: z.number().int().positive(),
        qty: z.number().positive(),
        unit_cost: z.number().nonnegative(),
      }),
    )
    .min(1, "At least one product is required"),
});

const UpdatePurchaseOrderBody = z.object({
  status: z.enum(PO_STATUSES).optional(),
  notes: z.string().max(1000).optional(),
});

const CreatePurchaseOrderPaymentBody = z.object({
  amount: z.number().positive(),
  payment_method: z.enum(PAYMENT_METHODS).default("cash"),
  payment_date: z.string().optional(), // YYYY-MM-DD, defaults to today
  notes: z.string().max(500).optional(),
});

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------
function computePaymentStatus(total: number, paid: number): "unpaid" | "partial" | "paid" {
  if (paid <= 0) return "unpaid";
  if (paid >= total) return "paid";
  return "partial";
}

function formatPurchaseOrder(p: any, vendorName?: string, itemCount?: number) {
  return {
    id: Number(p.id),
    business_id: Number(p.businessId),
    vendor_id: Number(p.vendorId),
    vendor_name: vendorName ?? "",
    purchase_order_number: p.purchaseOrderNumber,
    order_date: p.orderDate,
    status: p.status,
    total_amount: parseFloat(p.totalAmount ?? "0"),
    notes: p.notes,
    item_count: itemCount ?? 0,
    created_at: p.createdAt,
  };
}

function formatPurchaseOrderItem(it: any) {
  return {
    id: Number(it.id),
    product_id: Number(it.productId),
    ordered_qty: parseFloat(it.orderedQty),
    received_qty: parseFloat(it.receivedQty),
    remaining_qty: parseFloat(it.orderedQty) - parseFloat(it.receivedQty),
    unit_cost: parseFloat(it.unitCost),
    total: parseFloat(it.total),
  };
}

function formatPayment(pay: any) {
  return {
    id: Number(pay.id),
    purchase_order_id: Number(pay.purchaseOrderId),
    amount: parseFloat(pay.amount),
    payment_method: pay.paymentMethod,
    payment_date: pay.paymentDate,
    notes: pay.notes,
    created_at: pay.createdAt,
  };
}

const todayStr = () => new Date().toISOString().split("T")[0];

// ---------------------------------------------------------------------------
// GET /purchase-orders — list, business-scoped
// ---------------------------------------------------------------------------
router.get("/purchase-orders", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) { res.status(400).json({ error: "business_id is required" }); return; }

  const vendorId = req.query.vendor_id ? parseInt(req.query.vendor_id as string, 10) : undefined;
  const status = req.query.status as string | undefined;
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = (page - 1) * limit;

  const conditions: any[] = [eq(purchaseOrdersTable.businessId, businessId), eq(purchaseOrdersTable.isDeleted, false)];
  if (vendorId) conditions.push(eq(purchaseOrdersTable.vendorId, vendorId));
  if (status && (PO_STATUSES as readonly string[]).includes(status)) conditions.push(eq(purchaseOrdersTable.status, status as any));
  if (from) conditions.push(gte(purchaseOrdersTable.orderDate, from));
  if (to) conditions.push(sql`${purchaseOrdersTable.orderDate} <= ${to}`);

  const [orders, totalResult] = await Promise.all([
    db.select().from(purchaseOrdersTable).where(and(...conditions))
      .limit(limit).offset(offset).orderBy(desc(purchaseOrdersTable.orderDate), desc(purchaseOrdersTable.sequenceNo)),
    db.select({ count: count() }).from(purchaseOrdersTable).where(and(...conditions)),
  ]);

  const orderIds = orders.map((o: any) => Number(o.id));
  const vendorIds = [...new Set(orders.map((o: any) => Number(o.vendorId)))];

  const [vendors, itemCounts] = await Promise.all([
    vendorIds.length > 0
      ? db.select({ id: vendorsTable.id, name: vendorsTable.name }).from(vendorsTable).where(inArray(vendorsTable.id, vendorIds))
      : Promise.resolve([] as any[]),
    orderIds.length > 0
      ? db.select({ purchaseOrderId: purchaseOrderItemsTable.purchaseOrderId, count: count() }).from(purchaseOrderItemsTable)
          .where(inArray(purchaseOrderItemsTable.purchaseOrderId, orderIds)).groupBy(purchaseOrderItemsTable.purchaseOrderId)
      : Promise.resolve([] as any[]),
  ]);

  const vendorMap = new Map(vendors.map((v: any) => [Number(v.id), v.name]));
  const itemCountMap = new Map(itemCounts.map((r: any) => [Number(r.purchaseOrderId), Number(r.count)]));

  res.json({
    data: orders.map((o: any) => formatPurchaseOrder(o, vendorMap.get(Number(o.vendorId)), itemCountMap.get(Number(o.id)))),
    total: Number(totalResult[0].count),
    page,
    limit,
  });
});

// ---------------------------------------------------------------------------
// GET /purchase-orders/next-number — PREVIEW only, for display before saving.
// Does not reserve a number. Must stay above "/purchase-orders/:id" so
// Express doesn't try to parse "next-number" as an id.
// ---------------------------------------------------------------------------
router.get("/purchase-orders/next-number", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) { res.status(400).json({ error: "business_id is required" }); return; }

  const [counter] = await db.select().from(purchaseOrderCountersTable)
    .where(eq(purchaseOrderCountersTable.businessId, businessId));

  const nextSeq = (counter?.lastNumber ?? 0) + 1;
  res.json({ preview_number: `PO-${String(nextSeq).padStart(3, "0")}` });
});

// ---------------------------------------------------------------------------
// GET /purchase-orders/:id — full detail: items + payments + computed totals
// ---------------------------------------------------------------------------
router.get("/purchase-orders/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const [order] = await db.select().from(purchaseOrdersTable)
    .where(and(eq(purchaseOrdersTable.id, id), eq(purchaseOrdersTable.isDeleted, false)));
  if (!order) { res.status(404).json({ error: "Purchase order not found" }); return; }

  const [vendor, items, payments] = await Promise.all([
    db.select({ name: vendorsTable.name }).from(vendorsTable).where(eq(vendorsTable.id, Number(order.vendorId))).then((r) => r[0]),
    db.select().from(purchaseOrderItemsTable).where(eq(purchaseOrderItemsTable.purchaseOrderId, id)),
    db.select().from(purchaseOrderPaymentsTable).where(eq(purchaseOrderPaymentsTable.purchaseOrderId, id))
      .orderBy(desc(purchaseOrderPaymentsTable.paymentDate)),
  ]);

  const totalAmount = parseFloat(order.totalAmount ?? "0");
  const amountPaid = payments.reduce((sum, p: any) => sum + parseFloat(p.amount), 0);

  res.json({
    ...formatPurchaseOrder(order, vendor?.name, items.length),
    amount_paid: amountPaid,
    balance_due: Math.max(0, totalAmount - amountPaid),
    payment_status: computePaymentStatus(totalAmount, amountPaid),
    items: items.map(formatPurchaseOrderItem),
    payments: payments.map(formatPayment),
  });
});

// ---------------------------------------------------------------------------
// POST /purchase-orders — create PO + items. Atomic per-business numbering.
// Deliberately does NOT touch productsTable.stockQty.
// ---------------------------------------------------------------------------
router.post("/purchase-orders", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreatePurchaseOrderBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const d = parsed.data;
  const { userId } = (req as any).user as AuthPayload;

  const [vendor] = await db.select().from(vendorsTable)
    .where(and(eq(vendorsTable.id, d.vendor_id), eq(vendorsTable.businessId, d.business_id)));
  if (!vendor) { res.status(404).json({ error: "Vendor not found for this business" }); return; }

  const productIds = d.items.map((it) => it.product_id);
  const products = await db.select({ id: productsTable.id }).from(productsTable)
    .where(and(inArray(productsTable.id, productIds), eq(productsTable.businessId, d.business_id)));
  if (products.length !== new Set(productIds).size) {
    res.status(404).json({ error: "One or more products not found for this business" });
    return;
  }

  const itemsWithTotals = d.items.map((it) => ({ ...it, total: it.qty * it.unit_cost }));
  const totalAmount = itemsWithTotals.reduce((sum, it) => sum + it.total, 0);

  const result = await db.transaction(async (tx) => {
    // Atomic increment — single statement, safe under concurrent requests.
    const [counter] = await tx
      .insert(purchaseOrderCountersTable)
      .values({ businessId: d.business_id, lastNumber: 1 })
      .onConflictDoUpdate({
        target: purchaseOrderCountersTable.businessId,
        set: { lastNumber: sql`${purchaseOrderCountersTable.lastNumber} + 1` },
      })
      .returning();

    const sequenceNo = counter.lastNumber;
    const purchaseOrderNumber = `PO-${String(sequenceNo).padStart(3, "0")}`;

    const [order] = await tx.insert(purchaseOrdersTable).values({
      businessId: d.business_id,
      vendorId: d.vendor_id,
      purchaseOrderNumber,
      sequenceNo,
      orderDate: todayStr(),
      status: "pending",
      totalAmount: totalAmount.toString(),
      notes: d.notes,
      createdBy: userId,
    }).returning();

    await tx.insert(purchaseOrderItemsTable).values(
      itemsWithTotals.map((it) => ({
        purchaseOrderId: order.id,
        productId: it.product_id,
        orderedQty: it.qty.toString(),
        receivedQty: "0",
        unitCost: it.unit_cost.toString(),
        total: it.total.toString(),
      })),
    );

    return order;
  });

  res.status(201).json(formatPurchaseOrder(result, vendor.name, d.items.length));
});

// ---------------------------------------------------------------------------
// PUT /purchase-orders/:id — status/notes only (line items unchanged here;
// a future "receiving" endpoint should be the only place received_qty and
// product stock move together, in one transaction).
// ---------------------------------------------------------------------------
router.put("/purchase-orders/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const parsed = UpdatePurchaseOrderBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const d = parsed.data;

  const [existing] = await db.select().from(purchaseOrdersTable)
    .where(and(eq(purchaseOrdersTable.id, id), eq(purchaseOrdersTable.isDeleted, false)));
  if (!existing) { res.status(404).json({ error: "Purchase order not found" }); return; }

  const updates: any = {};
  if (d.status !== undefined) updates.status = d.status;
  if (d.notes !== undefined) updates.notes = d.notes;

  const [order] = await db.update(purchaseOrdersTable).set(updates)
    .where(and(eq(purchaseOrdersTable.id, id), eq(purchaseOrdersTable.isDeleted, false))).returning();

  const [vendor] = await db.select({ name: vendorsTable.name }).from(vendorsTable).where(eq(vendorsTable.id, Number(order.vendorId)));
  const itemCount = await db.select({ count: count() }).from(purchaseOrderItemsTable).where(eq(purchaseOrderItemsTable.purchaseOrderId, id));

  res.json(formatPurchaseOrder(order, vendor?.name, Number(itemCount[0].count)));
});

// ---------------------------------------------------------------------------
// DELETE /purchase-orders/:id — soft delete / cancel
// ---------------------------------------------------------------------------
router.delete("/purchase-orders/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const [order] = await db.update(purchaseOrdersTable).set({ isDeleted: true, status: "cancelled" })
    .where(eq(purchaseOrdersTable.id, id)).returning();
  if (!order) { res.status(404).json({ error: "Purchase order not found" }); return; }
  res.json({ message: "Purchase order cancelled" });
});

// ---------------------------------------------------------------------------
// POST /purchase-orders/:id/payments — record a vendor payment against a PO
// ---------------------------------------------------------------------------
router.post("/purchase-orders/:id/payments", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const parsed = CreatePurchaseOrderPaymentBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const d = parsed.data;
  const { userId } = (req as any).user as AuthPayload;

  const [order] = await db.select().from(purchaseOrdersTable)
    .where(and(eq(purchaseOrdersTable.id, id), eq(purchaseOrdersTable.isDeleted, false)));
  if (!order) { res.status(404).json({ error: "Purchase order not found" }); return; }

  const [payment] = await db.insert(purchaseOrderPaymentsTable).values({
    businessId: Number(order.businessId),
    purchaseOrderId: id,
    vendorId: Number(order.vendorId),
    amount: d.amount.toString(),
    paymentMethod: d.payment_method,
    paymentDate: d.payment_date ?? todayStr(),
    notes: d.notes,
    createdBy: userId,
  }).returning();

  const payments = await db.select().from(purchaseOrderPaymentsTable).where(eq(purchaseOrderPaymentsTable.purchaseOrderId, id));
  const totalAmount = parseFloat(order.totalAmount ?? "0");
  const amountPaid = payments.reduce((sum, p: any) => sum + parseFloat(p.amount), 0);

  res.status(201).json({
    payment: formatPayment(payment),
    amount_paid: amountPaid,
    balance_due: Math.max(0, totalAmount - amountPaid),
    payment_status: computePaymentStatus(totalAmount, amountPaid),
  });
});

// ---------------------------------------------------------------------------
// GET /purchase-orders/vendor-pending-total — sum of unpaid PO balances for
// ALL vendors of a business. Mirrors /purchases/pending-total so it can feed
// the same dashboard "To be Paid" card once you decide to combine both
// sources (or keep them as two separate numbers — your call).
// ---------------------------------------------------------------------------
router.get("/purchase-orders/vendor-pending-total", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) { res.status(400).json({ error: "business_id is required" }); return; }

  const [row] = await db.select({
    totalOrdered: sql<string>`coalesce(sum(${purchaseOrdersTable.totalAmount}), 0)`,
  }).from(purchaseOrdersTable)
    .where(and(
      eq(purchaseOrdersTable.businessId, businessId),
      eq(purchaseOrdersTable.isDeleted, false),
      sql`${purchaseOrdersTable.status} != 'cancelled'`,
    ));

  const [paidRow] = await db.select({
    totalPaid: sql<string>`coalesce(sum(${purchaseOrderPaymentsTable.amount}), 0)`,
  }).from(purchaseOrderPaymentsTable)
    .innerJoin(purchaseOrdersTable, eq(purchaseOrderPaymentsTable.purchaseOrderId, purchaseOrdersTable.id))
    .where(and(eq(purchaseOrdersTable.businessId, businessId), eq(purchaseOrdersTable.isDeleted, false)));

  const totalOrdered = parseFloat(row.totalOrdered ?? "0");
  const totalPaid = parseFloat(paidRow.totalPaid ?? "0");

  res.json({ total_pending: Math.max(0, totalOrdered - totalPaid) });
});

export default router;