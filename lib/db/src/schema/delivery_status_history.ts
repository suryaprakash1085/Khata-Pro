import { pgTable, bigserial, bigint, varchar, text, timestamp, pgEnum, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { deliveriesTable } from "./deliveries";

export const changedByTypeEnum = pgEnum("changed_by_type", ["driver", "admin", "system"]);

export const deliveryStatusHistoryTable = pgTable("delivery_status_history", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  deliveryId: bigint("delivery_id", { mode: "number" })
    .notNull()
    .references(() => deliveriesTable.id, { onDelete: "cascade" }),
  previousStatus: varchar("previous_status", { length: 50 }),
  newStatus: varchar("new_status", { length: 50 }).notNull(),
  changedBy: bigint("changed_by", { mode: "number" }), // driver id or admin/staff id, nullable for system events
  changedByType: changedByTypeEnum("changed_by_type").notNull().default("system"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  deliveryIdIdx: index("delivery_status_history_delivery_id_idx").on(table.deliveryId),
  createdAtIdx: index("delivery_status_history_created_at_idx").on(table.createdAt),
}));

export const insertDeliveryStatusHistorySchema = createInsertSchema(deliveryStatusHistoryTable).omit({
  id: true,
  createdAt: true,
});
export type InsertDeliveryStatusHistory = z.infer<typeof insertDeliveryStatusHistorySchema>;
export type DeliveryStatusHistory = typeof deliveryStatusHistoryTable.$inferSelect;