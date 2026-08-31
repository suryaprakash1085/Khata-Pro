import { pgTable, bigint, integer } from "drizzle-orm/pg-core";

export const businessInvoiceCountersTable = pgTable("business_invoice_counters", {
  businessId: bigint("business_id", { mode: "number" }).primaryKey(),
  lastNumber: integer("last_number").notNull().default(0),
});

export type BusinessInvoiceCounter = typeof businessInvoiceCountersTable.$inferSelect;