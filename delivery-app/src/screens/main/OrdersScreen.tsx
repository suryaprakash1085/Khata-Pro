import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  ordersApi,
  CustomerOrder,
  CustomerTrackingStatus,
} from '../../api/orders';
import ReturnRequestModal from './ReturnRequestModal';

const CompatibleFlatList: any = FlatList;

// ── Design tokens ────────────────────────────────────────────────
const PURPLE = '#6C5CE7';
const PURPLE_DARK = '#5541D7';
const PURPLE_LIGHT = '#F1EEFF';
const PURPLE_SOFT = '#EDE9FE';
const ACCENT = '#8B7CF6';
const SUCCESS = '#22C55E';
const DANGER = '#EF4444';
const WARNING = '#F59E0B';
const WARNING_BG = '#FEF3C7';
const INFO = '#2563EB';
const INFO_BG = '#DBEAFE';
const SUCCESS_BG = '#DCFCE7';
const DANGER_BG = '#FEE2E2';
const TEXT_MAIN = '#1E1B2E';
const TEXT_SECONDARY = '#8A85A0';
const BORDER = '#EFEDF7';
const BG = '#FFFFFF';
const BG_SOFT = '#FAFAFD';

const FONT_FAMILY = Platform.select({
  web: "'Times New Roman', Times, serif",
  default: 'Times New Roman',
}) as string;

const DESKTOP_BREAKPOINT = 768;
const DESKTOP_MAX_WIDTH = 1160;

// ── Cancel / Return rules ────────────────────────────────────────
const CANCEL_WINDOW_MS = 24 * 60 * 60 * 1000; // 1 day after placing
const RETURN_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours after delivery (must match server RETURN_WINDOW_HOURS)

const RETURN_STATUS_META: Record<string, { label: string; color: string; bg: string }> = {
  REQUESTED: { label: 'Return Requested', color: WARNING, bg: WARNING_BG },
  APPROVED: { label: 'Return Approved', color: SUCCESS, bg: SUCCESS_BG },
  REJECTED: { label: 'Return Rejected', color: DANGER, bg: DANGER_BG },
  REPLACEMENT_SENT: { label: 'Replacement Sent', color: INFO, bg: INFO_BG },
};

// Order is cancellable ONLY if: still ORDER_PLACED (admin has not confirmed) AND within 1 day
const canCancelOrder = (o: CustomerOrder): boolean => {
  if (o.tracking_status !== 'ORDER_PLACED') return false;
  const placed = new Date((o as any).created_at || o.entry_date).getTime();
  if (isNaN(placed)) return false;
  return Date.now() - placed <= CANCEL_WINDOW_MS;
};

// Return allowed ONLY if: DELIVERED, within window, and no return already requested
const canReturnOrder = (o: CustomerOrder): boolean => {
  if (o.tracking_status !== 'DELIVERED' || o.return_request) return false;
  const deliveredAt = o.delivery?.delivered_at;
  if (!deliveredAt) return false;
  const t = new Date(deliveredAt).getTime();
  if (isNaN(t)) return false;
  return Date.now() - t <= RETURN_WINDOW_MS;
};

