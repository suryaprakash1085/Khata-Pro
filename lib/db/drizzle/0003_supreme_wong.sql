CREATE TYPE "public"."driver_status" AS ENUM('available', 'busy', 'offline');--> statement-breakpoint
CREATE TYPE "public"."driver_vehicle_type" AS ENUM('bike', 'auto', 'van', 'truck');--> statement-breakpoint
CREATE TYPE "public"."delivery_status" AS ENUM('pending', 'assigned', 'picked_up', 'in_transit', 'delivered', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."purchase_status" AS ENUM('paid', 'pending', 'partial');--> statement-breakpoint
CREATE TABLE "drivers" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"vehicle_number" varchar(32),
	"vehicle_type" "driver_vehicle_type" DEFAULT 'bike' NOT NULL,
	"status" "driver_status" DEFAULT 'offline' NOT NULL,
	"last_lat" varchar(32),
	"last_lng" varchar(32),
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deliveries" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"customer_id" bigint NOT NULL,
	"driver_id" bigint,
	"pickup_address" text NOT NULL,
	"drop_address" text NOT NULL,
	"status" "delivery_status" DEFAULT 'pending' NOT NULL,
	"notes" text,
	"assigned_at" timestamp with time zone,
	"picked_up_at" timestamp with time zone,
	"delivered_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchases" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"vendor_id" bigint NOT NULL,
	"invoice_no" varchar(100),
	"amount" numeric(12, 2) NOT NULL,
	"tax" numeric(12, 2) DEFAULT '0' NOT NULL,
	"amount_paid" numeric(12, 2) DEFAULT '0' NOT NULL,
	"status" "purchase_status" DEFAULT 'pending' NOT NULL,
	"bill_image_url" varchar(500),
	"description" text,
	"entry_date" date NOT NULL,
	"created_by" bigint NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"purchase_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"qty" numeric NOT NULL,
	"unit_cost" numeric NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_purchase_id_purchases_id_fk" FOREIGN KEY ("purchase_id") REFERENCES "public"."purchases"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_items" ADD CONSTRAINT "purchase_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;