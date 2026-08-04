import { pgTable, bigserial, bigint, varchar, text, decimal, date, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const purchaseStatusEnum = pgEnum("purchase_status", ["paid", "pending", "partial"]);

export const purchasesTable = pgTable("purchases", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" }).notNull(),
  vendorId: bigint("vendor_id", { mode: "number" }).notNull(),
  invoiceNo: varchar("invoice_no", { length: 100 }),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  tax: decimal("tax", { precision: 12, scale: 2 }).notNull().default("0"),
  amountPaid: decimal("amount_paid", { precision: 12, scale: 2 }).notNull().default("0"),
  status: purchaseStatusEnum("status").notNull().default("pending"),
  billImageUrl: varchar("bill_image_url", { length: 500 }),
  description: text("description"),
  entryDate: date("entry_date", { mode: "string" }).notNull(),
  createdBy: bigint("created_by", { mode: "number" }).notNull(),
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertPurchaseSchema = createInsertSchema(purchasesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPurchase = z.infer<typeof insertPurchaseSchema>;
export type Purchase = typeof purchasesTable.$inferSelect;