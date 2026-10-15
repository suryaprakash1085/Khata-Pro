// components/NotificationBell/NotificationBell.tsx
import React, { useState } from 'react';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
import { getNotificationRoute } from '@/lib/notificationRoute';
// @ts-ignore
import {
  useListAdminNotifications,
  useGetAdminNotificationsUnreadCount,
  useMarkAdminNotificationRead,
  useMarkAllAdminNotificationsRead,
  getListAdminNotificationsQueryKey,
  getGetAdminNotificationsUnreadCountQueryKey,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';

const DROPDOWN_LIMIT = 2;

const ICONS: Record<string, { icon: keyof typeof Feather.glyphMap; color: string }> = {
  new_order: { icon: 'shopping-bag', color: '#16A34A' },
  low_stock: { icon: 'box', color: '#F59E0B' },
  vendor_payment_pending: { icon: 'dollar-sign', color: '#7C3AED' },
  vendor_payment_overdue: { icon: 'alert-triangle', color: '#DC2626' },
  subscription_renewal: { icon: 'credit-card', color: '#2563EB' },
  subscription_renewal_success: { icon: 'check-circle', color: '#16A34A' },
  subscription_trial_expiring: { icon: 'clock', color: '#F59E0B' },
  order_return: { icon: 'corner-up-left', color: '#EA580C' },
  return_requested: { icon: 'corner-up-left', color: '#EA580C' },
};

function timeAgo(dateStr: string): string {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationBell() {
  const colors = useColors();
  const { business } = useBusiness();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const unreadParams = { business_id: business?.id as number };
  const { data: unread } = useGetAdminNotificationsUnreadCount(unreadParams, {
    query: {
      enabled: !!business?.id,
      queryKey: getGetAdminNotificationsUnreadCountQueryKey(unreadParams),
      refetchInterval: 20000,
    },
  });

  const listParams = { business_id: business?.id as number, limit: DROPDOWN_LIMIT };
  const { data: list, isLoading } = useListAdminNotifications(listParams, {
    query: {
      enabled: !!business?.id && open,
      queryKey: getListAdminNotificationsQueryKey(listParams),
      refetchInterval: open ? 20000 : false,
    },
  });

  const markRead = useMarkAdminNotificationRead();
  const markAllRead = useMarkAllAdminNotificationsRead();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: getGetAdminNotificationsUnreadCountQueryKey(unreadParams) });
    queryClient.invalidateQueries({ queryKey: getListAdminNotificationsQueryKey(listParams) });
  };

  const handleNotificationPress = async (n: any) => {
    setOpen(false);

    // Navigate first — must not be blocked by mark-read failing.
    const route = getNotificationRoute(n);
    if (route) router.push(route as any);

    if (!n.is_read) {
      try {
        await markRead.mutateAsync({ id: n.id });
        invalidate();
      } catch (err) {
        console.warn('[NotificationBell] failed to mark notification read:', err);
      }
    }
  };

  const handleMarkAll = async () => {
    await markAllRead.mutateAsync({ params: unreadParams } as any);
    invalidate();
  };

  const count = unread?.count ?? 0;
  const items = (list?.data ?? []).slice(0, DROPDOWN_LIMIT);

  return (
    <View style={{ position: 'relative' }}>
      <Pressable
        onPress={() => setOpen((o) => !o)}
        style={[styles.bellButton, { backgroundColor: colors.card, borderColor: colors.border }]}
        hitSlop={8}
      >
        <Feather name="bell" size={17} color={colors.foreground} />
        {count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
          </View>
        )}
      </Pressable>

      {open && (
        <>
          {Platform.OS !== 'web' && (
            <Pressable style={StyleSheet.absoluteFillObject as any} onPress={() => setOpen(false)} />
          )}
          <View style={[styles.dropdown, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.dropdownHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.dropdownTitle, { color: colors.foreground }]}>Notifications</Text>
              <Pressable onPress={handleMarkAll}>
                <Text style={[styles.markAllText, { color: colors.primary }]}>Mark all</Text>
              </Pressable>
            </View>

            <View>
              {isLoading ? (
                <ActivityIndicator style={{ paddingVertical: 24 }} color={colors.primary} />
              ) : items.length === 0 ? (
                <View style={styles.emptyState}>
                  <Feather name="bell-off" size={28} color={colors.mutedForeground} />
                  <Text style={[styles.emptyTitle, { color: colors.foreground }]}>You're all caught up!</Text>
                  <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>No new notifications.</Text>
                </View>
              ) : (
                items.map((n: any, idx: number) => {
                  const meta = ICONS[n.type] ?? { icon: 'bell', color: colors.mutedForeground };
                  return (
                    <Pressable
                      key={n.id}
                      onPress={() => handleNotificationPress(n)}
                      style={[
                        styles.notifRow,
                        { backgroundColor: n.is_read ? 'transparent' : colors.primary + '08' },
                        idx !== items.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
                      ]}
                    >
                      <View style={[styles.notifIcon, { backgroundColor: meta.color + '15' }]}>
                        <Feather name={meta.icon} size={14} color={meta.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.notifTitle, { color: colors.foreground }]} numberOfLines={1}>
                          {n.title}
                        </Text>
                        <Text style={[styles.notifMessage, { color: colors.mutedForeground }]} numberOfLines={2}>
                          {n.message}
                        </Text>
                        <Text style={[styles.notifTime, { color: colors.mutedForeground }]}>
                          {timeAgo(n.created_at)}
                        </Text>
                      </View>
                      {!n.is_read && <View style={[styles.unreadDot, { backgroundColor: colors.primary }]} />}
                    </Pressable>
                  );
                })
              )}
            </View>

            <Pressable
              onPress={() => {
                setOpen(false);
                router.push('/notifications' as any);
              }}
              style={[styles.viewAllRow, { borderTopColor: colors.border }]}
            >
              <Text style={[styles.viewAllText, { color: colors.primary }]}>View All Notifications →</Text>
            </Pressable>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bellButton: {
    width: 38, height: 38, borderRadius: 19, borderWidth: 1,
    alignItems: 'center', justifyContent: 'center',
  },
  badge: {
    position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18,
    borderRadius: 9, backgroundColor: '#DC2626', alignItems: 'center',
    justifyContent: 'center', paddingHorizontal: 3,
  },
  badgeText: { color: '#fff', fontSize: 10, fontFamily: 'Inter_700Bold' },
  dropdown: {
    position: 'absolute', top: 46, right: 0, width: 340, maxWidth: '90vw' as any,
    borderWidth: 1, borderRadius: 14, overflow: 'hidden', zIndex: 100,
    // @ts-ignore
    boxShadow: '0 12px 28px rgba(0,0,0,0.14)',
    elevation: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15, shadowRadius: 16,
  },
  dropdownHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1,
  },
  dropdownTitle: { fontSize: 14, fontFamily: 'Inter_700Bold' },
  markAllText: { fontSize: 12, fontFamily: 'Inter_600SemiBold' },
  notifRow: { flexDirection: 'row', gap: 10, padding: 12, alignItems: 'flex-start' },
  notifIcon: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  notifTitle: { fontSize: 12.5, fontFamily: 'Inter_600SemiBold' },
  notifMessage: { fontSize: 11.5, fontFamily: 'Inter_500Medium', marginTop: 1 },
  notifTime: { fontSize: 10, fontFamily: 'Inter_500Medium', marginTop: 3 },
  unreadDot: { width: 7, height: 7, borderRadius: 4, marginTop: 4 },
  emptyState: { alignItems: 'center', paddingVertical: 32, gap: 6 },
  emptyTitle: { fontSize: 13, fontFamily: 'Inter_700Bold' },
  emptySubtitle: { fontSize: 12, fontFamily: 'Inter_500Medium' },
  viewAllRow: { padding: 12, alignItems: 'center', borderTopWidth: 1 },
  viewAllText: { fontSize: 12.5, fontFamily: 'Inter_600SemiBold' },
});