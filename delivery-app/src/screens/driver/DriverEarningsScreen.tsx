import React, { useContext, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  FlatList,
  ActivityIndicator,
  Platform,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DriverAuthContext } from '../../context/DriverAuthContext';
import { COLORS } from '../../components/driver/DriverHomeComponents';
import { DriverWebShell, DriverShellTab } from '../../components/driver/DriverWebShell';

// ── Orval-generated hook ────────────────────────────────────────────────
import { useGetDriverEarnings } from '@workspace/api-client-react';

const FONT_FAMILY = Platform.select({
  web: '"Times New Roman", Times, serif',
  default: 'Times New Roman',
});
const webNoOutlineStyle = (Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any;
const TypedFlatList = FlatList as unknown as React.ComponentType<any>;

function showAlert(title: string, message?: string) {
  if (Platform.OS === 'web') {
    // eslint-disable-next-line no-alert
    window.alert(message ? `${title}\n\n${message}` : title);
  }
}

interface HistoryItem {
  delivery_id: number;
  order_id: number;
  customer_name: string;
  date: string | null;
  time: string | null;
  distance_km: number | null;
  amount: string;
  status: string;
}

function formatDisplayDate(iso: string | null) {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function chartDayLabel(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { weekday: 'short' });
}

// ────────────────────────────────────────────────────────────────────────
// Small dependency-free bar chart — the project doesn't already have a
// charting library wired into the driver app, so this stays a plain View
// bar chart rather than pulling in a new dependency.
// ────────────────────────────────────────────────────────────────────────
const EarningsBarChart: React.FC<{ points: { date: string; amount: string; deliveries: number }[] }> = ({ points }) => {
  const max = Math.max(1, ...points.map((p) => parseFloat(p.amount)));
  return (
    <View style={styles.chartRow}>
      {points.map((p) => {
        const heightPct = Math.max(4, (parseFloat(p.amount) / max) * 100);
        return (
          <View key={p.date} style={styles.chartBarCol}>
            <Text style={styles.chartBarValue}>{parseFloat(p.amount) > 0 ? `₹${Math.round(parseFloat(p.amount))}` : ''}</Text>
            <View style={styles.chartBarTrack}>
              <View style={[styles.chartBarFill, { height: `${heightPct}%` }]} />
            </View>
            <Text style={styles.chartBarLabel}>{chartDayLabel(p.date)}</Text>
          </View>
        );
      })}
    </View>
  );
};

const SummaryCard: React.FC<{
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  amount: string;
  sub: string;
  accent: string;
  accentBg: string;
}> = ({ icon, label, amount, sub, accent, accentBg }) => (
  <View style={styles.summaryCard}>
    <View style={[styles.summaryIconWrap, { backgroundColor: accentBg }]}>
      <Ionicons name={icon} size={18} color={accent} />
    </View>
    <Text style={styles.summaryLabel}>{label}</Text>
    <Text style={styles.summaryAmount}>₹{amount}</Text>
    <Text style={styles.summarySub}>{sub}</Text>
  </View>
);

const HistoryRow: React.FC<{ item: HistoryItem; onOpen: () => void; wide: boolean }> = ({ item, onOpen, wide }) => {
  if (wide) {
    return (
      <TouchableOpacity style={[styles.historyRowWide, webNoOutlineStyle]} activeOpacity={0.7} onPress={onOpen}>
        <Text style={[styles.historyCellOrder]}>Order #{item.order_id}</Text>
        <Text style={[styles.historyCellCustomer]}>{item.customer_name}</Text>
        <Text style={[styles.historyCellDate]}>
          {formatDisplayDate(item.date)}{item.time ? ` · ${item.time}` : ''}
        </Text>
        <Text style={[styles.historyCellDistance]}>{item.distance_km != null ? `${item.distance_km} km` : '—'}</Text>
        <Text style={[styles.historyCellAmount]}>₹{item.amount}</Text>
        <View style={styles.historyCellStatus}>
          <View style={styles.earnedPill}>
            <Text style={styles.earnedPillText}>EARNED</Text>
          </View>
        </View>
        <TouchableOpacity style={[styles.viewOrderBtn, webNoOutlineStyle]} onPress={onOpen}>
          <Text style={styles.viewOrderBtnText}>View Order</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity style={[styles.historyCardMobile, webNoOutlineStyle]} activeOpacity={0.8} onPress={onOpen}>
      <View style={styles.historyCardTop}>
        <Text style={styles.historyCardOrder}>Order #{item.order_id}</Text>
        <View style={styles.earnedPill}>
          <Text style={styles.earnedPillText}>EARNED</Text>
        </View>
      </View>
      <Text style={styles.historyCardCustomer}>{item.customer_name}</Text>
      <Text style={styles.historyCardDate}>
        {formatDisplayDate(item.date)}{item.time ? ` · ${item.time}` : ''}
      </Text>
      <View style={styles.historyCardBottom}>
        <Text style={styles.historyCardDistance}>{item.distance_km != null ? `${item.distance_km} km` : '—'}</Text>
        <Text style={styles.historyCardAmount}>₹{item.amount}</Text>
      </View>
    </TouchableOpacity>
  );
};

const EmptyEarningsState: React.FC = () => (
  <View style={styles.emptyWrap}>
    <Ionicons name="wallet-outline" size={40} color={COLORS.slateLight} />
    <Text style={styles.emptyTitle}>No earnings yet</Text>
    <Text style={styles.emptyText}>Complete your first delivery to start earning.</Text>
  </View>
);

const DriverEarningsScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { driver: authDriver } = useContext(DriverAuthContext) as any;
  const driverId = authDriver?.id;

  const { width } = useWindowDimensions();
  const isWideWeb = Platform.OS === 'web' && width >= 1000;

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetDriverEarnings(driverId, { query: { enabled: !!driverId } });

  const chartPoints = useMemo(() => data?.chart ?? [], [data]);
  const history = useMemo(() => (data?.history ?? []) as HistoryItem[], [data]);

  const handleOpenOrder = (deliveryId: number) => {
    navigation.navigate('DriverOrderDetails', { deliveryId });
  };

  const handleTabPress = (tab: DriverShellTab) => {
    if (tab.key === 'earnings') return;
    if (tab.screen) navigation.navigate(tab.screen);
    else showAlert(tab.label, 'Coming soon');
  };

  // ── Loading ──────────────────────────────────────────────────────────
  if (isLoading) {
    const loadingBody = (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
    if (isWideWeb) {
      return (
        <DriverWebShell
          activeTabKey="earnings"
          driverName={authDriver?.name}
          driverPhone={authDriver?.phone}
          isOnline={authDriver?.status === 'available'}
          onToggleOnline={() => {}}
          onTabPress={handleTabPress}
          onNotificationsPress={() => handleTabPress({ key: 'notifications', label: 'Notifications', icon: 'notifications-outline', screen: 'DriverAlerts' })}
        >
          {loadingBody}
        </DriverWebShell>
      );
    }
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
        {loadingBody}
      </SafeAreaView>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────
  if (isError || !data) {
    const errorBody = (
      <View style={styles.errorWrap}>
        <Ionicons name="alert-circle-outline" size={40} color={COLORS.danger} />
        <Text style={styles.emptyTitle}>Unable to load earnings.</Text>
        <TouchableOpacity style={[styles.retryBtn, webNoOutlineStyle]} onPress={() => refetch()}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
    if (isWideWeb) {
      return (
        <DriverWebShell
          activeTabKey="earnings"
          driverName={authDriver?.name}
          driverPhone={authDriver?.phone}
          isOnline={authDriver?.status === 'available'}
          onToggleOnline={() => {}}
          onTabPress={handleTabPress}
          onNotificationsPress={() => handleTabPress({ key: 'notifications', label: 'Notifications', icon: 'notifications-outline', screen: 'DriverAlerts' })}
        >
          {errorBody}
        </DriverWebShell>
      );
    }
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
        {errorBody}
      </SafeAreaView>
    );
  }

  const headerBlock = (
    <View>
      <View style={isWideWeb ? styles.webHeader : styles.mobileHeader}>
        <View>
          <Text style={styles.headerTitle}>Earnings</Text>
          <Text style={styles.headerSub}>Track your delivery earnings and payment history.</Text>
        </View>
        <TouchableOpacity style={[styles.refreshBtn, webNoOutlineStyle]} onPress={() => refetch()}>
          <Ionicons name="refresh-outline" size={16} color={COLORS.ink} />
          {isWideWeb && <Text style={styles.refreshBtnText}>Refresh</Text>}
        </TouchableOpacity>
      </View>

      {/* Summary cards */}
      <View style={[styles.section, styles.summaryGrid]}>
        <SummaryCard
          icon="today-outline"
          label="Today's Earnings"
          amount={data.summary.today.amount}
          sub={`${data.summary.today.deliveries} deliveries`}
          accent={COLORS.primary}
          accentBg={COLORS.primaryLight}
        />
        <SummaryCard
          icon="calendar-outline"
          label="This Week"
          amount={data.summary.week.amount}
          sub={`${data.summary.week.deliveries} deliveries`}
          accent={COLORS.secondary}
          accentBg={COLORS.secondaryLight}
        />
        <SummaryCard
          icon="stats-chart-outline"
          label="This Month"
          amount={data.summary.month.amount}
          sub={`${data.summary.month.deliveries} deliveries`}
          accent={COLORS.amber}
          accentBg={COLORS.amberLight}
        />
        <SummaryCard
          icon="time-outline"
          label="Pending Earnings"
          amount={data.summary.pending.amount}
          sub="Pending payment"
          accent={COLORS.slate}
          accentBg={COLORS.bg}
        />
      </View>

      {/* Chart */}
      <View style={[styles.section, styles.chartCard]}>
        <Text style={styles.sectionTitle}>Earnings Overview</Text>
        <Text style={styles.sectionSubtitle}>
          {data.range.from === data.range.to
            ? formatDisplayDate(data.range.from)
            : `${formatDisplayDate(data.range.from)} – ${formatDisplayDate(data.range.to)}`}
        </Text>
        {chartPoints.length === 0 ? (
          <Text style={styles.emptyText}>No earnings data for this period yet.</Text>
        ) : (
          <EarningsBarChart points={chartPoints} />
        )}
      </View>

      <View style={[styles.section, { marginBottom: 4 }]}>
        <Text style={styles.sectionTitle}>Earnings History</Text>
        {isWideWeb && history.length > 0 && (
          <View style={styles.historyHeaderRow}>
            <Text style={[styles.historyHeaderCell, styles.historyCellOrder]}>Order</Text>
            <Text style={[styles.historyHeaderCell, styles.historyCellCustomer]}>Customer</Text>
            <Text style={[styles.historyHeaderCell, styles.historyCellDate]}>Date</Text>
            <Text style={[styles.historyHeaderCell, styles.historyCellDistance]}>Distance</Text>
            <Text style={[styles.historyHeaderCell, styles.historyCellAmount]}>Earning</Text>
            <Text style={[styles.historyHeaderCell, styles.historyCellStatus]}>Status</Text>
            <Text style={[styles.historyHeaderCell, { width: 100 }]}>Action</Text>
          </View>
        )}
      </View>
    </View>
  );

  const listBody = (
    <TypedFlatList
      data={history}
      keyExtractor={(item: HistoryItem) => String(item.delivery_id)}
      contentContainerStyle={[styles.listContent, !isWideWeb && { paddingBottom: 90 }]}
      refreshControl={<RefreshControl refreshing={isFetching} onRefresh={refetch} tintColor={COLORS.primary} />}
      ListHeaderComponent={headerBlock}
      renderItem={({ item }: { item: HistoryItem }) => (
        <View style={styles.cardWrapper}>
          <HistoryRow item={item} wide={isWideWeb} onOpen={() => handleOpenOrder(item.delivery_id)} />
        </View>
      )}
      ListEmptyComponent={<EmptyEarningsState />}
    />
  );

  if (isWideWeb) {
    return (
      <DriverWebShell
        activeTabKey="earnings"
        driverName={authDriver?.name}
        driverPhone={authDriver?.phone}
        isOnline={authDriver?.status === 'available'}
        onToggleOnline={() => {}}
        onTabPress={handleTabPress}
        onNotificationsPress={() => handleTabPress({ key: 'notifications', label: 'Notifications', icon: 'notifications-outline', screen: 'DriverAlerts' })}
      >
        <View style={styles.wideListWrap}>{listBody}</View>
      </DriverWebShell>
    );
  }

  const bottomTabs: DriverShellTab[] = [
    { key: 'home', label: 'Home', icon: 'home-outline', screen: 'DriverHome' },
    { key: 'orders', label: 'Orders', icon: 'cube', screen: 'DriverOrders' },
    { key: 'earnings', label: 'Earnings', icon: 'wallet', screen: 'DriverEarnings' },
    { key: 'notifications', label: 'Alerts', icon: 'notifications-outline', screen: 'DriverAlerts' },
    { key: 'profile', label: 'Profile', icon: 'person-outline', screen: 'DriverProfile' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      {listBody}
      <View style={styles.bottomNav}>
        {bottomTabs.map((tab) => {
          const active = tab.key === 'earnings';
          return (
            <TouchableOpacity key={tab.key} style={[styles.bottomNavItem, webNoOutlineStyle]} activeOpacity={0.7} onPress={() => handleTabPress(tab)}>
              <Ionicons name={tab.icon} size={22} color={active ? COLORS.primary : COLORS.slateLight} />
              <Text style={[styles.bottomNavLabel, { color: active ? COLORS.primary : COLORS.slateLight }]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  wideListWrap: { flex: 1, width: '100%', paddingHorizontal: 24 },

  mobileHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16 },
  webHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 22 },
  headerTitle: { fontFamily: FONT_FAMILY, fontSize: 20, fontWeight: '700', color: COLORS.ink },
  headerSub: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate, marginTop: 2 },
  refreshBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    width: Platform.OS === 'web' ? undefined : 38, height: Platform.OS === 'web' ? undefined : 38,
    paddingHorizontal: Platform.OS === 'web' ? 14 : 0, paddingVertical: Platform.OS === 'web' ? 9 : 0,
    borderRadius: 10, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
  },
  refreshBtnText: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.ink },

  section: { paddingHorizontal: 20, marginTop: 18 },

  // ── Summary cards ────────────────────────────────────────────────
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  summaryCard: { flexGrow: 1, flexBasis: 150, maxWidth: 220, backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  summaryIconWrap: { width: 32, height: 32, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  summaryLabel: { fontFamily: FONT_FAMILY, fontSize: 11, color: COLORS.slate },
  summaryAmount: { fontFamily: FONT_FAMILY, fontSize: 19, fontWeight: '700', color: COLORS.ink, marginTop: 4 },
  summarySub: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slateLight, marginTop: 2 },

  // ── Chart ────────────────────────────────────────────────────────
  chartCard: { backgroundColor: COLORS.card, borderRadius: 16, borderWidth: 1, borderColor: COLORS.border, padding: 16 },
  sectionTitle: { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: '700', color: COLORS.ink },
  sectionSubtitle: { fontFamily: FONT_FAMILY, fontSize: 11.5, color: COLORS.slate, marginTop: 2, marginBottom: 14 },
  chartRow: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 140, gap: 6 },
  chartBarCol: { flex: 1, alignItems: 'center', height: '100%', justifyContent: 'flex-end' },
  chartBarValue: { fontFamily: FONT_FAMILY, fontSize: 9.5, color: COLORS.slate, marginBottom: 4 },
  chartBarTrack: { width: '60%', flex: 1, backgroundColor: COLORS.bg, borderRadius: 6, justifyContent: 'flex-end', overflow: 'hidden' },
  chartBarFill: { width: '100%', backgroundColor: COLORS.primary, borderRadius: 6 },
  chartBarLabel: { fontFamily: FONT_FAMILY, fontSize: 10, color: COLORS.slateLight, marginTop: 6 },

  // ── History: wide table ──────────────────────────────────────────
  historyHeaderRow: { flexDirection: 'row', paddingHorizontal: 4, marginTop: 12, marginBottom: 6 },
  historyHeaderCell: { fontFamily: FONT_FAMILY, fontSize: 10.5, fontWeight: '700', color: COLORS.slate, textTransform: 'uppercase', letterSpacing: 0.3 },
  historyRowWide: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 12,
    borderWidth: 1, borderColor: COLORS.border, paddingVertical: 12, paddingHorizontal: 12, gap: 8,
  },
  historyCellOrder: { flex: 1.1, fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.ink },
  historyCellCustomer: { flex: 1.3, fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.ink },
  historyCellDate: { flex: 1.4, fontFamily: FONT_FAMILY, fontSize: 11.5, color: COLORS.slate },
  historyCellDistance: { flex: 0.8, fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.ink },
  historyCellAmount: { flex: 0.8, fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '700', color: COLORS.primary },
  historyCellStatus: { flex: 0.9 },
  viewOrderBtn: { width: 100, borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingVertical: 7, alignItems: 'center' },
  viewOrderBtnText: { fontFamily: FONT_FAMILY, fontSize: 11.5, fontWeight: '700', color: COLORS.ink },

  earnedPill: { alignSelf: 'flex-start', backgroundColor: COLORS.secondaryLight, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
  earnedPillText: { fontFamily: FONT_FAMILY, fontSize: 10, fontWeight: '700', color: COLORS.secondary, letterSpacing: 0.3 },

  // ── History: mobile cards ────────────────────────────────────────
  historyCardMobile: { backgroundColor: COLORS.card, borderRadius: 14, borderWidth: 1, borderColor: COLORS.border, padding: 14 },
  historyCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyCardOrder: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '700', color: COLORS.ink },
  historyCardCustomer: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.ink, marginTop: 6 },
  historyCardDate: { fontFamily: FONT_FAMILY, fontSize: 11, color: COLORS.slate, marginTop: 2 },
  historyCardBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  historyCardDistance: { fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.slate },
  historyCardAmount: { fontFamily: FONT_FAMILY, fontSize: 15, fontWeight: '700', color: COLORS.primary },

  listContent: { flexGrow: 1, paddingBottom: 24 },
  cardWrapper: { paddingHorizontal: 20, marginTop: 10 },

  emptyWrap: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 30 },
  emptyTitle: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '700', color: COLORS.ink, marginTop: 10 },
  emptyText: { fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.slate, marginTop: 4, textAlign: 'center' },
  loadingWrap: { flex: 1, paddingVertical: 80, alignItems: 'center', justifyContent: 'center' },
  errorWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 80, paddingHorizontal: 30 },
  retryBtn: { marginTop: 14, backgroundColor: COLORS.primary, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 10 },
  retryBtnText: { fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '700', color: '#FFFFFF' },

  bottomNav: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: COLORS.card, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 8, paddingBottom: 20 },
  bottomNavItem: { flex: 1, alignItems: 'center', gap: 3 },
  bottomNavLabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, fontWeight: '600' },
});

export default DriverEarningsScreen;