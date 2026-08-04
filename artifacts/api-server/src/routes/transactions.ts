// import { Router, type IRouter } from "express";
// import { db, transactionsTable, customersTable, productsTable, transactionItemsTable } from "@workspace/db";
// import { requireAuth, AuthPayload } from "../middlewares/auth";
// import {
//   CreateTransactionBody,
//   UpdateTransactionBody,
// } from "@workspace/api-zod";


// const router: IRouter = Router();

// function formatTransaction(t: any, customerName?: string) {
//   return {
//     id: Number(t.id),
//     business_id: Number(t.businessId),
//     customer_id: Number(t.customerId),
//     customer_name: customerName ?? "",
//     type: t.type,
//     amount: parseFloat(t.amount ?? "0"),
//     balance_after: parseFloat(t.balanceAfter ?? "0"),
//     description: t.description,
//     bill_image_url: t.billImageUrl,
//     payment_mode: t.paymentMode,
//     entry_date: t.entryDate,
//     due_date: t.dueDate,
//     created_by: Number(t.createdBy),
//     created_at: t.createdAt,
//   };
// }

// // GET /transactions
// router.get("/transactions", requireAuth, async (req, res): Promise<void> => {
//   const businessId = parseInt(req.query.business_id as string, 10);
//   if (isNaN(businessId)) {
//     res.status(400).json({ error: "business_id is required" });
//     return;
//   }
//   const customerId = req.query.customer_id ? parseInt(req.query.customer_id as string, 10) : undefined;
//   const type = req.query.type as string | undefined; // ADD THIS LINE
//   const filter = (req.query.filter as string) ?? "all";
//   const page = parseInt(req.query.page as string) || 1;
//   const limit = parseInt(req.query.limit as string) || 50;
//   const offset = (page - 1) * limit;

//   const conditions: any[] = [eq(transactionsTable.businessId, businessId), eq(transactionsTable.isDeleted, false)];
//   if (customerId) conditions.push(eq(transactionsTable.customerId, customerId));
//   if (type === "you_got" || type === "you_gave") conditions.push(eq(transactionsTable.type, type)); // ADD THIS LINE


//   const now = new Date();
//   if (filter === "today") {
//     const today = now.toISOString().split("T")[0];
//     conditions.push(eq(transactionsTable.entryDate, today));
//   } else if (filter === "week") {
//     const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
//     conditions.push(gte(transactionsTable.entryDate, weekAgo));
//   } else if (filter === "month") {
//     const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
//     conditions.push(gte(transactionsTable.entryDate, monthAgo));
//   }

//   const [transactions, totalResult] = await Promise.all([
//     db.select().from(transactionsTable).where(and(...conditions)).limit(limit).offset(offset).orderBy(desc(transactionsTable.entryDate)),
//     db.select({ count: count() }).from(transactionsTable).where(and(...conditions)),
//   ]);

//   // Fetch customer names

// const customerIds = [...new Set(transactions.map((t: any) => Number(t.customerId)))];
// const customers = customerIds.length > 0
//   ? await db.select({ id: customersTable.id, name: customersTable.name }).from(customersTable).where(inArray(customersTable.id, customerIds))
//   : [];
// const customerMap = new Map(customers.map((c) => [Number(c.id), c.name]));

//   res.json({
//     data: transactions.map((t: any) => formatTransaction(t, customerMap.get(Number(t.customerId)))),
//     total: Number(totalResult[0].count),
//     page,
//     limit,
//   });
// });

// // POST /transactions
// router.post("/transactions", requireAuth, async (req, res): Promise<void> => {
//   const parsed = CreateTransactionBody.safeParse(req.body);
//   if (!parsed.success) {
//     res.status(400).json({ error: parsed.error.message });
//     return;
//   }
//   const d = parsed.data;
//   const { userId } = (req as any).user as AuthPayload;

