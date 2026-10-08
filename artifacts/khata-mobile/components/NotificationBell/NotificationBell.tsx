// components/NotificationBell/NotificationBell.tsx
import React, { useState } from 'react';
import {
  Pressable,
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Platform,
  Modal,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { useBusiness } from '@/contexts/BusinessContext';
// @ts-ignore
import {
  useListAdminNotifications,
  useGetAdminNotificationsUnreadCount,
  useMarkAdminNotificationRead,
  useMarkAllAdminNotificationsRead,
  getListAdminNotificationsQueryKey,
  getGetAdminNotificationsUnreadCountQueryKey,
  useGetProduct,
  useUpdateProduct,
  getGetProductQueryKey,
  getListProductsQueryKey,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';

const ICONS: Record<string, { icon: keyof typeof Feather.glyphMap; color: string }> = {
  new_order: { icon: 'shopping-bag', color: '#16A34A' },
  low_stock: { icon: 'box', color: '#F59E0B' },
  vendor_payment_pending: { icon: 'dollar-sign', color: '#7C3AED' },
  vendor_payment_overdue: { icon: 'alert-triangle', color: '#DC2626' },

  subscription_renewal: { icon: 'credit-card', color: '#2563EB' },
  subscription_renewal_success: { icon: 'check-circle', color: '#16A34A' },
  subscription_trial_expiring: { icon: 'clock', color: '#F59E0B' },
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

// ─────────────────────────────────────────────────────────────────────────
// Quick Restock Modal — opened from a "Low Stock Alert" notification instead
// of navigating away. Fetches the live product (stock may have moved since
// the notification was created), lets the admin add a quantity, and PUTs it
// via the existing updateProduct endpoint (ProductUpdate.stock_qty).
// ─────────────────────────────────────────────────────────────────────────
function QuickRestockModal({
  productId,
  onClose,
}: {
  productId: number;
  onClose: () => void;
}) {
  const colors = useColors();
  const { business } = useBusiness();
  const queryClient = useQueryClient();
  const [addQty, setAddQty] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: product, isLoading } = useGetProduct(productId, {
    query: { enabled: !!productId, queryKey: getGetProductQueryKey(productId) },
  });

  const updateProduct = useUpdateProduct();

  const currentStock = (product as any)?.stock_qty ?? 0;
  const parsedQty = parseInt(addQty, 10);
  const isValidQty = !isNaN(parsedQty) && parsedQty > 0;
  const newStock = isValidQty ? currentStock + parsedQty : currentStock;

  const handleSubmit = async () => {
    if (!isValidQty) {
      setError('Enter a valid quantity');
      return;
    }
    setError(null);
    try {
      await updateProduct.mutateAsync({
        id: productId,
        data: { stock_qty: newStock },
      } as any);

      // Refresh anywhere product data / stock counts are shown
      queryClient.invalidateQueries({ queryKey: getGetProductQueryKey(productId) });
      if (business?.id) {
        queryClient.invalidateQueries({
          queryKey: getListProductsQueryKey({ business_id: business.id, limit: 500 }),
        });
      }
      onClose();
    } catch (e) {
      setError('Failed to update stock. Try again.');
    }
  };

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ width: '100%', alignItems: 'center' }}
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <View style={styles.modalHeader}>
              <View style={[styles.modalIcon, { backgroundColor: '#F59E0B15' }]}>
                <Feather name="box" size={16} color="#F59E0B" />
              </View>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>Restock Product</Text>
              <Pressable onPress={onClose} hitSlop={8} style={{ marginLeft: 'auto' }}>
                <Feather name="x" size={18} color={colors.mutedForeground} />
              </Pressable>
            </View>

            {isLoading ? (
              <ActivityIndicator style={{ paddingVertical: 24 }} color={colors.primary} />
            ) : (
              <>
                <Text style={[styles.productName, { color: colors.foreground }]} numberOfLines={2}>
                  {(product as any)?.name ?? 'Product'}
                </Text>

                <View style={styles.stockRow}>
                  <View style={styles.stockBox}>
                    <Text style={[styles.stockLabel, { color: colors.mutedForeground }]}>Current Stock</Text>
                    <Text style={[styles.stockValue, { color: colors.foreground }]}>{currentStock}</Text>
                  </View>
                  <Feather name="arrow-right" size={16} color={colors.mutedForeground} />
                  <View style={styles.stockBox}>
                    <Text style={[styles.stockLabel, { color: colors.mutedForeground }]}>New Stock</Text>
                    <Text style={[styles.stockValue, { color: '#16A34A' }]}>
                      {isValidQty ? newStock : '—'}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.inputLabel, { color: colors.mutedForeground }]}>Add Quantity</Text>
                <TextInput
                  value={addQty}
                  onChangeText={(t) => {
                    setAddQty(t.replace(/[^0-9]/g, ''));
                    setError(null);
                  }}
                  placeholder="e.g. 50"
                  placeholderTextColor={colors.mutedForeground}
                  keyboardType="number-pad"
                  style={[
                    styles.input,
                    { color: colors.foreground, borderColor: colors.border, backgroundColor: colors.background },
                  ]}
                  autoFocus
                />
                {error && <Text style={styles.errorText}>{error}</Text>}

                <Pressable
                  onPress={handleSubmit}
                  disabled={updateProduct.isPending}
                  style={[
                    styles.submitButton,
                    { backgroundColor: colors.primary, opacity: updateProduct.isPending ? 0.6 : 1 },
                  ]}
                >
                  {updateProduct.isPending ? (
                    <ActivityIndicator color={colors.primaryForeground} size="small" />
                  ) : (
                    <Text style={[styles.submitButtonText, { color: colors.primaryForeground }]}>
                      Add Stock
                    </Text>
                  )}
                </Pressable>
              </>
            )}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

