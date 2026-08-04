import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, Pressable, Platform, TextInput, Modal, useWindowDimensions, Alert } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
import {
  useGetReportSummary,
  useGetTopCustomers,
  useListVendors,
  useListProducts,
  useListTransactions,
  useUpdatePurchase,
  getGetReportSummaryQueryKey,
  getGetTopCustomersQueryKey,
  getListVendorsQueryKey,
  getListProductsQueryKey,
  getListTransactionsQueryKey,
  customFetch,
  type TopCustomer,
  type Vendor,
  type Product,
} from '@workspace/api-client-react';
import { Avatar } from '@/components/Avatar';
import { BalancePill } from '@/components/BalancePill';
import { EmptyState } from '@/components/EmptyState';
import { formatCurrency } from '@/lib/format';
import DateTimePicker from '@react-native-community/datetimepicker';


// =============================================================================
// TYPES
// =============================================================================

type PaymentMode = 'cash' | 'online' | 'cheque' | 'upi';

type PaymentMethodsResponse = {
  type: 'you_got' | 'you_gave';
  from: string | null;
  to: string | null;
  total_amount: number;
  payment_methods: { payment_mode: PaymentMode; total_amount: number; transaction_count: number }[];
};

const PAYMENT_MODE_LABEL: Record<PaymentMode, string> = {
  cash: 'Cash',
  online: 'Online',
  cheque: 'Cheque',
  upi: 'UPI',
};

type EmployeePerformance = {
  user_id: number;
  name: string;
  phone: string;
  profile_image: string | null;
  role: 'owner' | 'staff' | 'admin';
  bills: number;
  sales: number;
};

function useReportEmployeePerformance(params: { business_id?: number; from?: string; to?: string }, enabled: boolean) {
  return useQuery<EmployeePerformance[]>({
    queryKey: ['reports', 'employee-performance', params],
    enabled,
    queryFn: () => {
      const search = new URLSearchParams();
      if (params.business_id) search.set('business_id', String(params.business_id));
      if (params.from) search.set('from', params.from);
      if (params.to) search.set('to', params.to);
      return customFetch<EmployeePerformance[]>(`/api/reports/employee-performance?${search.toString()}`, { responseType: 'json' });
    },
  });
}


type ExpenseCategoryKey = 'rent' | 'salary' | 'utilities' | 'transport' | 'maintenance' | 'marketing' | 'supplies' | 'other';
type ExpensePaymentMode = 'cash' | 'online' | 'cheque' | 'upi' | 'bank_transfer' | 'card';

const EXPENSE_CATEGORY_LABEL: Record<ExpenseCategoryKey, string> = {
  rent: 'Rent',
  salary: 'Salaries',
  utilities: 'Utilities',
  transport: 'Transport',
  maintenance: 'Maintenance',
  marketing: 'Marketing',
  supplies: 'Supplies',
  other: 'Miscellaneous',
};

const EXPENSE_PAYMENT_LABEL: Record<ExpensePaymentMode, string> = {
  cash: 'Cash',
  online: 'Online',
  cheque: 'Cheque',
  upi: 'UPI',
  bank_transfer: 'Bank Transfer',
  card: 'Card',
};

type ExpenseEntry = {
  id: number;
  category: ExpenseCategoryKey;
  payee_name: string | null;
  description: string | null;
  amount: number;
  payment_mode: ExpensePaymentMode;
  entry_date: string;
};

type ExpenseReportResponse = {
  total_expense: number;
  expense_count: number;
  avg_expense: number;
  by_category: { category: ExpenseCategoryKey; total_amount: number; transaction_count: number }[];
  by_payment_mode: { payment_mode: ExpensePaymentMode; total_amount: number; transaction_count: number }[];
  entries: ExpenseEntry[];
};

function useReportExpenses(
  params: { business_id?: number; filter?: PeriodKey | 'all'; from?: string; to?: string },
  enabled: boolean,
) {
  return useQuery<ExpenseReportResponse>({
    queryKey: ['reports', 'expenses', params],
    enabled,
    queryFn: () => {
      const search = new URLSearchParams();
      if (params.business_id) search.set('business_id', String(params.business_id));
      if (params.filter) search.set('filter', params.filter);
      if (params.from) search.set('from', params.from);
      if (params.to) search.set('to', params.to);
      return customFetch<ExpenseReportResponse>(`/api/reports/expenses?${search.toString()}`, { responseType: 'json' });
    },
  });
}

function useReportPaymentMethods(
  params: { business_id?: number; filter?: PeriodKey | 'all'; type: 'you_got' | 'you_gave' },
  enabled: boolean
) {
  return useQuery<PaymentMethodsResponse>({
    queryKey: ['reports', 'payment-methods', params],
    enabled,
    queryFn: async () => {
      const search = new URLSearchParams();
      if (params.business_id) search.set('business_id', String(params.business_id));
      if (params.filter) search.set('filter', params.filter);
      search.set('type', params.type);
      return customFetch<PaymentMethodsResponse>(`/api/reports/payment-methods?${search.toString()}`, { responseType: 'json' });
    },
  });
}
type CashbookResponse = {
  total_income: number;
  total_expense: number;
  net: number;
  entries: { date: string; income: number; expense: number }[];
};

function useReportCashbook(params: { business_id?: number; from?: string; to?: string }, enabled: boolean) {
  return useQuery<CashbookResponse>({
    queryKey: ['reports', 'cashbook', params],
    enabled,
    queryFn: () => {
      const search = new URLSearchParams();
      if (params.business_id) search.set('business_id', String(params.business_id));
      if (params.from) search.set('from', params.from);
      if (params.to) search.set('to', params.to);
      return customFetch<CashbookResponse>(`/api/reports/cashbook?${search.toString()}`, { responseType: 'json' });
    },
  });
}

// ---- Profit & Loss Report ----
type ProfitLossSummary = {
  sales_revenue: number;
  purchase_cost: number;
  operating_expenses: number;
  other_income: number;
  gross_profit: number;
  net_profit: number;
};

type MonthlyPnLItem = { month: string; revenue: number; expenses: number; profit: number };

type ProfitLossResponse = { summary: ProfitLossSummary; monthly: MonthlyPnLItem[] };

function useReportProfitLoss(
  params: { business_id?: number; filter?: PeriodKey; from?: string; to?: string },
  enabled: boolean,
) {
  return useQuery<ProfitLossResponse>({
    queryKey: ['reports', 'profit-loss', params],
    enabled,
    queryFn: () => {
      const search = new URLSearchParams();
      if (params.business_id) search.set('business_id', String(params.business_id));
      if (params.filter) search.set('filter', params.filter);
      if (params.from) search.set('from', params.from);
      if (params.to) search.set('to', params.to);
      return customFetch<ProfitLossResponse>(`/api/reports/profit-loss?${search.toString()}`, { responseType: 'json' });
    },
  });
}

// ---- Return Report ----
type ReturnReason = 'Damaged' | 'Expired' | 'Wrong Item' | 'Customer Return' | 'Other';

type ReturnListItem = {
  id: number;
  invoice_no: string;
  product_name: string;
  customer_name: string;
  qty: number;
  return_amount: number;
  reason: ReturnReason;
  return_date: string;
};

type ReturnsReportResponse = {
  total_returns: number;
  return_amount: number;
  refunded_amount: number;
  return_rate: number;
  items: ReturnListItem[];
};

function useReportReturns(
  params: { business_id?: number; filter?: PeriodKey; from?: string; to?: string },
  enabled: boolean,
) {
  return useQuery<ReturnsReportResponse>({
    queryKey: ['reports', 'returns', params],
    enabled,
    queryFn: () => {
      const search = new URLSearchParams();
      if (params.business_id) search.set('business_id', String(params.business_id));
      if (params.filter) search.set('filter', params.filter);
      if (params.from) search.set('from', params.from);
      if (params.to) search.set('to', params.to);
      return customFetch<ReturnsReportResponse>(`/api/reports/returns?${search.toString()}`, { responseType: 'json' });
    },
  });
}
type PurchaseStatus = 'paid' | 'pending' | 'partial';

type PurchaseListItem = {
  id: number;
  vendor_id: number;
  vendor_name: string;
  invoice_no: string | null;
  amount: number;
  tax: number;
  amount_paid: number;
  status: PurchaseStatus;
  product_count: number;
  product_names: string[];
  entry_date: string;
};

type PurchaseListResponse = { data: PurchaseListItem[]; total: number; page: number; limit: number };

function useListPurchases(params: { business_id?: number; limit?: number }, enabled: boolean) {
  return useQuery<PurchaseListResponse>({
    queryKey: ['purchases', params],
    enabled,
    queryFn: () => {
      const search = new URLSearchParams();
      if (params.business_id) search.set('business_id', String(params.business_id));
      search.set('limit', String(params.limit ?? 20));
      return customFetch<PurchaseListResponse>(`/api/purchases?${search.toString()}`, { responseType: 'json' });
    },
  });
}

type ProductSalesItem = {
  product_id: number;
  name: string;
  sku: string | null;
  category: string | null;
  qty_sold: number;
  sales_amount: number;
  cost_amount: number;
  profit: number;
  unit?: string;
  last_sale_date?: string;
};

// function useReportProductSales(params: { business_id?: number; from?: string; to?: string }, enabled: boolean) {
//   return useQuery<ProductSalesItem[]>({
//     queryKey: ['reports', 'product-sales', params],
//     enabled,
//     queryFn: () => {
//       const search = new URLSearchParams();
//       if (params.business_id) search.set('business_id', String(params.business_id));
//       if (params.from) search.set('from', params.from);
//       if (params.to) search.set('to', params.to);
//       return customFetch<ProductSalesItem[]>(`/api/reports/product-sales?${search.toString()}`, { responseType: 'json' });
//     },
//   });
// }

function useReportProductSales(params: { business_id?: number; filter?: PeriodKey | 'all' }, enabled: boolean) {
  return useQuery<ProductSalesItem[]>({
    queryKey: ['reports', 'product-sales', params],
    enabled,
    queryFn: () => {
      const search = new URLSearchParams();
      if (params.business_id) search.set('business_id', String(params.business_id));
      if (params.filter) search.set('filter', params.filter);
      return customFetch<ProductSalesItem[]>(`/api/reports/product-sales?${search.toString()}`, { responseType: 'json' });
    },
  });
}

// ---- Tax Report Types ----
type TaxReportSummary = {
  total_gst: number;
  total_taxable_sales: number;
  total_tax_free_sales: number;
  total_invoices: number;
};

type GSTRateSummary = {
  gst_rate: number;
  taxable_amount: number;
  gst_amount: number;
  invoice_count: number;
};

type InvoiceGSTDetail = {
  invoice_no: string;
  date: string;
  customer: string;
  gst_rate: number;
  taxable_amount: number;
  gst_amount: number;
  total_amount: number;
};

// ---- Tax Report API Functions ----
function useTaxReportSummary(
  params: { business_id?: number; from?: string; to?: string },
  enabled: boolean
) {
  return useQuery<TaxReportSummary>({
    queryKey: ['reports', 'tax', 'summary', params],
    enabled,
    queryFn: () => {
      const search = new URLSearchParams();
      if (params.business_id) search.set('business_id', String(params.business_id));
      if (params.from) search.set('from', params.from);
      if (params.to) search.set('to', params.to);
      return customFetch<TaxReportSummary>(`/api/reports/tax-summary?${search.toString()}`, { responseType: 'json' });
    },
  });
}

function useGSTRateSummary(
  params: { business_id?: number; from?: string; to?: string },
  enabled: boolean
) {
  return useQuery<GSTRateSummary[]>({
    queryKey: ['reports', 'tax', 'rate-summary', params],
    enabled,
    queryFn: () => {
      const search = new URLSearchParams();
      if (params.business_id) search.set('business_id', String(params.business_id));
      if (params.from) search.set('from', params.from);
      if (params.to) search.set('to', params.to);
      return customFetch<GSTRateSummary[]>(`/api/reports/tax-rate-summary?${search.toString()}`, { responseType: 'json' });
    },
  });
}

function useInvoiceGSTDetails(
  params: { business_id?: number; from?: string; to?: string },
  enabled: boolean
) {
  return useQuery<InvoiceGSTDetail[]>({
    queryKey: ['reports', 'tax', 'invoice-details', params],
    enabled,
    queryFn: () => {
      const search = new URLSearchParams();
      if (params.business_id) search.set('business_id', String(params.business_id));
      if (params.from) search.set('from', params.from);
      if (params.to) search.set('to', params.to);
      return customFetch<InvoiceGSTDetail[]>(`/api/reports/tax-invoice-details?${search.toString()}`, { responseType: 'json' });
    },
  });
}


// =============================================================================
// FONTS
// =============================================================================
const FONT_REGULAR = Platform.select({ ios: 'Times New Roman', android: 'serif', default: '"Times New Roman", Times, serif' });
const FONT_BOLD = Platform.select({ ios: 'Times New Roman', android: 'serif', default: '"Times New Roman", Times, serif' });

const TOP_LIST_LIMIT = 3;
const CARD_HEIGHT = 380;
const CRM_CARD_HEIGHT = 640;
const EMP_PAY_CARD_HEIGHT = 640;
const DAILY_CLOSING_HEIGHT = 210;

const todayLabel = () =>
  new Date().toLocaleDateString('en-GB', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });

// =============================================================================
// LAYOUT CONSTANTS
// =============================================================================
const LAYOUT = {
  cardPadding: 16,
  sectionGap: 14,
  cardToHeaderGap: 10,
  rowVertical: 10,
  headerVertical: 8,
};

// =============================================================================
// PERIOD HELPERS
// =============================================================================

type PeriodKey = 'today' | 'week' | 'month';

type ApiTransactionFilter = 'today' | 'week' | 'month' | 'all';

function periodToApiFilter(period: PeriodKey): ApiTransactionFilter {
  return period;
}

function toLocalISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function periodToDateRange(period: PeriodKey): { from?: string; to?: string } {
  const now = new Date();
  switch (period) {
    case 'today': {
      const d = toLocalISODate(now);
      return { from: d, to: d };
    }
    case 'week': {
      const start = new Date(now);
      start.setDate(now.getDate() - now.getDay());
      return { from: toLocalISODate(start), to: toLocalISODate(now) };
    }
    case 'month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1);
      return { from: toLocalISODate(start), to: toLocalISODate(now) };
    }
  }
}

function periodToDays(period: PeriodKey): number {
  switch (period) {
    case 'today':
      return 1;
    case 'week':
      return 7;
    case 'month':
      return 30;
  }
}

function formatQty(qty: number, unit?: string | null): string {
  const cleanUnit = (unit ?? '').trim();
  return `${qty} ${cleanUnit || 'pcs'}`;
}

function formatShortDate(iso?: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
}

// =============================================================================
// CSV EXPORT HELPER
// =============================================================================

function toCsv(columns: { key: string; label: string }[], rows: Record<string, any>[]): string {
  const escapeCell = (v: any) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = columns.map((c) => escapeCell(c.label)).join(',');
  const body = rows.map((r) => columns.map((c) => escapeCell(r[c.key])).join(',')).join('\n');
  return `${header}\n${body}`;
}

async function exportCsv(filename: string, columns: { key: string; label: string }[], rows: Record<string, any>[]) {
  const csv = toCsv(columns, rows);
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    // @ts-ignore — Blob/document only exist on the web build
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    // @ts-ignore
    const url = URL.createObjectURL(blob);
    // @ts-ignore
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    // @ts-ignore
    URL.revokeObjectURL(url);
  } else {
    const { Share } = require('react-native');
    await Share.share({ message: csv, title: filename });
  }
}

function ExportButton({ onPress, colors }: { onPress: () => void; colors: any }) {
  return (
    <Pressable onPress={onPress} style={[styles.exportBtn, { borderColor: colors.border, backgroundColor: colors.background }]}>
      <Feather name="download" size={13} color={colors.mutedForeground} />
    </Pressable>
  );
}

