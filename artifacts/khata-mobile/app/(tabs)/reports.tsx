import React from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
import {
  useGetReportSummary,
  useGetTopCustomers,
  getGetReportSummaryQueryKey,
  getGetTopCustomersQueryKey,
  type TopCustomer,
} from '@workspace/api-client-react';
import { Avatar } from '@/components/Avatar';
import { BalancePill } from '@/components/BalancePill';
import { EmptyState } from '@/components/EmptyState';
import { formatCurrency } from '@/lib/format';

export default function ReportsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();

  const summaryParams = { business_id: business?.id as number };
  const { data: summary, isLoading } = useGetReportSummary(summaryParams, {
    query: { enabled: !!business?.id, queryKey: getGetReportSummaryQueryKey(summaryParams) },
  });
  const topCustomersParams = { business_id: business?.id as number, limit: 5 };
  const { data: topCustomers } = useGetTopCustomers(topCustomersParams, {
    query: { enabled: !!business?.id, queryKey: getGetTopCustomersQueryKey(topCustomersParams) },
  });

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
      contentContainerStyle={{ paddingTop: insets.top + 20, paddingBottom: insets.bottom + 100, paddingHorizontal: 20 }}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>Reports</Text>

      <View style={[styles.card, { backgroundColor: colors.card, borderRadius: colors.radius }]}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCell}>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Net balance</Text>
            <Text
              style={[
                styles.summaryValue,
                { color: (summary?.net_balance ?? 0) >= 0 ? colors.success : colors.destructive },
              ]}
            >
              {formatCurrency(summary?.net_balance ?? 0, business?.currency)}
            </Text>
          </View>
          <View style={styles.summaryCell}>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Customers</Text>
            <Text style={[styles.summaryValue, { color: colors.foreground }]}>{summary?.total_customers ?? 0}</Text>
          </View>
        </View>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.summaryRow}>
          <View style={styles.summaryCell}>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Today's collection</Text>
            <Text style={[styles.summaryValue, { color: colors.success, fontSize: 15 }]}>
              {formatCurrency(summary?.today_collection ?? 0, business?.currency)}
            </Text>
          </View>
          <View style={styles.summaryCell}>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Today's payment</Text>
            <Text style={[styles.summaryValue, { color: colors.destructive, fontSize: 15 }]}>
              {formatCurrency(summary?.today_payment ?? 0, business?.currency)}
            </Text>
          </View>
        </View>
        <View style={styles.summaryRow}>
          <View style={styles.summaryCell}>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>This week's collection</Text>
            <Text style={[styles.summaryValue, { color: colors.success, fontSize: 15 }]}>
              {formatCurrency(summary?.week_collection ?? 0, business?.currency)}
            </Text>
          </View>
          <View style={styles.summaryCell}>
            <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>This week's payment</Text>
            <Text style={[styles.summaryValue, { color: colors.destructive, fontSize: 15 }]}>
              {formatCurrency(summary?.week_payment ?? 0, business?.currency)}
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Top customers</Text>
      <View style={[styles.card, { backgroundColor: colors.card, borderRadius: colors.radius, padding: 0 }]}>
        {!topCustomers || topCustomers.length === 0 ? (
          <EmptyState icon="award" title="No activity yet" subtitle="Top customers appear once you record entries" />
        ) : (
          topCustomers.map((c: TopCustomer, i: number) => (
            <Pressable
              key={c.id}
              onPress={() => router.push({ pathname: '/customer/[id]', params: { id: String(c.id) } })}
              style={[
                styles.customerRow,
                i < topCustomers.length - 1 ? { borderBottomWidth: 1, borderBottomColor: colors.border } : null,
              ]}
            >
              <Avatar name={c.name} size={38} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.customerName, { color: colors.foreground }]}>{c.name}</Text>
                <Text style={[styles.customerMeta, { color: colors.mutedForeground }]}>
                  {c.transaction_count} entries
                </Text>
              </View>
              <BalancePill balance={c.current_balance} currency={business?.currency} />
            </Pressable>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontFamily: 'Inter_700Bold', fontWeight: '700', marginBottom: 16 },
  card: { padding: 16, marginBottom: 20 },
  summaryRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  summaryCell: { flex: 1 },
  summaryLabel: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  summaryValue: { fontSize: 20, fontFamily: 'Inter_700Bold', fontWeight: '700', marginTop: 4 },
  divider: { height: 1, marginBottom: 12 },
  sectionTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', fontWeight: '600', marginBottom: 10 },
  customerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  customerName: { fontSize: 14, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
  customerMeta: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
});
