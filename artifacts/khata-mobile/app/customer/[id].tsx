import React from 'react';
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
import { formatCurrency, formatDateTime } from '@/lib/format';

export default function CustomerLedgerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const customerId = Number(id);
  const { business } = useBusiness();

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

  const transactions = txData?.data ?? [];

  if (customerLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Transaction }) => {
    const isGave = item.type === 'you_gave';
    return (
      <View style={[styles.txRow, { borderBottomColor: colors.border }]}>
        <View style={{ flex: 1 }}>
          <Text style={[styles.txType, { color: isGave ? colors.destructive : colors.success }]}>
            {isGave ? 'You gave' : 'You got'}
          </Text>
          {item.description ? (
            <Text style={[styles.txDesc, { color: colors.mutedForeground }]} numberOfLines={1}>
              {item.description}
            </Text>
          ) : null}
          <Text style={[styles.txDate, { color: colors.mutedForeground }]}>{formatDateTime(item.entry_date)}</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={[styles.txAmount, { color: isGave ? colors.destructive : colors.success }]}>
            {isGave ? '-' : '+'}
            {formatCurrency(item.amount, business?.currency)}
          </Text>
          <Text style={[styles.txBalance, { color: colors.mutedForeground }]}>
            Bal: {formatCurrency(item.balance_after, business?.currency)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
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
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(t) => String(t.id)}
          renderItem={renderItem}
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={{ paddingBottom: insets.bottom + 110, flexGrow: 1 }}
          ListEmptyComponent={
            <EmptyState icon="file-text" title="No entries yet" subtitle="Add the first ledger entry for this customer" />
          }
        />
      )}

      <View style={[styles.actionsRow, { paddingBottom: insets.bottom + 16, backgroundColor: colors.background }]}>
        <Pressable
          onPress={() => router.push({ pathname: '/add-transaction', params: { customerId: String(customerId), type: 'you_gave' } })}
          style={[styles.actionBtn, { backgroundColor: colors.destructive, borderRadius: colors.radius }]}
        >
          <Feather name="arrow-up-right" size={16} color={colors.destructiveForeground} />
          <Text style={[styles.actionLabel, { color: colors.destructiveForeground }]}>You gave</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push({ pathname: '/add-transaction', params: { customerId: String(customerId), type: 'you_got' } })}
          style={[styles.actionBtn, { backgroundColor: colors.success, borderRadius: colors.radius }]}
        >
          <Feather name="arrow-down-left" size={16} color={colors.successForeground} />
          <Text style={[styles.actionLabel, { color: colors.successForeground }]}>You got</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1 },
  name: { fontSize: 17, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  phone: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  txRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1 },
  txType: { fontSize: 14, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
  txDesc: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  txDate: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 3 },
  txAmount: { fontSize: 15, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  txBalance: { fontSize: 11, fontFamily: 'Inter_400Regular', marginTop: 2 },
  actionsRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14 },
  actionLabel: { fontSize: 15, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
});
