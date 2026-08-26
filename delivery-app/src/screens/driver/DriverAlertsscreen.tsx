import React, { useContext, useMemo, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Platform,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DriverAuthContext } from '../../context/DriverAuthContext';
import { COLORS } from '../../components/driver/DriverHomeComponents';
import { DriverWebShell, DriverShellTab } from '../../components/driver/DriverWebShell';

// ── Orval-generated hooks — names follow YOUR openapi.yaml operationIds
// (getDriverUnreadNotificationCount / markDriverNotificationRead /
// markAllDriverNotificationsRead), not the ones in the original patch. ────
import {
  useListDriverNotifications,
  useGetDriverUnreadNotificationCount,
  useMarkDriverNotificationRead,
  useMarkAllDriverNotificationsRead,
} from '@workspace/api-client-react';

const FONT_FAMILY = Platform.select({
  web: '"Times New Roman", Times, serif',
  default: 'Times New Roman',
});
const webNoOutlineStyle = (Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any;
const TypedFlatList = FlatList as unknown as React.ComponentType<any>;

type FilterTab = 'ALL' | 'UNREAD' | 'DELIVERIES' | 'EARNINGS' | 'SYSTEM';

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'ALL', label: 'All' },
  { key: 'UNREAD', label: 'Unread' },
  { key: 'DELIVERIES', label: 'Deliveries' },
  { key: 'EARNINGS', label: 'Earnings' },
  { key: 'SYSTEM', label: 'System' },
];

// Icon + color per notification type. Falls back to a generic bell for any
// type the backend sends that isn't listed — screen never breaks on an
// unrecognized type.
const TYPE_META: Record<string, { icon: string; color: string; bg: string }> = {
  assigned: { icon: 'cube-outline', color: COLORS.primary, bg: COLORS.primaryLight },
  accepted: { icon: 'checkmark-circle-outline', color: COLORS.primary, bg: COLORS.primaryLight },
  picked_up: { icon: 'archive-outline', color: '#7C3AED', bg: '#EDE9FE' },
  out_for_delivery: { icon: 'bicycle-outline', color: '#0891B2', bg: '#CFFAFE' },
  completed: { icon: 'checkmark-done-outline', color: COLORS.secondary, bg: COLORS.secondaryLight },
  cancelled: { icon: 'close-circle-outline', color: COLORS.danger, bg: COLORS.dangerLight },
  fee_earned: { icon: 'cash-outline', color: COLORS.secondary, bg: COLORS.secondaryLight },
  address_updated: { icon: 'location-outline', color: COLORS.amber, bg: COLORS.amberLight },
  payment_received: { icon: 'cash-outline', color: '#0891B2', bg: '#CFFAFE' },
  order_confirmed: { icon: 'receipt-outline', color: COLORS.primary, bg: COLORS.primaryLight },
  system: { icon: 'information-circle-outline', color: COLORS.slate, bg: COLORS.bg },
  admin_message: { icon: 'megaphone-outline', color: COLORS.amber, bg: COLORS.amberLight },
};
const DEFAULT_META = { icon: 'notifications-outline', color: COLORS.slate, bg: COLORS.bg };
function metaFor(type: string) {
  return TYPE_META[type] ?? DEFAULT_META;
}

function formatWhen(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
  if (isToday) return `Today, ${time}`;
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return `Yesterday, ${time}`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + `, ${time}`;
}

function isToday(iso: string): boolean {
  const d = new Date(iso);
  return d.toDateString() === new Date().toDateString();
}

interface ApiNotification {
  id: number;
  driver_id: number | null;
  delivery_id: number | null;
  order_id: number | null;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

const DriverAlertsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { driver: authDriver } = useContext(DriverAuthContext) as any;

  const [activeFilter, setActiveFilter] = useState<FilterTab>('ALL');
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<ApiNotification[]>([]);

  // NOTE: online/offline + greeting props below assume the same
  // DriverAuthContext/online-toggle pattern DriverHomeScreen uses.
  // If DriverHomeScreen wires isOnline/onToggleOnline from a different
  // hook (e.g. a dedicated useDriverStatus hook), swap these two lines
  // for that hook instead — everything else in this file is independent
  // of that detail.
  const isOnline = !!authDriver?.status && authDriver.status !== 'offline';

