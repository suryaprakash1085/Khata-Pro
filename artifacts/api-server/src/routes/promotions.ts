import { Router, type IRouter } from "express";
import { db, promotionsTable, promotionProductsTable, productsTable } from "@workspace/db";
import { eq, and, gte, lte, desc, count, inArray } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { CreatePromotionBody, UpdatePromotionBody, UpdatePromotionStatusBody } from "@workspace/api-zod";

const router: IRouter = Router();

function formatPromotion(p: any, productIds?: number[], productNames?: string[]) {
  return {
    id: Number(p.id),
    business_id: Number(p.businessId),
    name: p.name,
    promotion_type: p.promotionType,
    apply_to: p.applyTo,
    start_date: p.startDate,
    end_date: p.endDate,
    status: p.status,
    discount_percentage: p.discountPercentage !== null && p.discountPercentage !== undefined ? parseFloat(p.discountPercentage) : null,
      description: p.description ?? null,
       promo_code: p.promoCode ?? null,
    min_order_amount: p.minOrderAmount !== null && p.minOrderAmount !== undefined ? parseFloat(p.minOrderAmount) : null,
    banner_image: p.bannerImage ?? null,
    product_ids: productIds ?? [],
    product_names: productNames ?? [],
    created_at: p.createdAt,
  };
}

async function attachProducts(promos: any[]) {
  const ids = promos.map((p) => Number(p.id));
  const map = new Map<number, { ids: number[]; names: string[] }>();
  if (ids.length === 0) return map;
  const rows = await db
    .select({ promotionId: promotionProductsTable.promotionId, productId: promotionProductsTable.productId, productName: productsTable.name })
    .from(promotionProductsTable)
    .innerJoin(productsTable, eq(promotionProductsTable.productId, productsTable.id))
    .where(inArray(promotionProductsTable.promotionId, ids));

  for (const row of rows as any[]) {
    const pid = Number(row.promotionId);
    if (!map.has(pid)) map.set(pid, { ids: [], names: [] });
    map.get(pid)!.ids.push(Number(row.productId));
    map.get(pid)!.names.push(row.productName);
  }
  return map;
}

// GET /promotions
router.get("/promotions", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) { res.status(400).json({ error: "business_id is required" }); return; }

  const status = req.query.status as string | undefined;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = (page - 1) * limit;

  const conditions: any[] = [eq(promotionsTable.businessId, businessId), eq(promotionsTable.isDeleted, false)];
  if (status === "active" || status === "inactive") conditions.push(eq(promotionsTable.status, status));

  const [promos, totalResult] = await Promise.all([
    db.select().from(promotionsTable).where(and(...conditions)).limit(limit).offset(offset).orderBy(desc(promotionsTable.createdAt)),
    db.select({ count: count() }).from(promotionsTable).where(and(...conditions)),
  ]);

  const productMap = await attachProducts(promos);

  res.json({
    data: promos.map((p: any) => {
      const pm = productMap.get(Number(p.id));
      return formatPromotion(p, pm?.ids, pm?.names);
    }),
    total: Number(totalResult[0].count),
    page,
    limit,
  });
});

// GET /promotions/active — Billing calls this
router.get("/promotions/active", async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) { res.status(400).json({ error: "business_id is required" }); return; }

  const today = new Date().toISOString().split("T")[0];
  const promos = await db.select().from(promotionsTable).where(
    and(
      eq(promotionsTable.businessId, businessId),
      eq(promotionsTable.isDeleted, false),
      eq(promotionsTable.status, "active"),
      lte(promotionsTable.startDate, today),
      gte(promotionsTable.endDate, today),
    ),
  );

  const productMap = await attachProducts(promos);
  res.json(promos.map((p: any) => {
    const pm = productMap.get(Number(p.id));
    return formatPromotion(p, pm?.ids, pm?.names);
  }));
});

// GET /promotions/:id
router.get("/promotions/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const [promo] = await db.select().from(promotionsTable)
    .where(and(eq(promotionsTable.id, id), eq(promotionsTable.isDeleted, false)));
  if (!promo) { res.status(404).json({ error: "Promotion not found" }); return; }

  const productMap = await attachProducts([promo]);
  const pm = productMap.get(id);
  res.json(formatPromotion(promo, pm?.ids, pm?.names));
});

