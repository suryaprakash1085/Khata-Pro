import { pgTable, bigserial, bigint, text, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const notificationsTable = pgTable("notifications", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" }),
  driverId: bigint("driver_id", { mode: "number" }),
  customerId: bigint("customer_id", { mode: "number" }),

  deliveryId: bigint("delivery_id", { mode: "number" }),
  salesOrderId: bigint("sales_order_id", { mode: "number" }),

  // NEW — for low_stock and vendor_payment_pending notifications
  productId: bigint("product_id", { mode: "number" }),
  vendorId: bigint("vendor_id", { mode: "number" }),
  purchaseId: bigint("purchase_id", { mode: "number" }),
 
  subscriptionId: bigint("subscription_id", { mode: "number" }),
  reminderDate: date("reminder_date", { mode: "string" }), // idempotency key for reminder-type notifs
  paymentRef: text("payment_ref"), // idempotency key for renewal-success notifs

  type: text("type", {
    enum: [
      // existing — unchanged
      "assigned",
      "completed",
      "address_updated",
      "payment_received",
      "order_confirmed",
      "accepted",
      "picked_up",
      "out_for_delivery",
      "cancelled",
      "fee_earned",
      "system",
      "admin_message",

      // NEW — admin notification system
      "new_order",
      "low_stock",
      "vendor_payment_pending",
      "vendor_payment_overdue",
      "order_cancelled",
      "return_requested",
      "subscription_renewal",
      "subscription_renewal_success",
      "subscription_trial_expiring",

      "order_return",
      "return_approved",
      "return_rejected",
      "replacement_sent",
    ],
  }).notNull(),

  title: text("title"),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  readAt: timestamp("read_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notificationsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notificationsTable.$inferSelect;