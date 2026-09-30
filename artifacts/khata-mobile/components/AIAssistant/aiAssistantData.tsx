import { ChatAction, IntentId, QuickQuestion } from './types';
import type { AssistantData } from '@/hooks/useAssistantData';
import { customFetch } from '@workspace/api-client-react';

export const QUICK_QUESTIONS: QuickQuestion[] = [
  { id: 'SALES_TODAY', label: "Today's Sales", prompt: "What are today's sales?" },
  { id: 'LOW_STOCK', label: 'Low Stock', prompt: 'Which products are low in stock?' },
  { id: 'TOP_PRODUCTS', label: 'Top Selling Products', prompt: 'What are my top selling products today?' },
  { id: 'BILL_COUNT_TODAY', label: "Today's Bills", prompt: 'How many bills today?' },
  { id: 'PENDING_PAYMENTS', label: 'Pending Payments', prompt: 'Show me pending customer payments.' },
  { id: 'SALES_SUMMARY', label: 'Sales Summary', prompt: 'Give me a sales summary for the last 7 days.' },
];

/**
 * Lightweight keyword-based intent detection. English + a few common
 * Tamil-English (Thuglish) words per the spec ("evlo" = how much).
 * No AI call — this is pure string matching, the "structured question"
 * path from the spec.
 */
export function detectIntent(rawText: string): IntentId | null {
  const t = rawText.toLowerCase();

  const has = (...words: string[]) => words.some((w) => t.includes(w));

  if (has('low stock', 'low in stock', 'restock', 'reorder')) return 'LOW_STOCK';
  if (has('out of stock')) return 'LOW_STOCK'; // out-of-stock count is folded into the low-stock reply
  if (has('top selling', 'top product', 'best seller', 'best selling')) return 'TOP_PRODUCTS';
  if (has('how many bill', 'bill count', 'bills today')) return 'BILL_COUNT_TODAY';
  if (has('pending payment', 'pending customer', 'who owes', 'outstanding')) return 'PENDING_PAYMENTS';
  if (has('summary', 'last 7 day', '7-day', 'this week', 'week')) return 'SALES_SUMMARY';
  if (has('sale', 'evlo', 'how much')) return 'SALES_TODAY';

  return null;
}

export function getStructuredReply(
  intent: IntentId,
  data: AssistantData,
  fmt: (n: number) => string,
): { text: string; actions?: ChatAction[] } {
  switch (intent) {
    case 'SALES_TODAY':
      return {
        text:
          `💰 Today's Sales\n\n` +
          `• Sales: ${fmt(data.todaySales.totalRevenue)}\n` +
          `• Bills: ${data.todaySales.bills}\n` +
          `• Average Bill: ${fmt(data.todaySales.avgBill)}`,
        actions: [{ label: 'View Sales Report', route: '/(tabs)/reports' }],
      };

    case 'BILL_COUNT_TODAY':
      return { text: `🧾 Today's Bills: ${data.todaySales.bills}` };

    case 'LOW_STOCK': {
      if (data.lowStockProducts.length === 0 && data.outOfStockCount === 0) {
        return { text: '📦 All good — no low-stock or out-of-stock products right now.' };
      }
      const lines = data.lowStockProducts
        .slice(0, 8)
        .map((p, i) => `${i + 1}. ${p.name} — ${p.stock_qty} ${p.unit || 'pcs'}`)
        .join('\n');
      const outOfStockNote =
        data.outOfStockCount > 0 ? `\n\n⚠️ ${data.outOfStockCount} product(s) are completely out of stock.` : '';
      return {
        text: `📦 Low Stock Products\n\n${lines || 'None currently low, but check out-of-stock below.'}${outOfStockNote}`,
        actions: [{ label: 'View Low Stock', route: '/out-of-stock-products' }],
      };
    }

    case 'TOP_PRODUCTS': {
      if (data.topProducts.length === 0) {
        return { text: "🏆 No sales recorded yet today, so there's no top product to show." };
      }
      const lines = data.topProducts
        .map((p, i) => `${i + 1}. ${p.name} — ${p.qty_sold} sold · ${fmt(p.sales_amount)}`)
        .join('\n');
      return { text: `🏆 Top Selling Products (Today)\n\n${lines}`, actions: [{ label: 'View Sales Report', route: '/(tabs)/reports' }] };
    }

    case 'PENDING_PAYMENTS': {
      if (data.pendingCustomers.length === 0) {
        return { text: '⏳ No pending customer payments right now — all clear!' };
      }
      const lines = data.pendingCustomers
        .map((c: any, i) => `${i + 1}. ${c.name} — ${fmt(c.current_balance ?? 0)}`)
        .join('\n');
      return {
        text: `⏳ Pending Payments\n\n${lines}\n\nTotal pending: ${fmt(data.totalPendingFromCustomers)}`,
      };
    }

    case 'SALES_SUMMARY':
      return {
        text:
          `📈 This Week's Sales Summary\n\n` +
          `• Sales: ${fmt(data.weekSummary.totalRevenue)}\n` +
          `• Bills: ${data.weekSummary.bills}\n` +
          `• Average Bill: ${fmt(data.weekSummary.avgBill)}`,
        actions: [{ label: 'View Sales Report', route: '/(tabs)/reports' }],
      };
  }
}

 export async function getAiExplanation(
   question: string,
   businessId: number | undefined,

): Promise<{ text: string; actions?: ChatAction[] }> {
   if (!businessId) return { text: "I don't have enough data to determine that." };
   try {
     return await customFetch<{ text: string }>('/api/assistant/ask', {
       method: 'POST',
       responseType: 'json',

      body: JSON.stringify({ question, business_id: businessId }),
     });
   } catch {
     return { text: 'AI Assistant is temporarily unavailable. You can still use the normal POS features.' };
   }
 }