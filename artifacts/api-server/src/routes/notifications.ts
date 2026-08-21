 
// import { Router, type IRouter } from "express";
// import { db, notificationsTable } from "@workspace/db";
// import { eq, and, desc } from "drizzle-orm";
 
// const router: IRouter = Router();
 
// // GET /notifications?driver_id=X&business_id=Y&limit=20
// router.get("/", async (req, res): Promise<void> => {
//   const driverId = req.query.driver_id ? Number(req.query.driver_id) : undefined;
//   const businessId = req.query.business_id ? Number(req.query.business_id) : undefined;
//   const limit = req.query.limit ? Number(req.query.limit) : 20;
 
//   // 🔶 FIX — build the where conditions as an array and pass them to a
//   // single .where(and(...)) call. Drizzle's query builder returns a
//   // narrower type after each chained .where()/.orderBy()/.limit(), so
//   // reassigning `query = db.select()...` in different branches (as the
//   // original code did) breaks TypeScript — each branch produces an
//   // incompatible type for the same variable.
//   const conditions: any[] = [];
//   if (driverId) conditions.push(eq(notificationsTable.driverId, driverId));
//   if (businessId) conditions.push(eq(notificationsTable.businessId, businessId));
 
//   const result = await db
//     .select()
//     .from(notificationsTable)
//     .where(conditions.length > 0 ? and(...conditions) : undefined)
//     .orderBy(desc(notificationsTable.createdAt))
//     .limit(limit);
 
//   res.json(result);
// });
// //  router.post("/order-confirmed", async (req, res): Promise<void> => {
// //   try {
// //     const { orderId, businessId, customerId, deliveryAddress } = req.body;

// //     // Validate required fields
// //     if (!orderId || !businessId) {
// //       res.status(400).json({ 
// //         error: "Missing required fields: orderId and businessId are required" 
// //       });
// //       return;
// //     }

// //     // Create confirmation notification
// //     const notification = {
// //       driverId: null, // Not assigned to specific driver yet
// //       businessId: businessId,
// //       customerId: customerId || null,
// //       type: "confirmed", // This matches your notification type
// //       messageText: `Order #${orderId} confirmed. Deliver to ${deliveryAddress || 'address not specified'}`,
// //       isRead: false,
// //       createdAt: new Date().toISOString(),
// //       updatedAt: new Date().toISOString()
// //     };

// //     // Insert into database
// //     const result = await db
// //       .insert(notificationsTable)
// //       .values(notification)
// //       .returning();

// //     // Send success response
// //     res.status(201).json({
// //       success: true,
// //       notification: result[0],
// //       message: "Order confirmation notification created successfully"
// //     });

// //   } catch (error) {
// //     console.error("❌ Error creating order confirmation notification:", error);
// //     res.status(500).json({ 
// //       error: "Failed to create order confirmation notification",
// //       details: error instanceof Error ? error.message : "Unknown error"
// //     });
// //   }
// // });

// // router.post("/order-confirmed", async (req, res): Promise<void> => {
// //   try {
// //     // ✅ Accept 'type' and 'driverName' now
// //     const { orderId, businessId, customerId, deliveryAddress, type, driverName } = req.body;

// //     // Validate required fields
// //     if (!orderId || !businessId || !type) {
// //       res.status(400).json({ 
// //         error: "Missing required fields: orderId, businessId, and type are required" 
// //       });
// //       return;
// //     }

// //     let messageText = "";
// //     let iconType = type;

// //     // ✅ DYNAMIC MESSAGE GENERATION based on the TYPE
// //     if (type === 'confirmed') {
// //       messageText = `Order #${orderId} confirmed. Deliver to ${deliveryAddress || 'address not specified'}`;
// //     } else if (type === 'assigned') {
// //       messageText = `Driver ${driverName || 'Driver'} assigned to order #${orderId}. Deliver to ${deliveryAddress || 'address not specified'}`;
// //     } else {
// //       // Fallback for any other types
// //       messageText = `Order #${orderId} updated.`;
// //     }

// //     // Create notification object
// //     const notification = {
// //       driverId: null, // Not assigned to specific driver yet (for confirmed)
// //       businessId: businessId,
// //       customerId: customerId || null,
// //       type: type, // ✅ This is now dynamic ('confirmed' or 'assigned')
// //       messageText: messageText,
// //       isRead: false,
// //       createdAt: new Date().toISOString(),
// //       updatedAt: new Date().toISOString()
// //     };

