import { GoogleGenAI, Type } from '@google/genai';
import {
  db,
  productsTable,
  transactionsTable,
  customersTable,
  vendorsTable,
  purchasesTable,
  expensesTable,
  salesOrdersTable,
  deliveriesTable,
  driversTable,
  staffBusinessMapTable, 
  usersTable,
} from '@workspace/db';
import { eq, and, gte, lte, inArray, count, sql } from 'drizzle-orm';

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export class AiAssistantUnavailableError extends Error {}

function toLocalISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getDateRange(period: 'today' | 'week' | 'month'): { from: string; to: string } {
  const now = new Date();
  const to = toLocalISODate(now);
  let fromDate: Date;
  if (period === 'today') {
    fromDate = new Date(now);
  } else if (period === 'week') {
    fromDate = new Date(now);
    fromDate.setDate(now.getDate() - now.getDay());
  } else {
    fromDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }
  return { from: toLocalISODate(fromDate), to };
}

// ============================================================
// FAST PATH: business summary for intent-matched quick questions
// (Today's Sales button, etc.) — no AI call needed here.
// ============================================================

interface BusinessSummary {
  today_sales: number;
  today_bills: number;
  week_sales: number;
  week_bills: number;
  low_stock_count: number;
  out_of_stock_count: number;
  today_expenses: number;
  customers_with_pending_balance: number;
  total_pending_from_customers: number;
  total_pending_to_vendors: number;
  online_orders_today: number;
  online_sales_today: number;
  online_cod_orders_today: number;
  online_cod_sales_today: number;
  online_online_orders_today: number;   // paid via online/prepaid gateway
  online_online_sales_today: number;
  online_card_orders_today: number;
  online_card_sales_today: number;
  pending_deliveries: number;
  active_drivers: number;
  total_drivers: number;
  active_driver_names: string[];
}

