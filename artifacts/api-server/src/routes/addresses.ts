import { Router, type IRouter } from "express";
import { db, customerAddressesTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireCustomerAuth } from "../middlewares/customerAuth";
import { z } from "zod/v4";

const router: IRouter = Router();

function formatAddress(a: any) {
  return {
    id: String(a.id),
    customer_id: Number(a.customerId),
    type: a.label,
    address: a.addressLine,
    city: a.city ?? "",
    state: a.state ?? "",
    pincode: a.pincode ?? "",
    landmark: a.landmark ?? "",
    phone: a.phone ?? "",
    latitude: a.latitude !== null && a.latitude !== undefined ? parseFloat(a.latitude) : undefined,
    longitude: a.longitude !== null && a.longitude !== undefined ? parseFloat(a.longitude) : undefined,
    isDefault: a.isDefault,
    created_at: a.createdAt,
  };
}

function parseId(raw: unknown): number | null {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const id = parseInt(value as string, 10);
  return Number.isInteger(id) ? id : null;
}

const AddressBody = z.object({
  type: z.enum(["Home", "Work", "Other"]).default("Home"),
  address: z.string().min(1).max(500),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  pincode: z.string().max(10).optional(),
  landmark: z.string().max(255).optional(),
  phone: z.string().max(20).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  isDefault: z.boolean().optional().default(false),
});
const UpdateAddressBody = AddressBody.partial();

// GET /addresses — customer's own addresses only
router.get("/addresses", requireCustomerAuth, async (req, res): Promise<void> => {
  const { customerId } = (req as any).customer;

  const rows = await db
    .select()
    .from(customerAddressesTable)
    .where(eq(customerAddressesTable.customerId, customerId))
    .orderBy(desc(customerAddressesTable.isDefault), desc(customerAddressesTable.createdAt));

  res.json({ data: rows.map(formatAddress) });
});

// POST /addresses — always attaches customerId from the token, never from the body
router.post("/addresses", requireCustomerAuth, async (req, res): Promise<void> => {
  const { customerId } = (req as any).customer;
  const parsed = AddressBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;

  const existing = await db
    .select({ id: customerAddressesTable.id })
    .from(customerAddressesTable)
    .where(eq(customerAddressesTable.customerId, customerId));

  // First address for this customer is always the default, regardless of what was sent
  const makeDefault = existing.length === 0 || d.isDefault === true;

  const insertRow = async () => {
    const [row] = await db.insert(customerAddressesTable).values({
      customerId,
      label: d.type,
      addressLine: d.address,
      city: d.city,
      state: d.state,
      pincode: d.pincode,
      landmark: d.landmark,
      phone: d.phone,
      latitude: d.latitude !== undefined ? d.latitude.toString() : null,
      longitude: d.longitude !== undefined ? d.longitude.toString() : null,
      isDefault: makeDefault,
    }).returning();
    return row;
  };

  let row;
  if (makeDefault && existing.length > 0) {
    row = await db.transaction(async (tx) => {
      await tx.update(customerAddressesTable)
        .set({ isDefault: false })
        .where(eq(customerAddressesTable.customerId, customerId));
      const [r] = await tx.insert(customerAddressesTable).values({
        customerId,
        label: d.type,
        addressLine: d.address,
        city: d.city,
        state: d.state,
        pincode: d.pincode,
        landmark: d.landmark,
        phone: d.phone,
        latitude: d.latitude !== undefined ? d.latitude.toString() : null,
        longitude: d.longitude !== undefined ? d.longitude.toString() : null,
        isDefault: true,
      }).returning();
      return r;
    });
  } else {
    row = await insertRow();
  }

  res.status(201).json(formatAddress(row));
});

