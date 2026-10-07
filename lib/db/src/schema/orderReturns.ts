import { pgTable, serial, integer, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const orderReturnsTable = pgTable("order_returns", {
  id: serial("id").primaryKey(),
  salesOrderId: integer("sales_order_id").notNull(),
  businessId: integer("business_id").notNull(),
  customerId: integer("customer_id").notNull(),
  reason: varchar("reason", { length: 50 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 20 }).notNull().default("REQUESTED"),
  adminNote: text("admin_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});