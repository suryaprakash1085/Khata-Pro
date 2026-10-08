import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
import { EmptyState } from '@/components/EmptyState';
import { formatCurrency } from '@/lib/format';
import { paymentModeLabel } from '@/lib/billReceiptHelpers';
import { BillReceiptModal } from '@/components/BillReceiptModal';
import {
  useListTransactions,
  getListTransactionsQueryKey,
  customFetch,
} from '@workspace/api-client-react';
import { useAuth } from '@/contexts/AuthContext';

// ---------------------------------------------------------------------------
// Font
// ---------------------------------------------------------------------------
const FONT_FAMILY = Platform.OS === 'web' ? 'Times New Roman' : 'serif';

// Desktop dashboard kicks in above this width; below it we keep the
// existing mobile card list (same breakpoint used elsewhere in the app).
const DESKTOP_BREAKPOINT = 860;

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type TransactionType = 'you_gave' | 'you_got';

interface ApiTransaction {
  id: number;
  business_id: number;
  customer_id: number;
  customer_name: string;
  type: TransactionType;
  amount: number;
  balance_after: number;
  description: string | null;
  bill_image_url: string | null;
  payment_mode: string;
  invoice_no: string | null;
  entry_date: string;
  due_date: string | null;
  created_by: number;
  created_at: string;
}

type DateFilter = 'all' | 'today' | 'week' | 'month';
type BillStatus = 'paid' | 'partially_paid' | 'pending';

interface BillRow {
  id: number;
  invoiceNumber: string;
  customerId: number;
  customerName: string;
  amount: number;
  paidAmount: number;
  status: BillStatus;
  paymentMode: string;
  entryDate: string;
  createdAt: string;
  description: string;
  // Filled in after fetching /api/returns and matching by transaction id —
  // undefined/0 means no return recorded against this bill.
  returnedQty?: number;
  returnedAmount?: number;
  refundedAmount?: number;   // portion settled as cash back to the customer
  exchangedAmount?: number;  // portion settled as "took a different product instead"
}

const LIMIT = 100;

// ---- All returns for this business — fetched once and matched to bills by
// transaction_id, so the Billing List can show a "Return" tag on any bill
// that has had a product returned against it. ----
interface ReturnRecord {
  id: number;
  transaction_id: number;
  product_id: number;
  qty: number;
  return_amount: number;
  reason: string;
  refunded: boolean;
  entry_date: string;
}

function useAllReturns(params: { business_id?: number }, enabled: boolean) {
  return useQuery<ReturnRecord[]>({
    queryKey: ['returns', 'all', params],
    enabled,
    queryFn: () => {
      const search = new URLSearchParams();
      if (params.business_id) search.set('business_id', String(params.business_id));
      search.set('limit', '1000');
      return customFetch<ReturnRecord[]>(`/api/returns?${search.toString()}`, { responseType: 'json' });
    },
  });
}

const STATUS_META: Record<BillStatus, { label: string; color: string; bg: string }> = {
  paid: { label: 'Paid', color: '#15803D', bg: '#DCFCE7' },
  partially_paid: { label: 'Partially Paid', color: '#B45309', bg: '#FEF3C7' },
  pending: { label: 'Pending', color: '#B91C1C', bg: '#FEE2E2' },
};

const DATE_FILTERS: { value: DateFilter; label: string }[] = [
  { value: 'all', label: 'All Dates' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

type StatusFilter = 'all' | BillStatus;
const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'paid', label: 'Paid' },
  { value: 'partially_paid', label: 'Partially Paid' },
  { value: 'pending', label: 'Pending' },
];

// ---------------------------------------------------------------------------
// Description parsing helpers
// ---------------------------------------------------------------------------
const PAYMENT_INVOICE_REGEX = /invoice\s+([A-Za-z]+-\d+)/i;

// Best-effort item count from the free-text description (comma separated
// item list). Falls back to "-" when the bill has no description at all —
// there's no dedicated items-count field on the transaction yet.
function itemsCountLabel(description: string) {
  const trimmed = description.trim();
  if (!trimmed) return '-';
  const count = trimmed.split(',').filter((p) => p.trim().length > 0).length;
  return `${count} item${count === 1 ? '' : 's'}`;
}