// //     // Insert into database
// //     const result = await db
// //       .insert(notificationsTable)
// //       .values(notification)
// //       .returning();

// //     // Send success response
// //     res.status(201).json({
// //       success: true,
// //       notification: result[0],
// //       message: `Notification created successfully`
// //     });

// //   } catch (error) {
// //     console.error("❌ Error creating notification:", error);
// //     res.status(500).json({ 
// //       error: "Failed to create notification",
// //       details: error instanceof Error ? error.message : "Unknown error"
// //     });
// //   }
// // });
// // notifications.ts
// // router.post("/order-confirmed", async (req, res): Promise<void> => {
// //   try {
// //     const { orderId, businessId, customerId, deliveryAddress, type, driverName } = req.body;

// //     if (!orderId || !businessId || !type) {
// //       res.status(400).json({ 
// //         error: "Missing required fields: orderId, businessId, and type are required" 
// //       });
// //       return;
// //     }

// //     let messageText = "";

// //     // ✅ SEPARATE NOTIFICATION MESSAGES
// //     if (type === 'confirmed') {
// //       // ORDER CONFIRMATION - Simple and clear
// //       messageText = `Order #${orderId} confirmed. Your order has been placed successfully.`;
// //     } else if (type === 'assigned') {
// //       // DRIVER ASSIGNMENT - Include driver name
// //       messageText = `Driver ${driverName || 'Rajesh'} has been assigned to order #${orderId}.`;
// //     } else {
// //       messageText = `Order #${orderId} updated.`;
// //     }

// //     const notification = {
// //       driverId: type === 'assigned' ? null : null, // Keep as null for now
// //       businessId: businessId,
// //       customerId: customerId || null,
// //       type: type, // 'confirmed' or 'assigned'
// //       messageText: messageText,
// //       isRead: false,
// //       createdAt: new Date().toISOString(),
// //       updatedAt: new Date().toISOString()
// //     };

// //     const result = await db
// //       .insert(notificationsTable)
// //       .values(notification)
// //       .returning();

// //     res.status(201).json({
// //       success: true,
// //       notification: result[0],
// //       message: `Notification created successfully`
// //     });

// //   } catch (error) {
// //     console.error("❌ Error creating notification:", error);
// //     res.status(500).json({ 
// //       error: "Failed to create notification",
// //       details: error instanceof Error ? error.message : "Unknown error"
// //     });
// //   }
// // });

// // notifications.ts - Backend route (updated)
// router.post("/order-confirmed", async (req, res): Promise<void> => {
//   try {
//     const { orderId, businessId, customerId, deliveryAddress, type, driverName } = req.body;

//     if (!orderId || !businessId || !type) {
//       res.status(400).json({ 
//         error: "Missing required fields: orderId, businessId, and type are required" 
//       });
//       return;
//     }

//     let messageText = "";

//     // ✅ SEPARATE MESSAGES FOR EACH TYPE
//     if (type === 'confirmed') {
//       // ORDER CONFIRMATION - Simple confirmation message
//       messageText = `Order #${orderId} confirmed. Your order has been placed successfully.`;
//     } else if (type === 'assigned') {
//       // DRIVER ASSIGNMENT - Include driver name
//       messageText = `Driver ${driverName || 'Rajesh'} assigned to order #${orderId}. Deliver to ${deliveryAddress || 'address not specified'}`;
//     } else {
//       messageText = `Order #${orderId} updated.`;
//     }

//     const notification = {
//       driverId: null,
//       businessId: businessId,
//       customerId: customerId || null,
//       type: type, // 'confirmed' or 'assigned'
//       messageText: messageText,
//       isRead: false,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     };

//     const result = await db
//       .insert(notificationsTable)
//       .values(notification)
//       .returning();

//     res.status(201).json({
//       success: true,
//       notification: result[0],
//       message: `Notification created successfully`
//     });

//   } catch (error) {
//     console.error("❌ Error creating notification:", error);
//     res.status(500).json({ 
//       error: "Failed to create notification",
//       details: error instanceof Error ? error.message : "Unknown error"
//     });
//   }
// });
// export default router;
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

// POST /notifications/order-confirmed
// router.post("/order-confirmed", async (req, res): Promise<void> => {
//   try {
//     const { orderId, businessId, customerId, deliveryAddress, type, driverName } = req.body;