//   // Get current balance of customer
//   const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, d.customer_id));
//   if (!customer) {
//     res.status(404).json({ error: "Customer not found" });
//     return;
//   }
//   const currentBalance = parseFloat(customer.currentBalance ?? "0");
//   const amount = parseFloat(d.amount?.toString() ?? "0");
//   // you_gave = we lent money (customer owes us more) = positive balance
//   // you_got = we received money (customer owes us less) = negative balance
//   const newBalance = d.type === "you_gave" ? currentBalance + amount : currentBalance - amount;

//   const toDateStr = (v: string | Date | null | undefined): string | null | undefined =>
//     v instanceof Date ? v.toISOString().split("T")[0] : v as string | null | undefined;

//   const [tx] = await db.insert(transactionsTable).values({
//     businessId: d.business_id,
//     customerId: d.customer_id,
//     type: d.type as any,
//     amount: d.amount.toString(),
//     balanceAfter: newBalance.toString(),
//     description: d.description,
//     billImageUrl: d.bill_image_url,
//     paymentMode: (d.payment_mode ?? "cash") as any,
//     entryDate: toDateStr(d.entry_date) ?? new Date().toISOString().split("T")[0],
//     dueDate: toDateStr(d.due_date),
//     createdBy: userId,
//   }).returning();

//   // Update customer balance
//   await db.update(customersTable).set({ currentBalance: newBalance.toString() }).where(eq(customersTable.id, d.customer_id));

//   res.status(201).json(formatTransaction(tx, customer.name));
// });

// // GET /transactions/:id
// router.get("/transactions/:id", requireAuth, async (req, res): Promise<void> => {
//   const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
//   const id = parseInt(raw, 10);
//   const [tx] = await db.select().from(transactionsTable)
//     .where(and(eq(transactionsTable.id, id), eq(transactionsTable.isDeleted, false)));
//   if (!tx) {
//     res.status(404).json({ error: "Transaction not found" });
//     return;
//   }
//   const [customer] = await db.select({ name: customersTable.name }).from(customersTable).where(eq(customersTable.id, Number(tx.customerId)));
//   res.json(formatTransaction(tx, customer?.name));
// });

// // PUT /transactions/:id
// router.put("/transactions/:id", requireAuth, async (req, res): Promise<void> => {
//   const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
//   const id = parseInt(raw, 10);
//   const parsed = UpdateTransactionBody.safeParse(req.body);
//   if (!parsed.success) {
//     res.status(400).json({ error: parsed.error.message });
//     return;
//   }
//   const updates: any = {};
//   if (parsed.data.amount !== undefined) updates.amount = parsed.data.amount.toString();
//   if (parsed.data.description !== undefined) updates.description = parsed.data.description;
//   if (parsed.data.payment_mode) updates.paymentMode = parsed.data.payment_mode;
//   const toStr = (v: string | Date | null | undefined) => v instanceof Date ? v.toISOString().split("T")[0] : v;
//   if (parsed.data.entry_date) updates.entryDate = toStr(parsed.data.entry_date);
//   if (parsed.data.due_date !== undefined) updates.dueDate = toStr(parsed.data.due_date);

//   const [tx] = await db.update(transactionsTable).set(updates)
//     .where(and(eq(transactionsTable.id, id), eq(transactionsTable.isDeleted, false))).returning();
//   if (!tx) {
//     res.status(404).json({ error: "Transaction not found" });
//     return;
//   }
//   const [customer] = await db.select({ name: customersTable.name }).from(customersTable).where(eq(customersTable.id, Number(tx.customerId)));
//   res.json(formatTransaction(tx, customer?.name));
// });

// // DELETE /transactions/:id
// router.delete("/transactions/:id", requireAuth, async (req, res): Promise<void> => {
//   const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
//   const id = parseInt(raw, 10);
//   const [tx] = await db.update(transactionsTable).set({ isDeleted: true }).where(eq(transactionsTable.id, id)).returning();
//   if (!tx) {
//     res.status(404).json({ error: "Transaction not found" });
//     return;
//   }
//   res.json({ message: "Transaction deleted" });
// });

// export default router;

