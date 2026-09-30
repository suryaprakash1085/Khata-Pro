import { Router, type IRouter } from "express";
import crypto from "crypto";
import Razorpay from "razorpay";
import { db, subscriptionPlansTable, subscriptionsTable, businessesTable, staffBusinessMapTable, subscriptionPaymentsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, AuthPayload } from "../middlewares/auth";
import { calculateSubscriptionEndDate, getPriceForCycle } from "../services/subscription-billing.service";
import { createRenewalSuccessNotification } from "../services/subscriptionNotifications.service";
const router: IRouter = Router();

// ── Razorpay client ──
// Keys come from env. Never hardcode these.
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

// ── Formatter — converts Drizzle's camelCase columns to the
// snake_case shape defined in openapi.yaml's SubscriptionPlan schema.
// Without this, the frontend's `p.is_active`, `p.trial_days`, etc.
// all read as `undefined` because the raw DB row uses `isActive`,
// `trialDays` instead. ──
function formatSubscriptionPlan(p: any) {
  return {
    id: Number(p.id),
    plan: p.plan,
    monthly_price: parseFloat(p.monthlyPrice),
    quarterly_price: parseFloat(p.quarterlyPrice),
    half_yearly_price: parseFloat(p.halfYearlyPrice),
    yearly_price: parseFloat(p.yearlyPrice),
    trial_days: Number(p.trialDays),
    max_users: Number(p.maxUsers),
    max_branches: Number(p.maxBranches),
    max_products: Number(p.maxProducts),
    max_customers: Number(p.maxCustomers),
    max_vendors: Number(p.maxVendors),
    max_orders: Number(p.maxOrders),
    features: p.features ?? {},
    is_active: p.isActive,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  };
}

function formatSubscription(s: any, businessName?: string) {
  return {
    id: Number(s.id),
    business_id: Number(s.businessId),
    business_name: businessName,
    plan: s.plan,
    billing_cycle: s.billingCycle,
    amount: parseFloat(s.amount),
    start_date: s.startDate,
    end_date: s.endDate,
    trial_end_date: s.trialEndDate ?? null,
    status: s.status,
    payment_ref: s.paymentRef ?? null,
  };
}

// Shared helper — finds the business for the logged-in user (owner or staff).
async function findBusinessForUser(userId: number) {
  let [biz] = await db.select().from(businessesTable).where(eq(businessesTable.ownerId, userId));
  if (!biz) {
    const [staffLink] = await db.select().from(staffBusinessMapTable).where(eq(staffBusinessMapTable.userId, userId));
    if (staffLink) {
      [biz] = await db.select().from(businessesTable).where(eq(businessesTable.id, staffLink.businessId));
    }
  }
  return biz;
}

// Shared helper — creates or updates the subscriptions row and marks it active.
// plan/billingCycle are typed loosely here (`any`) because they originate as
// plain strings from req.body — callers validate against the real Plan /
// BillingCycle enums before calling this (via the DB lookups above).
async function activateSubscription(businessId: number, plan: any, billingCycle: any, amount: number, paymentRef?: string) {
  const startDate = new Date().toISOString().split("T")[0];
  const endDate = calculateSubscriptionEndDate(startDate, billingCycle);

  const [existing] = await db.select().from(subscriptionsTable).where(eq(subscriptionsTable.businessId, businessId));

  const values: any = { plan, billingCycle, amount, startDate, endDate, status: "active" };
  if (paymentRef) values.paymentRef = paymentRef;

  const [sub] = existing
    ? await db.update(subscriptionsTable).set(values).where(eq(subscriptionsTable.id, existing.id)).returning()
    : await db.insert(subscriptionsTable).values({ businessId, ...values }).returning();

  return sub;
}

// GET /subscription-plans — business-facing, active plans only, no admin auth
router.get("/subscription-plans", async (req, res): Promise<void> => {
  const plans = await db.select().from(subscriptionPlansTable).where(eq(subscriptionPlansTable.isActive, true));
  res.json({ data: plans.map(formatSubscriptionPlan) });
});

// GET /subscriptions/me — works for owner AND staff (per spec §10)
router.get("/subscriptions/me", requireAuth, async (req, res): Promise<void> => {
  const { userId } = (req as any).user as AuthPayload;

  const biz = await findBusinessForUser(userId);

  if (!biz) {
    res.status(404).json({ error: "No business found for this user" });
    return;
  }

  const [sub] = await db.select().from(subscriptionsTable).where(eq(subscriptionsTable.businessId, Number(biz.id)));
  const [planConfig] = sub
    ? await db.select().from(subscriptionPlansTable).where(eq(subscriptionPlansTable.plan, sub.plan))
    : [];

  res.json({
    subscription: sub ? formatSubscription(sub, biz.businessName) : null,
    plan: planConfig ? formatSubscriptionPlan(planConfig) : null,
    business: {
      id: Number(biz.id),
      owner_id: Number(biz.ownerId),
      business_name: biz.businessName,
      business_type: biz.businessType,
      gstin: biz.gstin,
      description: biz.description,
      phone: biz.phone,
      email: biz.email,
      address_line1: biz.addressLine1,
      address_line2: biz.addressLine2,
      city: biz.city,
      state: biz.state,
      postal_code: biz.postalCode,
      country: biz.country,
      latitude: biz.latitude !== null && biz.latitude !== undefined ? parseFloat(biz.latitude) : null,
      longitude: biz.longitude !== null && biz.longitude !== undefined ? parseFloat(biz.longitude) : null,
      logo_url: biz.logoUrl,
      currency: biz.currency,
      financial_year_start: biz.financialYearStart,
      is_active: biz.isActive,
      created_at: biz.createdAt,
    },
  });
});

