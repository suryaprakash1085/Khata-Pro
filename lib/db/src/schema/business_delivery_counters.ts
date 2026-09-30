// packages/db/src/schema/business_delivery_counters.ts
import { pgTable, bigint, integer } from "drizzle-orm/pg-core";

export const businessDeliveryCountersTable = pgTable("business_delivery_counters", {
  businessId: bigint("business_id", { mode: "number" }).primaryKey(),
  lastNumber: integer("last_number").notNull().default(0),
});

export type BusinessDeliveryCounter = typeof businessDeliveryCountersTable.$inferSelect;