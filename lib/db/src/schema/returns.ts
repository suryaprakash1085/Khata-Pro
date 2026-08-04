import { pgTable, serial, integer, decimal, date, timestamp, boolean, pgEnum } from "drizzle-orm/pg-core";
import { businessesTable } from "./businesses";
import { transactionsTable } from "./transactions";
import { productsTable } from "./products";
import { usersTable } from "./users";

export const returnReasonEnum = pgEnum("return_reason", [
  "damaged",
  "expired",
  "wrong_item",
  "customer_return",
  "other",
]);

export const returnsTable = pgTable("returns", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").notNull().references(() => businessesTable.id),
  transactionId: integer("transaction_id").notNull().references(() => transactionsTable.id),
  productId: integer("product_id").notNull().references(() => productsTable.id),
  qty: decimal("qty", { precision: 12, scale: 2 }).notNull(),
  returnAmount: decimal("return_amount", { precision: 12, scale: 2 }).notNull(),
  reason: returnReasonEnum("reason").notNull(),
  refunded: boolean("refunded").notNull().default(true),
  entryDate: date("entry_date").notNull(),
  createdBy: integer("created_by").notNull().references(() => usersTable.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  isDeleted: boolean("is_deleted").notNull().default(false),
});