// PUT /addresses/:id — ownership verified before any write
router.put("/addresses/:id", requireCustomerAuth, async (req, res): Promise<void> => {
  const { customerId } = (req as any).customer;
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid address id" });
    return;
  }

  const [existing] = await db
    .select()
    .from(customerAddressesTable)
    .where(and(eq(customerAddressesTable.id, id), eq(customerAddressesTable.customerId, customerId)));

  if (!existing) {
    // Same 404 whether it doesn't exist or belongs to another customer —
    // never confirm/deny that an address id belongs to someone else.
    res.status(404).json({ error: "Address not found" });
    return;
  }

  const parsed = UpdateAddressBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;

  const updates: any = {};
  if (d.type !== undefined) updates.label = d.type;
  if (d.address !== undefined) updates.addressLine = d.address;
  if (d.city !== undefined) updates.city = d.city;
  if (d.state !== undefined) updates.state = d.state;
  if (d.pincode !== undefined) updates.pincode = d.pincode;
  if (d.landmark !== undefined) updates.landmark = d.landmark;
  if (d.phone !== undefined) updates.phone = d.phone;
  if (d.latitude !== undefined) updates.latitude = d.latitude.toString();
  if (d.longitude !== undefined) updates.longitude = d.longitude.toString();

  let row;
  if (d.isDefault === true) {
    row = await db.transaction(async (tx) => {
      await tx.update(customerAddressesTable)
        .set({ isDefault: false })
        .where(eq(customerAddressesTable.customerId, customerId));
      const [r] = await tx.update(customerAddressesTable)
        .set({ ...updates, isDefault: true })
        .where(eq(customerAddressesTable.id, id))
        .returning();
      return r;
    });
  } else {
    [row] = await db.update(customerAddressesTable)
      .set(updates)
      .where(eq(customerAddressesTable.id, id))
      .returning();
  }

  res.json(formatAddress(row));
});

// PUT /addresses/:id/default — dedicated endpoint, matches Set Default Address UX
router.put("/addresses/:id/default", requireCustomerAuth, async (req, res): Promise<void> => {
  const { customerId } = (req as any).customer;
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid address id" });
    return;
  }

  const [existing] = await db
    .select({ id: customerAddressesTable.id })
    .from(customerAddressesTable)
    .where(and(eq(customerAddressesTable.id, id), eq(customerAddressesTable.customerId, customerId)));

  if (!existing) {
    res.status(404).json({ error: "Address not found" });
    return;
  }

  const row = await db.transaction(async (tx) => {
    await tx.update(customerAddressesTable)
      .set({ isDefault: false })
      .where(eq(customerAddressesTable.customerId, customerId));
    const [r] = await tx.update(customerAddressesTable)
      .set({ isDefault: true })
      .where(eq(customerAddressesTable.id, id))
      .returning();
    return r;
  });

  res.json(formatAddress(row));
});

// DELETE /addresses/:id — ownership verified; promotes another address to
// default if the deleted one was the default and others remain.
router.delete("/addresses/:id", requireCustomerAuth, async (req, res): Promise<void> => {
  const { customerId } = (req as any).customer;
  const id = parseId(req.params.id);
  if (id === null) {
    res.status(400).json({ error: "Invalid address id" });
    return;
  }

  const [existing] = await db
    .select()
    .from(customerAddressesTable)
    .where(and(eq(customerAddressesTable.id, id), eq(customerAddressesTable.customerId, customerId)));

  if (!existing) {
    res.status(404).json({ error: "Address not found" });
    return;
  }

  await db.delete(customerAddressesTable).where(eq(customerAddressesTable.id, id));

  if (existing.isDefault) {
    const [next] = await db
      .select({ id: customerAddressesTable.id })
      .from(customerAddressesTable)
      .where(eq(customerAddressesTable.customerId, customerId))
      .orderBy(desc(customerAddressesTable.createdAt))
      .limit(1);
    if (next) {
      await db.update(customerAddressesTable)
        .set({ isDefault: true })
        .where(eq(customerAddressesTable.id, next.id));
    }
  }

  res.json({ message: "Address deleted" });
});

export default router;