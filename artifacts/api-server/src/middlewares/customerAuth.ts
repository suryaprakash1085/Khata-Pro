import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./auth";

export async function requireCustomerAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const payload = verifyToken(header.slice(7));
    if (payload.role !== "customer") {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    (req as any).customer = { customerId: payload.userId };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}