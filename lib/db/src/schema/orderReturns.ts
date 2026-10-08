// lib/db/src/schema/order_returns.ts
// Online-order return requests (customer delivery app). Separate from the
// shop-visit `returns` table, which handles POS returns + refunds.
import { pgTable, serial, integer, decimal, text, timestamp, pgEnum, index } from "drizzle-orm/pg-core";
import { businessesTable } from "./businesses";
import { customersTable } from "./customers";
import { salesOrdersTable } from "./sales_orders";      // adjust export name if different
import { productsTable } from "./products";
import { usersTable } from "./users";
import { deliveriesTable } from "./deliveries";         // adjust export name if different

export const orderReturnReasonEnum = pgEnum("order_return_reason", [
  "EXPIRED_PRODUCT",
  "WRONG_PRODUCT",
  "DAMAGED",
  "MISSING_ITEM",
  "OTHER",
]);

export const orderReturnStatusEnum = pgEnum("order_return_status", [
  "REQUESTED",
  "APPROVED",
  "REJECTED",
  "REPLACEMENT_SENT",
]);

export const orderReturnMediaTypeEnum = pgEnum("order_return_media_type", ["photo", "video"]);

export const orderReturnsTable = pgTable(
  "order_returns",
  {
    id: serial("id").primaryKey(),
    businessId: integer("business_id").notNull().references(() => businessesTable.id),
    customerId: integer("customer_id").notNull().references(() => customersTable.id),
    salesOrderId: integer("sales_order_id").notNull().references(() => salesOrdersTable.id),
    productId: integer("product_id").notNull().references(() => productsTable.id),
    qty: decimal("qty", { precision: 12, scale: 2 }).notNull().default("1"),

    reason: orderReturnReasonEnum("reason").notNull(),
    description: text("description"),
    status: orderReturnStatusEnum("status").notNull().default("REQUESTED"),

    // Snapshot of when the order was delivered — audit trail for the 24h rule.
    deliveredAt: timestamp("delivered_at").notNull(),

    // Admin review
    adminNote: text("admin_note"),
    reviewedBy: integer("reviewed_by").references(() => usersTable.id),
    reviewedAt: timestamp("reviewed_at"),

    // Replacement shipment (reuses the normal deliveries flow)
    replacementDeliveryId: integer("replacement_delivery_id").references(() => deliveriesTable.id),
    replacementSentAt: timestamp("replacement_sent_at"),

    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    byBusinessStatus: index("order_returns_business_status_idx").on(t.businessId, t.status),
    byOrder: index("order_returns_order_idx").on(t.salesOrderId),
  }),
);

export const orderReturnMediaTable = pgTable(
  "order_return_media",
  {
    id: serial("id").primaryKey(),
    returnId: integer("return_id").notNull().references(() => orderReturnsTable.id, { onDelete: "cascade" }),
    type: orderReturnMediaTypeEnum("type").notNull(),
    url: text("url").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    byReturn: index("order_return_media_return_idx").on(t.returnId),
  }),
);