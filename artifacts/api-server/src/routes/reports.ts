import { Router, type IRouter } from "express";
import { requireAuth } from "../middlewares/auth";
import { db, transactionsTable, customersTable, staffBusinessMapTable, usersTable, transactionItemsTable, productsTable, salesOrdersTable, returnsTable, purchasesTable, expensesTable, insertExpenseSchema  } from "@workspace/db";
import { eq, and, gte, count, desc, sql, inArray } from "drizzle-orm";

const router: IRouter = Router();


router.get("/reports/summary", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }

  const customerBalances = await db
    .select({ currentBalance: customersTable.currentBalance })
    .from(customersTable)
    .where(and(eq(customersTable.businessId, businessId), eq(customersTable.isDeleted, false)));

  let totalToCollect = 0;
  let totalToPay = 0;
  for (const row of customerBalances) {
    const bal = parseFloat(row.currentBalance ?? "0");
    if (bal > 0) totalToCollect += bal;
    if (bal < 0) totalToPay += Math.abs(bal);
  }

  res.json({
    total_to_collect: totalToCollect,
    total_to_pay: totalToPay,
    net_balance: totalToCollect - totalToPay,
  });
});
// GET /reports/summary
// router.get("/reports/tax-summary", requireAuth, async (req, res): Promise<void> => {
//   const businessId = parseInt(req.query.business_id as string, 10);
//   if (isNaN(businessId)) { res.status(400).json({ error: "business_id is required" }); return; }
//   const from = req.query.from as string | undefined;
//   const to = req.query.to as string | undefined;

//   const conditions: any[] = [
//     eq(salesOrdersTable.businessId, businessId),
//     eq(salesOrdersTable.isDeleted, false),
//     eq(salesOrdersTable.status, "invoiced"),
//   ];
//   if (from) conditions.push(gte(salesOrdersTable.entryDate, from));
//   if (to) conditions.push(sql`${salesOrdersTable.entryDate} <= ${to}`);

//   const [totals] = await db
//     .select({
//       totalGst: sql<string>`coalesce(sum(tax), 0)`,
//       totalTaxableSales: sql<string>`coalesce(sum(amount - tax), 0)`,
//       totalTaxFreeSales: sql<string>`coalesce(sum(amount) filter (where gst_rate = 0), 0)`,
//       totalInvoices: count(),
//     })
//     .from(salesOrdersTable)
//     .where(and(...conditions));

//   res.json({
//     total_gst: parseFloat(totals?.totalGst ?? "0"),
//     total_taxable_sales: parseFloat(totals?.totalTaxableSales ?? "0"),
//     total_tax_free_sales: parseFloat(totals?.totalTaxFreeSales ?? "0"),
//     total_invoices: Number(totals?.totalInvoices ?? 0),
//   });
// });
router.get("/reports/tax-summary", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) { res.status(400).json({ error: "business_id is required" }); return; }
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;

  const conditions: any[] = [
    eq(transactionsTable.businessId, businessId),
    eq(transactionsTable.isDeleted, false),
    eq(transactionsTable.type, "you_gave"),   // invoice/sale side of billing
  ];
  if (from) conditions.push(gte(transactionsTable.entryDate, from));
  if (to) conditions.push(sql`${transactionsTable.entryDate} <= ${to}`);

  const [totals] = await db
    .select({
      totalGst: sql<string>`coalesce(sum(tax), 0)`,
      totalTaxableSales: sql<string>`coalesce(sum(amount - tax), 0)`,
      totalTaxFreeSales: sql<string>`coalesce(sum(amount) filter (where gst_rate = 0), 0)`,
      totalInvoices: count(),
    })
    .from(transactionsTable)
    .where(and(...conditions));

  res.json({
    total_gst: parseFloat(totals?.totalGst ?? "0"),
    total_taxable_sales: parseFloat(totals?.totalTaxableSales ?? "0"),
    total_tax_free_sales: parseFloat(totals?.totalTaxFreeSales ?? "0"),
    total_invoices: Number(totals?.totalInvoices ?? 0),
  });
});
// router.get("/reports/tax-rate-summary", requireAuth, async (req, res): Promise<void> => {
//   const businessId = parseInt(req.query.business_id as string, 10);
//   if (isNaN(businessId)) { res.status(400).json({ error: "business_id is required" }); return; }
//   const from = req.query.from as string | undefined;
//   const to = req.query.to as string | undefined;

