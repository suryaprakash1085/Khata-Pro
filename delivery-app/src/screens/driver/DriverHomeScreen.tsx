import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  FlatList,
  Switch,
  Alert,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DriverAuthContext } from '../../context/DriverAuthContext';
import {
  COLORS,
  SectionHeader,
  SummaryCard,
  QuickActionButton,
  DeliveryCard,
  ScheduleRow,
  NotificationRow,
  ProgressBar,
  CircularStat,
} from '../../components/driver/DriverHomeComponents';
import {
  DeliveryOrder,
  DeliveryStatus,
  ScheduleEntry,
  NotificationEntry,
  NotificationType,
  QuickActionItem,
} from '../../types/driverHome.types';

// ── Orval-generated hooks (run codegen after updating openapi.yaml) ────────
import {
  useGetDriver,
  useGetDriverStats,
  useGetDriverEarnings,
  useListDeliveries,
  useListNotifications,
  useUpdateDriver,
  useUpdateDeliveryStatus,
} from '@workspace/api-client-react';

const FONT_FAMILY = Platform.select({
  web: '"Times New Roman", Times, serif',
  default: 'Times New Roman', // register via expo-font / app.json for native
});

// Suppresses the browser's default focus ring on RN Web TouchableOpacity
// elements (the black box that appeared around "Earnings" after a click).
const webNoOutlineStyle = (Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any;

// ── Cross-platform alert helper ─────────────────────────────────────────────
// Alert.alert() is a silent no-op on React Native Web — it only shows a
// dialog on iOS/Android. This was the root cause of Quick Actions / Emergency
// buttons appearing to "do nothing" when running as a web build. Use this
// helper everywhere instead of calling Alert.alert directly.
function showAlert(title: string, message?: string) {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    window.alert(message ? `${title}\n\n${message}` : title);
  } else {
    Alert.alert(title, message);
  }
}

// ── Local shape of the API's Delivery object ────────────────────────────────
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

interface ApiNotification {
  id: number;
  type: NotificationType;
  message: string;
  created_at: string;
}

const TypedFlatList = FlatList as unknown as React.ComponentType<any>;

const quickActions: QuickActionItem[] = [
  { id: 'start_shift', label: 'Start Shift', icon: 'play-circle-outline', color: '#2563EB', bgColor: '#DBEAFE' },
  { id: 'assigned_orders', label: 'Assigned Orders', icon: 'clipboard-outline', color: '#10B981', bgColor: '#D1FAE5' },
  { id: 'scan_qr', label: 'Scan QR', icon: 'qr-code-outline', color: '#7C3AED', bgColor: '#EDE9FE' },
  { id: 'route_map', label: 'Route Map', icon: 'map-outline', color: '#F59E0B', bgColor: '#FEF3C7' },
  { id: 'call_dispatcher', label: 'Call Dispatcher', icon: 'call-outline', color: '#EF4444', bgColor: '#FEE2E2' },
  { id: 'earnings', label: 'Earnings', icon: 'wallet-outline', color: '#0891B2', bgColor: '#CFFAFE' },
];

