// app/notifications.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
import { EmptyState } from '@/components/EmptyState';
import { useQueryClient } from '@tanstack/react-query';
// @ts-ignore
import {
  useListAdminNotifications,
  useMarkAdminNotificationRead,
  useMarkAllAdminNotificationsRead,
  getListAdminNotificationsQueryKey,
  getGetAdminNotificationsUnreadCountQueryKey,
  type ListAdminNotificationsFilter
} from '@workspace/api-client-react';

const ICONS: Record<string, { icon: keyof typeof Feather.glyphMap; color: string }> = {
  new_order: { icon: 'shopping-bag', color: '#16A34A' },
  low_stock: { icon: 'box', color: '#F59E0B' },
  vendor_payment_pending: { icon: 'dollar-sign', color: '#7C3AED' },
  vendor_payment_overdue: { icon: 'alert-triangle', color: '#DC2626' },

  subscription_renewal: { icon: 'credit-card', color: '#2563EB' },
  subscription_renewal_success: { icon: 'check-circle', color: '#16A34A' },
  subscription_trial_expiring: { icon: 'clock', color: '#F59E0B' },
};

const FILTERS: { value: string; label: string }[] = [
  { value: 'ALL', label: 'All' },
  { value: 'NEW_ORDERS', label: 'New Orders' },
  { value: 'LOW_STOCK', label: 'Low Stock' },
  { value: 'VENDOR_PAYMENTS', label: 'Vendor Payments' },
  { value: 'SUBSCRIPTION', label: 'Subscription' }, // NEW — matches TYPE_GROUPS.SUBSCRIPTION in adminNotifications.ts

];

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const LIMIT = 20;

export default function NotificationsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { business } = useBusiness();
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState('ALL');
  const [page, setPage] = useState(1);

  const listParams = {
    business_id: business?.id as number,
    filter: filter as any,
    page,
    limit: LIMIT,
  };

  const { data, isLoading, isFetching, refetch } = useListAdminNotifications(listParams, {
    query: {
      enabled: !!business?.id,
      queryKey: getListAdminNotificationsQueryKey(listParams),
    },
  });

  const markRead = useMarkAdminNotificationRead();
  const markAllRead = useMarkAllAdminNotificationsRead();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getListAdminNotificationsQueryKey(listParams) });
    queryClient.invalidateQueries({
      queryKey: getGetAdminNotificationsUnreadCountQueryKey({ business_id: business?.id as number }),
    });
  };

  const handlePress = async (n: any) => {
    if (n.type === 'low_stock' && n.product_id) {
      router.push({ pathname: '/add-product', params: { id: String(n.product_id) } });
    } else if (n.type === 'new_order') {
      router.push('/delivery-list' as any);
    } else if (n.type.startsWith('vendor_payment')) {
      router.push('/reports' as any);
    }else if (n.type.startsWith('subscription_')) {
    // NEW
    router.push('/subscription-status' as any);
  }

    if (!n.is_read) {
      try {
        await markRead.mutateAsync({ id: n.id });
        invalidate();
      } catch (err) {
        console.warn('[Notifications] failed to mark read:', err);
      }
    }
  };

  const handleMarkAll = async () => {
    await markAllRead.mutateAsync({ params: { business_id: business?.id as number } } as any);
    invalidate();
  };

  const items = data?.data ?? [];
  const total = data?.total ?? 0;
  const hasMore = page * LIMIT < total;

  const handleFilterChange = (value: string) => {
    setFilter(value);
    setPage(1);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={[styles.header, { paddingTop: insets.top + 12, borderBottomColor: colors.border }]}>
        <Pressable onPress={() => router.back()} hitSlop={8} style={styles.backBtn}>
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>Notifications</Text>
          <Text style={[styles.headerSubtitle, { color: colors.mutedForeground }]}>
            {total} notification{total === 1 ? '' : 's'}
          </Text>
        </View>
        <Pressable onPress={handleMarkAll}>
          <Text style={[styles.markAllText, { color: colors.primary }]}>Mark all</Text>
        </Pressable>
      </View>

      <View style={styles.filterStripWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterStripContent}
        >
          {FILTERS.map((f) => {
            const active = f.value === filter;
            return (
              <Pressable
                key={f.value}
                onPress={() => handleFilterChange(f.value)}
                style={[
                  styles.filterChip,
                  {
                    borderRadius: colors.radius,
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={{ color: active ? colors.primaryForeground : colors.foreground, fontSize: 12 }}>
                  {f.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : items.length === 0 ? (
        <EmptyState
          icon="bell-off"
          title="You're all caught up!"
          subtitle="No notifications to show here."
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item: any) => `notif-${item.id}`}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: insets.bottom + 20 }}
          refreshing={isFetching}
          onRefresh={refetch}
          renderItem={({ item: n }: { item: any }) => {
            const meta = ICONS[n.type] ?? { icon: 'bell', color: colors.mutedForeground };
            return (
              <Pressable
                onPress={() => handlePress(n)}
                style={[
                  styles.notifRow,
                  {
                    backgroundColor: n.is_read ? colors.card : colors.primary + '08',
                    borderColor: colors.border,
                    borderRadius: colors.radius,
                  },
                ]}
              >
                <View style={[styles.notifIcon, { backgroundColor: meta.color + '15' }]}>
                  <Feather name={meta.icon} size={16} color={meta.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.notifTitle, { color: colors.foreground }]}>{n.title}</Text>
                  <Text style={[styles.notifMessage, { color: colors.mutedForeground }]}>{n.message}</Text>
                  <Text style={[styles.notifTime, { color: colors.mutedForeground }]}>
                    {timeAgo(n.created_at)}
                  </Text>
                </View>
                {!n.is_read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
              </Pressable>
            );
          }}
          ListFooterComponent={
            hasMore ? (
              <Pressable
                onPress={() => setPage((p) => p + 1)}
                style={[styles.loadMoreBtn, { borderColor: colors.border, borderRadius: colors.radius }]}
              >
                <Text style={{ color: colors.primary, fontSize: 13 }}>Load more</Text>
              </Pressable>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, paddingBottom: 14, borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontFamily: 'Inter_700Bold' },
  headerSubtitle: { fontSize: 12, fontFamily: 'Inter_500Medium', marginTop: 2 },
  markAllText: { fontSize: 13, fontFamily: 'Inter_600SemiBold' },

  filterStripWrap: { paddingVertical: 10 },
  filterStripContent: { paddingHorizontal: 16, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1 },

  notifRow: {
    flexDirection: 'row', gap: 10, padding: 14, alignItems: 'flex-start',
    borderWidth: 1, marginBottom: 8,
  },
  notifIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  notifTitle: { fontSize: 13.5, fontFamily: 'Inter_600SemiBold' },
  notifMessage: { fontSize: 12.5, fontFamily: 'Inter_500Medium', marginTop: 2 },
  notifTime: { fontSize: 10.5, fontFamily: 'Inter_500Medium', marginTop: 4 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, marginTop: 4 },

  loadMoreBtn: {
    alignItems: 'center', justifyContent: 'center', paddingVertical: 12,
    borderWidth: 1, marginTop: 4, marginBottom: 10,
  },
});