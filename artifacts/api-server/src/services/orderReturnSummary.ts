// artifacts/api-server/src/services/orderReturnSummary.ts
//
// Builds the per-order `return_request` object the customer app expects on
// GET /customers/me/orders, from the order_returns table.
// One order can have several returns (one per product), so we aggregate:
//   overall status priority: REQUESTED > APPROVED > REPLACEMENT_SENT > REJECTED

import { db, orderReturnsTable, productsTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";

export type CustomerReturnRequest = {
  id: number;
  status: "REQUESTED" | "APPROVED" | "REJECTED" | "REPLACEMENT_SENT";
  reason: string;
  admin_note: string | null;
  items: { product_id: number; product_name: string; qty: number; status: string }[];
};

const PRIORITY = ["REQUESTED", "APPROVED", "REPLACEMENT_SENT", "REJECTED"] as const;

export async function getReturnRequestsByOrder(orderIds: number[]): Promise<Map<number, CustomerReturnRequest>> {
  const result = new Map<number, CustomerReturnRequest>();
  if (orderIds.length === 0) return result;

  const rows = await db
    .select({ r: orderReturnsTable, productName: productsTable.name })
    .from(orderReturnsTable)
    .innerJoin(productsTable, eq(orderReturnsTable.productId, productsTable.id))
    .where(inArray(orderReturnsTable.salesOrderId, orderIds))
    .orderBy(orderReturnsTable.id);

  const grouped = new Map<number, typeof rows>();
  for (const row of rows) {
    const key = Number(row.r.salesOrderId);
    const list = grouped.get(key) ?? [];
    list.push(row);
    grouped.set(key, list);
  }

  for (const [orderId, list] of grouped) {
    const status = PRIORITY.find((s) => list.some((x) => x.r.status === s)) ?? "REQUESTED";
    const lead = list.find((x) => x.r.status === status) ?? list[0];

    result.set(orderId, {
      id: lead.r.id,
      status,
      reason: lead.r.reason,
      admin_note: lead.r.adminNote ?? null,
      items: list.map((x) => ({
        product_id: Number(x.r.productId),
        product_name: x.productName,
        qty: parseFloat(x.r.qty as any),
        status: x.r.status,
      })),
    });
  }

  return result;
}