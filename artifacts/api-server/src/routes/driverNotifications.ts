// artifacts/api-server/src/routes/driverNotifications.ts
//
// Driver-facing notifications API. Separate from routes/notifications.ts
// (which stays untouched — it's used for the admin/order-confirmed-webhook
// flow). This router is meant to be mounted with requireDriverAuth applied
// at the app level, e.g. in your main router setup:
//
//   import driverNotificationsRouter from "./routes/driverNotifications";
//   app.use("/api/driver/notifications", requireDriverAuth, driverNotificationsRouter);
//
// Every handler below reads driverId/businessId from (req as any).driver,
// exactly like deliveries.ts does — never from req.query or req.body.

import { Router, type IRouter } from "express";
import { db, notificationsTable } from "@workspace/db";
import { eq, and, desc, count, inArray } from "drizzle-orm";

const router: IRouter = Router();

// Group notification `type` values into the four filter-tab buckets the
// frontend spec asks for (All / Unread / Deliveries / Earnings / System).
// Unread is handled separately via the `read` query param, not a type group.
const TYPE_GROUPS: Record<string, string[]> = {
  DELIVERIES: ["assigned", "accepted", "picked_up", "out_for_delivery", "completed", "cancelled", "address_updated"],
  EARNINGS: ["fee_earned", "payment_received"],
  SYSTEM: ["system", "admin_message", "order_confirmed"],
};

// Per-type friendly title fallback — used when a row has no `title` set
// (older rows created before this migration, or events that don't set one).
const DEFAULT_TITLES: Record<string, string> = {
  assigned: "New Delivery Assigned",
  accepted: "Delivery Accepted",
  picked_up: "Order Picked Up",
  out_for_delivery: "Out for Delivery",
  completed: "Delivery Completed",
  cancelled: "Delivery Cancelled",
  fee_earned: "Delivery Fee Earned",
  address_updated: "Customer Address Updated",
  payment_received: "Payment Received",
  order_confirmed: "Order Confirmed",
  system: "System Notification",
  admin_message: "Message from Admin",
};

// NOTE: snake_case in the response, to match your existing API convention
// (formatDelivery, the Notification/Delivery openapi schemas all use
// snake_case) — the first draft of this file used camelCase, which didn't
// match your edited openapi.yaml schema. Fixed here.
function formatNotification(n: typeof notificationsTable.$inferSelect) {
  return {
    id: Number(n.id),
    driver_id: n.driverId !== null ? Number(n.driverId) : null,
    delivery_id: n.deliveryId !== null && n.deliveryId !== undefined ? Number(n.deliveryId) : null,
    order_id: n.salesOrderId !== null && n.salesOrderId !== undefined ? Number(n.salesOrderId) : null,
    type: n.type,
    title: n.title ?? DEFAULT_TITLES[n.type] ?? "Notification",
    message: n.message,
    is_read: n.isRead,
    created_at: n.createdAt,
    read_at: n.readAt ?? null,
  };
}

// ============================================================
// GET /api/driver/notifications
// ?page=1&limit=20&type=ALL|DELIVERIES|EARNINGS|SYSTEM&read=ALL|READ|UNREAD
// ============================================================
router.get("/", async (req, res): Promise<void> => {
  const { driverId } = (req as any).driver;

  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const offset = (page - 1) * limit;

  const typeFilter = (req.query.type as string | undefined)?.toUpperCase();
  const readFilter = (req.query.read as string | undefined)?.toUpperCase();

  const conditions: any[] = [eq(notificationsTable.driverId, driverId)];

  if (typeFilter && typeFilter !== "ALL") {
    const group = TYPE_GROUPS[typeFilter];
    if (group && group.length > 0) {
      conditions.push(inArray(notificationsTable.type, group as any));
    }
  }

  if (readFilter === "READ") conditions.push(eq(notificationsTable.isRead, true));
  if (readFilter === "UNREAD") conditions.push(eq(notificationsTable.isRead, false));

  const [rows, totalResult] = await Promise.all([
    db
      .select()
      .from(notificationsTable)
      .where(and(...conditions))
      .orderBy(desc(notificationsTable.createdAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: count() }).from(notificationsTable).where(and(...conditions)),
  ]);

  const total = Number(totalResult[0]?.count ?? 0);

  res.json({
    success: true,
    data: rows.map(formatNotification),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
});

// ============================================================
// GET /api/driver/notifications/unread-count
// ============================================================
router.get("/unread-count", async (req, res): Promise<void> => {
  const { driverId } = (req as any).driver;

  const [result] = await db
    .select({ count: count() })
    .from(notificationsTable)
    .where(and(eq(notificationsTable.driverId, driverId), eq(notificationsTable.isRead, false)));

  res.json({ success: true, count: Number(result?.count ?? 0) });
});

// ============================================================
// PATCH /api/driver/notifications/:id/read
// ============================================================
router.patch("/:id/read", async (req, res): Promise<void> => {
  const { driverId } = (req as any).driver;
  const id = parseInt(req.params.id, 10);
  if (!Number.isInteger(id)) {
    res.status(400).json({ success: false, message: "Invalid notification id" });
    return;
  }

  const [existing] = await db.select().from(notificationsTable).where(eq(notificationsTable.id, id));
  // Same 404 whether it doesn't exist or belongs to another driver — never
  // leak that a notification id exists but isn't yours.
  if (!existing || Number(existing.driverId) !== driverId) {
    res.status(404).json({ success: false, message: "Notification not found" });
    return;
  }

  await db
    .update(notificationsTable)
    .set({ isRead: true, readAt: new Date() })
    .where(eq(notificationsTable.id, id));

  res.json({ success: true, message: "Notification marked as read" });
});

// ============================================================
// PATCH /api/driver/notifications/read-all
// ============================================================
router.patch("/read-all", async (req, res): Promise<void> => {
  const { driverId } = (req as any).driver;

  await db
    .update(notificationsTable)
    .set({ isRead: true, readAt: new Date() })
    .where(and(eq(notificationsTable.driverId, driverId), eq(notificationsTable.isRead, false)));

  res.json({ success: true, message: "All notifications marked as read" });
});

export default router;