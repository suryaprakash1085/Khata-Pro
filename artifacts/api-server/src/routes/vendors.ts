import { Router, type IRouter } from "express";
import { db, vendorsTable } from "@workspace/db";
import { eq, and, or, ilike, count, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import {
  CreateVendorBody,
  UpdateVendorBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function formatVendor(v: any) {
  return {
    id: Number(v.id),
    business_id: Number(v.businessId),
    name: v.name,
    phone: v.phone,
    email: v.email,
    address: v.address,
    gst_number: v.gstNumber,
    created_at: v.createdAt,
  };
}

// GET /vendors
router.get("/vendors", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = (page - 1) * limit;
  const search = req.query.search as string | undefined;

  const conditions: any[] = [eq(vendorsTable.businessId, businessId), eq(vendorsTable.isDeleted, false)];
  if (search) {
    conditions.push(
      or(ilike(vendorsTable.name, `%${search}%`), ilike(vendorsTable.phone, `%${search}%`)),
    );
  }

  const [vendors, totalResult] = await Promise.all([
    db.select().from(vendorsTable).where(and(...conditions)).limit(limit).offset(offset).orderBy(desc(vendorsTable.createdAt)),
    db.select({ count: count() }).from(vendorsTable).where(and(...conditions)),
  ]);

  res.json({
    data: vendors.map(formatVendor),
    total: Number(totalResult[0].count),
    page,
    limit,
  });
});

// POST /vendors
router.post("/vendors", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateVendorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;
  const [vendor] = await db.insert(vendorsTable).values({
    businessId: d.business_id,
    name: d.name,
    phone: d.phone,
    email: d.email,
    address: d.address,
    gstNumber: d.gst_number,
  }).returning();
  res.status(201).json(formatVendor(vendor));
});

// GET /vendors/:id
router.get("/vendors/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [vendor] = await db.select().from(vendorsTable)
    .where(and(eq(vendorsTable.id, id), eq(vendorsTable.isDeleted, false)));
  if (!vendor) {
    res.status(404).json({ error: "Vendor not found" });
    return;
  }
  res.json(formatVendor(vendor));
});

// PUT /vendors/:id
router.put("/vendors/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const parsed = UpdateVendorBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;
  const updates: any = {};
  if (d.name !== undefined) updates.name = d.name;
  if (d.phone !== undefined) updates.phone = d.phone;
  if (d.email !== undefined) updates.email = d.email;
  if (d.address !== undefined) updates.address = d.address;
  if (d.gst_number !== undefined) updates.gstNumber = d.gst_number;

  const [vendor] = await db.update(vendorsTable).set(updates)
    .where(and(eq(vendorsTable.id, id), eq(vendorsTable.isDeleted, false))).returning();
  if (!vendor) {
    res.status(404).json({ error: "Vendor not found" });
    return;
  }
  res.json(formatVendor(vendor));
});

// DELETE /vendors/:id
router.delete("/vendors/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [vendor] = await db.update(vendorsTable).set({ isDeleted: true })
    .where(eq(vendorsTable.id, id)).returning();
  if (!vendor) {
    res.status(404).json({ error: "Vendor not found" });
    return;
  }
  res.json({ message: "Vendor deleted" });
});

export default router;
