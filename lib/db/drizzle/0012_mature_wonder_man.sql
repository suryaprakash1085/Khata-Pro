CREATE TABLE "notifications" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint,
	"driver_id" bigint,
	"customer_id" bigint,
	"type" text NOT NULL,
	"message" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "push_token" varchar(255);--> statement-breakpoint
CREATE UNIQUE INDEX "products_business_barcode_unique" ON "products" USING btree ("business_id","barcode") WHERE "products"."barcode" IS NOT NULL AND "products"."is_deleted" = false;