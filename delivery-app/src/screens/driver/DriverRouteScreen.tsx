import React, { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  Linking,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DriverAuthContext } from '../../context/DriverAuthContext';
import { COLORS } from '../../components/driver/DriverHomeComponents';
import {
  RouteSectionHeader,
  RouteSummaryCard,
  RouteProgress,
  RouteMapPlaceholder,
  NextDeliveryCard,
  RouteStopTimeline,
  RouteAlertRow,
  RouteEmptyState,
} from '../../components/driver/DriverRouteComponents';
import { RouteStop, RouteSummaryData, RouteSummaryItem, RouteAlertItem } from '../../types/driverRoute.types';

// ── Orval-generated hooks (same pattern as Home / Orders screens) ─────────
import { useListDeliveries, useUpdateDeliveryStatus } from '@workspace/api-client-react';

const FONT_FAMILY = Platform.select({
  web: '"Times New Roman", Times, serif',
  default: 'Times New Roman',
});
const webNoOutlineStyle = (Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any;

interface ApiDelivery {
  id: number;
  business_id: number;
  customer_id: number;
  driver_id: number | null;
  pickup_address: string;
  drop_address: string;
  status: string;
  notes?: string | null;
  amount?: number | null;
  payment_method?: string | null;
  distance_km?: number | null;
  assigned_at?: string | null;
  picked_up_at?: string | null;
  delivered_at?: string | null;
  cancelled_at?: string | null;
  created_at: string;
  customer_name?: string;
  customer_phone?: string;
}

// Only 'home' and 'orders'/'route' map to real screens right now — same
// convention used in DriverHomeScreen.tsx / DriverOrdersScreen.tsx.
const bottomTabs: { key: string; label: string; icon: string; screen?: string }[] = [
  { key: 'home', label: 'Home', icon: 'home-outline', screen: 'DriverHome' },
  { key: 'orders', label: 'Orders', icon: 'receipt-outline', screen: 'DriverOrders' },
  { key: 'route', label: 'Route', icon: 'map', screen: 'DriverRoute' },
  { key: 'notifications', label: 'Alerts', icon: 'notifications-outline', screen: 'DriverAlerts' },
  { key: 'profile', label: 'Profile', icon: 'person-outline', screen: 'DriverProfile' },
];
const ACTIVE_TAB = 'route';

// Rough ETA estimate from distance, since no routing/traffic API is wired
// up yet. Assumes a conservative in-city average of 25 km/h.
function estimateEtaMinutes(distanceKm: number | null): number | null {
  if (distanceKm == null || Number.isNaN(distanceKm)) return null;
  return Math.max(1, Math.round((distanceKm / 25) * 60));
}

const DriverRouteScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { driver: authDriver } = useContext(DriverAuthContext) as any;
  const driverId = authDriver?.id;
  const businessId = authDriver?.business_id;
  const isOnline = authDriver?.status === 'available';

  const { width } = useWindowDimensions();
  const isWideWeb = Platform.OS === 'web' && width >= 900;

  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const {
    data: deliveriesResponse,
    isLoading,
    isFetching,
    refetch: refetchDeliveries,
  } = useListDeliveries(
    { driver_id: driverId, business_id: businessId },
    { query: { enabled: !!driverId && !!businessId } }
  );

  const updateDeliveryStatus = useUpdateDeliveryStatus();

  const deliveriesPayload: any = deliveriesResponse;
  const rawDeliveries: ApiDelivery[] = Array.isArray(deliveriesPayload)
    ? deliveriesPayload
    : Array.isArray(deliveriesPayload?.data)
    ? deliveriesPayload.data
    : Array.isArray(deliveriesPayload?.data?.data)
    ? deliveriesPayload.data.data
    : [];

  // ── Build the route's stop list ─────────────────────────────────────────
  // Each active (non-cancelled) delivery contributes two stops: a Pickup
  // stop (done once `picked_up_at` is set) and a Delivery stop (done once
  // `delivered_at` is set). Stops are ordered by `assigned_at`/`created_at`,
  // and the first not-yet-completed stop in that order is treated as the
  // single "current" stop — everything before it is "completed", everything
  // after is "upcoming". This uses only fields the API already returns; it
  // doesn't invent geocoding or a real route sequence.
  const stops: RouteStop[] = useMemo(() => {
    const active = rawDeliveries
      .filter((d) => d.status !== 'cancelled' && d.status !== 'failed')
      .slice()
      .sort((a, b) => {
        const at = a.assigned_at ?? a.created_at;
        const bt = b.assigned_at ?? b.created_at;
        return new Date(at).getTime() - new Date(bt).getTime();
      });

    const built: RouteStop[] = [];
    active.forEach((d) => {
      const distanceKm = d.distance_km != null ? Number(d.distance_km) : null;
      const orderId = `#DEL-${d.id}`;

      built.push({
        id: `${d.id}-pickup`,
        stopNumber: 0, // assigned below
        type: 'pickup',
        state: d.picked_up_at ? 'completed' : 'upcoming', // refined below
        orderId,
        rawOrderId: String(d.id),
        customerName: d.customer_name ?? 'Customer',
        phone: d.customer_phone ?? '',
        address: d.pickup_address ?? 'Pickup location not provided',
        distanceKm,
        etaMinutes: estimateEtaMinutes(distanceKm),
        amount: Number(d.amount ?? 0),
        paymentMethod: (d.payment_method?.toUpperCase() ?? 'COD'),
        completedAt: d.picked_up_at ?? null,
        assignedAt: d.assigned_at ?? d.created_at,
      });

      built.push({
        id: `${d.id}-delivery`,
        stopNumber: 0,
        type: 'delivery',
        state: d.delivered_at ? 'completed' : 'upcoming',
        orderId,
        rawOrderId: String(d.id),
        customerName: d.customer_name ?? 'Customer',
        phone: d.customer_phone ?? '',
        address: d.drop_address ?? 'Delivery address not provided',
        distanceKm,
        etaMinutes: estimateEtaMinutes(distanceKm),
        amount: Number(d.amount ?? 0),
        paymentMethod: (d.payment_method?.toUpperCase() ?? 'COD'),
        completedAt: d.delivered_at ?? null,
        assignedAt: d.assigned_at ?? d.created_at,
      });
    });

    const firstIncompleteIdx = built.findIndex((s) => s.state !== 'completed');
    if (firstIncompleteIdx !== -1) {
      built[firstIncompleteIdx] = { ...built[firstIncompleteIdx], state: 'current' };
    }

    return built.map((s, idx) => ({ ...s, stopNumber: idx + 1 }));
  }, [rawDeliveries]);

  // ── Route summary numbers ───────────────────────────────────────────────
  const summary: RouteSummaryData = useMemo(() => {
    const totalStops = stops.length;
    const completedStops = stops.filter((s) => s.state === 'completed').length;
    const remainingStops = totalStops - completedStops;

    // Distance is tallied per order (not per stop) to avoid double counting
    // the same `distance_km` value across its pickup + delivery stop.
    const activeOrders = rawDeliveries.filter((d) => d.status !== 'cancelled' && d.status !== 'failed');
    const totalDistanceKm = activeOrders.reduce((sum, d) => sum + (d.distance_km != null ? Number(d.distance_km) : 0), 0);
    const completedDistanceKm = activeOrders
      .filter((d) => !!d.delivered_at)
      .reduce((sum, d) => sum + (d.distance_km != null ? Number(d.distance_km) : 0), 0);
    const remainingDistanceKm = Math.max(0, totalDistanceKm - completedDistanceKm);

    return {
      totalStops,
      completedStops,
      remainingStops,
      totalDistanceKm: Math.round(totalDistanceKm * 10) / 10,
      completedDistanceKm: Math.round(completedDistanceKm * 10) / 10,
      remainingDistanceKm: Math.round(remainingDistanceKm * 10) / 10,
      progress: totalStops > 0 ? completedStops / totalStops : 0,
    };
  }, [stops, rawDeliveries]);

  const summaryItems: RouteSummaryItem[] = [
    { key: 'total', label: 'Total Stops', value: `${summary.totalStops}`, icon: 'flag-outline', color: COLORS.primary, bgColor: COLORS.primaryLight },
    { key: 'completed', label: 'Completed', value: `${summary.completedStops}`, icon: 'checkmark-done-outline', color: COLORS.secondary, bgColor: COLORS.secondaryLight },
    { key: 'remaining', label: 'Remaining', value: `${summary.remainingStops}`, icon: 'time-outline', color: COLORS.amber, bgColor: COLORS.amberLight },
    { key: 'distance', label: 'Distance Left', value: `${summary.remainingDistanceKm} km`, icon: 'speedometer-outline', color: '#0891B2', bgColor: '#CFFAFE' },
  ];

  // The stop the NextDeliveryCard highlights — first not-completed stop of
  // type "delivery" (pickups aren't shown there since the card is built
  // around customer/phone/payment info).
  const nextDeliveryStop = useMemo(
    () => stops.find((s) => s.type === 'delivery' && s.state !== 'completed') ?? null,
    [stops]
  );

  // Lightweight, data-derived route alerts (kept compact per spec) — a
  // cancelled order is the one signal we can honestly derive from the API
  // right now without a dedicated route-events endpoint.
  const alerts: RouteAlertItem[] = useMemo(() => {
    const cancelled = rawDeliveries.filter((d) => d.status === 'cancelled' || d.status === 'failed');
    return cancelled.slice(0, 3).map((d) => ({
      id: String(d.id),
      type: 'cancelled' as const,
      message: `Delivery #DEL-${d.id} was cancelled`,
      time: d.cancelled_at ? new Date(d.cancelled_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
    }));
  }, [rawDeliveries]);

  const todayLabel = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

  // ── Handlers ─────────────────────────────────────────────────────────────
  const runStatusUpdate = (stop: RouteStop, status: string) => {
    setUpdatingId(stop.id);
    updateDeliveryStatus.mutate(
      { id: Number(stop.rawOrderId), data: { status } },
      {
        onSuccess: () => {
          setUpdatingId(null);
          refetchDeliveries();
        },
        onError: () => {
          setUpdatingId(null);
          Alert.alert('Error', 'Could not update the stop. Please try again.');
        },
      }
    );
  };

  const handleMarkArrived = (stop: RouteStop) => runStatusUpdate(stop, 'picked_up');
  const handleMarkDelivered = (stop: RouteStop) => runStatusUpdate(stop, 'delivered');
  const handleUnableToDeliver = (stop: RouteStop) => runStatusUpdate(stop, 'cancelled');

  // Uses whatever navigation/maps implementation exists elsewhere in the
  // app; falls back to an address alert since none is wired up here yet.
  const handleNavigate = (stop: RouteStop | null) => {
    if (!stop) return;
    Alert.alert('Navigate', stop.address);
  };

  const handleCall = (stop: RouteStop | null) => {
    if (!stop) return;
    if (!stop.phone) {
      Alert.alert('No phone number', 'This customer has no phone number on file.');
      return;
    }
    Linking.openURL(`tel:${stop.phone}`).catch(() =>
      Alert.alert('Unable to call', 'Could not open the dialer on this device.')
    );
  };

  const handleTabPress = (tab: (typeof bottomTabs)[number]) => {
    if (tab.key === ACTIVE_TAB) return;
    if (tab.screen) {
      navigation.navigate(tab.screen);
    } else {
      Alert.alert(tab.label, 'Coming soon');
    }
  };

  const showEmpty = !isLoading && stops.length === 0;

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, !isWideWeb && { paddingBottom: 90 }]}
        refreshControl={
          <RefreshControl refreshing={!isLoading && isFetching} onRefresh={refetchDeliveries} tintColor={COLORS.primary} />
        }
      >
        <View style={[styles.webContainer, isWideWeb && styles.webContainerWide]}>
          {/* Header */}
          {!isWideWeb ? (
            <View style={styles.mobileHeader}>
              <View>
                <Text style={styles.headerTitle}>Today's Route</Text>
                <View style={styles.headerSubRow}>
                  <Text style={styles.headerDate}>{todayLabel}</Text>
                  <View style={styles.headerDot} />
                  <View style={[styles.onlineDot, { backgroundColor: isOnline ? COLORS.secondary : COLORS.slateLight }]} />
                  <Text style={styles.headerOnlineText}>{isOnline ? 'Online' : 'Offline'}</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.refreshBtn, webNoOutlineStyle]} onPress={() => refetchDeliveries()} hitSlop={8}>
                <Ionicons name="refresh-outline" size={20} color={COLORS.ink} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.webHeader}>
              <View>
                <Text style={styles.headerTitle}>Today's Route</Text>
                <View style={styles.headerSubRow}>
                  <Text style={styles.headerDate}>{todayLabel}</Text>
                  <View style={styles.headerDot} />
                  <View style={[styles.onlineDot, { backgroundColor: isOnline ? COLORS.secondary : COLORS.slateLight }]} />
                  <Text style={styles.headerOnlineText}>{isOnline ? 'Online' : 'Offline'}</Text>
                </View>
              </View>
              <TouchableOpacity style={[styles.refreshBtn, webNoOutlineStyle]} onPress={() => refetchDeliveries()}>
                <Ionicons name="refresh-outline" size={16} color={COLORS.ink} />
                <Text style={styles.refreshBtnText}>Refresh</Text>
              </TouchableOpacity>
            </View>
          )}

          {isLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : showEmpty ? (
            <RouteEmptyState />
          ) : isWideWeb ? (
            // ── Wide web: map left, controls right, stops below ───────────
            <>
              <View style={styles.desktopTopRow}>
                <View style={styles.desktopMapCol}>
                  <RouteMapPlaceholder stops={stops} />
                </View>
                <View style={styles.desktopSideCol}>
                  <NextDeliveryCard stop={nextDeliveryStop} onNavigate={() => handleNavigate(nextDeliveryStop)} onCall={() => handleCall(nextDeliveryStop)} />
                  <View style={{ height: 14 }} />
                  <RouteProgress completed={summary.completedStops} total={summary.totalStops} progress={summary.progress} />
                  <View style={{ height: 14 }} />
                  <View style={styles.summaryGridDesktop}>
                    {summaryItems.map((item) => (
                      <View key={item.key} style={styles.summaryGridItemDesktop}>
                        <RouteSummaryCard item={item} />
                      </View>
                    ))}
                  </View>
                  {alerts.length > 0 && (
                    <>
                      <View style={{ height: 14 }} />
                      <View style={styles.alertsCard}>
                        <RouteSectionHeader title="Route Alerts" />
                        {alerts.map((a) => (
                          <RouteAlertRow key={a.id} item={a} />
                        ))}
                      </View>
                    </>
                  )}
                </View>
              </View>

              <View style={[styles.section, { marginTop: 22 }]}>
                <RouteSectionHeader title="Today's Stops" />
                <RouteStopTimeline
                  stops={stops}
                  updatingId={updatingId}
                  onNavigate={handleNavigate}
                  onCall={handleCall}
                  onMarkArrived={handleMarkArrived}
                  onMarkDelivered={handleMarkDelivered}
                  onUnableToDeliver={handleUnableToDeliver}
                />
              </View>
            </>
          ) : (
            // ── Mobile: map, next delivery, progress, stops ────────────────
            <>
              <View style={styles.section}>
                <RouteMapPlaceholder stops={stops} />
              </View>

              <View style={styles.section}>
                <NextDeliveryCard stop={nextDeliveryStop} onNavigate={() => handleNavigate(nextDeliveryStop)} onCall={() => handleCall(nextDeliveryStop)} />
              </View>

              <View style={styles.section}>
                <RouteProgress completed={summary.completedStops} total={summary.totalStops} progress={summary.progress} />
              </View>

              <View style={styles.section}>
                <View style={styles.summaryGridMobile}>
                  {summaryItems.map((item) => (
                    <View key={item.key} style={styles.summaryGridItemMobile}>
                      <RouteSummaryCard item={item} />
                    </View>
                  ))}
                </View>
              </View>

              {alerts.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.alertsCard}>
                    <RouteSectionHeader title="Route Alerts" />
                    {alerts.map((a) => (
                      <RouteAlertRow key={a.id} item={a} />
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.section}>
                <RouteSectionHeader title="Today's Stops" />
                <RouteStopTimeline
                  stops={stops}
                  updatingId={updatingId}
                  onNavigate={handleNavigate}
                  onCall={handleCall}
                  onMarkArrived={handleMarkArrived}
                  onMarkDelivered={handleMarkDelivered}
                  onUnableToDeliver={handleUnableToDeliver}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {!isWideWeb && (
        <View style={styles.bottomNav}>
          {bottomTabs.map((tab) => {
            const active = tab.key === ACTIVE_TAB;
            return (
              <TouchableOpacity key={tab.key} style={[styles.bottomNavItem, webNoOutlineStyle]} activeOpacity={0.7} onPress={() => handleTabPress(tab)}>
                <Ionicons name={tab.icon as keyof typeof Ionicons.glyphMap} size={22} color={active ? COLORS.primary : COLORS.slateLight} />
                <Text style={[styles.bottomNavLabel, { color: active ? COLORS.primary : COLORS.slateLight }]}>{tab.label}</Text>
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
  scrollContent: { flexGrow: 1 },

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

  mobileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  webHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 22,
  },
  headerTitle: { fontFamily: FONT_FAMILY, fontSize: 19, fontWeight: '700', color: COLORS.ink },
  headerSubRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 3 },
  headerDate: { fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.slate },
  headerDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: COLORS.slateLight },
  onlineDot: { width: 6, height: 6, borderRadius: 3 },
  headerOnlineText: { fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.slate },

  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    width: Platform.OS === 'web' ? undefined : 38,
    height: Platform.OS === 'web' ? undefined : 38,
    paddingHorizontal: Platform.OS === 'web' ? 14 : 0,
    paddingVertical: Platform.OS === 'web' ? 9 : 0,
    borderRadius: 10,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  refreshBtnText: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.ink },

  section: { paddingHorizontal: 20, marginTop: 18 },
  loadingWrap: { paddingVertical: 80, alignItems: 'center' },

  // Desktop layout: map left, controls right
  desktopTopRow: { flexDirection: 'row', gap: 20, alignItems: 'flex-start', paddingHorizontal: 20, marginTop: 20 },
  desktopMapCol: { flex: 1.4 },
  desktopSideCol: { flex: 1 },

  summaryGridMobile: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  summaryGridItemMobile: { flexGrow: 1, flexBasis: 130, maxWidth: 190 },
  summaryGridDesktop: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  summaryGridItemDesktop: { flexGrow: 1, flexBasis: '46%' },

  alertsCard: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14 },

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
});

export default DriverRouteScreen;