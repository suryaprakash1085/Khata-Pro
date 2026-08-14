import { pgTable, bigserial, bigint, text, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const notificationsTable = pgTable("notifications", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" }),
  driverId: bigint("driver_id", { mode: "number" }),
  customerId: bigint("customer_id", { mode: "number" }),
  type: text("type", {
    enum: ["assigned", "completed", "address_updated", "payment_received", "order_confirmed"],
  }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notificationsTable).omit({
  id: true,
  createdAt: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notificationsTable.$inferSelect;