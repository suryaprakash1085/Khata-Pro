import { Router, type IRouter } from "express";
import { requireAuth, AuthPayload } from "../middlewares/auth";
import { db, purchasesTable, purchaseItemsTable, vendorsTable, productsTable } from "@workspace/db";
import { CreatePurchaseBody, UpdatePurchaseBody } from "@workspace/api-zod";
import { eq, and, gte, sql, desc, count, inArray } from "drizzle-orm";

const router: IRouter = Router();

function computeStatus(amount: number, amountPaid: number): "paid" | "pending" | "partial" {
  if (amountPaid <= 0) return "pending";
  if (amountPaid >= amount) return "paid";
  return "partial";
}

function formatPurchase(p: any, vendorName?: string, itemCount?: number, productNames?: string[]) {
  return {
    id: Number(p.id),
    business_id: Number(p.businessId),
    vendor_id: Number(p.vendorId),
    vendor_name: vendorName ?? "",
    invoice_no: p.invoiceNo,
    amount: parseFloat(p.amount ?? "0"),
    tax: parseFloat(p.tax ?? "0"),
    amount_paid: parseFloat(p.amountPaid ?? "0"),
    status: p.status,
    bill_image_url: p.billImageUrl,
    description: p.description,
    entry_date: p.entryDate,
    product_count: itemCount ?? 0,
    product_names: productNames ?? [],
    created_by: Number(p.createdBy),
    created_at: p.createdAt,
  };
}

// GET /purchases
router.get("/purchases", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) { res.status(400).json({ error: "business_id is required" }); return; }

  const vendorId = req.query.vendor_id ? parseInt(req.query.vendor_id as string, 10) : undefined;
  const status = req.query.status as string | undefined;
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = (page - 1) * limit;

  const conditions: any[] = [eq(purchasesTable.businessId, businessId), eq(purchasesTable.isDeleted, false)];
  if (vendorId) conditions.push(eq(purchasesTable.vendorId, vendorId));
  if (status === "paid" || status === "pending" || status === "partial") conditions.push(eq(purchasesTable.status, status));
  if (from) conditions.push(gte(purchasesTable.entryDate, from));
  if (to) conditions.push(sql`${purchasesTable.entryDate} <= ${to}`);

  const [purchases, totalResult] = await Promise.all([
    db.select().from(purchasesTable).where(and(...conditions)).limit(limit).offset(offset).orderBy(desc(purchasesTable.entryDate)),
    db.select({ count: count() }).from(purchasesTable).where(and(...conditions)),
  ]);

  const purchaseIds = purchases.map((p: any) => Number(p.id));
  const vendorIds = [...new Set(purchases.map((p: any) => Number(p.vendorId)))];

  const [vendors, itemCounts, itemDetails] = await Promise.all([
    vendorIds.length > 0
      ? db.select({ id: vendorsTable.id, name: vendorsTable.name }).from(vendorsTable).where(inArray(vendorsTable.id, vendorIds))
      : Promise.resolve([] as any[]),
    purchaseIds.length > 0
      ? db.select({ purchaseId: purchaseItemsTable.purchaseId, count: count() }).from(purchaseItemsTable)
          .where(inArray(purchaseItemsTable.purchaseId, purchaseIds)).groupBy(purchaseItemsTable.purchaseId)
      : Promise.resolve([] as any[]),
    purchaseIds.length > 0
      ? db.select({ purchaseId: purchaseItemsTable.purchaseId, productName: productsTable.name })
          .from(purchaseItemsTable)
          .innerJoin(productsTable, eq(purchaseItemsTable.productId, productsTable.id))
          .where(inArray(purchaseItemsTable.purchaseId, purchaseIds))
      : Promise.resolve([] as any[]),
  ]);

  const vendorMap = new Map(vendors.map((v: any) => [Number(v.id), v.name]));
  const itemCountMap = new Map(itemCounts.map((r: any) => [Number(r.purchaseId), Number(r.count)]));

  const productNamesMap = new Map<number, string[]>();
  for (const row of itemDetails as any[]) {
    const pid = Number(row.purchaseId);
    if (!productNamesMap.has(pid)) productNamesMap.set(pid, []);
    productNamesMap.get(pid)!.push(row.productName);
  }

  res.json({
    data: purchases.map((p: any) =>
      formatPurchase(p, vendorMap.get(Number(p.vendorId)), itemCountMap.get(Number(p.id)), productNamesMap.get(Number(p.id))),
    ),
    total: Number(totalResult[0].count),
    page,
    limit,
  });
});

// GET /purchases/pending-total — total amount still owed to ALL vendors
// (sum of amount - amount_paid across every non-deleted purchase), computed
// in the DB so it isn't limited by pagination like the list endpoint is.
// IMPORTANT: this MUST be declared before "/purchases/:id" below — Express
// matches routes top-to-bottom, and a "/purchases/:id" route declared first
// would swallow this request as id="pending-total" (which parses to NaN).
router.get("/purchases/pending-total", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) { res.status(400).json({ error: "business_id is required" }); return; }

  const [row] = await db.select({
    pending: sql<string>`coalesce(sum(${purchasesTable.amount} - ${purchasesTable.amountPaid}), 0)`,
  }).from(purchasesTable)
    .where(and(eq(purchasesTable.businessId, businessId), eq(purchasesTable.isDeleted, false)));

  res.json({ total_pending: parseFloat(row.pending ?? "0") });
});

