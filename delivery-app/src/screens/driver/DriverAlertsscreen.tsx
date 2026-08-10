import React, { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  FlatList,
  Alert,
  ActivityIndicator,
  Platform,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DriverAuthContext } from '../../context/DriverAuthContext';
import { COLORS } from '../../components/driver/DriverHomeComponents';
import { NotificationType } from '../../types/driverHome.types';

// ── Orval-generated hook (same pattern as Home screen) ─────────────────────
import { useListNotifications } from '@workspace/api-client-react';

const FONT_FAMILY = Platform.select({
  web: '"Times New Roman", Times, serif',
  default: 'Times New Roman',
});
const webNoOutlineStyle = (Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any;

const TypedFlatList = FlatList as unknown as React.ComponentType<any>;

// The API response used elsewhere in this app (DriverHomeScreen) only
// exposes id / type / message / created_at — no read-state and no title.
// `read` and `title` are declared optional here so the screen picks them up
// automatically if the backend adds them later, without needing a rewrite.
interface ApiNotification {
  id: number;
  type: NotificationType | string;
  title?: string;
  message: string;
  created_at: string;
  read?: boolean;
}

interface AlertItem {
  id: string;
  type: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

// Friendly title + icon + color per notification type. Falls back to a
// generic bell for any type string the backend sends that isn't listed here,
// so the screen never breaks on an unrecognized type.
const NOTIFICATION_META: Record<string, { title: string; icon: string; color: string; bg: string }> = {
  new_delivery: { title: 'New Delivery Assigned', icon: 'cube-outline', color: COLORS.primary, bg: COLORS.primaryLight },
  delivery_assigned: { title: 'New Delivery Assigned', icon: 'cube-outline', color: COLORS.primary, bg: COLORS.primaryLight },
  delivery_completed: { title: 'Delivery Completed', icon: 'checkmark-done-outline', color: COLORS.secondary, bg: COLORS.secondaryLight },
  delivered: { title: 'Delivery Completed', icon: 'checkmark-done-outline', color: COLORS.secondary, bg: COLORS.secondaryLight },
  address_updated: { title: 'Customer Address Updated', icon: 'location-outline', color: '#7C3AED', bg: '#EDE9FE' },
  delivery_cancelled: { title: 'Delivery Cancelled', icon: 'close-circle-outline', color: COLORS.danger, bg: COLORS.dangerLight },
  cancelled: { title: 'Delivery Cancelled', icon: 'close-circle-outline', color: COLORS.danger, bg: COLORS.dangerLight },
  payment_received: { title: 'Payment Received', icon: 'cash-outline', color: '#0891B2', bg: '#CFFAFE' },
  payment: { title: 'Payment Received', icon: 'cash-outline', color: '#0891B2', bg: '#CFFAFE' },
  route_alert: { title: 'Route Alert', icon: 'map-outline', color: COLORS.amber, bg: COLORS.amberLight },
  route: { title: 'Route Alert', icon: 'map-outline', color: COLORS.amber, bg: COLORS.amberLight },
};
const DEFAULT_META = { title: 'Notification', icon: 'notifications-outline', color: COLORS.slate, bg: COLORS.bg };

function metaFor(type: string) {
  return NOTIFICATION_META[type] ?? DEFAULT_META;
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '—';
  const diffMs = Date.now() - then;
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

// Only tabs that already have a registered screen navigate for real —
// same convention as Home / Orders / Route screens.
const bottomTabs: { key: string; label: string; icon: string; screen?: string }[] = [
  { key: 'home', label: 'Home', icon: 'home-outline', screen: 'DriverHome' },
  { key: 'orders', label: 'Orders', icon: 'receipt-outline', screen: 'DriverOrders' },
  { key: 'route', label: 'Route', icon: 'map-outline', screen: 'DriverRoute' },
  { key: 'notifications', label: 'Alerts', icon: 'notifications', screen: 'DriverAlerts' },
  { key: 'profile', label: 'Profile', icon: 'person-outline', screen: 'DriverProfile' },
];
const ACTIVE_TAB = 'notifications';

const DriverAlertsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { driver: authDriver } = useContext(DriverAuthContext) as any;
  const driverId = authDriver?.id;

  const { width } = useWindowDimensions();
  const isWideWeb = Platform.OS === 'web' && width >= 900;
  const columns = isWideWeb ? 2 : 1;

  const {
    data: notificationsData,
    isLoading,
    isFetching,
    refetch: refetchNotifications,
  } = useListNotifications({ driver_id: driverId, limit: 50 }, { query: { enabled: !!driverId } });

  // Local read-state, keyed by notification id. Seeded from any `read`
  // flag the API already provides; otherwise everything starts unread.
  // Swap this for a real mutation (e.g. useMarkNotificationRead) once the
  // backend exposes one — the UI hook points (handleMarkAllRead /
  // handleMarkOneRead) are already isolated below.
  const [locallyRead, setLocallyRead] = useState<Set<string>>(new Set());

  const rawNotifications: ApiNotification[] = Array.isArray(notificationsData)
    ? (notificationsData as unknown as ApiNotification[])
    : (((notificationsData as any)?.data as ApiNotification[]) ?? []);

  const alerts: AlertItem[] = useMemo(() => {
    return rawNotifications
      .slice()
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map((n) => {
        const meta = metaFor(String(n.type));
        return {
          id: String(n.id),
          type: String(n.type),
          title: n.title ?? meta.title,
          message: n.message,
          time: timeAgo(n.created_at),
          read: n.read ?? locallyRead.has(String(n.id)),
        };
      });
  }, [rawNotifications, locallyRead]);

  const unreadCount = alerts.filter((a) => !a.read).length;

  const handleMarkAllRead = () => {
    setLocallyRead((prev) => {
      const next = new Set(prev);
      alerts.forEach((a) => next.add(a.id));
      return next;
    });
  };

  const handleMarkOneRead = (id: string) => {
    setLocallyRead((prev) => new Set(prev).add(id));
  };

  const handleTabPress = (tab: (typeof bottomTabs)[number]) => {
    if (tab.key === ACTIVE_TAB) return;
    if (tab.screen) {
      navigation.navigate(tab.screen);
    } else {
      Alert.alert(tab.label, 'Coming soon');
    }
  };

  const renderRow = ({ item }: { item: AlertItem }) => {
    const meta = metaFor(item.type);
    return (
      <TouchableOpacity
        style={[styles.row, !item.read && styles.rowUnread, webNoOutlineStyle]}
        activeOpacity={0.7}
        onPress={() => !item.read && handleMarkOneRead(item.id)}
      >
        {!item.read && <View style={styles.unreadDot} />}
        <View style={[styles.iconWrap, { backgroundColor: meta.bg }]}>
          <Ionicons name={meta.icon as keyof typeof Ionicons.glyphMap} size={18} color={meta.color} />
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={styles.rowTopLine}>
            <Text style={[styles.rowTitle, !item.read && styles.rowTitleUnread]} numberOfLines={1}>
              {item.title}
            </Text>
            <Text style={styles.rowTime}>{item.time}</Text>
          </View>
          <Text style={styles.rowMessage} numberOfLines={2}>
            {item.message}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {isWideWeb && (
        <View style={styles.webTopBar}>
          <View style={styles.webTopBarInner}>
            <Text style={styles.webBrand}>Khata-Pro · Driver</Text>
            <View style={styles.webTopBarTabs}>
              {bottomTabs.map((tab) => {
                const active = tab.key === ACTIVE_TAB;
                return (
                  <TouchableOpacity key={tab.key} style={[styles.webTopBarTab, webNoOutlineStyle]} onPress={() => handleTabPress(tab)}>
                    <Ionicons name={tab.icon as keyof typeof Ionicons.glyphMap} size={17} color={active ? COLORS.primary : COLORS.slate} />
                    <Text style={[styles.webTopBarTabLabel, active && { color: COLORS.primary, fontWeight: '700' }]}>{tab.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      )}

      <TypedFlatList
        data={alerts}
        keyExtractor={(item: AlertItem) => item.id}
        numColumns={columns}
        key={`cols-${columns}`}
        columnWrapperStyle={columns > 1 ? styles.columnWrapper : undefined}
        contentContainerStyle={[styles.listContent, !isWideWeb && { paddingBottom: 90 }]}
        refreshControl={
          <RefreshControl refreshing={!isLoading && isFetching} onRefresh={refetchNotifications} tintColor={COLORS.primary} />
        }
        ListHeaderComponent={
          <View style={[styles.webContainer, isWideWeb && styles.webContainerWide]}>
            <View style={styles.header}>
              <Text style={styles.headerTitle}>Alerts</Text>
              <TouchableOpacity
                style={[styles.markAllBtn, webNoOutlineStyle, unreadCount === 0 && styles.markAllBtnDisabled]}
                onPress={handleMarkAllRead}
                disabled={unreadCount === 0}
              >
                <Ionicons name="checkmark-done-outline" size={14} color={unreadCount === 0 ? COLORS.slateLight : COLORS.primary} />
                <Text style={[styles.markAllBtnText, unreadCount === 0 && { color: COLORS.slateLight }]}>Mark all as read</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={renderRow}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : (
            <View style={[styles.webContainer, isWideWeb && styles.webContainerWide]}>
              <View style={styles.emptyWrap}>
                <View style={styles.emptyIconWrap}>
                  <Ionicons name="notifications-off-outline" size={28} color={COLORS.slateLight} />
                </View>
                <Text style={styles.emptyText}>No new notifications</Text>
              </View>
            </View>
          )
        }
        style={isWideWeb ? styles.webContainerWide : undefined}
      />

      {!isWideWeb && (
        <View style={styles.bottomNav}>
          {bottomTabs.map((tab) => {
            const active = tab.key === ACTIVE_TAB;
            return (
              <TouchableOpacity key={tab.key} style={[styles.bottomNavItem, webNoOutlineStyle]} activeOpacity={0.7} onPress={() => handleTabPress(tab)}>
                <Ionicons name={tab.icon as keyof typeof Ionicons.glyphMap} size={22} color={active ? COLORS.primary : COLORS.slateLight} />
                <Text style={[styles.bottomNavLabel, { color: active ? COLORS.primary : COLORS.slateLight }]}>{tab.label}</Text>
                {tab.key === ACTIVE_TAB && unreadCount > 0 && <View style={styles.tabBadge} />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  webContainer: { width: '100%' },
  webContainerWide: { width: '100%', paddingHorizontal: 32 },

  webTopBar: { backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  webTopBarInner: {
    width: '100%',
    paddingHorizontal: 32,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  webBrand: { fontFamily: FONT_FAMILY, fontSize: 17, fontWeight: '700', color: COLORS.ink },
  webTopBarTabs: { flexDirection: 'row', gap: 22 },
  webTopBarTab: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  webTopBarTabLabel: { fontFamily: FONT_FAMILY, fontSize: 13.5, color: COLORS.slate },

  listContent: { flexGrow: 1 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 8,
  },
  headerTitle: { fontFamily: FONT_FAMILY, fontSize: 19, fontWeight: '700', color: COLORS.ink },
  markAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: COLORS.primaryLight,
  },
  markAllBtnDisabled: { backgroundColor: COLORS.bg },
  markAllBtnText: { fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '700', color: COLORS.primary },

  columnWrapper: { gap: 12, paddingHorizontal: 20 },

  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 12,
  },
  rowUnread: { backgroundColor: COLORS.primaryLight, borderColor: '#C7D9FB' },
  unreadDot: { position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  iconWrap: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  rowTopLine: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  rowTitle: { fontFamily: FONT_FAMILY, fontSize: 13.5, fontWeight: '600', color: COLORS.ink, flexShrink: 1 },
  rowTitleUnread: { fontWeight: '700' },
  rowTime: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slateLight },
  rowMessage: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate, marginTop: 3 },

  loadingWrap: { paddingVertical: 60, alignItems: 'center' },

  emptyWrap: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 24 },
  emptyIconWrap: { width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
  emptyText: { fontFamily: FONT_FAMILY, fontSize: 13.5, fontWeight: '600', color: COLORS.slate },

  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: COLORS.card,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    paddingBottom: 20,
  },
  bottomNavItem: { flex: 1, alignItems: 'center', gap: 3 },
  bottomNavLabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, fontWeight: '600' },
  tabBadge: { position: 'absolute', top: 0, right: '32%', width: 7, height: 7, borderRadius: 3.5, backgroundColor: COLORS.danger },
});

export default DriverAlertsScreen;