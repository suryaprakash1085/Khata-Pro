// artifacts/api-server/src/routes/order-returns.ts
//
// Online-order returns (customer delivery app -> admin review -> replacement).
// Separate from routes/returns.ts, which handles in-store (POS) returns.
//
// Rules:
//  - Customer can request a return only after the order is DELIVERED,
//    and only within 24 hours of deliveries.delivered_at.
//  - At least 1 photo AND 1 video are mandatory.
//  - Admin approves / rejects after looking at the evidence.
//  - On approval, admin sends a replacement (creates a new pending delivery,
//    deducts stock, notifies customer).

import { Router, type IRouter } from "express";
import {
  db,
  orderReturnsTable,
  orderReturnMediaTable,
  salesOrdersTable,
  salesOrderItemsTable,
  deliveriesTable,
  deliveryStatusHistoryTable,
  productsTable,
  customersTable,
  notificationsTable,
} from "@workspace/db";
import { and, desc, eq, inArray, sql, type SQL } from "drizzle-orm";
import { z } from "zod/v4";
import { requireAuth, AuthPayload } from "../middlewares/auth";
import { requireCustomerAuth } from "../middlewares/customerAuth"; // adjust filename if different
import { notifyCustomer } from "../services/notificationService";
import { syncLowStockNotification } from "../services/adminNotifications.service";
import { getNextDeliveryNumber } from "../services/deliveryCounter";

const router: IRouter = Router();

const RETURN_WINDOW_HOURS = 24;

const REASONS = ["EXPIRED_PRODUCT", "WRONG_PRODUCT", "DAMAGED", "MISSING_ITEM", "OTHER"] as const;
const STATUSES = ["REQUESTED", "APPROVED", "REJECTED", "REPLACEMENT_SENT"] as const;

const REASON_LABEL: Record<string, string> = {
  EXPIRED_PRODUCT: "Expired product",
  WRONG_PRODUCT: "Wrong product delivered",
  DAMAGED: "Damaged product",
  MISSING_ITEM: "Item missing",
  OTHER: "Other",
};

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

function parseId(raw: unknown): number | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const id = parseInt(value as string, 10);
  return Number.isInteger(id) ? id : null;
}

// ─── Formatting ─────────────────────────────────────────────────────────────

async function loadReturns(where: SQL | undefined) {
  const rows = await db
    .select({
      r: orderReturnsTable,
      productName: productsTable.name,
      customerName: customersTable.name,
      customerPhone: customersTable.phone,
    })
    .from(orderReturnsTable)
    .innerJoin(productsTable, eq(orderReturnsTable.productId, productsTable.id))
    .innerJoin(customersTable, eq(orderReturnsTable.customerId, customersTable.id))
    .where(where)
    .orderBy(desc(orderReturnsTable.createdAt));

  const ids = rows.map((x) => x.r.id);
  const media = ids.length
    ? await db.select().from(orderReturnMediaTable).where(inArray(orderReturnMediaTable.returnId, ids))
    : [];

  return rows.map((x) => ({
    id: x.r.id,
    sales_order_id: Number(x.r.salesOrderId),
    product_id: Number(x.r.productId),
    product_name: x.productName,
    qty: parseFloat(x.r.qty as any),
    reason: x.r.reason,
    description: x.r.description ?? null,
    status: x.r.status,
    admin_note: x.r.adminNote ?? null,
    customer_name: x.customerName,
    customer_phone: x.customerPhone ?? null,
    delivered_at: x.r.deliveredAt,
    replacement_delivery_id: x.r.replacementDeliveryId !== null ? Number(x.r.replacementDeliveryId) : null,
    replacement_sent_at: x.r.replacementSentAt ?? null,
    media: media
      .filter((m) => m.returnId === x.r.id)
      .map((m) => ({ id: m.id, type: m.type, url: m.url })),
    created_at: x.r.createdAt,
  }));
}

// ─── Admin bell notification (same notifications table the bell reads) ──────

async function notifyAdminOfReturnRequest(params: {
  businessId: number;
  salesOrderId: number;
  customerName: string;
  productNames: string[];
  reason: string;
}) {
  const { businessId, salesOrderId, customerName, productNames, reason } = params;
  await db.insert(notificationsTable).values({
    businessId,
    salesOrderId,
    type: "return_requested",
    title: "Return Request",
    message: `Order #ORD-${salesOrderId} • ${customerName} • ${productNames.join(", ")} • ${REASON_LABEL[reason] ?? reason}`,
  });
}

