import { Router, type IRouter } from "express";
import { db, driversTable } from "@workspace/db";
import { eq, and, or, ilike, count, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { CreateDriverBody, UpdateDriverBody } from "@workspace/api-zod";

const router: IRouter = Router();

function formatDriver(d: any) {
  return {
    id: Number(d.id),
    business_id: Number(d.businessId),
    name: d.name,
    phone: d.phone,
    vehicle_number: d.vehicleNumber,
    vehicle_type: d.vehicleType,
    status: d.status,
    last_lat: d.lastLat,
    last_lng: d.lastLng,
    created_at: d.createdAt,
  };
}

// GET /drivers
router.get("/drivers", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const offset = (page - 1) * limit;
  const search = req.query.search as string | undefined;
  const status = req.query.status as string | undefined;

  const conditions: any[] = [eq(driversTable.businessId, businessId), eq(driversTable.isDeleted, false)];
  if (search) {
    conditions.push(or(ilike(driversTable.name, `%${search}%`), ilike(driversTable.phone, `%${search}%`)));
  }
  if (status) conditions.push(eq(driversTable.status, status as any));

  const [drivers, totalResult] = await Promise.all([
    db.select().from(driversTable).where(and(...conditions)).limit(limit).offset(offset).orderBy(desc(driversTable.createdAt)),
    db.select({ count: count() }).from(driversTable).where(and(...conditions)),
  ]);

  res.json({
    data: drivers.map(formatDriver),
    total: Number(totalResult[0].count),
    page,
    limit,
  });
});

// POST /drivers
router.post("/drivers", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateDriverBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;
  const [driver] = await db.insert(driversTable).values({
    businessId: d.business_id,
    name: d.name,
    phone: d.phone,
    vehicleNumber: d.vehicle_number,
    vehicleType: (d.vehicle_type ?? "bike") as any,
    status: (d.status ?? "offline") as any,
  }).returning();
  res.status(201).json(formatDriver(driver));
});

// GET /drivers/:id
router.get("/drivers/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [driver] = await db.select().from(driversTable)
    .where(and(eq(driversTable.id, id), eq(driversTable.isDeleted, false)));
  if (!driver) {
    res.status(404).json({ error: "Driver not found" });
    return;
  }
  res.json(formatDriver(driver));
});

// PUT /drivers/:id
router.put("/drivers/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const parsed = UpdateDriverBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;
  const updates: any = {};
  if (d.name !== undefined) updates.name = d.name;
  if (d.phone !== undefined) updates.phone = d.phone;
  if (d.vehicle_number !== undefined) updates.vehicleNumber = d.vehicle_number;
  if (d.vehicle_type !== undefined) updates.vehicleType = d.vehicle_type;
  if (d.status !== undefined) updates.status = d.status;
  if (d.last_lat !== undefined) updates.lastLat = d.last_lat;
  if (d.last_lng !== undefined) updates.lastLng = d.last_lng;

  const [driver] = await db.update(driversTable).set(updates)
    .where(and(eq(driversTable.id, id), eq(driversTable.isDeleted, false))).returning();
  if (!driver) {
    res.status(404).json({ error: "Driver not found" });
    return;
  }
  res.json(formatDriver(driver));
});

// DELETE /drivers/:id
router.delete("/drivers/:id", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  const [driver] = await db.update(driversTable).set({ isDeleted: true })
    .where(eq(driversTable.id, id)).returning();
  if (!driver) {
    res.status(404).json({ error: "Driver not found" });
    return;
  }
  res.json({ message: "Driver deleted" });
});

export default router;