import { pgTable, bigserial, bigint, varchar, text, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const businessesTable = pgTable("businesses", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  ownerId: bigint("owner_id", { mode: "number" }).notNull(),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  businessType: varchar("business_type", { length: 100 }).notNull(),
  gstin: varchar("gstin", { length: 20 }),
  address: text("address"),
  logoUrl: varchar("logo_url", { length: 500 }),
  currency: varchar("currency", { length: 10 }).notNull().default("INR"),
  financialYearStart: date("financial_year_start", { mode: "string" }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertBusinessSchema = createInsertSchema(businessesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type Business = typeof businessesTable.$inferSelect;