// ─── 1. Customer: request a return ──────────────────────────────────────────

// Photo + video are mandatory in the final flow. The OrdersScreen modal does not
// collect media yet, so keep this false until the upload step is added there.
const REQUIRE_MEDIA = true;

const MediaItem = z.object({
  type: z.enum(["photo", "video"]),
  url: z.string().min(1),
});

const ReturnItem = z.object({
  product_id: z.number().int().positive(),
  qty: z.number().positive(),
});

const ReturnBody = z.object({
  items: z.array(ReturnItem).min(1),
  reason: z.enum(REASONS),
  description: z.string().max(1000).optional(),
  media: z.array(MediaItem).max(10).default([]),
});

router.post("/customers/me/orders/:id/return", requireCustomerAuth, async (req, res): Promise<void> => {
  const orderId = parseId(req.params.id);
  if (orderId === null) {
    res.status(400).json({ error: "Invalid order id" });
    return;
  }
  const { customerId } = (req as any).customer as { customerId: number };

  const parsed = ReturnBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { reason, description, media, items } = parsed.data;

  // One entry per product
  const requested = new Map<number, number>();
  for (const it of items) {
    if (requested.has(it.product_id)) {
      res.status(400).json({ error: "Duplicate product in return request." });
      return;
    }
    requested.set(it.product_id, it.qty);
  }
  const productIds = [...requested.keys()];

  if (reason === "OTHER" && !description?.trim()) {
    res.status(400).json({ error: "Please describe the problem when the reason is Other." });
    return;
  }

  if (REQUIRE_MEDIA && (!media.some((m) => m.type === "photo") || !media.some((m) => m.type === "video"))) {
    res.status(422).json({ error: "At least one photo and one video are required." });
    return;
  }

  const [order] = await db
    .select()
    .from(salesOrdersTable)
    .where(
      and(
        eq(salesOrdersTable.id, orderId),
        eq(salesOrdersTable.customerId, customerId),
        eq(salesOrdersTable.isDeleted, false),
      ),
    );
  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  // 24h window — measured from the delivery's delivered_at, checked server-side.
  const [delivery] = await db
    .select()
    .from(deliveriesTable)
    .where(and(eq(deliveriesTable.salesOrderId, orderId), eq(deliveriesTable.status, "delivered")))
    .orderBy(desc(deliveriesTable.deliveredAt))
    .limit(1);

  if (!delivery || !delivery.deliveredAt) {
    res.status(409).json({ error: "Returns are available only after the order is delivered." });
    return;
  }
  const elapsedMs = Date.now() - new Date(delivery.deliveredAt).getTime();
  if (elapsedMs > RETURN_WINDOW_HOURS * 60 * 60 * 1000) {
    res.status(409).json({ error: `The ${RETURN_WINDOW_HOURS}-hour return window for this order has expired.` });
    return;
  }

  // Every requested product must be a line item of this order.
  const itemRows = await db
    .select({
      productId: salesOrderItemsTable.productId,
      qty: salesOrderItemsTable.qty,
      productName: productsTable.name,
    })
    .from(salesOrderItemsTable)
    .innerJoin(productsTable, eq(salesOrderItemsTable.productId, productsTable.id))
    .where(and(eq(salesOrderItemsTable.salesOrderId, orderId), inArray(salesOrderItemsTable.productId, productIds)));

  const lines = new Map<number, { qty: number; name: string }>();
  for (const row of itemRows) {
    const pid = Number(row.productId);
    const prev = lines.get(pid);
    lines.set(pid, { qty: (prev?.qty ?? 0) + parseFloat(row.qty as any), name: row.productName });
  }
  if (lines.size !== productIds.length) {
    res.status(400).json({ error: "One or more selected products are not part of this order." });
    return;
  }

  // Return qty can never exceed what was ordered
  for (const pid of productIds) {
    const line = lines.get(pid)!;
    if (requested.get(pid)! > line.qty) {
      res.status(400).json({ error: `You can return at most ${line.qty} of ${line.name}.` });
      return;
    }
  }

  const already = await db
    .select({ id: orderReturnsTable.id })
    .from(orderReturnsTable)
    .where(and(eq(orderReturnsTable.salesOrderId, orderId), inArray(orderReturnsTable.productId, productIds)));
  if (already.length > 0) {
    res.status(409).json({ error: "A return has already been requested for one of these products." });
    return;
  }

  const created = await db.transaction(async (tx) => {
    const out = [];
    for (const pid of productIds) {
      const [row] = await tx
        .insert(orderReturnsTable)
        .values({
          businessId: Number(order.businessId),
          customerId,
          salesOrderId: orderId,
          productId: pid,
          qty: String(requested.get(pid)!),
          reason,
          description: description?.trim() || null,
          deliveredAt: new Date(delivery.deliveredAt!),
        })
        .returning();

      if (media.length > 0) {
        await tx
          .insert(orderReturnMediaTable)
          .values(media.map((m) => ({ returnId: row.id, type: m.type, url: m.url })));
      }

      out.push(row);
    }
    return out;
  });

  // One bell notification per request (not per product). Never fails the request.
  try {
    const [customer] = await db
      .select({ name: customersTable.name })
      .from(customersTable)
      .where(eq(customersTable.id, customerId));

    await notifyAdminOfReturnRequest({
      businessId: Number(order.businessId),
      salesOrderId: orderId,
      customerName: customer?.name ?? "Customer",
      productNames: productIds.map((pid) => lines.get(pid)!.name),
      reason,
    });
  } catch (err) {
    console.error("[order-returns] admin notification failed:", err);
  }

  res.status(201).json({
    data: created.map((r) => ({ id: r.id, status: r.status, reason: r.reason })),
  });
});

