import { Router, type IRouter } from "express";
import { db, businessesTable, serviceHighlightsTable, staffBusinessMapTable } from "@workspace/db";
import { eq, and, asc } from "drizzle-orm";
import { requireAuth, AuthPayload } from "../middlewares/auth";
import {
  CreateServiceHighlightBody,
  UpdateServiceHighlightBody,
  UpdateServiceHighlightStatusBody,
} from "@workspace/api-zod";

const router: IRouter = Router();

function formatHighlight(h: any) {
  return {
    id: Number(h.id),
    business_id: Number(h.businessId),
    title: h.title,
    description: h.description,
    icon: h.icon,
    is_active: h.isActive,
    display_order: h.displayOrder,
    created_at: h.createdAt,
    updated_at: h.updatedAt,
  };
}

function formatPublicHighlight(h: any) {
  return {
    id: Number(h.id),
    title: h.title,
    description: h.description,
    icon: h.icon,
  };
}

// Resolves the business the authenticated user is allowed to manage.
// Never trust a business_id from the request body/query for this — owner
// first, then staff mapping. Returns null if the user has no business.
async function resolveBusinessIdForUser(userId: number): Promise<number | null> {
  const [owned] = await db
    .select({ id: businessesTable.id })
    .from(businessesTable)
    .where(eq(businessesTable.ownerId, userId));
  if (owned) return Number(owned.id);

  const [staffLink] = await db
    .select({ businessId: staffBusinessMapTable.businessId })
    .from(staffBusinessMapTable)
    .where(eq(staffBusinessMapTable.userId, userId));
  if (staffLink) return Number(staffLink.businessId);

  return null;
}

// GET /service-highlights — owner/staff view, scoped to their own business
router.get("/service-highlights", requireAuth, async (req, res): Promise<void> => {
  const { userId } = (req as any).user as AuthPayload;
  const businessId = await resolveBusinessIdForUser(userId);
  if (!businessId) {
    res.status(403).json({ error: "No business associated with this account" });
    return;
  }

  const highlights = await db
    .select()
    .from(serviceHighlightsTable)
    .where(eq(serviceHighlightsTable.businessId, businessId))
    .orderBy(asc(serviceHighlightsTable.displayOrder), asc(serviceHighlightsTable.id));

  res.json(highlights.map(formatHighlight));
});

// POST /service-highlights
router.post("/service-highlights", requireAuth, async (req, res): Promise<void> => {
  const { userId } = (req as any).user as AuthPayload;
  const businessId = await resolveBusinessIdForUser(userId);
  if (!businessId) {
    res.status(403).json({ error: "No business associated with this account" });
    return;
  }

  const parsed = CreateServiceHighlightBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const title = parsed.data.title.trim();
  const description = parsed.data.description.trim();
  if (!title || !description) {
    res.status(400).json({ error: "Title and description cannot be empty" });
    return;
  }

  const [highlight] = await db.insert(serviceHighlightsTable).values({
    businessId,
    title,
    description,
    icon: parsed.data.icon,
    isActive: parsed.data.is_active ?? true,
    displayOrder: parsed.data.display_order ?? 0,
  }).returning();

  res.status(201).json(formatHighlight(highlight));
});

// PUT /service-highlights/:id
router.put("/service-highlights/:id", requireAuth, async (req, res): Promise<void> => {
  const { userId } = (req as any).user as AuthPayload;
  const businessId = await resolveBusinessIdForUser(userId);
  if (!businessId) {
    res.status(403).json({ error: "No business associated with this account" });
    return;
  }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const parsed = UpdateServiceHighlightBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const updates: any = {};
  if (parsed.data.title !== undefined) {
    const t = parsed.data.title.trim();
    if (!t) {
      res.status(400).json({ error: "Title cannot be empty" });
      return;
    }
    updates.title = t;
  }
  if (parsed.data.description !== undefined) {
    const d = parsed.data.description.trim();
    if (!d) {
      res.status(400).json({ error: "Description cannot be empty" });
      return;
    }
    updates.description = d;
  }
  if (parsed.data.icon !== undefined) updates.icon = parsed.data.icon;
  if (parsed.data.is_active !== undefined) updates.isActive = parsed.data.is_active;
  if (parsed.data.display_order !== undefined) updates.displayOrder = parsed.data.display_order;

  // Ownership check is baked into the WHERE clause — an update that doesn't
  // match returns nothing, whether that's because the id doesn't exist or
  // because it belongs to a different business. Caller can't distinguish
  // those two cases, which is the point.
  const [highlight] = await db
    .update(serviceHighlightsTable)
    .set(updates)
    .where(and(eq(serviceHighlightsTable.id, id), eq(serviceHighlightsTable.businessId, businessId)))
    .returning();

  if (!highlight) {
    res.status(404).json({ error: "Service highlight not found" });
    return;
  }
  res.json(formatHighlight(highlight));
});

// PATCH /service-highlights/:id/status
router.patch("/service-highlights/:id/status", requireAuth, async (req, res): Promise<void> => {
  const { userId } = (req as any).user as AuthPayload;
  const businessId = await resolveBusinessIdForUser(userId);
  if (!businessId) {
    res.status(403).json({ error: "No business associated with this account" });
    return;
  }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const parsed = UpdateServiceHighlightStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [highlight] = await db
    .update(serviceHighlightsTable)
    .set({ isActive: parsed.data.is_active })
    .where(and(eq(serviceHighlightsTable.id, id), eq(serviceHighlightsTable.businessId, businessId)))
    .returning();

  if (!highlight) {
    res.status(404).json({ error: "Service highlight not found" });
    return;
  }
  res.json(formatHighlight(highlight));
});

// DELETE /service-highlights/:id
router.delete("/service-highlights/:id", requireAuth, async (req, res): Promise<void> => {
  const { userId } = (req as any).user as AuthPayload;
  const businessId = await resolveBusinessIdForUser(userId);
  if (!businessId) {
    res.status(403).json({ error: "No business associated with this account" });
    return;
  }

  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);

  const [deleted] = await db
    .delete(serviceHighlightsTable)
    .where(and(eq(serviceHighlightsTable.id, id), eq(serviceHighlightsTable.businessId, businessId)))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Service highlight not found" });
    return;
  }
  res.json({ message: "Service highlight deleted" });
});

// GET /public/businesses/:businessId/service-highlights — no auth, customer app
router.get("/public/businesses/:businessId/service-highlights", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.businessId) ? req.params.businessId[0] : req.params.businessId;
  const businessId = parseInt(raw, 10);

  const highlights = await db
    .select()
    .from(serviceHighlightsTable)
    .where(and(eq(serviceHighlightsTable.businessId, businessId), eq(serviceHighlightsTable.isActive, true)))
    .orderBy(asc(serviceHighlightsTable.displayOrder), asc(serviceHighlightsTable.id));

  res.json(highlights.map(formatPublicHighlight));
});

export default router;