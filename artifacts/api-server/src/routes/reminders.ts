import { Router, type IRouter } from "express";
import { db, remindersTable, customersTable } from "@workspace/db";
import { eq, and, desc } from "drizzle-orm";
import { requireAuth } from "../middlewares/auth";
import { CreateReminderBody } from "@workspace/api-zod";

const router: IRouter = Router();

function formatReminder(r: any, customerName?: string) {
  return {
    id: Number(r.id),
    business_id: Number(r.businessId),
    customer_id: Number(r.customerId),
    customer_name: customerName ?? "",
    transaction_id: r.transactionId ? Number(r.transactionId) : null,
    reminder_date: r.reminderDate,
    channel: r.channel,
    status: r.status,
    amount: r.amount ? parseFloat(r.amount) : null,
    created_at: r.createdAt,
  };
}

// GET /reminders
router.get("/reminders", requireAuth, async (req, res): Promise<void> => {
  const businessId = parseInt(req.query.business_id as string, 10);
  if (isNaN(businessId)) {
    res.status(400).json({ error: "business_id is required" });
    return;
  }
  const status = req.query.status as string | undefined;
  const conditions: any[] = [eq(remindersTable.businessId, businessId)];
  if (status) conditions.push(eq(remindersTable.status, status as any));

  const reminders = await db.select().from(remindersTable).where(and(...conditions)).orderBy(desc(remindersTable.reminderDate)).limit(100);

  const customerIds = [...new Set(reminders.map((r) => Number(r.customerId)))];
  const customers = customerIds.length > 0
    ? await db.select({ id: customersTable.id, name: customersTable.name }).from(customersTable)
    : [];
  const customerMap = new Map(customers.map((c) => [Number(c.id), c.name]));

  res.json(reminders.map((r) => formatReminder(r, customerMap.get(Number(r.customerId)))));
});

// POST /reminders
router.post("/reminders", requireAuth, async (req, res): Promise<void> => {
  const parsed = CreateReminderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const d = parsed.data;
  const toDateStr = (v: string | Date | null | undefined): string | null | undefined =>
    v instanceof Date ? v.toISOString().split("T")[0] : v as string | null | undefined;

  const [reminder] = await db.insert(remindersTable).values({
    businessId: d.business_id,
    customerId: d.customer_id,
    transactionId: d.transaction_id,
    reminderDate: toDateStr(d.reminder_date) ?? new Date().toISOString().split("T")[0],
    channel: d.channel as any,
    status: "pending",
  }).returning();

  const [customer] = await db.select({ name: customersTable.name }).from(customersTable).where(eq(customersTable.id, Number(d.customer_id)));
  res.status(201).json(formatReminder(reminder, customer?.name));
});

// POST /reminders/:id/send
router.post("/reminders/:id/send", requireAuth, async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const id = parseInt(raw, 10);
  // In production, this would trigger SMS/WhatsApp/push
  await db.update(remindersTable).set({ status: "sent" }).where(eq(remindersTable.id, id));
  res.json({ message: "Reminder sent successfully" });
});

export default router;
