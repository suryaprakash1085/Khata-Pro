// import {
//   pgTable,
//   bigserial,
//   bigint,
//   varchar,
//   text,
//   boolean,
//   timestamp,
//   decimal,
//   date,
//   pgEnum,
// } from "drizzle-orm/pg-core";
// import { createInsertSchema } from "drizzle-zod";
// import { z } from "zod/v4";

// export const expenseCategoryEnum = pgEnum("expense_category", [
//   "rent",
//   "salary",
//   "utilities",
//   "transport",
//   "maintenance",
//   "marketing",
//   "supplies",
//   "other",
// ]);

// export const expensePaymentModeEnum = pgEnum("expense_payment_mode", [
//   "cash",
//   "online",
//   "cheque",
//   "upi",
// ]);

// export const expensesTable = pgTable("expenses", {
//   id: bigserial("id", { mode: "number" }).primaryKey(),
//   businessId: bigint("business_id", { mode: "number" }).notNull(),
//   category: expenseCategoryEnum("category").notNull().default("other"),
//   payeeName: varchar("payee_name", { length: 255 }),
//   amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
//   paymentMode: expensePaymentModeEnum("payment_mode").notNull().default("cash"),
//   receiptImageUrl: varchar("receipt_image_url", { length: 500 }),
//   description: text("description"),
//   entryDate: date("entry_date").notNull(),
//   createdBy: bigint("created_by", { mode: "number" }).notNull(),
//   isDeleted: boolean("is_deleted").notNull().default(false),
//   createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
//   updatedAt: timestamp("updated_at", { withTimezone: true })
//     .notNull()
//     .defaultNow()
//     .$onUpdate(() => new Date()),
// });

// export const insertExpenseSchema = createInsertSchema(expensesTable).omit({
//   id: true,
//   createdAt: true,
//   updatedAt: true,
// });

// export type InsertExpense = z.infer<typeof insertExpenseSchema>;
// export type Expense = typeof expensesTable.$inferSelect;

import {
  pgTable,
  bigserial,
  bigint,
  varchar,
  text,
  boolean,
  timestamp,
  decimal,
  date,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const expenseCategoryEnum = pgEnum("expense_category", [
  "rent",
  "salary",
  "utilities",
  "transport",
  "maintenance",
  "marketing",
  "supplies",
  "other",
]);

export const expensePaymentModeEnum = pgEnum("expense_payment_mode", [
  "cash",
  "online",
  "cheque",
  "upi",
  "bank_transfer",
  "card",
]);

export const expensesTable = pgTable("expenses", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" }).notNull(),
  category: expenseCategoryEnum("category").notNull().default("other"),
  payeeName: varchar("payee_name", { length: 255 }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paymentMode: expensePaymentModeEnum("payment_mode").notNull().default("cash"),
  paymentDetails: jsonb("payment_details").$type<Record<string, any>>(),
  receiptImageUrl: varchar("receipt_image_url", { length: 500 }),
  description: text("description"),
  entryDate: date("entry_date").notNull(),
  createdBy: bigint("created_by", { mode: "number" }).notNull(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertExpenseSchema = createInsertSchema(expensesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Expense = typeof expensesTable.$inferSelect;