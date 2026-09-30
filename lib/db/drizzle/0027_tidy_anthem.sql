ALTER TABLE "subscriptions" ALTER COLUMN "billing_cycle" SET DEFAULT 'monthly';--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "subscription_id" bigint;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "reminder_date" date;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "payment_ref" text;