  const queryParams = useMemo(() => {
    const params: Record<string, any> = { page, limit: 20 };
    if (activeFilter === 'UNREAD') {
      params.read = 'UNREAD';
    } else if (activeFilter !== 'ALL') {
      params.type = activeFilter;
    }
    return params;
  }, [activeFilter, page]);

  const {
    data: listResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useListDriverNotifications(queryParams);

  const { data: unreadCountResponse, refetch: refetchUnreadCount } = useGetDriverUnreadNotificationCount();
  const unreadCount = unreadCountResponse?.count ?? 0;

  const markOneRead = useMarkDriverNotificationRead();
  const markAllRead = useMarkAllDriverNotificationsRead();

  const pageData: ApiNotification[] = (listResponse?.data as ApiNotification[]) ?? [];
  const pagination = listResponse?.pagination;

  // Merge pages for infinite scroll; reset accumulation whenever the filter
  // changes (page resets to 1 too, via handleFilterChange below).
  const notifications = page === 1 ? pageData : [...accumulated, ...pageData];

  const totalCount = pagination?.total ?? notifications.length;
  const todayCount = notifications.filter((n) => isToday(n.created_at)).length;

  const handleFilterChange = (tab: FilterTab) => {
    setActiveFilter(tab);
    setPage(1);
    setAccumulated([]);
  };

  const handleLoadMore = () => {
    if (!pagination || isFetching) return;
    if (page >= pagination.totalPages) return;
    setAccumulated(notifications);
    setPage((p) => p + 1);
  };

  const handleRefresh = () => {
    setPage(1);
    setAccumulated([]);
    refetch();
    refetchUnreadCount();
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate(undefined, {
      onSuccess: () => {
        refetch();
        refetchUnreadCount();
      },
    });
  };

  const handleOpenNotification = useCallback(
    (item: ApiNotification) => {
      if (!item.is_read) {
        markOneRead.mutate(
          { id: item.id },
          {
            onSuccess: () => {
              refetch();
              refetchUnreadCount();
            },
          }
        );
      }
      if (item.delivery_id) {
        navigation.navigate('DriverOrderDetails', { deliveryId: item.delivery_id });
      }
    },
    [markOneRead, navigation, refetch, refetchUnreadCount]
  );

  const handleTabPress = (tab: DriverShellTab) => {
    if (tab.key === 'notifications') return;
    if (tab.screen) navigation.navigate(tab.screen);
  };

  const renderRow = ({ item }: { item: ApiNotification }) => {
    const meta = metaFor(item.type);
    return (
      <TouchableOpacity
        style={[styles.row, !item.is_read && styles.rowUnread, webNoOutlineStyle]}
        activeOpacity={0.7}
        onPress={() => handleOpenNotification(item)}
      >
        <View style={[styles.iconWrap, { backgroundColor: meta.bg }]}>
          <Ionicons name={meta.icon as keyof typeof Ionicons.glyphMap} size={18} color={meta.color} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={styles.rowTopLine}>
            <Text style={[styles.rowTitle, !item.is_read && styles.rowTitleUnread]} numberOfLines={1}>
              {item.title}
            </Text>
            {!item.is_read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.rowMessage} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.rowTime}>{formatWhen(item.created_at)}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <DriverWebShell
      activeTabKey="notifications"
      driverName={authDriver?.name}
      driverPhone={authDriver?.phone}
      isOnline={isOnline}
      onToggleOnline={() => {
        /* mirror DriverHomeScreen's toggle handler here */
      }}
      notificationsCount={unreadCount}
      greetingTitle="Notifications"
      greetingSubtitle="Stay updated with your deliveries and account activity."
      onTabPress={handleTabPress}
      onNotificationsPress={() => {}}
    >
      <View style={styles.page}>
        {/* Header row: title/subtitle handled by DriverWebShell's greeting; add the action button here */}
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.markAllBtn, webNoOutlineStyle, unreadCount === 0 && styles.markAllBtnDisabled]}
            onPress={handleMarkAllRead}
            disabled={unreadCount === 0 || markAllRead.isPending}
          >
            <Ionicons name="checkmark-done-outline" size={14} color={unreadCount === 0 ? COLORS.slateLight : COLORS.primary} />
            <Text style={[styles.markAllBtnText, unreadCount === 0 && { color: COLORS.slateLight }]}>Mark all as read</Text>
          </TouchableOpacity>
        </View>

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalCount}</Text>
            <Text style={styles.summaryLabel}>Total Notifications</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={[styles.summaryValue, { color: COLORS.primary }]}>{unreadCount}</Text>
            <Text style={styles.summaryLabel}>Unread</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{todayCount}</Text>
            <Text style={styles.summaryLabel}>Today</Text>
          </View>
        </View>

        {/* Filter tabs */}
        <View style={styles.filterRow}>
          {FILTER_TABS.map((tab) => {
            const active = tab.key === activeFilter;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.filterTab, active && styles.filterTabActive, webNoOutlineStyle]}
                onPress={() => handleFilterChange(tab.key)}
              >
                <Text style={[styles.filterTabText, active && styles.filterTabTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* List / states */}
        {isError ? (
          <View style={styles.centerWrap}>
            <Text style={styles.errorText}>Unable to load notifications.</Text>
            <TouchableOpacity style={[styles.retryBtn, webNoOutlineStyle]} onPress={handleRefresh}>
              <Text style={styles.retryBtnText}>Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : isLoading && page === 1 ? (
          <View style={styles.centerWrap}>
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.centerWrap}>
            <View style={styles.emptyIconWrap}>
              <Ionicons name="notifications-outline" size={26} color={COLORS.slateLight} />
            </View>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptySub}>
              When you receive delivery updates or important account notifications, they'll appear here.
            </Text>
          </View>
        ) : (
          <TypedFlatList
            data={notifications}
            keyExtractor={(item: ApiNotification) => String(item.id)}
            renderItem={renderRow}
            refreshControl={
              <RefreshControl refreshing={!isLoading && isFetching && page === 1} onRefresh={handleRefresh} tintColor={COLORS.primary} />
            }
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            ListFooterComponent={
              isFetching && page > 1 ? (
                <View style={{ paddingVertical: 16 }}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                </View>
              ) : null
            }
          />
        )}
      </View>
    </DriverWebShell>
  );
};

