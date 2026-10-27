import { pgTable, serial, integer, text, boolean, timestamp, numeric } from "drizzle-orm/pg-core";

// Single-row table: always id = 1
export const platformSettingsTable = pgTable("platform_settings", {
  id: serial("id").primaryKey(),

  // Global thresholds
  highVolumeAlertThreshold: numeric("high_volume_alert_threshold").notNull().default("500000"),
  maxCustomers: integer("max_customers").notNull().default(1000),
  maxTransactionsPerMonth: integer("max_transactions_per_month").notNull().default(5000),

  // Subscription defaults
  availablePlans: text("available_plans").notNull().default("pro-premium"), // pro-premium | pro | premium
  freeTrialDays: integer("free_trial_days").notNull().default(15),
  defaultBillingCycle: text("default_billing_cycle").notNull().default("monthly"),
  trialAfterExpiry: text("trial_after_expiry").notNull().default("disabled"), // enabled | disabled

  // Integrations
  smsGateway: text("sms_gateway").notNull().default("Twilio"),
  paymentGateway: text("payment_gateway").notNull().default("Razorpay"),
  supportEmail: text("support_email").notNull().default("support@khatapro.in"),
  notificationEmail: text("notification_email").notNull().default("notifications@khatapro.in"),

  // Platform controls
  maintenanceMode: boolean("maintenance_mode").notNull().default(false),
  newBusinessRegistration: boolean("new_business_registration").notNull().default(true),
  notificationsEnabled: boolean("notifications_enabled").notNull().default(true),
  auditLogging: boolean("audit_logging").notNull().default(true),

  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export type PlatformSettings = typeof platformSettingsTable.$inferSelect;