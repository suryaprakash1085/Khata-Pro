import { Router, type IRouter } from "express";
import { db, usersTable, businessesTable, transactionsTable, customersTable, subscriptionsTable, auditLogsTable } from "@workspace/db";
import { eq, and, ilike, count, desc, sql, gte } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";
import {
  UpdateBusinessStatusBody,
  UpdateUserStatusBody,
  UpdateSubscriptionBody,
  BroadcastNotificationBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

// GET /admin/analytics
router.get("/admin/analytics", requireAdmin, async (req, res): Promise<void> => {
  const [totalBiz, activeBiz, totalUsers, totalTx, txVolume, recentSignups] = await Promise.all([
    db.select({ count: count() }).from(businessesTable),
    db.select({ count: count() }).from(businessesTable).where(eq(businessesTable.isActive, true)),
    db.select({ count: count() }).from(usersTable),
    db.select({ count: count() }).from(transactionsTable).where(eq(transactionsTable.isDeleted, false)),
    db.select({ total: sql<string>`coalesce(sum(amount), 0)` }).from(transactionsTable).where(eq(transactionsTable.isDeleted, false)),
    db.select().from(businessesTable).orderBy(desc(businessesTable.createdAt)).limit(5),
  ]);

  // Monthly growth — last 6 months
  const monthlyData = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthStr = d.toISOString().slice(0, 7); // "2024-01"
    const startOfMonth = `${monthStr}-01`;
    const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).toISOString().split("T")[0];
    monthlyData.push({ month: monthStr, startOfMonth, endOfMonth });
  }

  const monthlyGrowth = await Promise.all(monthlyData.map(async ({ month, startOfMonth, endOfMonth }) => {
    const [bizCount, userCount, txCount] = await Promise.all([
      db.select({ count: count() }).from(businessesTable).where(sql`created_at::date between ${startOfMonth} and ${endOfMonth}`),
      db.select({ count: count() }).from(usersTable).where(sql`created_at::date between ${startOfMonth} and ${endOfMonth}`),
      db.select({ count: count() }).from(transactionsTable).where(sql`created_at::date between ${startOfMonth} and ${endOfMonth}`),
    ]);
    return {
      month,
      businesses: Number(bizCount[0].count),
      users: Number(userCount[0].count),
      transactions: Number(txCount[0].count),
    };
  }));

  // Plan breakdown
  const planBreakdown = await db.select({ plan: subscriptionsTable.plan, count: count() })
    .from(subscriptionsTable).groupBy(subscriptionsTable.plan);
  const planMap: any = { free: 0, pro: 0, premium: 0 };
  for (const row of planBreakdown) planMap[row.plan] = Number(row.count);

  // Format recent signups
  const subs = await db.select().from(subscriptionsTable);
  const subMap = new Map(subs.map((s) => [Number(s.businessId), s.plan]));
  const formattedSignups = recentSignups.map((b) => ({
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

  res.json({
    total_businesses: Number(totalBiz[0].count),
    active_businesses: Number(activeBiz[0].count),
    total_users: Number(totalUsers[0].count),
    total_transactions: Number(totalTx[0].count),
    total_transaction_volume: parseFloat(txVolume[0].total ?? "0"),
    monthly_growth: monthlyGrowth,
    plan_breakdown: planMap,
    recent_signups: formattedSignups,
  });
});

// GET /admin/businesses
router.get("/admin/businesses", requireAdmin, async (req, res): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;
  const search = req.query.search as string | undefined;
  const status = req.query.status as string | undefined;
  const plan = req.query.plan as string | undefined;

  // Get all businesses with owner info
  const allBiz = await db.select({
    b: businessesTable,
    ownerName: usersTable.name,
    ownerPhone: usersTable.phone,
  }).from(businessesTable)
    .leftJoin(usersTable, eq(usersTable.id, businessesTable.ownerId))
    .orderBy(desc(businessesTable.createdAt));

  // Get subscription plans and counts
  const subs = await db.select().from(subscriptionsTable);
  const subMap = new Map(subs.map((s) => [Number(s.businessId), s.plan]));
  const [customerCounts, txCounts] = await Promise.all([
    db.select({ businessId: customersTable.businessId, count: count() }).from(customersTable).where(eq(customersTable.isDeleted, false)).groupBy(customersTable.businessId),
    db.select({ businessId: transactionsTable.businessId, count: count() }).from(transactionsTable).where(eq(transactionsTable.isDeleted, false)).groupBy(transactionsTable.businessId),
  ]);
  const custMap = new Map(customerCounts.map((r) => [Number(r.businessId), Number(r.count)]));
  const txMap = new Map(txCounts.map((r) => [Number(r.businessId), Number(r.count)]));

  let data = allBiz.map((row) => ({
    id: Number(row.b.id),
    business_name: row.b.businessName,
    business_type: row.b.businessType,
    owner_name: row.ownerName ?? "",
    owner_phone: row.ownerPhone ?? "",
    plan: subMap.get(Number(row.b.id)) ?? "free",
    is_active: row.b.isActive,
    customer_count: custMap.get(Number(row.b.id)) ?? 0,
    transaction_count: txMap.get(Number(row.b.id)) ?? 0,
    created_at: row.b.createdAt,
  }));

  if (search) data = data.filter((b) => b.business_name.toLowerCase().includes(search.toLowerCase()) || b.owner_name.toLowerCase().includes(search.toLowerCase()));
  if (status) data = data.filter((b) => (status === "active" ? b.is_active : !b.is_active));
  if (plan) data = data.filter((b) => b.plan === plan);

  const total = data.length;
  data = data.slice(offset, offset + limit);

  res.json({ data, total, page, limit });
});

// PUT /admin/businesses/:id/status
router.put("/admin/businesses/:id/status", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const parsed = UpdateBusinessStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  await db.update(businessesTable).set({ isActive: parsed.data.is_active }).where(eq(businessesTable.id, id));
  res.json({ message: parsed.data.is_active ? "Business activated" : "Business suspended" });
});

