import { pgTable, bigserial, bigint, varchar, text, timestamp, pgEnum, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const deliveryStatusEnum = pgEnum("delivery_status", [
  "pending",
  "assigned",
  "picked_up",
  "in_transit",
  "delivered",
  "cancelled",
]);

// deliveries.ts schema — add this field
export const deliveriesTable = pgTable("deliveries", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" }).notNull(),
  customerId: bigint("customer_id", { mode: "number" }).notNull(),
  salesOrderId: bigint("sales_order_id", { mode: "number" }), // ← NEW: links delivery back to the order
  driverId: bigint("driver_id", { mode: "number" }),
  pickupAddress: text("pickup_address").notNull(),
  dropAddress: text("drop_address").notNull(),
  status: deliveryStatusEnum("status").notNull().default("pending"),
  notes: text("notes"),
  amount: numeric('amount', { precision: 10, scale: 2 }),
  payment_method: text('payment_method', { enum: ['cod', 'online', 'card'] }),
  distance_km: numeric('distance_km', { precision: 6, scale: 2 }),
  assignedAt: timestamp("assigned_at", { withTimezone: true }),
  pickedUpAt: timestamp("picked_up_at", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  outForDeliveryAt: timestamp("out_for_delivery_at", { withTimezone: true }), 
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