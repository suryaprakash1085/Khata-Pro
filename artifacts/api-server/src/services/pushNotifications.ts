// /**
//  * pushNotifications.ts
//  * -----------------------------------------------------------------------
//  * Sends push notifications to delivery-app via Expo's push service.
//  * No API key needed for Expo push — it's free and keyless for basic use.
//  *
//  * delivery-app side: uses `expo-notifications` to generate a token like
//  * "ExponentPushToken[xxxxxxxxxxxx]" and sends it to the backend, which
//  * saves it on the driver's row (see POST /drivers/push-token route).
//  * -----------------------------------------------------------------------
//  */

// interface PushMessage {
//   to: string; // Expo push token
//   title: string;
//   body: string;
//   data?: Record<string, unknown>;
// }

// export class PushNotificationError extends Error {
//   constructor(message: string) {
//     super(message);
//     this.name = "PushNotificationError";
//   }
// }

// export async function sendPushNotification(
//   pushToken: string,
//   title: string,
//   body: string,
//   data?: Record<string, unknown>
// ): Promise<void> {
//   if (!pushToken || !pushToken.startsWith("ExponentPushToken")) {
//     console.warn(`[push] Skipping invalid/missing push token: ${pushToken}`);
//     return;
//   }

//   const message: PushMessage = { to: pushToken, title, body, data };

//   const res = await fetch("https://exp.host/--/api/v2/push/send", {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Accept-Encoding": "gzip, deflate",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(message),
//   });

//   const result = await res.json().catch(() => ({}));

//   if (!res.ok) {
//     throw new PushNotificationError(`Expo push failed: ${JSON.stringify(result)}`);
//   }
//   // Expo returns { data: { status: 'ok' | 'error', ... } } — log errors but
//   // don't throw, since a bad token shouldn't break the delivery-assignment flow.
//   const status = (result as any)?.data?.status;
//   if (status === "error") {
//     console.error(`[push] Expo reported an error:`, result);
//   }
// }

// /** Convenience wrapper for the one notification this app currently sends. */
// export async function notifyDriverOfNewDelivery(
//   pushToken: string,
//   deliveryId: number,
//   dropAddress: string
// ): Promise<void> {
//   await sendPushNotification(
//     pushToken,
//     "New delivery assigned",
//     `Deliver to: ${dropAddress}`,
//     { deliveryId, type: "delivery_assigned" }
//   );
// }

// export async function notifyCustomerOrderConfirmed(
//   pushToken: string,
//   orderId: number
// ): Promise<void> {
//   await sendPushNotification(
//     pushToken,
//     "Order Confirmed",
//     `Your order #${orderId} has been confirmed.`,
//     { orderId, type: "order_confirmed" }
//   );
// }

// export async function notifyCustomerDriverAssigned(
//   pushToken: string,
//   driverName: string,
//   deliveryId: number
// ): Promise<void> {
//   await sendPushNotification(
//     pushToken,
//     "Delivery Partner Assigned",
//     `${driverName} has been assigned to deliver your order.`,
//     { deliveryId, type: "driver_assigned" }
//   );
// }

import { db, deviceTokensTable } from "@workspace/db";
import { and, eq, inArray } from "drizzle-orm";
import { getMessaging } from "firebase-admin/messaging";
import { getFirebaseApp } from "../lib/firebase";

export type PushUserType = "customer" | "driver";

export interface PushPayload {
  title: string;
  body: string;
  data?: Record<string, unknown>;
}

// Indha error codes vandha, token dead (app uninstall / token expire). DB-la irundhu delete pannidalaam.
const DEAD_TOKEN_CODES = new Set([
  "messaging/registration-token-not-registered",
  "messaging/invalid-registration-token",
]);

async function sendToTokens(tokens: string[], payload: PushPayload): Promise<void> {
  const app = getFirebaseApp();
  if (!app || tokens.length === 0) return;

  // FCM data values ellame string-ah irukkanum
  const data: Record<string, string> = {};
  for (const [k, v] of Object.entries(payload.data ?? {})) {
    if (v !== null && v !== undefined) data[k] = String(v);
  }

  const res = await getMessaging(app).sendEachForMulticast({
    tokens,
    notification: { title: payload.title, body: payload.body },
    data,
    android: {
      priority: "high",
      notification: { channelId: "orders", sound: "default" },
    },
  });

  const dead: string[] = [];
  res.responses.forEach((r, i) => {
    if (r.success) return;
    const code = r.error?.code ?? "";
    if (DEAD_TOKEN_CODES.has(code)) dead.push(tokens[i]);
    else console.error(`[push] FCM send failed (${code}):`, r.error?.message);
  });

  if (dead.length) {
    await db.delete(deviceTokensTable).where(inArray(deviceTokensTable.token, dead));
  }
}

/** Oru user-oda ella devices-kum push anuppum. Eppovum throw pannaadhu. */
export async function sendPushToUser(
  userType: PushUserType,
  userId: number,
  payload: PushPayload,
): Promise<void> {
  try {
    const rows = await db
      .select({ token: deviceTokensTable.token })
      .from(deviceTokensTable)
      .where(and(eq(deviceTokensTable.userType, userType), eq(deviceTokensTable.userId, userId)));

    await sendToTokens(rows.map((r) => r.token), payload);
  } catch (err) {
    console.error("[push] sendPushToUser failed:", err);
  }
}

/** Pazhaya signature - vera file edhavadhu import pannirundha compile aaga. Expo token ippo support illa. */
export async function sendPushNotification(
  pushToken: string,
  title: string,
  body: string,
  data?: Record<string, unknown>,
): Promise<void> {
  if (!pushToken || pushToken.startsWith("ExponentPushToken")) {
    console.warn("[push] Skipping legacy Expo/empty token");
    return;
  }
  await sendToTokens([pushToken], { title, body, data });
}

export const notifyDriverOfNewDelivery = (driverId: number, deliveryId: number, dropAddress: string) =>
  sendPushToUser("driver", driverId, {
    title: "New delivery assigned",
    body: `Deliver to: ${dropAddress}`,
    data: { type: "delivery_assigned", deliveryId },
  });

export const notifyCustomerOrderConfirmed = (customerId: number, orderId: number) =>
  sendPushToUser("customer", customerId, {
    title: "Order Confirmed",
    body: `Your order #${orderId} has been confirmed.`,
    data: { type: "order_confirmed", orderId },
  });

export const notifyCustomerDriverAssigned = (customerId: number, driverName: string, deliveryId: number) =>
  sendPushToUser("customer", customerId, {
    title: "Delivery Partner Assigned",
    body: `${driverName} has been assigned to deliver your order.`,
    data: { type: "driver_assigned", deliveryId },
  });