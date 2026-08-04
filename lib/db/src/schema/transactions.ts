

import { pgTable, bigserial, bigint, varchar, text, timestamp, decimal, date, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const transactionTypeEnum = pgEnum("transaction_type", ["you_gave", "you_got"]);
export const paymentModeEnum = pgEnum("payment_mode", ["cash", "online", "cheque", "upi"]);

export const transactionsTable = pgTable("transactions", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" }).notNull(),
  customerId: bigint("customer_id", { mode: "number" }).notNull(),
  type: transactionTypeEnum("type").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  balanceAfter: decimal("balance_after", { precision: 12, scale: 2 }).notNull(),
  description: text("description"),
  billImageUrl: varchar("bill_image_url", { length: 500 }),
  paymentMode: paymentModeEnum("payment_mode").notNull().default("cash"),
  tax: decimal("tax", { precision: 12, scale: 2 }).notNull().default("0"),
  gstRate: decimal("gst_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  invoiceNo: varchar("invoice_no", { length: 50 }),
  entryDate: date("entry_date", { mode: "string" }).notNull(),
  dueDate: date("due_date", { mode: "string" }),
  createdBy: bigint("created_by", { mode: "number" }).notNull(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertTransactionSchema = createInsertSchema(transactionsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactionsTable.$inferSelect;