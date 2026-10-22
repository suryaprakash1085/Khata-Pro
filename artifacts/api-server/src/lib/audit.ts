// Save as: artifacts/api-server/src/lib/audit.ts
import { db, auditLogsTable } from "@workspace/db";
import { logger } from "./logger";

type AuditParams = {
  businessId?: number | null;
  userId?: number | null;
  action: string;
  entityType: string;
  entityId?: number | null;
  oldValue?: unknown;
  newValue?: unknown;
};

const toJson = (v: unknown) =>
  v === undefined || v === null ? null : JSON.stringify(v);

// If the audit insert fails, the main action must NOT break
export async function logAudit(p: AuditParams): Promise<void> {
  try {
    await db.insert(auditLogsTable).values({
      businessId: p.businessId ?? null,
      userId: p.userId ?? null,
      action: p.action,
      entityType: p.entityType,
      entityId: p.entityId ?? null,
      oldValue: toJson(p.oldValue),
      newValue: toJson(p.newValue),
    } as any);
  } catch (err) {
    logger.error({ err }, "Failed to write audit log");
  }
}

// Compare only the given keys (the fields that were actually edited)
export function diffFields(
  before: Record<string, any>,
  after: Record<string, any>,
  keys: string[]
) {
  const oldValue: Record<string, any> = {};
  const newValue: Record<string, any> = {};
  for (const key of keys) {
    if (String(before[key] ?? "") !== String(after[key] ?? "")) {
      oldValue[key] = before[key] ?? null;
      newValue[key] = after[key] ?? null;
    }
  }
  return { oldValue, newValue, changed: Object.keys(newValue).length > 0 };
}