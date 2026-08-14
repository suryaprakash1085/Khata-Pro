CREATE TYPE "public"."promotion_apply_to" AS ENUM('all', 'selected');--> statement-breakpoint
CREATE TYPE "public"."promotion_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."promotion_type" AS ENUM('bogo', 'percentage');--> statement-breakpoint
CREATE TABLE "promotion_products" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"promotion_id" bigint NOT NULL,
	"product_id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "promotions" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"name" varchar(255) NOT NULL,
	"promotion_type" "promotion_type" NOT NULL,
	"apply_to" "promotion_apply_to" DEFAULT 'selected' NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"status" "promotion_status" DEFAULT 'active' NOT NULL,
	"discount_percentage" numeric(5, 2),
	"is_deleted" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "promotion_products" ADD CONSTRAINT "promotion_products_promotion_id_promotions_id_fk" FOREIGN KEY ("promotion_id") REFERENCES "public"."promotions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotion_products" ADD CONSTRAINT "promotion_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;