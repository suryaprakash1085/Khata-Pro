import { Router, type IRouter } from "express";
import { z } from "zod";
import { db, platformSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";
import { logAudit } from "../lib/audit";

const router: IRouter = Router();

const SETTINGS_ID = 1;

// Gets the single settings row; creates it with defaults the first time.
async function getOrCreateSettings() {
  const [row] = await db
    .select()
    .from(platformSettingsTable)
    .where(eq(platformSettingsTable.id, SETTINGS_ID));
  if (row) return row;

  await db
    .insert(platformSettingsTable)
    .values({ id: SETTINGS_ID })
    .onConflictDoNothing();

  const [created] = await db
    .select()
    .from(platformSettingsTable)
    .where(eq(platformSettingsTable.id, SETTINGS_ID));
  return created;
}

// DB row -> snake_case API response (same style as the rest of admin.ts)
function serialize(s: typeof platformSettingsTable.$inferSelect) {
  return {
    high_volume_alert_threshold: parseFloat(s.highVolumeAlertThreshold),
    max_customers: s.maxCustomers,
    max_transactions_per_month: s.maxTransactionsPerMonth,

    available_plans: s.availablePlans,
    free_trial_days: s.freeTrialDays,
    default_billing_cycle: s.defaultBillingCycle,
    trial_after_expiry: s.trialAfterExpiry,

    sms_gateway: s.smsGateway,
    payment_gateway: s.paymentGateway,
    // Real status: connected only if credentials exist in env
    sms_connected: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
    payment_connected: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
    support_email: s.supportEmail,
    notification_email: s.notificationEmail,

    maintenance_mode: s.maintenanceMode,
    new_business_registration: s.newBusinessRegistration,
    notifications_enabled: s.notificationsEnabled,
    audit_logging: s.auditLogging,

    updated_at: s.updatedAt,
  };
}

const UpdateSettingsBody = z
  .object({
    high_volume_alert_threshold: z.number().positive(),
    max_customers: z.number().int().positive(),
    max_transactions_per_month: z.number().int().positive(),

    available_plans: z.enum(["pro-premium", "pro", "premium"]),
    free_trial_days: z.number().int().min(0).max(365),
    default_billing_cycle: z.enum(["monthly", "quarterly", "half_yearly", "yearly"]),
    trial_after_expiry: z.enum(["enabled", "disabled"]),

    support_email: z.string().email(),
    notification_email: z.string().email(),

    maintenance_mode: z.boolean(),
    new_business_registration: z.boolean(),
    notifications_enabled: z.boolean(),
    audit_logging: z.boolean(),
  })
  .partial()
  .strict();

// GET /admin/settings
router.get("/admin/settings", requireAdmin, async (_req, res): Promise<void> => {
  try {
    const settings = await getOrCreateSettings();
    res.json(serialize(settings));
  } catch (error: any) {
    res.status(500).json({ error: "Failed to load settings", message: error?.message });
  }
});

// PATCH /admin/settings  (partial update, any subset of fields)
router.patch("/admin/settings", requireAdmin, async (req, res): Promise<void> => {
  const parsed = UpdateSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: "Invalid settings",
      message: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join(", "),
    });
    return;
  }

  const b = parsed.data;
  if (Object.keys(b).length === 0) {
    res.status(400).json({ error: "No settings provided" });
    return;
  }

  try {
    const before = await getOrCreateSettings();

    const updates: Partial<typeof platformSettingsTable.$inferInsert> = { updatedAt: new Date() };
    if (b.high_volume_alert_threshold !== undefined)
      updates.highVolumeAlertThreshold = String(b.high_volume_alert_threshold);
    if (b.max_customers !== undefined) updates.maxCustomers = b.max_customers;
    if (b.max_transactions_per_month !== undefined)
      updates.maxTransactionsPerMonth = b.max_transactions_per_month;
    if (b.available_plans !== undefined) updates.availablePlans = b.available_plans;
    if (b.free_trial_days !== undefined) updates.freeTrialDays = b.free_trial_days;
    if (b.default_billing_cycle !== undefined) updates.defaultBillingCycle = b.default_billing_cycle;
    if (b.trial_after_expiry !== undefined) updates.trialAfterExpiry = b.trial_after_expiry;
    if (b.support_email !== undefined) updates.supportEmail = b.support_email;
    if (b.notification_email !== undefined) updates.notificationEmail = b.notification_email;
    if (b.maintenance_mode !== undefined) updates.maintenanceMode = b.maintenance_mode;
    if (b.new_business_registration !== undefined)
      updates.newBusinessRegistration = b.new_business_registration;
    if (b.notifications_enabled !== undefined) updates.notificationsEnabled = b.notifications_enabled;
    if (b.audit_logging !== undefined) updates.auditLogging = b.audit_logging;

    const [updated] = await db
      .update(platformSettingsTable)
      .set(updates)
      .where(eq(platformSettingsTable.id, SETTINGS_ID))
      .returning();

    // Audit log: only the fields that were sent
    const { updatedAt: _a, ...changed } = updates;
    const oldValue: Record<string, unknown> = {};
    for (const key of Object.keys(changed)) {
      oldValue[key] = (before as any)[key];
    }
    const adminId = (req as any).user?.userId ?? null;
    await logAudit({
      userId: adminId,
      action: "platform_settings_updated",
      entityType: "platform_settings",
      entityId: SETTINGS_ID,
      oldValue,
      newValue: changed,
    });

    res.json(serialize(updated));
  } catch (error: any) {
    req.log?.error(error, "Update settings failed");
    res.status(500).json({ error: "Failed to update settings", message: error?.message });
  }
});

export default router;