import { Router, type IRouter } from "express";
import {
  db,
  usersTable,
  businessesTable,
  staffBusinessMapTable,
  transactionsTable,
  customersTable,
  subscriptionsTable,
  subscriptionPlansTable,
  auditLogsTable,
  subscriptionPaymentsTable,
  notificationsTable,
} from "@workspace/db";
import { eq, and, ilike, count, desc, sql, gte, lte, inArray } from "drizzle-orm";
import { requireAdmin } from "../middlewares/auth";
import { calculateSubscriptionEndDate, getPriceForCycle } from "../services/subscription-billing.service";
import {
  UpdateBusinessStatusBody,
  UpdateUserStatusBody,
  UpdateSubscriptionBody,
  BroadcastNotificationBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

// GET /admin/analytics
router.get("/admin/analytics", requireAdmin, async (req, res): Promise<void> => {
  try {
    const [
      totalBiz,
      activeBiz,
      totalUsers,
      totalTx,
      txVolume,
      recentSignups,
    ] = await Promise.all([
      db.select({ count: count() }).from(businessesTable),

      db
        .select({ count: count() })
        .from(businessesTable)
        .where(eq(businessesTable.isActive, true)),

      db.select({ count: count() }).from(usersTable),

      // ── PLATFORM-LEVEL: Total Transactions = count of subscription
      // payment records (platform billing events), NOT business ledger
      // transactions. Business sales/ledger amounts are never used here.
      db
        .select({ count: count() })
        .from(subscriptionPaymentsTable),

      // ── PLATFORM-LEVEL: Platform Volume = total KhataPro subscription
      // revenue collected (status = paid), NOT business transaction volume.
      db
        .select({
          total: sql<string>`coalesce(sum(amount), 0)`,
        })
        .from(subscriptionPaymentsTable)
        .where(eq(subscriptionPaymentsTable.status, "paid")),

      db
        .select()
        .from(businessesTable)
        .orderBy(desc(businessesTable.createdAt))
        .limit(5),
    ]);

    // Monthly growth — last 6 months
    const monthlyData = [];

    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthStr = d.toISOString().slice(0, 7);
      const startOfMonth = `${monthStr}-01`;
      const endOfMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0)
        .toISOString()
        .split("T")[0];

      monthlyData.push({ month: monthStr, startOfMonth, endOfMonth });
    }

    const monthlyGrowth = await Promise.all(
      monthlyData.map(async ({ month, startOfMonth, endOfMonth }) => {
        const [bizCount, userCount, txCount] = await Promise.all([
          db
            .select({ count: count() })
            .from(businessesTable)
            .where(sql`created_at::date between ${startOfMonth} and ${endOfMonth}`),

          db
            .select({ count: count() })
            .from(usersTable)
            .where(sql`created_at::date between ${startOfMonth} and ${endOfMonth}`),

          // Platform Growth "transactions" line — kept on the ledger
          // transactions table intentionally, since this chart tracks
          // overall platform activity volume over time (not a KPI card),
          // and the spec's business/platform separation rule targets the
          // KPI cards and revenue figures specifically. If you'd rather
          // this chart also stay platform-only, swap this for
          // subscriptionPaymentsTable the same way as totalTx above.
          db
            .select({ count: count() })
            .from(transactionsTable)
            .where(sql`created_at::date between ${startOfMonth} and ${endOfMonth}`),
        ]);

        return {
          month,
          businesses: Number(bizCount[0].count),
          users: Number(userCount[0].count),
          transactions: Number(txCount[0].count),
        };
      })
    );

    // ── PLATFORM-LEVEL: Plan Distribution = ACTIVE subscriptions only,
    // grouped by plan. "Active subscriptions" per the UI label — trial /
    // expired / cancelled rows are excluded so counts match what's shown.
   const planBreakdown = await db
  .select({ plan: subscriptionsTable.plan, count: count() })
  .from(subscriptionsTable)
  .where(inArray(subscriptionsTable.status, ["active", "trial"]))
  .groupBy(subscriptionsTable.plan);

const planMap: any = { pro: 0, premium: 0 };
for (const row of planBreakdown) {
  planMap[row.plan] = Number(row.count);
}

    // Format recent signups
    const subs = await db.select().from(subscriptionsTable);
    const subMap = new Map(subs.map((s) => [Number(s.businessId), s.plan]));

    const formattedSignups = recentSignups.map((b) => ({
      id: Number(b.id),
      owner_id: Number(b.ownerId),
      business_name: b.businessName,
      business_type: b.businessType,
      gstin: b.gstin,
      address: b.addressLine1,
      logo_url: b.logoUrl,
      currency: b.currency,
      financial_year_start: b.financialYearStart,
      is_active: b.isActive,
      plan: subMap.get(Number(b.id)) ?? null,
      created_at: b.createdAt,
    }));

    // ── Revenue ──
    const now2 = new Date();
    const currentMonthStart = `${now2.getFullYear()}-${String(now2.getMonth() + 1).padStart(2, "0")}-01`;
    const prevMonthDate = new Date(now2.getFullYear(), now2.getMonth() - 1, 1);
    const prevMonthStart = prevMonthDate.toISOString().slice(0, 10);

    const [monthlyRevenueRows, currentMonthRevenueRows, previousMonthRevenueRows] = await Promise.all([
      db
        .select({
          month: sql<string>`to_char(payment_date, 'YYYY-MM')`,
          amount: sql<string>`coalesce(sum(amount), 0)`,
        })
        .from(subscriptionPaymentsTable)
        .where(eq(subscriptionPaymentsTable.status, "paid"))
        .groupBy(sql`to_char(payment_date, 'YYYY-MM')`)
        .orderBy(sql`to_char(payment_date, 'YYYY-MM')`),

      db
        .select({ total: sql<string>`coalesce(sum(amount), 0)` })
        .from(subscriptionPaymentsTable)
        .where(
          and(
            eq(subscriptionPaymentsTable.status, "paid"),
            gte(subscriptionPaymentsTable.paymentDate, currentMonthStart)
          )
        ),

      db
        .select({ total: sql<string>`coalesce(sum(amount), 0)` })
        .from(subscriptionPaymentsTable)
        .where(
          and(
            eq(subscriptionPaymentsTable.status, "paid"),
            gte(subscriptionPaymentsTable.paymentDate, prevMonthStart),
            sql`payment_date < ${currentMonthStart}`
          )
        ),
    ]);

    const currentMonthRevenue = parseFloat(currentMonthRevenueRows[0]?.total ?? "0");
    const previousMonthRevenue = parseFloat(previousMonthRevenueRows[0]?.total ?? "0");

    // ── Subscription Status Breakdown ──
    const todayStr = new Date().toISOString().slice(0, 10);
const in7 = new Date();
in7.setDate(in7.getDate() + 7);
const in7Str = in7.toISOString().slice(0, 10);

const statusBreakdown: any = { active: 0, trial: 0, expiring_soon: 0, expired: 0, cancelled: 0 };

for (const s of subs) {
  if (s.status === "cancelled") { statusBreakdown.cancelled++; continue; }
  const end = s.status === "trial" ? (s.trialEndDate ?? s.endDate) : s.endDate;

  if (end < todayStr)            statusBreakdown.expired++;
  else if (end <= in7Str)        statusBreakdown.expiring_soon++;
  else if (s.status === "trial") statusBreakdown.trial++;
  else                           statusBreakdown.active++;
}

    // ── System Alerts ──
    const [failedPaymentsCount, suspendedBusinessesCount] = await Promise.all([
      db
        .select({ count: count() })
        .from(subscriptionPaymentsTable)
        .where(eq(subscriptionPaymentsTable.status, "failed")),

      db
        .select({ count: count() })
        .from(businessesTable)
        .where(eq(businessesTable.isActive, false)),
    ]);

    const systemAlerts = {
      expiring_soon_count: statusBreakdown.expiring_soon,
      failed_payments_count: Number(failedPaymentsCount[0].count),
      suspended_businesses_count: Number(suspendedBusinessesCount[0].count),
    };

    // ── Recent Payments ──
    const recentPaymentsRaw = await db
      .select({
        id: subscriptionPaymentsTable.id,
        business_id: subscriptionPaymentsTable.businessId,
        business_name: businessesTable.businessName,
        plan: subscriptionPaymentsTable.plan,
        billing_cycle: subscriptionPaymentsTable.billingCycle,
        amount: subscriptionPaymentsTable.amount,
        payment_date: subscriptionPaymentsTable.paymentDate,
        status: subscriptionPaymentsTable.status,
      })
      .from(subscriptionPaymentsTable)
      .innerJoin(businessesTable, eq(subscriptionPaymentsTable.businessId, businessesTable.id))
      .orderBy(desc(subscriptionPaymentsTable.paymentDate))
      .limit(10);

    const recentPayments = recentPaymentsRaw.map((p) => ({
      id: Number(p.id),
      business_id: Number(p.business_id),
      business_name: p.business_name,
      plan: p.plan,
      billing_cycle: p.billing_cycle,
      amount: parseFloat(p.amount),
      payment_date: p.payment_date,
      status: p.status,
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
      monthly_revenue: monthlyRevenueRows.map((r) => ({ month: r.month, amount: parseFloat(r.amount) })),
      current_month_revenue: currentMonthRevenue,
      previous_month_revenue: previousMonthRevenue,
      subscription_status_breakdown: statusBreakdown,
      system_alerts: systemAlerts,
      recent_payments: recentPayments,
    });
  } catch (error: any) {
    // TEMPORARY DEBUGGING
    console.error("====================================");
    console.error("ADMIN ANALYTICS DATABASE ERROR");
    console.error("====================================");

    console.error("message:", error?.message);
    console.error("code:", error?.code);
    console.error("detail:", error?.detail);
    console.error("hint:", error?.hint);
    console.error("severity:", error?.severity);
    console.error("cause:", error?.cause);

    console.error("FULL ERROR:");
    console.error(error);

    console.error("====================================");

    res.status(500).json({
      error: "Admin analytics database error",
      message: error?.message ?? "Unknown database error",
      code: error?.code ?? null,
      detail: error?.detail ?? null,
    });
  }
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
  const allBiz = await db
    .select({
      b: businessesTable,
      ownerName: usersTable.name,
      ownerPhone: usersTable.phone,
    })
    .from(businessesTable)
    .leftJoin(
      usersTable,
      eq(usersTable.id, businessesTable.ownerId)
    )
    .orderBy(desc(businessesTable.createdAt));

  // Get subscription plans and counts
  const subs = await db
    .select()
    .from(subscriptionsTable);

  const subMap = new Map(
    subs.map((s) => [
      Number(s.businessId),
      s.plan,
    ])
  );

  const [customerCounts, txCounts] = await Promise.all([
    db
      .select({
        businessId: customersTable.businessId,
        count: count(),
      })
      .from(customersTable)
      .where(eq(customersTable.isDeleted, false))
      .groupBy(customersTable.businessId),

    db
      .select({
        businessId: transactionsTable.businessId,
        count: count(),
      })
      .from(transactionsTable)
      .where(eq(transactionsTable.isDeleted, false))
      .groupBy(transactionsTable.businessId),
  ]);

  const custMap = new Map(
    customerCounts.map((r) => [
      Number(r.businessId),
      Number(r.count),
    ])
  );

  const txMap = new Map(
    txCounts.map((r) => [
      Number(r.businessId),
      Number(r.count),
    ])
  );

  let data = allBiz.map((row) => ({
    id: Number(row.b.id),
    business_name: row.b.businessName,
    business_type: row.b.businessType,
    phone: row.b.phone ?? "",
    owner_name: row.ownerName ?? "",
    owner_phone: row.ownerPhone ?? "",
    plan: subMap.get(Number(row.b.id)) ?? null,
    is_active: row.b.isActive,
    customer_count:
      custMap.get(Number(row.b.id)) ?? 0,
    transaction_count:
      txMap.get(Number(row.b.id)) ?? 0,
    created_at: row.b.createdAt,
  }));

  if (search) {
    data = data.filter(
      (b) =>
        b.business_name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        b.owner_name
          .toLowerCase()
          .includes(search.toLowerCase())
    );
  }

  if (status) {
    data = data.filter((b) =>
      status === "active"
        ? b.is_active
        : !b.is_active
    );
  }

  if (plan) {
    data = data.filter((b) => b.plan === plan);
  }

  const total = data.length;

  data = data.slice(offset, offset + limit);

  res.json({
    data,
    total,
    page,
    limit,
  });
});

