import { Router, type IRouter } from "express";
import { requireAuth } from "../middlewares/auth";
import { db, expensesTable, insertExpenseSchema } from "@workspace/db";
import { eq, and, gte, sql, desc, count } from "drizzle-orm";

const router: IRouter = Router();

// GET /expenses — list expenses for a business, optional date range
router.get("/expenses", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;
  const limit = parseInt(req.query.limit as string) || 20;

  const conditions: any[] = [
    eq(expensesTable.businessId, businessId),
    eq(expensesTable.isDeleted, false),
  ];
  if (from) conditions.push(gte(expensesTable.entryDate, from));
  if (to) conditions.push(sql`${expensesTable.entryDate} <= ${to}`);

  const rows = await db
    .select()
    .from(expensesTable)
    .where(and(...conditions))
    .orderBy(desc(expensesTable.entryDate))
    .limit(limit);

  res.json({
    data: rows.map((r) => ({
      id: Number(r.id),
      business_id: Number(r.businessId),
      category: r.category,
      payee_name: r.payeeName,
      amount: parseFloat(r.amount),
      payment_mode: r.paymentMode,
      receipt_image_url: r.receiptImageUrl,
      description: r.description,
      entry_date: r.entryDate,
      created_by: Number(r.createdBy),
      created_at: r.createdAt,
    })),
  });
});

// POST /expenses — create a new expense entry
router.post("/expenses", requireAuth, async (req, res): Promise<void> => {
  const body = req.body;
  const authUser = (req as any).user as { userId: number; role: string };

  const mapped = {
    businessId: Number(body.business_id),
    category: body.category,
    payeeName: body.payee_name || undefined,
    amount: String(body.amount),
    paymentMode: body.payment_mode,
    paymentDetails: body.payment_details ?? {},
    receiptImageUrl: body.receipt_image_url || undefined,
    description: body.description || undefined,
    entryDate: body.entry_date,
    createdBy: authUser.userId,
  };

  const parsed = insertExpenseSchema.safeParse(mapped);
  if (!parsed.success) {
    console.error("Expense validation failed:", JSON.stringify(parsed.error.issues, null, 2));
    res.status(400).json({ error: "Invalid expense data", details: parsed.error.issues });
    return;
  }

  const [created] = await db.insert(expensesTable).values(parsed.data).returning();

  res.status(201).json({
    id: Number(created.id),
    business_id: Number(created.businessId),
    category: created.category,
    payee_name: created.payeeName,
    amount: parseFloat(created.amount),
    payment_mode: created.paymentMode,
    payment_details: created.paymentDetails ?? {},
    entry_date: created.entryDate,
  });
});

// GET /reports/expenses — summary totals for the Expense Report section
router.get("/reports/expenses", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;

  const conditions: any[] = [
    eq(expensesTable.businessId, businessId),
    eq(expensesTable.isDeleted, false),
  ];
  if (from) conditions.push(gte(expensesTable.entryDate, from));
  if (to) conditions.push(sql`${expensesTable.entryDate} <= ${to}`);

  const [totals] = await db
    .select({ total: sql<string>`coalesce(sum(amount), 0)`, count: count() })
    .from(expensesTable)
    .where(and(...conditions));

  const byCategory = await db
    .select({ category: expensesTable.category, total: sql<string>`coalesce(sum(amount), 0)` ,count: count(), })
    .from(expensesTable)
    .where(and(...conditions))
    .groupBy(expensesTable.category);
    

  res.json({
    total_expense: parseFloat(totals?.total ?? "0"),
    expense_count: Number(totals?.count ?? 0),
    by_category: byCategory.map((c) => ({
      category: c.category,
      total_amount: parseFloat(c.total),
      transaction_count: Number(c.count),
    })),
  });
});

export default router;