//   const conditions: any[] = [
//     eq(salesOrdersTable.businessId, businessId),
//     eq(salesOrdersTable.isDeleted, false),
//     eq(salesOrdersTable.status, "invoiced"),
//   ];
//   if (from) conditions.push(gte(salesOrdersTable.entryDate, from));
//   if (to) conditions.push(sql`${salesOrdersTable.entryDate} <= ${to}`);

//   const rows = await db
//     .select({
//       gstRate: salesOrdersTable.gstRate,
//       taxableAmount: sql<string>`coalesce(sum(amount - tax), 0)`,
//       gstAmount: sql<string>`coalesce(sum(tax), 0)`,
//       invoiceCount: count(),
//     })
//     .from(salesOrdersTable)
//     .where(and(...conditions))
//     .groupBy(salesOrdersTable.gstRate)
//     .orderBy(salesOrdersTable.gstRate);

//   res.json(
//     rows.map((r) => ({
//       gst_rate: parseFloat(r.gstRate ?? "0"),
//       taxable_amount: parseFloat(r.taxableAmount),
//       gst_amount: parseFloat(r.gstAmount),
//       invoice_count: Number(r.invoiceCount),
//     })),
//   );
// });

router.get("/reports/tax-rate-summary", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) { res.status(400).json({ error: "business_id is required" }); return; }
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;

  const conditions: any[] = [
    eq(transactionsTable.businessId, businessId),
    eq(transactionsTable.isDeleted, false),
    eq(transactionsTable.type, "you_gave"),
  ];
  if (from) conditions.push(gte(transactionsTable.entryDate, from));
  if (to) conditions.push(sql`${transactionsTable.entryDate} <= ${to}`);

  const rows = await db
    .select({
      gstRate: transactionsTable.gstRate,
      taxableAmount: sql<string>`coalesce(sum(amount - tax), 0)`,
      gstAmount: sql<string>`coalesce(sum(tax), 0)`,
      invoiceCount: count(),
    })
    .from(transactionsTable)
    .where(and(...conditions))
    .groupBy(transactionsTable.gstRate)
    .orderBy(transactionsTable.gstRate);

  res.json(
    rows.map((r) => ({
      gst_rate: parseFloat(r.gstRate ?? "0"),
      taxable_amount: parseFloat(r.taxableAmount),
      gst_amount: parseFloat(r.gstAmount),
      invoice_count: Number(r.invoiceCount),
    })),
  );
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

// GET /reports/payment-methods
// Payment Method Wise Sales — sums "you_got" (money collected) transactions
// grouped by payment_mode, over an optional date range. Every enum value is
// always present in the response (even with 0 total) so the UI can render a
// consistent list without conditionally hiding rows.
router.get("/reports/payment-methods", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }

  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;
  // type defaults to "you_got" (sales/collections). Pass ?type=you_gave to
  // get the payment-mode breakdown of money paid out instead.
  const type = (req.query.type as string) === "you_gave" ? "you_gave" : "you_got";

  const conditions: any[] = [
    eq(transactionsTable.businessId, businessId),
    eq(transactionsTable.isDeleted, false),
    eq(transactionsTable.type, type),
  ];
  const filter = (req.query.filter as string) ?? "all";
  const now = new Date();
  if (filter === "today") {
    const today = now.toISOString().split("T")[0];
    conditions.push(eq(transactionsTable.entryDate, today));
  } else if (filter === "week") {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    conditions.push(gte(transactionsTable.entryDate, weekAgo));
  } else if (filter === "month") {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    conditions.push(gte(transactionsTable.entryDate, monthAgo));
  } else if (from || to) {
    // still support explicit from/to for anything else that calls this endpoint that way
    if (from) conditions.push(gte(transactionsTable.entryDate, from));
    if (to) conditions.push(sql`${transactionsTable.entryDate} <= ${to}`);
  }

  const rows = await db
    .select({
      payment_mode: transactionsTable.paymentMode,
      total: sql<string>`coalesce(sum(amount), 0)`,
      transaction_count: count(),
    })
    .from(transactionsTable)
    .where(and(...conditions))
    .groupBy(transactionsTable.paymentMode);

  // paymentModeEnum values, kept in sync manually with db/src/schema/transactions.ts
  const ALL_PAYMENT_MODES = ["cash", "online", "cheque", "upi"] as const;

  const byMode = new Map(rows.map((r) => [r.payment_mode, r]));
  const result = ALL_PAYMENT_MODES.map((mode) => {
    const row = byMode.get(mode);
    return {
      payment_mode: mode,
      total_amount: parseFloat(row?.total ?? "0"),
      transaction_count: Number(row?.transaction_count ?? 0),
    };
  });

  const grandTotal = result.reduce((sum, r) => sum + r.total_amount, 0);

  res.json({
    type,
    from: from ?? null,
    to: to ?? null,
    total_amount: grandTotal,
    payment_methods: result,
  });
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


