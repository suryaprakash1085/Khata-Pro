import { pgTable, bigserial, bigint, varchar, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const driverVehicleTypeEnum = pgEnum("driver_vehicle_type", ["bike", "auto", "van", "truck"]);
export const driverStatusEnum = pgEnum("driver_status", ["available", "busy", "offline"]);

export const driversTable = pgTable("drivers", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  businessId: bigint("business_id", { mode: "number" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  vehicleNumber: varchar("vehicle_number", { length: 32 }),
  vehicleType: driverVehicleTypeEnum("vehicle_type").notNull().default("bike"),
  status: driverStatusEnum("status").notNull().default("offline"),
  // Denormalized last-known location, updated on every GPS ping (see delivery_locations
  // for full history). Lets us show driver pins on a dashboard map without joining.
  lastLat: varchar("last_lat", { length: 32 }),
  lastLng: varchar("last_lng", { length: 32 }),
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertDriverSchema = createInsertSchema(driversTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Driver = typeof driversTable.$inferSelect;