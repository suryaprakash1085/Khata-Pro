// artifacts/api-server/src/services/adminNotifications.service.ts
//
// All notification-creation logic for the Admin Notification System lives
// here so route files only need one function call each.

import { db, notificationsTable, productsTable, purchasesTable, vendorsTable } from "@workspace/db";
import { eq, and, lte, isNull, sql } from "drizzle-orm";

const LOW_STOCK_THRESHOLD = 20;

// ── 1. New Order ─────────────────────────────────────────────────────────
export async function createNewOrderNotification(params: {
  businessId: number;
  salesOrderId: number;
  customerName: string;
  amount: number;
}) {
  const { businessId, salesOrderId, customerName, amount } = params;
  await db.insert(notificationsTable).values({
    businessId,
    salesOrderId,
    type: "new_order",
    title: "New Order Received",
    message: `Order #ORD-${salesOrderId} • ${customerName} • ₹${amount.toFixed(2)}`,
  });
}

// ── 2. Low Stock ─────────────────────────────────────────────────────────
// Call this any time a product's stockQty is written (create, update, or
// decremented via order fulfillment). Idempotent: only fires once per dip
// below threshold, resets when stock recovers above it.
export async function syncLowStockNotification(productId: number) {
  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, productId));
  if (!product || product.isDeleted) return;

  const isLow = product.stockQty <= LOW_STOCK_THRESHOLD;

  if (isLow && !product.lowStockNotifiedAt) {
    await db.transaction(async (tx) => {
      await tx.insert(notificationsTable).values({
        businessId: product.businessId,
        productId: product.id,
        type: "low_stock",
        title: "Low Stock Alert",
        message: `${product.name} • Current Stock: ${product.stockQty} • Threshold: ${LOW_STOCK_THRESHOLD}`,
      });
      await tx.update(productsTable).set({ lowStockNotifiedAt: new Date() }).where(eq(productsTable.id, product.id));
    });
  } else if (!isLow && product.lowStockNotifiedAt) {
    // Stock recovered — clear the flag so a future dip re-alerts.
    await db.update(productsTable).set({ lowStockNotifiedAt: null }).where(eq(productsTable.id, product.id));
  }
}

// ── 3. Vendor Payment Pending / Overdue ─────────────────────────────────
// Lazily synced (no cron infra assumed): called at the top of the admin
// notifications GET endpoint. Looks at unpaid/partial purchases whose due
// date (or entry_date + 30 days if unset) is within 3 days or already
// passed, and creates a notification only if one doesn't already exist for
// that purchase + status combo — avoids duplicate spam on every page load.
export async function syncVendorPaymentNotifications(businessId: number) {
  const today = new Date().toISOString().split("T")[0];

  const duePurchases = await db
    .select({
      id: purchasesTable.id,
      vendorId: purchasesTable.vendorId,
      vendorName: vendorsTable.name,
      amount: purchasesTable.amount,
      amountPaid: purchasesTable.amountPaid,
      invoiceNo: purchasesTable.invoiceNo,
      dueDate: sql<string>`coalesce(${purchasesTable.dueDate}, ${purchasesTable.entryDate} + interval '30 days')`,
    })
    .from(purchasesTable)
    .innerJoin(vendorsTable, eq(purchasesTable.vendorId, vendorsTable.id))
    .where(
      and(
        eq(purchasesTable.businessId, businessId),
        eq(purchasesTable.isDeleted, false),
        sql`${purchasesTable.status} != 'paid'`,
        sql`coalesce(${purchasesTable.dueDate}, ${purchasesTable.entryDate} + interval '30 days') <= (current_date + interval '3 days')`,
      ),
    );

  for (const p of duePurchases) {
    const isOverdue = p.dueDate < today;
    const type = isOverdue ? "vendor_payment_overdue" : "vendor_payment_pending";
    const pending = parseFloat(p.amount) - parseFloat(p.amountPaid ?? "0");
    if (pending <= 0) continue;

    // Skip if an unread notification for this exact purchase+type already exists
    const [existing] = await db
      .select({ id: notificationsTable.id })
      .from(notificationsTable)
      .where(
        and(
          eq(notificationsTable.purchaseId, p.id),
          eq(notificationsTable.type, type),
          eq(notificationsTable.isRead, false),
        ),
      );
    if (existing) continue;

    await db.insert(notificationsTable).values({
      businessId,
      vendorId: p.vendorId,
      purchaseId: p.id,
      type,
      title: isOverdue ? "Vendor Payment Overdue" : "Vendor Payment Pending",
      message: `${p.vendorName} • ${p.invoiceNo ? `Invoice: ${p.invoiceNo} • ` : ""}Pending: ₹${pending.toFixed(2)} • Due: ${p.dueDate}`,
    });
  }
}
// ── 4. Vendor Payment Created — fires IMMEDIATELY on purchase/PO creation,
// no due_date needed. Separate from syncVendorPaymentNotifications (which
// is due-date based reminders for OLD unpaid purchases).
export async function createVendorPaymentNotification(params: {
  businessId: number;
  vendorId: number;
  vendorName: string;
  purchaseId: number;
  amount: number;
  invoiceNo?: string | null;
}) {
  const { businessId, vendorId, vendorName, purchaseId, amount, invoiceNo } = params;
  if (amount <= 0) return;

  await db.insert(notificationsTable).values({
    businessId,
    vendorId,
    purchaseId,
    type: "vendor_payment_pending",
    title: "Vendor Payment Pending",
    message: `${vendorName} • ${invoiceNo ? `Invoice: ${invoiceNo} • ` : ""}Pending: ₹${amount.toFixed(2)}`,
  });
}

export async function notifyVendorPaymentOnProductCreate(params: {
  businessId: number;
  vendorId: number;
  productId: number;
  productName: string;
  costPrice: number;
  stockQty: number;
}) {
  const { businessId, vendorId, productId, productName, costPrice, stockQty } = params;
  const pending = costPrice * stockQty;
  if (pending <= 0) return;

  const [vendor] = await db.select({ name: vendorsTable.name }).from(vendorsTable).where(eq(vendorsTable.id, vendorId));
  if (!vendor) return;

  await db.insert(notificationsTable).values({
    businessId,
    vendorId,
    productId,
    type: "vendor_payment_pending",
    title: "Vendor Payment Pending",
    message: `${vendor.name} • ${productName} • Pending: ₹${pending.toFixed(2)}`,
  });
}

// ── 5. Order Cancelled ──────────────────────────────────────────────────
export async function createOrderCancelledNotification(params: {
  businessId: number;
  salesOrderId: number;
  customerName: string;
}) {
  const { businessId, salesOrderId, customerName } = params;
  await db.insert(notificationsTable).values({
    businessId,
    salesOrderId,
    type: "order_cancelled",
    title: "Order Cancelled",
    message: `Order #ORD-${salesOrderId} was cancelled by ${customerName}`,
  });
}

