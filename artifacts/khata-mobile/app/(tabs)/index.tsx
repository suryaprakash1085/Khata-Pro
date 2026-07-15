import React, { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
import {
  useGetBusinessStats,
  useListCustomers,
  getGetBusinessStatsQueryKey,
  getListCustomersQueryKey,
} from '@workspace/api-client-react';
import type { Customer } from '@workspace/api-client-react';
import { Avatar } from '@/components/Avatar';
import { BalancePill } from '@/components/BalancePill';
import { EmptyState } from '@/components/EmptyState';
import { formatCurrency } from '@/lib/format';

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();
  const [search, setSearch] = useState('');

  const { data: stats } = useGetBusinessStats(business?.id as number, {
    query: { enabled: !!business?.id, queryKey: getGetBusinessStatsQueryKey(business?.id as number) },
  });
  const customersParams = { business_id: business?.id as number, search: search || undefined, limit: 100 };
  const {
    data: customersData,
    isLoading,
    refetch,
    isRefetching,
  } = useListCustomers(customersParams, {
    query: { enabled: !!business?.id, queryKey: getListCustomersQueryKey(customersParams) },
  });

  const customers = customersData?.data ?? [];

  const renderItem = ({ item }: { item: Customer }) => (
    <Pressable
      onPress={() => router.push({ pathname: '/customer/[id]', params: { id: String(item.id) } })}
      style={({ pressed }) => [styles.row, { backgroundColor: pressed ? colors.muted : colors.card }]}
    >
      <Avatar name={item.name} />
      <View style={styles.rowMid}>
        <Text style={[styles.rowName, { color: colors.foreground }]} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={[styles.rowPhone, { color: colors.mutedForeground }]}>{item.phone}</Text>
      </View>
      <BalancePill balance={item.current_balance} currency={business?.currency} />
    </Pressable>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <View>
          <Text style={[styles.businessName, { color: colors.foreground }]} numberOfLines={1}>
            {business?.business_name ?? ''}
          </Text>
          <Text style={[styles.planLabel, { color: colors.mutedForeground }]}>
            {(business?.plan ?? 'free').toUpperCase()} PLAN
          </Text>
        </View>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>You'll get</Text>
          <Text style={[styles.statValue, { color: colors.success }]}>
            {formatCurrency(stats?.total_to_collect ?? 0, business?.currency)}
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>You'll pay</Text>
          <Text style={[styles.statValue, { color: colors.destructive }]}>
            {formatCurrency(stats?.total_to_pay ?? 0, business?.currency)}
          </Text>
        </View>
      </View>

      <View style={[styles.searchWrap, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
        <Feather name="search" size={16} color={colors.mutedForeground} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search customers"
          placeholderTextColor={colors.mutedForeground}
          style={[styles.searchInput, { color: colors.foreground }]}
        />
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(c) => String(c.id)}
          renderItem={renderItem}
          refreshing={isRefetching}
          onRefresh={refetch}
          contentContainerStyle={{ paddingBottom: insets.bottom + 100, flexGrow: 1 }}
          ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: colors.border, marginLeft: 76 }} />}
          ListEmptyComponent={
            <EmptyState
              icon="users"
              title="No customers yet"
              subtitle="Add your first customer to start tracking their ledger"
            />
          }
        />
      )}

      <Pressable
        onPress={() => router.push('/add-customer')}
        style={[styles.fab, { backgroundColor: colors.primary, bottom: insets.bottom + 20 }]}
      >
        <Feather name="plus" size={26} color={colors.primaryForeground} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 14 },
  businessName: { fontSize: 22, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  planLabel: { fontSize: 11, fontFamily: 'Inter_600SemiBold', marginTop: 2, letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 14 },
  statCard: { flex: 1, padding: 14 },
  statLabel: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  statValue: { fontSize: 18, fontFamily: 'Inter_700Bold', fontWeight: '700', marginTop: 4 },
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 20,
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  searchInput: { flex: 1, fontSize: 15, fontFamily: 'Inter_400Regular' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 12 },
  rowMid: { flex: 1 },
  rowName: { fontSize: 15, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
  rowPhone: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
});
