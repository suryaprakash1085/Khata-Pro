import { Router, type IRouter } from "express";
import { db, businessesTable, customersTable, transactionsTable, subscriptionsTable, subscriptionPlansTable, usersTable, staffBusinessMapTable, productsTable } from "@workspace/db";
import { eq, and, or, ilike, count, sql, desc, inArray } from "drizzle-orm";
import { requireAuth, AuthPayload } from "../middlewares/auth";
import { calculateTrialEndDate, getPriceForCycle } from "../services/subscription-billing.service";
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

type SubInfo = {
  plan: string;
  billingCycle: string;
  status: string;
  trialEndDate: string | null;
} | undefined;

// Shared response formatter — keeps the GET list / POST / GET :id / PUT :id
// responses consistent instead of repeating this object 4 times.
function formatBusiness(b: any, sub?: SubInfo) {
  return {
    id: Number(b.id),
    owner_id: Number(b.ownerId),
    business_name: b.businessName,
    business_type: b.businessType,
    gstin: b.gstin,
    description: b.description,
    phone: b.phone,
    email: b.email,
    address_line1: b.addressLine1,
    address_line2: b.addressLine2,
    city: b.city,
    state: b.state,
    postal_code: b.postalCode,
    country: b.country,
    latitude: b.latitude !== null && b.latitude !== undefined ? parseFloat(b.latitude) : null,
    longitude: b.longitude !== null && b.longitude !== undefined ? parseFloat(b.longitude) : null,
    logo_url: b.logoUrl,
    currency: b.currency,
    financial_year_start: b.financialYearStart,
    is_active: b.isActive,
    // ⚠️ No "free" fallback — Free plan does not exist anymore.
    plan: sub?.plan ?? null,
    billing_cycle: sub?.billingCycle ?? null,
    subscription_status: sub?.status ?? null,
    trial_end_date: sub?.trialEndDate ?? null,
    created_at: b.createdAt,
  };
}

// Helper to build a businessId -> SubInfo map from a list of subscription rows
function buildSubMap(subs: any[]): Map<number, SubInfo> {
  return new Map(
    subs.map((s) => [
      Number(s.businessId),
      {
        plan: s.plan,
        billingCycle: s.billingCycle,
        status: s.status,
        trialEndDate: s.trialEndDate,
      },
    ])
  );
}

// GET /businesses
router.get("/businesses", requireAuth, async (req, res): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;
  const ownerId = req.query.owner_id ? parseInt(req.query.owner_id as string) : undefined;
  const staffUserId = req.query.staff_user_id ? parseInt(req.query.staff_user_id as string) : undefined;
  const search = req.query.search as string | undefined;

  let query = db.select().from(businessesTable);
  const conditions = [];
  if (ownerId) conditions.push(eq(businessesTable.ownerId, ownerId));
  if (search) conditions.push(ilike(businessesTable.businessName, `%${search}%`));

  if (staffUserId) {
    const staffLinks = await db.select({ businessId: staffBusinessMapTable.businessId })
      .from(staffBusinessMapTable)
      .where(eq(staffBusinessMapTable.userId, staffUserId));
    const businessIds = staffLinks.map((s) => Number(s.businessId));
    conditions.push(businessIds.length ? inArray(businessesTable.id, businessIds) : sql`false`);
  }

  if (conditions.length) query = (query as any).where(and(...conditions));

  const [businesses, totalResult] = await Promise.all([
    (query as any).limit(limit).offset(offset).orderBy(desc(businessesTable.createdAt)),
    db.select({ count: count() }).from(businessesTable).where(conditions.length ? and(...conditions) : undefined),
  ]);

  const subs = await db.select().from(subscriptionsTable);
  const subMap = buildSubMap(subs);

  const data = businesses.map((b: any) => formatBusiness(b, subMap.get(Number(b.id))));

  res.json({ data, total: Number(totalResult[0].count), page, limit });
});

