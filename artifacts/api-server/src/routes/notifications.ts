 
import { Router, type IRouter } from "express";
import { db, notificationsTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
 
const router: IRouter = Router();
 
// GET /notifications?driver_id=X&business_id=Y&limit=20
router.get("/", async (req, res): Promise<void> => {
  const driverId = req.query.driver_id ? Number(req.query.driver_id) : undefined;
  const businessId = req.query.business_id ? Number(req.query.business_id) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : 20;
 
  // 🔶 FIX — build the where conditions as an array and pass them to a
  // single .where(and(...)) call. Drizzle's query builder returns a
  // narrower type after each chained .where()/.orderBy()/.limit(), so
  // reassigning `query = db.select()...` in different branches (as the
  // original code did) breaks TypeScript — each branch produces an
  // incompatible type for the same variable.
  const conditions: any[] = [];
  if (driverId) conditions.push(eq(notificationsTable.driverId, driverId));
  if (businessId) conditions.push(eq(notificationsTable.businessId, businessId));
 
  const result = await db
    .select()
    .from(notificationsTable)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(notificationsTable.createdAt))
    .limit(limit);
 
  res.json(result);
});
 
export default router;
 