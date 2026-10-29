import { pgTable, bigserial, bigint, varchar, timestamp, index, uniqueIndex } from "drizzle-orm/pg-core";

export const deviceTokensTable = pgTable(
  "device_tokens",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    userType: varchar("user_type", { length: 16 }).notNull(), // 'customer' | 'driver'
    userId: bigint("user_id", { mode: "number" }).notNull(),
    token: varchar("token", { length: 512 }).notNull(),
    platform: varchar("platform", { length: 16 }).notNull().default("android"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("device_tokens_token_uq").on(t.token),
    index("device_tokens_user_idx").on(t.userType, t.userId),
  ],
);