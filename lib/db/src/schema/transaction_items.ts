import { pgTable, serial, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { transactionsTable } from "./transactions";
import { productsTable } from "./products";

export const transactionItemsTable = pgTable("transaction_items", {
  id: serial("id").primaryKey(),
  transactionId: integer("transaction_id").notNull().references(() => transactionsTable.id),
  productId: integer("product_id").notNull().references(() => productsTable.id),
  qty: numeric("qty").notNull(),
  unitPrice: numeric("unit_price").notNull(),   // selling price at time of sale
  unitCost: numeric("unit_cost").notNull(),     // cost price snapshot, for profit calc
  createdAt: timestamp("created_at").defaultNow().notNull(),
});