// GET /reports/tax-invoice-details
// GET /reports/tax-invoice-details
router.get("/reports/tax-invoice-details", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) { res.status(400).json({ error: "business_id is required" }); return; }
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;

  const conditions: any[] = [
    eq(transactionsTable.businessId, businessId),
    eq(transactionsTable.isDeleted, false),
    eq(transactionsTable.type, "you_gave"),
  ];
  if (from) conditions.push(gte(transactionsTable.entryDate, from));
  if (to) conditions.push(sql`${transactionsTable.entryDate} <= ${to}`);

  const orders = await db
    .select()
    .from(transactionsTable)
    .where(and(...conditions))
    .orderBy(desc(transactionsTable.entryDate))
    .limit(100);

  const customerIds = [...new Set(orders.map((o) => Number(o.customerId)))];
  const customers = customerIds.length > 0
    ? await db.select({ id: customersTable.id, name: customersTable.name }).from(customersTable).where(inArray(customersTable.id, customerIds))
    : [];
  const customerMap = new Map(customers.map((c) => [Number(c.id), c.name]));

  res.json(
    orders.map((o) => {
      const amount = parseFloat(o.amount ?? "0");
      const tax = parseFloat(o.tax ?? "0");
      return {
        invoice_no: o.invoiceNo ?? "—",
        date: o.entryDate,
        customer: customerMap.get(Number(o.customerId)) ?? "",
        gst_rate: parseFloat(o.gstRate ?? "0"),
        taxable_amount: amount - tax,
        gst_amount: tax,
        total_amount: amount,
      };
    }),
  );
});

// GET /reports/product-sales
// Per-product qty sold, revenue, cost, and profit — aggregated from
// transaction_items joined to transactions (type=you_gave, since that's the
// transaction type the billing screen attaches line items to for a sale)
// and products (for name/sku/category). unit_cost on each line item is a
// snapshot of the product's cost_price at time of sale, so profit stays
// accurate even if cost_price changes later.
router.get("/reports/product-sales", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;

  const conditions: any[] = [
  eq(transactionsTable.businessId, businessId),
  eq(transactionsTable.isDeleted, false),
  eq(transactionsTable.type, "you_gave"),   
];

  const filter = (req.query.filter as string) ?? "all";
  const now = new Date();
  if (filter === "today") {
    const today = now.toISOString().split("T")[0];
    conditions.push(eq(transactionsTable.entryDate, today));
  } else if (filter === "week") {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    conditions.push(gte(transactionsTable.entryDate, weekAgo));
  } else if (filter === "month") {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    conditions.push(gte(transactionsTable.entryDate, monthAgo));
  } else if (from || to) {
    if (from) conditions.push(gte(transactionsTable.entryDate, from));
    if (to) conditions.push(sql`${transactionsTable.entryDate} <= ${to}`);
  }

  const rows = await db
    .select({
      productId: transactionItemsTable.productId,
      name: productsTable.name,
      sku: productsTable.sku,
      category: productsTable.category,
      qtySold: sql<string>`coalesce(sum(${transactionItemsTable.qty}), 0)`,
      salesAmount: sql<string>`coalesce(sum(${transactionItemsTable.qty} * ${transactionItemsTable.unitPrice}), 0)`,
      costAmount: sql<string>`coalesce(sum(${transactionItemsTable.qty} * ${transactionItemsTable.unitCost}), 0)`,
      lastSaleDate: sql<string>`max(${transactionsTable.entryDate})`, 
    })
    .from(transactionItemsTable)
    .innerJoin(transactionsTable, eq(transactionItemsTable.transactionId, transactionsTable.id))
    .innerJoin(productsTable, eq(transactionItemsTable.productId, productsTable.id))
    .where(and(...conditions))
    .groupBy(transactionItemsTable.productId, productsTable.name, productsTable.sku, productsTable.category)
    .orderBy(desc(sql`sum(${transactionItemsTable.qty} * ${transactionItemsTable.unitPrice})`));

  res.json(
    rows.map((r) => {
      const salesAmount = parseFloat(r.salesAmount);
      const costAmount = parseFloat(r.costAmount);
      return {
        product_id: Number(r.productId),
        name: r.name,
        sku: r.sku,
        category: r.category,
        qty_sold: parseFloat(r.qtySold),
        sales_amount: salesAmount,
        cost_amount: costAmount,
        profit: salesAmount - costAmount,
        last_sale_date: r.lastSaleDate,
      };
    }),
  );
});


