CREATE TYPE "public"."expense_category" AS ENUM('rent', 'salary', 'utilities', 'transport', 'maintenance', 'marketing', 'supplies', 'other');--> statement-breakpoint
CREATE TYPE "public"."expense_payment_mode" AS ENUM('cash', 'online', 'cheque', 'upi');--> statement-breakpoint
CREATE TABLE "expenses" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"category" "expense_category" DEFAULT 'other' NOT NULL,
	"payee_name" varchar(255),
	"amount" numeric(12, 2) NOT NULL,
	"payment_mode" "expense_payment_mode" DEFAULT 'cash' NOT NULL,
	"receipt_image_url" varchar(500),
	"description" text,
	"entry_date" date NOT NULL,
	"created_by" bigint NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