import { Router, type IRouter } from "express";
import { db, transactionsTable, customersTable, productsTable, transactionItemsTable } from "@workspace/db";
import { requireAuth, AuthPayload } from "../middlewares/auth";
import {
  CreateTransactionBody,
  UpdateTransactionBody,
} from "@workspace/api-zod";
import { eq, and, gte, count, desc, inArray } from "drizzle-orm";

const router: IRouter = Router();

function formatTransaction(t: any, customerName?: string) {
  return {
    id: Number(t.id),
    business_id: Number(t.businessId),
    customer_id: Number(t.customerId),
    customer_name: customerName ?? "",
    type: t.type,
    amount: parseFloat(t.amount ?? "0"),
    balance_after: parseFloat(t.balanceAfter ?? "0"),
    description: t.description,
    bill_image_url: t.billImageUrl,
    payment_mode: t.paymentMode,
    tax: parseFloat(t.tax ?? "0"),        // ✅ ADD
    gst_rate: parseFloat(t.gstRate ?? "0"), // ✅ ADD
    invoice_no: t.invoiceNo,
    entry_date: t.entryDate,
    due_date: t.dueDate,
    created_by: Number(t.createdBy),
    created_at: t.createdAt,
  };
}

// GET /transactions
router.get("/transactions", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const customerId = req.query.customer_id ? parseInt(req.query.customer_id as string, 10) : undefined;
  const type = req.query.type as string | undefined;
  const filter = (req.query.filter as string) ?? "all";
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = (page - 1) * limit;

  const conditions: any[] = [eq(transactionsTable.businessId, businessId), eq(transactionsTable.isDeleted, false)];
  if (customerId) conditions.push(eq(transactionsTable.customerId, customerId));
  if (type === "you_got" || type === "you_gave") conditions.push(eq(transactionsTable.type, type));

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
  }

  const [transactions, totalResult] = await Promise.all([
    db.select().from(transactionsTable).where(and(...conditions)).limit(limit).offset(offset).orderBy(desc(transactionsTable.entryDate)),
    db.select({ count: count() }).from(transactionsTable).where(and(...conditions)),
  ]);

  // Fetch customer names
  const customerIds = [...new Set(transactions.map((t: any) => Number(t.customerId)))];
  const customers = customerIds.length > 0
    ? await db.select({ id: customersTable.id, name: customersTable.name }).from(customersTable).where(inArray(customersTable.id, customerIds))
    : [];
  const customerMap = new Map(customers.map((c) => [Number(c.id), c.name]));

  res.json({
    data: transactions.map((t: any) => formatTransaction(t, customerMap.get(Number(t.customerId)))),
    total: Number(totalResult[0].count),
    page,
    limit,
  });
});

// POST /transactions
router.post("/transactions", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateTransactionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;
  const { userId } = (req as any).user as AuthPayload;

  // Get current balance of customer
  const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, d.customer_id));
  if (!customer) {
    res.status(404).json({ error: "Customer not found" });
    return;
  }
  const currentBalance = parseFloat(customer.currentBalance ?? "0");
  const amount = parseFloat(d.amount?.toString() ?? "0");
  // you_gave = we lent money (customer owes us more) = positive balance
  // you_got = we received money (customer owes us less) = negative balance
  const newBalance = d.type === "you_gave" ? currentBalance + amount : currentBalance - amount;

  const toDateStr = (v: string | Date | null | undefined): string | null | undefined =>
    v instanceof Date ? v.toISOString().split("T")[0] : v as string | null | undefined;

  const [tx] = await db.insert(transactionsTable).values({
    businessId: d.business_id,
    customerId: d.customer_id,
    type: d.type as any,
    amount: d.amount.toString(),
    balanceAfter: newBalance.toString(),
    description: d.description,
    billImageUrl: d.bill_image_url,
    paymentMode: (d.payment_mode ?? "cash") as any,
    tax: (d.tax ?? 0).toString(),               // ✅ ADD
    gstRate: (d.gst_rate ?? 0).toString(),      // ✅ ADD
    invoiceNo: d.invoice_no ?? null,             // ✅ ADD
    entryDate: toDateStr(d.entry_date) ?? new Date().toISOString().split("T")[0],
    dueDate: toDateStr(d.due_date),
    createdBy: userId,
  }).returning();

  
  // Update customer balance
  await db.update(customersTable).set({ currentBalance: newBalance.toString() }).where(eq(customersTable.id, d.customer_id));

  // Save line items (if this transaction represents a sale with products
  // attached) so Reports > Product Sales Report can compute qty sold,
  // revenue, and profit per product later.
  if ((d as any).items && (d as any).items.length > 0) {
    const items = (d as any).items as { product_id: number; qty: number; unit_price: number }[];
    const productIds = [...new Set(items.map((it) => it.product_id))];
    const productRows = await db
      .select({ id: productsTable.id, costPrice: productsTable.costPrice })
      .from(productsTable)
      .where(inArray(productsTable.id, productIds));
    const costMap = new Map(productRows.map((p) => [Number(p.id), p.costPrice ?? "0"]));

    await db.insert(transactionItemsTable).values(
      items.map((it) => ({
        transactionId: tx.id,
        productId: it.product_id,
        qty: it.qty.toString(),
        unitPrice: it.unit_price.toString(),
        unitCost: costMap.get(it.product_id) ?? "0",
      })),
    );
  }

  res.status(201).json(formatTransaction(tx, customer.name));
});

