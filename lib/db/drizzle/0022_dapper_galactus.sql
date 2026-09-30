ALTER TABLE "products" ADD COLUMN "low_stock_notified_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "product_id" bigint;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "vendor_id" bigint;--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "purchase_id" bigint;