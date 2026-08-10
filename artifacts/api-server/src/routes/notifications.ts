import { Router } from 'express';
import { db } from '../../../../lib/db/src'; // adjust to match your existing db import path
import { notifications } from '../../../../lib/db/src/schema/notifications';
import { eq, desc } from 'drizzle-orm';

const router = Router();

// GET /notifications?driver_id=X&business_id=Y&limit=20
router.get('/', async (req, res) => {
  const driverId = req.query.driver_id ? Number(req.query.driver_id) : undefined;
  const businessId = req.query.business_id ? Number(req.query.business_id) : undefined;
  const limit = req.query.limit ? Number(req.query.limit) : 20;

  let query = db.select().from(notifications).orderBy(desc(notifications.created_at)).limit(limit);

  if (driverId) {
    query = db
      .select()
      .from(notifications)
      .where(eq(notifications.driver_id, driverId))
      .orderBy(desc(notifications.created_at))
      .limit(limit);
  } else if (businessId) {
    query = db
      .select()
      .from(notifications)
      .where(eq(notifications.business_id, businessId))
      .orderBy(desc(notifications.created_at))
      .limit(limit);
  }

  const result = await query;
  res.json(result);
});

export default router;