// GET /reports/employee-performance
// Real bills-count + sales-total per staff member, joined from
// staff_business_map -> users (for name/phone/role) and aggregated from
// transactions (type=you_got, grouped by created_by). Optional ?from/&to
// date range filters on entry_date. Refunds/login/logout/attendance have no
// backing columns anywhere yet, so the frontend fills those in separately.
router.get("/reports/employee-performance", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;

  const staff = await db
    .select({
      staffId: staffBusinessMapTable.id,
      userId: staffBusinessMapTable.userId,
      name: usersTable.name,
      phone: usersTable.phone,
      profileImage: usersTable.profileImage,
      role: usersTable.role,
      permissions: staffBusinessMapTable.permissions,
    })
    .from(staffBusinessMapTable)
    .innerJoin(usersTable, eq(usersTable.id, staffBusinessMapTable.userId))
    .where(eq(staffBusinessMapTable.businessId, businessId));

  if (staff.length === 0) {
    res.json([]);
    return;
  }

  const staffUserIds = staff.map((s) => s.userId);

  const txConditions: any[] = [
    eq(transactionsTable.businessId, businessId),
    eq(transactionsTable.isDeleted, false),
    eq(transactionsTable.type, "you_got"),
    inArray(transactionsTable.createdBy, staffUserIds),
  ];
  if (from) txConditions.push(gte(transactionsTable.entryDate, from));
  if (to) txConditions.push(sql`${transactionsTable.entryDate} <= ${to}`);

  const perf = await db
    .select({
      createdBy: transactionsTable.createdBy,
      bills: count(),
      sales: sql<string>`coalesce(sum(amount), 0)`,
    })
    .from(transactionsTable)
    .where(and(...txConditions))
    .groupBy(transactionsTable.createdBy);

  const perfMap = new Map(perf.map((p) => [Number(p.createdBy), p]));

  const result = staff.map((s) => {
    const p = perfMap.get(Number(s.userId));
    return {
      staff_id: Number(s.staffId),
      user_id: Number(s.userId),
      name: s.name,
      phone: s.phone,
      profile_image: s.profileImage,
      role: s.role,
      permissions: s.permissions ?? {},
      bills: Number(p?.bills ?? 0),
      sales: parseFloat(p?.sales ?? "0"),
    };
  });

  res.json(result);
});

// PUT /businesses/:id/staff/:staffId — update a staff member's permissions
router.put("/businesses/:id/staff/:staffId", requireAuth, async (req, res): Promise<void> => {
  const staffIdRaw = Array.isArray(req.params.staffId) ? req.params.staffId[0] : req.params.staffId;
  const staffId = parseInt(staffIdRaw, 10);
  if (isNaN(staffId)) {
    res.status(400).json({ error: "Invalid staff id" });
    return;
  }

  const permissions = req.body?.permissions ?? {};

  const [updated] = await db
    .update(staffBusinessMapTable)
    .set({ permissions })
    .where(eq(staffBusinessMapTable.id, staffId))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Staff member not found" });
    return;
  }

  res.json({
    id: Number(updated.id),
    business_id: Number(updated.businessId),
    user_id: Number(updated.userId),
    permissions: updated.permissions ?? {},
  });
});

