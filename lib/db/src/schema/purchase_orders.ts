import {
  pgTable,
  bigserial,
  bigint,
  varchar,
  text,
  decimal,
  date,
  integer,
  boolean,
  timestamp,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { vendorsTable } from "./vendors";

// Fulfillment lifecycle — deliberately separate from purchasesTable.status
// (which is a PAYMENT status: paid/pending/partial). This one tracks
// whether the goods have arrived yet.
export const purchaseOrderStatusEnum = pgEnum("purchase_order_status", [
  "pending",
  "ordered",
  "partially_received",
  "received",
  "cancelled",
]);

export const purchaseOrdersTable = pgTable(
  "purchase_orders",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    businessId: bigint("business_id", { mode: "number" }).notNull(),
    vendorId: bigint("vendor_id", { mode: "number" })
      .notNull()
      .references(() => vendorsTable.id),

    // Human-readable number e.g. "PO-001", unique per business.
    // sequenceNo is the raw integer behind it (from purchase_order_counters) —
    // kept separately so we never have to parse the string back into a number.
    purchaseOrderNumber: varchar("purchase_order_number", { length: 30 }).notNull(),
    sequenceNo: integer("sequence_no").notNull(),

    orderDate: date("order_date", { mode: "string" }).notNull(),
    status: purchaseOrderStatusEnum("status").notNull().default("pending"),

    // Snapshot total at creation time (sum of items). Recomputed if items
    // ever change; not derived on every read to keep list queries cheap.
    totalAmount: decimal("total_amount", { precision: 12, scale: 2 }).notNull().default("0"),

    notes: text("notes"),

    isDeleted: boolean("is_deleted").notNull().default(false),
    createdBy: bigint("created_by", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    // Defense-in-depth on top of the atomic counter: DB will reject a
    // duplicate (business_id, sequence_no) pair even in a worst-case race.
    uniqueBusinessSequence: uniqueIndex("purchase_orders_business_sequence_unique").on(
      table.businessId,
      table.sequenceNo,
    ),
    uniqueBusinessNumber: uniqueIndex("purchase_orders_business_number_unique").on(
      table.businessId,
      table.purchaseOrderNumber,
    ),
  }),
);

export const insertPurchaseOrderSchema = createInsertSchema(purchaseOrdersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertPurchaseOrder = z.infer<typeof insertPurchaseOrderSchema>;
export type PurchaseOrder = typeof purchaseOrdersTable.$inferSelect;