// ---- Profit & Loss / Return Report shared filter type ----
type PnLPeriodKey = PeriodKey | 'custom';

// ---- Shared filter bar: Today/Week/Month/Custom + Export/Print ----
function ReportFilterBar({
  period,
  onPeriodChange,
  customFrom,
  customTo,
  onCustomFromChange,
  onCustomToChange,
  onExportPdf,
  onPrint,
  colors,
}: {
  period: PnLPeriodKey;
  onPeriodChange: (p: PnLPeriodKey) => void;
  customFrom: string;
  customTo: string;
  onCustomFromChange: (d: string) => void;
  onCustomToChange: (d: string) => void;
  onExportPdf: () => void;
  onPrint: () => void;
  colors: any;
}) {
  const [showFrom, setShowFrom] = useState(false);
  const [showTo, setShowTo] = useState(false);

  return (
    <View style={{ marginBottom: 10 }}>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
        <ChipRow
          colors={colors}
          selected={period}
          onSelect={(k) => onPeriodChange(k as PnLPeriodKey)}
          options={[
            { key: 'today', label: 'Today' },
            { key: 'week', label: 'This Week' },
            { key: 'month', label: 'This Month' },
            { key: 'custom', label: 'Custom' },
          ]}
        />
        <View style={{ flexDirection: 'row', gap: 6, marginLeft: 'auto' }}>
          <Pressable onPress={onExportPdf} style={[reportFilterStyles.actionBtn, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <Feather name="file-text" size={12} color={colors.mutedForeground} />
            <Text style={{ fontSize: 10.5, fontFamily: FONT_REGULAR, color: colors.mutedForeground }}>PDF</Text>
          </Pressable>
          <Pressable onPress={onPrint} style={[reportFilterStyles.actionBtn, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <Feather name="printer" size={12} color={colors.mutedForeground} />
            <Text style={{ fontSize: 10.5, fontFamily: FONT_REGULAR, color: colors.mutedForeground }}>Print</Text>
          </Pressable>
        </View>
      </View>

      {period === 'custom' && (
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
          <View style={{ flex: 1 }}>
            <Pressable
              onPress={() => setShowFrom(true)}
              style={[taxStyles.filterInput, { borderColor: colors.border, backgroundColor: colors.background, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
            >
              <Text style={{ color: colors.foreground, fontFamily: FONT_REGULAR, fontSize: 12 }}>{customFrom}</Text>
              <Feather name="calendar" size={13} color={colors.mutedForeground} />
            </Pressable>
            {showFrom && (
              <DateTimePicker
                value={new Date(customFrom)}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(e, d) => { setShowFrom(Platform.OS === 'ios'); if (d) onCustomFromChange(toLocalISODate(d)); }}
              />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Pressable
              onPress={() => setShowTo(true)}
              style={[taxStyles.filterInput, { borderColor: colors.border, backgroundColor: colors.background, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
            >
              <Text style={{ color: colors.foreground, fontFamily: FONT_REGULAR, fontSize: 12 }}>{customTo}</Text>
              <Feather name="calendar" size={13} color={colors.mutedForeground} />
            </Pressable>
            {showTo && (
              <DateTimePicker
                value={new Date(customTo)}
                mode="date"
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                onChange={(e, d) => { setShowTo(Platform.OS === 'ios'); if (d) onCustomToChange(toLocalISODate(d)); }}
              />
            )}
          </View>
        </View>
      )}
    </View>
  );
}

const reportFilterStyles = StyleSheet.create({
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: 6, borderWidth: 1 },
});

// ---- Monthly Revenue/Expenses/Profit chart (grouped horizontal bars) ----
function PnLMonthlyChart({ data, colors, fmt }: { data: MonthlyPnLItem[]; colors: any; fmt: (n: number) => string }) {
  const max = Math.max(1, ...data.flatMap((d) => [d.revenue, d.expenses, Math.abs(d.profit)]));
  const series: { key: 'revenue' | 'expenses' | 'profit'; label: string; color: string }[] = [
    { key: 'revenue', label: 'Revenue', color: '#5FC9A3' },
    { key: 'expenses', label: 'Expenses', color: '#E4664B' },
    { key: 'profit', label: 'Profit', color: '#5B8DEF' },
  ];
  return (
    <View>
      <View style={{ flexDirection: 'row', gap: 14, marginBottom: 10 }}>
        {series.map((s) => (
          <View key={s.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: s.color }} />
            <Text style={{ fontSize: 10.5, fontFamily: FONT_REGULAR, color: colors.mutedForeground }}>{s.label}</Text>
          </View>
        ))}
      </View>
      <View style={{ gap: 14 }}>
        {data.map((d) => (
          <View key={d.month}>
            <Text style={{ fontSize: 11, fontFamily: FONT_BOLD, fontWeight: '700', color: colors.foreground, marginBottom: 4 }}>{d.month}</Text>
            {series.map((s) => {
              const val = d[s.key];
              const pct = Math.max(4, Math.round((Math.abs(val) / max) * 100));
              return (
                <View key={s.key} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 3 }}>
                  <View style={{ width: 52 }}>
                    <Text style={{ fontSize: 9.5, fontFamily: FONT_REGULAR, color: colors.mutedForeground }}>{s.label}</Text>
                  </View>
                  <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden', marginRight: 6 }}>
                    <View style={{ width: `${pct}%`, height: '100%', borderRadius: 3, backgroundColor: s.color }} />
                  </View>
                  <Text style={{ fontSize: 9.5, fontFamily: FONT_BOLD, fontWeight: '700', color: colors.foreground, width: 60, textAlign: 'right' }}>
                    {fmt(val)}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}
function ReturnReasonBreakdown({ totals, colors, fmt }: { totals: { reason: ReturnReason; amount: number }[]; colors: any; fmt: (n: number) => string }) {
  const reasonColors: Record<ReturnReason, string> = {
    Damaged: '#E4664B',
    Expired: '#F5A623',
    'Wrong Item': '#5B8DEF',
    'Customer Return': '#5FC9A3',
    Other: '#9B7EDE',
  };
  const total = totals.reduce((s, t) => s + t.amount, 0) || 1;

  return (
    <View>
      <View style={{ flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden', marginBottom: 10 }}>
        {totals.map((t) => (
          <View key={t.reason} style={{ width: `${Math.max((t.amount / total) * 100, 2)}%`, backgroundColor: reasonColors[t.reason] }} />
        ))}
      </View>
      <View style={{ gap: 8 }}>
        {totals.map((t) => {
          const pct = Math.round((t.amount / total) * 100);
          return (
            <View key={t.reason} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: reasonColors[t.reason] }} />
                <Text style={{ fontSize: 11, fontFamily: FONT_REGULAR, color: colors.foreground }}>{t.reason}</Text>
              </View>
              <Text style={{ fontSize: 11, fontFamily: FONT_BOLD, fontWeight: '700', color: colors.foreground }}>{fmt(t.amount)} · {pct}%</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function ExpenseCategoryBreakdown({
  totals,
  colors,
  fmt,
}: {
  totals: { category: ExpenseCategoryKey; total_amount: number }[];
  colors: any;
  fmt: (n: number) => string;
}) {
  const EXPENSE_CAT_COLORS: Record<string, string> = {
    rent: '#5B8DEF', salary: '#5FC9A3', utilities: '#F5A623',
    transport: '#E4664B', maintenance: '#9B7EDE', marketing: '#F783AC',
    supplies: '#38BDF8', other: '#94A3B8',
  };
  const total = totals.reduce((s, t) => s + t.total_amount, 0) || 1;
  return (
    <View>
      <View style={{ flexDirection: 'row', height: 14, borderRadius: 7, overflow: 'hidden', marginBottom: 10 }}>
        {totals.map((t) => (
          <View key={t.category} style={{ width: `${Math.max((t.total_amount / total) * 100, 2)}%`, backgroundColor: EXPENSE_CAT_COLORS[t.category] ?? '#94A3B8' }} />
        ))}
      </View>
      <View style={{ gap: 8 }}>
        {totals.map((t) => {
          const pct = Math.round((t.total_amount / total) * 100);
          return (
            <View key={t.category} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ width: 8, height: 8, borderRadius: 2, backgroundColor: EXPENSE_CAT_COLORS[t.category] ?? '#94A3B8' }} />
                <Text style={{ fontSize: 11, fontFamily: FONT_REGULAR, color: colors.foreground }}>
                  {EXPENSE_CATEGORY_LABEL[t.category] ?? t.category}
                </Text>
              </View>
              <Text style={{ fontSize: 11, fontFamily: FONT_BOLD, fontWeight: '700', color: colors.foreground }}>
                {fmt(t.total_amount)} · {pct}%
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}
// =============================================================================
// REUSABLE UI COMPONENTS
// =============================================================================

function KpiGrid({ items, colors }: { items: { label: string; value: string; color?: string }[]; colors: any }) {
  if (items.length === 0) return null;
  return (
    <View style={styles.kpiGrid}>
      {items.map((item, i) => (
        <View
          key={item.label}
          style={[
            styles.kpiItem,
            i % 2 === 0 ? { borderRightWidth: StyleSheet.hairlineWidth, borderRightColor: colors.border } : null,
          ]}
        >
          <Text style={[styles.kpiLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
          <Text style={[styles.kpiValue, { color: item.color ?? colors.foreground }]} numberOfLines={1}>
            {item.value}
          </Text>
        </View>
      ))}
    </View>
  );
}

function ChipRow({
  options,
  selected,
  onSelect,
  colors,
}: {
  options: { key: string; label: string }[];
  selected: string;
  onSelect: (key: string) => void;
  colors: any;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={{ flexGrow: 0, height: 34 }}          // 👈 add this
      contentContainerStyle={styles.chipRow}
    >
      {options.map((opt) => {
        const active = opt.key === selected;
        return (
          <Pressable
            key={opt.key}
            onPress={() => onSelect(opt.key)}
            style={[
              styles.filterChip,
              { backgroundColor: active ? colors.primary : 'transparent' },
            ]}
          >
            <Text style={[styles.filterChipText, { color: active ? '#fff' : colors.mutedForeground, fontFamily: FONT_BOLD, fontWeight: active ? '700' : '400' }]}>
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
function SimpleTable({
  columns,
  rows,
  colors,
}: {
  columns: { key: string; label: string; width: number; align?: 'left' | 'right' }[];
  rows: any[];
  colors: any;
}) {
  // width prop-a flex-weight ah use pannurom (scroll illama fit aaga)
  const totalWidth = columns.reduce((sum, c) => sum + c.width, 0);

  return (
    <View>
      <View style={[styles.tableHeaderRow, { borderBottomColor: colors.border }]}>
        {columns.map((c) => (
          <Text
            key={c.key}
            style={[
              styles.tableHeaderCell,
              { flex: c.width / totalWidth, color: colors.mutedForeground, textAlign: c.align ?? 'left' },
            ]}
            numberOfLines={1}
          >
            {c.label}
          </Text>
        ))}
      </View>
      {rows.map((row, i) => (
        <View key={i} style={[styles.tableRow, i < rows.length - 1 ? { borderBottomWidth: 1, borderBottomColor: colors.border } : null]}>
          {columns.map((c) => (
            <Text
              key={c.key}
              style={[
                styles.tableCell,
                { flex: c.width / totalWidth, color: colors.foreground, textAlign: c.align ?? 'left', paddingHorizontal: 2 },
              ]}
              numberOfLines={1}
            >
              {row[c.key]}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}
function SectionHeader({ icon, label, sublabel, color, mutedColor, accent }: {
  icon: any; label: string; sublabel: string; color: string; mutedColor: string; accent: string;
}) {
  return (
    <View style={styles.sectionHeaderRow}>
      <Feather name={icon} size={15} color={accent} style={{ marginTop: 2 }} />
      <View>
        <Text style={[styles.sectionTitle, { color }]}>{label}</Text>
        <Text style={[styles.sectionSublabel, { color: mutedColor }]}>{sublabel}</Text>
      </View>
    </View>
  );
}

function Card({
  children,
  colors,
  style,
  height = CARD_HEIGHT,
}: {
  children: React.ReactNode;
  colors: any;
  style?: any;
  height?: number;
}) {
  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.card, borderRadius: colors.radius, borderColor: colors.border, height },
        style,
      ]}
    >
      {children}
    </View>
  );
}

function TwoColRow({ isWide, left, right }: { isWide: boolean; left: React.ReactNode; right: React.ReactNode }) {
  return (
    <View
      style={{
        flexDirection: isWide ? 'row' : 'column',
        gap: 14,
        marginBottom: 14,
        alignItems: 'stretch',
      }}
    >
      <View style={{ flex: 1, width: isWide ? undefined : '100%' }}>{left}</View>
      <View style={{ flex: 1, width: isWide ? undefined : '100%' }}>{right}</View>
    </View>
  );
}

function TagRow({ tags, colors, tone = 'muted' }: { tags: string[]; colors: any; tone?: 'muted' | 'destructive' | 'warning' }) {
  const toneColor = tone === 'destructive' ? colors.destructive : tone === 'warning' ? '#C9820A' : colors.mutedForeground;
  if (tags.length === 0) return <Text style={{ color: colors.mutedForeground, fontSize: 12, fontFamily: FONT_REGULAR }}>None</Text>;
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
      {tags.map((t) => (
        <View key={t} style={[styles.badge, { backgroundColor: toneColor + '18' }]}>
          <Text style={[styles.badgeText, { color: toneColor }]} numberOfLines={1}>{t}</Text>
        </View>
      ))}
    </View>
  );
}

function StatusBadge({ label, tone, colors }: { label: string; tone: 'success' | 'warning' | 'destructive'; colors: any }) {
  const toneColor = tone === 'success' ? colors.success : tone === 'warning' ? '#C9820A' : colors.destructive;
  return (
    <View style={[styles.badge, { backgroundColor: toneColor + '18', alignSelf: 'flex-start' }]}>
      <Text style={[styles.badgeText, { color: toneColor, fontFamily: FONT_BOLD, fontWeight: '700' }]}>{label}</Text>
    </View>
  );
}

function dueStatus(due: number, total: number): { label: string; tone: 'success' | 'warning' | 'destructive' } {
  if (due <= 0) return { label: 'No Due', tone: 'success' };
  const ratio = total > 0 ? due / total : 1;
  return ratio >= 0.7 ? { label: 'High Due', tone: 'destructive' } : { label: 'Partial', tone: 'warning' };
}

function MiniInsightCard({ icon, label, value, color, colors }: { icon: any; label: string; value: string; color: string; colors: any }) {
  return (
    <View style={[insightStyles.card, { backgroundColor: colors.background, borderColor: colors.border }]}>
      <View style={[insightStyles.iconWrap, { backgroundColor: color + '15' }]}>
        <Feather name={icon} size={12} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[insightStyles.label, { color: colors.mutedForeground }]} numberOfLines={1}>{label}</Text>
        <Text style={[insightStyles.value, { color: colors.foreground }]} numberOfLines={1}>{value}</Text>
      </View>
    </View>
  );
}

function CrmSubHeading({ label, colors }: { label: string; colors: any }) {
  return (
    <Text style={[styles.subHeading, { color: colors.foreground, marginTop: 12 }]}>{label}</Text>
  );
}

function KeyValueList({ rows, colors }: { rows: { label: string; value: string; color?: string; bold?: boolean }[]; colors: any }) {
  if (rows.length === 0) return null;
  return (
    <View>
      {rows.map((r, i) => (
        <View key={r.label} style={[styles.kvRow, i < rows.length - 1 ? { borderBottomWidth: 1, borderBottomColor: colors.border } : null]}>
          <Text style={[styles.kvLabel, { color: colors.mutedForeground }]}>{r.label}</Text>
          <Text style={[styles.kvValue, { color: r.color ?? colors.foreground, fontFamily: FONT_BOLD, fontWeight: r.bold === false ? '400' : '700' }]}>{r.value}</Text>
        </View>
      ))}
    </View>
  );
}

function NotAvailableCard({ icon, title, subtitle, colors }: { icon: any; title: string; subtitle: string; colors: any }) {
  return (
    <Card colors={colors} style={{ justifyContent: 'center' }}>
      <EmptyState icon={icon} title={title} subtitle={subtitle} />
    </Card>
  );
}

function ProfitLossReportSection({ colors, fmt }: { colors: any; fmt: (n: number) => string }) {
  const { business } = useBusiness();
  const [period, setPeriod] = useState<PnLPeriodKey>('month');
  const [customFrom, setCustomFrom] = useState(toLocalISODate(new Date()));
  const [customTo, setCustomTo] = useState(toLocalISODate(new Date()));

  const queryParams =
    period === 'custom'
      ? { business_id: business?.id, from: customFrom, to: customTo }
      : { business_id: business?.id, filter: period as PeriodKey };

  const { data, isLoading, isError } = useReportProfitLoss(queryParams, !!business?.id);
  const pnl = data?.summary;
  const monthly = data?.monthly ?? [];
  const profitMargin = pnl?.sales_revenue ? (pnl.net_profit / pnl.sales_revenue) * 100 : 0;
  const highestRevenueMonth = useMemo(
    () => (monthly.length ? [...monthly].sort((a, b) => b.revenue - a.revenue)[0] : null),
    [monthly],
  );

  return (
    <Card colors={colors} height={CRM_CARD_HEIGHT} style={{ padding: 0 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: LAYOUT.cardPadding }}>
        <ReportFilterBar
          period={period}
          onPeriodChange={setPeriod}
          customFrom={customFrom}
          customTo={customTo}
          onCustomFromChange={setCustomFrom}
          onCustomToChange={setCustomTo}
          onExportPdf={() => Alert.alert('Export', 'PDF export coming soon')}
          onPrint={() => Alert.alert('Print', 'Print support coming soon')}
          colors={colors}
        />

        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
        ) : isError || !pnl ? (
          <Text style={{ color: colors.destructive, fontSize: 12, fontFamily: FONT_REGULAR }}>Couldn't load profit & loss data</Text>
        ) : (
          <>
            <View style={crmStyles.kpiGrid}>
              <View style={{ width: '48%' }}><TaxSummaryCard icon="trending-up" label="Total Revenue" value={fmt(pnl.sales_revenue)} color={colors.success} bgColor={colors.success + '15'} colors={colors} /></View>
              <View style={{ width: '48%' }}><TaxSummaryCard icon="trending-down" label="Total Expenses" value={fmt(pnl.purchase_cost + pnl.operating_expenses)} color={colors.destructive} bgColor={colors.destructive + '15'} colors={colors} /></View>
              <View style={{ width: '48%' }}><TaxSummaryCard icon="pie-chart" label="Gross Profit" value={fmt(pnl.gross_profit)} color={colors.primary} bgColor={colors.primary + '15'} colors={colors} /></View>
              <View style={{ width: '48%' }}><TaxSummaryCard icon="dollar-sign" label="Net Profit" value={fmt(pnl.net_profit)} color={pnl.net_profit >= 0 ? colors.success : colors.destructive} bgColor={(pnl.net_profit >= 0 ? colors.success : colors.destructive) + '15'} colors={colors} /></View>
            </View>

            <CrmSubHeading label="Profit & Loss Statement" colors={colors} />
            <SimpleTable
              colors={colors}
              columns={[{ key: 'category', label: 'Category', width: 160 }, { key: 'amount', label: 'Amount', width: 110, align: 'right' }]}
              rows={[
                { category: 'Sales Revenue', amount: fmt(pnl.sales_revenue) },
                { category: 'Purchase Cost', amount: `(${fmt(pnl.purchase_cost)})` },
                { category: 'Operating Expenses', amount: `(${fmt(pnl.operating_expenses)})` },
                { category: 'Other Income', amount: fmt(pnl.other_income) },
                { category: 'Gross Profit', amount: fmt(pnl.gross_profit) },
                { category: 'Net Profit', amount: fmt(pnl.net_profit) },
              ]}
            />

            <CrmSubHeading label="Monthly Profit Overview" colors={colors} />
            {monthly.length === 0 ? (
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontFamily: FONT_REGULAR }}>No monthly data yet</Text>
            ) : (
              <PnLMonthlyChart data={monthly} colors={colors} fmt={fmt} />
            )}

            <CrmSubHeading label="Business Insights" colors={colors} />
            <View style={crmStyles.insightGrid}>
              <MiniInsightCard icon="calendar" label="Highest Revenue Month" value={highestRevenueMonth?.month ?? '—'} color={colors.primary} colors={colors} />
              <MiniInsightCard icon="alert-circle" label="Highest Expense Category" value={pnl.operating_expenses >= pnl.purchase_cost ? 'Operating Expenses' : 'Purchase Cost'} color={colors.destructive} colors={colors} />
              <MiniInsightCard icon={pnl.net_profit >= 0 ? 'check-circle' : 'x-circle'} label="Net Profit Status" value={pnl.net_profit >= 0 ? 'Profitable' : 'Loss'} color={pnl.net_profit >= 0 ? colors.success : colors.destructive} colors={colors} />
              <MiniInsightCard icon="percent" label="Profit Margin" value={`${profitMargin.toFixed(1)}%`} color={colors.mutedForeground} colors={colors} />
            </View>
          </>
        )}
      </ScrollView>
    </Card>
  );
}

function ReturnReportSection({ colors, fmt }: { colors: any; fmt: (n: number) => string }) {
  const { business } = useBusiness();
  const [period, setPeriod] = useState<PnLPeriodKey>('month');
  const [customFrom, setCustomFrom] = useState(toLocalISODate(new Date()));
  const [customTo, setCustomTo] = useState(toLocalISODate(new Date()));

  const queryParams =
    period === 'custom'
      ? { business_id: business?.id, from: customFrom, to: customTo }
      : { business_id: business?.id, filter: period as PeriodKey };

  const { data, isLoading, isError } = useReportReturns(queryParams, !!business?.id);
  const items = data?.items ?? [];

  const reasonTotals = useMemo(() => {
    const map = new Map<ReturnReason, number>();
    items.forEach((r) => map.set(r.reason, (map.get(r.reason) ?? 0) + r.return_amount));
    return Array.from(map.entries()).map(([reason, amount]) => ({ reason, amount })).sort((a, b) => b.amount - a.amount);
  }, [items]);

  const topReturned = useMemo(() => {
    const map = new Map<string, { qty: number; amount: number }>();
    items.forEach((r) => {
      const e = map.get(r.product_name) ?? { qty: 0, amount: 0 };
      e.qty += r.qty;
      e.amount += r.return_amount;
      map.set(r.product_name, e);
    });
    return Array.from(map.entries()).map(([product, v]) => ({ product, ...v })).sort((a, b) => b.amount - a.amount).slice(0, 5);
  }, [items]);

  return (
    <Card colors={colors} height={CRM_CARD_HEIGHT} style={{ padding: 0 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: LAYOUT.cardPadding }}>
        <ReportFilterBar
          period={period}
          onPeriodChange={setPeriod}
          customFrom={customFrom}
          customTo={customTo}
          onCustomFromChange={setCustomFrom}
          onCustomToChange={setCustomTo}
          onExportPdf={() => Alert.alert('Export', 'PDF export coming soon')}
          onPrint={() => Alert.alert('Print', 'Print support coming soon')}
          colors={colors}
        />

        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
        ) : isError || !data ? (
          <Text style={{ color: colors.destructive, fontSize: 12, fontFamily: FONT_REGULAR }}>Couldn't load return data</Text>
        ) : items.length === 0 ? (
          <EmptyState icon="corner-up-left" title="No returns yet" subtitle="Returned items will show up here once you record one" />
        ) : (
          <>
            <View style={crmStyles.kpiGrid}>
              <View style={{ width: '48%' }}><TaxSummaryCard icon="corner-up-left" label="Total Returns" value={String(data.total_returns)} color={colors.primary} bgColor={colors.primary + '15'} colors={colors} /></View>
              <View style={{ width: '48%' }}><TaxSummaryCard icon="minus-circle" label="Return Amount" value={fmt(data.return_amount)} color={colors.destructive} bgColor={colors.destructive + '15'} colors={colors} /></View>
              <View style={{ width: '48%' }}><TaxSummaryCard icon="rotate-ccw" label="Refunded Amount" value={fmt(data.refunded_amount)} color={colors.success} bgColor={colors.success + '15'} colors={colors} /></View>
              <View style={{ width: '48%' }}><TaxSummaryCard icon="percent" label="Return Rate" value={`${data.return_rate.toFixed(1)}%`} color={colors.mutedForeground} bgColor={colors.border} colors={colors} /></View>
            </View>

            <CrmSubHeading label="Return Products" colors={colors} />
            
              <SimpleTable
                colors={colors}
                columns={[
                  { key: 'invoice', label: 'Invoice No', width: 90 },
                  { key: 'product', label: 'Product', width: 130 },
                  { key: 'customer', label: 'Customer', width: 100 },
                  { key: 'qty', label: 'Qty', width: 50, align: 'right' },
                  { key: 'amount', label: 'Return Amt', width: 90, align: 'right' },
                  { key: 'reason', label: 'Reason', width: 110 },
                  { key: 'date', label: 'Date', width: 70 },
                ]}
                rows={items.map((r) => ({
                  invoice: r.invoice_no,
                  product: r.product_name,
                  customer: r.customer_name,
                  qty: r.qty,
                  amount: fmt(r.return_amount),
                  reason: r.reason,
                  date: formatShortDate(r.return_date),
                }))}
              />

            <CrmSubHeading label="Return Analytics" colors={colors} />
            <ReturnReasonBreakdown totals={reasonTotals} colors={colors} fmt={fmt} />

            <CrmSubHeading label="Top Returned Products" colors={colors} />
            <SimpleTable
              colors={colors}
              columns={[{ key: 'product', label: 'Product', width: 140 }, { key: 'qty', label: 'Returned Qty', width: 100, align: 'right' }, { key: 'amount', label: 'Return Amount', width: 110, align: 'right' }]}
              rows={topReturned.map((t) => ({ product: t.product, qty: t.qty, amount: fmt(t.amount) }))}
            />
          </>
        )}
      </ScrollView>
    </Card>
  );
}

function ExpenseReportSection({ colors, fmt }: { colors: any; fmt: (n: number) => string }) {
  const { business } = useBusiness();
  const [period, setPeriod] = useState<PnLPeriodKey>('month');
  const [customFrom, setCustomFrom] = useState(toLocalISODate(new Date()));
  const [customTo, setCustomTo] = useState(toLocalISODate(new Date()));

  const queryParams =
    period === 'custom'
      ? { business_id: business?.id, from: customFrom, to: customTo }
      : { business_id: business?.id, filter: period as PeriodKey };

  const { data, isLoading, isError } = useReportExpenses(queryParams, !!business?.id);
  const entries = data?.entries ?? [];
  const byCategory = data?.by_category ?? [];
  const byPaymentMode = data?.by_payment_mode ?? [];

  const highestCategory = byCategory[0];
  const mostUsedPayment = useMemo(
    () => [...byPaymentMode].sort((a, b) => b.transaction_count - a.transaction_count)[0],
    [byPaymentMode],
  );
  const highestSingleExpense = useMemo(
    () => (entries.length ? [...entries].sort((a, b) => b.amount - a.amount)[0] : null),
    [entries],
  );

  return (
    <Card colors={colors} height={CRM_CARD_HEIGHT} style={{ padding: 0 }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: LAYOUT.cardPadding }}>
        <ReportFilterBar
          period={period}
          onPeriodChange={setPeriod}
          customFrom={customFrom}
          customTo={customTo}
          onCustomFromChange={setCustomFrom}
          onCustomToChange={setCustomTo}
          onExportPdf={() => Alert.alert('Export', 'PDF export coming soon')}
          onPrint={() => Alert.alert('Print', 'Print support coming soon')}
          colors={colors}
        />

        {isLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
        ) : isError || !data ? (
          <Text style={{ color: colors.destructive, fontSize: 12, fontFamily: FONT_REGULAR }}>Couldn't load expense data</Text>
        ) : entries.length === 0 ? (
          <EmptyState icon="trending-down" title="No expenses yet" subtitle="Expenses you record will show up here" />
        ) : (
          <>
            <View style={crmStyles.kpiGrid}>
              <View style={{ width: '48%' }}>
                <TaxSummaryCard icon="trending-down" label="Total Expenses" value={fmt(data.total_expense)} color={colors.destructive} bgColor={colors.destructive + '15'} colors={colors} />
              </View>
              <View style={{ width: '48%' }}>
                <TaxSummaryCard icon="hash" label="Total Entries" value={String(data.expense_count)} color={colors.primary} bgColor={colors.primary + '15'} colors={colors} />
              </View>
              <View style={{ width: '48%' }}>
                <TaxSummaryCard icon="tag" label="Top Category" value={highestCategory ? EXPENSE_CATEGORY_LABEL[highestCategory.category] : '—'} color={colors.mutedForeground} bgColor={colors.border} colors={colors} />
              </View>
              <View style={{ width: '48%' }}>
                <TaxSummaryCard icon="bar-chart-2" label="Avg Expense" value={fmt(data.avg_expense)} color={colors.mutedForeground} bgColor={colors.border} colors={colors} />
              </View>
            </View>

            <CrmSubHeading label="Expense Entries" colors={colors} />
              <SimpleTable
                colors={colors}
                columns={[
                  { key: 'date', label: 'Date', width: 70 },
                  { key: 'category', label: 'Category', width: 100 },
                  { key: 'payee', label: 'Payee', width: 120 },
                  { key: 'mode', label: 'Payment', width: 100 },
                  { key: 'amount', label: 'Amount', width: 90, align: 'right' },
                ]}
                rows={entries.map((e) => ({
                  date: formatShortDate(e.entry_date),
                  category: EXPENSE_CATEGORY_LABEL[e.category] ?? e.category,
                  payee: e.payee_name || '—',
                  mode: EXPENSE_PAYMENT_LABEL[e.payment_mode] ?? e.payment_mode,
                  amount: fmt(e.amount),
                }))}
              />
            

            <CrmSubHeading label="Expense Breakdown by Category" colors={colors} />
            <ExpenseCategoryBreakdown totals={byCategory} colors={colors} fmt={fmt} />

            <CrmSubHeading label="Payment Method Breakdown" colors={colors} />
            {byPaymentMode.length === 0 ? (
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontFamily: FONT_REGULAR }}>No data</Text>
            ) : (
              <SimpleTable
                colors={colors}
                columns={[
                  { key: 'method', label: 'Method', width: 100 },
                  { key: 'txns', label: 'Entries', width: 70, align: 'right' },
                  { key: 'amount', label: 'Amount', width: 90, align: 'right' },
                ]}
                rows={byPaymentMode.map((p) => ({
                  method: EXPENSE_PAYMENT_LABEL[p.payment_mode] ?? p.payment_mode,
                  txns: p.transaction_count,
                  amount: fmt(p.total_amount),
                }))}
              />
            )}

            <CrmSubHeading label="Expense Insights" colors={colors} />
            <View style={crmStyles.insightGrid}>
              <MiniInsightCard icon="tag" label="Top Category" value={highestCategory ? EXPENSE_CATEGORY_LABEL[highestCategory.category] : '—'} color={colors.primary} colors={colors} />
              <MiniInsightCard icon="trending-down" label="Highest Single Expense" value={highestSingleExpense ? fmt(highestSingleExpense.amount) : '—'} color={colors.destructive} colors={colors} />
              <MiniInsightCard icon="repeat" label="Most Used Payment" value={mostUsedPayment ? EXPENSE_PAYMENT_LABEL[mostUsedPayment.payment_mode] : '—'} color={colors.mutedForeground} colors={colors} />
              <MiniInsightCard icon="bar-chart-2" label="Avg per Entry" value={fmt(data.avg_expense)} color={colors.success} colors={colors} />
            </View>
          </>
        )}
      </ScrollView>
    </Card>
  );
}

function TaxReportSection({ colors, fmt }: { colors: any; fmt: (n: number) => string }) {
  const { business } = useBusiness();
  const todayStr = useMemo(() => toLocalISODate(new Date()), []);
  const [taxFromDate, setTaxFromDate] = useState(todayStr);
  const [taxToDate, setTaxToDate] = useState(todayStr);
  const [taxSearchTrigger, setTaxSearchTrigger] = useState(0);

  const taxParams = { business_id: business?.id as number, from: taxFromDate, to: taxToDate };

  const { data: taxSummary, isLoading: taxSummaryLoading } = useTaxReportSummary(taxParams, !!business?.id && taxSearchTrigger > 0);
  const { data: gstRateSummary, isLoading: gstRateLoading } = useGSTRateSummary(taxParams, !!business?.id && taxSearchTrigger > 0);
  const { data: invoiceGSTDetails, isLoading: invoiceGSTLoading } = useInvoiceGSTDetails(taxParams, !!business?.id && taxSearchTrigger > 0);

  const handleSearch = () => setTaxSearchTrigger((p) => p + 1);
  const handleReset = () => {
    const today = toLocalISODate(new Date());
    setTaxFromDate(today);
    setTaxToDate(today);
    setTaxSearchTrigger(0);
  };
  const handleExport = () => Alert.alert('Export', 'Export functionality coming soon');

  return (
    <Card colors={colors} height={CRM_CARD_HEIGHT} style={{ padding: 0 }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: LAYOUT.cardPadding }}>
        <TaxFilters
          fromDate={taxFromDate}
          toDate={taxToDate}
          onFromDateChange={setTaxFromDate}
          onToDateChange={setTaxToDate}
          onSearch={handleSearch}
          onReset={handleReset}
          onExport={handleExport}
          colors={colors}
        />

        {taxSearchTrigger > 0 && (
          <View style={taxStyles.summaryGrid}>
            {taxSummaryLoading ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: 12 }} />
            ) : taxSummary ? (
              <>
                <TaxSummaryCard icon="dollar-sign" label="Total GST Collected" value={fmt(taxSummary.total_gst)} sublabel={`From ${taxSummary.total_invoices} invoices`} color={colors.primary} bgColor={colors.primary + '15'} colors={colors} />
                <TaxSummaryCard icon="shopping-cart" label="Taxable Sales" value={fmt(taxSummary.total_taxable_sales)} color={colors.success} bgColor={colors.success + '15'} colors={colors} />
                <TaxSummaryCard icon="tag" label="Tax-Free Sales" value={fmt(taxSummary.total_tax_free_sales)} color={colors.mutedForeground} bgColor={colors.border} colors={colors} />
              </>
            ) : null}
          </View>
        )}

        {taxSearchTrigger > 0 && (
          <>
            <CrmSubHeading label="GST Summary by Rate" colors={colors} />
            {gstRateLoading ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: 12 }} />
            ) : gstRateSummary && gstRateSummary.length > 0 ? (
              <SimpleTable
                colors={colors}
                columns={[
                  { key: 'gstRate', label: 'GST Rate', width: 100 },
                  { key: 'taxableAmount', label: 'Taxable Amount', width: 130, align: 'right' },
                  { key: 'gstAmount', label: 'GST Amount', width: 120, align: 'right' },
                  { key: 'invoiceCount', label: 'Invoices', width: 90, align: 'right' },
                ]}
                rows={gstRateSummary.map((r) => ({
                  gstRate: `${r.gst_rate}%`,
                  taxableAmount: fmt(r.taxable_amount),
                  gstAmount: fmt(r.gst_amount),
                  invoiceCount: String(r.invoice_count),
                }))}
              />
            ) : (
              <Text style={{ color: colors.mutedForeground, fontSize: 12, textAlign: 'center', paddingVertical: 16 }}>
                No GST data found for selected period
              </Text>
            )}
          </>
        )}

        {taxSearchTrigger > 0 && (
          <>
            <CrmSubHeading label="Invoice GST Details" colors={colors} />
            {invoiceGSTLoading ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: 12 }} />
            ) : invoiceGSTDetails && invoiceGSTDetails.length > 0 ? (
                <SimpleTable
                  colors={colors}
                  columns={[
                    { key: 'invoiceNo', label: 'Invoice No', width: 110 },
                    { key: 'date', label: 'Date', width: 100 },
                    { key: 'customer', label: 'Customer', width: 140 },
                    { key: 'gstRate', label: 'GST %', width: 70, align: 'right' },
                    { key: 'gstAmount', label: 'GST Amount', width: 110, align: 'right' },
                    { key: 'totalAmount', label: 'Total', width: 110, align: 'right' },
                  ]}
                  rows={invoiceGSTDetails.map((r) => ({
                    invoiceNo: r.invoice_no,
                    date: formatShortDate(r.date),
                    customer: r.customer,
                    gstRate: `${r.gst_rate}%`,
                    gstAmount: fmt(r.gst_amount),
                    totalAmount: fmt(r.total_amount),
                  }))}
                />
            ) : (
              <Text style={{ color: colors.mutedForeground, fontSize: 12, textAlign: 'center', paddingVertical: 16 }}>
                No invoice GST details found for selected period
              </Text>
            )}
          </>
        )}
      </ScrollView>
    </Card>
  );
}

// =============================================================================
// PRODUCT SALES CHART
// =============================================================================

const CHART_COLORS = ['#5B8DEF', '#5FC9A3', '#F5A623', '#E4664B', '#9B7EDE'];

function ProductSalesBarChart({
  data,
  colors,
  fmt,
}: {
  data: { name: string; sales_amount: number }[];
  colors: any;
  fmt: (n: number) => string;
}) {
  const top = data.slice(0, 5);
  const max = Math.max(1, ...top.map((d) => d.sales_amount));
  return (
    <View style={{ gap: 10 }}>
      {top.map((d, i) => {
        const pct = Math.max(4, Math.round((d.sales_amount / max) * 100));
        const barColor = CHART_COLORS[i % CHART_COLORS.length];
        return (
          <View key={d.name}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
              <Text style={{ fontSize: 11, fontFamily: FONT_REGULAR, color: colors.foreground, flex: 1, paddingRight: 6 }} numberOfLines={1}>
                {d.name}
              </Text>
              <Text style={{ fontSize: 11, fontFamily: FONT_BOLD, fontWeight: '700', color: colors.foreground }}>
                {fmt(d.sales_amount)}
              </Text>
            </View>
            <View style={{ height: 7, borderRadius: 4, backgroundColor: colors.border, overflow: 'hidden' }}>
              <View style={{ width: `${pct}%`, height: '100%', borderRadius: 4, backgroundColor: barColor }} />
            </View>
          </View>
        );
      })}
    </View>
  );
}

// =============================================================================
// PURCHASE TABLE
// =============================================================================

function PurchaseTable({
  purchases,
  colors,
  fmt,
  onPay,
}: {
  purchases: PurchaseListItem[];
  colors: any;
  fmt: (n: number) => string;
  onPay: (p: PurchaseListItem) => void;
}) {
  return (
    <View>
      <View style={[purchaseTableStyles.headerRow, { borderBottomColor: colors.border }]}>
        <Text style={[purchaseTableStyles.headerCell, { flex: 0.8, color: colors.mutedForeground }]}>DATE</Text>
        <Text style={[purchaseTableStyles.headerCell, { flex: 1.1, color: colors.mutedForeground }]}>VENDOR</Text>
        <Text style={[purchaseTableStyles.headerCell, { flex: 1.5, color: colors.mutedForeground }]}>PRODUCT</Text>
        <Text style={[purchaseTableStyles.headerCell, { flex: 0.9, color: colors.mutedForeground, textAlign: 'right' }]}>AMOUNT</Text>
        <Text style={[purchaseTableStyles.headerCell, { flex: 1, color: colors.mutedForeground, textAlign: 'right' }]}>ACTION</Text>
      </View>

      {purchases.map((p, i) => {
        const productText = (p.product_names ?? []).length > 0 ? p.product_names.join(', ') : '—';
        return (
          <View
            key={p.id}
            style={[
              purchaseTableStyles.row,
              i < purchases.length - 1 ? { borderBottomWidth: 1, borderBottomColor: colors.border } : null,
            ]}
          >
            <Text style={[purchaseTableStyles.cell, { flex: 0.8, color: colors.mutedForeground }]} numberOfLines={1}>
              {formatShortDate(p.entry_date)}
            </Text>
            <Text style={[purchaseTableStyles.cell, { flex: 1.1, color: colors.foreground, fontFamily: FONT_BOLD, fontWeight: '700' }]} numberOfLines={1}>
              {p.vendor_name}
            </Text>
            <Text style={[purchaseTableStyles.cell, { flex: 1.5, color: colors.mutedForeground }]} numberOfLines={1}>
              {productText}
            </Text>
            <Text style={[purchaseTableStyles.cell, { flex: 0.9, color: colors.foreground, textAlign: 'right', fontFamily: FONT_BOLD, fontWeight: '700' }]}>
              {fmt(p.amount)}
            </Text>
            <View style={{ flex: 1, alignItems: 'flex-end' }}>
              {p.status === 'paid' ? (
                <View style={[purchaseTableStyles.paidBadge, { backgroundColor: colors.success + '18' }]}>
                  <Text style={{ color: colors.success, fontSize: 11, fontFamily: FONT_BOLD, fontWeight: '700' }}>Paid</Text>
                </View>
              ) : (
                <Pressable onPress={() => onPay(p)} style={[purchaseTableStyles.payBtn, { backgroundColor: colors.primary }]}>
                  <Text style={purchaseTableStyles.payBtnText}>Pay Now</Text>
                </Pressable>
              )}
            </View>
          </View>
        );
      })}
    </View>
  );
}

const PAYMENT_METHODS: { key: string; label: string; icon: any }[] = [
  { key: 'cash', label: 'Cash', icon: 'dollar-sign' },
  { key: 'bank_transfer', label: 'Bank Transfer', icon: 'credit-card' },
  { key: 'upi', label: 'UPI', icon: 'smartphone' },
  { key: 'cheque', label: 'Cheque', icon: 'file-text' },
];

function PayPurchaseModal({
  visible,
  purchase,
  colors,
  fmt,
  onClose,
  onConfirm,
  isSaving,
}: {
  visible: boolean;
  purchase: PurchaseListItem | null;
  colors: any;
  fmt: (n: number) => string;
  onClose: () => void;
  onConfirm: (methodLabel: string) => void;
  isSaving: boolean;
}) {
  const due = purchase ? purchase.amount - purchase.amount_paid : 0;
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  useEffect(() => {
    if (visible) setSelectedMethod(null);
  }, [visible, purchase?.id]);

  if (!purchase) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={[modalStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[modalStyles.title, { color: colors.foreground }]}>Pay {purchase.vendor_name}</Text>
          <Text style={[modalStyles.subtitle, { color: colors.mutedForeground }]}>
            Due amount: {fmt(due)}
          </Text>

          <Text style={[modalStyles.label, { color: colors.mutedForeground }]}>Payment method</Text>
          <View style={modalStyles.methodRow}>
            {PAYMENT_METHODS.map((m) => {
              const active = selectedMethod === m.label;
              return (
                <Pressable
                  key={m.key}
                  onPress={() => setSelectedMethod(m.label)}
                  style={[
                    modalStyles.methodChip,
                    {
                      borderColor: active ? colors.primary : colors.border,
                      backgroundColor: active ? colors.primary + '15' : 'transparent',
                    },
                  ]}
                >
                  <Feather name={m.icon} size={13} color={active ? colors.primary : colors.mutedForeground} style={{ marginRight: 6 }} />
                  <Text style={{ fontSize: 12, fontFamily: FONT_REGULAR, color: active ? colors.primary : colors.foreground }}>
                    {m.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={modalStyles.buttonRow}>
            <Pressable onPress={onClose} style={[modalStyles.cancelBtn, { borderColor: colors.border }]}>
              <Text style={{ color: colors.foreground, fontFamily: FONT_BOLD, fontWeight: '700' }}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                if (selectedMethod) onConfirm(selectedMethod);
              }}
              disabled={isSaving || !selectedMethod}
              style={[modalStyles.confirmBtn, { backgroundColor: colors.primary, opacity: isSaving || !selectedMethod ? 0.5 : 1 }]}
            >
              {isSaving ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={{ color: '#fff', fontFamily: FONT_BOLD, fontWeight: '700' }}>Mark as Paid</Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ---- Tax Report Components ----
function TaxSummaryCard({ 
  icon, 
  label, 
  value, 
  sublabel, 
  color, 
  bgColor,
  colors 
}: {
  icon: any;
  label: string;
  value: string;
  sublabel?: string;
  color: string;
  bgColor: string;
  colors: any;
}) {
  return (
    <View style={[taxStyles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[taxStyles.summaryIconWrap, { backgroundColor: bgColor }]}>
        <Feather name={icon} size={18} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[taxStyles.summaryLabel, { color: colors.mutedForeground }]}>{label}</Text>
        <Text style={[taxStyles.summaryValue, { color: color }]}>{value}</Text>
        {sublabel && (
          <Text style={[taxStyles.summarySublabel, { color: colors.mutedForeground }]}>{sublabel}</Text>
        )}
      </View>
    </View>
  );
}

function TaxFilters({
  fromDate,
  toDate,
  onFromDateChange,
  onToDateChange,
  onSearch,
  onReset,
  onExport,
  colors,
}: {
  fromDate: string;
  toDate: string;
  onFromDateChange: (date: string) => void;
  onToDateChange: (date: string) => void;
  onSearch: () => void;
  onReset: () => void;
  onExport: () => void;
  colors: any;
}) {
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);

  const toISO = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const renderDateField = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    show: boolean,
    setShow: (v: boolean) => void,
  ) => {
    if (Platform.OS === 'web') {
      return (
        <View style={taxStyles.filterField}>
          <Text style={[taxStyles.filterLabel, { color: colors.mutedForeground }]}>{label}</Text>
          {/* @ts-ignore — raw HTML input valid only on web build */}
          <input
            type="date"
            value={value}
            onChange={(e: any) => onChange(e.target.value)}
            style={{
              border: `1px solid ${colors.border}`,
              borderRadius: 8,
              padding: 8,
              fontSize: 13,
              fontFamily: FONT_REGULAR,
              backgroundColor: colors.background,
              color: colors.foreground,
              width: '100%',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </View>
      );
    }
    return (
      <View style={taxStyles.filterField}>
        <Text style={[taxStyles.filterLabel, { color: colors.mutedForeground }]}>{label}</Text>
        <Pressable
          onPress={() => setShow(true)}
          style={[taxStyles.filterInput, { borderColor: colors.border, backgroundColor: colors.background, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
        >
          <Text style={{ color: colors.foreground, fontFamily: FONT_REGULAR }}>{value}</Text>
          <Feather name="calendar" size={14} color={colors.mutedForeground} />
        </Pressable>
        {show && (
          <DateTimePicker
            value={new Date(value)}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(event, selectedDate) => {
              setShow(Platform.OS === 'ios');
              if (selectedDate) onChange(toISO(selectedDate));
            }}
          />
        )}
      </View>
    );
  };

  return (
    <View style={taxStyles.filterContainer}>
      <View style={taxStyles.filterRow}>
        {renderDateField('From Date', fromDate, onFromDateChange, showFromPicker, setShowFromPicker)}
        {renderDateField('To Date', toDate, onToDateChange, showToPicker, setShowToPicker)}
        <View style={taxStyles.filterActions}>
          <Pressable onPress={onSearch} style={[taxStyles.filterBtn, { backgroundColor: colors.primary }]}>
            <Feather name="search" size={14} color="#fff" />
            <Text style={taxStyles.filterBtnText}>Search</Text>
          </Pressable>
          <Pressable onPress={onReset} style={[taxStyles.filterBtn, { backgroundColor: colors.border }]}>
            <Feather name="refresh-cw" size={14} color={colors.foreground} />
            <Text style={[taxStyles.filterBtnText, { color: colors.foreground }]}>Reset</Text>
          </Pressable>
          <Pressable onPress={onExport} style={[taxStyles.filterBtn, { backgroundColor: colors.success }]}>
            <Feather name="download" size={14} color="#fff" />
            <Text style={taxStyles.filterBtnText}>Export</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// =============================================================================
// MAIN SCREEN
// =============================================================================

export default function ReportsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { width: winWidth } = useWindowDimensions();
  const isWide = winWidth >= 760;
  const { business } = useBusiness();
  const currency = business?.currency;
  const fmt = (n: number) => formatCurrency(n, currency);
  const queryClient = useQueryClient();

  // ---- Tax Report state - MUST BE BEFORE ANY CONDITIONAL RETURNS ----
  const todayStr = useMemo(() => toLocalISODate(new Date()), []);
  const [taxFromDate, setTaxFromDate] = useState(todayStr);
  const [taxToDate, setTaxToDate] = useState(todayStr);
  const [taxSearchTrigger, setTaxSearchTrigger] = useState(0);

  // ---- Real data ----
  const summaryParams = { business_id: business?.id as number };
  const { data: summary, isLoading } = useGetReportSummary(summaryParams, {
    query: { enabled: !!business?.id, queryKey: getGetReportSummaryQueryKey(summaryParams) },
  });

  // ---- Tax Report hooks - MUST BE CALLED EVERY RENDER ----
  const taxSummaryParams = {
    business_id: business?.id as number,
    from: taxFromDate,
    to: taxToDate,
  };
  
  const { data: taxSummary, isLoading: taxSummaryLoading } = useTaxReportSummary(
    taxSummaryParams,
    !!business?.id && taxSearchTrigger > 0
  );

  const { data: gstRateSummary, isLoading: gstRateLoading } = useGSTRateSummary(
    taxSummaryParams,
    !!business?.id && taxSearchTrigger > 0
  );

  const { data: invoiceGSTDetails, isLoading: invoiceGSTLoading } = useInvoiceGSTDetails(
    taxSummaryParams,
    !!business?.id && taxSearchTrigger > 0
  );

  // ---- ALL OTHER HOOKS (BEFORE ANY RETURN) ----
  const topCustomersParams = { business_id: business?.id as number, limit: 20 };
  const { data: topCustomers } = useGetTopCustomers(topCustomersParams, {
    query: { enabled: !!business?.id, queryKey: getGetTopCustomersQueryKey(topCustomersParams) },
  });

  const vendorsParams = { business_id: business?.id as number, limit: 20 };
  const { data: vendorsResponse } = useListVendors(vendorsParams, {
    query: { enabled: !!business?.id, queryKey: getListVendorsQueryKey(vendorsParams) },
  });
  const vendors = vendorsResponse?.data;

  const employeeParams = { business_id: business?.id };
  const { data: employeePerformance, isLoading: employeeLoading } = useReportEmployeePerformance(
    employeeParams,
    !!business?.id,
  );

  const productsParams = { business_id: business?.id as number, limit: 500 };
  const { data: productsResponse } = useListProducts(productsParams, {
    query: { enabled: !!business?.id, queryKey: getListProductsQueryKey(productsParams) },
  });
  const products: Product[] | undefined = productsResponse?.data;

  // ---- Local UI state ----
  const [salesPeriod, setSalesPeriod] = useState<PeriodKey>('today');
  const [inventoryCategory, setInventoryCategory] = useState<string>('All');
  const [productSalesCategory, setProductSalesCategory] = useState<string>('All');
  const [productSalesTab, setProductSalesTab] = useState<'top' | 'bottom'>('top');

  // Sales Report
  const apiSalesFilter = periodToApiFilter(salesPeriod);
  const salesTxnParams = {
    business_id: business?.id as number,
    filter: apiSalesFilter,
    type: 'you_got' as const,
    limit: 1000,
  };
  const {
    data: salesTxnResponse,
    isLoading: salesTxnLoading,
    isError: salesTxnError,
  } = useListTransactions(salesTxnParams, {
    query: { enabled: !!business?.id, queryKey: getListTransactionsQueryKey(salesTxnParams) },
  });

  // All-time sales transactions — used for Customer Report totals (independent of Sales Report period filter)
const allTimeSalesParams = {
  business_id: business?.id as number,
  filter: 'all' as const,
  type: 'you_got' as const,
  limit: 1000,
};
const { data: allTimeSalesResponse } = useListTransactions(allTimeSalesParams, {
  query: { enabled: !!business?.id, queryKey: getListTransactionsQueryKey(allTimeSalesParams) },
});
  // Payment Report
  const { data: paymentsCollected } = useReportPaymentMethods({ business_id: business?.id, type: 'you_got' }, !!business?.id);
  const { data: paymentsPaid } = useReportPaymentMethods({ business_id: business?.id, type: 'you_gave' }, !!business?.id);

  // Daily Closing
  const todayISO = useMemo(() => toLocalISODate(new Date()), []);
  const {
    data: cashbookData,
    isLoading: cashbookLoading,
    isError: cashbookError,
  } = useReportCashbook({ business_id: business?.id, from: todayISO, to: todayISO }, !!business?.id);

  // Purchases
  const {
    data: purchasesResponse,
    isLoading: purchasesLoading,
    isError: purchasesError,
  } = useListPurchases({ business_id: business?.id, limit: 20 }, !!business?.id);

  // Product Sales
  const [productSalesPeriod, setProductSalesPeriod] = useState<PeriodKey>('today');
  const [productSalesView, setProductSalesView] = useState<'table' | 'chart'>('table');
  const productSalesDateRange = periodToDateRange(productSalesPeriod);
 const {
  data: productSalesData,
  isLoading: productSalesLoading,
  isError: productSalesError,
} = useReportProductSales(
  { business_id: business?.id, filter: productSalesPeriod },
  !!business?.id,
);

  // Pay flow
  const [payingPurchase, setPayingPurchase] = useState<PurchaseListItem | null>(null);
  const updatePurchase = useUpdatePurchase();

  // ---- Memoized values ----
  // const employeeRows = useMemo(() => {
  //   const employees = employeePerformance ?? [];
  //   return [...employees]
  //     .sort((a, b) => b.sales - a.sales)
  //     .map((e) => ({ name: e.name, bills: e.bills, sales: fmt(e.sales) }));
  // }, [employeePerformance]);

  // Replace the old `employeeRows` useMemo with this richer version
const employeeStats = useMemo(() => {
  const employees = employeePerformance ?? [];
  const sortedBySales = [...employees].sort((a, b) => b.sales - a.sales);
  const sortedByBills = [...employees].sort((a, b) => b.bills - a.bills);
  const totalBills = employees.reduce((sum, e) => sum + e.bills, 0);
  const totalSales = employees.reduce((sum, e) => sum + e.sales, 0);
  return {
    totalEmployees: employees.length,
    totalBills,
    totalSales,
    avgBillValue: totalBills ? totalSales / totalBills : 0,
    best: sortedBySales[0] ?? null,
    mostBills: sortedByBills[0] ?? null,
    top5: sortedBySales.slice(0, 5).map((e) => ({
      name: e.name,
      bills: e.bills,
      sales: fmt(e.sales),
      avgBill: fmt(e.bills ? e.sales / e.bills : 0),
    })),
  };
}, [employeePerformance]);

// Add alongside it — payment analytics derived from paymentsCollected / paymentsPaid
const paymentStats = useMemo(() => {
  const collected = [...(paymentsCollected?.payment_methods ?? [])].sort((a, b) => b.total_amount - a.total_amount);
  const paidOut = paymentsPaid?.payment_methods ?? [];
  const totalCollected = collected.reduce((s, p) => s + p.total_amount, 0);
  const totalPaid = paidOut.reduce((s, p) => s + p.total_amount, 0);
  const totalTxns =
    collected.reduce((s, p) => s + p.transaction_count, 0) + paidOut.reduce((s, p) => s + p.transaction_count, 0);
  return {
    collected,
    totalCollected,
    totalPaid,
    totalTxns,
    netCollection: totalCollected - totalPaid,
    mostUsed: [...collected].sort((a, b) => b.transaction_count - a.transaction_count)[0] ?? null,
    highest: collected[0] ?? null,
    avgTxnValue: totalTxns ? (totalCollected + totalPaid) / totalTxns : 0,
  };
}, [paymentsCollected, paymentsPaid]);

  const productUnitById = useMemo(() => {
    const map = new Map<number, string>();
    (products ?? []).forEach((p: any) => {
      if (p?.id != null && p?.unit) map.set(p.id, p.unit);
    });
    return map;
  }, [products]);

  const topCustomersSorted = useMemo(() => {
    if (!topCustomers) return topCustomers;
    return [...topCustomers].sort((a, b) => (b.transaction_count ?? 0) - (a.transaction_count ?? 0)).slice(0, TOP_LIST_LIMIT);
  }, [topCustomers]);

  const topVendors = useMemo(() => (vendors ? vendors.slice(0, TOP_LIST_LIMIT) : vendors), [vendors]);

  const salesReal = useMemo(() => {
    const txns = salesTxnResponse?.data ?? [];
    const totalRevenue = txns.reduce((sum, t) => sum + t.amount, 0);
    const totalOrders = txns.length;
    return {
      totalOrders,
      totalRevenue,
      netSales: totalRevenue,
      avgOrderValue: totalOrders ? totalRevenue / totalOrders : 0,
    };
  }, [salesTxnResponse]);

  const salesDateRange = periodToDateRange(salesPeriod);
  // const {
  //   data: paymentMethodsData,
  //   isLoading: paymentMethodsLoading,
  //   isError: paymentMethodsError,
  // } = useReportPaymentMethods(
  //   { business_id: business?.id, from: salesDateRange.from, to: salesDateRange.to, type: 'you_got' },
  //   !!business?.id,
  // );

const {
  data: paymentMethodsData,
  isLoading: paymentMethodsLoading,
  isError: paymentMethodsError,
} = useReportPaymentMethods(
  { business_id: business?.id, filter: salesPeriod, type: 'you_got' },
  !!business?.id,
);
  const productSalesFiltered = useMemo(() => {
    if (!productSalesData) return productSalesData;
    if (productSalesCategory === 'All') return productSalesData;
    return productSalesData.filter((p) => (p.category ?? 'Uncategorised') === productSalesCategory);
  }, [productSalesData, productSalesCategory]);

  const topProductSales = useMemo(() => {
    if (!productSalesFiltered) return productSalesFiltered;
    const sorted = [...productSalesFiltered].sort((a, b) => b.sales_amount - a.sales_amount);
    return productSalesTab === 'top' ? sorted.slice(0, 10) : sorted.slice(-10).reverse();
  }, [productSalesFiltered, productSalesTab]);

  // Products with zero recorded sales this period — genuine "dead stock"
  // candidates, distinct from just "low sales_amount" bottom performers.
  const noSaleProducts = useMemo(() => {
    if (!products) return [];
    const soldIds = new Set((productSalesData ?? []).map((s) => s.product_id));
    const base = productSalesCategory === 'All' ? products : products.filter((p: any) => p?.category === productSalesCategory);
    return base.filter((p) => !soldIds.has(p.id)).map((p) => p.name);
  }, [products, productSalesData, productSalesCategory]);

  // (old un-filtered inventory metrics removed — see inventoryStockQty/inventoryStockValue below,
  // which respect the category filter)

  // ---- Product categories (shared by Inventory + Product Sales filters) ----
  const productCategories = useMemo(() => {
    const set = new Set<string>();
    (products ?? []).forEach((p: any) => {
      if (p?.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // ---- Inventory: category-filtered metrics ----
  const inventoryProducts = useMemo(() => {
    const all = products ?? [];
    return inventoryCategory === 'All' ? all : all.filter((p: any) => p?.category === inventoryCategory);
  }, [products, inventoryCategory]);

  const inventoryOutOfStock = useMemo(() => inventoryProducts.filter((p) => p.stock_qty === 0).map((p) => p.name), [inventoryProducts]);
  const inventoryLowStock = useMemo(
    () => inventoryProducts.filter((p) => p.stock_qty > 0 && p.stock_qty <= (p.low_stock_alert ?? 5)),
    [inventoryProducts],
  );
  const inventoryStockQty = useMemo(() => inventoryProducts.reduce((sum, p) => sum + p.stock_qty, 0), [inventoryProducts]);
  const inventoryStockValue = useMemo(
    () => inventoryProducts.reduce((sum, p) => sum + p.stock_qty * p.selling_price, 0),
    [inventoryProducts],
  );

  // Category-wise stock value breakdown, for a quick visual of where stock is tied up.
  const categoryBreakdown = useMemo(() => {
    const map = new Map<string, { qty: number; value: number }>();
    (products ?? []).forEach((p: any) => {
      const cat = p?.category || 'Uncategorised';
      const entry = map.get(cat) ?? { qty: 0, value: 0 };
      entry.qty += p.stock_qty ?? 0;
      entry.value += (p.stock_qty ?? 0) * (p.selling_price ?? 0);
      map.set(cat, entry);
    });
    const totalValue = Array.from(map.values()).reduce((s, e) => s + e.value, 0) || 1;
    return Array.from(map.entries())
      .map(([category, e]) => ({ category, ...e, pct: Math.round((e.value / totalValue) * 100) }))
      .sort((a, b) => b.value - a.value);
  }, [products]);

  // Reorder suggestions — for low-stock items, estimate a week's worth of
  // demand from this period's sales velocity (qty_sold / period days).
  // Falls back to "top up to 2x the alert threshold" when there's no sales
  // history yet for that product.
  const reorderSuggestions = useMemo(() => {
    const salesByProductId = new Map((productSalesData ?? []).map((s) => [s.product_id, s]));
    const days = periodToDays(productSalesPeriod);
    return inventoryLowStock
      .map((p) => {
        const sales = salesByProductId.get(p.id);
        const velocityPerDay = sales ? sales.qty_sold / days : 0;
        const demandNextWeek = Math.ceil(velocityPerDay * 7);
        const fallback = Math.max((p.low_stock_alert ?? 5) * 2 - p.stock_qty, p.low_stock_alert ?? 5);
        const suggestedQty = Math.max(demandNextWeek - p.stock_qty, demandNextWeek > 0 ? 0 : fallback, 1);
        return { id: p.id, name: p.name, stockQty: p.stock_qty, unit: p.unit, suggestedQty };
      })
      .sort((a, b) => b.suggestedQty - a.suggestedQty);
  }, [inventoryLowStock, productSalesData, productSalesPeriod]);

  // ---- Customer Report computed data ----
const customerPurchaseTotals = useMemo(() => {
  const map = new Map<number, number>();
  (allTimeSalesResponse?.data ?? []).forEach((t: any) => {
    const custId = t.customer_id; // ⚠️ verify this field name — check below
    if (custId == null) return;
    map.set(custId, (map.get(custId) ?? 0) + t.amount);
  });
  return map;
}, [allTimeSalesResponse]);

const customerTotalSpend = (c: TopCustomer) => customerPurchaseTotals.get(c.id) ?? 0;

const topCustomersByPurchase = useMemo(() => {
  if (!topCustomers) return [];
  return [...topCustomers].sort((a, b) => customerTotalSpend(b) - customerTotalSpend(a)).slice(0, 5);
}, [topCustomers]);

const outstandingCustomers = useMemo(() => {
  if (!topCustomers) return [];
  return [...topCustomers]
    .filter((c) => (c.current_balance ?? 0) > 0)
    .sort((a, b) => (b.current_balance ?? 0) - (a.current_balance ?? 0))
    .slice(0, 5);
}, [topCustomers]);

const recentCustomers = useMemo(() => (topCustomers ?? []).slice(0, 5), [topCustomers]);

const customerKpis = useMemo(() => {
  const list = topCustomers ?? [];
  const totalCustomers = list.length;
  const activeCustomers = list.filter((c) => (c.transaction_count ?? 0) > 0).length;
  const outstandingBalance = list.reduce((sum, c) => sum + Math.max(0, c.current_balance ?? 0), 0);
  const totalSpendSum = list.reduce((sum, c) => sum + customerTotalSpend(c), 0);
  return {
    totalCustomers,
    activeCustomers,
    outstandingBalance,
    avgPurchaseValue: totalCustomers ? totalSpendSum / totalCustomers : 0,
  };
}, [topCustomers]);

const customerAnalytics = useMemo(() => {
  const list = topCustomers ?? [];
  if (list.length === 0) return null;
  return {
    highestPurchase: [...list].sort((a, b) => customerTotalSpend(b) - customerTotalSpend(a))[0],
    mostFrequent: [...list].sort((a, b) => (b.transaction_count ?? 0) - (a.transaction_count ?? 0))[0],
    highestOutstanding: [...list].sort((a, b) => (b.current_balance ?? 0) - (a.current_balance ?? 0))[0],
  };
}, [topCustomers]);

// ---- Vendor Report computed data ----
const vendorPurchaseTotals = useMemo(() => {
  const map = new Map<number, { totalPurchased: number; totalDue: number; orderCount: number; lastDate?: string }>();
  (purchasesResponse?.data ?? []).forEach((p) => {
    const prev = map.get(p.vendor_id) ?? { totalPurchased: 0, totalDue: 0, orderCount: 0, lastDate: undefined };
    prev.totalPurchased += p.amount;
    prev.totalDue += p.amount - p.amount_paid;
    prev.orderCount += 1;
    if (!prev.lastDate || p.entry_date > prev.lastDate) prev.lastDate = p.entry_date;
    map.set(p.vendor_id, prev);
  });
  return map;
}, [purchasesResponse]);

const vendorRows = useMemo(() => (vendors ?? []).map((v) => ({ vendor: v, totals: vendorPurchaseTotals.get(v.id) })), [vendors, vendorPurchaseTotals]);

const topVendorsByPurchase = useMemo(
  () => [...vendorRows].sort((a, b) => (b.totals?.totalPurchased ?? 0) - (a.totals?.totalPurchased ?? 0)).slice(0, 5),
  [vendorRows],
);

const pendingVendorPayments = useMemo(
  () => vendorRows.filter((r) => (r.totals?.totalDue ?? 0) > 0).sort((a, b) => (b.totals?.totalDue ?? 0) - (a.totals?.totalDue ?? 0)).slice(0, 5),
  [vendorRows],
);

const recentPurchases = useMemo(
  () => [...(purchasesResponse?.data ?? [])].sort((a, b) => (a.entry_date < b.entry_date ? 1 : -1)).slice(0, 5),
  [purchasesResponse],
);

const vendorKpis = useMemo(() => {
  const totalVendors = vendors?.length ?? 0;
  const activeVendors = vendorRows.filter((r) => (r.totals?.orderCount ?? 0) > 0).length;
  const totalPurchaseAmount = (purchasesResponse?.data ?? []).reduce((sum, p) => sum + p.amount, 0);
  const pendingPayments = (purchasesResponse?.data ?? []).reduce((sum, p) => sum + (p.amount - p.amount_paid), 0);
  return { totalVendors, activeVendors, totalPurchaseAmount, pendingPayments };
}, [vendors, vendorRows, purchasesResponse]);

const vendorAnalytics = useMemo(() => {
  if (vendorRows.length === 0) return null;
  const topVendor = [...vendorRows].sort((a, b) => (b.totals?.totalPurchased ?? 0) - (a.totals?.totalPurchased ?? 0))[0];
  const avgPurchase = vendorRows.reduce((sum, r) => sum + (r.totals?.totalPurchased ?? 0), 0) / vendorRows.length;
  return { topVendor, avgPurchase };
}, [vendorRows]);

  // ---- Handlers ----
  const handleConfirmPay = (methodLabel: string) => {
    if (!payingPurchase) return;
    updatePurchase.mutate(
      {
        id: payingPurchase.id,
        data: {
          amount_paid: payingPurchase.amount,
          description: `Paid via ${methodLabel}`,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['purchases'], exact: false });
          setPayingPurchase(null);
        },
        onError: () => {},
      },
    );
  };

  const handleTaxSearch = () => {
    setTaxSearchTrigger((prev) => prev + 1);
  };

  const handleTaxReset = () => {
    const today = toLocalISODate(new Date());
    setTaxFromDate(today);
    setTaxToDate(today);
    setTaxSearchTrigger(0);
  };

  const handleTaxExport = () => {
    Alert.alert('Export', 'Export functionality coming soon');
  };

  // ---- THIS MUST BE THE LAST THING BEFORE RETURN ----
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 80, paddingHorizontal: 16 }}
    >
      <View style={styles.pageInner}>
        {/* ================= HEADER WITH NET BALANCE INLINE ================= */}
        <View style={styles.headerRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <Text style={[styles.title, { color: colors.foreground }]}>Reports</Text>
            <View style={[styles.netBalanceChip, { backgroundColor: (summary?.net_balance ?? 0) >= 0 ? colors.success + '15' : colors.destructive + '15' }]}>
              <View style={[styles.netBalanceDot, { backgroundColor: (summary?.net_balance ?? 0) >= 0 ? colors.success : colors.destructive }]} />
              <Text style={[styles.netBalanceChipLabel, { color: colors.mutedForeground }]}>Net</Text>
              <Text style={[styles.netBalanceChipValue, { color: (summary?.net_balance ?? 0) >= 0 ? colors.success : colors.destructive }]}>
                {fmt(summary?.net_balance ?? 0)}
              </Text>
            </View>
          </View>
          <View style={[styles.headerBadge, { backgroundColor: colors.primary + '15' }]}>
            <Feather name="bar-chart-2" size={18} color={colors.primary} />
          </View>
        </View>

        {/* Subtitle */}
        <Text style={[styles.subtitle, { color: colors.mutedForeground, marginBottom: 14 }]}>
          {business?.business_name ? `${business.business_name} · ` : ''}{todayLabel()}
        </Text>

        {/* ================= 1 & 4. SALES REPORT + PURCHASE REPORT ================= */}
        <TwoColRow
          isWide={isWide}
          left={
            <>
              <View style={{ marginBottom: 6 }}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Sales Report</Text>
              </View>
              <Card colors={colors} style={{ justifyContent: 'space-between' }}>
                <View>
                  <ChipRow
                    colors={colors}
                    selected={salesPeriod}
                    onSelect={(k) => setSalesPeriod(k as PeriodKey)}
                    options={[
                      { key: 'today', label: 'Today' },
                      { key: 'week', label: 'This Week' },
                      { key: 'month', label: 'This Month' },
                    ]}
                  />
                  {salesTxnLoading ? (
                    <ActivityIndicator color={colors.primary} style={{ marginVertical: 6 }} />
                  ) : salesTxnError ? (
                    <Text style={{ color: colors.destructive, fontSize: 12, fontFamily: FONT_REGULAR, marginBottom: 6 }}>
                      Couldn't load sales data
                    </Text>
                  ) : (
                    <KpiGrid
                      colors={colors}
                      items={[
                        { label: 'Total Orders', value: String(salesReal.totalOrders) },
                        { label: 'Total Revenue', value: fmt(salesReal.totalRevenue) },
                        { label: 'Net Sales', value: fmt(salesReal.netSales), color: colors.success },
                        { label: 'Avg Order Value', value: fmt(salesReal.avgOrderValue) },
                      ]}
                    />
                  )}
                </View>

                <View style={{ marginTop: 6 }}>
                  <Text style={[styles.subHeading, { color: colors.foreground }]}>Payment Method Wise Sales</Text>
                  {paymentMethodsLoading ? (
                    <ActivityIndicator color={colors.primary} style={{ marginVertical: 6 }} />
                  ) : paymentMethodsError ? (
                    <Text style={{ color: colors.destructive, fontSize: 12, fontFamily: FONT_REGULAR }}>
                      Couldn't load payment method data
                    </Text>
                  ) : (
                    <KeyValueList
                      colors={colors}
                      rows={(paymentMethodsData?.payment_methods ?? []).map((p) => ({
                        label: PAYMENT_MODE_LABEL[p.payment_mode],
                        value: fmt(p.total_amount),
                      }))}
                    />
                  )}
                </View>
                
              </Card>
            </>
          }
          right={
            <>
              <View style={{ marginBottom: 6 }}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Purchase Report</Text>
              </View>
              <Card colors={colors} style={{ padding: purchasesResponse?.data.length ? 0 : LAYOUT.cardPadding, justifyContent: purchasesResponse?.data.length ? 'flex-start' : 'center' }}>
                {purchasesLoading ? (
                  <ActivityIndicator color={colors.primary} style={{ marginVertical: 6 }} />
                ) : purchasesError ? (
                  <Text style={{ color: colors.destructive, fontSize: 12, fontFamily: FONT_REGULAR }}>
                    Couldn't load purchases
                  </Text>
                ) : !purchasesResponse?.data.length ? (
                  <EmptyState
                    icon="shopping-bag"
                    title="No purchases yet"
                    subtitle="Purchases you record from vendors will appear here"
                  />
                ) : (
                  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: LAYOUT.cardPadding }}>
                    <PurchaseTable
                      purchases={purchasesResponse.data}
                      colors={colors}
                      fmt={fmt}
                      onPay={setPayingPurchase}
                    />
                  </ScrollView>
                )}
              </Card>
            </>
          }
        />

        {/* ================= 2 & 3. INVENTORY REPORT + PRODUCT SALES REPORT ================= */}
        <TwoColRow
          isWide={isWide}
          left={
            <>
              <View style={{ marginBottom: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Inventory Report</Text>
                <ExportButton
                  colors={colors}
                  onPress={() =>
                    exportCsv(
                      'inventory-report.csv',
                      [
                        { key: 'name', label: 'Product' },
                        { key: 'category', label: 'Category' },
                        { key: 'stock', label: 'Stock Qty' },
                        { key: 'value', label: 'Stock Value' },
                      ],
                      inventoryProducts.map((p: any) => ({
                        name: p.name,
                        category: p.category ?? 'Uncategorised',
                        stock: p.stock_qty,
                        value: (p.stock_qty ?? 0) * (p.selling_price ?? 0),
                      })),
                    )
                  }
                />
              </View>
              <Card colors={colors} height={520} style={{ justifyContent: 'flex-start' }}>
                <ChipRow
                  colors={colors}
                  selected={inventoryCategory}
                  onSelect={setInventoryCategory}
                  options={productCategories.map((c) => ({ key: c, label: c }))}
                />
                <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                  <KpiGrid
                    colors={colors}
                    items={[
                      { label: 'Current Stock', value: String(inventoryStockQty) },
                      { label: 'Stock Value', value: fmt(inventoryStockValue) },
                    ]}
                  />

                  <Text style={[styles.subHeading, { color: colors.foreground }]}>Stock Value by Category</Text>
                  <View style={{ gap: 14 }}>
                    {categoryBreakdown.slice(0, 6).map((c) => (
                      <View key={c.category}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                          <Text style={{ fontSize: 11, fontFamily: FONT_REGULAR, color: colors.foreground, flex: 1 }} numberOfLines={1}>
                            {c.category}
                          </Text>
                          <Text style={{ fontSize: 11, fontFamily: FONT_BOLD, fontWeight: '700', color: colors.foreground }}>
                            {fmt(c.value)} · {c.pct}%
                          </Text>
                        </View>
                        <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.border, overflow: 'hidden' }}>
                          <View style={{ width: `${Math.max(c.pct, 3)}%`, height: '100%', borderRadius: 3, backgroundColor: colors.primary }} />
                        </View>
                      </View>
                    ))}
                  </View>

                  <View style={styles.stockRow}>
                    <View style={[styles.stockCol, { borderColor: colors.border }]}>
                      <Text style={[styles.subHeading, { color: colors.foreground, marginTop: 0 }]}>Out of Stock</Text>
                      <TagRow tags={inventoryOutOfStock} colors={colors} tone="destructive" />
                    </View>
                    <View style={[styles.stockCol, { borderColor: colors.border }]}>
                      <Text style={[styles.subHeading, { color: colors.foreground, marginTop: 0 }]}>Low Stock</Text>
                      <TagRow tags={inventoryLowStock.map((p) => p.name)} colors={colors} tone="warning" />
                    </View>
                  </View>

                  <Text style={[styles.subHeading, { color: colors.foreground }]}>Reorder Suggestions</Text>
                  {reorderSuggestions.length === 0 ? (
                    <Text style={{ fontSize: 11.5, fontFamily: FONT_REGULAR, color: colors.mutedForeground }}>
                      Nothing needs reordering right now.
                    </Text>
                  ) : (
                    <SimpleTable
                      colors={colors}
                      columns={[
                        { key: 'name', label: 'Product', width: 120 },
                        { key: 'stock', label: 'In Stock', width: 80, align: 'right' },
                        { key: 'suggested', label: 'Reorder', width: 80, align: 'right' },
                      ]}
                      rows={reorderSuggestions.map((r) => ({
                        name: r.name,
                        stock: formatQty(r.stockQty, r.unit),
                        suggested: formatQty(r.suggestedQty, r.unit),
                      }))}
                    />
                  )}
                </ScrollView>
                
              </Card>
            </>
          }
          right={
            <>
              <View style={{ marginBottom: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Product Sales Report</Text>
                <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
                  <ExportButton
                    colors={colors}
                    onPress={() =>
                      exportCsv(
                        'product-sales-report.csv',
                        [
                          { key: 'name', label: 'Product' },
                          { key: 'category', label: 'Category' },
                          { key: 'qtySold', label: 'Qty Sold' },
                          { key: 'sales', label: 'Sales' },
                          { key: 'profit', label: 'Profit' },
                          { key: 'profitPct', label: 'Profit %' },
                        ],
                        (productSalesFiltered ?? []).map((p) => ({
                          name: p.name,
                          category: p.category ?? 'Uncategorised',
                          qtySold: p.qty_sold,
                          sales: p.sales_amount,
                          profit: p.profit,
                          profitPct: p.sales_amount ? ((p.profit / p.sales_amount) * 100).toFixed(1) : '0',
                        })),
                      )
                    }
                  />
                  <Pressable
                    onPress={() => setProductSalesView('table')}
                    style={[
                      styles.viewToggleBtn,
                      { backgroundColor: productSalesView === 'table' ? colors.primary + '15' : 'transparent' },
                    ]}
                  >
                    <Feather name="list" size={13} color={productSalesView === 'table' ? colors.primary : colors.mutedForeground} />
                  </Pressable>
                  <Pressable
                    onPress={() => setProductSalesView('chart')}
                    style={[
                      styles.viewToggleBtn,
                      { backgroundColor: productSalesView === 'chart' ? colors.primary + '15' : 'transparent' },
                    ]}
                  >
                    <Feather name="bar-chart-2" size={13} color={productSalesView === 'chart' ? colors.primary : colors.mutedForeground} />
                  </Pressable>
                </View>
              </View>
              <Card colors={colors} height={520} style={{ justifyContent: 'flex-start' }}>
                <ChipRow
                  colors={colors}
                  selected={productSalesCategory}
                  onSelect={setProductSalesCategory}
                  options={productCategories.map((c) => ({ key: c, label: c }))}
                />
                <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
                  <Pressable
                    onPress={() => setProductSalesTab('top')}
                    style={[
                      styles.filterChip,
                      { backgroundColor: productSalesTab === 'top' ? colors.success : 'transparent', borderWidth: 1, borderColor: colors.border },
                    ]}
                  >
                    <Text style={{ fontSize: 11.5, fontFamily: FONT_BOLD, color: productSalesTab === 'top' ? '#fff' : colors.mutedForeground }}>
                      Top performers
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setProductSalesTab('bottom')}
                    style={[
                      styles.filterChip,
                      { backgroundColor: productSalesTab === 'bottom' ? colors.destructive : 'transparent', borderWidth: 1, borderColor: colors.border },
                    ]}
                  >
                    <Text style={{ fontSize: 11.5, fontFamily: FONT_BOLD, color: productSalesTab === 'bottom' ? '#fff' : colors.mutedForeground }}>
                      Bottom performers
                    </Text>
                  </Pressable>
                </View>

                <ChipRow
                  colors={colors}
                  selected={productSalesPeriod}
                  onSelect={(k) => setProductSalesPeriod(k as PeriodKey)}
                  options={[
                    { key: 'today', label: 'Today' },
                    { key: 'week', label: 'This Week' },
                    { key: 'month', label: 'This Month' },
                  ]}
                />
                <View style={{ flex: 1 }}>
                  {productSalesLoading ? (
                    <ActivityIndicator color={colors.primary} style={{ marginVertical: 6 }} />
                  ) : productSalesError ? (
                    <Text style={{ color: colors.destructive, fontSize: 12, fontFamily: FONT_REGULAR }}>Couldn't load product sales data</Text>
                  ) : !topProductSales?.length ? (
                    <EmptyState icon="package" title="No sales yet" subtitle="Product-wise sales will show up here once you bill a customer" />
                  ) : productSalesView === 'chart' ? (
                    <ProductSalesBarChart data={topProductSales} colors={colors} fmt={fmt} />
                  ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                      <SimpleTable
                        colors={colors}
                        columns={[
                          { key: 'date', label: 'Date', width: 60 },
                          { key: 'name', label: 'Product', width: 100 },
                          { key: 'qtySold', label: 'Qty', width: 60, align: 'right' },
                          { key: 'salesAmount', label: 'Sales', width: 70, align: 'right' },
                          { key: 'profit', label: 'Profit', width: 70, align: 'right' },
                          { key: 'profitPct', label: 'Margin', width: 65, align: 'right' },
                        ]}
                        rows={topProductSales.map((p) => ({
                          date: formatShortDate(p.last_sale_date),
                          name: p.name,
                          qtySold: formatQty(p.qty_sold, p.unit ?? productUnitById.get(p.product_id)),
                          salesAmount: fmt(p.sales_amount),
                          profit: fmt(p.profit),
                          profitPct: p.sales_amount ? `${((p.profit / p.sales_amount) * 100).toFixed(0)}%` : '—',
                        }))}
                      />
                      {noSaleProducts.length > 0 && (
                        <>
                          <Text style={[styles.subHeading, { color: colors.foreground }]}>No Sales This Period</Text>
                          <TagRow tags={noSaleProducts.slice(0, 15)} colors={colors} tone="muted" />
                        </>
                      )}
                    </ScrollView>
                  )}
                </View>
              
              </Card>
            </>
          }
        />

        {/* ================= 5 & 6. CUSTOMER REPORT + VENDORS REPORT ================= */}
       <TwoColRow
  isWide={isWide}
  left={
    <>
      <View style={{ marginBottom: 6 }}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Customer Report</Text>
      </View>
      <Card colors={colors} height={CRM_CARD_HEIGHT} style={{ padding: 0 }}>
        {!topCustomers || topCustomers.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', padding: 8 }}>
            <EmptyState icon="award" title="No customers yet" subtitle="Top customers appear once you record billing entries" />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: LAYOUT.cardPadding }}>
            {/* -- KPI Summary -- */}
            <View style={crmStyles.kpiGrid}>
              <View style={{ width: '48%' }}>
                <TaxSummaryCard icon="users" label="Total Customers" value={String(customerKpis.totalCustomers)} color={colors.primary} bgColor={colors.primary + '15'} colors={colors} />
              </View>
              <View style={{ width: '48%' }}>
                <TaxSummaryCard icon="user-check" label="Active Customers" value={String(customerKpis.activeCustomers)} color={colors.success} bgColor={colors.success + '15'} colors={colors} />
              </View>
              <View style={{ width: '48%' }}>
                <TaxSummaryCard icon="alert-circle" label="Outstanding Balance" value={fmt(customerKpis.outstandingBalance)} color={colors.destructive} bgColor={colors.destructive + '15'} colors={colors} />
              </View>
              <View style={{ width: '48%' }}>
                <TaxSummaryCard icon="trending-up" label="Avg Purchase Value" value={fmt(customerKpis.avgPurchaseValue)} color={colors.mutedForeground} bgColor={colors.border} colors={colors} />
              </View>
            </View>

            {/* -- Top Customers -- */}
            <CrmSubHeading label="Top Customers" colors={colors} />
            {topCustomersByPurchase.length === 0 ? (
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontFamily: FONT_REGULAR }}>No data</Text>
            ) : (
              <SimpleTable
                colors={colors}
                columns={[
                  { key: 'name', label: 'Customer', width: 110 },
                  { key: 'bills', label: 'Bills', width: 55, align: 'right' },
                  { key: 'total', label: 'Total Purchase', width: 105, align: 'right' },
                  { key: 'due', label: 'Outstanding', width: 95, align: 'right' },
                ]}
                rows={topCustomersByPurchase.map((c) => ({
                  name: c.name,
                  bills: c.transaction_count ?? 0,
                  total: fmt(customerTotalSpend(c)),
                  due: fmt(c.current_balance ?? 0),
                }))}
              />
            )}

            {/* -- Outstanding Customers -- */}
            <CrmSubHeading label="Outstanding Customers" colors={colors} />
            {outstandingCustomers.length === 0 ? (
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontFamily: FONT_REGULAR }}>No pending dues</Text>
            ) : (
              outstandingCustomers.map((c, i) => {
                const status = dueStatus(c.current_balance ?? 0, customerTotalSpend(c) || (c.current_balance ?? 0));
                return (
                  <View key={c.id} style={[styles.kvRow, i < outstandingCustomers.length - 1 ? { borderBottomWidth: 1, borderBottomColor: colors.border } : null]}>
                    <Text style={[styles.kvLabel, { color: colors.foreground }]} numberOfLines={1}>{c.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={[styles.kvValue, { color: colors.foreground, fontFamily: FONT_BOLD, fontWeight: '700' }]}>{fmt(c.current_balance ?? 0)}</Text>
                      <StatusBadge label={status.label} tone={status.tone} colors={colors} />
                    </View>
                  </View>
                );
              })
            )}

            {/* -- Recent Customers -- */}
            <CrmSubHeading label="Recent Customers" colors={colors} />
            {recentCustomers.length === 0 ? (
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontFamily: FONT_REGULAR }}>No data</Text>
            ) : (
              <SimpleTable
                colors={colors}
                columns={[
                  { key: 'name', label: 'Customer', width: 120 },
                  { key: 'date', label: 'Last Purchase', width: 100 },
                  { key: 'amount', label: 'Amount', width: 90, align: 'right' },
                ]}
                rows={recentCustomers.map((c) => ({
                  name: c.name,
                  date: formatShortDate((c as any).last_purchase_date ?? null),
                  amount: fmt(customerTotalSpend(c)),
                }))}
              />
            )}

            {/* -- Customer Analytics -- */}
            <CrmSubHeading label="Customer Analytics" colors={colors} />
            {customerAnalytics && (
              <View style={crmStyles.insightGrid}>
                <MiniInsightCard icon="award" label="Highest Purchase" value={customerAnalytics.highestPurchase.name} color={colors.primary} colors={colors} />
                <MiniInsightCard icon="repeat" label="Most Frequent" value={customerAnalytics.mostFrequent.name} color={colors.success} colors={colors} />
                <MiniInsightCard icon="alert-triangle" label="Highest Outstanding" value={customerAnalytics.highestOutstanding.name} color={colors.destructive} colors={colors} />
                <MiniInsightCard icon="bar-chart-2" label="Avg Bill Value" value={fmt(customerKpis.avgPurchaseValue)} color={colors.mutedForeground} colors={colors} />
              </View>
            )}

           
          </ScrollView>
        )}
      </Card>
    </>
  }
  right={
    <>
      <View style={{ marginBottom: 6 }}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Vendors Report</Text>
      </View>
      <Card colors={colors} height={CRM_CARD_HEIGHT} style={{ padding: 0 }}>
        {!vendors || vendors.length === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', padding: 8 }}>
            <EmptyState icon="truck" title="No vendors yet" subtitle="Add a vendor to see them listed here" />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: LAYOUT.cardPadding }}>
            {/* -- KPI Summary -- */}
            <View style={crmStyles.kpiGrid}>
              <View style={{ width: '48%' }}>
                <TaxSummaryCard icon="truck" label="Total Vendors" value={String(vendorKpis.totalVendors)} color={colors.primary} bgColor={colors.primary + '15'} colors={colors} />
              </View>
              <View style={{ width: '48%' }}>
                <TaxSummaryCard icon="check-circle" label="Active Vendors" value={String(vendorKpis.activeVendors)} color={colors.success} bgColor={colors.success + '15'} colors={colors} />
              </View>
              <View style={{ width: '48%' }}>
                <TaxSummaryCard icon="shopping-bag" label="Total Purchase" value={fmt(vendorKpis.totalPurchaseAmount)} color={colors.mutedForeground} bgColor={colors.border} colors={colors} />
              </View>
              <View style={{ width: '48%' }}>
                <TaxSummaryCard icon="alert-circle" label="Pending Payments" value={fmt(vendorKpis.pendingPayments)} color={colors.destructive} bgColor={colors.destructive + '15'} colors={colors} />
              </View>
            </View>

            {/* -- Vendor Purchase Table -- */}
            <CrmSubHeading label="Vendor Purchases" colors={colors} />
            <SimpleTable
              colors={colors}
              columns={[
                { key: 'name', label: 'Vendor', width: 100 },
                { key: 'orders', label: 'Orders', width: 60, align: 'right' },
                { key: 'amount', label: 'Purchase Amount', width: 110, align: 'right' },
                { key: 'due', label: 'Pending', width: 90, align: 'right' },
              ]}
              rows={topVendorsByPurchase.map((r) => ({
                name: r.vendor.name,
                orders: r.totals?.orderCount ?? 0,
                amount: fmt(r.totals?.totalPurchased ?? 0),
                due: fmt(r.totals?.totalDue ?? 0),
              }))}
            />

            {/* -- Pending Payments -- */}
            <CrmSubHeading label="Pending Payments" colors={colors} />
            {pendingVendorPayments.length === 0 ? (
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontFamily: FONT_REGULAR }}>No pending payments</Text>
            ) : (
              pendingVendorPayments.map((r, i) => {
                const status = dueStatus(r.totals?.totalDue ?? 0, r.totals?.totalPurchased ?? 0);
                return (
                  <View key={r.vendor.id} style={[styles.kvRow, i < pendingVendorPayments.length - 1 ? { borderBottomWidth: 1, borderBottomColor: colors.border } : null]}>
                    <Text style={[styles.kvLabel, { color: colors.foreground }]} numberOfLines={1}>{r.vendor.name}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={[styles.kvValue, { color: colors.foreground, fontFamily: FONT_BOLD, fontWeight: '700' }]}>{fmt(r.totals?.totalDue ?? 0)}</Text>
                      <StatusBadge label={status.label} tone={status.tone} colors={colors} />
                    </View>
                  </View>
                );
              })
            )}

            {/* -- Recent Purchases -- */}
            <CrmSubHeading label="Recent Purchases" colors={colors} />
            {recentPurchases.length === 0 ? (
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontFamily: FONT_REGULAR }}>No purchases yet</Text>
            ) : (
              <SimpleTable
                colors={colors}
                columns={[
                  { key: 'vendor', label: 'Vendor', width: 100 },
                  { key: 'invoice', label: 'Invoice No', width: 90 },
                  { key: 'date', label: 'Date', width: 70 },
                  { key: 'amount', label: 'Amount', width: 85, align: 'right' },
                ]}
                rows={recentPurchases.map((p) => ({
                  vendor: p.vendor_name,
                  invoice: p.invoice_no ?? '—',
                  date: formatShortDate(p.entry_date),
                  amount: fmt(p.amount),
                }))}
              />
            )}

            {/* -- Vendor Analytics -- */}
            <CrmSubHeading label="Vendor Analytics" colors={colors} />
            {vendorAnalytics && (
              <View style={crmStyles.insightGrid}>
                <MiniInsightCard icon="award" label="Top Vendor" value={vendorAnalytics.topVendor.vendor.name} color={colors.primary} colors={colors} />
                <MiniInsightCard icon="trending-up" label="Highest Purchase" value={fmt(vendorAnalytics.topVendor.totals?.totalPurchased ?? 0)} color={colors.success} colors={colors} />
                <MiniInsightCard icon="bar-chart-2" label="Avg Purchase" value={fmt(vendorAnalytics.avgPurchase)} color={colors.mutedForeground} colors={colors} />
                <MiniInsightCard icon="alert-circle" label="Pending Payments" value={fmt(vendorKpis.pendingPayments)} color={colors.destructive} colors={colors} />
              </View>
            )}

          
          </ScrollView>
        )}
      </Card>
    </>
  }
/>

        {/* ================= 7 & 8. EMPLOYEE REPORT + PAYMENT REPORT ================= */}
       {/* ================= 7 & 8. EMPLOYEE REPORT + PAYMENT REPORT ================= */}
<TwoColRow
  isWide={isWide}
  left={
    <>
      <View style={{ marginBottom: 6 }}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Employee Report</Text>
      </View>
      <Card colors={colors} height={EMP_PAY_CARD_HEIGHT} style={{ padding: 0 }}>
        {employeeLoading ? (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : employeeStats.totalEmployees === 0 ? (
          <View style={{ flex: 1, justifyContent: 'center', padding: 8 }}>
            <EmptyState icon="user" title="No staff yet" subtitle="Add staff members to see their performance here" />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: LAYOUT.cardPadding }}>
            {/* -- KPI Summary -- */}
            <View style={crmStyles.kpiGrid}>
              <View style={{ width: '48%' }}>
                <TaxSummaryCard icon="users" label="Total Employees" value={String(employeeStats.totalEmployees)} color={colors.primary} bgColor={colors.primary + '15'} colors={colors} />
              </View>
              <View style={{ width: '48%' }}>
                <TaxSummaryCard icon="file-text" label="Total Bills" value={String(employeeStats.totalBills)} color={colors.success} bgColor={colors.success + '15'} colors={colors} />
              </View>
              <View style={{ width: '48%' }}>
                <TaxSummaryCard icon="trending-up" label="Total Sales" value={fmt(employeeStats.totalSales)} color={colors.mutedForeground} bgColor={colors.border} colors={colors} />
              </View>
              <View style={{ width: '48%' }}>
                <TaxSummaryCard icon="award" label="Best Performer" value={employeeStats.best?.name ?? '—'} color={colors.destructive} bgColor={colors.destructive + '15'} colors={colors} />
              </View>
            </View>

            {/* -- Top Performer highlight -- */}
            {employeeStats.best && (
              <View style={[empStyles.highlightCard, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '30' }]}>
                <View style={[empStyles.trophyWrap, { backgroundColor: colors.primary + '20' }]}>
                  <Feather name="award" size={20} color={colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[empStyles.highlightName, { color: colors.foreground }]} numberOfLines={1}>
                    {employeeStats.best.name}
                  </Text>
                  <Text style={[empStyles.highlightMeta, { color: colors.mutedForeground }]}>
                    {employeeStats.best.bills} bills · {fmt(employeeStats.best.sales)}
                  </Text>
                </View>
                <View style={[styles.badge, { backgroundColor: colors.primary + '18' }]}>
                  <Text style={[styles.badgeText, { color: colors.primary, fontFamily: FONT_BOLD, fontWeight: '700' }]}>Top Performer</Text>
                </View>
              </View>
            )}

            {/* -- Top 5 Employees table -- */}
            <CrmSubHeading label="Top 5 Employees" colors={colors} />
            <SimpleTable
              colors={colors}
              columns={[
                { key: 'name', label: 'Employee', width: 100 },
                { key: 'bills', label: 'Bills', width: 55, align: 'right' },
                { key: 'sales', label: 'Sales', width: 85, align: 'right' },
                { key: 'avgBill', label: 'Avg Bill', width: 85, align: 'right' },
              ]}
              rows={employeeStats.top5}
            />

            {/* -- Analytics -- */}
            <CrmSubHeading label="Employee Analytics" colors={colors} />
            <View style={crmStyles.insightGrid}>
              <MiniInsightCard icon="trending-up" label="Highest Sales" value={employeeStats.best?.name ?? '—'} color={colors.primary} colors={colors} />
              <MiniInsightCard icon="file-text" label="Most Bills" value={employeeStats.mostBills?.name ?? '—'} color={colors.success} colors={colors} />
              <MiniInsightCard icon="bar-chart-2" label="Avg Bill Value" value={fmt(employeeStats.avgBillValue)} color={colors.mutedForeground} colors={colors} />
              <MiniInsightCard icon="users" label="Total Team Sales" value={fmt(employeeStats.totalSales)} color={colors.destructive} colors={colors} />
            </View>

           
          </ScrollView>
        )}
      </Card>
    </>
  }
  right={
    <>
      <View style={{ marginBottom: 6 }}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Payment Report</Text>
      </View>
      <Card colors={colors} height={EMP_PAY_CARD_HEIGHT} style={{ padding: 0 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: LAYOUT.cardPadding }}>
          {/* -- KPI Summary -- */}
          <View style={crmStyles.kpiGrid}>
            <View style={{ width: '48%' }}>
              <TaxSummaryCard icon="dollar-sign" label="Net Collection" value={fmt(paymentStats.netCollection)} color={colors.primary} bgColor={colors.primary + '15'} colors={colors} />
            </View>
            <View style={{ width: '48%' }}>
              <TaxSummaryCard icon="arrow-down-circle" label="Money Received" value={fmt(paymentStats.totalCollected)} color={colors.success} bgColor={colors.success + '15'} colors={colors} />
            </View>
            <View style={{ width: '48%' }}>
              <TaxSummaryCard icon="arrow-up-circle" label="Money Paid" value={fmt(paymentStats.totalPaid)} color={colors.destructive} bgColor={colors.destructive + '15'} colors={colors} />
            </View>
            <View style={{ width: '48%' }}>
              <TaxSummaryCard icon="hash" label="Total Transactions" value={String(paymentStats.totalTxns)} color={colors.mutedForeground} bgColor={colors.border} colors={colors} />
            </View>
          </View>

          {/* -- Payment Method Breakdown -- */}
          <CrmSubHeading label="Payment Method Breakdown" colors={colors} />
          {paymentStats.collected.length === 0 ? (
            <Text style={{ color: colors.mutedForeground, fontSize: 11, fontFamily: FONT_REGULAR }}>No data</Text>
          ) : (
            <SimpleTable
              colors={colors}
              columns={[
                { key: 'method', label: 'Method', width: 90 },
                { key: 'txns', label: 'Txns', width: 55, align: 'right' },
                { key: 'amount', label: 'Collected', width: 90, align: 'right' },
              ]}
              rows={paymentStats.collected.map((p) => ({
                method: PAYMENT_MODE_LABEL[p.payment_mode],
                txns: p.transaction_count,
                amount: fmt(p.total_amount),
              }))}
            />
          )}

          {/* -- Payment Distribution bars -- */}
          <CrmSubHeading label="Payment Distribution" colors={colors} />
          {paymentStats.collected.length === 0 ? (
            <Text style={{ color: colors.mutedForeground, fontSize: 11, fontFamily: FONT_REGULAR }}>No data</Text>
          ) : (
            <View style={{ gap: 12 }}>
              {paymentStats.collected.map((p, i) => {
                const pct = paymentStats.totalCollected ? Math.round((p.total_amount / paymentStats.totalCollected) * 100) : 0;
                const barColor = CHART_COLORS[i % CHART_COLORS.length];
                return (
                  <View key={p.payment_mode}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 3 }}>
                      <Text style={{ fontSize: 11, fontFamily: FONT_REGULAR, color: colors.foreground }}>
                        {PAYMENT_MODE_LABEL[p.payment_mode]}
                      </Text>
                      <Text style={{ fontSize: 11, fontFamily: FONT_BOLD, fontWeight: '700', color: colors.foreground }}>
                        {fmt(p.total_amount)} · {pct}%
                      </Text>
                    </View>
                    <View style={{ height: 7, borderRadius: 4, backgroundColor: colors.border, overflow: 'hidden' }}>
                      <View style={{ width: `${Math.max(pct, 3)}%`, height: '100%', borderRadius: 4, backgroundColor: barColor }} />
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {/* -- Today's Collection -- */}
          <CrmSubHeading label="Today's Collection" colors={colors} />
          <KeyValueList
            colors={colors}
            rows={[
              { label: 'Collected Today', value: fmt(cashbookData?.total_income ?? 0), color: colors.success },
              { label: 'Paid Out Today', value: fmt(cashbookData?.total_expense ?? 0), color: colors.destructive },
              { label: 'Net Today', value: fmt(cashbookData?.net ?? 0) },
            ]}
          />

          {/* -- Analytics -- */}
          <CrmSubHeading label="Payment Analytics" colors={colors} />
          <View style={crmStyles.insightGrid}>
            <MiniInsightCard icon="repeat" label="Most Used Method" value={paymentStats.mostUsed ? PAYMENT_MODE_LABEL[paymentStats.mostUsed.payment_mode] : '—'} color={colors.primary} colors={colors} />
            <MiniInsightCard icon="trending-up" label="Highest Collection" value={paymentStats.highest ? PAYMENT_MODE_LABEL[paymentStats.highest.payment_mode] : '—'} color={colors.success} colors={colors} />
            <MiniInsightCard icon="bar-chart-2" label="Avg Txn Value" value={fmt(paymentStats.avgTxnValue)} color={colors.mutedForeground} colors={colors} />
            <MiniInsightCard icon="hash" label="Total Transactions" value={String(paymentStats.totalTxns)} color={colors.destructive} colors={colors} />
          </View>
        </ScrollView>
      </Card>
    </>
  }
/>

        {/* ================= 9 & 10. EXPENSE REPORT + TAX REPORT ================= */}
        <TwoColRow
          isWide={isWide}
          left={
            <>
              <View style={{ marginBottom: 6 }}>
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Expense Report</Text>
              </View>
               <ExpenseReportSection colors={colors} fmt={fmt} />
            </>
          }
          
          right={
  <>
    <View style={{ marginBottom: 6 }}>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Tax Report</Text>
    </View>
    <TaxReportSection colors={colors} fmt={fmt} />
  </>
}
        />

       {/* ================= 11 & 12. PROFIT & LOSS + RETURN ================= */}
<TwoColRow
  isWide={isWide}
  left={
    <>
      <View style={{ marginBottom: 6 }}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Profit & Loss Report</Text>
      </View>
      <ProfitLossReportSection colors={colors} fmt={fmt} />
    </>
  }
  right={
    <>
      <View style={{ marginBottom: 6 }}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Return Report</Text>
      </View>
      <ReturnReportSection colors={colors} fmt={fmt} />
    </>
  }
/>

        {/* ================= DAILY CLOSING REPORT ================= */}
        <View style={{ marginBottom: 6 }}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Daily Closing Report</Text>
        </View>
        <Card colors={colors} height={DAILY_CLOSING_HEIGHT}>
          {cashbookLoading ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 6 }} />
          ) : cashbookError ? (
            <Text style={{ color: colors.destructive, fontSize: 12, fontFamily: FONT_REGULAR }}>Couldn't load today's cashbook</Text>
          ) : (
            <>
              <KeyValueList
                colors={colors}
                rows={[
                  { label: 'Collected (You Got)', value: fmt(cashbookData?.total_income ?? 0), color: colors.success },
                  { label: 'Paid Out (You Gave)', value: fmt(cashbookData?.total_expense ?? 0), color: colors.destructive },
                ]}
              />
              <View style={[styles.divider, { backgroundColor: colors.border, marginVertical: 6 }]} />
              <View style={styles.statRow}>
                <Text style={[styles.statLabel, { color: colors.foreground, fontFamily: FONT_BOLD, fontWeight: '700' }]}>Net</Text>
                <Text style={[styles.statValue, { color: (cashbookData?.net ?? 0) >= 0 ? colors.success : colors.destructive }]}>
                  {fmt(cashbookData?.net ?? 0)}
                </Text>
              </View>
            </>
          )}
          <Text style={[styles.mockNote, { color: colors.mutedForeground, marginTop: 6, marginBottom: 0 }]}>
            * Opening cash, card/UPI split and physical cash-in-drawer reconciliation aren't tracked yet — this shows today's You Got vs You Gave totals.
          </Text>
        </Card>
      </View>

      <PayPurchaseModal
        visible={!!payingPurchase}
        purchase={payingPurchase}
        colors={colors}
        fmt={fmt}
        onClose={() => setPayingPurchase(null)}
        onConfirm={handleConfirmPay}
        isSaving={updatePurchase.isPending}
      />
    </ScrollView>
  );
}

// =============================================================================
// STYLES
// =============================================================================
const styles = StyleSheet.create({
  pageInner: { width: '100%', maxWidth: 1180, alignSelf: 'center' },

  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  headerBadge: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontFamily: FONT_BOLD, fontWeight: '700', letterSpacing: 0.2 },
  subtitle: { fontSize: 12, fontFamily: FONT_REGULAR },

  card: { padding: LAYOUT.cardPadding, borderWidth: StyleSheet.hairlineWidth, overflow: 'hidden' },

  divider: { height: 1, marginVertical: 4 },

  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 },
  statLabel: { fontSize: 13, fontFamily: FONT_REGULAR },
  statValue: { fontSize: 16, fontFamily: FONT_BOLD, fontWeight: '700' },

  sectionHeaderRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: LAYOUT.cardToHeaderGap, marginTop: 4 },
  sectionTitle: { fontSize: 15, fontFamily: FONT_BOLD, fontWeight: '700' },
  sectionSublabel: { fontSize: 11.5, fontFamily: FONT_REGULAR, marginTop: 2 },

  row: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, paddingHorizontal: LAYOUT.cardPadding },
  rankBadge: { width: 20, height: 20, borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
  rankText: { fontSize: 10, fontFamily: FONT_BOLD, fontWeight: '700' },
  rowName: { fontSize: 13.5, fontFamily: FONT_BOLD, fontWeight: '700' },
  rowMeta: { fontSize: 11, fontFamily: FONT_REGULAR, marginTop: 1 },

  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  kpiItem: { width: '50%', paddingVertical: 6, paddingHorizontal: 8 },
  kpiLabel: { fontSize: 9.5, fontFamily: FONT_REGULAR, marginBottom: 2, textTransform: 'uppercase', letterSpacing: 0.4 },
  kpiValue: { fontSize: 15, fontFamily: FONT_BOLD, fontWeight: '700' },

  stockRow: { flexDirection: 'row', gap: 14, marginTop: 6 },
  stockCol: { flex: 1, borderLeftWidth: StyleSheet.hairlineWidth, paddingLeft: 10 },

  chipRow: { gap: 6, paddingBottom: 8, alignItems: 'center'},
  filterChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 14, alignSelf: 'flex-start' },
  filterChipText: { fontSize: 11.5 },

  viewToggleBtn: { width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },

  mockNote: { fontSize: 10, fontFamily: FONT_REGULAR, fontStyle: 'italic', marginTop: 3, marginBottom: 2, lineHeight: 13 },
  subHeading: { fontSize: 11, fontFamily: FONT_BOLD, fontWeight: '700', marginTop: 20, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.4 },

  badge: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: 14, alignSelf: 'flex-start' },
  badgeText: { fontSize: 10, fontFamily: FONT_REGULAR },

  tableHeaderRow: { flexDirection: 'row', borderBottomWidth: 1, paddingBottom: LAYOUT.headerVertical, marginBottom: 4 },
  tableHeaderCell: { fontSize: 9.5, fontFamily: FONT_REGULAR, textTransform: 'uppercase', letterSpacing: 0.3 },
  tableRow: { flexDirection: 'row', paddingVertical: LAYOUT.rowVertical },
  tableCell: { fontSize: 11.5, fontFamily: FONT_REGULAR },

  kvRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: LAYOUT.rowVertical },
  kvLabel: { fontSize: 12, fontFamily: FONT_REGULAR },
  kvValue: { fontSize: 12.5 },

  netBalanceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 5,
  },
  netBalanceDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  netBalanceChipLabel: {
    fontSize: 10,
    fontFamily: FONT_REGULAR,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  netBalanceChipValue: {
    fontSize: 14,
    fontFamily: FONT_BOLD,
    fontWeight: '700',
  },

  exportBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const purchaseTableStyles = StyleSheet.create({
  headerRow: { flexDirection: 'row', borderBottomWidth: 1, paddingBottom: LAYOUT.headerVertical, marginBottom: 4 },
  headerCell: { fontSize: 9.5, fontFamily: FONT_REGULAR, textTransform: 'uppercase', letterSpacing: 0.3 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: LAYOUT.rowVertical },
  cell: { fontSize: 11, fontFamily: FONT_REGULAR, paddingRight: 5 },
  payBtn: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 4 },
  payBtnText: { color: '#fff', fontSize: 10.5, fontFamily: FONT_BOLD, fontWeight: '700' },
  paidBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 14 },
});

