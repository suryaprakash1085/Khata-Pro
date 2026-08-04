import { Router, type IRouter } from "express";
import { requireAuth } from "../middlewares/auth";
import { db, returnsTable, transactionsTable, transactionItemsTable, productsTable, customersTable, usersTable } from "@workspace/db";
import { eq, and, desc, inArray,sql } from "drizzle-orm";

const router: IRouter = Router();

const REASON_LABEL: Record<string, string> = {
  damaged: "Damaged",
  expired: "Expired",
  wrong_item: "Wrong Item",
  customer_return: "Customer Return",
  other: "Other",
};

const REASON_VALUE: Record<string, string> = {
  Damaged: "damaged",
  Expired: "expired",
  "Wrong Item": "wrong_item",
  "Customer Return": "customer_return",
  Other: "other",
};

// POST /returns — record a return against an existing sale transaction+product.
// return_amount is derived from that line item's unit_price (not user-entered),
// so it can't drift from what the product actually sold for.
// router.post("/returns", requireAuth, async (req, res): Promise<void> => {
//   const businessId = parseInt(req.body?.business_id, 10);
//   const transactionId = parseInt(req.body?.transaction_id, 10);
//   const productId = parseInt(req.body?.product_id, 10);
//   const qty = parseFloat(req.body?.qty);
//   const reasonInput = req.body?.reason as string | undefined;
//   const refunded = req.body?.refunded !== false; // default true

//   if (isNaN(businessId) || isNaN(transactionId) || isNaN(productId) || isNaN(qty) || qty <= 0) {
//     res.status(400).json({ error: "business_id, transaction_id, product_id and a positive qty are required" });
//     return;
//   }
//   const reason = REASON_VALUE[reasonInput ?? ""] ?? (Object.values(REASON_LABEL).includes(reasonInput ?? "") ? undefined : reasonInput);
//   if (!reason || !(reason in REASON_LABEL)) {
//     res.status(400).json({ error: `reason must be one of: ${Object.values(REASON_LABEL).join(", ")}` });
//     return;
//   }

//   // Pull the original line item to price the return correctly.
//   const [lineItem] = await db
//     .select({ unitPrice: transactionItemsTable.unitPrice, qty: transactionItemsTable.qty })
//     .from(transactionItemsTable)
//     .where(and(eq(transactionItemsTable.transactionId, transactionId), eq(transactionItemsTable.productId, productId)))
//     .limit(1);

//   if (!lineItem) {
//     res.status(404).json({ error: "No matching line item found for that transaction and product" });
//     return;
//   }

//   const unitPrice = parseFloat(lineItem.unitPrice ?? "0");
//   const returnAmount = unitPrice * qty;
//   const today = new Date().toISOString().split("T")[0];
//   const createdBy = (req as any).user?.id; // adjust to however requireAuth attaches the user

//   const [created] = await db
//     .insert(returnsTable)
//     .values({
//       businessId,
//       transactionId,
//       productId,
//       qty: String(qty),
//       returnAmount: String(returnAmount),
//       reason: reason as any,
//       refunded,
//       entryDate: today,
//       createdBy,
//     })
//     .returning();

//   res.status(201).json({
//     id: Number(created.id),
//     business_id: businessId,
//     transaction_id: transactionId,
//     product_id: productId,
//     qty,
//     return_amount: returnAmount,
//     reason: REASON_LABEL[reason],
//     refunded,
//     entry_date: today,
//   });
// });

