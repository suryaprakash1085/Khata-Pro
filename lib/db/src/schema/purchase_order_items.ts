import { pgTable, bigserial, bigint, numeric, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { purchaseOrdersTable } from "./purchase_orders";
import { productsTable } from "./products";

export const purchaseOrderItemsTable = pgTable("purchase_order_items", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  purchaseOrderId: bigint("purchase_order_id", { mode: "number" })
    .notNull()
    .references(() => purchaseOrdersTable.id),
  productId: bigint("product_id", { mode: "number" })
    .notNull()
    .references(() => productsTable.id),

  orderedQty: numeric("ordered_qty").notNull(),
  // Starts at 0. Only the (future) receiving flow increments this — and
  // THAT is the only place product stock should ever change for a PO.
  receivedQty: numeric("received_qty").notNull().default("0"),

  unitCost: numeric("unit_cost").notNull(), // snapshot at order time, editable per-PO
  total: numeric("total").notNull(), // orderedQty * unitCost, snapshot

  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const insertPurchaseOrderItemSchema = createInsertSchema(purchaseOrderItemsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertPurchaseOrderItem = z.infer<typeof insertPurchaseOrderItemSchema>;
export type PurchaseOrderItem = typeof purchaseOrderItemsTable.$inferSelect;