// PUT /admin/businesses/:id/status
router.put(
  "/admin/businesses/:id/status",
  requireAdmin,
  async (req, res): Promise<void> => {
    const raw = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const id = parseInt(raw, 10);

    const parsed =
      UpdateBusinessStatusBody.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.message,
      });
      return;
    }

    await db
      .update(businessesTable)
      .set({
        isActive: parsed.data.is_active,
      })
      .where(eq(businessesTable.id, id));

    res.json({
      message: parsed.data.is_active
        ? "Business activated"
        : "Business suspended",
    });
  }
);

// GET /admin/users
router.get(
  "/admin/users",
  requireAdmin,
  async (req, res): Promise<void> => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const search = req.query.search as string | undefined;
    const role = req.query.role as string | undefined;
    const isActive = req.query.is_active;

    // ── business filter ──────────────────────────────────────────────────
    const businessIdRaw = req.query.business_id as string | undefined;
    let userIds: (typeof usersTable.$inferSelect)["id"][] | undefined;

    if (businessIdRaw !== undefined) {
      const businessId = parseInt(businessIdRaw, 10);

      if (Number.isNaN(businessId)) {
        res.status(400).json({ error: "Invalid business_id" });
        return;
      }

      const [biz] = await db
        .select({ ownerId: businessesTable.ownerId })
        .from(businessesTable)
        .where(eq(businessesTable.id, businessId));

      if (!biz) {
        res.json({ data: [], total: 0, page, limit });
        return;
      }

      const staffRows = await db
        .select({ userId: staffBusinessMapTable.userId })
        .from(staffBusinessMapTable)
        .where(eq(staffBusinessMapTable.businessId, businessId));

      // owner + staff of THIS business only (de-duplicated)
      userIds = Array.from(
        new Set([biz.ownerId, ...staffRows.map((s) => s.userId)])
      ) as typeof userIds;

      if (!userIds || userIds.length === 0) {
        res.json({ data: [], total: 0, page, limit });
        return;
      }
    }

    let users = await db
      .select()
      .from(usersTable)
      .where(userIds ? inArray(usersTable.id, userIds) : undefined)
      .orderBy(desc(usersTable.createdAt));

    if (search) {
      const q = search.toLowerCase();
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.phone.includes(search) ||
          (u.email ?? "").toLowerCase().includes(q)
      );
    }

    if (role) {
      users = users.filter((u) => u.role === role);
    }

    if (isActive !== undefined) {
      users = users.filter((u) => u.isActive === (isActive === "true"));
    }

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

    res.json({
      data,
      total,
      page,
      limit,
    });
  }
);

