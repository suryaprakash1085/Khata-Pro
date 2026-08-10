// import { pgTable, bigserial, bigint, varchar, text, numeric, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
// import { createInsertSchema } from "drizzle-zod";
// import { z } from "zod/v4";

// export const balanceTypeEnum = pgEnum("balance_type", ["credit", "debit"]);
// export const customerCategoryEnum = pgEnum("customer_category", ["customer", "supplier"]);

// export const customersTable = pgTable("customers", {
//   id: bigserial("id", { mode: "number" }).primaryKey(),
//   businessId: bigint("business_id", { mode: "number" }).notNull(),
//   name: varchar("name", { length: 255 }).notNull(),
//   phone: varchar("phone", { length: 20 }).notNull(),
//   email: varchar("email", { length: 255 }),
//   address: text("address"),
//   openingBalance: numeric("opening_balance", { precision: 12, scale: 2 }).notNull().default("0"),
//   openingBalanceType: balanceTypeEnum("opening_balance_type").notNull().default("credit"),
//   currentBalance: numeric("current_balance", { precision: 12, scale: 2 }).notNull().default("0"),
//   category: customerCategoryEnum("category").notNull().default("customer"),
//   profileImage: varchar("profile_image", { length: 500 }),
//   isDeleted: boolean("is_deleted").notNull().default(false),
//   createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
//   updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
// });

// export const insertCustomerSchema = createInsertSchema(customersTable).omit({ id: true, createdAt: true, updatedAt: true });
// export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
// export type Customer = typeof customersTable.$inferSelect;
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
  openingBalance: numeric("opening_balance", { precision: 12, scale: 2 }).notNull().default("0"),
  openingBalanceType: balanceTypeEnum("opening_balance_type").notNull().default("credit"),
  currentBalance: numeric("current_balance", { precision: 12, scale: 2 }).notNull().default("0"),
  category: customerCategoryEnum("category").notNull().default("customer"),
  profileImage: varchar("profile_image", { length: 500 }),
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertCustomerSchema = createInsertSchema(customersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// ============================================
// SIGNUP-TIME CUSTOMER INPUT SCHEMA
// ============================================

// What we collect from the signup form to create a matching customer row.
// Only name, email, phone, address come from the form — businessId is
// resolved separately (from the created/latest business), and the balance
// / category / isDeleted fields use table defaults.
export const registerCustomerSchema = z.object({
  name: z.string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(100, { message: "Name must be less than 100 characters" }),

  email: z.string()
    .email({ message: "Please enter a valid email address" })
    .optional()
    .nullable(),

  phone: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Please enter a valid phone number (E.164 format)" }),

  address: z.string()
    .max(500, { message: "Address must be less than 500 characters" })
    .optional()
    .nullable(),
});

// ============================================
// TYPES
// ============================================

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customersTable.$inferSelect;
export type RegisterCustomerInput = z.infer<typeof registerCustomerSchema>;