// POST /subscriptions/renew — direct activate, no payment (kept for admin/manual use)
router.post("/subscriptions/renew", requireAuth, async (req, res): Promise<void> => {
  const { userId } = (req as any).user as AuthPayload;
  const { plan, billing_cycle } = req.body;

  const [biz] = await db.select().from(businessesTable).where(eq(businessesTable.ownerId, userId));
  if (!biz) { res.status(404).json({ error: "No business found" }); return; }

  const [planConfig] = await db.select().from(subscriptionPlansTable).where(eq(subscriptionPlansTable.plan, plan));
  if (!planConfig) { res.status(400).json({ error: `Plan "${plan}" not configured` }); return; }

  const amount = Number(getPriceForCycle(planConfig, billing_cycle as any));
  const sub = await activateSubscription(Number(biz.id), plan, billing_cycle, amount);


  res.json({ message: "Subscription renewed", subscription: formatSubscription(sub, biz.businessName) });
});

// POST /subscriptions/create-order — creates a Razorpay order for a plan + billing cycle
router.post("/subscriptions/create-order", requireAuth, async (req, res): Promise<void> => {
  const { userId } = (req as any).user as AuthPayload;
  const { plan, billing_cycle } = req.body;

  if (!plan || !billing_cycle) {
    res.status(400).json({ error: "plan and billing_cycle are required" });
    return;
  }

  const biz = await findBusinessForUser(userId);
  if (!biz) { res.status(404).json({ error: "No business found" }); return; }

  const [planConfig] = await db.select().from(subscriptionPlansTable).where(eq(subscriptionPlansTable.plan, plan));
  if (!planConfig) { res.status(400).json({ error: `Plan "${plan}" not configured` }); return; }

  const amount = Number(getPriceForCycle(planConfig, billing_cycle as any));
  if (!amount || amount <= 0) {
    res.status(400).json({ error: `No price configured for "${plan}" / "${billing_cycle}"` });
    return;
  }

  try {
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // paise
      currency: "INR",
      receipt: `sub_${biz.id}_${Date.now()}`,
      notes: { business_id: String(biz.id), plan, billing_cycle },
    });

    res.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err: any) {
    console.error("Razorpay order creation failed:", err);
    res.status(502).json({ error: "Could not create payment order" });
  }
});

// POST /subscriptions/verify-payment — verifies Razorpay signature, then activates the plan
router.post("/subscriptions/verify-payment", requireAuth, async (req, res): Promise<void> => {
  const { userId } = (req as any).user as AuthPayload;
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    plan,
    billing_cycle,
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan || !billing_cycle) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET as string)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (expectedSignature !== razorpay_signature) {
    res.status(400).json({ error: "Payment verification failed — signature mismatch" });
    return;
  }

  const biz = await findBusinessForUser(userId);
  if (!biz) { res.status(404).json({ error: "No business found" }); return; }

  const [planConfig] = await db.select().from(subscriptionPlansTable).where(eq(subscriptionPlansTable.plan, plan));
  if (!planConfig) { res.status(400).json({ error: `Plan "${plan}" not configured` }); return; }

  const amount = Number(getPriceForCycle(planConfig, billing_cycle as any));
  const sub = await activateSubscription(Number(biz.id), plan, billing_cycle, amount, razorpay_payment_id);
 

  try {
    await createRenewalSuccessNotification({
      businessId: Number(biz.id),
      subscriptionId: Number(sub.id),
      plan,
      billingCycle: billing_cycle,
      endDate: sub.endDate,
      paymentRef: razorpay_payment_id,
    });
  } catch (err: any) {
    console.error("subscription_renewal_success notification failed:", err?.message ?? err);
  }
  // ── Log this payment for revenue reporting (spec §10) ──
  // Wrapped in try/catch: if this insert fails for any reason, the
  // subscription is already activated above — we must NOT fail the
  // whole request over a reporting-table issue. We just log it loudly
  // so it can be fixed without blocking the customer.
  try {
    await db.insert(subscriptionPaymentsTable).values({
      businessId: Number(biz.id),
      subscriptionId: Number(sub.id),
      plan,
      billingCycle: billing_cycle,
      amount: String(amount),
      paymentDate: new Date().toISOString().split("T")[0],
      status: "paid",
      paymentRef: razorpay_payment_id,
    });
  } catch (err: any) {
    console.error("====================================");
    console.error("SUBSCRIPTION_PAYMENTS INSERT FAILED");
    console.error("====================================");
    console.error("message:", err?.message);
    console.error("code:", err?.code);
    console.error("detail:", err?.detail);
    console.error("constraint:", err?.constraint);
    console.error("hint:", err?.hint);
    console.error("cause:", err?.cause);
    console.error(err);
    console.error("====================================");
  }

  res.json({ message: "Payment verified, subscription activated", subscription: formatSubscription(sub, biz.businessName) });
});

export default router;