async function computeBusinessSummary(businessId: number): Promise<BusinessSummary> {
  const now = new Date();
  const todayStr = toLocalISODate(now);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekStartStr = toLocalISODate(weekStart);

  const products = await db.select().from(productsTable).where(and(eq(productsTable.businessId, businessId), eq(productsTable.isDeleted, false)));
  const low_stock_count = products.filter((p: any) => p.stockQty > 0 && p.stockQty <= (p.lowStockAlert ?? 5)).length;
  const out_of_stock_count = products.filter((p: any) => p.stockQty === 0).length;

  const baseSalesCondition = and(
    eq(transactionsTable.businessId, businessId),
    eq(transactionsTable.type, 'you_gave'),
    eq(transactionsTable.isDeleted, false),
  );
  const [todayTxns, weekTxns] = await Promise.all([
    db.select().from(transactionsTable).where(and(baseSalesCondition, eq(transactionsTable.entryDate, todayStr))),
    db.select().from(transactionsTable).where(and(baseSalesCondition, gte(transactionsTable.entryDate, weekStartStr), lte(transactionsTable.entryDate, todayStr))),
  ]);
  const sumAmount = (rows: any[]) => rows.reduce((s, t) => s + parseFloat(t.amount ?? '0'), 0);

  const todayExpRows = await db.select().from(expensesTable).where(and(
    eq(expensesTable.businessId, businessId), eq(expensesTable.isDeleted, false), eq(expensesTable.entryDate, todayStr),
  ));
  const today_expenses = sumAmount(todayExpRows);

  const customers = await db.select().from(customersTable).where(eq(customersTable.businessId, businessId));
  const withBalance = customers.filter((c: any) => parseFloat(c.currentBalance ?? '0') > 0);
  const customers_with_pending_balance = withBalance.length;
  const total_pending_from_customers = withBalance.reduce((s, c: any) => s + parseFloat(c.currentBalance ?? '0'), 0);

  const purchases = await db.select().from(purchasesTable).where(and(eq(purchasesTable.businessId, businessId), eq(purchasesTable.isDeleted, false)));
  const total_pending_to_vendors = purchases.reduce((s, p: any) => s + (parseFloat(p.amount ?? '0') - parseFloat(p.amountPaid ?? '0')), 0);

  // ---- Online orders (today), broken down by payment mode ----
  const todaySalesOrders = await db.select().from(salesOrdersTable).where(and(
    eq(salesOrdersTable.businessId, businessId), eq(salesOrdersTable.channel, 'online'),
    eq(salesOrdersTable.isDeleted, false), eq(salesOrdersTable.entryDate, todayStr),
  ));
  const online_orders_today = todaySalesOrders.length;
  const online_sales_today = todaySalesOrders.reduce((s, so: any) => s + parseFloat(so.amount ?? '0'), 0);

  // Payment mode lives on deliveriesTable, linked via salesOrderId — same
  // source routes/sales-orders.ts already uses. Orders with no linked
  // delivery row (no shipping_address) have no payment mode at all and
  // are excluded from every mode's breakdown below, by design.
  const todaySalesOrderIds = todaySalesOrders.map((so: any) => Number(so.id));
  const todayDeliveries = todaySalesOrderIds.length > 0
    ? await db
        .select({ salesOrderId: deliveriesTable.salesOrderId, paymentMethod: deliveriesTable.payment_method })
        .from(deliveriesTable)
        .where(inArray(deliveriesTable.salesOrderId, todaySalesOrderIds))
    : [];
  const paymentModeMap = new Map(todayDeliveries.map((d: any) => [Number(d.salesOrderId), d.paymentMethod as string | null]));

  const ordersByMode = (mode: string) =>
    todaySalesOrders.filter((so: any) => paymentModeMap.get(Number(so.id)) === mode);
  const sumMode = (mode: string) => ordersByMode(mode).reduce((s, so: any) => s + parseFloat(so.amount ?? '0'), 0);

  const online_cod_orders_today = ordersByMode('cod').length;
  const online_cod_sales_today = sumMode('cod');
  const online_online_orders_today = ordersByMode('online').length;
  const online_online_sales_today = sumMode('online');
  const online_card_orders_today = ordersByMode('card').length;
  const online_card_sales_today = sumMode('card');

  const deliveries = await db.select().from(deliveriesTable).where(eq(deliveriesTable.businessId, businessId));
  const pending_deliveries = deliveries.filter((d: any) => ['pending', 'assigned', 'picked_up', 'in_transit'].includes(d.status)).length;

  const drivers = await db.select().from(driversTable).where(and(eq(driversTable.businessId, businessId), eq(driversTable.isDeleted, false)));
  const total_drivers = drivers.length;
  const active_drivers = drivers.filter((d: any) => d.status === 'available' || d.status === 'busy').length;
  const active_driver_names = drivers
    .filter((d: any) => d.status === 'available' || d.status === 'busy')
    .map((d: any) => d.name);

  return {
    today_sales: sumAmount(todayTxns), today_bills: todayTxns.length,
    week_sales: sumAmount(weekTxns), week_bills: weekTxns.length,
    low_stock_count, out_of_stock_count, today_expenses,
    customers_with_pending_balance, total_pending_from_customers, total_pending_to_vendors,
    online_orders_today, online_sales_today,
    online_cod_orders_today, online_cod_sales_today,
    online_online_orders_today, online_online_sales_today,
    online_card_orders_today, online_card_sales_today,
    active_driver_names, pending_deliveries, active_drivers, total_drivers,
  };
}

type Intent = 'TODAY_SALES' | 'LOW_STOCK' | 'OUT_OF_STOCK'
  | 'ONLINE_ORDERS_TODAY' | 'ONLINE_COD_ORDERS_TODAY' | 'ONLINE_PAID_ORDERS_TODAY' | 'ONLINE_CARD_ORDERS_TODAY'
  | 'PENDING_DELIVERIES' | 'ACTIVE_DRIVERS' | 'DRIVER_NAMES'
  | 'PENDING_FROM_CUSTOMERS' | 'PENDING_TO_VENDORS' | 'TODAY_EXPENSES';

