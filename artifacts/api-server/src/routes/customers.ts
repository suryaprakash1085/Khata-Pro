import { Router, type IRouter } from "express";
import { db, customersTable } from "@workspace/db";
import { eq, and, or, ilike, count, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import {
  CreateCustomerBody,
  UpdateCustomerBody,
  GetCustomerParams,
  UpdateCustomerParams,
  DeleteCustomerParams,
} from "@workspace/api-zod";
import { requireCustomerAuth } from "../middlewares/customerAuth";

const router: IRouter = Router();

function formatCustomer(c: any) {
  return {
    id: Number(c.id),
    business_id: Number(c.businessId),
    name: c.name,
    phone: c.phone,
    email: c.email,
    address: c.address,
    opening_balance: parseFloat(c.openingBalance ?? "0"),
    opening_balance_type: c.openingBalanceType,
    current_balance: parseFloat(c.currentBalance ?? "0"),
    category: c.category,
    profile_image: c.profileImage,
    created_at: c.createdAt,
  };
}

// GET /customers
router.get("/customers", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = (page - 1) * limit;
  const search = req.query.search as string | undefined;
  const category = req.query.category as string | undefined;

  const conditions: any[] = [eq(customersTable.businessId, businessId), eq(customersTable.isDeleted, false)];
  if (search) {
  conditions.push(
    or(
      ilike(customersTable.name, `%${search}%`),
      ilike(customersTable.phone, `%${search}%`),
    ),
  );
}
  if (category) conditions.push(eq(customersTable.category, category as any));

  const [customers, totalResult] = await Promise.all([
    db.select().from(customersTable).where(and(...conditions)).limit(limit).offset(offset).orderBy(desc(customersTable.createdAt)),
    db.select({ count: count() }).from(customersTable).where(and(...conditions)),
  ]);

  res.json({
    data: customers.map(formatCustomer),
    total: Number(totalResult[0].count),
    page,
    limit,
  });
});

// POST /customers
router.post("/customers", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateCustomerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;
  const [customer] = await db.insert(customersTable).values({
    businessId: d.business_id,
    name: d.name,
    phone: d.phone,
    email: d.email,
    address: d.address,
    openingBalance: d.opening_balance?.toString() ?? "0",
    openingBalanceType: (d.opening_balance_type ?? "credit") as any,
    currentBalance: d.opening_balance?.toString() ?? "0",
    category: (d.category ?? "customer") as any,
  }).returning();
  res.status(201).json(formatCustomer(customer));
});

// GET /customers/:id
router.get("/customers/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [customer] = await db.select().from(customersTable)
    .where(and(eq(customersTable.id, id), eq(customersTable.isDeleted, false)));
  if (!customer) {
    res.status(404).json({ error: "Customer not found" });
    return;
  }
  res.json(formatCustomer(customer));
});

// PUT /customers/:id
router.put("/customers/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const parsed = UpdateCustomerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const updates: any = {};
  if (parsed.data.name) updates.name = parsed.data.name;
  if (parsed.data.phone) updates.phone = parsed.data.phone;
  if (parsed.data.email !== undefined) updates.email = parsed.data.email;
  if (parsed.data.address !== undefined) updates.address = parsed.data.address;
  if (parsed.data.category) updates.category = parsed.data.category;

  const [customer] = await db.update(customersTable).set(updates)
    .where(and(eq(customersTable.id, id), eq(customersTable.isDeleted, false))).returning();
  if (!customer) {
    res.status(404).json({ error: "Customer not found" });
    return;
  }
  res.json(formatCustomer(customer));
});

// DELETE /customers/:id
router.delete("/customers/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [customer] = await db.update(customersTable).set({ isDeleted: true })
    .where(eq(customersTable.id, id)).returning();
  if (!customer) {
    res.status(404).json({ error: "Customer not found" });
    return;
  }
  res.json({ message: "Customer deleted" });
});

// PUT /customers/me/push-token  (customer app calls this after login/permission grant)
router.put("/customers/me/push-token", requireCustomerAuth, async (req, res): Promise<void> => {
  const { customerId } = (req as any).customer;
  const { push_token } = req.body;
  if (!push_token || typeof push_token !== "string") {
    res.status(400).json({ error: "push_token is required" });
    return;
  }
  await db.update(customersTable).set({ pushToken: push_token }).where(eq(customersTable.id, customerId));
  res.json({ success: true });
});

export default router;
