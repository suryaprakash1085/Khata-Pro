CREATE TYPE "public"."subscription_payment_status" AS ENUM('paid', 'pending', 'failed');--> statement-breakpoint
ALTER TYPE "public"."subscription_status" ADD VALUE 'trial' BEFORE 'expired';--> statement-breakpoint
CREATE TABLE "subscription_payments" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"subscription_id" bigint,
	"plan" "subscription_plan" NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"payment_date" date NOT NULL,
	"status" "subscription_payment_status" DEFAULT 'paid' NOT NULL,
	"payment_ref" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscription_payments" ADD CONSTRAINT "subscription_payments_subscription_id_subscriptions_id_fk" FOREIGN KEY ("subscription_id") REFERENCES "public"."subscriptions"("id") ON DELETE no action ON UPDATE no action;