// Detects a payment-mode qualifier WITHIN an online-orders question.
// Order matters: check the most specific phrasing first. "online" alone
// is never enough (it's already in "online orders") — it only counts as
// a payment-mode qualifier when paired with "payment"/"mode"/"prepaid".
function detectPaymentModeQualifier(q: string): 'cod' | 'online' | 'card' | null {
  if (/\bcod\b/.test(q)) return 'cod';
  if (/\bcard\b/.test(q)) return 'card';
  if (/online.*(payment|mode)|payment.*online|prepaid|paid online|non[- ]?cod/.test(q)) return 'online';
  return null;
}

function detectIntent(question: string): Intent | null {
  const q = question.toLowerCase();

  if (/online.*order|order.*online/.test(q)) {
    const mode = detectPaymentModeQualifier(q);
    if (mode === 'cod') return 'ONLINE_COD_ORDERS_TODAY';
    if (mode === 'online') return 'ONLINE_PAID_ORDERS_TODAY';
    if (mode === 'card') return 'ONLINE_CARD_ORDERS_TODAY';
    return 'ONLINE_ORDERS_TODAY';
  }

  if (/delivery.*pending|pending.*deliver/.test(q)) return 'PENDING_DELIVERIES';
  if (/driver.*(available|active)|available.*driver/.test(q)) return 'ACTIVE_DRIVERS';
  if (/low stock/.test(q)) return 'LOW_STOCK';
  if (/out of stock/.test(q)) return 'OUT_OF_STOCK';
  if (/pending.*(from|customer)|customer.*pending/.test(q)) return 'PENDING_FROM_CUSTOMERS';
  if (/pending.*vendor|vendor.*pending/.test(q)) return 'PENDING_TO_VENDORS';
  if (/expense.*today|today.*expense/.test(q)) return 'TODAY_EXPENSES';
  if (/today.*sale|sale.*today/.test(q)) return 'TODAY_SALES';
  if (/driver.*name|name.*driver/.test(q)) return 'DRIVER_NAMES';
  return null;
}

function answerFromIntent(intent: Intent, s: BusinessSummary): string {
  switch (intent) {
    case 'TODAY_SALES': return `Today's sales: ₹${s.today_sales.toFixed(2)} from ${s.today_bills} bill(s).`;
    case 'LOW_STOCK': return `You have ${s.low_stock_count} product(s) running low on stock.`;
    case 'OUT_OF_STOCK': return `${s.out_of_stock_count} product(s) are currently out of stock.`;
    case 'ONLINE_ORDERS_TODAY': return `Today's online orders: ${s.online_orders_today}, totaling ₹${s.online_sales_today.toFixed(2)}.`;
    case 'ONLINE_COD_ORDERS_TODAY': return `Today's COD online orders: ${s.online_cod_orders_today}, totaling ₹${s.online_cod_sales_today.toFixed(2)}.`;
    case 'ONLINE_PAID_ORDERS_TODAY': return `Today's online-payment orders: ${s.online_online_orders_today}, totaling ₹${s.online_online_sales_today.toFixed(2)}.`;
    case 'ONLINE_CARD_ORDERS_TODAY': return `Today's card-payment orders: ${s.online_card_orders_today}, totaling ₹${s.online_card_sales_today.toFixed(2)}.`;
    case 'PENDING_DELIVERIES': return `You have ${s.pending_deliveries} delivery(s) still pending.`;
    case 'ACTIVE_DRIVERS': return `${s.active_drivers} out of ${s.total_drivers} driver(s) are currently available.`;
    case 'PENDING_FROM_CUSTOMERS': return `${s.customers_with_pending_balance} customer(s) have a pending balance totaling ₹${s.total_pending_from_customers.toFixed(2)}.`;
    case 'PENDING_TO_VENDORS': return `Pending amount to vendors: ₹${s.total_pending_to_vendors.toFixed(2)}.`;
    case 'TODAY_EXPENSES': return `Today's expenses: ₹${s.today_expenses.toFixed(2)}.`;
    case 'DRIVER_NAMES':
      return s.active_driver_names.length
        ? `Available driver(s): ${s.active_driver_names.join(', ')}.`
        : `No drivers are currently available right now.`;
  }
}

