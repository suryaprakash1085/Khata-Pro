import { pgTable, bigserial, bigint, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const staffBusinessMapTable = pgTable("staff_business_map", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" }).notNull(),
  userId: bigint("user_id", { mode: "number" }).notNull(),
  permissions: jsonb("permissions").$type<{
    add_entry?: boolean;
    delete_entry?: boolean;
    view_reports?: boolean;
    manage_customers?: boolean;
  }>().default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertStaffSchema = createInsertSchema(staffBusinessMapTable).omit({ id: true, createdAt: true });
export type InsertStaff = z.infer<typeof insertStaffSchema>;
export type StaffMember = typeof staffBusinessMapTable.$inferSelect;