// PUT /admin/users/:id/status
router.put(
  "/admin/users/:id/status",
  requireAdmin,
  async (req, res): Promise<void> => {
    const raw = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const id = parseInt(raw, 10);

    const parsed =
      UpdateUserStatusBody.safeParse(req.body);

    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.message,
      });
      return;
    }

    await db
      .update(usersTable)
      .set({
        isActive: parsed.data.is_active,
      })
      .where(eq(usersTable.id, id));

    res.json({
      message: parsed.data.is_active
        ? "User activated"
        : "User suspended",
    });
  }
);

// GET /admin/subscriptions
router.get(
  "/admin/subscriptions",
  requireAdmin,
  async (req, res): Promise<void> => {
    const page =
      parseInt(req.query.page as string) || 1;

    const limit =
      parseInt(req.query.limit as string) || 20;

    const offset = (page - 1) * limit;

    const plan =
      req.query.plan as string | undefined;

    const status =
      req.query.status as string | undefined;

    // NEW — filter by billing cycle (spec §6)
    const billingCycle =
      req.query.billing_cycle as string | undefined;

    let subs = await db
      .select({
        s: subscriptionsTable,
        businessName:
          businessesTable.businessName,
      })
      .from(subscriptionsTable)
      .leftJoin(
        businessesTable,
        eq(
          businessesTable.id,
          subscriptionsTable.businessId
        )
      )
      .orderBy(
        desc(subscriptionsTable.createdAt)
      );

    let data = subs.map((row) => ({
      id: Number(row.s.id),
      business_id: Number(row.s.businessId),
      business_name:
        row.businessName ?? "",
      plan: row.s.plan,
      billing_cycle: row.s.billingCycle,        // NEW
      amount: parseFloat(row.s.amount),         // NEW
      start_date: row.s.startDate,
      end_date: row.s.endDate,
      trial_end_date: row.s.trialEndDate,       // NEW
      status: row.s.status,
      payment_ref: row.s.paymentRef,
    }));

    if (plan) {
      data = data.filter(
        (s) => s.plan === plan
      );
    }

    if (status) {
      data = data.filter(
        (s) => s.status === status
      );
    }

    if (billingCycle) {
      data = data.filter(
        (s) => s.billing_cycle === billingCycle
      );
    }

    const total = data.length;

    res.json({
      data: data.slice(
        offset,
        offset + limit
      ),
      total,
      page,
      limit,
    });
  }
);

