import { Router, type IRouter } from "express";
import { db, deviceTokensTable } from "@workspace/db";
import { and, eq } from "drizzle-orm";
import { z } from "zod/v4";
import { requireCustomerAuth } from "../middlewares/customerAuth";
import { requireDriverAuth } from "../middlewares/driverAuth";

const router: IRouter = Router();

const Body = z.object({
  token: z.string().min(20).max(512),
  platform: z.enum(["android", "ios"]).default("android"),
});

const userIdOf = (kind: "customer" | "driver", req: any): number =>
  kind === "customer" ? Number(req.customer.customerId) : Number(req.driver.driverId);

for (const kind of ["customer", "driver"] as const) {
  const auth = kind === "customer" ? requireCustomerAuth : requireDriverAuth;

  // POST /devices/customer   or   POST /devices/driver
  // Same token already exists -> it moves to the currently logged-in user.
  router.post(`/${kind}`, auth, async (req, res): Promise<void> => {
    const parsed = Body.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }
    const userId = userIdOf(kind, req);

    await db
      .insert(deviceTokensTable)
      .values({ userType: kind, userId, token: parsed.data.token, platform: parsed.data.platform })
      .onConflictDoUpdate({
        target: deviceTokensTable.token,
        set: { userType: kind, userId, platform: parsed.data.platform, updatedAt: new Date() },
      });

    res.json({ success: true });
  });

  // POST /devices/customer/unregister   or   /devices/driver/unregister  (logout-la call aagum)
  router.post(`/${kind}/unregister`, auth, async (req, res): Promise<void> => {
    const token = typeof req.body?.token === "string" ? req.body.token : "";
    if (!token) {
      res.status(400).json({ error: "token is required" });
      return;
    }
    await db
      .delete(deviceTokensTable)
      .where(
        and(
          eq(deviceTokensTable.token, token),
          eq(deviceTokensTable.userType, kind),
          eq(deviceTokensTable.userId, userIdOf(kind, req)),
        ),
      );
    res.json({ success: true });
  });
}

export default router;