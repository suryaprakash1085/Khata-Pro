import { pgTable, bigserial, bigint, date, timestamp, decimal, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const reminderChannelEnum = pgEnum("reminder_channel", ["sms", "whatsapp", "push"]);
export const reminderStatusEnum = pgEnum("reminder_status", ["pending", "sent", "failed"]);

export const remindersTable = pgTable("reminders", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" }).notNull(),
  customerId: bigint("customer_id", { mode: "number" }).notNull(),
  transactionId: bigint("transaction_id", { mode: "number" }),
  reminderDate: date("reminder_date", { mode: "string" }).notNull(),
  channel: reminderChannelEnum("channel").notNull().default("whatsapp"),
  status: reminderStatusEnum("status").notNull().default("pending"),
  amount: decimal("amount", { precision: 12, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertReminderSchema = createInsertSchema(remindersTable).omit({ id: true, createdAt: true });
export type InsertReminder = z.infer<typeof insertReminderSchema>;
export type Reminder = typeof remindersTable.$inferSelect;
