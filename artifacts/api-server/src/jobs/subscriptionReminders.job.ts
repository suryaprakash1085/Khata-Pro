import cron from "node-cron";
import {
  checkSubscriptionRenewalReminders,
  checkTrialExpiringReminders,
  expireOverdueTrials,
  expireOverduePaidSubscriptions,
} from "../services/subscriptionNotifications.service";

export function startSubscriptionReminderJob() {
  // Daily at 00:05 server time
  cron.schedule("5 0 * * *", async () => {
    console.log("[subscription-reminders] daily check started");
    try {
      await checkSubscriptionRenewalReminders();
      await checkTrialExpiringReminders();
      await expireOverdueTrials();
      await expireOverduePaidSubscriptions();
      console.log("[subscription-reminders] daily check completed");
    } catch (err) {
      console.error("[subscription-reminders] job failed:", err);
    }
  });

  console.log("[subscription-reminders] scheduler registered — runs daily at 00:05");
}