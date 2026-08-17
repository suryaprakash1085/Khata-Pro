
import { pgTable, bigserial, bigint, varchar, text, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const businessesTable = pgTable("businesses", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  ownerId: bigint("owner_id", { mode: "number" }).notNull(),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  businessType: varchar("business_type", { length: 100 }).notNull(),
  gstin: varchar("gstin", { length: 20 }),
  description: text("description"),
  phone: varchar('phone', { length: 20 }),
  email: varchar('email', { length: 255 }),

  // 👇 replaced the single `address` text field with structured columns
  // that match the Business Setup form (line1/line2/city/state/postal/country)
  addressLine1: varchar("address_line1", { length: 255 }),
  addressLine2: varchar("address_line2", { length: 255 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  postalCode: varchar("postal_code", { length: 20 }),
  country: varchar("country", { length: 100 }).default("India"),

  // 👉 varchar(500) is too short for a base64 data URI (which is what the
  // frontend currently sends for the logo — see backend-changes.md note).
  // Use `text` so it isn't silently truncated. Switch back to a short
  // varchar once you move to real file uploads and store just a URL here.
  logoUrl: text("logo_url"),
  currency: varchar("currency", { length: 10 }).notNull().default("INR"),
  financialYearStart: date("financial_year_start", { mode: "string" }),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertBusinessSchema = createInsertSchema(businessesTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type Business = typeof businessesTable.$inferSelect;   