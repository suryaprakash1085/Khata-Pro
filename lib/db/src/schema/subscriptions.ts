// db/schema/subscriptions.ts
import { pgTable, bigserial, bigint, varchar, decimal, date, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

// ⚠️ "free" REMOVED — only pro & premium now
export const planEnum = pgEnum("subscription_plan", ["pro", "premium"]);

// NEW enum
export const billingCycleEnum = pgEnum("billing_cycle", ["monthly", "quarterly", "half_yearly", "yearly"]);

// status: "active" default → mathi "trial" pannunga, since ella business-um trial-la than start aagum
export const subscriptionStatusEnum = pgEnum("subscription_status", ["trial", "active", "expired", "cancelled"]);

export const subscriptionsTable = pgTable("subscriptions", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" }).notNull().unique(),
  plan: planEnum("plan").notNull(),
  billingCycle: billingCycleEnum("billing_cycle").notNull().default("monthly"),      // NEW
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull().default("0"), // NEW
  startDate: date("start_date", { mode: "string" }).notNull(),
  endDate: date("end_date", { mode: "string" }).notNull(),
  trialStartDate: date("trial_start_date", { mode: "string" }),    // NEW
  trialEndDate: date("trial_end_date", { mode: "string" }),        // NEW
  status: subscriptionStatusEnum("status").notNull().default("trial"),
  paymentRef: varchar("payment_ref", { length: 255 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptionsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptionsTable.$inferSelect;