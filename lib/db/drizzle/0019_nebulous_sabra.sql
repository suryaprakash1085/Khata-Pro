CREATE TABLE "business_delivery_counters" (
	"business_id" bigint PRIMARY KEY NOT NULL,
	"last_number" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "deliveries" ADD COLUMN "business_delivery_no" integer;