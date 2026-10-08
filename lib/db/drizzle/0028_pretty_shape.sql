CREATE TABLE "order_returns" (
	"id" serial PRIMARY KEY NOT NULL,
	"sales_order_id" integer NOT NULL,
	"business_id" integer NOT NULL,
	"customer_id" integer NOT NULL,
	"reason" varchar(50) NOT NULL,
	"description" text,
	"status" varchar(20) DEFAULT 'REQUESTED' NOT NULL,
	"admin_note" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"resolved_at" timestamp,
	"items" jsonb,
	"delivery_id" integer,
	"media" jsonb,
	"replacement_delivery_id" integer,
	"resolved_by" integer
);
--> statement-breakpoint
ALTER TABLE "sales_orders" ADD COLUMN "discount" numeric(12, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD COLUMN "promo_code" varchar(50);