import { pgTable, bigserial, bigint, decimal, date, varchar, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { businessesTable } from "./businesses";
import { subscriptionsTable, planEnum, billingCycleEnum } from "./subscriptions";

export const paymentStatusEnum = pgEnum("subscription_payment_status", ["paid", "pending", "failed"]);

export const subscriptionPaymentsTable = pgTable("subscription_payments", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" }).notNull().references(() => businessesTable.id),
  subscriptionId: bigint("subscription_id", { mode: "number" }).references(() => subscriptionsTable.id),
  plan: planEnum("plan").notNull(),
  billingCycle: billingCycleEnum("billing_cycle").notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentDate: date("payment_date", { mode: "string" }).notNull(),
  status: paymentStatusEnum("status").notNull().default("paid"),
  paymentRef: varchar("payment_ref", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  
});

export const insertSubscriptionPaymentSchema = createInsertSchema(subscriptionPaymentsTable).omit({ id: true, createdAt: true });
export type InsertSubscriptionPayment = z.infer<typeof insertSubscriptionPaymentSchema>;
export type SubscriptionPayment = typeof subscriptionPaymentsTable.$inferSelect;