// ============================================================
// FALLBACK PATH: Gemini + function calling for anything else
// ============================================================

async function getSalesSummary(businessId: number, period: 'today' | 'week' | 'month') {
  const { from, to } = getDateRange(period);
  const rows = await db.select().from(transactionsTable).where(and(
    eq(transactionsTable.businessId, businessId), eq(transactionsTable.type, 'you_gave'),
    eq(transactionsTable.isDeleted, false), gte(transactionsTable.entryDate, from), lte(transactionsTable.entryDate, to),
  ));
  const total = rows.reduce((s, t) => s + parseFloat(t.amount ?? '0'), 0);
  return { period, total_sales: total, bill_count: rows.length };
}

async function getExpenseSummary(businessId: number, period: 'today' | 'week' | 'month') {
  const { from, to } = getDateRange(period);
  const rows = await db.select().from(expensesTable).where(and(
    eq(expensesTable.businessId, businessId), eq(expensesTable.isDeleted, false),
    gte(expensesTable.entryDate, from), lte(expensesTable.entryDate, to),
  ));
  return { period, total_expenses: rows.reduce((s, e) => s + parseFloat(e.amount ?? '0'), 0) };
}

async function getCustomerInfo(businessId: number, nameQuery?: string) {
  const customers = await db.select().from(customersTable).where(eq(customersTable.businessId, businessId));
  const filtered = nameQuery
    ? customers.filter((c: any) => c.name?.toLowerCase().includes(nameQuery.toLowerCase()))
    : customers.filter((c: any) => parseFloat(c.currentBalance ?? '0') > 0);
  const list = filtered.slice(0, 10).map((c: any) => ({ name: c.name, phone: c.phone, balance: c.currentBalance }));
  return { count: list.length, customers: list };
}

async function getDriverInfo(businessId: number, statusFilter?: 'available' | 'busy' | 'offline') {
  let drivers = await db.select().from(driversTable).where(and(eq(driversTable.businessId, businessId), eq(driversTable.isDeleted, false)));
  if (statusFilter) drivers = drivers.filter((d: any) => d.status === statusFilter);
  const list = drivers.map((d: any) => ({ name: d.name, phone: d.phone, status: d.status, vehicle: d.vehicleNumber }));
  return { count: list.length, drivers: list };
}

async function getDeliveryInfo(businessId: number, statusFilter?: string) {
  let deliveries = await db.select().from(deliveriesTable).where(eq(deliveriesTable.businessId, businessId));
  if (statusFilter) deliveries = deliveries.filter((d: any) => d.status === statusFilter);
  return { count: deliveries.length, statuses: deliveries.map((d: any) => d.status) };
}

