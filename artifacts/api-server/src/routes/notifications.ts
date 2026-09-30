import { Router, type IRouter } from "express";
import { db, notificationsTable } from "@workspace/db";
import { eq, and, desc, count } from "drizzle-orm";
import { requireCustomerAuth } from "../middlewares/customerAuth";
import { notifyCustomer } from "../services/notificationService";

const router: IRouter = Router();

// ============================================================
// CUSTOMER routes (token based — customerId comes from the JWT,
// never from the query string, so nobody can read another
// customer's notifications).
// NOTE: these are declared first; they don't clash with the
// admin/driver routes below because the paths are different.
// ============================================================

// GET /notifications/me?limit=30
router.get("/me", requireCustomerAuth, async (req, res): Promise<void> => {
  const { customerId } = (req as any).customer;
  const limit = Math.min(Number(req.query.limit) || 30, 100);

  const rows = await db
    .select()
    .from(notificationsTable)
    .where(eq(notificationsTable.customerId, customerId))
    .orderBy(desc(notificationsTable.createdAt))
    .limit(limit);

  res.json(rows);
});

// GET /notifications/me/unread-count  (bell badge)
router.get("/me/unread-count", requireCustomerAuth, async (req, res): Promise<void> => {
  const { customerId } = (req as any).customer;

  const [r] = await db
    .select({ count: count() })
    .from(notificationsTable)
    .where(and(eq(notificationsTable.customerId, customerId), eq(notificationsTable.isRead, false)));

  res.json({ count: Number(r.count) });
});

// POST /notifications/me/mark-read   Body: { id }
router.post("/me/mark-read", requireCustomerAuth, async (req, res): Promise<void> => {
  const { customerId } = (req as any).customer;
  const id = Number(req.body?.id);
  if (!id || isNaN(id)) {
    res.status(400).json({ error: "id is required" });
    return;
  }

  await db
    .update(notificationsTable)
    .set({ isRead: true, readAt: new Date() })
    .where(and(eq(notificationsTable.id, id), eq(notificationsTable.customerId, customerId)));

  res.json({ success: true });
});

// POST /notifications/me/mark-all-read
router.post("/me/mark-all-read", requireCustomerAuth, async (req, res): Promise<void> => {
  const { customerId } = (req as any).customer;

  await db
    .update(notificationsTable)
    .set({ isRead: true, readAt: new Date() })
    .where(and(eq(notificationsTable.customerId, customerId), eq(notificationsTable.isRead, false)));

  res.json({ success: true });
});

// ============================================================
// DRIVER / ADMIN routes (existing behaviour)
// ============================================================

// GET /notifications?driver_id=X&business_id=Y&limit=20
router.get("/", async (req, res): Promise<void> => {
  const driverId = req.query.driver_id ? Number(req.query.driver_id) : undefined;
  const businessId = req.query.business_id ? Number(req.query.business_id) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : 20;

  // Without any filter this used to return EVERY notification of every user.
  if (!driverId && !businessId) {
    res.status(400).json({ error: "driver_id or business_id is required" });
    return;
  }

  const conditions: any[] = [];
  if (driverId) conditions.push(eq(notificationsTable.driverId, driverId));
  if (businessId) conditions.push(eq(notificationsTable.businessId, businessId));

  const result = await db
    .select()
    .from(notificationsTable)
    .where(and(...conditions))
    .orderBy(desc(notificationsTable.createdAt))
    .limit(limit);

  res.json(result);
});

