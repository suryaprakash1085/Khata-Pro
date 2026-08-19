CREATE TABLE "service_highlights" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"business_id" bigint NOT NULL,
	"title" varchar(100) NOT NULL,
	"description" varchar(300) NOT NULL,
	"icon" varchar(50) DEFAULT 'flash' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "service_highlights" ADD CONSTRAINT "service_highlights_business_id_businesses_id_fk" FOREIGN KEY ("business_id") REFERENCES "public"."businesses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "service_highlights_business_id_idx" ON "service_highlights" USING btree ("business_id");
