
import React, { useContext, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  FlatList,
  TextInput,
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
  OrderSummaryCard,
  OrderFilterTabs,
  OrderCard,
  EmptyOrdersState,
} from '../../components/driver/DriverOrdersComponents';
import { OrderCardData, OrderFilterKey, OrderStatus, OrderSummaryItem } from '../../types/driverOrders.types';

// ── Orval-generated hooks ────────────────────────────────────────────────
import { useListDeliveries, useUpdateDeliveryStatus } from '@workspace/api-client-react';


import { getDriverToken } from '../../utils/storage';

const FONT_FAMILY = Platform.select({
  web: '"Times New Roman", Times, serif',
  default: 'Times New Roman',
});
const webNoOutlineStyle = (Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any;

const TypedFlatList = FlatList as unknown as React.ComponentType<any>;

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
  out_for_delivery_at?: string | null;
}

function mapStatus(status: string): OrderStatus {
  // if (status === 'in_transit') return 'in_progress';
  return status as OrderStatus;
}

// Only 'home' and 'orders' map to screens that actually exist in the
// navigator right now. Add a `screen` key here once Route/Alerts/Profile
// are built — anything without a `screen` falls back to a "coming soon" alert.
const bottomTabs: { key: string; label: string; icon: string; screen?: string }[] = [
  { key: 'home', label: 'Home', icon: 'home-outline', screen: 'DriverHome' },
  { key: 'orders', label: 'Orders', icon: 'receipt', screen: 'DriverOrders' },
  { key: 'route', label: 'Route', icon: 'map-outline', screen: 'DriverRoute' },
  { key: 'notifications', label: 'Alerts', icon: 'notifications-outline', screen: 'DriverAlerts' },
  { key: 'profile', label: 'Profile', icon: 'person-outline', screen: 'DriverProfile' },
];
const ACTIVE_TAB = 'orders';

