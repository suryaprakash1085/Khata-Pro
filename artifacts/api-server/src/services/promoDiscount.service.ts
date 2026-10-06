// TARGET PATH: artifacts/api-server/src/services/promoDiscount.service.ts
// NEW FILE
//
// Server-side promo discount calculation. The client only sends a
// promo_code; the discount amount is ALWAYS recomputed here, so a
// tampered client can never fake a discount.

import { db, promotionsTable, promotionProductsTable, productsTable } from "@workspace/db";
import { and, eq, gte, lte, inArray } from "drizzle-orm";

export interface PromoItemInput {
  product_id: number;
  qty: number;
  unit_price: number;
}

export interface PromoResult {
  discount: number;
  promoCode: string | null;
  promotionId: number | null;
}

export class PromoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PromoError";
  }
}

export async function calculatePromoDiscount(
  businessId: number,
  promoCode: string | null | undefined,
  items: PromoItemInput[],
): Promise<PromoResult> {
  const code = typeof promoCode === "string" ? promoCode.trim() : "";
  if (!code) return { discount: 0, promoCode: null, promotionId: null };

  const today = new Date().toISOString().split("T")[0];

  const promos = await db
    .select()
    .from(promotionsTable)
    .where(
      and(
        eq(promotionsTable.businessId, businessId),
        eq(promotionsTable.isDeleted, false),
        eq(promotionsTable.status, "active"),
        lte(promotionsTable.startDate, today),
        gte(promotionsTable.endDate, today),
      ),
    );

  const promo: any = promos.find((p: any) => p.promoCode?.toUpperCase() === code.toUpperCase());
  if (!promo) throw new PromoError("Invalid or expired promo code");

  const subtotal = items.reduce((sum, it) => sum + it.qty * it.unit_price, 0);
  const minOrder = promo.minOrderAmount !== null && promo.minOrderAmount !== undefined
    ? parseFloat(promo.minOrderAmount)
    : 0;
  if (minOrder > 0 && subtotal < minOrder) {
    throw new PromoError(`Minimum order ₹${minOrder} required for this promo code`);
  }

  // Which items does this promotion apply to?
  const productIds = items.map((i) => i.product_id);
  const productRows = productIds.length
    ? await db
        .select({ id: productsTable.id, category: productsTable.category })
        .from(productsTable)
        .where(inArray(productsTable.id, productIds))
    : [];
  const categoryMap = new Map(productRows.map((p: any) => [Number(p.id), p.category as string | null]));

  let selectedIds = new Set<number>();
  if (promo.applyTo === "selected") {
    const rows = await db
      .select({ productId: promotionProductsTable.productId })
      .from(promotionProductsTable)
      .where(eq(promotionProductsTable.promotionId, promo.id));
    selectedIds = new Set(rows.map((r: any) => Number(r.productId)));
  }

  const eligible = items.filter((it) => {
    if (!promo.applyTo || promo.applyTo === "all") return true;
    if (promo.applyTo === "selected") return selectedIds.has(it.product_id);
    if (promo.applyTo === "category") {
      return !!promo.category && categoryMap.get(it.product_id) === promo.category;
    }
    return false;
  });

  if (eligible.length === 0) {
    throw new PromoError("This promo code is not applicable to the items in your order");
  }

  const eligibleAmount = eligible.reduce((sum, it) => sum + it.qty * it.unit_price, 0);
  let discount = 0;

  if (promo.promotionType === "percentage") {
    const pct = promo.discountPercentage !== null ? parseFloat(promo.discountPercentage) : 0;
    discount = Math.round(eligibleAmount * (pct / 100));
  } else if (promo.promotionType === "bogo") {
    // Same rule as the mobile cart: in every pair the cheapest unit is free;
    // a leftover odd unit gets 50% off.
    const unitPrices: number[] = [];
    for (const it of eligible) {
      for (let i = 0; i < Math.round(it.qty); i++) unitPrices.push(it.unit_price);
    }
    unitPrices.sort((a, b) => a - b);
    const freePairs = Math.floor(unitPrices.length / 2);
    discount = unitPrices.slice(0, freePairs).reduce((s, p) => s + p, 0);
    if (unitPrices.length % 2 !== 0) {
      discount += (unitPrices[freePairs] ?? 0) * 0.5;
    }
    discount = Math.round(discount);
  }

  // Discount can never exceed the order's item total.
  discount = Math.min(Math.max(discount, 0), subtotal);

  return { discount, promoCode: promo.promoCode ?? code, promotionId: Number(promo.id) };
}