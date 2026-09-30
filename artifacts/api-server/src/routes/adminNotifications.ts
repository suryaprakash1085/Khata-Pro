// artifacts/api-server/src/routes/adminNotifications.ts
//
// Mount with requireAuth at the app level:
//   import adminNotificationsRouter from "./routes/adminNotifications";
//   app.use("/api/admin-notifications", requireAuth, adminNotificationsRouter);

import { Router, type IRouter } from "express";
import { db, notificationsTable } from "@workspace/db";
import { eq, and, desc, count, inArray } from "drizzle-orm";
import { syncVendorPaymentNotifications } from "../services/adminNotifications.service";

const router: IRouter = Router();

const TYPE_GROUPS: Record<string, string[]> = {
  NEW_ORDERS: ["new_order"],
  ORDER_CANCELLED: ["order_cancelled"],
  LOW_STOCK: ["low_stock"],
  VENDOR_PAYMENTS: ["vendor_payment_pending", "vendor_payment_overdue"],
  SUBSCRIPTION: [
    "subscription_renewal",
    "subscription_renewal_success",
    "subscription_trial_expiring",
  ],
  ANNOUNCEMENTS: ["admin_message"],
};

// Types this router is allowed to ever surface. Any notification type
// created outside adminNotifications.service.ts (e.g. driver/delivery
// events written into the same shared notificationsTable) is excluded
// here, regardless of filter, so the two consumers of this table never
// bleed into each other.
const ADMIN_NOTIFICATION_TYPES = Object.values(TYPE_GROUPS).flat();

function formatNotification(n: typeof notificationsTable.$inferSelect) {
  return {
    id: Number(n.id),
    type: n.type,
    title: n.title,
    message: n.message,
    order_id: n.salesOrderId != null ? Number(n.salesOrderId) : null,
    product_id: n.productId != null ? Number(n.productId) : null,
    vendor_id: n.vendorId != null ? Number(n.vendorId) : null,
    purchase_id: n.purchaseId != null ? Number(n.purchaseId) : null,
    subscription_id: n.subscriptionId != null ? Number(n.subscriptionId) : null,
    is_read: n.isRead,
    created_at: n.createdAt,
    read_at: n.readAt ?? null,
  };
}

function getBusinessId(req: any): number {
  return Number(
    req.query.business_id ?? req.user?.businessId ?? req.user?.business_id
  );
}

// GET /admin-notifications?business_id=&filter=ALL|NEW_ORDERS|LOW_STOCK|VENDOR_PAYMENTS|UNREAD&page=&limit=
router.get("/", async (req, res): Promise<void> => {
  const businessId = getBusinessId(req);
  if (!businessId) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }

  await syncVendorPaymentNotifications(businessId).catch((err) =>
    console.error("[admin-notifications] vendor payment sync failed:", err),
  );

  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 20));
  const offset = (page - 1) * limit;
  const filter = (req.query.filter as string | undefined)?.toUpperCase();

  const conditions: any[] = [
    eq(notificationsTable.businessId, businessId),
    // Always scope to admin types, whatever the filter — this is the line
    // that was missing, and the reason driver notifications leaked in.
    inArray(notificationsTable.type, ADMIN_NOTIFICATION_TYPES as any),
  ];

  if (filter === "UNREAD") {
    conditions.push(eq(notificationsTable.isRead, false));
  } else if (filter && filter !== "ALL" && TYPE_GROUPS[filter]) {
    // narrow further within the admin type set
    conditions.push(inArray(notificationsTable.type, TYPE_GROUPS[filter] as any));
  }
  // filter === "ALL" (or no filter) → all admin types, which is now the
  // conditions array as-is; no separate branch needed.

  const [rows, totalResult] = await Promise.all([
    db.select().from(notificationsTable).where(and(...conditions))
      .orderBy(desc(notificationsTable.createdAt)).limit(limit).offset(offset),
    db.select({ count: count() }).from(notificationsTable).where(and(...conditions)),
  ]);

  res.json({
    data: rows.map(formatNotification),
    total: Number(totalResult[0]?.count ?? 0),
    page,
    limit,
  });
});

// GET /admin-notifications/unread-count?business_id=
router.get("/unread-count", async (req, res): Promise<void> => {
  const businessId = getBusinessId(req);
  if (!businessId) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const [result] = await db
    .select({ count: count() })
    .from(notificationsTable)
    .where(
      and(
        eq(notificationsTable.businessId, businessId),
        eq(notificationsTable.isRead, false),
        inArray(notificationsTable.type, ADMIN_NOTIFICATION_TYPES as any),
      ),
    );
  res.json({ count: Number(result?.count ?? 0) });
});

// PATCH /admin-notifications/:id/read
// PATCH /admin-notifications/:id/read
router.patch("/:id/read", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const [existing] = await db.select().from(notificationsTable).where(eq(notificationsTable.id, id));

  if (!existing) {
    res.status(404).json({ error: "Notification not found" });
    return;
  }
  if (!ADMIN_NOTIFICATION_TYPES.includes(existing.type)) {
    // Not an admin-panel notification (e.g. a driver event) — refuse
    // instead of silently marking it read from the wrong surface.
    res.status(404).json({ error: "Notification not found" });
    return;
  }

  await db.update(notificationsTable).set({ isRead: true, readAt: new Date() }).where(eq(notificationsTable.id, id));
  res.json({ message: "Notification marked as read" });
});

// PATCH /admin-notifications/mark-all-read?business_id=
router.patch("/mark-all-read", async (req, res): Promise<void> => {
  const businessId = getBusinessId(req);
  if (!businessId) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  await db.update(notificationsTable).set({ isRead: true, readAt: new Date() })
    .where(
      and(
        eq(notificationsTable.businessId, businessId),
        eq(notificationsTable.isRead, false),
        inArray(notificationsTable.type, ADMIN_NOTIFICATION_TYPES as any),
      ),
    );
  res.json({ message: "All notifications marked as read" });
});

export default router;