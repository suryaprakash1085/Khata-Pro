import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Same secret as middlewares/auth.ts — fine to share since these are just
// different payload shapes signed by the same server. If you'd rather keep
// them fully separate, use a different env var here instead.
const JWT_SECRET = process.env.SESSION_SECRET ?? "khata-secret-change-in-production";

export interface DriverAuthPayload {
  driverId: number;
  businessId: number;
  role: "driver";
}

export function signDriverToken(payload: DriverAuthPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" }); // drivers stay logged in long-term
}

export function verifyDriverToken(token: string): DriverAuthPayload {
  return jwt.verify(token, JWT_SECRET) as DriverAuthPayload;
}

/**
 * Use this on routes the delivery-app (driver) calls — e.g. GET /deliveries/my,
 * PUT /deliveries/:id/status, POST /drivers/push-token.
 * Sets req.driver = { driverId, businessId, role }.
 */
export function requireDriverAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const token = header.slice(7);
  try {
    const payload = verifyDriverToken(token);
    if (payload.role !== "driver") {
      res.status(403).json({ error: "Forbidden: driver token required" });
      return;
    }
    (req as any).driver = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}