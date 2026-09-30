import { db, businessDeliveryCountersTable } from "@workspace/db";
import { sql } from "drizzle-orm";

// Atomic per-business delivery number. INSERT ... ON CONFLICT DO UPDATE
// takes a row-level lock, so two deliveries created at the same instant
// for the same business can never get the same number.
//
// Used by every place that inserts into deliveriesTable:
//   - routes/deliveries.ts        (POST /deliveries)
//   - routes/sales-orders.ts      (POST /sales-orders, POST /public/sales-orders)
export async function getNextDeliveryNumber(businessId: number): Promise<number> {
  const [row] = await db
    .insert(businessDeliveryCountersTable)
    .values({ businessId, lastNumber: 1 })
    .onConflictDoUpdate({
      target: businessDeliveryCountersTable.businessId,
      set: { lastNumber: sql`${businessDeliveryCountersTable.lastNumber} + 1` },
    })
    .returning({ lastNumber: businessDeliveryCountersTable.lastNumber });

  return row.lastNumber;
}