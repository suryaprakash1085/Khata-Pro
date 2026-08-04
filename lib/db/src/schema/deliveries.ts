import { pgTable, bigserial, bigint, varchar, text, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// pending      -> just placed, no driver yet
// assigned     -> admin assigned a driver
// picked_up    -> driver collected the order from the store
// in_transit   -> driver is on the way to the customer
// delivered    -> completed
// cancelled    -> cancelled by admin/customer before delivery
export const deliveryStatusEnum = pgEnum("delivery_status", [
  "pending",
  "assigned",
  "picked_up",
  "in_transit",
  "delivered",
  "cancelled",
]);

export const deliveriesTable = pgTable("deliveries", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" }).notNull(),
  customerId: bigint("customer_id", { mode: "number" }).notNull(),
  // Nullable until an admin assigns a driver.
  driverId: bigint("driver_id", { mode: "number" }),

  pickupAddress: text("pickup_address").notNull(),
  dropAddress: text("drop_address").notNull(),

  status: deliveryStatusEnum("status").notNull().default("pending"),
  notes: text("notes"),

  // Timeline — set as the delivery progresses through each status.
  assignedAt: timestamp("assigned_at", { withTimezone: true }),
  pickedUpAt: timestamp("picked_up_at", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertDeliverySchema = createInsertSchema(deliveriesTable).omit({
  id: true,
  assignedAt: true,
  pickedUpAt: true,
  deliveredAt: true,
  cancelledAt: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertDelivery = z.infer<typeof insertDeliverySchema>;
export type Delivery = typeof deliveriesTable.$inferSelect;