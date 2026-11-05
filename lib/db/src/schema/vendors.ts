import {
  pgTable,
  bigserial,
  bigint,
  varchar,
  boolean,
  integer,
  numeric,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const vendorsTable = pgTable(
  "vendors",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    businessId: bigint("business_id", { mode: "number" }).notNull(),

    // Basic
    name: varchar("name", { length: 255 }).notNull(),            // vendor / contact name
    companyName: varchar("company_name", { length: 255 }),       // business / company name
    phone: varchar("phone", { length: 20 }),
    alternatePhone: varchar("alternate_phone", { length: 20 }),
    email: varchar("email", { length: 255 }),

    // Address
    address: varchar("address", { length: 500 }),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 100 }),
    pincode: varchar("pincode", { length: 10 }),

    // Tax
    gstNumber: varchar("gst_number", { length: 20 }),            // GSTIN (15 chars)
    panNumber: varchar("pan_number", { length: 10 }),

    // Accounts
    openingBalance: numeric("opening_balance", { precision: 12, scale: 2 })
      .notNull()
      .default("0"),
    openingBalanceType: varchar("opening_balance_type", { length: 12 })
      .notNull()
      .default("payable"),                                        // 'payable' | 'receivable'
    paymentTermsDays: integer("payment_terms_days").notNull().default(0), // 0 = cash / immediate

    isDeleted: boolean("is_deleted").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    index("vendors_business_id_idx").on(t.businessId),
    index("vendors_business_gst_idx").on(t.businessId, t.gstNumber),
    index("vendors_business_phone_idx").on(t.businessId, t.phone),
  ],
);

export const insertVendorSchema = createInsertSchema(vendorsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertVendor = z.infer<typeof insertVendorSchema>;
export type Vendor = typeof vendorsTable.$inferSelect;