
import React, { useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router, Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
import { EmptyState } from '@/components/EmptyState';
import { formatCurrency } from '@/lib/format';
import {
  useListTransactions,
  getListTransactionsQueryKey,
  customFetch,
} from '@workspace/api-client-react';
import { jsPDF } from 'jspdf';

// ---------------------------------------------------------------------------
// Font
// ---------------------------------------------------------------------------
const FONT_FAMILY = Platform.OS === 'web' ? 'Times New Roman' : 'serif';

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

// ---- Return flow types ----
type ReturnReason = 'Damaged' | 'Expired' | 'Wrong Item' | 'Customer Return' | 'Other';

interface BillItem {
  product_id: number;
  product_name: string;
  unit: string;
  qty: number;
  unit_price: number;
}

interface ReturnLine {
  product_id: number;
  product_name: string;
  unitPrice: number;
  maxQty: number;
  returnQty: string;
  reason: ReturnReason;
}

const REASONS: ReturnReason[] = ['Damaged', 'Expired', 'Wrong Item', 'Customer Return', 'Other'];

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
  { value: 'all', label: 'All' },
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
];

// ---------------------------------------------------------------------------
// Description parsing helpers
// ---------------------------------------------------------------------------
const BILL_INVOICE_REGEX = /Invoice\s+([A-Za-z]+-\d+)\s*:/i;
const PAYMENT_INVOICE_REGEX = /invoice\s+([A-Za-z]+-\d+)/i;

