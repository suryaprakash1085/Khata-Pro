import { pgTable, serial, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { purchasesTable } from "./purchases";
import { productsTable } from "./products";

export const purchaseItemsTable = pgTable("purchase_items", {
  id: serial("id").primaryKey(),
  purchaseId: integer("purchase_id").notNull().references(() => purchasesTable.id),
  productId: integer("product_id").notNull().references(() => productsTable.id),
  qty: numeric("qty").notNull(),
  unitCost: numeric("unit_cost").notNull(), // cost snapshot at time of purchase
  createdAt: timestamp("created_at").defaultNow().notNull(),
});