async function getStockInfo(businessId: number, filterType: 'low_stock' | 'out_of_stock') {
  const products = await db.select().from(productsTable).where(and(eq(productsTable.businessId, businessId), eq(productsTable.isDeleted, false)));
  const filtered = filterType === 'low_stock'
    ? products.filter((p: any) => p.stockQty > 0 && p.stockQty <= (p.lowStockAlert ?? 5))
    : products.filter((p: any) => p.stockQty === 0);
  const list = filtered.slice(0, 20).map((p: any) => ({ name: p.name, stock: p.stockQty }));
  return { count: list.length, products: list };
}
async function getEmployeeInfo(businessId: number, period?: 'today' | 'week' | 'month') {
  const staff = await db
    .select({
      userId: staffBusinessMapTable.userId,
      name: usersTable.name,
      role: usersTable.role,
    })
    .from(staffBusinessMapTable)
    .innerJoin(usersTable, eq(usersTable.id, staffBusinessMapTable.userId))
    .where(eq(staffBusinessMapTable.businessId, businessId));

  if (staff.length === 0) {
    return { count: 0, employees: [] };
  }

  const staffUserIds = staff.map((s) => s.userId);
  const txConditions: any[] = [
    eq(transactionsTable.businessId, businessId),
    eq(transactionsTable.isDeleted, false),
    eq(transactionsTable.type, 'you_got'),
    inArray(transactionsTable.createdBy, staffUserIds),
  ];
  if (period) {
    const { from, to } = getDateRange(period);
    txConditions.push(gte(transactionsTable.entryDate, from), lte(transactionsTable.entryDate, to));
  }

  const perf = await db
    .select({ createdBy: transactionsTable.createdBy, bills: count(), sales: sql<string>`coalesce(sum(amount), 0)` })
    .from(transactionsTable)
    .where(and(...txConditions))
    .groupBy(transactionsTable.createdBy);
  const perfMap = new Map(perf.map((p) => [Number(p.createdBy), p]));

  const employees = staff.map((s) => {
    const p = perfMap.get(Number(s.userId));
    return { name: s.name, role: s.role, bills: Number(p?.bills ?? 0), sales: parseFloat(p?.sales ?? '0') };
  });

  return { count: employees.length, employees };
}
// Handles ANY phrasing of "online orders" questions the fast regex misses —
// optionally filtered by payment mode (cod/online/card), sourced from
// deliveriesTable exactly like routes/sales-orders.ts does.
async function getOnlineOrdersInfo(
  businessId: number,
  period: 'today' | 'week' | 'month',
  paymentMode?: 'cod' | 'online' | 'card',
) {
  const { from, to } = getDateRange(period);
  const orders = await db.select().from(salesOrdersTable).where(and(
    eq(salesOrdersTable.businessId, businessId), eq(salesOrdersTable.channel, 'online'),
    eq(salesOrdersTable.isDeleted, false), gte(salesOrdersTable.entryDate, from), lte(salesOrdersTable.entryDate, to),
  ));

  if (!paymentMode) {
    return {
      period,
      count: orders.length,
      total: orders.reduce((s, o: any) => s + parseFloat(o.amount ?? '0'), 0),
    };
  }

  const orderIds = orders.map((o: any) => Number(o.id));
  const deliveries = orderIds.length > 0
    ? await db
        .select({ salesOrderId: deliveriesTable.salesOrderId, paymentMethod: deliveriesTable.payment_method })
        .from(deliveriesTable)
        .where(inArray(deliveriesTable.salesOrderId, orderIds))
    : [];
  const matchIds = new Set(
    deliveries.filter((d: any) => d.paymentMethod === paymentMode).map((d: any) => Number(d.salesOrderId)),
  );
  const filtered = orders.filter((o: any) => matchIds.has(Number(o.id)));

  return {
    period,
    payment_mode: paymentMode,
    count: filtered.length,
    total: filtered.reduce((s, o: any) => s + parseFloat(o.amount ?? '0'), 0),
  };
}

