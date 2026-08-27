import { pgTable, bigserial, bigint, varchar, text, timestamp, pgEnum, numeric, integer, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// pending      -> just placed, no driver yet
// assigned     -> admin assigned a driver (acceptedAt set once driver taps Accept)
// picked_up    -> driver collected the order from the store
// in_transit   -> driver is on the way to the customer (arrivedAt set once driver taps Arrived)
// delivered    -> completed
// cancelled    -> cancelled/rejected before delivery
export const deliveryStatusEnum = pgEnum("delivery_status", [
  "pending",
  "assigned",
  "picked_up",
  "in_transit",
  "delivered",
  "cancelled",
]);

// COD payment collection state. Irrelevant/unused for non-COD orders.
export const deliveryPaymentStatusEnum = pgEnum("delivery_payment_status", [
  "not_applicable", // online/prepaid orders
  "pending",         // COD, not yet collected
  "collected",       // COD, driver confirmed collection
]);

export const deliveriesTable = pgTable("deliveries", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" }).notNull(),
  customerId: bigint("customer_id", { mode: "number" }).notNull(),
  salesOrderId: bigint("sales_order_id", { mode: "number" }),
  driverId: bigint("driver_id", { mode: "number" }),
  pickupAddress: text("pickup_address").notNull(),
  dropAddress: text("drop_address").notNull(),
  status: deliveryStatusEnum("status").notNull().default("pending"),
  notes: text("notes"),
  amount: numeric("amount", { precision: 10, scale: 2 }),
  payment_method: text("payment_method", { enum: ["cod", "online", "card"] }),
  distance_km: numeric("distance_km", { precision: 6, scale: 2 }),

  // --- NEW: order-specific delivery snapshot (driver never needs to look
  // these up on customer_addresses / customers — they're frozen here at
  // assignment time, same "snapshot" convention as sales_orders' delivery-fee fields) ---
  deliveryLandmark: varchar("delivery_landmark", { length: 255 }),
  deliveryInstructions: text("delivery_instructions"),

  // --- NEW: status-flow timestamps beyond the original 4.
  // "accepted" and "arrived" are sub-states within "assigned" / "in_transit"
  // respectively — we deliberately did NOT add new enum values (existing
  // enum stays backward compatible), we just track the extra timestamp.
  assignedAt: timestamp("assigned_at", { withTimezone: true }),
  acceptedAt: timestamp("accepted_at", { withTimezone: true }),
  pickedUpAt: timestamp("picked_up_at", { withTimezone: true }),
  outForDeliveryAt: timestamp("out_for_delivery_at", { withTimezone: true }), // set when status -> in_transit
  arrivedAt: timestamp("arrived_at", { withTimezone: true }),
  deliveredAt: timestamp("delivered_at", { withTimezone: true }),
  cancelledAt: timestamp("cancelled_at", { withTimezone: true }),

  // --- NEW: rejection/cancellation reason ---
  rejectionReason: text("rejection_reason"),
  cancellationReason: text("cancellation_reason"),

  // --- NEW: customer delivery-verification OTP.
  // Deliberately separate from drivers.otpCode (that's driver LOGIN OTP).
  // Stored as a hash, never plaintext — never exposed to the driver.
  otpHash: varchar("otp_hash", { length: 255 }),
  otpExpiresAt: timestamp("otp_expires_at", { withTimezone: true }),
  otpAttempts: integer("otp_attempts").notNull().default(0),
  otpResendCount: integer("otp_resend_count").notNull().default(0),
  otpLastSentAt: timestamp("otp_last_sent_at", { withTimezone: true }), // for resend cooldown
  otpVerifiedAt: timestamp("otp_verified_at", { withTimezone: true }),

  // --- NEW: COD payment collection tracking.
  // Kept here (not a new payments table) since this is just gating state
  // for the driver flow. The actual ledger entry still goes into the
  // existing `transactions` table when payment is confirmed.
  paymentStatus: deliveryPaymentStatusEnum("payment_status").notNull().default("not_applicable"),
  paymentCollectedAt: timestamp("payment_collected_at", { withTimezone: true }),
  paymentCollectedBy: bigint("payment_collected_by", { mode: "number" }), // driver id
  collectedAmount: numeric("collected_amount", { precision: 10, scale: 2 }),
  transactionId: bigint("transaction_id", { mode: "number" }), // links to transactions row created on collection

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  driverIdIdx: index("deliveries_driver_id_idx").on(table.driverId),
  businessIdIdx: index("deliveries_business_id_idx").on(table.businessId),
  customerIdIdx: index("deliveries_customer_id_idx").on(table.customerId),
  statusIdx: index("deliveries_status_idx").on(table.status),
  salesOrderIdIdx: index("deliveries_sales_order_id_idx").on(table.salesOrderId),
  createdAtIdx: index("deliveries_created_at_idx").on(table.createdAt),
  outForDeliveryAt: timestamp("out_for_delivery_at", { withTimezone: true }), 
}));
  
export const insertDeliverySchema = createInsertSchema(deliveriesTable).omit({
  id: true,
  assignedAt: true,
  acceptedAt: true,
  pickedUpAt: true,
  outForDeliveryAt: true,
  arrivedAt: true,
  deliveredAt: true,
  cancelledAt: true,
  otpHash: true,
  otpExpiresAt: true,
  otpAttempts: true,
  otpResendCount: true,
  otpLastSentAt: true,
  otpVerifiedAt: true,
  paymentCollectedAt: true,
  paymentCollectedBy: true,
  collectedAmount: true,
  transactionId: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertDelivery = z.infer<typeof insertDeliverySchema>;
export type Delivery = typeof deliveriesTable.$inferSelect;