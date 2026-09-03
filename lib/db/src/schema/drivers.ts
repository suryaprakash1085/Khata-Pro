import { pgTable, bigserial, bigint, varchar, boolean, timestamp, pgEnum, numeric, text, date } from "drizzle-orm/pg-core";
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
 
  // --- NEW: driver-app login (OTP-based, no password) ---
  otpCode: varchar("otp_code", { length: 6 }),
  otpExpiresAt: timestamp("otp_expires_at", { withTimezone: true }),
 
  rating: numeric('rating', { precision: 2, scale: 1 }).default('5.0'),
  // --- NEW: push notifications ---
  pushToken: varchar("push_token", { length: 255 }),
 
  // --- NEW: driver profile screen fields ---
  email: varchar("email", { length: 255 }),
  dateOfBirth: date("date_of_birth"),
  gender: varchar("gender", { length: 20 }),
  address: text("address"),
  emergencyContactName: varchar("emergency_contact_name", { length: 255 }),
  emergencyContactRelation: varchar("emergency_contact_relation", { length: 100 }),
  emergencyContactPhone: varchar("emergency_contact_phone", { length: 20 }),
  // Delivery performance counts are NOT stored here — computed live from
  // deliveriesTable via GET /drivers/:id/stats (always in sync, no drift).
 
  isDeleted: boolean("is_deleted").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const driverSessionsTable = pgTable("driver_sessions", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  driverId: bigint("driver_id", { mode: "number" }).notNull().references(() => driversTable.id),
  businessId: bigint("business_id", { mode: "number" }).notNull(),
  wentOnlineAt: timestamp("went_online_at", { withTimezone: true }).notNull().defaultNow(),
  wentOfflineAt: timestamp("went_offline_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
 
export const insertDriverSchema = createInsertSchema(driversTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertDriver = z.infer<typeof insertDriverSchema>;
export type Driver = typeof driversTable.$inferSelect;
 