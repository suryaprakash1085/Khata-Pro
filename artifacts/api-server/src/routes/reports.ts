import { Router, type IRouter } from "express";
import { db, transactionsTable, customersTable } from "@workspace/db";
import { eq, and, gte, count, desc, sql } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";

const router: IRouter = Router();

// GET /reports/summary
router.get("/reports/summary", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }

  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  const [customers, totalTx, typeTotals, todayTotals, weekTotals] = await Promise.all([
    db.select({ count: count() }).from(customersTable)
      .where(and(eq(customersTable.businessId, businessId), eq(customersTable.isDeleted, false))),
    db.select({ count: count() }).from(transactionsTable)
      .where(and(eq(transactionsTable.businessId, businessId), eq(transactionsTable.isDeleted, false))),
    db.select({ type: transactionsTable.type, total: sql<string>`coalesce(sum(amount), 0)` })
      .from(transactionsTable)
      .where(and(eq(transactionsTable.businessId, businessId), eq(transactionsTable.isDeleted, false)))
      .groupBy(transactionsTable.type),
    db.select({ type: transactionsTable.type, total: sql<string>`coalesce(sum(amount), 0)` })
      .from(transactionsTable)
      .where(and(eq(transactionsTable.businessId, businessId), eq(transactionsTable.isDeleted, false), eq(transactionsTable.entryDate, today)))
      .groupBy(transactionsTable.type),
    db.select({ type: transactionsTable.type, total: sql<string>`coalesce(sum(amount), 0)` })
      .from(transactionsTable)
      .where(and(eq(transactionsTable.businessId, businessId), eq(transactionsTable.isDeleted, false), gte(transactionsTable.entryDate, weekAgo)))
      .groupBy(transactionsTable.type),
  ]);

  const getVal = (rows: any[], type: string) => parseFloat(rows.find((r) => r.type === type)?.total ?? "0");

  res.json({
    total_to_collect: getVal(typeTotals, "you_gave"),
    total_to_pay: getVal(typeTotals, "you_got"),
    net_balance: getVal(typeTotals, "you_gave") - getVal(typeTotals, "you_got"),
    total_customers: Number(customers[0].count),
    total_transactions: Number(totalTx[0].count),
    today_collection: getVal(todayTotals, "you_got"),
    today_payment: getVal(todayTotals, "you_gave"),
    week_collection: getVal(weekTotals, "you_got"),
    week_payment: getVal(weekTotals, "you_gave"),
  });
});

// GET /reports/top-customers
router.get("/reports/top-customers", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const limit = parseInt(req.query.limit as string) || 10;

  const customers = await db
    .select({
      id: customersTable.id,
      name: customersTable.name,
      phone: customersTable.phone,
      current_balance: customersTable.currentBalance,
      transaction_count: count(transactionsTable.id),
    })
    .from(customersTable)
    .leftJoin(transactionsTable, and(eq(transactionsTable.customerId, customersTable.id), eq(transactionsTable.isDeleted, false)))
    .where(and(eq(customersTable.businessId, businessId), eq(customersTable.isDeleted, false)))
    .groupBy(customersTable.id)
    .orderBy(desc(customersTable.currentBalance))
    .limit(limit);

  res.json(customers.map((c) => ({
    id: Number(c.id),
    name: c.name,
    phone: c.phone,
    current_balance: parseFloat(c.current_balance ?? "0"),
    transaction_count: Number(c.transaction_count),
  })));
});

// GET /reports/daybook
router.get("/reports/daybook", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;

  const conditions: any[] = [eq(transactionsTable.businessId, businessId), eq(transactionsTable.isDeleted, false)];
  if (from) conditions.push(gte(transactionsTable.entryDate, from));
  if (to) conditions.push(sql`${transactionsTable.entryDate} <= ${to}`);

  const transactions = await db.select().from(transactionsTable)
    .where(and(...conditions)).orderBy(desc(transactionsTable.entryDate)).limit(200);

  // Fetch customer names
  const customerIds = [...new Set(transactions.map((t) => Number(t.customerId)))];
  const customers = customerIds.length > 0
    ? await db.select({ id: customersTable.id, name: customersTable.name }).from(customersTable).where(sql`${customersTable.id} = ANY(${customerIds})`)
    : [];
  const customerMap = new Map(customers.map((c) => [Number(c.id), c.name]));

  // Group by date
  const grouped = new Map<string, any>();
  for (const tx of transactions) {
    const date = tx.entryDate;
    if (!grouped.has(date)) grouped.set(date, { date, transactions: [], total_gave: 0, total_got: 0 });
    const group = grouped.get(date);
    const amt = parseFloat(tx.amount ?? "0");
    if (tx.type === "you_gave") group.total_gave += amt;
    else group.total_got += amt;
    group.transactions.push({
      id: Number(tx.id),
      business_id: Number(tx.businessId),
      customer_id: Number(tx.customerId),
      customer_name: customerMap.get(Number(tx.customerId)) ?? "",
      type: tx.type,
      amount: amt,
      balance_after: parseFloat(tx.balanceAfter ?? "0"),
      description: tx.description,
      bill_image_url: tx.billImageUrl,
      payment_mode: tx.paymentMode,
      entry_date: tx.entryDate,
      due_date: tx.dueDate,
      created_by: Number(tx.createdBy),
      created_at: tx.createdAt,
    });
  }

  res.json([...grouped.values()]);
});

// GET /reports/cashbook
router.get("/reports/cashbook", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;

  const conditions: any[] = [eq(transactionsTable.businessId, businessId), eq(transactionsTable.isDeleted, false)];
  if (from) conditions.push(gte(transactionsTable.entryDate, from));
  if (to) conditions.push(sql`${transactionsTable.entryDate} <= ${to}`);

  const daily = await db.select({
    date: transactionsTable.entryDate,
    type: transactionsTable.type,
    total: sql<string>`coalesce(sum(amount), 0)`,
  }).from(transactionsTable).where(and(...conditions)).groupBy(transactionsTable.entryDate, transactionsTable.type);

  const dateMap = new Map<string, { date: string; income: number; expense: number }>();
  let totalIncome = 0;
  let totalExpense = 0;
  for (const row of daily) {
    if (!dateMap.has(row.date)) dateMap.set(row.date, { date: row.date, income: 0, expense: 0 });
    const entry = dateMap.get(row.date)!;
    const amt = parseFloat(row.total ?? "0");
    if (row.type === "you_got") { entry.income += amt; totalIncome += amt; }
    else { entry.expense += amt; totalExpense += amt; }
  }

  res.json({
    total_income: totalIncome,
    total_expense: totalExpense,
    net: totalIncome - totalExpense,
    entries: [...dateMap.values()].sort((a, b) => b.date.localeCompare(a.date)),
  });
});

export default router;
