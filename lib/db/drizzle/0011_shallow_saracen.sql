ALTER TABLE "businesses" ALTER COLUMN "logo_url" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "phone" varchar(20);--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "email" varchar(255);--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "address_line1" varchar(255);--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "address_line2" varchar(255);--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "city" varchar(100);--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "state" varchar(100);--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "postal_code" varchar(20);--> statement-breakpoint
ALTER TABLE "businesses" ADD COLUMN "country" varchar(100) DEFAULT 'India';--> statement-breakpoint
ALTER TABLE "customers" ADD COLUMN "password_hash" varchar(255);--> statement-breakpoint
ALTER TABLE "drivers" ADD COLUMN "rating" numeric(2, 1) DEFAULT '5.0';--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "sales_order_id" bigint;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "amount" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "payment_method" text;--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "distance_km" numeric(6, 2);--> statement-breakpoint
ALTER TABLE "businesses" DROP COLUMN "address";