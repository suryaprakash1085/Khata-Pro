// TARGET PATH: artifacts/api-server/src/routes/delivery-fees.ts
// NEW FILE — register in routes/index.ts the same way service-highlights.ts is registered.

import { Router, type IRouter } from "express";
import { db, businessesTable, staffBusinessMapTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { requireAuth, AuthPayload } from "../middlewares/auth";
import {
  UpdateDeliveryFeeSettingsBody,
  CalculateDeliveryFeeBody,
} from "@workspace/api-zod";
import {
  getOrCreateSettings,
  updateSettings,
  calculateDeliveryFeeForBusiness,
  DeliveryFeeValidationError,
  ShopLocationMissingError,
  CustomerLocationMissingError,
} from "../services/deliveryFee.service";

const router: IRouter = Router();

// Same resolution pattern as service-highlights.ts: owner first, then
// staff mapping. Never trust a business_id from the request for this.
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

// GET /delivery-fees/settings — owner/staff, scoped to their own business
router.get("/delivery-fees/settings", requireAuth, async (req, res): Promise<void> => {
  const { userId } = (req as any).user as AuthPayload;
  const businessId = await resolveBusinessIdForUser(userId);
  if (!businessId) {
    res.status(403).json({ error: "No business associated with this account" });
    return;
  }

  try {
    const settings = await getOrCreateSettings(businessId);
    res.json(settings);
  } catch (err) {
    console.error("GET /delivery-fees/settings error:", err);
    res.status(500).json({ error: "Unexpected server error" });
  }
});

// PUT /delivery-fees/settings
router.put("/delivery-fees/settings", requireAuth, async (req, res): Promise<void> => {
  const { userId } = (req as any).user as AuthPayload;
  const businessId = await resolveBusinessIdForUser(userId);
  if (!businessId) {
    res.status(403).json({ error: "No business associated with this account" });
    return;
  }

  const parsed = UpdateDeliveryFeeSettingsBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: parsed.error.message });
    return;
  }

  try {
    const updated = await updateSettings(businessId, parsed.data);
    res.json(updated);
  } catch (err) {
    if (err instanceof DeliveryFeeValidationError) {
      res.status(422).json({ error: err.message });
      return;
    }
    console.error("PUT /delivery-fees/settings error:", err);
    res.status(500).json({ error: "Unexpected server error" });
  }
});

// POST /delivery-fees/calculate
//
// business_id in the request body is used ONLY to look up which business's
// settings apply for this preview — it is never trusted for authorization,
// and this endpoint requires no auth so the customer app can call it before
// the shopper logs in. The AUTHORITATIVE recalculation still happens again,
// server-side, at order-creation time (see sales-orders integration note).
router.post("/delivery-fees/calculate", async (req, res): Promise<void> => {
  const parsed = CalculateDeliveryFeeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ error: parsed.error.message });
    return;
  }

  const { business_id, customer_latitude, customer_longitude } = parsed.data;

  try {
    const result = await calculateDeliveryFeeForBusiness(
      business_id,
      customer_latitude,
      customer_longitude
    );
    res.json(result);
  } catch (err) {
    if (err instanceof ShopLocationMissingError || err instanceof CustomerLocationMissingError) {
      res.status(422).json({ error: err.message });
      return;
    }
    if (err instanceof DeliveryFeeValidationError) {
      res.status(422).json({ error: err.message });
      return;
    }
    console.error("POST /delivery-fees/calculate error:", err);
    res.status(500).json({ error: "Unexpected server error" });
  }
});

export default router;