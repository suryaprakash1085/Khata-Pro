import { pgTable, bigserial, bigint, varchar, boolean, integer, timestamp, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { businessesTable } from "./businesses";

export const serviceHighlightsTable = pgTable("service_highlights", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" })
    .notNull()
    .references(() => businessesTable.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 100 }).notNull(),
  description: varchar("description", { length: 300 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull().default("flash"),
  isActive: boolean("is_active").notNull().default(true),
  displayOrder: integer("display_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}, (table) => ({
  businessIdIdx: index("service_highlights_business_id_idx").on(table.businessId),
}));

export const insertServiceHighlightSchema = createInsertSchema(serviceHighlightsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertServiceHighlight = z.infer<typeof insertServiceHighlightSchema>;
export type ServiceHighlight = typeof serviceHighlightsTable.$inferSelect;