// POST /businesses
router.post("/businesses", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateBusinessBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  // ⚠️ CreateBusinessBody must include `plan` ("pro" | "premium") and
  // `billing_cycle` ("monthly" | "quarterly" | "half_yearly" | "yearly").
  // Add these to the zod schema in @workspace/api-zod if not already present.
  const { plan, billing_cycle } = parsed.data as any;
  if (!plan || !billing_cycle) {
    res.status(400).json({ error: "plan and billing_cycle are required" });
    return;
  }

  const { userId } = (req as any).user as AuthPayload;
  const [biz] = await db.insert(businessesTable).values({
    ownerId: userId,
    businessName: parsed.data.business_name,
    businessType: parsed.data.business_type,
    gstin: parsed.data.gstin,
    description: parsed.data.description,
    phone: parsed.data.phone,
    email: parsed.data.email,
    addressLine1: parsed.data.address_line1,
    addressLine2: parsed.data.address_line2,
    city: parsed.data.city,
    state: parsed.data.state,
    postalCode: parsed.data.postal_code,
    country: parsed.data.country ?? "India",
    latitude: parsed.data.latitude !== undefined ? parsed.data.latitude.toString() : undefined,
    longitude: parsed.data.longitude !== undefined ? parsed.data.longitude.toString() : undefined,
    logoUrl: parsed.data.logo_url,
    currency: parsed.data.currency ?? "INR",
    financialYearStart: parsed.data.financial_year_start instanceof Date ? parsed.data.financial_year_start.toISOString().split("T")[0] : parsed.data.financial_year_start,
  }).returning();

  // ── Start 15-day trial for the chosen plan (spec §3) ──
  const [planConfig] = await db.select().from(subscriptionPlansTable).where(eq(subscriptionPlansTable.plan, plan));
  if (!planConfig) {
    res.status(400).json({ error: `Plan "${plan}" is not configured` });
    return;
  }

  const today = new Date().toISOString().split("T")[0];
  const trialEnd = calculateTrialEndDate(today, planConfig.trialDays);
  const price = getPriceForCycle(planConfig, billing_cycle);

  const [sub] = await db.insert(subscriptionsTable).values({
    businessId: Number(biz.id),
    plan,
    billingCycle: billing_cycle,
    amount: price,
    startDate: today,
    endDate: trialEnd, // while in trial, endDate mirrors trialEndDate
    trialStartDate: today,
    trialEndDate: trialEnd,
    status: "trial",
  }).returning();

  res.status(201).json(
    formatBusiness(biz, {
      plan: sub.plan,
      billingCycle: sub.billingCycle,
      status: sub.status,
      trialEndDate: sub.trialEndDate,
    })
  );
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
  res.json(
    formatBusiness(
      biz,
      sub
        ? { plan: sub.plan, billingCycle: sub.billingCycle, status: sub.status, trialEndDate: sub.trialEndDate }
        : undefined
    )
  );
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
  if (parsed.data.description !== undefined) updates.description = parsed.data.description;
  if (parsed.data.phone !== undefined) updates.phone = parsed.data.phone;
  if (parsed.data.email !== undefined) updates.email = parsed.data.email;
  if (parsed.data.address_line1 !== undefined) updates.addressLine1 = parsed.data.address_line1;
  if (parsed.data.address_line2 !== undefined) updates.addressLine2 = parsed.data.address_line2;
  if (parsed.data.city !== undefined) updates.city = parsed.data.city;
  if (parsed.data.state !== undefined) updates.state = parsed.data.state;
  if (parsed.data.postal_code !== undefined) updates.postalCode = parsed.data.postal_code;
  if (parsed.data.country !== undefined) updates.country = parsed.data.country;
  if (parsed.data.latitude !== undefined) updates.latitude = parsed.data.latitude.toString();
  if (parsed.data.longitude !== undefined) updates.longitude = parsed.data.longitude.toString();
  if (parsed.data.logo_url !== undefined) updates.logoUrl = parsed.data.logo_url;
  if (parsed.data.currency) updates.currency = parsed.data.currency;
  if (parsed.data.financial_year_start !== undefined) updates.financialYearStart = parsed.data.financial_year_start instanceof Date ? parsed.data.financial_year_start.toISOString().split("T")[0] : parsed.data.financial_year_start;

  const [biz] = await db.update(businessesTable).set(updates).where(eq(businessesTable.id, id)).returning();
  if (!biz) {
    res.status(404).json({ error: "Business not found" });
    return;
  }
  const [sub] = await db.select().from(subscriptionsTable).where(eq(subscriptionsTable.businessId, Number(biz.id)));
  res.json(
    formatBusiness(
      biz,
      sub
        ? { plan: sub.plan, billingCycle: sub.billingCycle, status: sub.status, trialEndDate: sub.trialEndDate }
        : undefined
    )
  );
});

