import { pgTable, serial, integer, numeric, timestamp } from "drizzle-orm/pg-core";
import { salesOrdersTable } from "./sales_orders";
import { productsTable } from "./products";

export const salesOrderItemsTable = pgTable("sales_order_items", {
  id: serial("id").primaryKey(),
  salesOrderId: integer("sales_order_id").notNull().references(() => salesOrdersTable.id),
  productId: integer("product_id").notNull().references(() => productsTable.id),
  qty: numeric("qty").notNull(),
  unitPrice: numeric("unit_price").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});