// PUT /admin/subscriptions/:id
// Handles: change plan, change billing cycle, cancel, reactivate.
// Whenever plan OR billing cycle changes, amount + endDate are
// recalculated from subscription_plans — never just renamed (spec §10).
router.put(
  "/admin/subscriptions/:id",
  requireAdmin,
  async (req, res): Promise<void> => {
    const raw = Array.isArray(req.params.id)
      ? req.params.id[0]
      : req.params.id;

    const id = parseInt(raw, 10);

    const parsed =
      UpdateSubscriptionBody.safeParse(req.body);

    // ⚠️ UpdateSubscriptionBody zod schema must include an optional
    // `billing_cycle` field: z.enum(["monthly","quarterly","half_yearly","yearly"]).optional()
    if (!parsed.success) {
      res.status(400).json({
        error: parsed.error.message,
      });
      return;
    }

    const [existing] = await db
      .select()
      .from(subscriptionsTable)
      .where(eq(subscriptionsTable.id, id));

    if (!existing) {
      res.status(404).json({
        error: "Subscription not found",
      });
      return;
    }

    const updates: any = {};
    if (parsed.data.status) updates.status = parsed.data.status;

    const requestedPlan = (parsed.data as any).plan;
    const requestedCycle = (parsed.data as any).billing_cycle;

    const planChanged = requestedPlan && requestedPlan !== existing.plan;
    const cycleChanged = requestedCycle && requestedCycle !== existing.billingCycle;

    if (planChanged) updates.plan = requestedPlan;
    if (cycleChanged) updates.billingCycle = requestedCycle;

    // ── Plan or billing cycle changed → recompute amount + dates ──
    if (planChanged || cycleChanged) {
      const finalPlan = updates.plan ?? existing.plan;
      const finalCycle = updates.billingCycle ?? existing.billingCycle;

      const [planConfig] = await db
        .select()
        .from(subscriptionPlansTable)
        .where(eq(subscriptionPlansTable.plan, finalPlan));

      if (!planConfig) {
        res.status(400).json({
          error: `Plan "${finalPlan}" is not configured`,
        });
        return;
      }

      updates.amount = getPriceForCycle(planConfig, finalCycle);
      updates.startDate = new Date().toISOString().split("T")[0];
      updates.endDate = calculateSubscriptionEndDate(updates.startDate, finalCycle);
    } else if (parsed.data.end_date) {
      // Manual end-date override (e.g. reactivation with a custom date)
      updates.endDate = parsed.data.end_date;
    }

    const [sub] = await db
      .update(subscriptionsTable)
      .set(updates)
      .where(eq(subscriptionsTable.id, id))
      .returning();

    if (!sub) {
      res.status(404).json({
        error: "Subscription not found",
      });
      return;
    }

    const [biz] = await db
      .select({
        businessName:
          businessesTable.businessName,
      })
      .from(businessesTable)
      .where(
        eq(
          businessesTable.id,
          Number(sub.businessId)
        )
      );

    res.json({
      id: Number(sub.id),
      business_id: Number(sub.businessId),
      business_name:
        biz?.businessName ?? "",
      plan: sub.plan,
      billing_cycle: sub.billingCycle,
      amount: parseFloat(sub.amount),
      start_date: sub.startDate,
      end_date: sub.endDate,
      status: sub.status,
      payment_ref: sub.paymentRef,
    });
  }
);