// DELETE /businesses/:id/staff/:staffId — remove a staff member from the business
router.delete("/businesses/:id/staff/:staffId", requireAuth, async (req, res): Promise<void> => {
  const staffIdRaw = Array.isArray(req.params.staffId) ? req.params.staffId[0] : req.params.staffId;
  const staffId = parseInt(staffIdRaw, 10);
  if (isNaN(staffId)) {
    res.status(400).json({ error: "Invalid staff id" });
    return;
  }

  const [deleted] = await db
    .delete(staffBusinessMapTable)
    .where(eq(staffBusinessMapTable.id, staffId))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Staff member not found" });
    return;
  }

  res.status(204).send();
});

// GET /reports/returns
// Real returns pulled from the returns table, joined to transactions (for
// invoice_no + customer) and products (for name). return_rate compares
// total returned amount against total "you_gave" sales revenue for the
// same period, same basis as /reports/profit-loss.
router.get("/reports/returns", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;

  const REASON_LABEL: Record<string, string> = {
    damaged: "Damaged",
    expired: "Expired",
    wrong_item: "Wrong Item",
    customer_return: "Customer Return",
    other: "Other",
  };

  const conditions: any[] = [eq(returnsTable.businessId, businessId), eq(returnsTable.isDeleted, false)];

  const filter = (req.query.filter as string) ?? "all";
  const now = new Date();
  if (filter === "today") {
    const today = now.toISOString().split("T")[0];
    conditions.push(eq(returnsTable.entryDate, today));
  } else if (filter === "week") {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    conditions.push(gte(returnsTable.entryDate, weekAgo));
  } else if (filter === "month") {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    conditions.push(gte(returnsTable.entryDate, monthAgo));
  } else if (from || to) {
    if (from) conditions.push(gte(returnsTable.entryDate, from));
    if (to) conditions.push(sql`${returnsTable.entryDate} <= ${to}`);
  }

  const rows = await db
    .select({
      id: returnsTable.id,
      transactionId: returnsTable.transactionId,
      productId: returnsTable.productId,
      qty: returnsTable.qty,
      returnAmount: returnsTable.returnAmount,
      reason: returnsTable.reason,
      refunded: returnsTable.refunded,
      entryDate: returnsTable.entryDate,
      invoiceNo: transactionsTable.invoiceNo,
      customerId: transactionsTable.customerId,
      productName: productsTable.name,
    })
    .from(returnsTable)
    .innerJoin(transactionsTable, eq(returnsTable.transactionId, transactionsTable.id))
    .innerJoin(productsTable, eq(returnsTable.productId, productsTable.id))
    .where(and(...conditions))
    .orderBy(desc(returnsTable.entryDate))
    .limit(200);

  const customerIds = [...new Set(rows.map((r) => Number(r.customerId)).filter((id) => !isNaN(id)))];
  const customers = customerIds.length > 0
    ? await db.select({ id: customersTable.id, name: customersTable.name }).from(customersTable).where(inArray(customersTable.id, customerIds))
    : [];
  const customerMap = new Map(customers.map((c) => [Number(c.id), c.name]));

  const items = rows.map((r) => ({
    id: Number(r.id),
    invoice_no: r.invoiceNo ?? "—",
    product_name: r.productName,
    customer_name: customerMap.get(Number(r.customerId)) ?? "",
    qty: parseFloat(r.qty),
    return_amount: parseFloat(r.returnAmount),
    reason: REASON_LABEL[r.reason] ?? r.reason,
    return_date: r.entryDate,
  }));

  const totalReturns = items.length;
  const returnAmount = items.reduce((s, i) => s + i.return_amount, 0);
  const refundedAmount = rows.filter((r) => r.refunded).reduce((s, r) => s + parseFloat(r.returnAmount), 0);

  // Return rate = returned amount / total sales revenue in the same window
  const salesConditions: any[] = [
    eq(transactionsTable.businessId, businessId),
    eq(transactionsTable.isDeleted, false),
    eq(transactionsTable.type, "you_gave"),
  ];
  if (filter === "today") salesConditions.push(eq(transactionsTable.entryDate, now.toISOString().split("T")[0]));
  else if (filter === "week") salesConditions.push(gte(transactionsTable.entryDate, new Date(now.getTime() - 7 * 86400000).toISOString().split("T")[0]));
  else if (filter === "month") salesConditions.push(gte(transactionsTable.entryDate, new Date(now.getTime() - 30 * 86400000).toISOString().split("T")[0]));
  else if (from || to) {
    if (from) salesConditions.push(gte(transactionsTable.entryDate, from));
    if (to) salesConditions.push(sql`${transactionsTable.entryDate} <= ${to}`);
  }
  const [salesTotals] = await db
    .select({ totalSales: sql<string>`coalesce(sum(${transactionItemsTable.qty} * ${transactionItemsTable.unitPrice}), 0)` })
    .from(transactionItemsTable)
    .innerJoin(transactionsTable, eq(transactionItemsTable.transactionId, transactionsTable.id))
    .where(and(...salesConditions));

  const totalSales = parseFloat(salesTotals?.totalSales ?? "0");
  const returnRate = totalSales > 0 ? (returnAmount / totalSales) * 100 : 0;

  res.json({
    total_returns: totalReturns,
    return_amount: returnAmount,
    refunded_amount: refundedAmount,
    return_rate: returnRate,
    items,
  });
});

