import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
import {
  useGetCustomer,
  useListTransactions,
  getGetCustomerQueryKey,
  getListTransactionsQueryKey,
} from '@workspace/api-client-react';
import type { Transaction } from '@workspace/api-client-react';
import { Avatar } from '@/components/Avatar';
import { BalancePill } from '@/components/BalancePill';
import { EmptyState } from '@/components/EmptyState';
import { BillReceiptModal } from '@/components/BillReceiptModal';
import { formatCurrency, formatDateTime } from '@/lib/format';

export default function CustomerLedgerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const customerId = Number(id);
  const { business } = useBusiness();

  // Which bill's receipt popup is open (null = closed)
  const [openBillId, setOpenBillId] = useState<number | null>(null);

  const { data: customer, isLoading: customerLoading } = useGetCustomer(customerId, {
    query: { enabled: !!customerId, queryKey: getGetCustomerQueryKey(customerId) },
  });
  const txParams = { business_id: business?.id as number, customer_id: customerId, limit: 200 };
  const {
    data: txData,
    isLoading: txLoading,
    refetch,
    isRefetching,
  } = useListTransactions(txParams, {
    query: { enabled: !!business?.id && !!customerId, queryKey: getListTransactionsQueryKey(txParams) },
  });

  // A real "bill" is a you_gave transaction (items + total at time of sale).
  // "Payment received — ..." you_got entries are just settlement records for
  // bills paid on the spot, not separate bills — hide them here so a single
  // paid-now sale doesn't show up twice.
  const bills = (txData?.data ?? []).filter((t: Transaction) => t.type === 'you_gave');

  // Row tap now opens the receipt popup instead of navigating to /bill-receipt.
  const handleOpenBill = (billId: number) => setOpenBillId(billId);

  if (customerLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const renderItem = ({ item, index }: { item: Transaction; index: number }) => {
    const zebra = index % 2 === 1;
    return (
      <Pressable
        onPress={() => handleOpenBill(item.id)}
        style={({ pressed }) => [
          styles.tableRow,
          {
            borderBottomColor: colors.border,
            backgroundColor: pressed ? colors.primary + '10' : zebra ? colors.muted : colors.background,
          },
        ]}
      >
        {/* Bill No column */}
        <View style={styles.colBillNo}>
          <Text style={[styles.cellBillNo, { color: colors.primary }]} numberOfLines={1}>
            {(item as any).invoice_no || `#${item.id}`}
          </Text>
        </View>

        {/* Date column */}
        <View style={styles.colDate}>
          <Text style={[styles.cellDate, { color: colors.foreground }]}>{formatDateTime(item.created_at)}</Text>
        </View>

        {/* Amount column */}
        <View style={styles.colAmount}>
          <Text style={[styles.cellAmount, { color: colors.foreground }]}>
            {formatCurrency(item.amount, business?.currency)}
          </Text>
        </View>

        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      </Pressable>
    );
  };

  const TableHeader = () => (
    <View style={[styles.tableHeader, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
      <Text style={[styles.headerCell, styles.colBillNo, { color: colors.mutedForeground }]}>BILL NO</Text>
      <Text style={[styles.headerCell, styles.colDate, { color: colors.mutedForeground }]}>DATE</Text>
      <Text style={[styles.headerCell, styles.colAmount, { color: colors.mutedForeground, textAlign: 'right' }]}>
        AMOUNT
      </Text>
      <View style={{ width: 16 }} />
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Top bar: back + "Ledger" title + small "New Bill" button (replaces the old
          bottom full-width bar) */}
      <View
        style={[
          styles.topBar,
          { paddingTop: insets.top + 10, borderBottomColor: colors.border, backgroundColor: colors.card },
        ]}
      >
        <Pressable onPress={() => router.back()} hitSlop={10}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.topBarTitle, { color: colors.foreground }]}>Ledger</Text>
        <Pressable
          onPress={() => router.push({ pathname: '/billing', params: { customerId: String(customerId) } })}
          style={[styles.newBillBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
        >
          <Feather name="plus" size={14} color={colors.primaryForeground} />
          <Text style={[styles.newBillLabel, { color: colors.primaryForeground }]}>New Bill</Text>
        </Pressable>
      </View>

      <View style={[styles.header, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
        <Avatar name={customer?.name ?? '?'} size={52} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={[styles.name, { color: colors.foreground }]} numberOfLines={1}>
            {customer?.name}
          </Text>
          <Text style={[styles.phone, { color: colors.mutedForeground }]}>{customer?.phone}</Text>
        </View>
        <BalancePill balance={customer?.current_balance ?? 0} currency={business?.currency} />
      </View>

      {txLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : bills.length === 0 ? (
        <EmptyState icon="file-text" title="No bills yet" subtitle="Create the first bill for this customer" />
      ) : (
        <FlatList
          data={bills}
          keyExtractor={(t) => String(t.id)}
          renderItem={renderItem}
          refreshing={isRefetching}
          onRefresh={refetch}
          ListHeaderComponent={TableHeader}
          stickyHeaderIndices={[0]}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24, flexGrow: 1 }}
        />
      )}

      <BillReceiptModal
        visible={openBillId !== null}
        billId={openBillId}
        business={business}
        colors={colors}
        onClose={() => setOpenBillId(null)}
        onChanged={refetch}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  topBarTitle: { fontSize: 17, fontFamily: 'Times New Roman', fontWeight: '700' },
  newBillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  newBillLabel: { fontSize: 11.5, fontFamily: 'Times New Roman', fontWeight: '600' },

  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  name: { fontSize: 17, fontFamily: 'Times New Roman', fontWeight: '700' },
  phone: { fontSize: 12, fontFamily: 'Times New Roman', marginTop: 2 },

  // Table header
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  headerCell: {
    fontSize: 10,
    fontFamily: 'Times New Roman',
    fontWeight: '600',
    letterSpacing: 0.4,
  },

  // Table row
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    gap: 4,
  },

  // Column widths (flex-based, consistent across header + rows)
  colBillNo: { flex: 1.3, paddingRight: 8 },
  colDate: { flex: 1.5, paddingRight: 8 },
  colAmount: { flex: 1, alignItems: 'flex-end' },

  cellBillNo: { fontSize: 13, fontFamily: 'Times New Roman', fontWeight: '700' },
  cellDate: { fontSize: 12, fontFamily: 'Times New Roman' },
  cellAmount: { fontSize: 14, fontFamily: 'Times New Roman', fontWeight: '700', textAlign: 'right' },
});