// GET /admin/audit-logs
router.get(
  "/admin/audit-logs",
  requireAdmin,
  async (req, res): Promise<void> => {
    const page =
      parseInt(req.query.page as string) || 1;

    const limit =
      parseInt(req.query.limit as string) || 50;

    const offset = (page - 1) * limit;

    const [logs, total] =
      await Promise.all([
        db
          .select({
            l: auditLogsTable,
            userName: usersTable.name,
          })
          .from(auditLogsTable)
          .leftJoin(
            usersTable,
            sql`${usersTable.id} = ${auditLogsTable.userId}`
          )
          .orderBy(
            desc(auditLogsTable.createdAt)
          )
          .limit(limit)
          .offset(offset),

        db
          .select({ count: count() })
          .from(auditLogsTable),
      ]);

    res.json({
      data: logs.map((row) => ({
        id: Number(row.l.id),
        business_id: row.l.businessId
          ? Number(row.l.businessId)
          : null,
        user_id: row.l.userId
          ? Number(row.l.userId)
          : null,
        user_name: row.userName,
        action: row.l.action,
        entity_type: row.l.entityType,
        entity_id: row.l.entityId
          ? Number(row.l.entityId)
          : null,
        old_value: row.l.oldValue,
        new_value: row.l.newValue,
        created_at: row.l.createdAt,
      })),
      total: Number(total[0].count),
      page,
      limit,
    });
  }
);

