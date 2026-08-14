import { pgTable, bigserial, bigint, varchar, text, numeric, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const balanceTypeEnum = pgEnum("balance_type", ["credit", "debit"]);
export const customerCategoryEnum = pgEnum("customer_category", ["customer", "supplier"]);

export const customersTable = pgTable("customers", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  passwordHash: varchar("password_hash", { length: 255 }),
  openingBalance: numeric("opening_balance", { precision: 12, scale: 2 }).notNull().default("0"),
  openingBalanceType: balanceTypeEnum("opening_balance_type").notNull().default("credit"),
  currentBalance: numeric("current_balance", { precision: 12, scale: 2 }).notNull().default("0"),
  category: customerCategoryEnum("category").notNull().default("customer"),
  profileImage: varchar("profile_image", { length: 500 }),
  pushToken: varchar("push_token", { length: 255 }), // <-- ADD THIS (maps to expo_push_token DB column)
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCustomerSchema = createInsertSchema(customersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const registerCustomerSchema = z.object({
  businessId: z.number({ message: "business_id is required" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).max(100, { message: "Name must be less than 100 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }).optional().nullable(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Please enter a valid phone number (E.164 format)" }),
  address: z.string().max(500, { message: "Address must be less than 500 characters" }).optional().nullable(),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }).max(100, { message: "Password must be less than 100 characters" }),
});

export const loginCustomerSchema = z.object({
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, { message: "Please enter a valid phone number (E.164 format)" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customersTable.$inferSelect;
export type RegisterCustomerInput = z.infer<typeof registerCustomerSchema>;
export type LoginCustomerInput = z.infer<typeof loginCustomerSchema>;