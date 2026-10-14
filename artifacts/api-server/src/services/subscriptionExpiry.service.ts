import { and, inArray, lt } from "drizzle-orm";
import { db, subscriptionsTable, businessesTable } from "@workspace/db";

export async function expireOverdueSubscriptions() {
  const today = new Date().toISOString().split("T")[0];

  return db.transaction(async (tx) => {
    const expired = await tx
      .update(subscriptionsTable)
      .set({ status: "expired" } as any)
      .where(
        and(
          inArray(subscriptionsTable.status, ["active", "trial"] as any),
          lt(subscriptionsTable.endDate, today)
        )
      )
      .returning({ businessId: subscriptionsTable.businessId });

    const ids = expired.map((r) => Number(r.businessId));
    if (ids.length) {
      await tx
        .update(businessesTable)
        .set({ isActive: false })
        .where(inArray(businessesTable.id, ids));
    }
    return ids.length;
  });
}