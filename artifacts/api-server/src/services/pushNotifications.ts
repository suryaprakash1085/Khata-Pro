/**
 * pushNotifications.ts
 * -----------------------------------------------------------------------
 * Sends push notifications to delivery-app via Expo's push service.
 * No API key needed for Expo push — it's free and keyless for basic use.
 *
 * delivery-app side: uses `expo-notifications` to generate a token like
 * "ExponentPushToken[xxxxxxxxxxxx]" and sends it to the backend, which
 * saves it on the driver's row (see POST /drivers/push-token route).
 * -----------------------------------------------------------------------
 */

interface PushMessage {
  to: string; // Expo push token
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

export class PushNotificationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PushNotificationError";
  }
}

export async function sendPushNotification(
  pushToken: string,
  title: string,
  body: string,
  data?: Record<string, unknown>
): Promise<void> {
  if (!pushToken || !pushToken.startsWith("ExponentPushToken")) {
    console.warn(`[push] Skipping invalid/missing push token: ${pushToken}`);
    return;
  }

  const message: PushMessage = { to: pushToken, title, body, data };

  const res = await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-Encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });

  const result = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new PushNotificationError(`Expo push failed: ${JSON.stringify(result)}`);
  }
  // Expo returns { data: { status: 'ok' | 'error', ... } } — log errors but
  // don't throw, since a bad token shouldn't break the delivery-assignment flow.
  const status = (result as any)?.data?.status;
  if (status === "error") {
    console.error(`[push] Expo reported an error:`, result);
  }
}

/** Convenience wrapper for the one notification this app currently sends. */
export async function notifyDriverOfNewDelivery(
  pushToken: string,
  deliveryId: number,
  dropAddress: string
): Promise<void> {
  await sendPushNotification(
    pushToken,
    "New delivery assigned",
    `Deliver to: ${dropAddress}`,
    { deliveryId, type: "delivery_assigned" }
  );
}

export async function notifyCustomerOrderConfirmed(
  pushToken: string,
  orderId: number
): Promise<void> {
  await sendPushNotification(
    pushToken,
    "Order Confirmed",
    `Your order #${orderId} has been confirmed.`,
    { orderId, type: "order_confirmed" }
  );
}

export async function notifyCustomerDriverAssigned(
  pushToken: string,
  driverName: string,
  deliveryId: number
): Promise<void> {
  await sendPushNotification(
    pushToken,
    "Delivery Partner Assigned",
    `${driverName} has been assigned to deliver your order.`,
    { deliveryId, type: "driver_assigned" }
  );
}