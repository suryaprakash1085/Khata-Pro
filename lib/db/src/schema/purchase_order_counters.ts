import { pgTable, bigint, integer } from "drizzle-orm/pg-core";

// One row per business. Incremented atomically via ON CONFLICT DO UPDATE
// at insert time (see routes/purchase-orders.ts) — this is what guarantees
// no two purchase orders for the same business can ever get the same
// sequence number, even under concurrent requests.
export const purchaseOrderCountersTable = pgTable("purchase_order_counters", {
  businessId: bigint("business_id", { mode: "number" }).primaryKey(),
  lastNumber: integer("last_number").notNull().default(0),
});