import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, Stack } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
import { formatCurrency } from '@/lib/format';
import { useListTransactions } from '@workspace/api-client-react';

type Period = 'today' | 'week' | 'month' | 'all';

const PERIODS: { value: Period; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'all', label: 'All Time' },
];

function isInPeriod(dateStr: string, period: Period) {
  if (period === 'all') return true;
  const date = new Date(dateStr);
  const now = new Date();

  if (period === 'today') {
    return date.toDateString() === now.toDateString();
  }
  if (period === 'week') {
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    return date >= startOfWeek;
  }
  // month
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
}

export default function BillingSummaryScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();

  const [period, setPeriod] = useState<Period>('today');
  const [refreshing, setRefreshing] = useState(false);

  const transactionParams = { business_id: business?.id as number, limit: 500, sort: '-entry_date' };
  const {
    data: transactionsData,
    isLoading,
    refetch,
  } = useListTransactions(transactionParams, {
    query: { enabled: !!business?.id, queryKey: ['/api/transactions', transactionParams] },
  });
  const transactions = transactionsData?.data || [];

  const stats = useMemo(() => {
    const bills = transactions.filter((t: any) => t.type === 'you_gave' && isInPeriod(t.entry_date, period));
    const payments = transactions.filter((t: any) => t.type === 'you_got' && isInPeriod(t.entry_date, period));

    const totalRevenue = bills.reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
    const totalCollected = payments.reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
    const cashCollected = payments.filter((t: any) => t.payment_mode === 'cash').reduce((sum: number, t: any) => sum + (t.amount || 0), 0);
    const onlineCollected = totalCollected - cashCollected;
    const uniqueCustomers = new Set(bills.map((t: any) => t.customer_id)).size;

    return {
      totalBills: bills.length,
      totalRevenue,
      pending: Math.max(totalRevenue - totalCollected, 0),
      cashCollected,
      onlineCollected,
      uniqueCustomers,
      recent: bills.slice(0, 10),
    };
  }, [transactions, period]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={() => router.back()} hitSlop={10}>
            <Feather name="arrow-left" size={20} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Billing Summary</Text>
          <View style={{ width: 20 }} />
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: 20, gap: 8, alignItems: 'flex-start', paddingVertical: 14 }}>
        {PERIODS.map((p) => {
          const active = period === p.value;
          return (
            <Pressable
              key={p.value}
              onPress={() => setPeriod(p.value)}
              style={[styles.periodChip, { borderRadius: colors.radius, backgroundColor: active ? colors.primary : colors.card, borderColor: active ? colors.primary : colors.border }]}
            >
              <Text style={{ color: active ? colors.primaryForeground : colors.foreground, fontSize: 13, fontFamily: 'Inter_500Medium' }}>{p.label}</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={async () => {
                setRefreshing(true);
                await refetch();
                setRefreshing(false);
              }}
              colors={[colors.primary]}
            />
          }
        >
          <View style={styles.grid}>
            {[
              { label: 'Total Bills', value: String(stats.totalBills), icon: 'file-text', tint: colors.primary },
              { label: 'Revenue', value: formatCurrency(stats.totalRevenue, business?.currency), icon: 'trending-up', tint: colors.success },
              { label: 'Pending', value: formatCurrency(stats.pending, business?.currency), icon: 'clock', tint: colors.destructive },
              { label: 'Customers', value: String(stats.uniqueCustomers), icon: 'users', tint: colors.primary },
              { label: 'Cash Collected', value: formatCurrency(stats.cashCollected, business?.currency), icon: 'dollar-sign', tint: colors.success },
              { label: 'Online Payments', value: formatCurrency(stats.onlineCollected, business?.currency), icon: 'smartphone', tint: colors.primary },
            ].map((card) => (
              <View key={card.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
                <View style={[styles.statIconWrap, { backgroundColor: `${card.tint}1A` }]}>
                  <Feather name={card.icon as any} size={16} color={card.tint} />
                </View>
                <Text style={[styles.statValue, { color: colors.foreground }]}>{card.value}</Text>
                <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{card.label}</Text>
              </View>
            ))}
          </View>

          <View style={styles.recentSection}>
            <Text style={[styles.recentTitle, { color: colors.foreground }]}>Recent Activity</Text>
            {stats.recent.length === 0 ? (
              <View style={styles.emptyRecent}>
                <Feather name="inbox" size={32} color={colors.mutedForeground} />
                <Text style={[styles.emptyRecentText, { color: colors.mutedForeground }]}>No bills in this period</Text>
              </View>
            ) : (
              stats.recent.map((t: any) => (
                <View key={t.id} style={[styles.recentRow, { borderBottomColor: colors.border }]}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.recentName, { color: colors.foreground }]}>{t.customer?.name || 'Unknown'}</Text>
                    <Text style={[styles.recentMeta, { color: colors.mutedForeground }]}>
                      {t.description?.split(':')[1]?.trim() || t.description?.split(':')[0]} • {new Date(t.entry_date).toLocaleDateString()}
                    </Text>
                  </View>
                  <Text style={[styles.recentAmount, { color: colors.destructive }]}>-{formatCurrency(t.amount, business?.currency)}</Text>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 20, paddingBottom: 14, borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { fontSize: 18, fontFamily: 'Inter_700Bold', fontWeight: '700' },

  periodChip: { paddingHorizontal: 16, paddingVertical: 9, borderWidth: 1 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20 },
  statCard: { width: '47%', padding: 14, borderWidth: 1 },
  statIconWrap: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  statValue: { fontSize: 17, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  statLabel: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },

  recentSection: { paddingHorizontal: 20, marginTop: 24 },
  recentTitle: { fontSize: 15, fontFamily: 'Inter_600SemiBold', fontWeight: '600', marginBottom: 10 },
  recentRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1 },
  recentName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
  recentMeta: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  recentAmount: { fontSize: 14, fontFamily: 'Inter_700Bold', fontWeight: '700' },
  emptyRecent: { alignItems: 'center', paddingVertical: 30 },
  emptyRecentText: { fontSize: 13, fontFamily: 'Inter_400Regular', marginTop: 8 },
});