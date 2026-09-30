import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { customFetch } from '@workspace/api-client-react';
import { formatCurrency, formatDateTime } from '@/lib/format';

// ---------------------------------------------------------------------------
// Shared bill-items data hook (moved here from bill-receipt/index.tsx so both
// the full-page receipt and the new popup modal can use the same query/cache
// key — no duplicate network requests when both are mounted).
// ---------------------------------------------------------------------------
export type BillItem = {
  product_id: number;
  product_name: string;
  unit?: string;
  qty: number;
  unit_price: number;
};

export function useBillItems(transactionId?: number, enabled?: boolean) {
  return useQuery<BillItem[]>({
    queryKey: ['transactions', transactionId, 'items'],
    enabled: !!transactionId && !!enabled,
    queryFn: () => customFetch(`/api/transactions/${transactionId}/items`, { responseType: 'json' }),
  });
}

// ---------------------------------------------------------------------------
// Presentational receipt card — identical layout/logic to what bill-receipt
// used to render inline. Pulled out so the popup modal can reuse it exactly.
// ---------------------------------------------------------------------------
export function BillReceiptCard({
  colors,
  business,
  transaction,
  customer,
  items,
  itemsError,
}: {
  colors: any;
  business: any;
  transaction: any;
  customer: any;
  items: BillItem[];
  itemsError?: boolean;
}) {
  const t: any = transaction;
  const billItems = itemsError ? [] : items ?? [];

  const itemsSubtotal = billItems.reduce((sum, i) => sum + (i.unit_price ?? 0) * (i.qty ?? 0), 0);
  const tax = t.tax ?? 0;
  const grandTotal = t.amount ?? 0;
  const derivedDiscount = Math.max(itemsSubtotal + tax - grandTotal, 0);

  const isCredit = !!t.due_date;
  const paidAmount = isCredit ? 0 : grandTotal;
  const balanceDue = isCredit ? grandTotal : 0;

  return (
    <View style={[styles.receiptCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={{ alignItems: 'center', marginBottom: 14 }}>
        <Text style={[styles.businessName, { color: colors.foreground }]}>
          {business?.business_name || 'Khata-Pro'}
        </Text>
        <Text style={[styles.metaText, { color: colors.mutedForeground }]}>
          Invoice: {t.invoice_no || `#${t.id}`}
        </Text>
        <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{formatDateTime(t.created_at)}</Text>
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <View style={{ marginBottom: 10 }}>
        <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Customer</Text>
        <Text style={[styles.customerName, { color: colors.foreground }]}>
          {customer?.name ?? t.customer_name ?? 'Walk-in customer'}
        </Text>
        {!!customer?.phone && (
          <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{customer.phone}</Text>
        )}
      </View>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {itemsError ? (
        <Text style={[styles.metaText, { color: '#DC2626', paddingVertical: 8 }]}>
          Couldn't load item details for this bill.
        </Text>
      ) : billItems.length === 0 ? (
        <Text style={[styles.metaText, { color: colors.mutedForeground, paddingVertical: 8 }]}>
          No item-level detail recorded for this bill.
        </Text>
      ) : (
        <View style={{ marginVertical: 6 }}>
          <View style={styles.itemsHeaderRow}>
            <Text style={[styles.itemsHeaderCell, { flex: 2.2, color: colors.primary }]}>Item</Text>
            <Text style={[styles.itemsHeaderCell, { flex: 0.8, textAlign: 'center', color: colors.primary }]}>
              Qty
            </Text>
            <Text style={[styles.itemsHeaderCell, { flex: 1, textAlign: 'right', color: colors.primary }]}>
              Price
            </Text>
            <Text style={[styles.itemsHeaderCell, { flex: 1, textAlign: 'right', color: colors.primary }]}>
              Total
            </Text>
          </View>
          {billItems.map((item) => (
            <View key={item.product_id} style={[styles.itemRow, { borderBottomColor: colors.border }]}>
              <Text style={[styles.itemCell, { flex: 2.2, color: colors.foreground }]} numberOfLines={2}>
                {item.product_name}
              </Text>
              <Text style={[styles.itemCell, { flex: 0.8, textAlign: 'center', color: colors.foreground }]}>
                {item.qty}
                {item.unit ? ` ${item.unit}` : ''}
              </Text>
              <Text style={[styles.itemCell, { flex: 1, textAlign: 'right', color: colors.foreground }]}>
                {formatCurrency(item.unit_price, business?.currency)}
              </Text>
              <Text style={[styles.itemCellBold, { flex: 1, textAlign: 'right', color: colors.foreground }]}>
                {formatCurrency(item.unit_price * item.qty, business?.currency)}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      <TotalRow label="Subtotal" value={formatCurrency(itemsSubtotal, business?.currency)} colors={colors} />
      {derivedDiscount > 0.01 && (
        <TotalRow
          label="Discount"
          value={`- ${formatCurrency(derivedDiscount, business?.currency)}`}
          colors={colors}
          valueColor="#16A34A"
        />
      )}
      <TotalRow
        label={`GST${t.gst_rate ? ` (${Number(t.gst_rate).toFixed(1)}%)` : ''}`}
        value={formatCurrency(tax, business?.currency)}
        colors={colors}
      />
      <View style={[styles.divider, { backgroundColor: colors.border, marginVertical: 8 }]} />
      <TotalRow label="Total" value={formatCurrency(grandTotal, business?.currency)} colors={colors} bold big />

      <View style={[styles.divider, { backgroundColor: colors.border, marginTop: 8 }]} />

      <TotalRow label="Payment method" value={(t.payment_mode ?? 'cash').toUpperCase()} colors={colors} />
      <TotalRow
        label="Paid"
        value={formatCurrency(paidAmount, business?.currency)}
        colors={colors}
        valueColor="#16A34A"
      />
      {balanceDue > 0.01 && (
        <TotalRow
          label="Balance due"
          value={formatCurrency(balanceDue, business?.currency)}
          colors={colors}
          valueColor="#DC2626"
          bold
        />
      )}
    </View>
  );
}

function TotalRow({
  label,
  value,
  colors,
  valueColor,
  bold,
  big,
}: {
  label: string;
  value: string;
  colors: any;
  valueColor?: string;
  bold?: boolean;
  big?: boolean;
}) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 }}>
      <Text
        style={{
          fontSize: big ? 15 : 13,
          fontFamily: 'Times New Roman',
          fontWeight: bold ? '700' : '500',
          color: colors.mutedForeground,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontSize: big ? 18 : 13,
          fontFamily: 'Times New Roman',
          fontWeight: bold ? '700' : '600',
          color: valueColor ?? colors.foreground,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  receiptCard: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 18,
    maxWidth: 480,
    width: '100%',
    alignSelf: 'center',
  },
  businessName: { fontSize: 17, fontFamily: 'Times New Roman', fontWeight: '700' },
  metaText: { fontSize: 12, fontFamily: 'Times New Roman', marginTop: 2 },
  sectionLabel: {
    fontSize: 10.5,
    fontFamily: 'Times New Roman',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 2,
  },
  customerName: { fontSize: 14, fontFamily: 'Times New Roman', fontWeight: '700' },
  divider: { height: 1, marginVertical: 10 },

  itemsHeaderRow: { flexDirection: 'row', paddingBottom: 6 },
  itemsHeaderCell: { fontSize: 10.5, fontFamily: 'Times New Roman', fontWeight: '700', textTransform: 'uppercase' },
  itemRow: { flexDirection: 'row', paddingVertical: 8, borderBottomWidth: 1 },
  itemCell: { fontSize: 12.5, fontFamily: 'Times New Roman' },
  itemCellBold: { fontSize: 12.5, fontFamily: 'Times New Roman', fontWeight: '700' },
});