// "02 Sep 2025, 06:16 PM" style formatting for the Date & Time column —
// date comes from entry_date, time comes from created_at (entry_date has
// no time component of its own).
function formatDateTime(entryDate: string, createdAt: string) {
  const datePart = (() => {
    const d = new Date(entryDate);
    if (isNaN(d.getTime())) return entryDate;
    return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
  })();
  const timePart = (() => {
    const d = new Date(createdAt);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  })();
  return timePart ? `${datePart}, ${timePart}` : datePart;
}

function buildBillRows(transactions: ApiTransaction[]): BillRow[] {
  const billTxns = transactions.filter((t) => t.type === 'you_gave');
  const paymentTxns = transactions.filter((t) => t.type === 'you_got');

  const paidByInvoice = new Map<string, number>();
  paymentTxns.forEach((t) => {
    const match = t.description?.match(PAYMENT_INVOICE_REGEX);
    if (!match) return;
    const invoiceNumber = match[1].toUpperCase();
    paidByInvoice.set(invoiceNumber, (paidByInvoice.get(invoiceNumber) ?? 0) + (t.amount ?? 0));
  });

  const rows: BillRow[] = billTxns.map((t) => {
    const invoiceNumber = t.invoice_no ? t.invoice_no.toUpperCase() : `TXN-${t.id}`;
    const paidAmount = paidByInvoice.get(invoiceNumber) ?? 0;

    let status: BillStatus = 'pending';
    if (paidAmount >= t.amount - 0.01) status = 'paid';
    else if (paidAmount > 0) status = 'partially_paid';

    return {
      id: t.id,
      invoiceNumber,
      customerId: t.customer_id,
      customerName: t.customer_name || 'Walk-in',
      amount: t.amount ?? 0,
      paidAmount,
      status,
      paymentMode: t.payment_mode,
      entryDate: t.entry_date,
      createdAt: t.created_at,
      description: t.description ?? '',
    };
  });

  return rows.sort((a, b) => {
    if (a.entryDate !== b.entryDate) return a.entryDate < b.entryDate ? 1 : -1;
    return b.id - a.id;
  });
}

