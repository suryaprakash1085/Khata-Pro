import { pgTable, bigserial, bigint, varchar, text, boolean, timestamp, decimal, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productUnitEnum = pgEnum("product_unit", ["pcs", "kg", "g", "l", "ml", "pkt", "box", "bottle", "dozen"]);

export const productsTable = pgTable("products", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  barcode: varchar("barcode", { length: 64 }),
  sku: varchar("sku", { length: 64 }),
  category: varchar("category", { length: 100 }),
  brand: varchar("brand", { length: 100 }),
  unit: productUnitEnum("unit").notNull().default("pcs"),
  hsnCode: varchar("hsn_code", { length: 20 }),
  gstRate: decimal("gst_rate", { precision: 5, scale: 2 }).notNull().default("0"),
  costPrice: decimal("cost_price", { precision: 12, scale: 2 }).notNull().default("0"),
  sellingPrice: decimal("selling_price", { precision: 12, scale: 2 }).notNull().default("0"),
  stockQty: integer("stock_qty").notNull().default(0),
  lowStockAlert: integer("low_stock_alert").notNull().default(5),
  image: varchar("image", { length: 500 }),
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;