// API base — mirrors the same default used elsewhere in the app.
const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const DriverOrdersScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { driver: authDriver } = useContext(DriverAuthContext) as any;
  const driverId = authDriver?.id;
  const businessId = authDriver?.business_id;

  const { width } = useWindowDimensions();
  const isWideWeb = Platform.OS === 'web' && width >= 900;
  const columns = isWideWeb ? 2 : 1;

  const [activeFilter, setActiveFilter] = useState<OrderFilterKey>('all');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [markingOutForDeliveryId, setMarkingOutForDeliveryId] = useState<string | null>(null);

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

  // ── Derived view data ──────────────────────────────────────────────────
  const deliveriesPayload: any = deliveriesResponse;
  const rawDeliveries: ApiDelivery[] = Array.isArray(deliveriesPayload)
    ? deliveriesPayload
    : Array.isArray(deliveriesPayload?.data)
    ? deliveriesPayload.data
    : Array.isArray(deliveriesPayload?.data?.data)
    ? deliveriesPayload.data.data
    : [];

  const allOrders: OrderCardData[] = rawDeliveries.map((d) => ({
    id: String(d.id),
    orderId: `#DEL-${d.id}`,
    status: mapStatus(d.status),
    customerName: d.customer_name ?? 'Customer',
    phone: d.customer_phone ?? '',
    pickupAddress: d.pickup_address,
    dropAddress: d.drop_address,
    amount: Number(d.amount ?? 0),
    paymentMethod: (d.payment_method?.toUpperCase() ?? 'COD'),
    distanceKm: d.distance_km ?? null,
    notes: d.notes,
    assignedAt: d.assigned_at,
    pickedUpAt: d.picked_up_at,
    deliveredAt: d.delivered_at,
    cancelledAt: d.cancelled_at,
    outForDeliveryAt: d.out_for_delivery_at ?? null,
  }));

  const counts = useMemo(() => {
    const c: Record<OrderFilterKey, number> = {
      all: allOrders.length,
      pending: 0,
      picked_up: 0,
      in_progress: 0,
      delivered: 0,
      cancelled: 0,
    };
    allOrders.forEach((o) => {
      if (o.status === 'pending' || o.status === 'assigned') c.pending += 1;
      else if (o.status === 'picked_up') c.picked_up += 1;
      else if (o.status === 'in_progress') c.in_progress += 1;
      else if (o.status === 'delivered') c.delivered += 1;
      else if (o.status === 'cancelled' || o.status === 'failed') c.cancelled += 1;
    });
    return c;
  }, [allOrders]);

  const summaryItems: OrderSummaryItem[] = [
    { key: 'all', label: 'All Orders', count: counts.all, icon: 'albums-outline', color: COLORS.primary, bgColor: COLORS.primaryLight },
    { key: 'pending', label: 'Pending', count: counts.pending, icon: 'time-outline', color: COLORS.amber, bgColor: COLORS.amberLight },
    { key: 'picked_up', label: 'Picked Up', count: counts.picked_up, icon: 'cube-outline', color: '#7C3AED', bgColor: '#EDE9FE' },
    { key: 'in_progress', label: 'In Progress', count: counts.in_progress, icon: 'navigate-outline', color: COLORS.secondary, bgColor: COLORS.secondaryLight },
    { key: 'delivered', label: 'Delivered', count: counts.delivered, icon: 'checkmark-done-outline', color: COLORS.secondary, bgColor: COLORS.secondaryLight },
    { key: 'cancelled', label: 'Cancelled', count: counts.cancelled, icon: 'close-circle-outline', color: COLORS.danger, bgColor: COLORS.dangerLight },
  ];

  const filteredOrders = useMemo(() => {
    let list = allOrders;
    if (activeFilter !== 'all') {
      list = list.filter((o) => {
        if (activeFilter === 'pending') return o.status === 'pending' || o.status === 'assigned';
        if (activeFilter === 'cancelled') return o.status === 'cancelled' || o.status === 'failed';
        return o.status === activeFilter;
      });
    }
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.phone.toLowerCase().includes(q)
      );
    }
    return list;
  }, [allOrders, activeFilter, search]);

  const todayLabel = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

  // ── Handlers ─────────────────────────────────────────────────────────
  const runStatusUpdate = (id: string, status: string) => {
    setUpdatingId(id);
    updateDeliveryStatus.mutate(
      { id: Number(id), data: { status } },
      {
        onSuccess: () => {
          setUpdatingId(null);
          refetchDeliveries();
        },
        onError: (err: any) => {
          setUpdatingId(null);
          const msg = err?.response?.data?.error || err?.error || 'Could not update the order. Please try again.';
          Alert.alert('Error', msg);
          refetchDeliveries(); // resync UI in case another action already changed it
        },
      }
    );
  };

  const handleMarkPickedUp = (id: string) => runStatusUpdate(id, 'picked_up');

  // ✅ FIXED — was using the customer-app apiClient (wrong token, caused
  // 401 Unauthorized). Now uses the driver's own token via getDriverToken(),
  // the same storage the Orval-generated hooks above already use successfully.
  const handleStartDelivery = async (id: string) => {
    setMarkingOutForDeliveryId(id);
    try {
      const token = await getDriverToken();
      const res = await fetch(`${API_BASE}/deliveries/${id}/my-out-for-delivery`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || 'Failed to update');
      }
      refetchDeliveries();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Could not mark as out for delivery. Please try again.');
    } finally {
      setMarkingOutForDeliveryId(null);
    }
  };

  const handleMarkDelivered = (id: string) => runStatusUpdate(id, 'delivered');
  const handleUnableToDeliver = (id: string) => runStatusUpdate(id, 'cancelled');

  const handleNavigate = (order: OrderCardData) => {
    Alert.alert('Navigate', order.dropAddress);
  };

  const handleCall = (order: OrderCardData) => {
    if (!order.phone) {
      Alert.alert('No phone number', 'This customer has no phone number on file.');
      return;
    }
    Linking.openURL(`tel:${order.phone}`).catch(() =>
      Alert.alert('Unable to call', 'Could not open the dialer on this device.')
    );
  };

  // Shared handler for both the bottom nav and the wide-web top nav.
  const handleTabPress = (tab: (typeof bottomTabs)[number]) => {
    if (tab.key === ACTIVE_TAB) return; // already here
    if (tab.screen) {
      navigation.navigate(tab.screen);
    } else {
      Alert.alert(tab.label, 'Coming soon');
    }
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

      <TypedFlatList
        data={filteredOrders}
        keyExtractor={(item: OrderCardData) => item.id}
        numColumns={columns}
        key={`cols-${columns}`}
        columnWrapperStyle={columns > 1 ? styles.columnWrapper : undefined}
        contentContainerStyle={[styles.listContent, !isWideWeb && { paddingBottom: 90 }]}
        refreshControl={
          <RefreshControl refreshing={!isLoading && isFetching} onRefresh={refetchDeliveries} tintColor={COLORS.primary} />
        }
        ListHeaderComponent={
          <View style={[styles.webContainer, isWideWeb && styles.webContainerWide]}>
            {/* Header */}
            {!isWideWeb ? (
              <View style={styles.mobileHeader}>
                <View>
                  <Text style={styles.headerTitle}>My Orders</Text>
                  <Text style={styles.headerDate}>{todayLabel}</Text>
                </View>
                <TouchableOpacity style={[styles.refreshBtn, webNoOutlineStyle]} onPress={() => refetchDeliveries()} hitSlop={8}>
                  <Ionicons name="refresh-outline" size={20} color={COLORS.ink} />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.webHeader}>
                <View>
                  <Text style={styles.headerTitle}>My Orders</Text>
                  <Text style={styles.headerDate}>{todayLabel}</Text>
                </View>
                <TouchableOpacity style={[styles.refreshBtn, webNoOutlineStyle]} onPress={() => refetchDeliveries()}>
                  <Ionicons name="refresh-outline" size={16} color={COLORS.ink} />
                  <Text style={styles.refreshBtnText}>Refresh</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Summary */}
            <View style={styles.section}>
              <View style={styles.summaryGrid}>
                {summaryItems.map((item) => (
                  <View key={item.key} style={styles.summaryGridItem}>
                    <OrderSummaryCard item={item} active={activeFilter === item.key} onPress={() => setActiveFilter(item.key)} />
                  </View>
                ))}
              </View>
            </View>

            {/* Search */}
            <View style={styles.section}>
              <View style={styles.searchBar}>
                <Ionicons name="search-outline" size={16} color={COLORS.slate} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by Order ID, customer name or phone"
                  placeholderTextColor={COLORS.slateLight}
                  value={search}
                  onChangeText={setSearch}
                />
                {search.length > 0 && (
                  <TouchableOpacity onPress={() => setSearch('')} hitSlop={8}>
                    <Ionicons name="close-circle" size={18} color={COLORS.slateLight} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Filter tabs */}
            <View style={[styles.section, { marginBottom: 4 }]}>
              <OrderFilterTabs active={activeFilter} onChange={setActiveFilter} />
            </View>
          </View>
        }
        renderItem={({ item }: { item: OrderCardData }) => (
          <View style={[styles.cardWrapper, isWideWeb && styles.cardWrapperWide]}>
            <OrderCard
              order={item}
              updating={updatingId === item.id || markingOutForDeliveryId === item.id}
              onNavigate={() => handleNavigate(item)}
              onCall={() => handleCall(item)}
              onMarkPickedUp={() => handleMarkPickedUp(item.id)}
              onStartDelivery={() => handleStartDelivery(item.id)}
              onMarkDelivered={() => handleMarkDelivered(item.id)}
              onUnableToDeliver={() => handleUnableToDeliver(item.id)}
            />
          </View>
        )}
        ListEmptyComponent={
          isLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : (
            <View style={[styles.webContainer, isWideWeb && styles.webContainerWide]}>
              <EmptyOrdersState
                message={activeFilter === 'all' ? 'No deliveries assigned yet.' : 'No orders found'}
              />
            </View>
          )
        }
      />

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
  headerDate: { fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.slate, marginTop: 2 },
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

  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  summaryGridItem: { flexGrow: 1, flexBasis: 130, maxWidth: 190 },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'web' ? 10 : 6,
  },
  searchInput: { flex: 1, fontFamily: FONT_FAMILY, fontSize: 13, color: COLORS.ink, paddingVertical: 4 },

  columnWrapper: { gap: 16, paddingHorizontal: 20 },
  cardWrapper: { paddingHorizontal: 20, marginBottom: 14 },
  cardWrapperWide: { flex: 1, paddingHorizontal: 0, marginBottom: 0 },

  loadingWrap: { paddingVertical: 60, alignItems: 'center' },

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

export default DriverOrdersScreen;