const taxStyles = StyleSheet.create({
  filterContainer: {
    marginBottom: 14,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    alignItems: 'flex-end',
  },
  filterField: {
    flex: 1,
    minWidth: 140,
  },
  filterLabel: {
    fontSize: 11,
    fontFamily: FONT_REGULAR,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  filterInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    fontFamily: FONT_REGULAR,
  },
  filterActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    paddingBottom: 1,
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterBtnText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: FONT_BOLD,
    fontWeight: '600',
  },
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 14,
  },
  summaryCard: {
    flex: 1,
    minWidth: 180,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
  },
  summaryIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    fontFamily: FONT_REGULAR,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  summaryValue: {
    fontSize: 18,
    fontFamily: FONT_BOLD,
    fontWeight: '700',
  },
  summarySublabel: {
    fontSize: 10,
    fontFamily: FONT_REGULAR,
    marginTop: 1,
  },
  tableCard: {
    marginBottom: 14,
    padding: LAYOUT.cardPadding,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
  },
});

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 420, borderWidth: StyleSheet.hairlineWidth, borderRadius: 14, padding: 20 },
  title: { fontSize: 17, fontFamily: FONT_BOLD, fontWeight: '700', marginBottom: 6 },
  subtitle: { fontSize: 12.5, fontFamily: FONT_REGULAR, marginBottom: 16 },
  label: { fontSize: 12.5, fontFamily: FONT_REGULAR, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    fontFamily: FONT_REGULAR,
    marginBottom: 20,
  },
  methodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  methodChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1,
  },
  buttonRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  cancelBtn: { paddingHorizontal: 18, paddingVertical: 11, borderRadius: 8, borderWidth: 1 },
  confirmBtn: { paddingHorizontal: 18, paddingVertical: 11, borderRadius: 8, minWidth: 150, alignItems: 'center', justifyContent: 'center' },
});

const insightStyles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    width: '48%',
  },
  iconWrap: { width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 9.5, fontFamily: FONT_REGULAR, textTransform: 'uppercase', letterSpacing: 0.3 },
  value: { fontSize: 12.5, fontFamily: FONT_BOLD, fontWeight: '700', marginTop: 1 },
});

const crmStyles = StyleSheet.create({
  kpiGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 4 },
  insightGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 6 },
});
const empStyles = StyleSheet.create({
  highlightCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 14,
    marginBottom: 6,
  },
  trophyWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  highlightName: { fontSize: 13.5, fontFamily: FONT_BOLD, fontWeight: '700' },
  highlightMeta: { fontSize: 11, fontFamily: FONT_REGULAR, marginTop: 1 },
});