ALTER TYPE "public"."expense_payment_mode" ADD VALUE 'bank_transfer';--> statement-breakpoint
ALTER TYPE "public"."expense_payment_mode" ADD VALUE 'card';--> statement-breakpoint
ALTER TABLE "expenses" ADD COLUMN "payment_details" jsonb;