// POST /admin/broadcast
router.post("/admin/broadcast", requireAdmin, async (req, res): Promise<void> => {
  const parsed = BroadcastNotificationBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const { title, body, channel, target_plan } = parsed.data;

    const rowsDb = await db
      .select({ id: businessesTable.id })
      .from(businessesTable)
      .leftJoin(subscriptionsTable, eq(subscriptionsTable.businessId, businessesTable.id))
      .where(
        target_plan === "all"
          ? eq(businessesTable.isActive, true)
          : and(
              eq(businessesTable.isActive, true),
              eq(subscriptionsTable.plan, target_plan),
            ),
      );

    const businessIds = Array.from(new Set(rowsDb.map((r) => Number(r.id))));

    const rows = businessIds.map((businessId) => ({
      businessId,
      type: "admin_message" as const,
      title,
      message: body,
      isRead: false,
    }));

    for (let i = 0; i < rows.length; i += 500) {
      await db.insert(notificationsTable).values(rows.slice(i, i + 500));
    }

    req.log.info({ channel, target_plan, businesses: businessIds.length }, "Broadcast stored");

    res.json({
      message: `Broadcast delivered to ${businessIds.length} business(es)`,
      businesses_targeted: businessIds.length,
      notifications_created: rows.length,
    });
  } catch (error: any) {
    req.log.error(error, "Broadcast failed");
    res.status(500).json({ error: "Broadcast failed", message: error?.message });
  }
});
// GET /admin/subscription-plans
router.get(
  "/admin/subscription-plans",
  requireAdmin,
  async (req, res): Promise<void> => {
    const plans = await db.select().from(subscriptionPlansTable);

    const data = plans.map((p) => ({
      id: Number(p.id),
      plan: p.plan,
      monthly_price: parseFloat(p.monthlyPrice),
      quarterly_price: parseFloat(p.quarterlyPrice),
      half_yearly_price: parseFloat(p.halfYearlyPrice),
      yearly_price: parseFloat(p.yearlyPrice),
      trial_days: p.trialDays,
      max_users: p.maxUsers,
      max_branches: p.maxBranches,
      max_products: p.maxProducts,
      max_customers: p.maxCustomers,
      max_vendors: p.maxVendors,
      max_orders: p.maxOrders,
      features: p.features ?? {},
      is_active: p.isActive,
      created_at: p.createdAt,
      updated_at: p.updatedAt,
    }));

    res.json({ data });
  }
);