//     if (!orderId || !businessId || !type) {
//       res.status(400).json({ 
//         error: "Missing required fields: orderId, businessId, and type are required" 
//       });
//       return;
//     }

//     let messageText = "";

//     // ✅ SEPARATE MESSAGES FOR EACH TYPE
//     if (type === 'confirmed') {
//       // ORDER CONFIRMATION - Simple confirmation message
//       messageText = `Order #${orderId} confirmed. Your order has been placed successfully.`;
//     } else if (type === 'assigned') {
//       // DRIVER ASSIGNMENT - Include driver name
//       messageText = `Driver ${driverName || 'Rajesh'} assigned to order #${orderId}. Deliver to ${deliveryAddress || 'address not specified'}`;
//     } else {
//       messageText = `Order #${orderId} updated.`;
//     }

//     // const notification = {
//     //   driverId: null,
//     //   businessId: businessId,
//     //   customerId: customerId || null,
//     //   type: type, // 'confirmed' or 'assigned'
//     //   messageText: messageText,
//     //   isRead: false,
//     //   createdAt: new Date().toISOString(),
//     //   updatedAt: new Date().toISOString()
//     // };
//     const notification = {
//   driverId: null,
//   businessId: businessId,
//   customerId: customerId || null,
//   type: type, // 'confirmed' or 'assigned'
//   message: messageText,
//   isRead: false,
//   createdAt: new Date().toISOString(),
//   updatedAt: new Date().toISOString()
// };

//     const result = await db
//       .insert(notificationsTable)
//       .values(notification)
//       .returning();

//     res.status(201).json({
//       success: true,
//       notification: result[0],
//       message: `Notification created successfully`
//     });

//   } catch (error) {
//     console.error("❌ Error creating notification:", error);
//     res.status(500).json({ 
//       error: "Failed to create notification",
//       details: error instanceof Error ? error.message : "Unknown error"
//     });
//   }
// });

// POST /notifications/order-confirmed
// router.post("/order-confirmed", async (req, res): Promise<void> => {
//   try {
//     const { orderId, businessId, customerId, deliveryAddress, type, driverName } = req.body;

//     if (!orderId || !businessId || !type) {
//       res.status(400).json({ 
//         error: "Missing required fields: orderId, businessId, and type are required" 
//       });
//       return;
//     }

//     // ✅ Map frontend types to schema enum values
//     let dbType = type;
//     if (type === 'confirmed') {
//       dbType = 'order_confirmed';  // ✅ Map to schema enum
//     }

//     // let messageText = "";

//     // // ✅ SEPARATE MESSAGES FOR EACH TYPE
//     // if (type === 'confirmed') {
//     //   // ORDER CONFIRMATION - Simple confirmation message
//     //   messageText = `Order #${orderId} confirmed. Your order has been placed successfully.`;
//     // } else if (type === 'assigned') {
//     //   // DRIVER ASSIGNMENT - Include driver name and address
//     //   messageText = `Driver ${driverName || 'Rajesh'} assigned to order #${orderId}. Deliver to ${deliveryAddress || 'address not specified'}`;
//     // } else {
//     //   messageText = `Order #${orderId} updated.`;
//     // }
//     let messageText = "";

//     // ✅ SEPARATE MESSAGES FOR EACH TYPE
//     if (type === 'confirmed') {
//       // ORDER CONFIRMATION - Include delivery address for "Arriving by" display
//       messageText = `Order #${orderId} confirmed. Your order has been placed successfully. Deliver to ${deliveryAddress || 'address not specified'}`;
//     } else if (type === 'assigned') {
//       // DRIVER ASSIGNMENT - Include driver name and address
//       messageText = `Driver ${driverName || 'Rajesh'} assigned to order #${orderId}. Deliver to ${deliveryAddress || 'address not specified'}`;
//     } else {
//       messageText = `Order #${orderId} updated.`;
//     }
//     const notification = {
//       driverId: null,
//       businessId: businessId,
//       customerId: customerId || null,
//       type: dbType,  // ✅ Use mapped type (order_confirmed or assigned)
//       message: messageText,  // ✅ Correct field name
//       isRead: false,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     };

//     const result = await db
//       .insert(notificationsTable)
//       .values(notification)
//       .returning();

//     res.status(201).json({
//       success: true,
//       notification: result[0],
//       message: `Notification created successfully`
//     });

