// // import { pgTable, bigserial, bigint, text, boolean, timestamp } from "drizzle-orm/pg-core";
// // import { createInsertSchema } from "drizzle-zod";
// // import { z } from "zod/v4";

// // export const notificationsTable = pgTable("notifications", {
// //   id: bigserial("id", { mode: "number" }).primaryKey(),
// //   businessId: bigint("business_id", { mode: "number" }),
// //   driverId: bigint("driver_id", { mode: "number" }),
// //   customerId: bigint("customer_id", { mode: "number" }),
// //   type: text("type", {
// //     enum: ["assigned", "completed", "address_updated", "payment_received", "order_confirmed"],
// //   }).notNull(),
// //   message: text("message").notNull(),
// //   isRead: boolean("is_read").notNull().default(false),
// //   createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
// // });

// // export const insertNotificationSchema = createInsertSchema(notificationsTable).omit({
// //   id: true,
// //   createdAt: true,
// // });

// // export type InsertNotification = z.infer<typeof insertNotificationSchema>;
// // export type Notification = typeof notificationsTable.$inferSelect;

// // lib/db/schema/notifications.ts
// //
// // ADDITIVE UPDATE — do not replace the table, only add columns/enum values.
// // Existing rows (type: assigned/completed/address_updated/payment_received/
// // order_confirmed, no title/delivery_id/sales_order_id/read_at) remain valid;
// // the new columns are nullable so nothing existing breaks.

// import { pgTable, bigserial, bigint, text, boolean, timestamp } from "drizzle-orm/pg-core";
// import { createInsertSchema } from "drizzle-zod";
// import { z } from "zod/v4";

// export const notificationsTable = pgTable("notifications", {
//   id: bigserial("id", { mode: "number" }).primaryKey(),
//   businessId: bigint("business_id", { mode: "number" }),
//   driverId: bigint("driver_id", { mode: "number" }),
//   customerId: bigint("customer_id", { mode: "number" }),

//   // NEW — links a notification back to the delivery/order it's about.
//   // Nullable: SYSTEM / ADMIN_MESSAGE notifications have neither.
//   deliveryId: bigint("delivery_id", { mode: "number" }),
//   salesOrderId: bigint("sales_order_id", { mode: "number" }),

//   type: text("type", {
//     enum: [
//       // existing values — unchanged, still used by notifications.ts and
//       // deliveries.ts /assign
//       "assigned",
//       "completed",
//       "address_updated",
//       "payment_received",
//       "order_confirmed",
//       // new values — driver notifications module
//       "accepted",
//       "picked_up",
//       "out_for_delivery",
//       "cancelled",
//       "fee_earned",
//       "system",
//       "admin_message",
//     ],
//   }).notNull(),

//   // NEW — short heading shown in the notification list. Nullable so old
//   // rows (which never had a title) don't need a backfill to render; the
//   // frontend falls back to a per-type default title when this is null.
//   title: text("title"),

//   message: text("message").notNull(),
//   isRead: boolean("is_read").notNull().default(false),

//   // NEW — when the driver actually read it, distinct from is_read so we
//   // can eventually show "read 2h ago" without another table.
//   readAt: timestamp("read_at", { withTimezone: true }),

//   createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
// });

// export const insertNotificationSchema = createInsertSchema(notificationsTable).omit({
//   id: true,
//   createdAt: true,
// });

// export type InsertNotification = z.infer<typeof insertNotificationSchema>;
// export type Notification = typeof notificationsTable.$inferSelect;

// lib/db/schema/notifications.ts
//
// ADDITIVE UPDATE — do not replace the table, only add columns/enum values.
// Existing rows (type: assigned/completed/address_updated/payment_received/
// order_confirmed, no title/delivery_id/sales_order_id/read_at) remain valid;
// the new columns are nullable so nothing existing breaks.

import { pgTable, bigserial, bigint, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const notificationsTable = pgTable("notifications", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" }),
  driverId: bigint("driver_id", { mode: "number" }),
  customerId: bigint("customer_id", { mode: "number" }),

  // NEW — links a notification back to the delivery/order it's about.
  // Nullable: SYSTEM / ADMIN_MESSAGE notifications have neither.
  deliveryId: bigint("delivery_id", { mode: "number" }),
  salesOrderId: bigint("sales_order_id", { mode: "number" }),

  type: text("type", {
    enum: [
      // existing values — unchanged, still used by notifications.ts and
      // deliveries.ts /assign
      "assigned",
      "completed",
      "address_updated",
      "payment_received",
      "order_confirmed",
      // new values — driver notifications module
      "accepted",
      "picked_up",
      "out_for_delivery",
      "cancelled",
      "fee_earned",
      "system",
      "admin_message",
    ],
  }).notNull(),

  // NEW — short heading shown in the notification list. Nullable so old
  // rows (which never had a title) don't need a backfill to render; the
  // frontend falls back to a per-type default title when this is null.
  title: text("title"),

  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),

  // NEW — when the driver actually read it, distinct from is_read so we
  // can eventually show "read 2h ago" without another table.
  readAt: timestamp("read_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notificationsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notificationsTable.$inferSelect;