// POST /admin/subscription-plans
router.post(
  "/admin/subscription-plans",
  requireAdmin,
  async (req, res): Promise<void> => {
    const { plan, monthly_price, quarterly_price, half_yearly_price, yearly_price } = req.body;

    if (!plan || monthly_price == null || quarterly_price == null || half_yearly_price == null || yearly_price == null) {
      res.status(400).json({ error: "plan, monthly_price, quarterly_price, half_yearly_price, yearly_price are required" });
      return;
    }

    const [existing] = await db
      .select()
      .from(subscriptionPlansTable)
      .where(eq(subscriptionPlansTable.plan, plan));

    if (existing) {
      res.status(409).json({ error: `Plan "${plan}" already exists` });
      return;
    }

    const [created] = await db
      .insert(subscriptionPlansTable)
      .values({
        plan,
        monthlyPrice: String(monthly_price),
        quarterlyPrice: String(quarterly_price),
        halfYearlyPrice: String(half_yearly_price),
        yearlyPrice: String(yearly_price),
        trialDays: req.body.trial_days ?? 15,
        maxUsers: req.body.max_users ?? -1,
        maxBranches: req.body.max_branches ?? -1,
        maxProducts: req.body.max_products ?? -1,
        maxCustomers: req.body.max_customers ?? -1,
        maxVendors: req.body.max_vendors ?? -1,
        maxOrders: req.body.max_orders ?? -1,
        features: req.body.features ?? {},
        isActive: req.body.is_active ?? true,
      })
      .returning();

    res.status(201).json({
      id: Number(created.id),
      plan: created.plan,
      monthly_price: parseFloat(created.monthlyPrice),
      quarterly_price: parseFloat(created.quarterlyPrice),
      half_yearly_price: parseFloat(created.halfYearlyPrice),
      yearly_price: parseFloat(created.yearlyPrice),
      trial_days: created.trialDays,
      max_users: created.maxUsers,
      max_branches: created.maxBranches,
      max_products: created.maxProducts,
      max_customers: created.maxCustomers,
      max_vendors: created.maxVendors,
      max_orders: created.maxOrders,
      features: created.features ?? {},
      is_active: created.isActive,
      created_at: created.createdAt,
      updated_at: created.updatedAt,
    });
  }
);

// GET /admin/subscription-plans/:id
router.get(
  "/admin/subscription-plans/:id",
  requireAdmin,
  async (req, res): Promise<void> => {
    const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(raw, 10);
    const [p] = await db.select().from(subscriptionPlansTable).where(eq(subscriptionPlansTable.id, id));

    if (!p) {
      res.status(404).json({ error: "Plan not found" });
      return;
    }

    res.json({
      id: Number(p.id),
      plan: p.plan,
      monthly_price: parseFloat(p.monthlyPrice),
      quarterly_price: parseFloat(p.quarterlyPrice),
      half_yearly_price: parseFloat(p.halfYearlyPrice),
      yearly_price: parseFloat(p.yearlyPrice),
      trial_days: p.trialDays,
      max_users: p.maxUsers,
      max_branches: p.maxBranches,
      max_products: p.maxProducts,
      max_customers: p.maxCustomers,
      max_vendors: p.maxVendors,
      max_orders: p.maxOrders,
      features: p.features ?? {},
      is_active: p.isActive,
      created_at: p.createdAt,
      updated_at: p.updatedAt,
    });
  }
);