// GET /businesses/:id/stats
router.get("/businesses/:id/stats", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [customerCount] = await db.select({ count: count() }).from(customersTable)
    .where(and(eq(customersTable.businessId, id), eq(customersTable.isDeleted, false)));
  const [txCount] = await db.select({ count: count() }).from(transactionsTable)
    .where(and(
      eq(transactionsTable.businessId, id),
      eq(transactionsTable.isDeleted, false),
      eq(transactionsTable.type, "you_gave"),
    ));

  const [salesTotal] = await db.select({
    total: sql<string>`coalesce(sum(amount), 0)`,
  }).from(transactionsTable)
    .where(and(
      eq(transactionsTable.businessId, id),
      eq(transactionsTable.isDeleted, false),
      eq(transactionsTable.type, "you_gave"),
    ));
  const totalToCollect = parseFloat(salesTotal.total ?? "0");

  const [todaySalesTotal] = await db.select({
    total: sql<string>`coalesce(sum(amount), 0)`,
  }).from(transactionsTable)
    .where(and(
      eq(transactionsTable.businessId, id),
      eq(transactionsTable.isDeleted, false),
      eq(transactionsTable.type, "you_gave"),
      sql`${transactionsTable.entryDate} = current_date`,
    ));
  const todaySales = parseFloat(todaySalesTotal.total ?? "0");

  const customerBalances = await db.select({
    currentBalance: customersTable.currentBalance,
  }).from(customersTable)
    .where(and(eq(customersTable.businessId, id), eq(customersTable.isDeleted, false)));

  let totalToPay = 0;
  for (const row of customerBalances) {
    const bal = parseFloat(row.currentBalance ?? "0");
    if (bal < 0) totalToPay += Math.abs(bal);
  }

  res.json({
    total_to_collect: totalToCollect,
    total_to_pay: totalToPay,
    net_balance: totalToCollect - totalToPay,
    today_sales: todaySales,
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

  const [staff] = await db.insert(staffBusinessMapTable).values({
    businessId,
    userId: parsed.data.user_id,
    permissions: parsed.data.permissions ?? {},
  }).returning();

  await db.update(usersTable)
    .set({ role: "staff" })
    .where(eq(usersTable.id, parsed.data.user_id));

  res.status(201).json({
    id: Number(staff.id),
    business_id: Number(staff.businessId),
    user_id: Number(staff.userId),
    permissions: staff.permissions ?? {},
  });
});

// GET /public/businesses  — no auth required, used by delivery-app to list stores
router.get("/public/businesses", async (req, res): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;
  const search = req.query.search as string | undefined;

  let query = db.select().from(businessesTable).where(eq(businessesTable.isActive, true));
  if (search) {
    query = (query as any).where(ilike(businessesTable.businessName, `%${search}%`));
  }

  const businesses = await (query as any).limit(limit).offset(offset).orderBy(desc(businessesTable.createdAt));

  const subs = await db.select().from(subscriptionsTable);
  const subMap = buildSubMap(subs);

  const data = businesses.map((b: any) => formatBusiness(b, subMap.get(Number(b.id))));
  res.json({ data });
});

