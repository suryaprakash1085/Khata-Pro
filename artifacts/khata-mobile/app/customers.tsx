import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
// @ts-ignore
import { useListCustomers, getListCustomersQueryKey } from '@workspace/api-client-react';
// @ts-ignore
import type { Customer } from '@workspace/api-client-react';
import { formatCurrency } from '@/lib/format';

export default function CustomersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();
  const [search, setSearch] = useState('');

  const params = { business_id: business?.id as number, search: search || undefined, limit: 50 };
  const { data, isLoading } = useListCustomers(params, {
    query: { enabled: !!business?.id, queryKey: getListCustomersQueryKey(params) },
  });

  const customers: Customer[] = data?.data ?? [];

  const getInitial = (name?: string) => (name ? name.trim().charAt(0).toUpperCase() : '?');

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.title, { color: colors.foreground }]}>Customers</Text>
        <View style={{ width: 32 }} />
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <View style={[styles.searchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={17} color={colors.mutedForeground} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search customers..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 24 }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
        ) : customers.length === 0 ? (
          <View style={styles.emptyState}>
            <Feather name="users" size={32} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No customers found</Text>
          </View>
        ) : (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {customers.map((customer: any, index) => (
              <Pressable
                key={customer.id}
                onPress={() => router.push(`/customer/${customer.id}` as any)}
                style={[
                  styles.customerRow,
                  { borderBottomColor: colors.border },
                  index === customers.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={[styles.avatar, { backgroundColor: colors.primary + '15' }]}>
                  <Text style={[styles.avatarText, { color: colors.primary }]}>
                    {getInitial(customer.name)}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.customerName, { color: colors.foreground }]} numberOfLines={1}>
                    {customer.name ?? 'Unnamed'}
                  </Text>
                  {!!customer.phone && (
                    <Text style={[styles.customerPhone, { color: colors.mutedForeground }]}>
                      {customer.phone}
                    </Text>
                  )}
                </View>
                <Text
                  style={[
                    styles.balance,
                    { color: (customer.balance ?? 0) > 0 ? '#F97316' : '#16A34A' },
                  ]}
                >
                  {formatCurrency(customer.balance ?? 0, business?.currency)}
                </Text>
                <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  backBtn: { width: 32 },
  title: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 46,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: 14, fontFamily: 'Inter_500Medium' },
  card: { borderRadius: 18, borderWidth: 1, paddingHorizontal: 14 },
  customerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  customerName: { fontSize: 14, fontFamily: 'Inter_600SemiBold' },
  customerPhone: { fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 1 },
  balance: { fontSize: 13.5, fontFamily: 'Inter_700Bold' },
  emptyState: { alignItems: 'center', paddingVertical: 60, gap: 10 },
  emptyText: { fontSize: 13, fontFamily: 'Inter_500Medium' },
});