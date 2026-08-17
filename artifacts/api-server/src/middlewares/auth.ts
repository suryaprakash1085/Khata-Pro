  import { Request, Response, NextFunction } from "express";
  import jwt from "jsonwebtoken";
  import { db, usersTable } from "@workspace/db";
  import { eq } from "drizzle-orm";

  const JWT_SECRET = process.env.SESSION_SECRET ?? "khata-secret-change-in-production";

  export interface AuthPayload {
    userId: number;
    role: string;
  }

  export function signToken(payload: AuthPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
  }

  export function verifyToken(token: string): AuthPayload {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  }

  export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    const token = header.slice(7);
    try {
      const payload = verifyToken(token);
      (req as any).user = payload;
      next();
    } catch {
      res.status(401).json({ error: "Invalid or expired token" });
    }
  }

  export async function requireAdmin(req: Request, res: Response, next: NextFunction): Promise<void> {
    await requireAuth(req, res, async () => {
      const user = (req as any).user as AuthPayload;
      if (user.role !== "admin") {
        res.status(403).json({ error: "Forbidden: admin only" });
        return;
      }
      next();
    });
  }