export function NotificationBell() {
  const colors = useColors();
  const { business } = useBusiness();
  const [open, setOpen] = useState(false);
  const [restockProductId, setRestockProductId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const unreadParams = { business_id: business?.id as number };
  const { data: unread } = useGetAdminNotificationsUnreadCount(unreadParams, {
    query: {
      enabled: !!business?.id,
      queryKey: getGetAdminNotificationsUnreadCountQueryKey(unreadParams),
      refetchInterval: 20000, // lightweight polling — no socket infra in this project
    },
  });

  const listParams = { business_id: business?.id as number, limit: 8 };
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

  // Navigate first — this must not be blocked by mark-read failing.
  if (n.type === 'low_stock' && n.product_id) {
    router.push({ pathname: '/restock', params: { id: String(n.product_id) } } as any);
  } else if (n.type === 'new_order') {
    router.push('/delivery-list' as any);
} else if (n.type.startsWith('vendor_payment')) {
   router.push('/reports' as any);
  }else if (n.type.startsWith('subscription_')) {
    // NEW — covers subscription_renewal, subscription_renewal_success, subscription_trial_expiring
    router.push('/subscription-status' as any);
  }

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

            <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
              {isLoading ? (
                <ActivityIndicator style={{ paddingVertical: 24 }} color={colors.primary} />
              ) : !list?.data?.length ? (
                <View style={styles.emptyState}>
                  <Feather name="bell-off" size={28} color={colors.mutedForeground} />
                  <Text style={[styles.emptyTitle, { color: colors.foreground }]}>You're all caught up!</Text>
                  <Text style={[styles.emptySubtitle, { color: colors.mutedForeground }]}>No new notifications.</Text>
                </View>
              ) : (
                list.data.map((n: any, idx: number) => {
                  const meta = ICONS[n.type] ?? { icon: 'bell', color: colors.mutedForeground };
                  return (
                    <Pressable
                      key={n.id}
                      onPress={() => handleNotificationPress(n)}
                      style={[
                        styles.notifRow,
                        { backgroundColor: n.is_read ? 'transparent' : colors.primary + '08' },
                        idx !== list.data.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
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
            </ScrollView>

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

      {restockProductId != null && (
        <QuickRestockModal productId={restockProductId} onClose={() => setRestockProductId(null)} />
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

  // ── Restock modal ──
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    // @ts-ignore
    boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
    elevation: 12,
  },
  modalHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  modalIcon: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 15, fontFamily: 'Inter_700Bold' },
  productName: { fontSize: 13.5, fontFamily: 'Inter_600SemiBold', marginBottom: 14 },
  stockRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 18 },
  stockBox: { alignItems: 'center', minWidth: 80 },
  stockLabel: { fontSize: 10.5, fontFamily: 'Inter_500Medium', marginBottom: 3 },
  stockValue: { fontSize: 20, fontFamily: 'Inter_700Bold' },
  inputLabel: { fontSize: 11.5, fontFamily: 'Inter_500Medium', marginBottom: 6 },
  input: {
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 11,
    fontSize: 15, fontFamily: 'Inter_600SemiBold', marginBottom: 4,
  },
  errorText: { color: '#DC2626', fontSize: 11.5, fontFamily: 'Inter_500Medium', marginTop: 4 },
  submitButton: {
    marginTop: 14, borderRadius: 10, paddingVertical: 13, alignItems: 'center', justifyContent: 'center',
  },
  submitButtonText: { fontSize: 13.5, fontFamily: 'Inter_700Bold' },
});