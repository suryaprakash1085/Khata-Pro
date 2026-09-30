// artifacts/api-server/src/services/notificationService.ts
import { db, notificationsTable, customersTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { sendPushNotification } from "./pushNotifications";

// ------------------------------------------------------------
// DRIVER notifications (unchanged)
// ------------------------------------------------------------
type DriverNotificationType =
  | "assigned" | "accepted" | "picked_up" | "out_for_delivery"
  | "completed" | "cancelled" | "fee_earned";

interface CreateDriverNotificationInput {
  driverId: number;
  type: DriverNotificationType;
  title: string;
  message: string;
  deliveryId?: number | null;
  salesOrderId?: number | null;
}

export async function createDriverNotification(input: CreateDriverNotificationInput) {
  const [row] = await db.insert(notificationsTable).values({
    driverId: input.driverId,
    deliveryId: input.deliveryId ?? null,
    salesOrderId: input.salesOrderId ?? null,
    type: input.type,
    title: input.title,
    message: input.message,
  }).returning();
  return row;
}

export const notifyDriverAssigned = (driverId: number, salesOrderId: number, deliveryId: number) =>
  createDriverNotification({
    driverId, deliveryId, salesOrderId, type: "assigned",
    title: "New Delivery Assigned",
    message: `Order #${salesOrderId} has been assigned to you.`,
  });

export const notifyDriverAccepted = (driverId: number, salesOrderId: number, deliveryId: number) =>
  createDriverNotification({
    driverId, deliveryId, salesOrderId, type: "accepted",
    title: "Delivery Accepted",
    message: `Your delivery for Order #${salesOrderId} has been accepted.`,
  });

export const notifyOrderPickedUp = (driverId: number, salesOrderId: number, deliveryId: number) =>
  createDriverNotification({
    driverId, deliveryId, salesOrderId, type: "picked_up",
    title: "Order Picked Up",
    message: `Order #${salesOrderId} has been picked up successfully.`,
  });

export const notifyOutForDelivery = (driverId: number, salesOrderId: number, deliveryId: number) =>
  createDriverNotification({
    driverId, deliveryId, salesOrderId, type: "out_for_delivery",
    title: "Out for Delivery",
    message: `Order #${salesOrderId} is now out for delivery.`,
  });

export const notifyDeliveryCompleted = (driverId: number, salesOrderId: number, deliveryId: number) =>
  createDriverNotification({
    driverId, deliveryId, salesOrderId, type: "completed",
    title: "Delivery Completed",
    message: `Order #${salesOrderId} has been delivered successfully.`,
  });

export const notifyDeliveryCancelled = (driverId: number, salesOrderId: number, deliveryId: number) =>
  createDriverNotification({
    driverId, deliveryId, salesOrderId, type: "cancelled",
    title: "Delivery Cancelled",
    message: `Order #${salesOrderId} has been cancelled.`,
  });

// deliveryFeeAmount MUST come from the real stored/calculated fee — never hardcode.
export const notifyDeliveryFeeEarned = (driverId: number, salesOrderId: number, deliveryId: number, deliveryFeeAmount: number) =>
  createDriverNotification({
    driverId, deliveryId, salesOrderId, type: "fee_earned",
    title: "Delivery Fee Earned",
    message: `₹${deliveryFeeAmount} delivery fee has been added to your earnings.`,
  });

// ------------------------------------------------------------
// CUSTOMER notifications (NEW)
// Inserts an in-app row (shown in the bell) AND sends a push if the
// customer has a saved Expo push token. Push failure never throws.
// ------------------------------------------------------------
type CustomerNotificationType =
  | "order_confirmed" | "assigned" | "picked_up"
  | "out_for_delivery" | "completed" | "cancelled";

interface NotifyCustomerInput {
  businessId: number;
  customerId: number;
  type: CustomerNotificationType;
  title: string;
  message: string;
  deliveryId?: number | null;
  salesOrderId?: number | null;
}

export async function notifyCustomer(input: NotifyCustomerInput) {
  const [row] = await db.insert(notificationsTable).values({
    businessId: input.businessId,
    customerId: input.customerId,
    driverId: null,
    deliveryId: input.deliveryId ?? null,
    salesOrderId: input.salesOrderId ?? null,
    type: input.type,
    title: input.title,
    message: input.message,
  }).returning();

  // Push is a bonus — never let it break the main flow
  try {
    const [c] = await db
      .select({ pushToken: customersTable.pushToken })
      .from(customersTable)
      .where(eq(customersTable.id, input.customerId));

    if (c?.pushToken) {
      await sendPushNotification(c.pushToken, input.title, input.message, {
        type: input.type,
        deliveryId: input.deliveryId ?? null,
        orderId: input.salesOrderId ?? null,
      });
    }
  } catch (err) {
    console.error("[notifyCustomer] push failed:", err);
  }

  return row;
}