const styles = StyleSheet.create({
  page: { flex: 1, paddingHorizontal: 32, paddingTop: 20 },

  headerActions: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 16 },
  markAllBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
  },
  markAllBtnDisabled: { backgroundColor: COLORS.bg },
  markAllBtnText: { fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '700', color: COLORS.primary },

  summaryRow: { flexDirection: 'row', gap: 14, marginBottom: 18 },
  summaryCard: {
    flex: 1, backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1,
    borderColor: COLORS.border, padding: 16,
  },
  summaryValue: { fontFamily: FONT_FAMILY, fontSize: 22, fontWeight: '700', color: COLORS.ink },
  summaryLabel: { fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.slate, marginTop: 4 },

  filterRow: { flexDirection: 'row', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  filterTab: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
  },
  filterTabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterTabText: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate, fontWeight: '600' },
  filterTabTextActive: { color: '#FFFFFF' },

  row: {
    flexDirection: 'row', alignItems: 'flex-start', backgroundColor: COLORS.card,
    borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14, marginBottom: 12,
  },
  rowUnread: { backgroundColor: COLORS.primaryLight, borderColor: '#C7D9FB' },
  iconWrap: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rowTopLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  rowTitle: { fontFamily: FONT_FAMILY, fontSize: 13.5, fontWeight: '600', color: COLORS.ink, flexShrink: 1 },
  rowTitleUnread: { fontWeight: '700' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  rowMessage: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate, marginTop: 3 },
  rowTime: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slateLight, marginTop: 6 },

  centerWrap: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 24 },
  emptyIconWrap: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.card, borderWidth: 1,
    borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginBottom: 14,
  },
  emptyTitle: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '700', color: COLORS.ink, marginBottom: 6 },
  emptySub: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate, textAlign: 'center', lineHeight: 18 },

  errorText: { fontFamily: FONT_FAMILY, fontSize: 13.5, color: COLORS.slate, marginBottom: 12 },
  retryBtn: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: COLORS.primaryLight },
  retryBtnText: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.primary },
});

export default DriverAlertsScreen;