function paymentModeLabel(mode: string) {
  switch (mode) {
    case 'cash':
      return 'Cash';
    case 'upi':
      return 'UPI';
    case 'online':
      return 'Online';
    default:
      return mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : '-';
  }
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
    const match = t.description?.match(BILL_INVOICE_REGEX);
    const invoiceNumber = match ? match[1].toUpperCase() : `TXN-${t.id}`;
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

function generateReceiptText(bill: BillRow, businessName: string) {
  let text = '================================\n';
  text += `        ${businessName}\n`;
  text += '================================\n';
  text += `Invoice: ${bill.invoiceNumber}\n`;
  text += `Date: ${bill.entryDate}\n`;
  text += `Customer: ${bill.customerName}\n`;
  text += `Payment Mode: ${paymentModeLabel(bill.paymentMode)}\n`;
  text += '--------------------------------\n';
  if (bill.description) text += `${bill.description}\n`;
  text += '--------------------------------\n';
  text += `TOTAL: Rs.${bill.amount.toFixed(2)}\n`;
  text += `PAID:  Rs.${bill.paidAmount.toFixed(2)}\n`;
  text += '================================\n';
  text += '      Thank you for your visit!\n';
  text += '================================\n';
  return text;
}

// Builds and downloads a real PDF receipt using jsPDF (web only).
function downloadPdfReceipt(bill: BillRow, businessName: string) {
  const doc = new jsPDF({ unit: 'pt', format: [320, 520] });

  const pageWidth = 320;
  const marginX = 24;
  let y = 36;

  doc.setFont('times', 'bold');
  doc.setFontSize(15);
  doc.text(businessName, pageWidth / 2, y, { align: 'center' });
  y += 22;

  doc.setDrawColor(200);
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 20;

  doc.setFont('times', 'normal');
  doc.setFontSize(11);

  const row = (label: string, value: string, bold = false) => {
    doc.setFont('times', bold ? 'bold' : 'normal');
    doc.text(label, marginX, y);
    doc.text(value, pageWidth - marginX, y, { align: 'right' });
    y += 18;
  };

  row('Invoice', bill.invoiceNumber, true);
  row('Date', bill.entryDate);
  row('Customer', bill.customerName);
  row('Payment Mode', paymentModeLabel(bill.paymentMode));

  y += 4;
  doc.line(marginX, y, pageWidth - marginX, y);
  y += 18;

  if (bill.description) {
    doc.setFont('times', 'normal');
    doc.setFontSize(10);
    const wrapped = doc.splitTextToSize(bill.description, pageWidth - marginX * 2);
    doc.text(wrapped, marginX, y);
    y += wrapped.length * 13 + 10;
  }

  doc.line(marginX, y, pageWidth - marginX, y);
  y += 20;

  doc.setFontSize(12);
  row('TOTAL', `Rs.${bill.amount.toFixed(2)}`, true);
  row('PAID', `Rs.${bill.paidAmount.toFixed(2)}`, true);

  y += 14;
  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.text('Thank you for your visit!', pageWidth / 2, y, { align: 'center' });

  doc.save(`${bill.invoiceNumber}-receipt.pdf`);
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------
export default function BillingListScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();

  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [page, setPage] = useState(1);
  const [searchText, setSearchText] = useState('');
  const [selectedBill, setSelectedBill] = useState<BillRow | null>(null);

  // ---- Return flow state ----
  const [returnBill, setReturnBill] = useState<BillRow | null>(null);
  const [returnLines, setReturnLines] = useState<ReturnLine[]>([]);
  const [loadingReturnItems, setLoadingReturnItems] = useState(false);
  const [submittingReturn, setSubmittingReturn] = useState(false);
  // How the returned value is settled: cash back to the customer, or the
  // customer picks a different product of that value instead (no cash out).
  const [refundMethod, setRefundMethod] = useState<'cash' | 'exchange'>('cash');
  // Guards against a double-click/double-tap firing submitReturn twice before
  // the `submittingReturn` state re-render disables the button — that race
  // was creating duplicate return rows for the same product.
  const submittingReturnRef = useRef(false);

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
    if (!q) return billRowsWithReturns;
    return billRowsWithReturns.filter(
      (r) => r.invoiceNumber.toLowerCase().includes(q) || r.customerName.toLowerCase().includes(q),
    );
  }, [billRowsWithReturns, searchText]);

  const changeDateFilter = (value: DateFilter) => {
    setDateFilter(value);
    setPage(1);
  };

  const goPayNow = (bill: BillRow) => {
    const due = Math.max(bill.amount - bill.paidAmount, 0);
    router.push({
      pathname: '/billing',
      params: {
        customer_id: String(bill.customerId),
        customer_name: bill.customerName,
        invoice_number: bill.invoiceNumber,
        amount: bill.amount.toFixed(2),
        due_amount: due.toFixed(2),
      },
    } as any);
  };

  const downloadReceipt = async (bill: BillRow) => {
    const businessName = business?.business_name || 'Khata-Pro';
    if (Platform.OS === 'web') {
      try {
        downloadPdfReceipt(bill, businessName);
      } catch (error) {
        console.error('Error generating PDF receipt:', error);
      }
    } else {
      try {
        await Share.share({ message: generateReceiptText(bill, businessName), title: `Receipt ${bill.invoiceNumber}` });
      } catch (error) {
        console.error('Error sharing receipt:', error);
      }
    }
  };

  // ---- Return flow handlers ----
  const openReturnModal = async (bill: BillRow) => {
    setReturnBill(bill);
    setRefundMethod('cash');
    setLoadingReturnItems(true);
    try {
      const items = await customFetch<BillItem[]>(`/api/transactions/${bill.id}/items`, {
        responseType: 'json',
      });
      setReturnLines(
        items.map((i) => ({
          product_id: i.product_id,
          product_name: i.product_name,
          unitPrice: i.unit_price,
          maxQty: i.qty,
          // Default to the full sold/purchased quantity — cashier reduces it
          // if only part of the line is being returned, instead of typing
          // the quantity up from 0 every time.
          returnQty: String(i.qty),
          reason: 'Customer Return' as ReturnReason,
        })),
      );
    } catch (e) {
      console.error('Failed to load bill items for return:', e);
    } finally {
      setLoadingReturnItems(false);
    }
  };

  const submitReturn = async () => {
    if (!returnBill) return;
    if (submittingReturnRef.current) return; // already submitting — ignore the extra click
    const linesToReturn = returnLines.filter((l) => (parseInt(l.returnQty, 10) || 0) > 0);
    if (linesToReturn.length === 0) return;

    const isExchange = refundMethod === 'exchange';
    // Computed client-side from the same unit prices shown in the modal —
    // used only to pre-fill the exchange credit on the next bill; the
    // server independently prices each return line the same way.
    const exchangeCredit = linesToReturn.reduce((sum, l) => sum + (parseInt(l.returnQty, 10) || 0) * l.unitPrice, 0);
    const returnedProductNames = linesToReturn.map((l) => l.product_name).join(', ');

    submittingReturnRef.current = true;
    setSubmittingReturn(true);
    try {
      for (const l of linesToReturn) {
        await customFetch('/api/returns', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            business_id: business?.id,
            transaction_id: returnBill.id,
            product_id: l.product_id,
            qty: parseInt(l.returnQty, 10),
            reason: l.reason,
            refunded: !isExchange, // exchange = no cash refund, just restock + credit toward a new item
          }),
          responseType: 'json',
        } as any);
      }
      const bill = returnBill;

      if (isExchange) {
        // Navigate to Billing right away so the redirect always fires,
        // regardless of how the credit rounds out. Cleanup of this screen's
        // state happens after — we're leaving it anyway.
        try {
          router.push({
            pathname: '/billing',
            params: {
              customer_id: String(bill.customerId),
              customer_name: bill.customerName,
              exchange_credit: exchangeCredit.toFixed(2),
              exchange_note: `Exchange credit for returned ${returnedProductNames} (${bill.invoiceNumber})`,
            },
          } as any);
        } catch (navErr) {
          console.error('Failed to navigate to billing for exchange:', navErr);
        }
      }

      setReturnBill(null);
      refetch();
    } catch (e) {
      console.error('Failed to submit return:', e);
    } finally {
      submittingReturnRef.current = false;
      setSubmittingReturn(false);
    }
  };

  const renderBillCard = ({ item }: { item: BillRow }) => {
    const meta = STATUS_META[item.status];

    return (
      <Pressable
        onPress={() => setSelectedBill(item)}
        style={({ pressed }) => [
          styles.card,
          { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
          pressed && { backgroundColor: colors.muted },
        ]}
      >
        <View style={styles.cardTopRow}>
          <Text style={[styles.invoiceNumber, { color: colors.foreground }]}>{item.invoiceNumber}</Text>
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

        <Text style={[styles.customerName, { color: colors.foreground }]} numberOfLines={1}>
          {item.customerName}
        </Text>

        <View style={styles.cardBottomRow}>
          <View style={styles.cardMetaGroup}>
            <Feather name="calendar" size={12} color={colors.mutedForeground} />
            <Text style={[styles.cardMetaText, { color: colors.mutedForeground }]}>{item.entryDate}</Text>
            <Text style={[styles.cardMetaDot, { color: colors.mutedForeground }]}>•</Text>
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
                  {f.label}
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

      {/* Bill detail modal */}
      <Modal visible={!!selectedBill} transparent animationType="slide" onRequestClose={() => setSelectedBill(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            {selectedBill && (
              <>
                <View style={styles.modalHeaderRow}>
                  <Text style={[styles.modalTitle, { color: colors.foreground }]}>{selectedBill.invoiceNumber}</Text>
                  <Pressable onPress={() => setSelectedBill(null)} hitSlop={8}>
                    <Feather name="x" size={20} color={colors.mutedForeground} />
                  </Pressable>
                </View>

                <View style={[styles.statusPill, { backgroundColor: STATUS_META[selectedBill.status].bg, alignSelf: 'flex-start', marginTop: 6 }]}>
                  <Text style={[styles.statusPillText, { color: STATUS_META[selectedBill.status].color }]}>
                    {STATUS_META[selectedBill.status].label}
                  </Text>
                </View>

                <View style={[styles.modalDivider, { backgroundColor: colors.border }]} />

                <View style={styles.modalRow}>
                  <Text style={[styles.modalLabel, { color: colors.mutedForeground }]}>Customer</Text>
                  <Text style={[styles.modalValue, { color: colors.foreground }]}>{selectedBill.customerName}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={[styles.modalLabel, { color: colors.mutedForeground }]}>Date</Text>
                  <Text style={[styles.modalValue, { color: colors.foreground }]}>{selectedBill.entryDate}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={[styles.modalLabel, { color: colors.mutedForeground }]}>Payment Mode</Text>
                  <Text style={[styles.modalValue, { color: colors.foreground }]}>{paymentModeLabel(selectedBill.paymentMode)}</Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={[styles.modalLabel, { color: colors.mutedForeground }]}>Amount</Text>
                  <Text style={[styles.modalValue, { color: colors.foreground }]}>{formatCurrency(selectedBill.amount, business?.currency)}</Text>
                </View>
                {selectedBill.status !== 'pending' && (
                  <View style={styles.modalRow}>
                    <Text style={[styles.modalLabel, { color: colors.mutedForeground }]}>Received</Text>
                    <Text style={[styles.modalValue, { color: colors.success }]}>{formatCurrency(selectedBill.paidAmount, business?.currency)}</Text>
                  </View>
                )}
                {selectedBill.status !== 'paid' && (
                  <View style={styles.modalRow}>
                    <Text style={[styles.modalLabel, { color: colors.mutedForeground }]}>Balance Due</Text>
                    <Text style={[styles.modalValue, { color: colors.destructive }]}>
                      {formatCurrency(selectedBill.amount - selectedBill.paidAmount, business?.currency)}
                    </Text>
                  </View>
                )}
                {!!selectedBill.returnedAmount && (
                  <View style={styles.modalRow}>
                    <Text style={[styles.modalLabel, { color: colors.mutedForeground }]}>
                      Returned ({selectedBill.returnedQty} item{selectedBill.returnedQty !== 1 ? 's' : ''})
                    </Text>
                    <Text style={[styles.modalValue, { color: '#C2410C' }]}>
                      {formatCurrency(selectedBill.returnedAmount, business?.currency)}
                    </Text>
                  </View>
                )}
                {!!selectedBill.refundedAmount && (
                  <View style={styles.modalRow}>
                    <Text style={[styles.modalLabel, { color: colors.mutedForeground }]}>— Cash refunded</Text>
                    <Text style={[styles.modalValue, { color: '#C2410C' }]}>
                      {formatCurrency(selectedBill.refundedAmount, business?.currency)}
                    </Text>
                  </View>
                )}
                {!!selectedBill.exchangedAmount && (
                  <View style={styles.modalRow}>
                    <Text style={[styles.modalLabel, { color: colors.mutedForeground }]}>— Exchanged for another product</Text>
                    <Text style={[styles.modalValue, { color: colors.primary }]}>
                      {formatCurrency(selectedBill.exchangedAmount, business?.currency)}
                    </Text>
                  </View>
                )}

                {selectedBill.description ? (
                  <>
                    <View style={[styles.modalDivider, { backgroundColor: colors.border }]} />
                    <Text style={[styles.modalLabel, { color: colors.mutedForeground, marginBottom: 4 }]}>Items</Text>
                    <Text style={[styles.modalDescription, { color: colors.foreground }]}>{selectedBill.description}</Text>
                    {!!selectedBill.returnedAmount && (
                      <Text style={{ fontFamily: FONT_FAMILY, fontSize: 10.5, color: colors.mutedForeground, marginTop: 6, fontStyle: 'italic' }}>
                        This list is the original sale record and doesn't change after a return — see "Returned" above for what came back.
                      </Text>
                    )}
                  </>
                ) : null}

                <View style={styles.modalActionsRow}>
                  {selectedBill.status !== 'paid' && (
                    <Pressable
                      onPress={() => {
                        const bill = selectedBill;
                        setSelectedBill(null);
                        goPayNow(bill);
                      }}
                      style={[styles.modalActionBtn, { backgroundColor: colors.success, borderRadius: colors.radius }]}
                    >
                      <Feather name="credit-card" size={15} color="#fff" />
                      <Text style={styles.modalActionBtnText}>Pay Now</Text>
                    </Pressable>
                  )}

                  {(selectedBill.status === 'paid' || selectedBill.status === 'partially_paid') && (
                    <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                      <Pressable
                        onPress={() => downloadReceipt(selectedBill)}
                        style={[styles.modalActionBtn, { flex: 1, backgroundColor: colors.primary, borderRadius: colors.radius }]}
                      >
                        <Feather name="download" size={15} color={colors.primaryForeground} />
                        <Text style={[styles.modalActionBtnText, { color: colors.primaryForeground }]}>Receipt</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          const bill = selectedBill;
                          setSelectedBill(null);
                          openReturnModal(bill);
                        }}
                        style={[styles.modalActionBtn, { flex: 1, backgroundColor: '#DC2626', borderRadius: colors.radius }]}
                      >
                        <Feather name="corner-up-left" size={15} color="#fff" />
                        <Text style={[styles.modalActionBtnText, { color: '#fff' }]}>Return</Text>
                      </Pressable>
                    </View>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Return modal — SIBLING of the bill detail modal, driven by its own
          `returnBill` state so it stays open independently of `selectedBill`. */}
      <Modal visible={!!returnBill} transparent animationType="slide" onRequestClose={() => setReturnBill(null)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card, maxHeight: '85%' }]}>
            <View style={styles.modalHeaderRow}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Return — {returnBill?.invoiceNumber}</Text>
              <Pressable onPress={() => setReturnBill(null)} hitSlop={8}>
                <Feather name="x" size={20} color={colors.mutedForeground} />
              </Pressable>
            </View>

            {loadingReturnItems ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: 20 }} />
            ) : returnLines.length === 0 ? (
              <Text style={{ fontFamily: FONT_FAMILY, fontSize: 12, color: colors.mutedForeground, textAlign: 'center', paddingVertical: 20 }}>
                No items found for this bill.
              </Text>
            ) : (
              <ScrollView style={{ maxHeight: 400, marginTop: 12 }}>
                {returnLines.map((line, idx) => (
                  <View key={line.product_id} style={{ borderBottomWidth: 1, borderColor: colors.border, paddingVertical: 10 }}>
                    <Text style={{ fontFamily: FONT_FAMILY, fontWeight: '700', color: colors.foreground }}>{line.product_name}</Text>
                    <Text style={{ fontFamily: FONT_FAMILY, fontSize: 11, color: colors.mutedForeground, marginBottom: 6 }}>
                      Sold qty: {line.maxQty}
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                      <TextInput
                        value={line.returnQty}
                        onChangeText={(t) => {
                          const n = Math.min(parseInt(t, 10) || 0, line.maxQty);
                          setReturnLines((prev) => prev.map((l, i) => (i === idx ? { ...l, returnQty: String(n) } : l)));
                        }}
                        keyboardType="number-pad"
                        style={{
                          borderWidth: 1,
                          borderColor: colors.border,
                          borderRadius: 6,
                          width: 60,
                          textAlign: 'center',
                          paddingVertical: 6,
                          fontFamily: FONT_FAMILY,
                          color: colors.foreground,
                        }}
                      />
                      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', gap: 6 }}>
                          {REASONS.map((r) => {
                            const active = line.reason === r;
                            return (
                              <Pressable
                                key={r}
                                onPress={() => setReturnLines((prev) => prev.map((l, i) => (i === idx ? { ...l, reason: r } : l)))}
                                style={{
                                  paddingHorizontal: 10,
                                  paddingVertical: 6,
                                  borderRadius: 14,
                                  borderWidth: 1,
                                  borderColor: active ? colors.primary : colors.border,
                                  backgroundColor: active ? colors.primary + '15' : 'transparent',
                                }}
                              >
                                <Text style={{ fontFamily: FONT_FAMILY, fontSize: 11, color: active ? colors.primary : colors.mutedForeground }}>
                                  {r}
                                </Text>
                              </Pressable>
                            );
                          })}
                        </View>
                      </ScrollView>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}

            {!loadingReturnItems && returnLines.length > 0 && (
              <View style={{ marginTop: 14 }}>
                <Text style={{ fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '700', color: colors.foreground, marginBottom: 8 }}>
                  Settle this return with
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Pressable
                    onPress={() => setRefundMethod('cash')}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      paddingVertical: 10,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: refundMethod === 'cash' ? '#DC2626' : colors.border,
                      backgroundColor: refundMethod === 'cash' ? '#FEE2E2' : 'transparent',
                    }}
                  >
                    <Feather name="rotate-ccw" size={14} color={refundMethod === 'cash' ? '#DC2626' : colors.mutedForeground} />
                    <Text style={{ fontFamily: FONT_FAMILY, fontSize: 12.5, color: refundMethod === 'cash' ? '#DC2626' : colors.foreground, fontWeight: refundMethod === 'cash' ? '700' : '400' }}>
                      Cash Refund
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setRefundMethod('exchange')}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      paddingVertical: 10,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: refundMethod === 'exchange' ? colors.primary : colors.border,
                      backgroundColor: refundMethod === 'exchange' ? colors.primary + '15' : 'transparent',
                    }}
                  >
                    <Feather name="repeat" size={14} color={refundMethod === 'exchange' ? colors.primary : colors.mutedForeground} />
                    <Text style={{ fontFamily: FONT_FAMILY, fontSize: 12.5, color: refundMethod === 'exchange' ? colors.primary : colors.foreground, fontWeight: refundMethod === 'exchange' ? '700' : '400' }}>
                      Exchange for Product
                    </Text>
                  </Pressable>
                </View>
                {refundMethod === 'exchange' && (
                  <Text style={{ fontFamily: FONT_FAMILY, fontSize: 11, color: colors.mutedForeground, marginTop: 6, lineHeight: 15 }}>
                    No cash goes out. After confirming, you'll be taken to Billing with this customer and the return value pre-filled as a discount — pick whatever product they're exchanging it for.
                  </Text>
                )}
              </View>
            )}

            <Pressable
              onPress={submitReturn}
              disabled={submittingReturn || loadingReturnItems || returnLines.length === 0}
              style={[
                styles.modalActionBtn,
                {
                  backgroundColor: refundMethod === 'exchange' ? colors.primary : '#DC2626',
                  borderRadius: colors.radius,
                  marginTop: 14,
                  opacity: submittingReturn || loadingReturnItems || returnLines.length === 0 ? 0.6 : 1,
                },
              ]}
            >
              {submittingReturn ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.modalActionBtnText}>{refundMethod === 'exchange' ? 'Confirm & Pick Replacement' : 'Confirm Return'}</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
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
  newBillBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8 },
  newBillBtnText: { fontSize: 13, fontFamily: FONT_FAMILY, fontWeight: '600' },

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
  customerName: { fontSize: 14, fontFamily: FONT_FAMILY, marginTop: 6 },
  cardBottomRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  cardMetaGroup: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardMetaText: { fontSize: 12, fontFamily: FONT_FAMILY },
  cardMetaDot: { fontSize: 12, marginHorizontal: 2 },
  cardAmount: { fontSize: 16, fontFamily: FONT_FAMILY, fontWeight: '700' },
  partialNote: { fontSize: 11, fontFamily: FONT_FAMILY, marginTop: 6 },

  errorBox: { alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 40, paddingHorizontal: 20 },
  errorText: { fontSize: 13, fontFamily: FONT_FAMILY },
  retryBtn: { paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1, marginTop: 4 },

  paginationBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1 },
  pageBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 6, paddingHorizontal: 8 },
  pageBtnText: { fontSize: 13, fontFamily: FONT_FAMILY },
  pageIndicator: { fontSize: 12, fontFamily: FONT_FAMILY },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalContent: { width: '100%', maxWidth: 420, padding: 22, borderRadius: 16 },
  modalHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  modalTitle: { fontSize: 18, fontFamily: FONT_FAMILY, fontWeight: '700' },
  modalDivider: { height: 1, marginVertical: 14 },
  modalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  modalLabel: { fontSize: 13, fontFamily: FONT_FAMILY },
  modalValue: { fontSize: 13, fontFamily: FONT_FAMILY, fontWeight: '600' },
  modalDescription: { fontSize: 13, fontFamily: FONT_FAMILY, lineHeight: 20 },
  modalActionsRow: { marginTop: 16 },
  modalActionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 12 },
  modalActionBtnText: { color: '#fff', fontSize: 14, fontFamily: FONT_FAMILY, fontWeight: '600' },
});