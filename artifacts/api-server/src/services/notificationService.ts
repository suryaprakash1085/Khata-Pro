// artifacts/api-server/src/services/notificationService.ts
import { db, notificationsTable } from "@workspace/db";

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

// deliveryFeeAmount MUST come from the real stored/calculated fee (e.g. from
// sales_orders.delivery_fee_amount, per your deliveryFeeService) — never hardcode.
export const notifyDeliveryFeeEarned = (driverId: number, salesOrderId: number, deliveryId: number, deliveryFeeAmount: number) =>
  createDriverNotification({
    driverId, deliveryId, salesOrderId, type: "fee_earned",
    title: "Delivery Fee Earned",
    message: `₹${deliveryFeeAmount} delivery fee has been added to your earnings.`,
  });