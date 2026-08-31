
import { pgTable, bigserial, bigint, varchar, text, decimal, date, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { productsTable } from "./products";

export const promotionTypeEnum = pgEnum("promotion_type", ["bogo", "percentage"]);
export const promotionApplyToEnum = pgEnum("promotion_apply_to", ["all", "selected"]);
export const promotionStatusEnum = pgEnum("promotion_status", ["active", "inactive"]);

export const promotionsTable = pgTable("promotions", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  promotionType: promotionTypeEnum("promotion_type").notNull(),
  applyTo: promotionApplyToEnum("apply_to").notNull().default("selected"),
  startDate: date("start_date", { mode: "string" }).notNull(),
  endDate: date("end_date", { mode: "string" }).notNull(),
  status: promotionStatusEnum("status").notNull().default("active"),
  // Only meaningful when promotion_type = 'percentage'. Left NULL for bogo —
  // free-quantity logic never reads this field, by design (see spec §4).
  discountPercentage: decimal("discount_percentage", { precision: 5, scale: 2 }),
  description: text("description"),
  promoCode: varchar("promo_code", { length: 50 }),
  minOrderAmount: decimal("min_order_amount", { precision: 10, scale: 2 }),
  bannerImage: text("banner_image"),
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const promotionProductsTable = pgTable("promotion_products", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  promotionId: bigint("promotion_id", { mode: "number" }).notNull().references(() => promotionsTable.id),
  productId: bigint("product_id", { mode: "number" }).notNull().references(() => productsTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertPromotionSchema = createInsertSchema(promotionsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertPromotion = z.infer<typeof insertPromotionSchema>;
export type Promotion = typeof promotionsTable.$inferSelect;
export type PromotionProduct = typeof promotionProductsTable.$inferSelect;