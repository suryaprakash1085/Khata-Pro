// TARGET PATH: lib/db/src/schema/delivery_fee_settings.ts
// NEW FILE

import { pgTable, bigserial, bigint, decimal, boolean, timestamp, index, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { businessesTable } from "./businesses";

export const deliveryFeeSettingsTable = pgTable("delivery_fee_settings", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" })
    .notNull()
    .references(() => businessesTable.id, { onDelete: "cascade" }),
  // decimal, not integer — spec requires decimal-distance support (5.7 km etc.)
  freeDeliveryRadius: decimal("free_delivery_radius", { precision: 6, scale: 2 }).notNull().default("5"),
  // money-safe decimal, matches the precision style already used for sales_orders.amount
  perKmCharge: decimal("per_km_charge", { precision: 8, scale: 2 }).notNull().default("2"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  businessIdIdx: index("delivery_fee_settings_business_id_idx").on(table.businessId),
  // one active configuration per business — required by the spec
  businessIdUnique: unique("delivery_fee_settings_business_id_unique").on(table.businessId),
}));

export const insertDeliveryFeeSettingsSchema = createInsertSchema(deliveryFeeSettingsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertDeliveryFeeSettings = z.infer<typeof insertDeliveryFeeSettingsSchema>;
export type DeliveryFeeSettings = typeof deliveryFeeSettingsTable.$inferSelect;