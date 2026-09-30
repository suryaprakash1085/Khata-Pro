import { pgTable, bigserial, decimal, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { planEnum } from "./subscriptions"; // reuse same enum, see Step 2

export const subscriptionPlansTable = pgTable("subscription_plans", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  plan: planEnum("plan").notNull().unique(), // "pro" | "premium"

  monthlyPrice: decimal("monthly_price", { precision: 10, scale: 2 }).notNull(),
  quarterlyPrice: decimal("quarterly_price", { precision: 10, scale: 2 }).notNull(),
  halfYearlyPrice: decimal("half_yearly_price", { precision: 10, scale: 2 }).notNull(),
  yearlyPrice: decimal("yearly_price", { precision: 10, scale: 2 }).notNull(),

  trialDays: integer("trial_days").notNull().default(15),

  // -1 = unlimited
  maxUsers: integer("max_users").notNull().default(-1),
  maxBranches: integer("max_branches").notNull().default(-1),
  maxProducts: integer("max_products").notNull().default(-1),
  maxCustomers: integer("max_customers").notNull().default(-1),
  maxVendors: integer("max_vendors").notNull().default(-1),
  maxOrders: integer("max_orders").notNull().default(-1),

  // e.g. { "aiChat": true, "aiReminder": true, "advancedReports": false }
  features: jsonb("features").$type<Record<string, boolean>>().notNull().default({}),

  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlansTable).omit({
  id: true, createdAt: true, updatedAt: true,
});
export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type SubscriptionPlanRow = typeof subscriptionPlansTable.$inferSelect;