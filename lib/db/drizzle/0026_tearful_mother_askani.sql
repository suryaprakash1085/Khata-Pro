CREATE TYPE "public"."billing_cycle" AS ENUM('monthly', 'quarterly', 'half_yearly', 'yearly');--> statement-breakpoint
CREATE TABLE "subscription_plans" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"plan" "subscription_plan" NOT NULL,
	"monthly_price" numeric(10, 2) NOT NULL,
	"quarterly_price" numeric(10, 2) NOT NULL,
	"half_yearly_price" numeric(10, 2) NOT NULL,
	"yearly_price" numeric(10, 2) NOT NULL,
	"trial_days" integer DEFAULT 15 NOT NULL,
	"max_users" integer DEFAULT -1 NOT NULL,
	"max_branches" integer DEFAULT -1 NOT NULL,
	"max_products" integer DEFAULT -1 NOT NULL,
	"max_customers" integer DEFAULT -1 NOT NULL,
	"max_vendors" integer DEFAULT -1 NOT NULL,
	"max_orders" integer DEFAULT -1 NOT NULL,
	"features" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscription_plans_plan_unique" UNIQUE("plan")
);
--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "plan" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "subscription_payments" ALTER COLUMN "plan" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "subscription_plans" ALTER COLUMN "plan" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."subscription_plan";--> statement-breakpoint
CREATE TYPE "public"."subscription_plan" AS ENUM('pro', 'premium');--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "plan" SET DATA TYPE "public"."subscription_plan" USING "plan"::"public"."subscription_plan";--> statement-breakpoint
ALTER TABLE "subscription_payments" ALTER COLUMN "plan" SET DATA TYPE "public"."subscription_plan" USING "plan"::"public"."subscription_plan";--> statement-breakpoint
ALTER TABLE "subscription_plans" ALTER COLUMN "plan" SET DATA TYPE "public"."subscription_plan" USING "plan"::"public"."subscription_plan";--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DEFAULT 'trial'::text;--> statement-breakpoint
DROP TYPE "public"."subscription_status";--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('trial', 'active', 'expired', 'cancelled');--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DEFAULT 'trial'::"public"."subscription_status";--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DATA TYPE "public"."subscription_status" USING "status"::"public"."subscription_status";--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "plan" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "billing_cycle" "billing_cycle" NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "amount" numeric(10, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "trial_start_date" date;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "trial_end_date" date;--> statement-breakpoint
ALTER TABLE "subscription_payments" ADD COLUMN "billing_cycle" "billing_cycle" NOT NULL;