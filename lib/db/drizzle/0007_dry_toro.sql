ALTER TABLE "transactions" ADD COLUMN "tax" numeric(12, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "gst_rate" numeric(5, 2) DEFAULT '0' NOT NULL;--> statement-breakpoint
ALTER TABLE "transactions" ADD COLUMN "invoice_no" varchar(50);