// GET /reports/profit-loss
// Sales revenue comes from transactions (type=you_gave, same convention as
// product-sales/tax-summary above). Purchase cost comes from the purchases
// table. No expenses table exists yet, so operating_expenses/other_income
// are hardcoded to 0 until that module is built.
router.get("/reports/profit-loss", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;
  const filter = (req.query.filter as string) ?? "all";
  const now = new Date();

  function applyDateFilter(conditions: any[], dateCol: any) {
    if (filter === "today") {
      const today = now.toISOString().split("T")[0];
      conditions.push(eq(dateCol, today));
    } else if (filter === "week") {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      conditions.push(gte(dateCol, weekAgo));
    } else if (filter === "month") {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
      conditions.push(gte(dateCol, monthAgo));
    } else if (from || to) {
      if (from) conditions.push(gte(dateCol, from));
      if (to) conditions.push(sql`${dateCol} <= ${to}`);
    }
  }

  // ---- Sales revenue ----
  const salesConditions: any[] = [
    eq(transactionsTable.businessId, businessId),
    eq(transactionsTable.isDeleted, false),
    eq(transactionsTable.type, "you_gave"),
  ];
  applyDateFilter(salesConditions, transactionsTable.entryDate);

  const [salesTotals] = await db
    .select({ total: sql<string>`coalesce(sum(amount), 0)` })
    .from(transactionsTable)
    .where(and(...salesConditions));
  const salesRevenue = parseFloat(salesTotals?.total ?? "0");

  // ---- Purchase cost ----
  const purchaseConditions: any[] = [
    eq(purchasesTable.businessId, businessId),
    eq(purchasesTable.isDeleted, false),
  ];
  applyDateFilter(purchaseConditions, purchasesTable.entryDate);

  const [purchaseTotals] = await db
    .select({ total: sql<string>`coalesce(sum(amount), 0)` })
    .from(purchasesTable)
    .where(and(...purchaseConditions));
  const purchaseCost = parseFloat(purchaseTotals?.total ?? "0");

  const operatingExpenses = 0; // no expenses module yet
  const otherIncome = 0;

  const grossProfit = salesRevenue - purchaseCost;
  const netProfit = grossProfit - operatingExpenses + otherIncome;

  // ---- Monthly breakdown (last 6 months, independent of the filter above) ----
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString().split("T")[0];

  const monthlySales = await db
    .select({
      month: sql<string>`to_char(${transactionsTable.entryDate}::date, 'Mon YYYY')`,
      monthKey: sql<string>`to_char(${transactionsTable.entryDate}::date, 'YYYY-MM')`,
      total: sql<string>`coalesce(sum(amount), 0)`,
    })
    .from(transactionsTable)
    .where(and(
      eq(transactionsTable.businessId, businessId),
      eq(transactionsTable.isDeleted, false),
      eq(transactionsTable.type, "you_gave"),
      gte(transactionsTable.entryDate, sixMonthsAgo),
    ))
    .groupBy(
      sql`to_char(${transactionsTable.entryDate}::date, 'Mon YYYY')`,
      sql`to_char(${transactionsTable.entryDate}::date, 'YYYY-MM')`,
    )
    .orderBy(sql`to_char(${transactionsTable.entryDate}::date, 'YYYY-MM')`);

  const monthlyPurchases = await db
    .select({
      monthKey: sql<string>`to_char(${purchasesTable.entryDate}::date, 'YYYY-MM')`,
      total: sql<string>`coalesce(sum(amount), 0)`,
    })
    .from(purchasesTable)
    .where(and(
      eq(purchasesTable.businessId, businessId),
      eq(purchasesTable.isDeleted, false),
      gte(purchasesTable.entryDate, sixMonthsAgo),
    ))
    .groupBy(sql`to_char(${purchasesTable.entryDate}::date, 'YYYY-MM')`);

  const purchaseByMonth = new Map(monthlyPurchases.map((p) => [p.monthKey, parseFloat(p.total)]));

  const monthly = monthlySales.map((m) => {
    const revenue = parseFloat(m.total);
    const expenses = purchaseByMonth.get(m.monthKey) ?? 0;
    return { month: m.month, revenue, expenses, profit: revenue - expenses };
  });

  res.json({
    summary: {
      sales_revenue: salesRevenue,
      purchase_cost: purchaseCost,
      operating_expenses: operatingExpenses,
      other_income: otherIncome,
      gross_profit: grossProfit,
      net_profit: netProfit,
    },
    monthly,
  });
});