// ─── 2. Customer: track my returns ──────────────────────────────────────────

router.get("/customers/me/order-returns", requireCustomerAuth, async (req, res): Promise<void> => {
  const { customerId } = (req as any).customer as { customerId: number };
  const data = await loadReturns(eq(orderReturnsTable.customerId, customerId));
  res.json({ data });
});

// ─── 3. Admin: list ─────────────────────────────────────────────────────────

router.get("/order-returns", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const status = req.query.status as string | undefined;
  if (status && !(STATUSES as readonly string[]).includes(status)) {
    res.status(400).json({ error: `status must be one of: ${STATUSES.join(", ")}` });
    return;
  }

  const conditions: SQL[] = [eq(orderReturnsTable.businessId, businessId)];
  if (status) conditions.push(eq(orderReturnsTable.status, status as any));

  const data = await loadReturns(and(...conditions));
  res.json({ data });
});

// ─── 4. Admin: detail (with photo/video evidence) ───────────────────────────

router.get("/order-returns/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid return id" });
    return;
  }
  const [row] = await loadReturns(eq(orderReturnsTable.id, id));
  if (!row) {
    res.status(404).json({ error: "Return request not found" });
    return;
  }
  res.json(row);
});

// ─── 5. Admin: approve / reject ─────────────────────────────────────────────

const StatusBody = z.object({
  status: z.enum(["APPROVED", "REJECTED"]),
  admin_note: z.string().max(500).optional(),
});

router.put("/order-returns/:id/status", requireAuth, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid return id" });
    return;
  }
  const parsed = StatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "status must be APPROVED or REJECTED" });
    return;
  }
  const { status, admin_note } = parsed.data;
  const note = admin_note?.trim() || null;

  // Customer should always know WHY it was rejected.
  if (status === "REJECTED" && !note) {
    res.status(400).json({ error: "Please add a note explaining why the return was rejected." });
    return;
  }

  const { userId } = (req as any).user as AuthPayload;

  // Only a REQUESTED row can be resolved (atomic — no double-approve).
  const [updated] = await db
    .update(orderReturnsTable)
    .set({ status, adminNote: note, reviewedBy: userId, reviewedAt: new Date() })
    .where(and(eq(orderReturnsTable.id, id), eq(orderReturnsTable.status, "REQUESTED")))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Return request not found or already resolved" });
    return;
  }

  try {
    const [product] = await db
      .select({ name: productsTable.name })
      .from(productsTable)
      .where(eq(productsTable.id, updated.productId));
    const productName = product?.name ?? "your product";
    const orderRef = Number(updated.salesOrderId);

    if (status === "APPROVED") {
      await notifyCustomer({
        businessId: Number(updated.businessId),
        customerId: Number(updated.customerId),
        salesOrderId: orderRef,
        type: "return_approved",
        title: "Return Approved",
        message: `Your return for ${productName} (Order #${orderRef}) is approved. We will send you a replacement soon.`,
      });
    } else {
      await notifyCustomer({
        businessId: Number(updated.businessId),
        customerId: Number(updated.customerId),
        salesOrderId: orderRef,
        type: "return_rejected",
        title: "Return Request Rejected",
        message: `Your return for ${productName} (Order #${orderRef}) was not accepted. Reason: ${note}`,
      });
    }
  } catch (err) {
    console.error("[order-returns] customer notification failed:", err);
  }

  res.json({ id: updated.id, status: updated.status, reason: updated.reason });
});

