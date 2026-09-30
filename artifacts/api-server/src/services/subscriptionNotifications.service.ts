import { db, notificationsTable, subscriptionsTable } from "@workspace/db";
import { eq, and, inArray, sql } from "drizzle-orm";

// ── Config: reminder timing per billing cycle ──────────────────────────────
const RENEWAL_REMINDER_DAYS: Record<string, number> = {
  yearly: 15,
  half_yearly: 10,
  quarterly: 8,
  monthly: 5,
};

const TRIAL_REMINDER_DAYS_BEFORE = 2;

function daysBetween(a: Date, b: Date): number {
  const MS = 24 * 60 * 60 * 1000;
  const utcA = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utcB = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
  return Math.round((utcB - utcA) / MS);
}

function fmtDate(d: Date): string {
  return d.toISOString().split("T")[0];
}

function planLabel(plan: string): string {
  return plan.charAt(0).toUpperCase() + plan.slice(1);
}

function cycleLabel(cycle: string): string {
  return { monthly: "monthly", quarterly: "quarterly", half_yearly: "half-yearly", yearly: "yearly" }[cycle] ?? cycle;
}

function formatDisplayDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

// ── 1. Paid subscription renewal reminders (daily job) ─────────────────────
export async function checkSubscriptionRenewalReminders(): Promise<void> {
  const today = new Date();

  const subs = await db
    .select()
    .from(subscriptionsTable)
    .where(inArray(subscriptionsTable.status, ["trial", "active"]));

  for (const sub of subs) {
    const reminderDays = RENEWAL_REMINDER_DAYS[sub.billingCycle];
    if (!reminderDays || !sub.endDate) continue;

    const remaining = daysBetween(today, new Date(sub.endDate));
    if (remaining !== reminderDays) continue;

    const reminderDateStr = fmtDate(today);

    const [existing] = await db
      .select({ id: notificationsTable.id })
      .from(notificationsTable)
      .where(
        and(
          eq(notificationsTable.businessId, sub.businessId),
          eq(notificationsTable.subscriptionId, sub.id),
          eq(notificationsTable.type, "subscription_renewal"),
          eq(notificationsTable.reminderDate, reminderDateStr),
        ),
      );
    if (existing) continue;

    await db.insert(notificationsTable).values({
      businessId: sub.businessId,
      subscriptionId: sub.id,
      reminderDate: reminderDateStr,
      type: "subscription_renewal",
      title: "Subscription Renewal Reminder",
      message: `Your ${planLabel(sub.plan)} ${cycleLabel(sub.billingCycle)} subscription expires in ${remaining} days. Renew now to continue using Khata-Pro without interruption.`,
    });
  }
}

// ── 2. Trial expiring reminder (daily job) ──────────────────────────────────
export async function checkTrialExpiringReminders(): Promise<void> {
  const today = new Date();

  const trialSubs = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.status, "trial"));

  for (const sub of trialSubs) {
    if (!sub.trialEndDate) continue;
    const remaining = daysBetween(today, new Date(sub.trialEndDate));
    if (remaining !== TRIAL_REMINDER_DAYS_BEFORE) continue;

    const reminderDateStr = fmtDate(today);

    const [existing] = await db
      .select({ id: notificationsTable.id })
      .from(notificationsTable)
      .where(
        and(
          eq(notificationsTable.businessId, sub.businessId),
          eq(notificationsTable.subscriptionId, sub.id),
          eq(notificationsTable.type, "subscription_trial_expiring"),
          eq(notificationsTable.reminderDate, reminderDateStr),
        ),
      );
    if (existing) continue;

    await db.insert(notificationsTable).values({
      businessId: sub.businessId,
      subscriptionId: sub.id,
      reminderDate: reminderDateStr,
      type: "subscription_trial_expiring",
      title: "Free Trial Ending Soon",
      message: `Your free trial expires in ${remaining} days. Choose a plan to continue using Khata-Pro without interruption.`,
    });
  }
}

// ── 3. Trial expiration → status flip (daily job) ──────────────────────────
export async function expireOverdueTrials(): Promise<void> {
  await db
    .update(subscriptionsTable)
    .set({ status: "expired" })
    .where(
      and(
        eq(subscriptionsTable.status, "trial"),
        sql`${subscriptionsTable.trialEndDate} < current_date`,
      ),
    );
}

// ── 3b. Expire overdue active (paid) subscriptions too ─────────────────────
export async function expireOverduePaidSubscriptions(): Promise<void> {
  await db
    .update(subscriptionsTable)
    .set({ status: "expired" })
    .where(
      and(
        eq(subscriptionsTable.status, "active"),
        sql`${subscriptionsTable.endDate} < current_date`,
      ),
    );
}

// ── 4. Renewal success — fired immediately after verified payment ──────────
export async function createRenewalSuccessNotification(params: {
  businessId: number;
  subscriptionId: number;
  plan: string;
  billingCycle: string;
  endDate: string;
  paymentRef: string;
}) {
  const { businessId, subscriptionId, plan, billingCycle, endDate, paymentRef } = params;

  const [existing] = await db
    .select({ id: notificationsTable.id })
    .from(notificationsTable)
    .where(
      and(
        eq(notificationsTable.businessId, businessId),
        eq(notificationsTable.subscriptionId, subscriptionId),
        eq(notificationsTable.type, "subscription_renewal_success"),
        eq(notificationsTable.paymentRef, paymentRef),
      ),
    );
  if (existing) return existing;

  const [notif] = await db
    .insert(notificationsTable)
    .values({
      businessId,
      subscriptionId,
      paymentRef,
      type: "subscription_renewal_success",
      title: "Subscription Renewed Successfully",
      message: `Your ${planLabel(plan)} ${cycleLabel(billingCycle)} subscription has been renewed successfully. Your subscription is active until ${formatDisplayDate(endDate)}.`,
    })
    .returning();

  return notif;
}