import { pgTable, unique, bigserial, varchar, boolean, timestamp, bigint, jsonb, text, numeric, date, integer, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const balanceType = pgEnum("balance_type", ['credit', 'debit'])
export const customerCategory = pgEnum("customer_category", ['customer', 'supplier'])
export const paymentMode = pgEnum("payment_mode", ['cash', 'online', 'cheque', 'upi'])
export const productUnit = pgEnum("product_unit", ['pcs', 'kg', 'g', 'l', 'ml', 'pkt', 'box', 'bottle', 'dozen'])
export const reminderChannel = pgEnum("reminder_channel", ['sms', 'whatsapp', 'push'])
export const reminderStatus = pgEnum("reminder_status", ['pending', 'sent', 'failed'])
export const subscriptionPlan = pgEnum("subscription_plan", ['free', 'pro', 'premium'])
export const subscriptionStatus = pgEnum("subscription_status", ['active', 'expired', 'cancelled'])
export const transactionType = pgEnum("transaction_type", ['you_gave', 'you_got'])
export const userRole = pgEnum("user_role", ['owner', 'staff', 'admin'])


export const users = pgTable("users", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	name: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 20 }).notNull(),
	email: varchar({ length: 255 }),
	passwordHash: varchar("password_hash", { length: 255 }),
	role: userRole().default('owner').notNull(),
	profileImage: varchar("profile_image", { length: 500 }),
	isActive: boolean("is_active").default(true).notNull(),
	languagePref: varchar("language_pref", { length: 10 }).default('en'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("users_phone_unique").on(table.phone),
]);

export const staffBusinessMap = pgTable("staff_business_map", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	businessId: bigint("business_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }).notNull(),
	permissions: jsonb().default({}),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const customers = pgTable("customers", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	businessId: bigint("business_id", { mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 20 }).notNull(),
	email: varchar({ length: 255 }),
	address: text(),
	openingBalance: numeric("opening_balance", { precision: 12, scale:  2 }).default('0').notNull(),
	openingBalanceType: balanceType("opening_balance_type").default('credit').notNull(),
	currentBalance: numeric("current_balance", { precision: 12, scale:  2 }).default('0').notNull(),
	category: customerCategory().default('customer').notNull(),
	profileImage: varchar("profile_image", { length: 500 }),
	isDeleted: boolean("is_deleted").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const reminders = pgTable("reminders", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	businessId: bigint("business_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	customerId: bigint("customer_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	transactionId: bigint("transaction_id", { mode: "number" }),
	reminderDate: date("reminder_date").notNull(),
	channel: reminderChannel().default('whatsapp').notNull(),
	status: reminderStatus().default('pending').notNull(),
	amount: numeric({ precision: 12, scale:  2 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const subscriptions = pgTable("subscriptions", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	businessId: bigint("business_id", { mode: "number" }).notNull(),
	plan: subscriptionPlan().default('free').notNull(),
	startDate: date("start_date").notNull(),
	endDate: date("end_date").notNull(),
	status: subscriptionStatus().default('active').notNull(),
	paymentRef: varchar("payment_ref", { length: 255 }),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("subscriptions_business_id_unique").on(table.businessId),
]);

export const auditLogs = pgTable("audit_logs", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	businessId: bigint("business_id", { mode: "number" }),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	userId: bigint("user_id", { mode: "number" }),
	action: varchar({ length: 100 }).notNull(),
	entityType: varchar("entity_type", { length: 100 }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	entityId: bigint("entity_id", { mode: "number" }),
	oldValue: text("old_value"),
	newValue: text("new_value"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const businesses = pgTable("businesses", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	ownerId: bigint("owner_id", { mode: "number" }).notNull(),
	businessName: varchar("business_name", { length: 255 }).notNull(),
	businessType: varchar("business_type", { length: 100 }).notNull(),
	gstin: varchar({ length: 20 }),
	address: text(),
	logoUrl: varchar("logo_url", { length: 500 }),
	currency: varchar({ length: 10 }).default('INR').notNull(),
	financialYearStart: date("financial_year_start"),
	isActive: boolean("is_active").default(true).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	businessId: bigint("business_id", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	customerId: bigint("customer_id", { mode: "number" }).notNull(),
	type: transactionType().notNull(),
	amount: numeric({ precision: 12, scale:  2 }).notNull(),
	balanceAfter: numeric("balance_after", { precision: 12, scale:  2 }).notNull(),
	description: text(),
	billImageUrl: varchar("bill_image_url", { length: 500 }),
	paymentMode: paymentMode("payment_mode").default('cash').notNull(),
	entryDate: date("entry_date").notNull(),
	dueDate: date("due_date"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	createdBy: bigint("created_by", { mode: "number" }).notNull(),
	isDeleted: boolean("is_deleted").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const products = pgTable("products", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	businessId: bigint("business_id", { mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	barcode: varchar({ length: 64 }),
	sku: varchar({ length: 64 }),
	category: varchar({ length: 100 }),
	unit: productUnit().default('pcs').notNull(),
	hsnCode: varchar("hsn_code", { length: 20 }),
	gstRate: numeric("gst_rate", { precision: 5, scale:  2 }).default('0').notNull(),
	costPrice: numeric("cost_price", { precision: 12, scale:  2 }).default('0').notNull(),
	sellingPrice: numeric("selling_price", { precision: 12, scale:  2 }).default('0').notNull(),
	stockQty: integer("stock_qty").default(0).notNull(),
	lowStockAlert: integer("low_stock_alert").default(5).notNull(),
	image: varchar({ length: 500 }),
	isDeleted: boolean("is_deleted").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	brand: varchar({ length: 100 }),
});

export const vendors = pgTable("vendors", {
	id: bigserial({ mode: "bigint" }).primaryKey().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	businessId: bigint("business_id", { mode: "number" }).notNull(),
	name: varchar({ length: 255 }).notNull(),
	phone: varchar({ length: 20 }),
	email: varchar({ length: 255 }),
	address: varchar({ length: 500 }),
	gstNumber: varchar("gst_number", { length: 20 }),
	isDeleted: boolean("is_deleted").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});
