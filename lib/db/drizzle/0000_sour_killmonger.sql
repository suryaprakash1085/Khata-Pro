CREATE TYPE "public"."user_role" AS ENUM('owner', 'staff', 'admin');--> statement-breakpoint
CREATE TYPE "public"."balance_type" AS ENUM('credit', 'debit');--> statement-breakpoint
CREATE TYPE "public"."customer_category" AS ENUM('customer', 'supplier');--> statement-breakpoint
CREATE TYPE "public"."product_unit" AS ENUM('pcs', 'kg', 'g', 'l', 'ml', 'pkt', 'box', 'bottle', 'dozen');--> statement-breakpoint
CREATE TYPE "public"."payment_mode" AS ENUM('cash', 'online', 'cheque', 'upi');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('you_gave', 'you_got');--> statement-breakpoint
CREATE TYPE "public"."reminder_channel" AS ENUM('sms', 'whatsapp', 'push');--> statement-breakpoint
CREATE TYPE "public"."reminder_status" AS ENUM('pending', 'sent', 'failed');--> statement-breakpoint
CREATE TYPE "public"."subscription_plan" AS ENUM('free', 'pro', 'premium');--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'expired', 'cancelled');--> statement-breakpoint
CREATE TABLE "users" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" varchar(255),
	"password_hash" varchar(255),
	"role" "user_role" DEFAULT 'owner' NOT NULL,
	"profile_image" varchar(500),
	"is_active" boolean DEFAULT true NOT NULL,
	"language_pref" varchar(10) DEFAULT 'en',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "businesses" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"owner_id" bigint NOT NULL,
	"business_name" varchar(255) NOT NULL,
	"business_type" varchar(100) NOT NULL,
	"gstin" varchar(20),
	"address" text,
	"logo_url" varchar(500),
	"currency" varchar(10) DEFAULT 'INR' NOT NULL,
	"financial_year_start" date,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "staff_business_map" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"permissions" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "customers" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"email" varchar(255),
	"address" text,
	"opening_balance" numeric(12, 2) DEFAULT '0' NOT NULL,
	"opening_balance_type" "balance_type" DEFAULT 'credit' NOT NULL,
	"current_balance" numeric(12, 2) DEFAULT '0' NOT NULL,
	"category" "customer_category" DEFAULT 'customer' NOT NULL,
	"profile_image" varchar(500),
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL,
	"barcode" varchar(64),
	"sku" varchar(64),
	"category" varchar(100),
	"unit" "product_unit" DEFAULT 'pcs' NOT NULL,
	"hsn_code" varchar(20),
	"gst_rate" numeric(5, 2) DEFAULT '0' NOT NULL,
	"cost_price" numeric(12, 2) DEFAULT '0' NOT NULL,
	"selling_price" numeric(12, 2) DEFAULT '0' NOT NULL,
	"stock_qty" integer DEFAULT 0 NOT NULL,
	"low_stock_alert" integer DEFAULT 5 NOT NULL,
	"image" varchar(500),
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "transactions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"customer_id" bigint NOT NULL,
	"type" "transaction_type" NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"balance_after" numeric(12, 2) NOT NULL,
	"description" text,
	"bill_image_url" varchar(500),
	"payment_mode" "payment_mode" DEFAULT 'cash' NOT NULL,
	"entry_date" date NOT NULL,
	"due_date" date,
	"created_by" bigint NOT NULL,
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reminders" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"customer_id" bigint NOT NULL,
	"transaction_id" bigint,
	"reminder_date" date NOT NULL,
	"channel" "reminder_channel" DEFAULT 'whatsapp' NOT NULL,
	"status" "reminder_status" DEFAULT 'pending' NOT NULL,
	"amount" numeric(12, 2),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"plan" "subscription_plan" DEFAULT 'free' NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" "subscription_status" DEFAULT 'active' NOT NULL,
	"payment_ref" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "subscriptions_business_id_unique" UNIQUE("business_id")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint,
	"user_id" bigint,
	"action" varchar(100) NOT NULL,
	"entity_type" varchar(100) NOT NULL,
	"entity_id" bigint,
	"old_value" text,
	"new_value" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
