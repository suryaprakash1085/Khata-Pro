import { Router, type IRouter } from "express";
import { db, businessesTable, customersTable, transactionsTable, subscriptionsTable, usersTable, staffBusinessMapTable } from "@workspace/db";
import { eq, and, ilike, count, sql, desc, inArray } from "drizzle-orm";
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

// Shared response formatter — keeps the GET list / POST / GET :id / PUT :id
// responses consistent instead of repeating this object 4 times.
function formatBusiness(b: any, plan: string) {
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
    latitude: b.latitude !== null && b.latitude !== undefined ? parseFloat(b.latitude) : null,   // ✅ ADD
    longitude: b.longitude !== null && b.longitude !== undefined ? parseFloat(b.longitude) : null, // ✅ ADD
    logo_url: b.logoUrl,
    currency: b.currency,
    financial_year_start: b.financialYearStart,
    is_active: b.isActive,
    plan,
    created_at: b.createdAt,
  };
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
  const subMap = new Map(subs.map((s) => [Number(s.businessId), s.plan]));

  const data = businesses.map((b: any) => formatBusiness(b, subMap.get(Number(b.id)) ?? "free"));

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
    description: parsed.data.description,
    phone: parsed.data.phone,
    email: parsed.data.email,
    addressLine1: parsed.data.address_line1,
    addressLine2: parsed.data.address_line2,
    city: parsed.data.city,
    state: parsed.data.state,
    postalCode: parsed.data.postal_code,
    country: parsed.data.country ?? "India",
    latitude: parsed.data.latitude !== undefined ? parsed.data.latitude.toString() : undefined,   // ✅ ADD
    longitude: parsed.data.longitude !== undefined ? parsed.data.longitude.toString() : undefined, // ✅ ADD
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

  res.status(201).json(formatBusiness(biz, "free"));
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
  res.json(formatBusiness(biz, sub?.plan ?? "free"));
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
  if (parsed.data.latitude !== undefined) updates.latitude = parsed.data.latitude.toString();     // ✅ ADD
  if (parsed.data.longitude !== undefined) updates.longitude = parsed.data.longitude.toString();   // ✅ ADD
  if (parsed.data.logo_url !== undefined) updates.logoUrl = parsed.data.logo_url;
  if (parsed.data.currency) updates.currency = parsed.data.currency;
  if (parsed.data.financial_year_start !== undefined) updates.financialYearStart = parsed.data.financial_year_start instanceof Date ? parsed.data.financial_year_start.toISOString().split("T")[0] : parsed.data.financial_year_start;

  const [biz] = await db.update(businessesTable).set(updates).where(eq(businessesTable.id, id)).returning();
  if (!biz) {
    res.status(404).json({ error: "Business not found" });
    return;
  }
  const [sub] = await db.select().from(subscriptionsTable).where(eq(subscriptionsTable.businessId, Number(biz.id)));
  res.json(formatBusiness(biz, sub?.plan ?? "free"));
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
  const subMap = new Map(subs.map((s) => [Number(s.businessId), s.plan]));

  const data = businesses.map((b: any) => formatBusiness(b, subMap.get(Number(b.id)) ?? "free"));
  res.json({ data });
});

export default router;