// POST /returns — replace with this version
router.post("/returns", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.body?.business_id, 10);
  const transactionId = parseInt(req.body?.transaction_id, 10);
  const productId = parseInt(req.body?.product_id, 10);
  const qty = parseFloat(req.body?.qty);
  const reasonInput = req.body?.reason as string | undefined;
  const refunded = req.body?.refunded !== false;

  if (isNaN(businessId) || isNaN(transactionId) || isNaN(productId) || isNaN(qty) || qty <= 0) {
    res.status(400).json({ error: "business_id, transaction_id, product_id and a positive qty are required" });
    return;
  }

  const reason = reasonInput ? REASON_VALUE[reasonInput] : undefined;
  if (!reason || !(reason in REASON_LABEL)) {
    res.status(400).json({ error: `reason must be one of: ${Object.keys(REASON_VALUE).join(", ")}` });
    return;
  }

  // Pull the original line item to price the return correctly.
  const [lineItem] = await db
    .select({ unitPrice: transactionItemsTable.unitPrice, qty: transactionItemsTable.qty })
    .from(transactionItemsTable)
    .where(and(eq(transactionItemsTable.transactionId, transactionId), eq(transactionItemsTable.productId, productId)))
    .limit(1);

  if (!lineItem) {
    res.status(404).json({ error: "No matching line item found for that transaction and product" });
    return;
  }

  // Pull the parent transaction to know which customer to refund and for the invoice number.
  const [tx] = await db
    .select({ customerId: transactionsTable.customerId, invoiceNo: transactionsTable.invoiceNo, description: transactionsTable.description })
    .from(transactionsTable)
    .where(eq(transactionsTable.id, transactionId))
    .limit(1);

  if (!tx) {
    res.status(404).json({ error: "Original transaction not found" });
    return;
  }

  const unitPrice = parseFloat(lineItem.unitPrice ?? "0");
  const returnAmount = unitPrice * qty;
  const today = new Date().toISOString().split("T")[0];
  const createdBy = (req as any).user?.id;

  const [created] = await db
    .insert(returnsTable)
    .values({
      businessId,
      transactionId,
      productId,
      qty: String(qty),
      returnAmount: String(returnAmount),
      reason: reason as any,
      refunded,
      entryDate: today,
      createdBy,
    })
    .returning();

  // Restock — skip for Damaged / Expired, since that stock isn't sellable again.
  if (reason !== "damaged" && reason !== "expired") {
    await db
      .update(productsTable)
      .set({ stockQty: sql`${productsTable.stockQty} + ${qty}` })
      .where(eq(productsTable.id, productId));
  }

  // Refund — a "you_gave" entry against the customer (money going back out),
  // mirroring how the original sale was recorded as "you_gave" too.
  if (refunded && tx.customerId) {
    const [customer] = await db.select().from(customersTable).where(eq(customersTable.id, Number(tx.customerId)));
    if (customer) {
      const currentBalance = parseFloat(customer.currentBalance ?? "0");
      // A refund reduces what the customer owes us (or increases what we owe them),
      // same direction as a "you_got" payment would — so subtract like you_got.
      const newBalance = currentBalance - returnAmount;
      await db.insert(transactionsTable).values({
        businessId,
        customerId: Number(tx.customerId),
        type: "you_got" as any,
        amount: String(returnAmount),
        balanceAfter: String(newBalance),
        description: `Refund for return against invoice ${tx.invoiceNo ?? `TXN-${transactionId}`}`,
        paymentMode: "cash" as any,
        entryDate: today,
        createdBy,
      });
      await db.update(customersTable).set({ currentBalance: String(newBalance) }).where(eq(customersTable.id, Number(tx.customerId)));
    }
  }

  res.status(201).json({
    id: Number(created.id),
    business_id: businessId,
    transaction_id: transactionId,
    product_id: productId,
    qty,
    return_amount: returnAmount,
    reason: REASON_LABEL[reason],
    refunded,
    entry_date: today,
  });
});

// GET /returns — flat list, mirrors /purchases pagination style
router.get("/returns", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const limit = parseInt(req.query.limit as string) || 20;

  const rows = await db
    .select()
    .from(returnsTable)
    .where(and(eq(returnsTable.businessId, businessId), eq(returnsTable.isDeleted, false)))
    .orderBy(desc(returnsTable.entryDate))
    .limit(limit);

  res.json(
    rows.map((r) => ({
      id: Number(r.id),
      transaction_id: Number(r.transactionId),
      product_id: Number(r.productId),
      qty: parseFloat(r.qty),
      return_amount: parseFloat(r.returnAmount),
      reason: REASON_LABEL[r.reason] ?? r.reason,
      refunded: r.refunded,
      entry_date: r.entryDate,
    })),
  );
});

// DELETE /returns/:id — soft delete
// DELETE /returns/:id — soft delete
router.delete("/returns/:id", requireAuth, async (req, res): Promise<void> => {
  const idRaw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(idRaw, 10);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid return id" });
    return;
  }
  const [deleted] = await db.update(returnsTable).set({ isDeleted: true }).where(eq(returnsTable.id, id)).returning();
  if (!deleted) {
    res.status(404).json({ error: "Return not found" });
    return;
  }
  res.status(204).send();
});

export default router;