// POST /notifications/mark-read
// Body: { id: number }  (also accepts { notification_id } etc.)
router.post("/mark-read", async (req, res): Promise<void> => {
  try {
    console.log("📩 /notifications/mark-read incoming body:", req.body);

    const raw =
      req.body?.id ??
      req.body?.notification_id ??
      req.body?.notificationId ??
      req.body?.ids?.[0] ??
      req.body?.notification_ids?.[0] ??
      req.query?.id;

    const id = Number(raw);

    if (!raw || isNaN(id)) {
      res.status(400).json({
        error: "Missing or invalid notification id",
        received_body: req.body,
      });
      return;
    }

    const result = await db
      .update(notificationsTable)
      .set({ isRead: true })
      .where(eq(notificationsTable.id, id))
      .returning();

    if (result.length === 0) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    res.status(200).json({
      success: true,
      notification: result[0],
    });
  } catch (error) {
    console.error("❌ Error marking notification as read:", error);
    res.status(500).json({
      error: "Failed to mark notification as read",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /notifications/mark-all-read
// Body: { driver_id?: number, business_id?: number }
router.post("/mark-all-read", async (req, res): Promise<void> => {
  try {
    const driverId = req.body?.driver_id ? Number(req.body.driver_id) : undefined;
    const businessId = req.body?.business_id ? Number(req.body.business_id) : undefined;

    if (!driverId && !businessId) {
      res.status(400).json({ error: "driver_id or business_id is required" });
      return;
    }

    const conditions: any[] = [eq(notificationsTable.isRead, false)];
    if (driverId) conditions.push(eq(notificationsTable.driverId, driverId));
    if (businessId) conditions.push(eq(notificationsTable.businessId, businessId));

    const result = await db
      .update(notificationsTable)
      .set({ isRead: true })
      .where(and(...conditions))
      .returning();

    res.status(200).json({
      success: true,
      updatedCount: result.length,
    });
  } catch (error) {
    console.error("❌ Error marking all notifications as read:", error);
    res.status(500).json({
      error: "Failed to mark all notifications as read",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// POST /notifications/order-confirmed
// Called by the admin frontend when the business confirms an order.
router.post("/order-confirmed", async (req, res): Promise<void> => {
  try {
    const { orderId, businessId, customerId, deliveryAddress, type, driverName } = req.body;

    if (!orderId || !businessId || !type) {
      res.status(400).json({
        error: "Missing required fields: orderId, businessId, and type are required",
      });
      return;
    }

    // ---- Order confirmed -> customer (DB row + push) ----
    if (type === "confirmed") {
      const messageText = `Order #${orderId} confirmed. Your order has been placed successfully.`;

      if (customerId) {
        const row = await notifyCustomer({
          businessId: Number(businessId),
          customerId: Number(customerId),
          salesOrderId: Number(orderId),
          type: "order_confirmed",
          title: "Order Confirmed",
          message: messageText,
        });
        res.status(201).json({ success: true, notification: row });
        return;
      }
      // No customerId sent -> fall through to the old business-level row below
    }

    let dbType = type;
    if (type === "confirmed") dbType = "order_confirmed";

    let messageText = "";
    if (type === "confirmed") {
      messageText = `Order #${orderId} confirmed. Your order has been placed successfully.`;
    } else if (type === "assigned") {
      messageText = `Driver ${driverName || "Rajesh"} assigned to order #${orderId}. Deliver to ${deliveryAddress || "address not specified"}`;
    } else {
      messageText = `Order #${orderId} updated.`;
    }

    const result = await db
      .insert(notificationsTable)
      .values({
        driverId: null,
        businessId: Number(businessId),
        customerId: customerId ? Number(customerId) : null,
        type: dbType,
        message: messageText,
        isRead: false,
        createdAt: new Date(),
      })
      .returning();

    res.status(201).json({
      success: true,
      notification: result[0],
      message: `Notification created successfully`,
    });
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    res.status(500).json({
      error: "Failed to create notification",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

// DELETE /notifications/:id
router.delete("/:id", async (req, res): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!id || isNaN(id)) {
      res.status(400).json({ error: "Invalid notification id" });
      return;
    }

    const result = await db
      .delete(notificationsTable)
      .where(eq(notificationsTable.id, id))
      .returning();

    if (result.length === 0) {
      res.status(404).json({ error: "Notification not found" });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      deleted: result[0],
    });
  } catch (error) {
    console.error("❌ Error deleting notification:", error);
    res.status(500).json({
      error: "Failed to delete notification",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;