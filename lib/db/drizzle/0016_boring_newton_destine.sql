CREATE TABLE "driver_sessions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"driver_id" bigint NOT NULL,
	"business_id" bigint NOT NULL,
	"went_online_at" timestamp with time zone DEFAULT now() NOT NULL,
	"went_offline_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "business_invoice_counters" (
	"business_id" bigint PRIMARY KEY NOT NULL,
	"last_number" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "email" varchar(255);--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "date_of_birth" date;--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "gender" varchar(20);--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "emergency_contact_name" varchar(255);--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "emergency_contact_relation" varchar(100);--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "emergency_contact_phone" varchar(20);--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "delivery_id" bigint;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "sales_order_id" bigint;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "title" text;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "read_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "promotions" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "promotions" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "promotions" ADD COLUMN "promo_code" varchar(50);--> statement-breakpoint
ALTER TABLE "promotions" ADD COLUMN "min_order_amount" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "promotions" ADD COLUMN "banner_image" text;--> statement-breakpoint
ALTER TABLE "driver_sessions" ADD CONSTRAINT "driver_sessions_driver_id_drivers_id_fk" FOREIGN KEY ("driver_id") REFERENCES "public"."drivers"("id") ON DELETE no action ON UPDATE no action;