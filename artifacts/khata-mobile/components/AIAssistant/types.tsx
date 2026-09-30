export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  createdAt: number;
  // Optional suggested-action buttons shown under an assistant message
  // (e.g. "View Low Stock" -> navigates to an existing screen)
  actions?: ChatAction[];
}

export interface ChatAction {
  label: string;
  route: string; // expo-router path, e.g. '/out-of-stock-products'
}

export type IntentId =
  | 'SALES_TODAY'
  | 'LOW_STOCK'
  | 'TOP_PRODUCTS'
  | 'BILL_COUNT_TODAY'
  | 'PENDING_PAYMENTS'
  | 'SALES_SUMMARY';

export interface QuickQuestion {
  id: IntentId;
  label: string;
  prompt: string; // text inserted into chat as if the user typed it
}