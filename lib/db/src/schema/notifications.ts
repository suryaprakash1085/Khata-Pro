import { pgTable, serial, integer, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { businesses } from './businesses';
import { drivers } from './drivers';

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  business_id: integer('business_id').references(() => businesses.id),
  driver_id: integer('driver_id').references(() => drivers.id),
  type: text('type', {
    enum: ['assigned', 'completed', 'address_updated', 'payment_received'],
  }).notNull(),
  message: text('message').notNull(),
  is_read: boolean('is_read').default(false).notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;