const tools: any = [{
  functionDeclarations: [
    { name: 'getSalesSummary', description: 'Get total sales revenue and bill count for a time period',
      parameters: { type: Type.OBJECT, properties: { period: { type: Type.STRING, enum: ['today', 'week', 'month'] } }, required: ['period'] } },
    { name: 'getExpenseSummary', description: 'Get total expenses for a time period',
      parameters: { type: Type.OBJECT, properties: { period: { type: Type.STRING, enum: ['today', 'week', 'month'] } }, required: ['period'] } },
    { name: 'getCustomerInfo', description: 'Get customer details — pending balance, phone. Optionally filter by name.',
      parameters: { type: Type.OBJECT, properties: { nameQuery: { type: Type.STRING, description: 'Optional customer name to search for' } } } },
    { name: 'getDriverInfo', description: 'Get driver names, phone, vehicle, and status. Optionally filter by status.',
      parameters: { type: Type.OBJECT, properties: { statusFilter: { type: Type.STRING, enum: ['available', 'busy', 'offline'] } } } },
    { name: 'getDeliveryInfo', description: 'Get delivery counts, optionally filtered by status',
      parameters: { type: Type.OBJECT, properties: { statusFilter: { type: Type.STRING } } } },
    { name: 'getStockInfo', description: 'Get low-stock or out-of-stock product list',
      parameters: { type: Type.OBJECT, properties: { filterType: { type: Type.STRING, enum: ['low_stock', 'out_of_stock'] } }, required: ['filterType'] } },
    { name: 'getOnlineOrdersInfo', description: 'Get online order count and total sales for a time period, optionally filtered by payment mode (cod/online/card)',
      parameters: { type: Type.OBJECT, properties: {
        period: { type: Type.STRING, enum: ['today', 'week', 'month'] },
        paymentMode: { type: Type.STRING, enum: ['cod', 'online', 'card'], description: 'Optional — filter to a specific payment mode, e.g. COD orders only' },
      }, required: ['period'] } },
    { name: 'getEmployeeInfo', description: 'Get employee/staff count, names, roles, bills, and sales — optionally for a time period',
  parameters: { type: Type.OBJECT, properties: { period: { type: Type.STRING, enum: ['today', 'week', 'month'], description: 'Optional — omit for all-time' } } } },
  ],
}];

const FUNCTION_MAP: Record<string, (businessId: number, args: any) => Promise<any>> = {
  getSalesSummary: (bid, a) => getSalesSummary(bid, a.period),
  getExpenseSummary: (bid, a) => getExpenseSummary(bid, a.period),
  getCustomerInfo: (bid, a) => getCustomerInfo(bid, a.nameQuery),
  getDriverInfo: (bid, a) => getDriverInfo(bid, a.statusFilter),
  getDeliveryInfo: (bid, a) => getDeliveryInfo(bid, a.statusFilter),
  getStockInfo: (bid, a) => getStockInfo(bid, a.filterType),
  getOnlineOrdersInfo: (bid, a) => getOnlineOrdersInfo(bid, a.period, a.paymentMode),
  getEmployeeInfo: (bid, a) => getEmployeeInfo(bid, a.period),
};

const SYSTEM_PROMPT = `You are the Khata-Pro AI Assistant inside a POS + delivery app.
Use the provided tools to fetch real data before answering — never guess numbers.
Keep answers short (2-4 sentences), practical, business-focused.
Never mention you are an AI model or which company built you.`;

async function getAiExplanationViaTools(businessId: number, question: string): Promise<string> {
  const chat = genAI.chats.create({
    model: 'gemini-3.6-flash',
    config: { systemInstruction: SYSTEM_PROMPT, tools, maxOutputTokens: 400 },
  });

  let result = await chat.sendMessage({ message: question });

  for (let i = 0; i < 3; i++) {
    const calls = result.functionCalls;
    if (!calls || calls.length === 0) break;

    const responses = await Promise.all(calls.map(async (call) => {
      const fn = FUNCTION_MAP[call.name!];
      const data = fn ? await fn(businessId, call.args ?? {}) : { error: 'unknown function' };
      return { name: call.name, response: data };
    }));

    result = await chat.sendMessage({
      message: responses.map(r => ({ functionResponse: { name: r.name, response: r.response } })),
    });
  }

  return result.text?.trim() || "I don't have enough data to determine that.";
}

// ============================================================
// MAIN ENTRY POINT — intent match first (free), else Gemini + tools
// ============================================================

export async function getAiExplanation(businessId: number, question: string): Promise<string> {
  const intent = detectIntent(question);
  if (intent) {
    const summary = await computeBusinessSummary(businessId);
    return answerFromIntent(intent, summary);
  }

  try {
    return await getAiExplanationViaTools(businessId, question);
  } catch (err) {
    console.error('getAiExplanation failed:', err);
    throw new AiAssistantUnavailableError('AI service call failed');
  }
}