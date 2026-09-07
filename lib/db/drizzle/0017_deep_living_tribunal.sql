CREATE TYPE "public"."purchase_order_status" AS ENUM('pending', 'ordered', 'partially_received', 'received', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."purchase_order_payment_method" AS ENUM('cash', 'upi', 'bank_transfer', 'cheque', 'other');--> statement-breakpoint
CREATE TABLE "purchase_orders" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"vendor_id" bigint NOT NULL,
	"purchase_order_number" varchar(30) NOT NULL,
	"sequence_no" integer NOT NULL,
	"order_date" date NOT NULL,
	"status" "purchase_order_status" DEFAULT 'pending' NOT NULL,
	"total_amount" numeric(12, 2) DEFAULT '0' NOT NULL,
	"notes" text,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_by" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_order_items" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"purchase_order_id" bigint NOT NULL,
	"product_id" bigint NOT NULL,
	"ordered_qty" numeric NOT NULL,
	"received_qty" numeric DEFAULT '0' NOT NULL,
	"unit_cost" numeric NOT NULL,
	"total" numeric NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_order_payments" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"purchase_order_id" bigint NOT NULL,
	"vendor_id" bigint NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"payment_method" "purchase_order_payment_method" DEFAULT 'cash' NOT NULL,
	"payment_date" date NOT NULL,
	"notes" text,
	"created_by" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "purchase_order_counters" (
	"business_id" bigint PRIMARY KEY NOT NULL,
	"last_number" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "purchase_orders" ADD CONSTRAINT "purchase_orders_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_purchase_order_id_purchase_orders_id_fk" FOREIGN KEY ("purchase_order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order_items" ADD CONSTRAINT "purchase_order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order_payments" ADD CONSTRAINT "purchase_order_payments_purchase_order_id_purchase_orders_id_fk" FOREIGN KEY ("purchase_order_id") REFERENCES "public"."purchase_orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_order_payments" ADD CONSTRAINT "purchase_order_payments_vendor_id_vendors_id_fk" FOREIGN KEY ("vendor_id") REFERENCES "public"."vendors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "purchase_orders_business_sequence_unique" ON "purchase_orders" USING btree ("business_id","sequence_no");--> statement-breakpoint
CREATE UNIQUE INDEX "purchase_orders_business_number_unique" ON "purchase_orders" USING btree ("business_id","purchase_order_number");