// GET /admin/users
router.get("/admin/users", requireAdmin, async (req, res): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;
  const search = req.query.search as string | undefined;
  const role = req.query.role as string | undefined;
  const isActive = req.query.is_active;

  let users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));

  if (search) users = users.filter((u) => u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search));
  if (role) users = users.filter((u) => u.role === role);
  if (isActive !== undefined) users = users.filter((u) => u.isActive === (isActive === "true"));

  const total = users.length;
  const data = users.slice(offset, offset + limit).map((u) => ({
    id: Number(u.id),
    name: u.name,
    phone: u.phone,
    email: u.email,
    role: u.role,
    profile_image: u.profileImage,
    is_active: u.isActive,
    language_pref: u.languagePref,
    created_at: u.createdAt,
  }));

  res.json({ data, total, page, limit });
});

// PUT /admin/users/:id/status
router.put("/admin/users/:id/status", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const parsed = UpdateUserStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  await db.update(usersTable).set({ isActive: parsed.data.is_active }).where(eq(usersTable.id, id));
  res.json({ message: parsed.data.is_active ? "User activated" : "User suspended" });
});

// GET /admin/subscriptions
router.get("/admin/subscriptions", requireAdmin, async (req, res): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = (page - 1) * limit;
  const plan = req.query.plan as string | undefined;
  const status = req.query.status as string | undefined;

  let subs = await db.select({ s: subscriptionsTable, businessName: businessesTable.businessName })
    .from(subscriptionsTable)
    .leftJoin(businessesTable, eq(businessesTable.id, subscriptionsTable.businessId))
    .orderBy(desc(subscriptionsTable.createdAt));

  let data = subs.map((row) => ({
    id: Number(row.s.id),
    business_id: Number(row.s.businessId),
    business_name: row.businessName ?? "",
    plan: row.s.plan,
    start_date: row.s.startDate,
    end_date: row.s.endDate,
    status: row.s.status,
    payment_ref: row.s.paymentRef,
  }));

  if (plan) data = data.filter((s) => s.plan === plan);
  if (status) data = data.filter((s) => s.status === status);

  const total = data.length;
  res.json({ data: data.slice(offset, offset + limit), total, page, limit });
});

// PUT /admin/subscriptions/:id
router.put("/admin/subscriptions/:id", requireAdmin, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const parsed = UpdateSubscriptionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updates: any = { plan: parsed.data.plan, status: parsed.data.status };
  if (parsed.data.end_date) updates.endDate = parsed.data.end_date;

  const [sub] = await db.update(subscriptionsTable).set(updates).where(eq(subscriptionsTable.id, id)).returning();
  if (!sub) { res.status(404).json({ error: "Subscription not found" }); return; }

  const [biz] = await db.select({ businessName: businessesTable.businessName }).from(businessesTable).where(eq(businessesTable.id, Number(sub.businessId)));
  res.json({
    id: Number(sub.id),
    business_id: Number(sub.businessId),
    business_name: biz?.businessName ?? "",
    plan: sub.plan,
    start_date: sub.startDate,
    end_date: sub.endDate,
    status: sub.status,
    payment_ref: sub.paymentRef,
  });
});

// GET /admin/audit-logs
router.get("/admin/audit-logs", requireAdmin, async (req, res): Promise<void> => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = (page - 1) * limit;

  const [logs, total] = await Promise.all([
    db.select({ l: auditLogsTable, userName: usersTable.name })
      .from(auditLogsTable)
      .leftJoin(usersTable, sql`${usersTable.id} = ${auditLogsTable.userId}`)
      .orderBy(desc(auditLogsTable.createdAt))
      .limit(limit).offset(offset),
    db.select({ count: count() }).from(auditLogsTable),
  ]);

  res.json({
    data: logs.map((row) => ({
      id: Number(row.l.id),
      business_id: row.l.businessId ? Number(row.l.businessId) : null,
      user_id: row.l.userId ? Number(row.l.userId) : null,
      user_name: row.userName,
      action: row.l.action,
      entity_type: row.l.entityType,
      entity_id: row.l.entityId ? Number(row.l.entityId) : null,
      old_value: row.l.oldValue,
      new_value: row.l.newValue,
      created_at: row.l.createdAt,
    })),
    total: Number(total[0].count),
    page,
    limit,
  });
});

// POST /admin/broadcast
router.post("/admin/broadcast", requireAdmin, async (req, res): Promise<void> => {
  const parsed = BroadcastNotificationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  req.log.info({ broadcast: parsed.data }, "Broadcast notification queued");
  res.json({ message: "Broadcast notification queued successfully" });
});

export default router;
