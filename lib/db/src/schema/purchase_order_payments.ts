import { pgTable, bigserial, bigint, text, decimal, date, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { purchaseOrdersTable } from "./purchase_orders";
import { vendorsTable } from "./vendors";

export const purchaseOrderPaymentMethodEnum = pgEnum("purchase_order_payment_method", [
  "cash",
  "upi",
  "bank_transfer",
  "cheque",
  "other",
]);

// A ledger, not a single field on purchase_orders — a PO is commonly paid
// in more than one installment (advance now, balance on receiving), and
// this keeps full history instead of overwriting one amount_paid column.
export const purchaseOrderPaymentsTable = pgTable("purchase_order_payments", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" }).notNull(),
  purchaseOrderId: bigint("purchase_order_id", { mode: "number" })
    .notNull()
    .references(() => purchaseOrdersTable.id),
  vendorId: bigint("vendor_id", { mode: "number" })
    .notNull()
    .references(() => vendorsTable.id),

  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: purchaseOrderPaymentMethodEnum("payment_method").notNull().default("cash"),
  paymentDate: date("payment_date", { mode: "string" }).notNull(),
  notes: text("notes"),

  createdBy: bigint("created_by", { mode: "number" }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPurchaseOrderPaymentSchema = createInsertSchema(purchaseOrderPaymentsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertPurchaseOrderPayment = z.infer<typeof insertPurchaseOrderPaymentSchema>;
export type PurchaseOrderPayment = typeof purchaseOrderPaymentsTable.$inferSelect;