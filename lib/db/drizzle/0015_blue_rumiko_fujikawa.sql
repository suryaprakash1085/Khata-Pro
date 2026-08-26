CREATE TYPE "public"."delivery_payment_status" AS ENUM('not_applicable', 'pending', 'collected');--> statement-breakpoint
CREATE TYPE "public"."changed_by_type" AS ENUM('driver', 'admin', 'system');--> statement-breakpoint
CREATE TABLE "delivery_status_history" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"delivery_id" bigint NOT NULL,
	"previous_status" varchar(50),
	"new_status" varchar(50) NOT NULL,
	"changed_by" bigint,
	"changed_by_type" "changed_by_type" DEFAULT 'system' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "delivery_fee_settings" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"free_delivery_radius" numeric(6, 2) DEFAULT '5' NOT NULL,
	"per_km_charge" numeric(8, 2) DEFAULT '2' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "delivery_fee_settings_business_id_unique" UNIQUE("business_id")
);
--> statement-breakpoint
CREATE TABLE "customer_addresses" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"customer_id" bigint NOT NULL,
	"label" varchar(50) DEFAULT 'Home' NOT NULL,
	"address_line" varchar(500) NOT NULL,
	"city" varchar(100),
	"state" varchar(100),
	"pincode" varchar(10),
	"latitude" numeric(10, 7),
	"longitude" numeric(10, 7),
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "latitude" numeric(10, 7);--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "longitude" numeric(10, 7);--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "delivery_landmark" varchar(255);--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "delivery_instructions" text;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "accepted_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "out_for_delivery_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "arrived_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "rejection_reason" text;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "cancellation_reason" text;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "otp_hash" varchar(255);--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "otp_expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "otp_attempts" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "otp_resend_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "otp_last_sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "otp_verified_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "payment_status" "delivery_payment_status" DEFAULT 'not_applicable' NOT NULL;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "payment_collected_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "payment_collected_by" bigint;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "collected_amount" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "transaction_id" bigint;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD COLUMN "delivery_distance_km" numeric(6, 2);--> statement-breakpoint
ALTER TABLE "sales_orders" ADD COLUMN "delivery_fee" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "sales_orders" ADD COLUMN "delivery_fee_radius" numeric(6, 2);--> statement-breakpoint
ALTER TABLE "sales_orders" ADD COLUMN "delivery_fee_per_km" numeric(8, 2);--> statement-breakpoint
ALTER TABLE "sales_orders" ADD COLUMN "customer_latitude" numeric(10, 7);--> statement-breakpoint
ALTER TABLE "sales_orders" ADD COLUMN "customer_longitude" numeric(10, 7);--> statement-breakpoint
ALTER TABLE "delivery_status_history" ADD CONSTRAINT "delivery_status_history_delivery_id_deliveries_id_fk" FOREIGN KEY ("delivery_id") REFERENCES "public"."deliveries"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "delivery_fee_settings" ADD CONSTRAINT "delivery_fee_settings_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "customer_addresses" ADD CONSTRAINT "customer_addresses_customer_id_customers_id_fk" FOREIGN KEY ("customer_id") REFERENCES "public"."customers"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "delivery_status_history_delivery_id_idx" ON "delivery_status_history" USING btree ("delivery_id");--> statement-breakpoint
CREATE INDEX "delivery_status_history_created_at_idx" ON "delivery_status_history" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "delivery_fee_settings_business_id_idx" ON "delivery_fee_settings" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "customer_addresses_customer_id_idx" ON "customer_addresses" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "deliveries_driver_id_idx" ON "deliveries" USING btree ("driver_id");--> statement-breakpoint
CREATE INDEX "deliveries_business_id_idx" ON "deliveries" USING btree ("business_id");--> statement-breakpoint
CREATE INDEX "deliveries_customer_id_idx" ON "deliveries" USING btree ("customer_id");--> statement-breakpoint
CREATE INDEX "deliveries_status_idx" ON "deliveries" USING btree ("status");--> statement-breakpoint
CREATE INDEX "deliveries_sales_order_id_idx" ON "deliveries" USING btree ("sales_order_id");--> statement-breakpoint
CREATE INDEX "deliveries_created_at_idx" ON "deliveries" USING btree ("created_at");