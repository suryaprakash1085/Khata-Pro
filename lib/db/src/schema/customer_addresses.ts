// TARGET PATH: lib/db/src/schema/customer_addresses.ts
// NEW FILE
//
// NOTE: I haven't seen customers.ts, so `customersTable` and `.id` below are
// assumed to follow the same bigserial-id convention as every other table
// in this schema set (businesses, service_highlights, sales_orders). If
// customers.ts uses a different PK type/name, adjust the `customerId`
// reference accordingly before running the migration.

import { pgTable, bigserial, bigint, varchar, decimal, boolean, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { customersTable } from "./customers";

export const customerAddressesTable = pgTable("customer_addresses", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  customerId: bigint("customer_id", { mode: "number" })
    .notNull()
    .references(() => customersTable.id, { onDelete: "cascade" }),
  label: varchar("label", { length: 50 }).notNull().default("Home"), // Home / Work / Other
  addressLine: varchar("address_line", { length: 500 }).notNull(),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  pincode: varchar("pincode", { length: 10 }),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  isDefault: boolean("is_default").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  customerIdIdx: index("customer_addresses_customer_id_idx").on(table.customerId),
}));

export const insertCustomerAddressSchema = createInsertSchema(customerAddressesTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertCustomerAddress = z.infer<typeof insertCustomerAddressSchema>;
export type CustomerAddress = typeof customerAddressesTable.$inferSelect;