// GET /transactions/:id
router.get("/transactions/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [tx] = await db.select().from(transactionsTable)
    .where(and(eq(transactionsTable.id, id), eq(transactionsTable.isDeleted, false)));
  if (!tx) {
    res.status(404).json({ error: "Transaction not found" });
    return;
  }
  const [customer] = await db.select({ name: customersTable.name }).from(customersTable).where(eq(customersTable.id, Number(tx.customerId)));
  res.json(formatTransaction(tx, customer?.name));
});

// PUT /transactions/:id
router.put("/transactions/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const parsed = UpdateTransactionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updates: any = {};
  if (parsed.data.amount !== undefined) updates.amount = parsed.data.amount.toString();
  if (parsed.data.description !== undefined) updates.description = parsed.data.description;
  if (parsed.data.payment_mode) updates.paymentMode = parsed.data.payment_mode;
  const toStr = (v: string | Date | null | undefined) => v instanceof Date ? v.toISOString().split("T")[0] : v;
  if (parsed.data.entry_date) updates.entryDate = toStr(parsed.data.entry_date);
  if (parsed.data.due_date !== undefined) updates.dueDate = toStr(parsed.data.due_date);

  const [tx] = await db.update(transactionsTable).set(updates)
    .where(and(eq(transactionsTable.id, id), eq(transactionsTable.isDeleted, false))).returning();
  if (!tx) {
    res.status(404).json({ error: "Transaction not found" });
    return;
  }
  const [customer] = await db.select({ name: customersTable.name }).from(customersTable).where(eq(customersTable.id, Number(tx.customerId)));
  res.json(formatTransaction(tx, customer?.name));
});

// DELETE /transactions/:id
router.delete("/transactions/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [tx] = await db.update(transactionsTable).set({ isDeleted: true }).where(eq(transactionsTable.id, id)).returning();
  if (!tx) {
    res.status(404).json({ error: "Transaction not found" });
    return;
  }
  res.json({ message: "Transaction deleted" });
});

router.get('/transactions/:id/items', requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid transaction id" });
    return;
  }

  const items = await db
    .select({
      product_id: transactionItemsTable.productId,
      product_name: productsTable.name,
      unit: productsTable.unit,
      qty: transactionItemsTable.qty,
      unit_price: transactionItemsTable.unitPrice,
    })
    .from(transactionItemsTable)
    .innerJoin(productsTable, eq(transactionItemsTable.productId, productsTable.id))
    .where(eq(transactionItemsTable.transactionId, id));

  res.json(
    items.map((i) => ({
      ...i,
      qty: parseFloat(i.qty as any),
      unit_price: parseFloat(i.unit_price as any),
    })),
  );
});

export default router;