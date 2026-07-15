import { pgTable, bigserial, bigint, varchar, text, boolean, timestamp, decimal, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const customerCategoryEnum = pgEnum("customer_category", ["customer", "supplier"]);
export const balanceTypeEnum = pgEnum("balance_type", ["credit", "debit"]);

export const customersTable = pgTable("customers", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  openingBalance: decimal("opening_balance", { precision: 12, scale: 2 }).notNull().default("0"),
  openingBalanceType: balanceTypeEnum("opening_balance_type").notNull().default("credit"),
  currentBalance: decimal("current_balance", { precision: 12, scale: 2 }).notNull().default("0"),
  category: customerCategoryEnum("category").notNull().default("customer"),
  profileImage: varchar("profile_image", { length: 500 }),
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCustomerSchema = createInsertSchema(customersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customersTable.$inferSelect;