// PUT /admin/subscription-plans/:id
router.put(
  "/admin/subscription-plans/:id",
  requireAdmin,
  async (req, res): Promise<void> => {
    const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(raw, 10);
    const body = req.body;

    const updates: any = {};
    if (body.monthly_price != null) updates.monthlyPrice = String(body.monthly_price);
    if (body.quarterly_price != null) updates.quarterlyPrice = String(body.quarterly_price);
    if (body.half_yearly_price != null) updates.halfYearlyPrice = String(body.half_yearly_price);
    if (body.yearly_price != null) updates.yearlyPrice = String(body.yearly_price);
    if (body.trial_days != null) updates.trialDays = body.trial_days;
    if (body.max_users != null) updates.maxUsers = body.max_users;
    if (body.max_branches != null) updates.maxBranches = body.max_branches;
    if (body.max_products != null) updates.maxProducts = body.max_products;
    if (body.max_customers != null) updates.maxCustomers = body.max_customers;
    if (body.max_vendors != null) updates.maxVendors = body.max_vendors;
    if (body.max_orders != null) updates.maxOrders = body.max_orders;
    if (body.features != null) updates.features = body.features;
    if (body.is_active != null) updates.isActive = body.is_active;
    updates.updatedAt = new Date();

    const [updated] = await db
      .update(subscriptionPlansTable)
      .set(updates)
      .where(eq(subscriptionPlansTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Plan not found" });
      return;
    }

    res.json({
      id: Number(updated.id),
      plan: updated.plan,
      monthly_price: parseFloat(updated.monthlyPrice),
      quarterly_price: parseFloat(updated.quarterlyPrice),
      half_yearly_price: parseFloat(updated.halfYearlyPrice),
      yearly_price: parseFloat(updated.yearlyPrice),
      trial_days: updated.trialDays,
      max_users: updated.maxUsers,
      max_branches: updated.maxBranches,
      max_products: updated.maxProducts,
      max_customers: updated.maxCustomers,
      max_vendors: updated.maxVendors,
      max_orders: updated.maxOrders,
      features: updated.features ?? {},
      is_active: updated.isActive,
      created_at: updated.createdAt,
      updated_at: updated.updatedAt,
    });
  }
);

// PATCH /admin/subscription-plans/:id/status
router.patch(
  "/admin/subscription-plans/:id/status",
  requireAdmin,
  async (req, res): Promise<void> => {
    const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const id = parseInt(raw, 10);
    const { is_active } = req.body;

    if (is_active == null) {
      res.status(400).json({ error: "is_active is required" });
      return;
    }

    const [updated] = await db
      .update(subscriptionPlansTable)
      .set({ isActive: is_active, updatedAt: new Date() })
      .where(eq(subscriptionPlansTable.id, id))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "Plan not found" });
      return;
    }

    res.json({
      id: Number(updated.id),
      plan: updated.plan,
      monthly_price: parseFloat(updated.monthlyPrice),
      quarterly_price: parseFloat(updated.quarterlyPrice),
      half_yearly_price: parseFloat(updated.halfYearlyPrice),
      yearly_price: parseFloat(updated.yearlyPrice),
      trial_days: updated.trialDays,
      max_users: updated.maxUsers,
      max_branches: updated.maxBranches,
      max_products: updated.maxProducts,
      max_customers: updated.maxCustomers,
      max_vendors: updated.maxVendors,
      max_orders: updated.maxOrders,
      features: updated.features ?? {},
      is_active: updated.isActive,
      created_at: updated.createdAt,
      updated_at: updated.updatedAt,
    });
  }
);
export default router;