// GET /purchases/:id — includes line items
router.get("/purchases/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const [purchase] = await db.select().from(purchasesTable)
    .where(and(eq(purchasesTable.id, id), eq(purchasesTable.isDeleted, false)));
  if (!purchase) { res.status(404).json({ error: "Purchase not found" }); return; }

  const [vendor] = await db.select({ name: vendorsTable.name }).from(vendorsTable).where(eq(vendorsTable.id, Number(purchase.vendorId)));
  const items = await db.select().from(purchaseItemsTable).where(eq(purchaseItemsTable.purchaseId, id));

  res.json({
    ...formatPurchase(purchase, vendor?.name, items.length),
    items: items.map((it: any) => ({
      id: Number(it.id),
      product_id: Number(it.productId),
      qty: parseFloat(it.qty),
      unit_cost: parseFloat(it.unitCost),
    })),
  });
});

// POST /purchases
router.post("/purchases", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreatePurchaseBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const d = parsed.data;
  const { userId } = (req as any).user as AuthPayload;

  const [vendor] = await db.select().from(vendorsTable).where(eq(vendorsTable.id, d.vendor_id));
  if (!vendor) { res.status(404).json({ error: "Vendor not found" }); return; }

  const itemsTotal = d.items.reduce((sum, it) => sum + it.qty * it.unit_cost, 0);
  const tax = d.tax ?? 0;
  const amount = itemsTotal + tax;
  const amountPaid = d.amount_paid ?? 0;
  const status = computeStatus(amount, amountPaid);

  const toDateStr = (v: string | Date | null | undefined): string | undefined =>
    v instanceof Date ? v.toISOString().split("T")[0] : (v as string | undefined);

  const [purchase] = await db.insert(purchasesTable).values({
    businessId: d.business_id,
    vendorId: d.vendor_id,
    invoiceNo: d.invoice_no,
    amount: amount.toString(),
    tax: tax.toString(),
    amountPaid: amountPaid.toString(),
    status,
    billImageUrl: d.bill_image_url,
    description: d.description,
    entryDate: toDateStr(d.entry_date) ?? new Date().toISOString().split("T")[0],
    createdBy: userId,
  }).returning();

  if (d.items.length > 0) {
    await db.insert(purchaseItemsTable).values(
      d.items.map((it) => ({
        purchaseId: purchase.id,
        productId: it.product_id,
        qty: it.qty.toString(),
        unitCost: it.unit_cost.toString(),
      })),
    );

    for (const it of d.items) {
      await db.update(productsTable)
        .set({ stockQty: sql`${productsTable.stockQty} + ${Math.round(it.qty)}` })
        .where(eq(productsTable.id, it.product_id));
    }
  }

  res.status(201).json(formatPurchase(purchase, vendor.name, d.items.length));
});

// PUT /purchases/:id — updates payment/status/meta only, not line items
router.put("/purchases/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const parsed = UpdatePurchaseBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const d = parsed.data;

  const [existing] = await db.select().from(purchasesTable)
    .where(and(eq(purchasesTable.id, id), eq(purchasesTable.isDeleted, false)));
  if (!existing) { res.status(404).json({ error: "Purchase not found" }); return; }

  const updates: any = {};
  if (d.invoice_no !== undefined) updates.invoiceNo = d.invoice_no;
  if (d.description !== undefined) updates.description = d.description;
  if (d.bill_image_url !== undefined) updates.billImageUrl = d.bill_image_url;
  if (d.tax !== undefined) updates.tax = d.tax.toString();
  if (d.entry_date) updates.entryDate = d.entry_date instanceof Date ? d.entry_date.toISOString().split("T")[0] : d.entry_date;

  const amount = parseFloat(existing.amount as string);
  if (d.amount_paid !== undefined) {
    updates.amountPaid = d.amount_paid.toString();
    updates.status = computeStatus(amount, d.amount_paid);
  }

  const [purchase] = await db.update(purchasesTable).set(updates)
    .where(and(eq(purchasesTable.id, id), eq(purchasesTable.isDeleted, false))).returning();

  const [vendor] = await db.select({ name: vendorsTable.name }).from(vendorsTable).where(eq(vendorsTable.id, Number(purchase.vendorId)));
  const itemCount = await db.select({ count: count() }).from(purchaseItemsTable).where(eq(purchaseItemsTable.purchaseId, id));

  res.json(formatPurchase(purchase, vendor?.name, Number(itemCount[0].count)));
});

// DELETE /purchases/:id
router.delete("/purchases/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const [purchase] = await db.update(purchasesTable).set({ isDeleted: true }).where(eq(purchasesTable.id, id)).returning();
  if (!purchase) { res.status(404).json({ error: "Purchase not found" }); return; }
  res.json({ message: "Purchase deleted" });
});

export default router;