import { pgTable, bigserial, varchar, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userRoleEnum = pgEnum("user_role", ["owner", "staff", "admin"]);

export const usersTable = pgTable("users", {
  id: bigserial("id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull().unique(),
  email: varchar("email", { length: 255 }),
  passwordHash: varchar("password_hash", { length: 255 }),
  role: userRoleEnum("role").notNull().default("owner"),
  profileImage: varchar("profile_image", { length: 500 }),
  isActive: boolean("is_active").notNull().default(true),
  languagePref: varchar("language_pref", { length: 10 }).default("en"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
// import { pgTable, bigserial, varchar, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";
// import { createInsertSchema } from "drizzle-zod";
// import { z } from "zod/v4";

// export const userRoleEnum = pgEnum("user_role", ["owner", "staff", "admin"]);

// export const usersTable = pgTable("users", {
//   id: bigserial("id", { mode: "number" }).primaryKey(),
//   name: varchar("name", { length: 255 }).notNull(),
//   phone: varchar("phone", { length: 20 }).notNull().unique(),
//   email: varchar("email", { length: 255 }),
//   passwordHash: varchar("password_hash", { length: 255 }),
//   role: userRoleEnum("role").notNull().default("owner"),
//   profileImage: varchar("profile_image", { length: 500 }),
//   isActive: boolean("is_active").notNull().default(true),
//   languagePref: varchar("language_pref", { length: 10 }).default("en"),
//   createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
//   updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
// });

// export const insertUserSchema = createInsertSchema(usersTable).omit({ 
//   id: true, 
//   createdAt: true, 
//   updatedAt: true 
// });

// // ============================================
// // SIGNUP FORM SCHEMAS - NEW
// // ============================================

// // Register Input Schema (for signup form validation)
// export const registerSchema = z.object({
//   name: z.string()
//     .min(2, { message: "Name must be at least 2 characters" })
//     .max(100, { message: "Name must be less than 100 characters" }),
  
//   email: z.string()
//     .email({ message: "Please enter a valid email address" }),
  
//   phone: z.string()
//     .regex(/^\+?[1-9]\d{1,14}$/, { message: "Please enter a valid phone number (E.164 format)" }),
  
//   password: z.string()
//     .min(8, { message: "Password must be at least 8 characters" })
//     .max(50, { message: "Password must be less than 50 characters" }),
  
//   confirmPassword: z.string()
//     .min(8, { message: "Confirm password must be at least 8 characters" }),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords do not match",
//   path: ["confirmPassword"],
// });

// // Login Input Schema
// export const loginSchema = z.object({
//   email: z.string()
//     .email({ message: "Please enter a valid email address" }),
//   password: z.string()
//     .min(1, { message: "Password is required" }),
// });

// // OTP Schemas
// export const otpRequestSchema = z.object({
//   phone: z.string()
//     .regex(/^\+?[1-9]\d{1,14}$/, { message: "Please enter a valid phone number" }),
// });

// export const otpVerifySchema = z.object({
//   phone: z.string()
//     .regex(/^\+?[1-9]\d{1,14}$/, { message: "Please enter a valid phone number" }),
//   otp: z.string()
//     .regex(/^[0-9]{6}$/, { message: "OTP must be 6 digits" }),
// });

// // ============================================
// // TYPES - UPDATED
// // ============================================

// export type InsertUser = z.infer<typeof insertUserSchema>;
// export type User = typeof usersTable.$inferSelect;
// export type RegisterInput = z.infer<typeof registerSchema>;
// export type LoginInput = z.infer<typeof loginSchema>;
// export type OTPRequest = z.infer<typeof otpRequestSchema>;
// export type OTPVerify = z.infer<typeof otpVerifySchema>;

// // User Response Type (without password hash)
// export type UserResponse = Omit<User, 'passwordHash'> & {
//   business_id?: number;
// };

// // Auth Response Type
// export interface AuthResponse {
//   token: string;
//   user: UserResponse;
// }