import { pgTable, bigserial, bigint, varchar, text, decimal, date, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const salesOrderStatusEnum = pgEnum("sales_order_status", [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "invoiced",
  "cancelled",
]);

export const salesOrderChannelEnum = pgEnum("sales_order_channel", ["online", "store", "phone"]);

export const salesOrdersTable = pgTable("sales_orders", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" }).notNull(),
  customerId: bigint("customer_id", { mode: "number" }).notNull(),
  channel: salesOrderChannelEnum("channel").notNull().default("online"),
  status: salesOrderStatusEnum("status").notNull().default("pending"),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 12, scale: 2 }).notNull().default("0"),
  gstRate: decimal("gst_rate", { precision: 5, scale: 2 }).notNull().default("0"), // ← NEW: e.g. 5, 12, 18, 28
  invoiceNo: varchar("invoice_no", { length: 50 }), // ← NEW: assigned when order becomes "invoiced"
  description: text("description"),
  shippingAddress: varchar("shipping_address", { length: 500 }),
  entryDate: date("entry_date", { mode: "string" }).notNull(),
  transactionId: bigint("transaction_id", { mode: "number" }),
  createdBy: bigint("created_by", { mode: "number" }).notNull(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertSalesOrderSchema = createInsertSchema(salesOrdersTable).omit({ id: true, createdAt: true, updatedAt: true, invoiceNo: true });
export type InsertSalesOrder = z.infer<typeof insertSalesOrderSchema>;
export type SalesOrder = typeof salesOrdersTable.$inferSelect;