//   } catch (error) {
//     console.error("❌ Error creating notification:", error);
//     res.status(500).json({ 
//       error: "Failed to create notification",
//       details: error instanceof Error ? error.message : "Unknown error"
//     });
//   }
// });
// POST /notifications/order-confirmed
// router.post("/order-confirmed", async (req, res): Promise<void> => {
//   try {
//     const { orderId, businessId, customerId, deliveryAddress, type, driverName } = req.body;

//     if (!orderId || !businessId || !type) {
//       res.status(400).json({ 
//         error: "Missing required fields: orderId, businessId, and type are required" 
//       });
//       return;
//     }

//     // ✅ Map frontend types to schema enum values
//     let dbType = type;
//     if (type === 'confirmed') {
//       dbType = 'order_confirmed';  // ✅ Map to schema enum
//     }

//     let messageText = "";

//     // ✅ SEPARATE MESSAGES FOR EACH TYPE
//     if (type === 'confirmed') {
//       // ORDER CONFIRMATION - Include delivery address for "Arriving by" display
//       messageText = `Order #${orderId} confirmed. Your order has been placed successfully. Deliver to ${deliveryAddress || 'address not specified'}`;
//     } else if (type === 'assigned') {
//       // DRIVER ASSIGNMENT - Include driver name and address
//       messageText = `Driver ${driverName || 'Rajesh'} assigned to order #${orderId}. Deliver to ${deliveryAddress || 'address not specified'}`;
//     } else {
//       messageText = `Order #${orderId} updated.`;
//     }

//     const notification = {
//       driverId: null,
//       businessId: businessId,
//       customerId: customerId || null,
//       type: dbType,  // ✅ Use mapped type (order_confirmed or assigned)
//       message: messageText,  // ✅ Correct field name
//       isRead: false,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     };

//     const result = await db
//       .insert(notificationsTable)
//       .values(notification)
//       .returning();

//     res.status(201).json({
//       success: true,
//       notification: result[0],
//       message: `Notification created successfully`
//     });

//   } catch (error) {
//     console.error("❌ Error creating notification:", error);
//     res.status(500).json({ 
//       error: "Failed to create notification",
//       details: error instanceof Error ? error.message : "Unknown error"
//     });
//   }
// });

// POST /notifications/order-confirmed
// router.post("/order-confirmed", async (req, res): Promise<void> => {
//   try {
//     const { orderId, businessId, customerId, deliveryAddress, type, driverName } = req.body;

//     if (!orderId || !businessId || !type) {
//       res.status(400).json({ 
//         error: "Missing required fields: orderId, businessId, and type are required" 
//       });
//       return;
//     }

//     // ✅ Map frontend types to schema enum values
//     let dbType = type;
//     if (type === 'confirmed') {
//       dbType = 'order_confirmed';
//     }

//     let messageText = "";
//     let notificationTitle = "";

//     // ✅ SEPARATE MESSAGES FOR EACH TYPE
//     if (type === 'confirmed') {
//       // ORDER CONFIRMATION - Simple confirmation message
//       messageText = `Order #${orderId} confirmed. Your order has been placed successfully.`;
//       notificationTitle = "Order Confirmed";
//     } else if (type === 'assigned') {
//       // DRIVER ASSIGNMENT - Include driver name and address
//       messageText = `Driver ${driverName || 'Rajesh'} assigned to order #${orderId}. Deliver to ${deliveryAddress || 'address not specified'}`;
//       notificationTitle = "Driver Assigned";
//     } else {
//       messageText = `Order #${orderId} updated.`;
//       notificationTitle = "Order Updated";
//     }

//     const notification = {
//       driverId: null,
//       businessId: businessId,
//       customerId: customerId || null,
//       type: dbType,
//       message: messageText,
//       title: notificationTitle, // ✅ Add title field
//       isRead: false,
//       createdAt: new Date().toISOString(),
//       updatedAt: new Date().toISOString()
//     };

//     const result = await db
//       .insert(notificationsTable)
//       .values(notification)
//       .returning();

//     res.status(201).json({
//       success: true,
//       notification: result[0],
//       message: `Notification created successfully`
//     });

//   } catch (error) {
//     console.error("❌ Error creating notification:", error);
//     res.status(500).json({ 
//       error: "Failed to create notification",
//       details: error instanceof Error ? error.message : "Unknown error"
//     });
//   }
// });
// POST /notifications/order-confirmed
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