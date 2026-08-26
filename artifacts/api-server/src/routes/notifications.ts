
 import { Router, type IRouter } from "express";
import { db, notificationsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
 
const router: IRouter = Router();
 
// GET /notifications?driver_id=X&business_id=Y&limit=20
router.get("/", async (req, res): Promise<void> => {
  const driverId = req.query.driver_id ? Number(req.query.driver_id) : undefined;
  const businessId = req.query.business_id ? Number(req.query.business_id) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : 20;
 
  const conditions: any[] = [];
  if (driverId) conditions.push(eq(notificationsTable.driverId, driverId));
  if (businessId) conditions.push(eq(notificationsTable.businessId, businessId));
 
  const result = await db
    .select()
    .from(notificationsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(notificationsTable.createdAt))
    .limit(limit);
 
  res.json(result);
});


router.post("/order-confirmed", async (req, res): Promise<void> => {
  try {
    const { orderId, businessId, customerId, deliveryAddress, type, driverName } = req.body;

    if (!orderId || !businessId || !type) {
      res.status(400).json({ 
        error: "Missing required fields: orderId, businessId, and type are required" 
      });
      return;
    }

    // ✅ Map frontend types to schema enum values
    let dbType = type;
    if (type === 'confirmed') {
      dbType = 'order_confirmed';
    }

    let messageText = "";

    // ✅ SEPARATE MESSAGES FOR EACH TYPE
    if (type === 'confirmed') {
      // ORDER CONFIRMATION - Simple confirmation message
      messageText = `Order #${orderId} confirmed. Your order has been placed successfully.`;
    } else if (type === 'assigned') {
      // DRIVER ASSIGNMENT - Include driver name and address
      messageText = `Driver ${driverName || 'Rajesh'} assigned to order #${orderId}. Deliver to ${deliveryAddress || 'address not specified'}`;
    } else {
      messageText = `Order #${orderId} updated.`;
    }

    const notification = {
      driverId: null,
      businessId: businessId,
      customerId: customerId || null,
      type: dbType,
      message: messageText,
      isRead: false,
      createdAt: new Date(),
    };

    const result = await db
      .insert(notificationsTable)
      .values(notification)
      .returning();

    res.status(201).json({
      success: true,
      notification: result[0],
      message: `Notification created successfully`
    });

  } catch (error) {
    console.error("❌ Error creating notification:", error);
    res.status(500).json({ 
      error: "Failed to create notification",
      details: error instanceof Error ? error.message : "Unknown error"
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