function initials(name?: string) {
  if (!name) return '?';
  return name.trim().split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

function mapStatus(status: string): DeliveryStatus {
  if (status === 'in_transit') return 'in_progress';
  return status as DeliveryStatus;
}

// Only 'home' and 'orders' map to screens that actually exist in the
// navigator right now. Add a `screen` key here once Route/Alerts/Profile
// are built — anything without a `screen` falls back to a "coming soon" alert.
const bottomTabs: { key: string; label: string; icon: string; screen?: string }[] = [
  { key: 'home', label: 'Home', icon: 'home', screen: 'DriverHome' },
  { key: 'orders', label: 'Orders', icon: 'receipt-outline', screen: 'DriverOrders' },
  { key: 'route', label: 'Route', icon: 'map-outline', screen: 'DriverRoute' },
  { key: 'notifications', label: 'Alerts', icon: 'notifications-outline', screen: 'DriverAlerts' },
  { key: 'profile', label: 'Profile', icon: 'person-outline', screen: 'DriverProfile' },
];
const ACTIVE_TAB = 'home';

const DriverHomeScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { driver: authDriver, driverLogout } = useContext(DriverAuthContext) as any;
  const driverId = authDriver?.id;
  const businessId = authDriver?.business_id;

  const { width } = useWindowDimensions();
  const isWideWeb = Platform.OS === 'web' && width >= 900;

  const [isOnline, setIsOnline] = useState<boolean>(authDriver?.status === 'available');

  // ── Data fetching ──────────────────────────────────────────────────────
  const { data: driver, isLoading: driverLoading } = useGetDriver(driverId, { query: { enabled: !!driverId } });
  const { data: stats, isLoading: statsLoading } = useGetDriverStats(driverId, { query: { enabled: !!driverId } });
  const { data: earnings, isLoading: earningsLoading } = useGetDriverEarnings(driverId, {
    query: { enabled: !!driverId },
  });
  const { data: deliveriesResponse, isLoading: deliveriesLoading, refetch: refetchDeliveries } = useListDeliveries(
    { driver_id: driverId, business_id: businessId },
    { query: { enabled: !!driverId && !!businessId } }
  );
  const { data: notificationsData } = useListNotifications(
    { driver_id: driverId, limit: 10 },
    { query: { enabled: !!driverId } }
  );

  const updateDriver = useUpdateDriver();
  const updateDeliveryStatus = useUpdateDeliveryStatus();

  const isLoading = driverLoading || statsLoading || earningsLoading || deliveriesLoading;

  // ── Derived view data (unchanged) ────────────────────────────────────────
  const deliveriesPayload: any = deliveriesResponse;
  const allDeliveries: ApiDelivery[] = Array.isArray(deliveriesPayload)
    ? deliveriesPayload
    : Array.isArray(deliveriesPayload?.data)
    ? deliveriesPayload.data
    : Array.isArray(deliveriesPayload?.data?.data)
    ? deliveriesPayload.data.data
    : [];

  const assignedDeliveries: DeliveryOrder[] = allDeliveries
    .filter((d: ApiDelivery) => !['delivered', 'cancelled'].includes(d.status))
    .map((d: ApiDelivery) => ({
      id: String(d.id),
      orderId: `#DEL-${d.id}`,
      customerName: d.customer_name ?? 'Customer',
      phone: d.customer_phone ?? '—',
      address: d.drop_address,
      paymentMethod: (d.payment_method?.toUpperCase() ?? 'COD') as DeliveryOrder['paymentMethod'],
      amount: Number(d.amount ?? 0),
      status: mapStatus(d.status),
    }));

  const inProgress: ApiDelivery | undefined = allDeliveries.find((d: ApiDelivery) => d.status === 'in_transit');

  const schedule: ScheduleEntry[] = allDeliveries.slice(0, 6).map((d: ApiDelivery) => ({
    id: String(d.id),
    time: d.assigned_at ? new Date(d.assigned_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '—',
    customerName: d.customer_name ?? 'Customer',
    orderId: `#DEL-${d.id}`,
    status: mapStatus(d.status),
  }));

  const rawNotifications: ApiNotification[] = Array.isArray(notificationsData)
    ? (notificationsData as unknown as ApiNotification[])
    : (((notificationsData as any)?.data as ApiNotification[]) ?? []);

  const notifications: NotificationEntry[] = rawNotifications.map(
    (n: ApiNotification) => ({
      id: String(n.id),
      type: n.type,
      message: n.message,
      time: new Date(n.created_at).toLocaleString(),
    })
  );

  const greeting = (() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  })();

  const handleToggleOnline = (value: boolean) => {
    setIsOnline(value);
    if (!driverId) return;
    updateDriver.mutate({ id: driverId, data: { status: value ? 'available' : 'offline' } });
  };

  const handleMarkPickedUp = (deliveryId: string) => {
    updateDeliveryStatus.mutate(
      { id: Number(deliveryId), data: { status: 'picked_up' } },
      { onSuccess: () => refetchDeliveries() }
    );
  };

  const handleMarkDelivered = () => {
    if (!inProgress) return;
    updateDeliveryStatus.mutate(
      { id: inProgress.id, data: { status: 'delivered' } },
      { onSuccess: () => refetchDeliveries(), onError: () => showAlert('Error', 'Could not update delivery') }
    );
  };

  const handleUnableToDeliver = () => {
    if (!inProgress) return;
    updateDeliveryStatus.mutate(
      { id: inProgress.id, data: { status: 'cancelled' } },
      { onSuccess: () => refetchDeliveries() }
    );
  };

  // Shared handler for both the bottom nav and the wide-web top nav.
  const handleTabPress = (tab: (typeof bottomTabs)[number]) => {
    if (tab.key === ACTIVE_TAB) return; // already here
    if (tab.screen) {
      navigation.navigate(tab.screen);
    } else {
      showAlert(tab.label, 'Coming soon');
    }
  };

  // ── Quick Actions wiring ────────────────────────────────────────────────
  // Each id maps to a real handler where one already exists (Start Shift
  // reuses the online/offline mutation, Assigned Orders navigates), and
  // falls back to a visible "coming soon" alert for anything not built yet.
  const quickActionHandlers: Record<string, () => void> = {
    start_shift: () => handleToggleOnline(!isOnline),
    assigned_orders: () => navigation.navigate('DriverOrders'),
    scan_qr: () => showAlert('Scan QR', 'QR scanner coming soon'),
    route_map: () => {
      const routeTab = bottomTabs.find((t) => t.key === 'route');
      if (routeTab?.screen) {
        navigation.navigate(routeTab.screen);
      } else {
        showAlert('Route Map', 'Coming soon');
      }
    },
    call_dispatcher: () => showAlert('Call Dispatcher', 'Calling dispatcher…'),
    earnings: () => showAlert('Earnings', 'Detailed earnings screen coming soon'),
  };

  const handleQuickAction = (item: QuickActionItem) => {
    const handler = quickActionHandlers[item.id];
    if (handler) {
      handler();
    } else {
      showAlert(item.label, `${item.label} tapped`);
    }
  };

  // ── Emergency & Support wiring ──────────────────────────────────────────
  const emergencyActions = [
    { key: 'call', label: 'Call Office', icon: 'call-outline', color: COLORS.primary, onPress: () => showAlert('Call Office', 'Calling office…') },
    { key: 'report', label: 'Report Issue', icon: 'alert-circle-outline', color: COLORS.amber, onPress: () => showAlert('Report Issue', 'Opening issue form…') },
    { key: 'breakdown', label: 'Breakdown', icon: 'construct-outline', color: '#7C3AED', onPress: () => showAlert('Vehicle Breakdown', 'Reporting breakdown…') },
  ];

  if (isLoading && !driver) {
    return (
      <SafeAreaView style={[styles.safe, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />

      {/* Top bar — replaces the bottom tab strip once we're on a proper desktop viewport */}
      {isWideWeb && (
        <View style={styles.webTopBar}>
          <View style={styles.webTopBarInner}>
            <Text style={styles.webBrand}>Khata-Pro · Driver</Text>
            <View style={styles.webTopBarTabs}>
              {bottomTabs.map((tab) => {
                const active = tab.key === ACTIVE_TAB;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={[styles.webTopBarTab, webNoOutlineStyle]}
                    onPress={() => handleTabPress(tab)}
                  >
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
      >
        <View style={[styles.webContainer, isWideWeb && styles.webContainerWide]}>
          {/* Header (only shown here on mobile/narrow — desktop uses the top bar above) */}
          {!isWideWeb && (
            <View style={styles.header}>
              <View style={styles.headerTopRow}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials(driver?.name)}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.greetingText}>
                    {greeting}, {driver?.name?.split(' ')[0] ?? 'Driver'}
                  </Text>
                  <Text style={styles.driverIdText}>ID: DRV-{driver?.id ?? '—'}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.notifBtn, webNoOutlineStyle]}
                  hitSlop={8}
                  onPress={() => handleTabPress(bottomTabs.find((t) => t.key === 'notifications')!)}
                >
                  <Ionicons name="notifications-outline" size={22} color={COLORS.ink} />
                  {notifications.length > 0 && <View style={styles.notifDot} />}
                </TouchableOpacity>
                <TouchableOpacity style={[styles.logoutBtn, webNoOutlineStyle]} onPress={driverLogout} hitSlop={8}>
                  <Ionicons name="log-out-outline" size={20} color={COLORS.slate} />
                </TouchableOpacity>
              </View>

              <View style={styles.onlineToggleRow}>
                <View style={styles.onlineStatusLeft}>
                  <View style={[styles.onlineDot, { backgroundColor: isOnline ? COLORS.secondary : COLORS.slateLight }]} />
                  <Text style={styles.onlineText}>{isOnline ? 'You are Online' : 'You are Offline'}</Text>
                </View>
                <Switch
                  value={isOnline}
                  onValueChange={handleToggleOnline}
                  trackColor={{ false: '#D1D5DB', true: COLORS.secondary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          )}

          {/* Desktop-only greeting + online toggle strip (header above is hidden) */}
          {isWideWeb && (
            <View style={styles.webGreetRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initials(driver?.name)}</Text>
                </View>
                <View style={{ marginLeft: 12 }}>
                  <Text style={styles.greetingText}>
                    {greeting}, {driver?.name?.split(' ')[0] ?? 'Driver'}
                  </Text>
                  <Text style={styles.driverIdText}>ID: DRV-{driver?.id ?? '—'}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <TouchableOpacity
                  style={[styles.notifBtn, webNoOutlineStyle]}
                  hitSlop={8}
                  onPress={() => handleTabPress(bottomTabs.find((t) => t.key === 'notifications')!)}
                >
                  <Ionicons name="notifications-outline" size={22} color={COLORS.ink} />
                  {notifications.length > 0 && <View style={styles.notifDot} />}
                </TouchableOpacity>
                <View style={styles.onlineToggleRow}>
                  <View style={styles.onlineStatusLeft}>
                    <View style={[styles.onlineDot, { backgroundColor: isOnline ? COLORS.secondary : COLORS.slateLight }]} />
                    <Text style={styles.onlineText}>{isOnline ? 'You are Online' : 'You are Offline'}</Text>
                  </View>
                  <Switch
                    value={isOnline}
                    onValueChange={handleToggleOnline}
                    trackColor={{ false: '#D1D5DB', true: COLORS.secondary }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>
            </View>
          )}

          {/* Today's Summary */}
          <View style={styles.section}>
            <SectionHeader title="Today's Summary" />
            <View style={styles.grid}>
              {[
                { label: 'Total Deliveries', value: `${stats?.total_deliveries ?? 0}`, icon: 'cube-outline', color: COLORS.primary, bg: COLORS.primaryLight },
                { label: 'Completed', value: `${stats?.completed_deliveries ?? 0}`, icon: 'checkmark-done-outline', color: COLORS.secondary, bg: COLORS.secondaryLight },
                { label: 'Pending', value: `${stats?.pending_deliveries ?? 0}`, icon: 'time-outline', color: COLORS.amber, bg: COLORS.amberLight },
                { label: 'Cash to Collect', value: `₹${stats?.cash_to_collect ?? 0}`, icon: 'cash-outline', color: '#7C3AED', bg: '#EDE9FE' },
                { label: 'Distance', value: `${stats?.distance_travelled_km ?? 0} km`, icon: 'speedometer-outline', color: '#0891B2', bg: '#CFFAFE' },
                { label: 'Rating', value: `${stats?.rating ?? '—'} ★`, icon: 'star-outline', color: COLORS.danger, bg: COLORS.dangerLight },
              ].map((s) => (
                <View key={s.label} style={styles.summaryGridItem}>
                  <SummaryCard label={s.label} value={s.value} icon={s.icon as any} color={s.color} bgColor={s.bg} />
                </View>
              ))}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <SectionHeader title="Quick Actions" />
            <View style={styles.grid}>
              {quickActions.map((item) => (
                <View key={item.id} style={styles.quickActionGridItem}>
                  <QuickActionButton item={item} onPress={() => handleQuickAction(item)} />
                </View>
              ))}
            </View>
          </View>

          {/* Delivery in Progress */}
          {inProgress && (
            <View style={styles.section}>
              <SectionHeader title="Delivery in Progress" />
              <View style={styles.progressCard}>
                <View style={styles.progressCardHeader}>
                  <View>
                    <Text style={styles.progressCustomer}>{inProgress.customer_name ?? 'Customer'}</Text>
                    <Text style={styles.progressOrderId}>#DEL-{inProgress.id}</Text>
                  </View>
                  <View style={styles.etaPill}>
                    <Ionicons name="time-outline" size={13} color={COLORS.primary} />
                    <Text style={styles.etaPillText}>En route</Text>
                  </View>
                </View>

                <ProgressBar progress={0.5} style={{ marginVertical: 12 }} />

                <View style={styles.progressActionsRow}>
                  <TouchableOpacity style={[styles.navigateBtn, webNoOutlineStyle]} onPress={() => showAlert('Navigation', 'Starting navigation…')}>
                    <Ionicons name="navigate" size={15} color="#FFFFFF" />
                    <Text style={styles.navigateBtnText}>Start Navigation</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.deliveredBtn, webNoOutlineStyle]} onPress={handleMarkDelivered}>
                    <Text style={styles.deliveredBtnText}>Delivered</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.unableBtn, webNoOutlineStyle]} onPress={handleUnableToDeliver}>
                    <Text style={styles.unableBtnText}>Unable to Deliver</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}

          {/* Assigned Deliveries + Today's Schedule sit side-by-side on desktop */}
          <View style={[styles.section, isWideWeb && styles.twoColRow]}>
            <View style={isWideWeb ? styles.twoColLeft : undefined}>
              <SectionHeader title="Assigned Deliveries" />
              {assignedDeliveries.length === 0 ? (
                <Text style={styles.emptyText}>No deliveries assigned right now.</Text>
              ) : (
                <TypedFlatList
                  data={assignedDeliveries}
                  keyExtractor={(item: DeliveryOrder) => item.id}
                  scrollEnabled={false}
                  renderItem={({ item }: { item: DeliveryOrder }) => (
                    <DeliveryCard
                      order={item}
                      onNavigate={() => showAlert('Navigate', item.address)}
                      onCall={() => showAlert('Call', item.phone)}
                      onMarkPickedUp={() => handleMarkPickedUp(item.id)}
                    />
                  )}
                />
              )}
            </View>

            <View style={isWideWeb ? styles.twoColRight : { marginTop: 22 }}>
              <SectionHeader title="Today's Schedule" />
              <TypedFlatList
                data={schedule}
                keyExtractor={(item: ScheduleEntry) => item.id}
                scrollEnabled={false}
                renderItem={({ item }: { item: ScheduleEntry }) => <ScheduleRow item={item} />}
              />
            </View>
          </View>

          {/* Performance + Earnings side-by-side on desktop */}
          <View style={[styles.section, isWideWeb && styles.twoColRow]}>
            <View style={isWideWeb ? styles.twoColLeft : undefined}>
              <SectionHeader title="Performance" />
              <View style={styles.performanceCard}>
                <View style={styles.circularRow}>
                  <CircularStat value={`${stats?.success_rate ?? 0}%`} label="Success Rate" color={COLORS.secondary} />
                  <CircularStat value={`${stats?.avg_delivery_time_minutes ?? 0}m`} label="Avg. Time" color={COLORS.primary} />
                  <CircularStat value={`${stats?.completed_deliveries ?? 0}`} label="Completed" color="#7C3AED" />
                  <CircularStat value={`${stats?.rating ?? '—'}★`} label="Rating" color={COLORS.amber} />
                </View>
                <View style={{ marginTop: 16 }}>
                  <View style={styles.performanceBarLabelRow}>
                    <Text style={styles.performanceBarLabel}>Success Rate</Text>
                    <Text style={styles.performanceBarValue}>{stats?.success_rate ?? 0}%</Text>
                  </View>
                  <ProgressBar progress={(stats?.success_rate ?? 0) / 100} color={COLORS.secondary} />
                </View>
              </View>
            </View>

            <View style={isWideWeb ? styles.twoColRight : { marginTop: 22 }}>
              <SectionHeader title="Earnings Summary" />
              <View style={styles.earningsCard}>
                <View style={styles.earningsMainRow}>
                  <View>
                    <Text style={styles.earningsMainLabel}>Today's Earnings</Text>
                    <Text style={styles.earningsMainValue}>₹{earnings?.today_earnings ?? 0}</Text>
                  </View>
                  <View style={styles.earningsIconWrap}>
                    <Ionicons name="trending-up-outline" size={22} color={COLORS.secondary} />
                  </View>
                </View>
                <View style={styles.earningsGridRow}>
                  <View style={styles.earningsGridItem}>
                    <Text style={styles.earningsGridValue}>₹{earnings?.cod_collected ?? 0}</Text>
                    <Text style={styles.earningsGridLabel}>COD Collected</Text>
                  </View>
                  <View style={styles.earningsGridItem}>
                    <Text style={styles.earningsGridValue}>₹{earnings?.incentives ?? 0}</Text>
                    <Text style={styles.earningsGridLabel}>Incentives</Text>
                  </View>
                  <View style={styles.earningsGridItem}>
                    <Text style={styles.earningsGridValue}>₹{earnings?.weekly_earnings ?? 0}</Text>
                    <Text style={styles.earningsGridLabel}>This Week</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Notifications */}
          <View style={styles.section}>
            <SectionHeader title="Recent Activity" />
            <View style={styles.notifCard}>
              {notifications.length === 0 ? (
                <Text style={styles.emptyText}>No recent activity.</Text>
              ) : (
                notifications.map((item) => <NotificationRow key={item.id} item={item} />)
              )}
            </View>
          </View>

          {/* Emergency & Support */}
          <View style={[styles.section, { marginBottom: isWideWeb ? 32 : 0 }]}>
            <SectionHeader title="Emergency & Support" />
            <View style={styles.grid}>
              {emergencyActions.map((e) => (
                <View key={e.key} style={styles.emergencyGridItem}>
                  <TouchableOpacity style={[styles.emergencyBtn, webNoOutlineStyle]} onPress={e.onPress}>
                    <Ionicons name={e.icon as keyof typeof Ionicons.glyphMap} size={18} color={e.color} />
                    <Text style={styles.emergencyBtnText}>{e.label}</Text>
                  </TouchableOpacity>
                </View>
              ))}
              <View style={styles.emergencyGridItem}>
                <TouchableOpacity
                  style={[styles.emergencyBtn, styles.sosBtn, webNoOutlineStyle]}
                  onPress={() => showAlert('SOS', 'Emergency alert sent to dispatch')}
                >
                  <Ionicons name="warning-outline" size={18} color="#FFFFFF" />
                  <Text style={[styles.emergencyBtnText, { color: '#FFFFFF' }]}>SOS</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation — only on mobile/narrow web, fixed to viewport bottom */}
      {!isWideWeb && (
        <View style={styles.bottomNav}>
          {bottomTabs.map((tab) => {
            const active = tab.key === ACTIVE_TAB;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.bottomNavItem, webNoOutlineStyle]}
                activeOpacity={0.7}
                onPress={() => handleTabPress(tab)}
              >
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

  webTopBar: {
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
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

  webGreetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 22,
  },

  header: {
    backgroundColor: COLORS.card,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  headerTopRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: FONT_FAMILY, fontSize: 16, fontWeight: '700', color: COLORS.primaryDark },
  greetingText: { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: '700', color: COLORS.ink },
  driverIdText: { fontFamily: FONT_FAMILY, fontSize: 11.5, color: COLORS.slate, marginTop: 2 },
  notifBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  notifDot: { position: 'absolute', top: 8, right: 9, width: 7, height: 7, borderRadius: 4, backgroundColor: COLORS.danger },
  logoutBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: COLORS.bg, alignItems: 'center', justifyContent: 'center' },
  onlineToggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: COLORS.bg, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, marginTop: 14, gap: 16 },
  onlineStatusLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  onlineDot: { width: 8, height: 8, borderRadius: 4 },
  onlineText: { fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '600', color: COLORS.ink },

  section: { paddingHorizontal: 20, marginTop: 22 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  summaryGridItem: { flexGrow: 1, flexBasis: 168, maxWidth: 260 },
  quickActionGridItem: { flexGrow: 1, flexBasis: 92, maxWidth: 150 },
  emergencyGridItem: { flexGrow: 1, flexBasis: 200, maxWidth: 320 },

  twoColRow: { flexDirection: 'row', gap: 20, alignItems: 'flex-start' },
  twoColLeft: { flex: 1 },
  twoColRight: { flex: 1 },

  emptyText: { fontFamily: FONT_FAMILY, fontSize: 13, color: COLORS.slate, textAlign: 'center', paddingVertical: 20 },
  progressCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  progressCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  progressCustomer: { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: '700', color: COLORS.ink },
  progressOrderId: { fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.slate, marginTop: 2 },
  etaPill: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: COLORS.primaryLight, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  etaPillText: { fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '700', color: COLORS.primary },
  progressActionsRow: { flexDirection: 'row', gap: 8, marginTop: 14, flexWrap: 'wrap' },
  navigateBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.primary, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  navigateBtnText: { fontFamily: FONT_FAMILY, color: '#FFFFFF', fontSize: 12.5, fontWeight: '700' },
  deliveredBtn: { backgroundColor: COLORS.secondary, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  deliveredBtnText: { fontFamily: FONT_FAMILY, color: '#FFFFFF', fontSize: 12.5, fontWeight: '700' },
  unableBtn: { backgroundColor: COLORS.dangerLight, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12 },
  unableBtnText: { fontFamily: FONT_FAMILY, color: COLORS.danger, fontSize: 12.5, fontWeight: '700' },
  performanceCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  circularRow: { flexDirection: 'row', justifyContent: 'space-between' },
  performanceBarLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  performanceBarLabel: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate, fontWeight: '600' },
  performanceBarValue: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.ink, fontWeight: '700' },
  earningsCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  earningsMainRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  earningsMainLabel: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate },
  earningsMainValue: { fontFamily: FONT_FAMILY, fontSize: 24, fontWeight: '700', color: COLORS.ink, marginTop: 2 },
  earningsIconWrap: { width: 44, height: 44, borderRadius: 14, backgroundColor: COLORS.secondaryLight, alignItems: 'center', justifyContent: 'center' },
  earningsGridRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 16, paddingTop: 14, borderTopWidth: 1, borderTopColor: COLORS.border },
  earningsGridItem: { alignItems: 'center', flex: 1 },
  earningsGridValue: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '700', color: COLORS.ink },
  earningsGridLabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slate, marginTop: 3, textAlign: 'center' },
  notifCard: { backgroundColor: COLORS.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: COLORS.border },

  emergencyBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14 },
  emergencyBtnText: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.ink },
  sosBtn: { backgroundColor: COLORS.danger, borderColor: COLORS.danger },

  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: COLORS.card, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 8, paddingBottom: 20 },
  bottomNavItem: { flex: 1, alignItems: 'center', gap: 3 },
  bottomNavLabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, fontWeight: '600' },
});

export default DriverHomeScreen;