// GET /reports/expenses — summary totals + breakdowns for the Expense Report section
router.get("/reports/expenses", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const from = req.query.from as string | undefined;
  const to = req.query.to as string | undefined;
  const filter = (req.query.filter as string) ?? "all";
  const now = new Date();

  const conditions: any[] = [
    eq(expensesTable.businessId, businessId),
    eq(expensesTable.isDeleted, false),
  ];

  if (filter === "today") {
    const today = now.toISOString().split("T")[0];
    conditions.push(eq(expensesTable.entryDate, today));
  } else if (filter === "week") {
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    conditions.push(gte(expensesTable.entryDate, weekAgo));
  } else if (filter === "month") {
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    conditions.push(gte(expensesTable.entryDate, monthAgo));
  } else if (from || to) {
    if (from) conditions.push(gte(expensesTable.entryDate, from));
    if (to) conditions.push(sql`${expensesTable.entryDate} <= ${to}`);
  }

  const [totals] = await db
    .select({ total: sql<string>`coalesce(sum(amount), 0)`, count: count() })
    .from(expensesTable)
    .where(and(...conditions));

  const byCategory = await db
    .select({ category: expensesTable.category, total: sql<string>`coalesce(sum(amount), 0)`, count: count() })
    .from(expensesTable)
    .where(and(...conditions))
    .groupBy(expensesTable.category)
    .orderBy(desc(sql`sum(amount)`));

  const byPaymentMode = await db
    .select({ paymentMode: expensesTable.paymentMode, total: sql<string>`coalesce(sum(amount), 0)`, count: count() })
    .from(expensesTable)
    .where(and(...conditions))
    .groupBy(expensesTable.paymentMode)
    .orderBy(desc(sql`sum(amount)`));

  const recentRows = await db
    .select()
    .from(expensesTable)
    .where(and(...conditions))
    .orderBy(desc(expensesTable.entryDate))
    .limit(50);

  const totalExpense = parseFloat(totals?.total ?? "0");
  const expenseCount = Number(totals?.count ?? 0);

  res.json({
    total_expense: totalExpense,
    expense_count: expenseCount,
    avg_expense: expenseCount > 0 ? totalExpense / expenseCount : 0,
    by_category: byCategory.map((c) => ({
      category: c.category,
      total_amount: parseFloat(c.total),
      transaction_count: Number(c.count),
    })),
    by_payment_mode: byPaymentMode.map((p) => ({
      payment_mode: p.paymentMode,
      total_amount: parseFloat(p.total),
      transaction_count: Number(p.count),
    })),
    entries: recentRows.map((r) => ({
      id: Number(r.id),
      category: r.category,
      payee_name: r.payeeName,
      description: r.description,
      amount: parseFloat(r.amount),
      payment_mode: r.paymentMode,
      entry_date: r.entryDate,
    })),
  });
});

export default router;