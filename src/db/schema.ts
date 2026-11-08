import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Users table managed via Firebase Auth synchronization
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Leads intake table for project inquiries & consultation bookings
export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  organization: text('organization'),
  serviceCategory: text('service_category').notNull(),
  message: text('message').notNull(),
  status: text('status').notNull().default('New'),
  createdAt: timestamp('created_at').defaultNow(),
});