// Exports the currently filtered rows as a CSV file (web only — matches
// the "Export" button in the desktop dashboard mockup).
function exportRowsToCsv(rows: BillRow[]) {
  const header = ['Date & Time', 'Bill No', 'Customer', 'Items', 'Amount', 'Paid', 'Balance', 'Status'];
  const lines = rows.map((r) => [
    formatDateTime(r.entryDate, r.createdAt),
    r.invoiceNumber,
    r.customerName,
    itemsCountLabel(r.description),
    r.amount.toFixed(2),
    r.paidAmount.toFixed(2),
    (r.amount - r.paidAmount).toFixed(2),
    STATUS_META[r.status].label,
  ]);
  const csv = [header, ...lines]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  if (Platform.OS === 'web') {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `billing-list-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  } else {
    Share.share({ message: csv, title: 'Billing List Export' }).catch((e) => console.error('Export share failed:', e));
  }
}

// ---------------------------------------------------------------------------
// Small reusable dropdown used for the "All Dates" / "All Status" selects on
// the desktop toolbar.
// ---------------------------------------------------------------------------
function ToolbarDropdown<T extends string>({
  label,
  options,
  value,
  onChange,
  colors,
  isOpen,
  onToggle,
}: {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  colors: any;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const current = options.find((o) => o.value === value)?.label ?? label;

  return (
    <View style={{ position: 'relative', zIndex: isOpen ? 30 : 1 }}>
      <Pressable
        onPress={onToggle}
        style={[
          styles.dropdownTrigger,
          { borderColor: colors.border, backgroundColor: colors.card, borderRadius: colors.radius },
        ]}
      >
        <Feather name="calendar" size={14} color={colors.mutedForeground} />
        <Text style={{ fontFamily: FONT_FAMILY, fontSize: 13, color: colors.foreground }}>{current}</Text>
        <Feather name={isOpen ? 'chevron-up' : 'chevron-down'} size={14} color={colors.mutedForeground} />
      </Pressable>

      {isOpen && (
        <View
          style={[
            styles.dropdownMenu,
            { borderColor: colors.border, backgroundColor: colors.card, borderRadius: colors.radius },
          ]}
        >
          {options.map((o) => (
            <Pressable
              key={o.value}
              onPress={() => {
                onChange(o.value);
                onToggle();
              }}
              style={[styles.dropdownItem, o.value === value && { backgroundColor: colors.muted }]}
            >
              <Text style={{ fontFamily: FONT_FAMILY, fontSize: 13, color: colors.foreground }}>{o.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function BillingListScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';
  const { width } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;

  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  // Only one of the two toolbar dropdowns (date / status) can be open at a
  // time — this also fixes the earlier bug where both menus could end up
  // stuck visually "open" at once.
  const [openDropdown, setOpenDropdown] = useState<'date' | 'status' | null>(null);
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');

  // Which bill's receipt popup is open — passed straight to the shared
  // BillReceiptModal, which fetches the transaction/customer/items itself
  // and owns its own Edit/Delete/WhatsApp/Download/Return actions.
  const [receiptBillId, setReceiptBillId] = useState<number | null>(null);

  const params = { business_id: business?.id as number, filter: dateFilter, page, limit: LIMIT };
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useListTransactions(params, {
    query: { enabled: !!business?.id, queryKey: getListTransactionsQueryKey(params) },
  });

  const transactions: ApiTransaction[] = (data?.data as ApiTransaction[]) ?? [];
  const total: number = data?.total ?? 0;
  const totalPages = Math.max(Math.ceil(total / LIMIT), 1);

  const billRows = useMemo(() => buildBillRows(transactions), [transactions]);

  // Returns are matched to bills by transaction_id (the returns table
  // stores which original sale each return was recorded against).
  const { data: allReturns } = useAllReturns({ business_id: business?.id }, !!business?.id);
  const returnsByTransactionId = useMemo(() => {
    const map = new Map<number, { qty: number; amount: number; refundedAmount: number; exchangedAmount: number }>();
    (allReturns ?? []).forEach((r) => {
      const prev = map.get(r.transaction_id) ?? { qty: 0, amount: 0, refundedAmount: 0, exchangedAmount: 0 };
      prev.qty += r.qty;
      prev.amount += r.return_amount;
      if (r.refunded) prev.refundedAmount += r.return_amount;
      else prev.exchangedAmount += r.return_amount;
      map.set(r.transaction_id, prev);
    });
    return map;
  }, [allReturns]);

  const billRowsWithReturns = useMemo(() => {
    if (returnsByTransactionId.size === 0) return billRows;
    return billRows.map((r) => {
      const ret = returnsByTransactionId.get(r.id);
      return ret
        ? { ...r, returnedQty: ret.qty, returnedAmount: ret.amount, refundedAmount: ret.refundedAmount, exchangedAmount: ret.exchangedAmount }
        : r;
    });
  }, [billRows, returnsByTransactionId]);

  const filteredRows = useMemo(() => {
    const q = searchText.trim().toLowerCase();
    let rows = billRowsWithReturns;
    if (q) {
      rows = rows.filter(
        (r) => r.invoiceNumber.toLowerCase().includes(q) || r.customerName.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== 'all') {
      rows = rows.filter((r) => r.status === statusFilter);
    }
    return rows;
  }, [billRowsWithReturns, searchText, statusFilter]);

  // Stat-card counts computed over the currently loaded page of bills.
  const stats = useMemo(() => {
    let paid = 0;
    let partiallyPaid = 0;
    let pending = 0;
    billRowsWithReturns.forEach((r) => {
      if (r.status === 'paid') paid += 1;
      else if (r.status === 'partially_paid') partiallyPaid += 1;
      else pending += 1;
    });
    return { total: billRowsWithReturns.length, paid, partiallyPaid, pending };
  }, [billRowsWithReturns]);

  const changeDateFilter = (value: DateFilter) => {
    setDateFilter(value);
    setPage(1);
  };

  // -------------------------------------------------------------------------
  // Desktop dashboard pieces
  // -------------------------------------------------------------------------
  const renderStatCard = (icon: keyof typeof Feather.glyphMap, value: number, label: string, tint: string, bg: string) => (
    <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
      <View style={[styles.statIconWrap, { backgroundColor: bg }]}>
        <Feather name={icon} size={16} color={tint} />
      </View>
      <View>
        <Text style={[styles.statValue, { color: colors.foreground }]}>{value}</Text>
        <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{label}</Text>
      </View>
    </View>
  );

  const renderDesktopTableRow = (item: BillRow) => {
    const meta = STATUS_META[item.status];
    return (
      <View
        key={`row-${item.id}`}
        style={[styles.tableRow, { borderBottomColor: colors.border }]}
      >
        <Text style={[styles.tableCell, { width: 190, color: colors.foreground }]}>
          {formatDateTime(item.entryDate, item.createdAt)}
        </Text>
        <Pressable onPress={() => setReceiptBillId(item.id)} style={{ width: 110 }}>
          <Text style={[styles.tableCell, { color: colors.primary, fontWeight: '700', textDecorationLine: 'underline' }]}>
            {item.invoiceNumber}
          </Text>
        </Pressable>
        <View style={{ width: 170 }}>
          <Text style={[styles.tableCell, { color: colors.foreground, fontWeight: '600' }]} numberOfLines={1}>
            {item.customerName}
          </Text>
        </View>
        <Text style={[styles.tableCell, { width: 90, color: colors.mutedForeground }]}>
          {itemsCountLabel(item.description)}
        </Text>
        <Text style={[styles.tableCell, { width: 110, color: colors.foreground, fontWeight: '600' }]}>
          {formatCurrency(item.amount, business?.currency)}
        </Text>
        <Text style={[styles.tableCell, { width: 110, color: colors.success }]}>
          {formatCurrency(item.paidAmount, business?.currency)}
        </Text>
        <Text style={[styles.tableCell, { width: 110, color: colors.destructive }]}>
          {formatCurrency(item.amount - item.paidAmount, business?.currency)}
        </Text>
        <View style={{ width: 130 }}>
          <View style={[styles.statusPill, { backgroundColor: meta.bg, alignSelf: 'flex-start' }]}>
            <Text style={[styles.statusPillText, { color: meta.color }]}>{meta.label}</Text>
          </View>
        </View>
        <View style={{ width: 90 }}>
          <Pressable
            onPress={() => setReceiptBillId(item.id)}
            style={[styles.viewBtn, { borderColor: colors.border, backgroundColor: colors.muted, borderRadius: colors.radius }]}
          >
            <Text style={{ fontFamily: FONT_FAMILY, fontSize: 12, color: colors.primary, fontWeight: '600' }}>View</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderBillCard = ({ item }: { item: BillRow }) => {
    const meta = STATUS_META[item.status];

    return (
      <Pressable
        onPress={() => setReceiptBillId(item.id)}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          pressed && { backgroundColor: colors.muted },
        ]}
      >
        <View style={styles.cardTopRow}>
          {/* Date & time is shown first, invoice number second, per the
              requested layout order. */}
          <View style={styles.cardMetaGroup}>
            <Feather name="calendar" size={12} color={colors.mutedForeground} />
            <Text style={[styles.cardMetaText, { color: colors.mutedForeground }]}>
              {formatDateTime(item.entryDate, item.createdAt)}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {!!item.returnedAmount && (
              <View style={[styles.statusPill, { backgroundColor: '#FFEDD5' }]}>
                <Text style={[styles.statusPillText, { color: '#C2410C' }]}>Return</Text>
              </View>
            )}
            <View style={[styles.statusPill, { backgroundColor: meta.bg }]}>
              <Text style={[styles.statusPillText, { color: meta.color }]}>{meta.label}</Text>
            </View>
          </View>
        </View>

        <Text style={[styles.invoiceNumber, { color: colors.foreground, marginTop: 6 }]}>{item.invoiceNumber}</Text>

        <Text style={[styles.customerName, { color: colors.foreground }]} numberOfLines={1}>
          {item.customerName}
        </Text>

        <View style={styles.cardBottomRow}>
          <View style={styles.cardMetaGroup}>
            <Feather name="credit-card" size={12} color={colors.mutedForeground} />
            <Text style={[styles.cardMetaText, { color: colors.mutedForeground }]}>{paymentModeLabel(item.paymentMode)}</Text>
          </View>
          <Text style={[styles.cardAmount, { color: colors.primary }]}>{formatCurrency(item.amount, business?.currency)}</Text>
        </View>

        {item.status === 'partially_paid' && (
          <Text style={[styles.partialNote, { color: colors.mutedForeground }]}>
            {formatCurrency(item.paidAmount, business?.currency)} received • {formatCurrency(item.amount - item.paidAmount, business?.currency)} due
          </Text>
        )}

        {!!item.returnedAmount && (
          <Text style={[styles.partialNote, { color: '#C2410C' }]}>
            {item.returnedQty} item{item.returnedQty !== 1 ? 's' : ''} returned •{' '}
            {(() => {
              const parts: string[] = [];
              if (item.refundedAmount) parts.push(`${formatCurrency(item.refundedAmount, business?.currency)} refunded`);
              if (item.exchangedAmount) parts.push(`${formatCurrency(item.exchangedAmount, business?.currency)} exchanged for another product`);
              return parts.join(' + ');
            })()}
            {' • Net '}{formatCurrency(item.amount - item.returnedAmount, business?.currency)}
          </Text>
        )}
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />
      {isDesktop ? (
        <View style={{ flex: 1, position: 'relative' }}>
          {openDropdown && (
            <Pressable
              onPress={() => setOpenDropdown(null)}
              style={StyleSheet.absoluteFillObject}
            />
          )}
          <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 40 }}>
            {/* Header row: title/subtitle + stat cards */}
            <View style={styles.desktopHeaderRow}>
              <View>
                <Text style={[styles.desktopTitle, { color: colors.foreground }]}>Billing List</Text>
                <Text style={[styles.desktopSubtitle, { color: colors.mutedForeground }]}>View and manage all your bills</Text>
              </View>
              <View style={styles.statCardRow}>
                {renderStatCard('file-text', stats.total, 'Total Bills', colors.primary, colors.primary + '15')}
                {renderStatCard('check-square', stats.paid, 'Paid Bills', '#15803D', '#DCFCE7')}
                {renderStatCard('clock', stats.partiallyPaid, 'Partially Paid', '#B45309', '#FEF3C7')}
                {renderStatCard('alert-circle', stats.pending, 'Pending Bills', '#B91C1C', '#FEE2E2')}
              </View>
            </View>

            {/* Toolbar: search + filters + export */}
            <View style={[styles.toolbar, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
              <View style={[styles.searchWrap, { flex: 1, borderColor: colors.border, borderRadius: colors.radius }]}>
                <Feather name="search" size={16} color={colors.mutedForeground} />
                <TextInput
                  value={searchText}
                  onChangeText={setSearchText}
                  placeholder="Search by Bill No, Customer Name..."
                  placeholderTextColor={colors.mutedForeground}
                  style={[styles.searchInput, { color: colors.foreground }]}
                />
                {searchText.length > 0 && (
                  <Pressable onPress={() => setSearchText('')} hitSlop={8}>
                    <Feather name="x" size={16} color={colors.mutedForeground} />
                  </Pressable>
                )}
              </View>

              <ToolbarDropdown
                label="All Dates"
                options={DATE_FILTERS}
                value={dateFilter}
                onChange={changeDateFilter}
                colors={colors}
                isOpen={openDropdown === 'date'}
                onToggle={() => setOpenDropdown((d) => (d === 'date' ? null : 'date'))}
              />
              <ToolbarDropdown
                label="All Status"
                options={STATUS_FILTERS}
                value={statusFilter}
                onChange={setStatusFilter}
                colors={colors}
                isOpen={openDropdown === 'status'}
                onToggle={() => setOpenDropdown((d) => (d === 'status' ? null : 'status'))}
              />

              <Pressable
                onPress={() => exportRowsToCsv(filteredRows)}
                style={[styles.exportBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
              >
                <Feather name="download" size={14} color={colors.primaryForeground} />
                <Text style={{ fontFamily: FONT_FAMILY, fontSize: 13, color: colors.primaryForeground, fontWeight: '600' }}>Export</Text>
              </Pressable>
            </View>

            {/* Table */}
            <View style={[styles.tableCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
              {isLoading ? (
                <ActivityIndicator style={{ margin: 40 }} color={colors.primary} />
              ) : isError ? (
                <View style={styles.errorBox}>
                  <Feather name="alert-triangle" size={20} color={colors.destructive} />
                  <Text style={[styles.errorText, { color: colors.destructive }]}>Could not load bills.</Text>
                  <Pressable onPress={() => refetch()} style={[styles.retryBtn, { borderColor: colors.border, borderRadius: colors.radius }]}>
                    <Text style={{ color: colors.primary, fontSize: 13, fontFamily: FONT_FAMILY }}>Retry</Text>
                  </Pressable>
                </View>
              ) : filteredRows.length === 0 ? (
                <EmptyState
                  icon="file-text"
                  title={searchText ? 'No matching bills' : 'No bills yet'}
                  subtitle={searchText ? 'Try a different invoice number or customer name.' : 'Bills you create from New Bill will show up here.'}
                />
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={{ minWidth: 1010 }}>
                    {/* Column header — Date & Time first, Bill No second, per
                        the requested order. */}
                    <View style={[styles.tableHeaderRow, { borderBottomColor: colors.border }]}>
                      <Text style={[styles.tableHeaderCell, { width: 190 }]}>Date & Time</Text>
                      <Text style={[styles.tableHeaderCell, { width: 110 }]}>Bill No</Text>
                      <Text style={[styles.tableHeaderCell, { width: 170 }]}>Customer</Text>
                      <Text style={[styles.tableHeaderCell, { width: 90 }]}>Items</Text>
                      <Text style={[styles.tableHeaderCell, { width: 110 }]}>Amount</Text>
                      <Text style={[styles.tableHeaderCell, { width: 110 }]}>Paid</Text>
                      <Text style={[styles.tableHeaderCell, { width: 110 }]}>Balance</Text>
                      <Text style={[styles.tableHeaderCell, { width: 130 }]}>Status</Text>
                      <Text style={[styles.tableHeaderCell, { width: 90 }]}>Action</Text>
                    </View>
                    {filteredRows.map(renderDesktopTableRow)}
                  </View>
                </ScrollView>
              )}
            </View>

            {/* Pagination */}
            {!isLoading && !isError && total > LIMIT && (
              <View style={[styles.paginationBar, { borderTopColor: colors.border, borderTopWidth: 1, marginTop: 4 }]}>
                <Pressable
                  disabled={page <= 1}
                  onPress={() => setPage((p) => Math.max(p - 1, 1))}
                  style={[styles.pageBtn, { opacity: page <= 1 ? 0.4 : 1 }]}
                >
                  <Feather name="chevron-left" size={16} color={colors.foreground} />
                  <Text style={[styles.pageBtnText, { color: colors.foreground }]}>Prev</Text>
                </Pressable>
                <Text style={[styles.pageIndicator, { color: colors.mutedForeground }]}>
                  Page {page} of {totalPages}
                </Text>
                <Pressable
                  disabled={page >= totalPages}
                  onPress={() => setPage((p) => Math.min(p + 1, totalPages))}
                  style={[styles.pageBtn, { opacity: page >= totalPages ? 0.4 : 1 }]}
                >
                  <Text style={[styles.pageBtnText, { color: colors.foreground }]}>Next</Text>
                  <Feather name="chevron-right" size={16} color={colors.foreground} />
                </Pressable>
              </View>
            )}
          </ScrollView>
        </View>
      ) : (
        <>
          {/* Header */}
          <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
            <View style={styles.headerRow}>
              <Text style={[styles.headerTitle, { color: colors.foreground }]}>Billing List</Text>
            </View>
            <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>{total} bill{total === 1 ? '' : 's'}</Text>
          </View>

          {/* Search */}
          <View style={styles.searchSection}>
            <View style={[styles.searchWrap, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
              <Feather name="search" size={16} color={colors.mutedForeground} />
              <TextInput
                value={searchText}
                onChangeText={setSearchText}
                placeholder="Search by invoice number or customer..."
                placeholderTextColor={colors.mutedForeground}
                style={[styles.searchInput, { color: colors.foreground }]}
              />
              {searchText.length > 0 && (
                <Pressable onPress={() => setSearchText('')} hitSlop={8}>
                  <Feather name="x" size={16} color={colors.mutedForeground} />
                </Pressable>
              )}
            </View>
          </View>

          {/* Date filter chips */}
          <View style={styles.filterStripWrap}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterStrip}
              contentContainerStyle={styles.filterStripContent}
            >
              {DATE_FILTERS.map((f) => {
                const active = f.value === dateFilter;
                return (
                  <Pressable
                    key={f.value}
                    onPress={() => changeDateFilter(f.value)}
                    style={[
                      styles.filterChip,
                      {
                        borderRadius: colors.radius,
                        backgroundColor: active ? colors.primary : colors.card,
                        borderColor: active ? colors.primary : colors.border,
                      },
                    ]}
                  >
                    <Text style={{ color: active ? colors.primaryForeground : colors.foreground, fontSize: 12, fontFamily: FONT_FAMILY }}>
                      {f.value === 'all' ? 'All' : f.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* List */}
          {isLoading ? (
            <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
          ) : isError ? (
            <View style={styles.errorBox}>
              <Feather name="alert-triangle" size={20} color={colors.destructive} />
              <Text style={[styles.errorText, { color: colors.destructive }]}>Could not load bills.</Text>
              <Pressable onPress={() => refetch()} style={[styles.retryBtn, { borderColor: colors.border, borderRadius: colors.radius }]}>
                <Text style={{ color: colors.primary, fontSize: 13, fontFamily: FONT_FAMILY }}>Retry</Text>
              </Pressable>
            </View>
          ) : filteredRows.length === 0 ? (
            <EmptyState
              icon="file-text"
              title={searchText ? 'No matching bills' : 'No bills yet'}
              subtitle={searchText ? 'Try a different invoice number or customer name.' : 'Bills you create from New Bill will show up here.'}
            />
          ) : (
            <FlatList
              data={filteredRows}
              keyExtractor={(item) => `bill-${item.id}`}
              renderItem={renderBillCard}
              contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: insets.bottom + 20 }}
              refreshing={isFetching}
              onRefresh={refetch}
            />
          )}

          {/* Pagination */}
          {!isLoading && !isError && total > LIMIT && (
            <View style={[styles.paginationBar, { borderTopColor: colors.border, paddingBottom: insets.bottom + 12 }]}>
              <Pressable
                disabled={page <= 1}
                onPress={() => setPage((p) => Math.max(p - 1, 1))}
                style={[styles.pageBtn, { opacity: page <= 1 ? 0.4 : 1 }]}
              >
                <Feather name="chevron-left" size={16} color={colors.foreground} />
                <Text style={[styles.pageBtnText, { color: colors.foreground }]}>Prev</Text>
              </Pressable>
              <Text style={[styles.pageIndicator, { color: colors.mutedForeground }]}>
                Page {page} of {totalPages}
              </Text>
              <Pressable
                disabled={page >= totalPages}
                onPress={() => setPage((p) => Math.min(p + 1, totalPages))}
                style={[styles.pageBtn, { opacity: page >= totalPages ? 0.4 : 1 }]}
              >
                <Text style={[styles.pageBtnText, { color: colors.foreground }]}>Next</Text>
                <Feather name="chevron-right" size={16} color={colors.foreground} />
              </Pressable>
            </View>
          )}
        </>
      )}

      {/* Bill receipt popup — shared component, also used by the Customer
          Ledger. Owns its own Edit/Delete/WhatsApp/Download/Return actions.
          canEdit/canDelete gate Edit & Delete to owners only — staff see the
          buttons but get a permission alert if they tap them. */}
      <BillReceiptModal
        visible={!!receiptBillId}
        billId={receiptBillId}
        business={business}
        colors={colors}
        onClose={() => setReceiptBillId(null)}
        onChanged={() => refetch()}
        canEdit={isOwner}
        canDelete={isOwner}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------
const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontFamily: FONT_FAMILY, fontWeight: '700' },
  headerSubtitle: { fontSize: 12, fontFamily: FONT_FAMILY, marginTop: 4 },

  searchSection: { paddingHorizontal: 16, paddingTop: 12 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: FONT_FAMILY },

  filterStripWrap: { paddingTop: 10, paddingBottom: 4 },
  filterStrip: { flexGrow: 0, height: 44 },
  filterStripContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },

  card: { borderWidth: 1, padding: 14, marginBottom: 10 },
  cardTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  invoiceNumber: { fontSize: 15, fontFamily: FONT_FAMILY, fontWeight: '700' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusPillText: { fontSize: 11, fontFamily: FONT_FAMILY, fontWeight: '600' },
  customerName: { fontSize: 14, fontFamily: FONT_FAMILY, marginTop: 2 },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  cardMetaGroup: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMetaText: { fontSize: 12, fontFamily: FONT_FAMILY },
  cardAmount: { fontSize: 16, fontFamily: FONT_FAMILY, fontWeight: '700' },
  partialNote: { fontSize: 11, fontFamily: FONT_FAMILY, marginTop: 6 },

  errorBox: { alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 40, paddingHorizontal: 20, paddingVertical: 30 },
  errorText: { fontSize: 13, fontFamily: FONT_FAMILY },
  retryBtn: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, marginTop: 4 },

  paginationBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1 },
  pageBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 8 },
  pageBtnText: { fontSize: 13, fontFamily: FONT_FAMILY },
  pageIndicator: { fontSize: 12, fontFamily: FONT_FAMILY },

  // ---- Desktop dashboard ----
  desktopHeaderRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 20 },
  desktopTitle: { fontSize: 24, fontFamily: FONT_FAMILY, fontWeight: '700' },
  desktopSubtitle: { fontSize: 13, fontFamily: FONT_FAMILY, marginTop: 4 },
  statCardRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, paddingVertical: 12, paddingHorizontal: 14, minWidth: 150 },
  statIconWrap: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  statValue: { fontSize: 18, fontFamily: FONT_FAMILY, fontWeight: '700' },
  statLabel: { fontSize: 11, fontFamily: FONT_FAMILY, marginTop: 1 },

  toolbar: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, padding: 12, marginBottom: 16, flexWrap: 'wrap', position: 'relative', zIndex: 50 },
  dropdownTrigger: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, minWidth: 150 },
  dropdownMenu: { position: 'absolute', top: 44, left: 0, right: 0, borderWidth: 1, paddingVertical: 4, zIndex: 20, elevation: 6 },
  dropdownItem: { paddingHorizontal: 12, paddingVertical: 9 },
  exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 11 },

  tableCard: { borderWidth: 1, overflow: 'hidden' },
  tableHeaderRow: { flexDirection: 'row', borderBottomWidth: 1, paddingVertical: 12, paddingHorizontal: 16, backgroundColor: 'rgba(0,0,0,0.02)' },
  tableHeaderCell: { fontSize: 11.5, fontFamily: FONT_FAMILY, fontWeight: '700', color: '#6B7280', textTransform: 'uppercase', letterSpacing: 0.3 },
  tableRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, paddingVertical: 14, paddingHorizontal: 16 },
  tableCell: { fontSize: 13, fontFamily: FONT_FAMILY },
  viewBtn: { paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1, alignSelf: 'flex-start' },
});