const OrdersScreen: React.FC = ({ navigation }: any) => {
  const { width: windowWidth } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && windowWidth >= DESKTOP_BREAKPOINT;

  const [activeTab, setActiveTab] = useState<'current' | 'past' | 'cancelled'>('current');
  const [refreshing, setRefreshing] = useState(false);
  const [ordersList, setOrdersList] = useState<CustomerOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Order currently being returned (the modal manages its own form state)
  const [returnTarget, setReturnTarget] = useState<CustomerOrder | null>(null);

  // ── Orders: real backend fetch ──────────────────────────────
  const fetchOrders = useCallback(async (silent = false) => {
    try {
      if (!silent) setOrdersLoading(true);
      const res = await ordersApi.getMyOrders();
      setOrdersList(res.data ?? []);
      setOrdersError(null);
    } catch (err: any) {
      if (!silent) setOrdersError(err?.message || 'Unable to load your orders. Please try again.');
    } finally {
      if (!silent) setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(false);
  }, [fetchOrders]);

  // ── Order status → display meta ─────────────────────────────
  const STATUS_META: Record<CustomerTrackingStatus, { label: string; color: string; bg: string; icon: string }> = {
    ORDER_PLACED: { label: 'Placed', color: WARNING, bg: WARNING_BG, icon: 'time-outline' },
    ORDER_CONFIRMED: { label: 'Confirmed', color: WARNING, bg: WARNING_BG, icon: 'checkmark-circle-outline' },
    DRIVER_ASSIGNED: { label: 'Driver Assigned', color: INFO, bg: INFO_BG, icon: 'person-outline' },
    PICKED_UP: { label: 'Picked Up', color: ACCENT, bg: PURPLE_SOFT, icon: 'cube-outline' },
    OUT_FOR_DELIVERY: { label: 'Out for Delivery', color: PURPLE, bg: PURPLE_LIGHT, icon: 'bicycle-outline' },
    DELIVERED: { label: 'Delivered', color: SUCCESS, bg: SUCCESS_BG, icon: 'checkmark-circle' },
    CANCELLED: { label: 'Cancelled', color: DANGER, bg: DANGER_BG, icon: 'close-circle' },
  };

  const getFilteredOrders = (tab: 'current' | 'past' | 'cancelled') => {
    return ordersList.filter((order) => {
      if (tab === 'current') return order.tracking_status !== 'DELIVERED' && order.tracking_status !== 'CANCELLED';
      if (tab === 'past') return order.tracking_status === 'DELIVERED';
      return order.tracking_status === 'CANCELLED';
    });
  };

  const filteredOrders = getFilteredOrders(activeTab);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours < 24) return `Today • ${date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
      else if (hours < 48) return 'Yesterday';
      else return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    } catch (e) {
      return 'Just now';
    }
  };

  const showMessage = (title: string, msg: string) => {
    if (Platform.OS === 'web') window.alert(msg);
    else Alert.alert(title, msg);
  };

  // ── Cancel order ─────────────────────────────────────────────
  const doCancelOrder = async (item: CustomerOrder) => {
    try {
      const response = await ordersApi.cancelOrder(item.id);
      let updatedStatus: CustomerTrackingStatus = 'CANCELLED';

      if (response && typeof response === 'object') {
        if ('tracking_status' in response) {
          updatedStatus = (response as any).tracking_status;
        } else if ('data' in response && response.data && typeof response.data === 'object' && 'tracking_status' in response.data) {
          updatedStatus = (response.data as any).tracking_status;
        } else if ('status' in response) {
          updatedStatus = (response as any).status as CustomerTrackingStatus;
        } else if ('data' in response && response.data && typeof response.data === 'object' && 'status' in response.data) {
          updatedStatus = (response.data as any).status as CustomerTrackingStatus;
        }
      }

      setOrdersList((prev) =>
        prev.map((o) => (o.id === item.id ? { ...o, tracking_status: updatedStatus } : o)),
      );

      showMessage('Order Cancelled', `Order #${item.id} has been cancelled.`);
    } catch (err: any) {
      console.error('❌ Error cancelling order:', err);
      const errorMsg =
        err?.response?.data?.error || err?.error || 'This order could not be cancelled. Please try again.';
      showMessage('Unable to cancel', errorMsg);
      fetchOrders(true);
    }
  };

  const handleCancelOrder = (item: CustomerOrder) => {
    // Re-check rules right before cancelling (status may have changed since list loaded)
    if (!canCancelOrder(item)) {
      showMessage(
        'Cannot cancel',
        item.tracking_status !== 'ORDER_PLACED'
          ? 'This order has been confirmed, so it can no longer be cancelled.'
          : 'Orders can only be cancelled within 1 day of placing them.',
      );
      fetchOrders(true);
      return;
    }

    if (Platform.OS === 'web') {
      const confirmed = window.confirm(`Are you sure you want to cancel Order #${item.id}?`);
      if (confirmed) doCancelOrder(item);
      return;
    }

    Alert.alert(
      'Cancel Order',
      `Are you sure you want to cancel Order #${item.id}?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes, Cancel', style: 'destructive', onPress: () => doCancelOrder(item) },
      ],
    );
  };

  // ── Return order (form lives in ReturnRequestModal) ──────────
  const openReturnModal = (item: CustomerOrder) => setReturnTarget(item);
  const closeReturnModal = () => setReturnTarget(null);

  const handleReturnSubmitted = (id: number) => {
    setReturnTarget(null);
    // optimistic update so the Return button disappears immediately
    setOrdersList((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, return_request: { id: 0, status: 'REQUESTED', reason: '' } } : o,
      ),
    );
    showMessage('Return Requested', `Your return request for Order #${id} has been submitted.`);
    fetchOrders(true);
  };

  const handleViewOrder = (item: CustomerOrder) => {
    navigation.navigate('OrderTracking', { orderId: item.id });
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders(true).finally(() => setRefreshing(false));
  }, [fetchOrders]);

  const getTabCount = (tab: 'current' | 'past' | 'cancelled') => getFilteredOrders(tab).length;

  const renderOrder = ({ item }: { item: CustomerOrder }) => {
    const isCurrent = activeTab === 'current';
    const isCancelled = activeTab === 'cancelled';
    const isPast = activeTab === 'past';
    const meta = STATUS_META[item.tracking_status] ?? STATUS_META.ORDER_PLACED;
    const showCancelButton = isCurrent && canCancelOrder(item);
    const showCancelUnavailable = isCurrent && !canCancelOrder(item);
    const showReturnButton = isPast && canReturnOrder(item);
    const returnMeta = item.return_request ? RETURN_STATUS_META[item.return_request.status] : null;
    const showViewButton = !isPast;

    const cancelUnavailableText =
      item.tracking_status !== 'ORDER_PLACED'
        ? 'Order confirmed • cannot be cancelled'
        : 'Cancellation window (1 day) is over';

    return (
      <TouchableOpacity
        style={[
          styles.orderCard,
          isDesktopWeb && styles.orderCardDesktop,
          isCancelled && styles.cancelledCard,
        ]}
        onPress={() => {
          if (isPast) return;
          handleViewOrder(item);
        }}
        activeOpacity={isPast ? 1 : 0.7}
      >
        <View style={styles.orderIconBadge}>
          <Icon name="bag-handle-outline" size={17} color={PURPLE} />
        </View>

        <View style={styles.orderMain}>
          <View style={styles.orderMainTop}>
            <Text style={styles.orderRestaurant} numberOfLines={1}>
              {item.business_name || item.store_name || `Order #${item.id}`}
            </Text>
            {!isDesktopWeb && (
              <View style={[styles.statusBadge, { backgroundColor: meta.bg }]}>
                <Icon name={meta.icon as any} size={12} color={meta.color} />
                <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
              </View>
            )}
          </View>
          <Text style={styles.orderProducts} numberOfLines={1}>
            {item.description || 'Order items'}
          </Text>
          <View style={styles.orderMetaRow}>
            <Text style={styles.orderMetaText}>Order #{item.id}</Text>
            <View style={styles.orderMetaDot} />
            <Text style={styles.orderMetaText}>{formatDate((item as any).created_at || item.entry_date)}</Text>
          </View>
          {item.delivery?.driver_name && (
            <View style={styles.driverChip}>
              <Icon name="bicycle-outline" size={11} color={TEXT_SECONDARY} />
              <Text style={styles.driverChipText}>{item.delivery.driver_name}</Text>
            </View>
          )}
          {showCancelUnavailable && (
            <View style={styles.noteRow}>
              <Icon name="information-circle-outline" size={12} color={TEXT_SECONDARY} />
              <Text style={styles.noteText}>{cancelUnavailableText}</Text>
            </View>
          )}
          {returnMeta && (
            <View style={[styles.returnBadge, { backgroundColor: returnMeta.bg }]}>
              <Icon name="return-down-back-outline" size={12} color={returnMeta.color} />
              <Text style={[styles.returnBadgeText, { color: returnMeta.color }]}>{returnMeta.label}</Text>
            </View>
          )}
        </View>

        <View style={[styles.orderSide, isDesktopWeb && styles.orderSideDesktop]}>
          <Text style={styles.orderAmount}>₹{item.amount}</Text>
          {isDesktopWeb && (
            <View style={[styles.statusBadge, { backgroundColor: meta.bg, marginTop: 6 }]}>
              <Icon name={meta.icon as any} size={12} color={meta.color} />
              <Text style={[styles.statusText, { color: meta.color }]}>{meta.label}</Text>
            </View>
          )}
          <View style={styles.footerButtons}>
            {showCancelButton && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleCancelOrder(item);
                }}
                activeOpacity={0.8}
              >
                <Icon name="close-outline" size={13} color={DANGER} />
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
            {showReturnButton && (
              <TouchableOpacity
                style={styles.returnButton}
                onPress={(e) => {
                  e.stopPropagation();
                  openReturnModal(item);
                }}
                activeOpacity={0.8}
              >
                <Icon name="return-down-back-outline" size={13} color={PURPLE} />
                <Text style={styles.returnButtonText}>Return</Text>
              </TouchableOpacity>
            )}
            {showViewButton && (
              <TouchableOpacity
                style={styles.viewButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleViewOrder(item);
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.viewButtonText}>{isDesktopWeb ? 'View Details' : 'View'}</Text>
                <Icon name="chevron-forward" size={13} color={PURPLE} />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const TABS: { key: 'current' | 'past' | 'cancelled'; label: string }[] = [
    { key: 'current', label: 'Current' },
    { key: 'past', label: 'Past' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <SafeAreaView style={[styles.container, isDesktopWeb && { backgroundColor: BG_SOFT }]}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.headerInner, isDesktopWeb && styles.headerInnerDesktop]}>
          {!isDesktopWeb && (
            <TouchableOpacity
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{ name: 'HomeTabs', params: { screen: 'Home' } }],
                })
              }
              style={styles.backButton}
            >
              <Icon name="arrow-back" size={24} color={TEXT_MAIN} />
            </TouchableOpacity>
          )}
          <Text style={[styles.headerTitle, isDesktopWeb && styles.headerTitleDesktop]}>
            My Orders
          </Text>
          {/* Spacer keeps the mobile title centered (matches back button width) */}
          {!isDesktopWeb && <View style={{ width: 32 }} />}
        </View>
      </View>

      <View style={[styles.body, isDesktopWeb && styles.bodyDesktop]}>
        <View style={isDesktopWeb ? styles.mainColumn : { flex: 1 }}>
          {/* Tabs */}
          {isDesktopWeb ? (
            <View style={styles.segmentedTrack}>
              {TABS.map(({ key, label }) => {
                const active = activeTab === key;
                const count = getTabCount(key);
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.segment, active && styles.segmentActive]}
                    onPress={() => setActiveTab(key)}
                    activeOpacity={0.75}
                  >
                    <Text style={[styles.segmentLabel, active && styles.segmentLabelActive]}>{label}</Text>
                    {count > 0 && (
                      <View style={[styles.segmentBadge, active && styles.segmentBadgeActive]}>
                        <Text style={[styles.segmentBadgeText, active && styles.segmentBadgeTextActive]}>{count}</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ) : (
            <View style={styles.tabsContainer}>
              {TABS.map(({ key, label }) => {
                const active = activeTab === key;
                const count = getTabCount(key);
                return (
                  <TouchableOpacity
                    key={key}
                    style={[styles.tab, active && styles.tabActive]}
                    onPress={() => setActiveTab(key)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.tabText, active && styles.activeTabText]}>{label}</Text>
                    {count > 0 && (
                      <View style={[styles.badge, active && styles.badgeActive]}>
                        <Text style={[styles.badgeText, active && styles.badgeTextActive]}>{count}</Text>
                      </View>
                    )}
                    {active && <View style={styles.tabIndicator} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}

          {ordersLoading ? (
            <View style={styles.emptyContainer}>
              <ActivityIndicator size="large" color={PURPLE} />
              <Text style={styles.loadingText}>Loading your orders...</Text>
            </View>
          ) : ordersError ? (
            <View style={styles.emptyContainer}>
              <View style={styles.errorIconWrap}>
                <Icon name="alert-circle-outline" size={40} color={DANGER} />
              </View>
              <Text style={styles.emptyText}>Something went wrong</Text>
              <Text style={styles.emptySubText}>{ordersError}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={() => fetchOrders(false)}>
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <CompatibleFlatList
              data={filteredOrders}
              renderItem={renderOrder}
              keyExtractor={(item: CustomerOrder) => String(item.id)}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={[styles.ordersList, isDesktopWeb && styles.ordersListDesktop]}
              refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PURPLE} colors={[PURPLE]} />}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIconWrap}>
                    <Icon name="clipboard-outline" size={44} color={ACCENT} />
                  </View>
                  <Text style={styles.emptyText}>
                    {activeTab === 'current' && 'No current orders'}
                    {activeTab === 'past' && 'No orders yet'}
                    {activeTab === 'cancelled' && 'No cancelled orders'}
                  </Text>
                  <Text style={styles.emptySubText}>
                    {activeTab === 'current' && 'Your current orders will appear here'}
                    {activeTab === 'past' && 'Your completed orders will appear here'}
                    {activeTab === 'cancelled' && 'Cancelled orders will appear here'}
                  </Text>
                </View>
              }
            />
          )}
        </View>
      </View>

      {/* ── Return request modal (photo + video proof) ─────────── */}
      <ReturnRequestModal
        order={returnTarget}
        isDesktopWeb={isDesktopWeb}
        onClose={closeReturnModal}
        onSubmitted={handleReturnSubmitted}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG_SOFT },

  // Header
  header: { backgroundColor: BG, borderBottomWidth: 1, borderBottomColor: BORDER },
  headerInner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  headerInnerDesktop: { width: '100%', maxWidth: DESKTOP_MAX_WIDTH, alignSelf: 'center', paddingHorizontal: 8, paddingVertical: 10 },
  backButton: { padding: 4, marginRight: 8 },
  headerTitle: { flex: 1, fontFamily: FONT_FAMILY, fontSize: 18, fontWeight: '700', color: TEXT_MAIN, textAlign: 'center' },
  headerTitleDesktop: {
    flex: 0,
    flexShrink: 0,
    flexGrow: 0,
    fontSize: 22,
    lineHeight: 26,
    textAlign: 'left',
    ...(Platform.OS === 'web' ? ({ whiteSpace: 'nowrap' } as any) : {}),
  },

  // Body layout
  body: { flex: 1 },
  bodyDesktop: {
    width: '100%',
    maxWidth: DESKTOP_MAX_WIDTH,
    alignSelf: 'center',
    paddingTop: 10,
  },
  mainColumn: { flex: 1 },

  // Mobile tabs
  tabsContainer: { flexDirection: 'row', backgroundColor: BG, paddingHorizontal: 8, paddingTop: 6, borderBottomWidth: 1, borderBottomColor: BORDER },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center', position: 'relative', flexDirection: 'row', justifyContent: 'center', borderTopLeftRadius: 10, borderTopRightRadius: 10 },
  tabActive: { backgroundColor: PURPLE_LIGHT },
  tabText: { fontFamily: FONT_FAMILY, fontSize: 14, color: TEXT_SECONDARY, fontWeight: '600' },
  activeTabText: { color: PURPLE_DARK, fontWeight: '700' },
  badge: { backgroundColor: '#e2e2ea', borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6, minWidth: 20, alignItems: 'center' },
  badgeActive: { backgroundColor: PURPLE },
  badgeText: { color: TEXT_SECONDARY, fontFamily: FONT_FAMILY, fontSize: 10, fontWeight: '700' },
  badgeTextActive: { color: '#ffffff' },
  tabIndicator: { position: 'absolute', bottom: 0, left: '20%', right: '20%', height: 3, backgroundColor: PURPLE, borderRadius: 2 },

  // Desktop segmented control
  segmentedTrack: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  segment: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    paddingHorizontal: 20,
    borderRadius: 9,
  },
  segmentActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentLabel: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '600', color: TEXT_SECONDARY },
  segmentLabelActive: { color: PURPLE },
  segmentBadge: { marginLeft: 8, minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 5, backgroundColor: '#e2e2ea', alignItems: 'center', justifyContent: 'center' },
  segmentBadgeActive: { backgroundColor: PURPLE },
  segmentBadgeText: { fontFamily: FONT_FAMILY, fontSize: 10, fontWeight: '700', color: TEXT_SECONDARY },
  segmentBadgeTextActive: { color: '#ffffff' },

  // Orders list
  ordersList: { padding: 16, paddingBottom: 80 },
  ordersListDesktop: { padding: 0, paddingBottom: 24 },

  orderCard: {
    flexDirection: 'row',
    backgroundColor: BG,
    borderRadius: 18,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: BORDER,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
    alignItems: 'flex-start',
  },
  orderCardDesktop: { padding: 18, borderRadius: 16, alignItems: 'center' },
  cancelledCard: { opacity: 0.7, borderColor: '#fbdede' },
  orderIconBadge: { width: 38, height: 38, borderRadius: 12, backgroundColor: PURPLE_LIGHT, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  orderMain: { flex: 1 },
  orderMainTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  orderRestaurant: { flex: 1, fontFamily: FONT_FAMILY, fontSize: 16, fontWeight: '700', color: TEXT_MAIN },
  orderProducts: { fontFamily: FONT_FAMILY, fontSize: 13, color: TEXT_SECONDARY, marginTop: 3 },
  orderMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  orderMetaText: { fontFamily: FONT_FAMILY, fontSize: 12, color: '#a2a4b0' },
  orderMetaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#c9c6d8' },
  driverChip: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  driverChipText: { fontFamily: FONT_FAMILY, fontSize: 11.5, color: TEXT_SECONDARY },
  noteRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  noteText: { fontFamily: FONT_FAMILY, fontSize: 11.5, color: TEXT_SECONDARY },
  returnBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 14, marginTop: 8, gap: 4 },
  returnBadgeText: { fontFamily: FONT_FAMILY, fontSize: 11.5, fontWeight: '700' },

  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, marginLeft: 8, alignSelf: 'flex-start' },
  statusText: { fontFamily: FONT_FAMILY, fontSize: 11.5, fontWeight: '700', marginLeft: 4 },

  orderSide: { marginLeft: 10, alignItems: 'flex-end' },
  orderSideDesktop: { minWidth: 150 },
  orderAmount: { fontFamily: FONT_FAMILY, fontSize: 17, fontWeight: '700', color: TEXT_MAIN },

  footerButtons: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  cancelButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: DANGER_BG, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, borderWidth: 1, borderColor: '#fbd5d5' },
  cancelButtonText: { color: DANGER, fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '700', marginLeft: 3 },
  returnButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: PURPLE_LIGHT, paddingHorizontal: 12, paddingVertical: 7, borderRadius: 8, borderWidth: 1, borderColor: PURPLE_SOFT },
  returnButtonText: { color: PURPLE, fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '700', marginLeft: 3 },
  viewButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 2, paddingVertical: 4 },
  viewButtonText: { color: PURPLE, fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', marginRight: 2 },

  // Empty / loading / error
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 90, paddingHorizontal: 30 },
  emptyIconWrap: { width: 84, height: 84, borderRadius: 42, backgroundColor: PURPLE_LIGHT, alignItems: 'center', justifyContent: 'center', marginBottom: 18 },
  errorIconWrap: { width: 76, height: 76, borderRadius: 38, backgroundColor: DANGER_BG, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyText: { fontFamily: FONT_FAMILY, fontSize: 18, fontWeight: '700', color: TEXT_MAIN, marginTop: 4, textAlign: 'center' },
  emptySubText: { fontFamily: FONT_FAMILY, fontSize: 13.5, color: TEXT_SECONDARY, marginTop: 6, marginBottom: 20, textAlign: 'center' },
  loadingText: { fontFamily: FONT_FAMILY, fontSize: 13.5, color: TEXT_SECONDARY, marginTop: 12 },
  retryButton: { backgroundColor: PURPLE, paddingHorizontal: 28, paddingVertical: 11, borderRadius: 10 },
  retryButtonText: { color: '#ffffff', fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '700' },
});

export default OrdersScreen;