// GET /public/search?q=kid  — no auth, used by delivery-app for combined
// shop-name + product-name search. Matches on business_name OR any
// product name belonging to that business.
router.get("/public/search", async (req, res): Promise<void> => {
  try {
    const q = (req.query.q as string)?.trim();

    if (!q) {
      res.json({ data: [] });
      return;
    }

    const searchTerm = `%${q}%`;

    // 1️⃣ Business name direct match
    const nameMatches = await db
      .select()
      .from(businessesTable)
      .where(
        and(
          eq(businessesTable.isActive, true),
          ilike(businessesTable.businessName, searchTerm)
        )
      );

    // 2️⃣ Product name match — find distinct business_ids whose products match
    const matchingProducts = await db
      .select({ businessId: productsTable.businessId })
      .from(productsTable)
      .where(
        and(
          eq(productsTable.isDeleted, false),
          ilike(productsTable.name, searchTerm)
        )
      );

    const productBusinessIds = [...new Set(matchingProducts.map((p) => Number(p.businessId)))];

    const productMatches = productBusinessIds.length
      ? await db
          .select()
          .from(businessesTable)
          .where(
            and(
              eq(businessesTable.isActive, true),
              inArray(businessesTable.id, productBusinessIds)
            )
          )
      : [];

    // 3️⃣ Merge + dedupe by business id
    const merged = [...nameMatches, ...productMatches];
    const uniqueMap = new Map(merged.map((b: any) => [Number(b.id), b]));
    const uniqueBusinesses = Array.from(uniqueMap.values());

    const subs = await db.select().from(subscriptionsTable);
    const subMap = buildSubMap(subs);

    const data = uniqueBusinesses.map((b: any) =>
      formatBusiness(b, subMap.get(Number(b.id)))
    );

    res.json({ data });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Search failed" });
  }
});

// GET /public/businesses/by-category?category=Fashion
// Matches businesses whose business_type contains the category,
// OR businesses that have at least one product with matching category.
router.get("/public/businesses/by-category", async (req, res): Promise<void> => {
  try {
    const category = (req.query.category as string)?.trim();

    if (!category) {
      res.json({ data: [] });
      return;
    }

    const searchTerm = `%${category}%`;

    // 1️⃣ Business type match (e.g. business_type = "Fashion Store")
    const typeMatches = await db
      .select()
      .from(businessesTable)
      .where(
        and(
          eq(businessesTable.isActive, true),
          ilike(businessesTable.businessType, searchTerm)
        )
      );

    // 2️⃣ Product category match — find businesses that sell products
    // tagged with this category (e.g. category = "Kids")
    const matchingProducts = await db
      .select({ businessId: productsTable.businessId })
      .from(productsTable)
      .where(
        and(
          eq(productsTable.isDeleted, false),
          ilike(productsTable.category, searchTerm)
        )
      );

    const productBusinessIds = [...new Set(matchingProducts.map((p) => Number(p.businessId)))];

    const productMatches = productBusinessIds.length
      ? await db
          .select()
          .from(businessesTable)
          .where(
            and(
              eq(businessesTable.isActive, true),
              inArray(businessesTable.id, productBusinessIds)
            )
          )
      : [];

    // 3️⃣ Merge + dedupe
    const merged = [...typeMatches, ...productMatches];
    const uniqueMap = new Map(merged.map((b: any) => [Number(b.id), b]));
    const uniqueBusinesses = Array.from(uniqueMap.values());

    const subs = await db.select().from(subscriptionsTable);
    const subMap = buildSubMap(subs);

    const data = uniqueBusinesses.map((b: any) =>
      formatBusiness(b, subMap.get(Number(b.id)))
    );

    res.json({ data });
  } catch (error) {
    console.error("Category filter error:", error);
    res.status(500).json({ error: "Category filter failed" });
  }
});

export default router;