// ─── 6. Admin: send replacement ─────────────────────────────────────────────
// Creates a NEW pending delivery (admin assigns a driver from the normal
// Deliveries screen), deducts stock, marks the return REPLACEMENT_SENT.

router.post("/order-returns/:id/replacement", requireAuth, async (req, res): Promise<void> => {
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid return id" });
    return;
  }
  const { userId } = (req as any).user as AuthPayload;

  const [ret] = await db.select().from(orderReturnsTable).where(eq(orderReturnsTable.id, id));
  if (!ret) {
    res.status(404).json({ error: "Return request not found" });
    return;
  }
  if (ret.status !== "APPROVED" || ret.replacementDeliveryId !== null) {
    res.status(409).json({ error: "Return must be APPROVED and not already replaced." });
    return;
  }

  // Reuse the original delivery's addresses for the replacement trip.
  const [original] = await db
    .select()
    .from(deliveriesTable)
    .where(and(eq(deliveriesTable.salesOrderId, Number(ret.salesOrderId)), eq(deliveriesTable.status, "delivered")))
    .orderBy(desc(deliveriesTable.deliveredAt))
    .limit(1);
  if (!original) {
    res.status(409).json({ error: "Original delivery not found for this order." });
    return;
  }

  const qty = parseFloat(ret.qty as any);
  const nextNo = await getNextDeliveryNumber(Number(ret.businessId));

  try {
    const result = await db.transaction(async (tx) => {
      const [product] = await tx.select().from(productsTable).where(eq(productsTable.id, ret.productId));
      if (!product) throw new HttpError(404, "Product not found");
      if (product.stockQty < qty) {
        throw new HttpError(422, `Not enough stock for ${product.name} (available: ${product.stockQty}).`);
      }

      await tx
        .update(productsTable)
        .set({ stockQty: sql`${productsTable.stockQty} - ${qty}` })
        .where(eq(productsTable.id, product.id));

      const [newDelivery] = await tx
        .insert(deliveriesTable)
        .values({
          businessId: Number(ret.businessId),
          businessDeliveryNo: nextNo,
          customerId: Number(ret.customerId),
          salesOrderId: null, // keeps the original order's 24h window + driver item list untouched
          pickupAddress: original.pickupAddress,
          dropAddress: original.dropAddress,
          deliveryLandmark: original.deliveryLandmark,
          deliveryInstructions: original.deliveryInstructions,
          notes: `Replacement for Order #${ret.salesOrderId}: ${product.name} x ${qty}`,
          amount: "0",
          payment_method: "online", // free replacement — no COD collection
          status: "pending",
        })
        .returning();

      const [marked] = await tx
        .update(orderReturnsTable)
        .set({
          status: "REPLACEMENT_SENT",
          replacementDeliveryId: Number(newDelivery.id),
          replacementSentAt: new Date(),
        })
        .where(and(eq(orderReturnsTable.id, id), eq(orderReturnsTable.status, "APPROVED")))
        .returning();
      if (!marked) throw new HttpError(409, "Return must be APPROVED and not already replaced.");

      await tx.insert(deliveryStatusHistoryTable).values({
        deliveryId: Number(newDelivery.id),
        previousStatus: null,
        newStatus: "pending",
        changedBy: userId,
        changedByType: "admin",
        notes: `Replacement delivery for return #${id}`,
      });

      return { productId: product.id, productName: product.name };
    });

    // Low-stock bell if the replacement pushed stock under threshold.
    syncLowStockNotification(Number(result.productId)).catch((err) =>
      console.error("[order-returns] low stock sync failed:", err),
    );

    await notifyCustomer({
      businessId: Number(ret.businessId),
      customerId: Number(ret.customerId),
      salesOrderId: Number(ret.salesOrderId),
      type: "replacement_sent",
      title: "Replacement On The Way",
      message: `Your replacement for ${result.productName} (Order #${ret.salesOrderId}) is being arranged and will reach you soon.`,
    }).catch((err) => console.error("[order-returns] customer notification failed:", err));
  } catch (err) {
    if (err instanceof HttpError) {
      res.status(err.status).json({ error: err.message });
      return;
    }
    console.error("[order-returns] replacement failed:", err);
    res.status(500).json({ error: "Could not create the replacement. Please try again." });
    return;
  }

  const [row] = await loadReturns(eq(orderReturnsTable.id, id));
  res.json(row);
});

export default router;