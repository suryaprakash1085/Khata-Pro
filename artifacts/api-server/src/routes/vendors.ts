import { Router, type IRouter } from "express";
import { db, vendorsTable } from "@workspace/db";
import { eq, and, or, ne, ilike, count, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import {
  CreateVendorBody,
  UpdateVendorBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

const GSTIN_RE = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const PINCODE_RE = /^[1-9][0-9]{5}$/;

function formatVendor(v: any) {
  return {
    id: Number(v.id),
    business_id: Number(v.businessId),
    name: v.name,
    company_name: v.companyName,
    phone: v.phone,
    alternate_phone: v.alternatePhone,
    email: v.email,
    address: v.address,
    city: v.city,
    state: v.state,
    pincode: v.pincode,
    gst_number: v.gstNumber,
    pan_number: v.panNumber,
    opening_balance: Number(v.openingBalance ?? 0),
    opening_balance_type: v.openingBalanceType ?? "payable",
    payment_terms_days: Number(v.paymentTermsDays ?? 0),
    created_at: v.createdAt,
  };
}

// "" / "  " -> null, undefined stays undefined (= field not sent)
function clean(val: string | null | undefined, upper = false): string | null | undefined {
  if (val === undefined) return undefined;
  if (val === null) return null;
  const t = val.trim();
  if (!t) return null;
  return upper ? t.toUpperCase() : t;
}

// Returns an error message, or null when everything is valid
function validateVendorFields(f: {
  gst?: string | null;
  pan?: string | null;
  pincode?: string | null;
  email?: string | null;
}): string | null {
  if (f.gst && !GSTIN_RE.test(f.gst)) return "Invalid GSTIN. Expected 15 characters, e.g. 33ABCDE1234F1Z5";
  if (f.pan && !PAN_RE.test(f.pan)) return "Invalid PAN. Expected format: ABCDE1234F";
  if (f.pincode && !PINCODE_RE.test(f.pincode)) return "Invalid pincode. Expected 6 digits";
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) return "Invalid email address";
  return null;
}

// Same business, not deleted, same phone OR same GSTIN
async function findDuplicate(
  businessId: number,
  phone: string | null | undefined,
  gst: string | null | undefined,
  excludeId?: number,
): Promise<{ field: "phone" | "gst_number"; vendorName: string } | null> {
  const matchers: any[] = [];
  if (phone) matchers.push(eq(vendorsTable.phone, phone));
  if (gst) matchers.push(eq(vendorsTable.gstNumber, gst));
  if (matchers.length === 0) return null;

  const conditions: any[] = [
    eq(vendorsTable.businessId, businessId),
    eq(vendorsTable.isDeleted, false),
    or(...matchers),
  ];
  if (excludeId !== undefined) conditions.push(ne(vendorsTable.id, excludeId));

  const [dup] = await db.select().from(vendorsTable).where(and(...conditions)).limit(1);
  if (!dup) return null;
  const field = gst && dup.gstNumber === gst ? "gst_number" : "phone";
  return { field, vendorName: dup.name };
}

function duplicateMessage(d: { field: string; vendorName: string }) {
  return d.field === "gst_number"
    ? `A vendor with this GSTIN already exists (${d.vendorName})`
    : `A vendor with this phone number already exists (${d.vendorName})`;
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
      or(
        ilike(vendorsTable.name, `%${search}%`),
        ilike(vendorsTable.companyName, `%${search}%`),
        ilike(vendorsTable.phone, `%${search}%`),
        ilike(vendorsTable.gstNumber, `%${search}%`),
      ),
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

  const name = d.name.trim();
  if (!name) {
    res.status(400).json({ error: "Vendor name is required" });
    return;
  }
  const phone = clean(d.phone);
  const alternatePhone = clean(d.alternate_phone);
  const email = clean(d.email);
  const gst = clean(d.gst_number, true);
  const pan = clean(d.pan_number, true);
  const pincode = clean(d.pincode);

  const validationError = validateVendorFields({ gst, pan, pincode, email });
  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  const dup = await findDuplicate(d.business_id, phone, gst);
  if (dup) {
    res.status(409).json({ error: duplicateMessage(dup), field: dup.field });
    return;
  }

  const [vendor] = await db.insert(vendorsTable).values({
    businessId: d.business_id,
    name,
    companyName: clean(d.company_name),
    phone,
    alternatePhone,
    email,
    address: clean(d.address),
    city: clean(d.city),
    state: clean(d.state),
    pincode,
    gstNumber: gst,
    panNumber: pan,
    openingBalance: d.opening_balance !== undefined ? String(d.opening_balance) : undefined,
    openingBalanceType: d.opening_balance_type,
    paymentTermsDays: d.payment_terms_days,
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

  const [existing] = await db.select().from(vendorsTable)
    .where(and(eq(vendorsTable.id, id), eq(vendorsTable.isDeleted, false)));
  if (!existing) {
    res.status(404).json({ error: "Vendor not found" });
    return;
  }

  const updates: any = {};
  if (d.name !== undefined) {
    const name = d.name.trim();
    if (!name) {
      res.status(400).json({ error: "Vendor name cannot be empty" });
      return;
    }
    updates.name = name;
  }
  const companyName = clean(d.company_name);
  const phone = clean(d.phone);
  const alternatePhone = clean(d.alternate_phone);
  const email = clean(d.email);
  const address = clean(d.address);
  const city = clean(d.city);
  const state = clean(d.state);
  const pincode = clean(d.pincode);
  const gst = clean(d.gst_number, true);
  const pan = clean(d.pan_number, true);

  if (companyName !== undefined) updates.companyName = companyName;
  if (phone !== undefined) updates.phone = phone;
  if (alternatePhone !== undefined) updates.alternatePhone = alternatePhone;
  if (email !== undefined) updates.email = email;
  if (address !== undefined) updates.address = address;
  if (city !== undefined) updates.city = city;
  if (state !== undefined) updates.state = state;
  if (pincode !== undefined) updates.pincode = pincode;
  if (gst !== undefined) updates.gstNumber = gst;
  if (pan !== undefined) updates.panNumber = pan;
  if (d.opening_balance !== undefined) updates.openingBalance = String(d.opening_balance);
  if (d.opening_balance_type !== undefined) updates.openingBalanceType = d.opening_balance_type;
  if (d.payment_terms_days !== undefined) updates.paymentTermsDays = d.payment_terms_days;

  if (Object.keys(updates).length === 0) {
    res.status(400).json({ error: "No fields to update" });
    return;
  }

  const validationError = validateVendorFields({ gst, pan, pincode, email });
  if (validationError) {
    res.status(400).json({ error: validationError });
    return;
  }

  // Only check duplicates for values that actually changed
  const phoneToCheck = phone && phone !== existing.phone ? phone : undefined;
  const gstToCheck = gst && gst !== existing.gstNumber ? gst : undefined;
  const dup = await findDuplicate(Number(existing.businessId), phoneToCheck, gstToCheck, id);
  if (dup) {
    res.status(409).json({ error: duplicateMessage(dup), field: dup.field });
    return;
  }

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