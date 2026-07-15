import { Router, type IRouter } from "express";
import { db, businessesTable, customersTable, transactionsTable, subscriptionsTable, usersTable } from "@workspace/db";
import { eq, and, ilike, count, sql, desc } from "drizzle-orm";
import { requireAuth, AuthPayload } from "../middlewares/auth";
import {
  CreateBusinessBody,
  UpdateBusinessBody,
  GetBusinessParams,
  UpdateBusinessParams,
  GetBusinessStatsParams,
  AddStaffParams,
  AddStaffBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

// GET /businesses
router.get("/businesses", requireAuth, async (req, res): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;
  const ownerId = req.query.owner_id ? parseInt(req.query.owner_id as string) : undefined;
  const search = req.query.search as string | undefined;

  let query = db.select().from(businessesTable);
  const conditions = [];
  if (ownerId) conditions.push(eq(businessesTable.ownerId, ownerId));
  if (search) conditions.push(ilike(businessesTable.businessName, `%${search}%`));
  if (conditions.length) query = (query as any).where(and(...conditions));

  const [businesses, totalResult] = await Promise.all([
    (query as any).limit(limit).offset(offset).orderBy(desc(businessesTable.createdAt)),
    db.select({ count: count() }).from(businessesTable).where(conditions.length ? and(...conditions) : undefined),
  ]);

  // Get plan for each business
  const subs = await db.select().from(subscriptionsTable);
  const subMap = new Map(subs.map((s) => [Number(s.businessId), s.plan]));

  const data = businesses.map((b: any) => ({
    id: Number(b.id),
    owner_id: Number(b.ownerId),
    business_name: b.businessName,
    business_type: b.businessType,
    gstin: b.gstin,
    address: b.address,
    logo_url: b.logoUrl,
    currency: b.currency,
    financial_year_start: b.financialYearStart,
    is_active: b.isActive,
    plan: subMap.get(Number(b.id)) ?? "free",
    created_at: b.createdAt,
  }));

  res.json({ data, total: Number(totalResult[0].count), page, limit });
});

// POST /businesses
router.post("/businesses", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateBusinessBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const { userId } = (req as any).user as AuthPayload;
  const [biz] = await db.insert(businessesTable).values({
    ownerId: userId,
    businessName: parsed.data.business_name,
    businessType: parsed.data.business_type,
    gstin: parsed.data.gstin,
    address: parsed.data.address,
    logoUrl: parsed.data.logo_url,
    currency: parsed.data.currency ?? "INR",
    financialYearStart: parsed.data.financial_year_start instanceof Date ? parsed.data.financial_year_start.toISOString().split("T")[0] : parsed.data.financial_year_start,
  }).returning();

  // Create default free subscription
  const today = new Date().toISOString().split("T")[0];
  const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  await db.insert(subscriptionsTable).values({
    businessId: Number(biz.id),
    plan: "free",
    startDate: today,
    endDate: nextYear,
    status: "active",
  });

  res.status(201).json({
    id: Number(biz.id),
    owner_id: Number(biz.ownerId),
    business_name: biz.businessName,
    business_type: biz.businessType,
    gstin: biz.gstin,
    address: biz.address,
    logo_url: biz.logoUrl,
    currency: biz.currency,
    financial_year_start: biz.financialYearStart,
    is_active: biz.isActive,
    plan: "free",
    created_at: biz.createdAt,
  });
});

// GET /businesses/:id
router.get("/businesses/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [biz] = await db.select().from(businessesTable).where(eq(businessesTable.id, id));
  if (!biz) {
    res.status(404).json({ error: "Business not found" });
    return;
  }
  const [sub] = await db.select().from(subscriptionsTable).where(eq(subscriptionsTable.businessId, Number(biz.id)));
  res.json({
    id: Number(biz.id),
    owner_id: Number(biz.ownerId),
    business_name: biz.businessName,
    business_type: biz.businessType,
    gstin: biz.gstin,
    address: biz.address,
    logo_url: biz.logoUrl,
    currency: biz.currency,
    financial_year_start: biz.financialYearStart,
    is_active: biz.isActive,
    plan: sub?.plan ?? "free",
    created_at: biz.createdAt,
  });
});

// PUT /businesses/:id
router.put("/businesses/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const parsed = UpdateBusinessBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updates: any = {};
  if (parsed.data.business_name) updates.businessName = parsed.data.business_name;
  if (parsed.data.business_type) updates.businessType = parsed.data.business_type;
  if (parsed.data.gstin !== undefined) updates.gstin = parsed.data.gstin;
  if (parsed.data.address !== undefined) updates.address = parsed.data.address;
  if (parsed.data.logo_url !== undefined) updates.logoUrl = parsed.data.logo_url;
  if (parsed.data.currency) updates.currency = parsed.data.currency;
  if (parsed.data.financial_year_start !== undefined) updates.financialYearStart = parsed.data.financial_year_start instanceof Date ? parsed.data.financial_year_start.toISOString().split("T")[0] : parsed.data.financial_year_start;

  const [biz] = await db.update(businessesTable).set(updates).where(eq(businessesTable.id, id)).returning();
  if (!biz) {
    res.status(404).json({ error: "Business not found" });
    return;
  }
  const [sub] = await db.select().from(subscriptionsTable).where(eq(subscriptionsTable.businessId, Number(biz.id)));
  res.json({
    id: Number(biz.id),
    owner_id: Number(biz.ownerId),
    business_name: biz.businessName,
    business_type: biz.businessType,
    gstin: biz.gstin,
    address: biz.address,
    logo_url: biz.logoUrl,
    currency: biz.currency,
    financial_year_start: biz.financialYearStart,
    is_active: biz.isActive,
    plan: sub?.plan ?? "free",
    created_at: biz.createdAt,
  });
});

// GET /businesses/:id/stats
router.get("/businesses/:id/stats", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [customerCount] = await db.select({ count: count() }).from(customersTable)
    .where(and(eq(customersTable.businessId, id), eq(customersTable.isDeleted, false)));
  const [txCount] = await db.select({ count: count() }).from(transactionsTable)
    .where(and(eq(transactionsTable.businessId, id), eq(transactionsTable.isDeleted, false)));

  const totals = await db.select({
    type: transactionsTable.type,
    total: sql<string>`sum(amount)`,
  }).from(transactionsTable)
    .where(and(eq(transactionsTable.businessId, id), eq(transactionsTable.isDeleted, false)))
    .groupBy(transactionsTable.type);

  let totalToCollect = 0;
  let totalToPay = 0;
  for (const row of totals) {
    if (row.type === "you_gave") totalToCollect += parseFloat(row.total ?? "0");
    if (row.type === "you_got") totalToPay += parseFloat(row.total ?? "0");
  }

  res.json({
    total_to_collect: totalToCollect,
    total_to_pay: totalToPay,
    net_balance: totalToCollect - totalToPay,
    customer_count: Number(customerCount.count),
    transaction_count: Number(txCount.count),
  });
});

// POST /businesses/:id/staff
router.post("/businesses/:id/staff", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const businessId = parseInt(raw, 10);
  const parsed = AddStaffBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  res.status(201).json({
    id: 1,
    business_id: businessId,
    user_id: parsed.data.user_id,
    permissions: parsed.data.permissions ?? {},
  });
});

export default router;
