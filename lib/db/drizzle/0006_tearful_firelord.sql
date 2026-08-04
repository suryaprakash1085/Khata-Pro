ALTER TABLE "sales_orders" ADD COLUMN "gst_rate" numeric(5, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "sales_orders" ADD COLUMN "invoice_no" varchar(50);