// POST /promotions
router.post("/promotions", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreatePromotionBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const d: any = parsed.data;

  // ── Manual business-rule validation (not expressible in the generated
  // structural Zod schema — see spec §18) ──
  if (d.end_date < d.start_date) {
    res.status(400).json({ error: "End date cannot be before start date" });
    return;
  }
  const applyTo = d.apply_to ?? "selected";
  if (applyTo === "selected" && (!d.product_ids || d.product_ids.length === 0)) {
    res.status(400).json({ error: "Select at least one product for this promotion" });
    return;
  }
  // Percentage promotions are always exactly 10% (spec §6/§18) — server
  // ignores any other value the client might send rather than trusting it.
  const discountPercentage = d.promotion_type === "percentage" ? "10" : null;

  const [promo] = await db.insert(promotionsTable).values({
    businessId: d.business_id,
    name: d.name,
    promotionType: d.promotion_type,
    applyTo,
    startDate: d.start_date,
    endDate: d.end_date,
    status: d.status ?? "active",
    discountPercentage,
    description: d.description ?? null,
promoCode: d.promo_code ?? null,
minOrderAmount: d.min_order_amount !== undefined ? String(d.min_order_amount) : null,
bannerImage: d.banner_image ?? null,
  }).returning();

  if (applyTo === "selected" && d.product_ids?.length > 0) {
    await db.insert(promotionProductsTable).values(
      d.product_ids.map((productId: number) => ({ promotionId: promo.id, productId })),
    );
  }

  const productMap = await attachProducts([promo]);
  const pm = productMap.get(Number(promo.id));
  res.status(201).json(formatPromotion(promo, pm?.ids, pm?.names));
});

// PUT /promotions/:id
router.put("/promotions/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const parsed = UpdatePromotionBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }
  const d: any = parsed.data;

  const [existing] = await db.select().from(promotionsTable)
    .where(and(eq(promotionsTable.id, id), eq(promotionsTable.isDeleted, false)));
  if (!existing) { res.status(404).json({ error: "Promotion not found" }); return; }

  const effectiveStart = d.start_date ?? existing.startDate;
  const effectiveEnd = d.end_date ?? existing.endDate;
  if (effectiveEnd < effectiveStart) {
    res.status(400).json({ error: "End date cannot be before start date" });
    return;
  }
  const effectiveApplyTo = d.apply_to ?? existing.applyTo;
  if (effectiveApplyTo === "selected" && d.product_ids !== undefined && d.product_ids.length === 0) {
    res.status(400).json({ error: "Select at least one product for this promotion" });
    return;
  }

  const updates: any = {};
  if (d.name !== undefined) updates.name = d.name;
  if (d.apply_to !== undefined) updates.applyTo = d.apply_to;
  if (d.start_date !== undefined) updates.startDate = d.start_date;
  if (d.end_date !== undefined) updates.endDate = d.end_date;
  if (d.status !== undefined) updates.status = d.status;
  if (d.description !== undefined) updates.description = d.description;
if (d.promo_code !== undefined) updates.promoCode = d.promo_code;
if (d.min_order_amount !== undefined) updates.minOrderAmount = String(d.min_order_amount);
if (d.banner_image !== undefined) updates.bannerImage = d.banner_image;
  // discount_percentage is intentionally never editable here — stays fixed
  // at 10 for percentage promotions, null for bogo (spec §19).

  const [promo] = await db.update(promotionsTable).set(updates)
    .where(and(eq(promotionsTable.id, id), eq(promotionsTable.isDeleted, false))).returning();

  if (d.product_ids !== undefined) {
    await db.delete(promotionProductsTable).where(eq(promotionProductsTable.promotionId, id));
    if (d.product_ids.length > 0) {
      await db.insert(promotionProductsTable).values(
        d.product_ids.map((productId: number) => ({ promotionId: id, productId })),
      );
    }
  }

  const productMap = await attachProducts([promo]);
  const pm = productMap.get(id);
  res.json(formatPromotion(promo, pm?.ids, pm?.names));
});

// PUT /promotions/:id/status — Enable/Disable button
router.put("/promotions/:id/status", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const parsed = UpdatePromotionStatusBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: parsed.error.message }); return; }

  const [promo] = await db.update(promotionsTable).set({ status: parsed.data.status })
    .where(and(eq(promotionsTable.id, id), eq(promotionsTable.isDeleted, false))).returning();
  if (!promo) { res.status(404).json({ error: "Promotion not found" }); return; }

  const productMap = await attachProducts([promo]);
  const pm = productMap.get(id);
  res.json(formatPromotion(promo, pm?.ids, pm?.names));
});

// DELETE /promotions/:id
router.delete("/promotions/:id", requireAuth, async (req, res): Promise<void> => {
  const id = parseInt(req.params.id as string, 10);
  const [promo] = await db.update(promotionsTable).set({ isDeleted: true }).where(eq(promotionsTable.id, id)).returning();
  if (!promo) { res.status(404).json({ error: "Promotion not found" }); return; }
  res.json({ message: "Promotion deleted" });
});

export default router;