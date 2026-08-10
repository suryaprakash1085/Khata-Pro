import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Switch,
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

// ── Orval-generated hooks (same pattern as the other driver screens) ───────
import { useGetDriver, useUpdateDriver } from '@workspace/api-client-react';

const FONT_FAMILY = Platform.select({
  web: '"Times New Roman", Times, serif',
  default: 'Times New Roman',
});
const webNoOutlineStyle = (Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any;

function initials(name?: string) {
  if (!name) return '?';
  return name.trim().split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

// Only tabs that already have a registered screen navigate for real —
// same convention as Home / Orders / Route / Alerts screens.
const bottomTabs: { key: string; label: string; icon: string; screen?: string }[] = [
  { key: 'home', label: 'Home', icon: 'home-outline', screen: 'DriverHome' },
  { key: 'orders', label: 'Orders', icon: 'receipt-outline', screen: 'DriverOrders' },
  { key: 'route', label: 'Route', icon: 'map-outline', screen: 'DriverRoute' },
  { key: 'notifications', label: 'Alerts', icon: 'notifications-outline', screen: 'DriverAlerts' },
  { key: 'profile', label: 'Profile', icon: 'person', screen: 'DriverProfile' },
];
const ACTIVE_TAB = 'profile';

const DriverProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { driver: authDriver, driverLogout } = useContext(DriverAuthContext) as any;
  const driverId = authDriver?.id;

  const { width } = useWindowDimensions();
  const isWideWeb = Platform.OS === 'web' && width >= 900;

  const {
    data: driverData,
    isLoading,
    isFetching,
    refetch: refetchDriver,
  } = useGetDriver(driverId, { query: { enabled: !!driverId } });

  const updateDriver = useUpdateDriver();

  // Prefer the freshly-fetched driver record; fall back to the auth
  // context's cached copy while the request is in flight.
  const driver: any = driverData ?? authDriver;

  const [isOnline, setIsOnline] = useState<boolean>(driver?.status === 'available');

  // Keep the toggle in sync if the fetched driver record changes underneath
  // it (e.g. after a refetch/pull-to-refresh).
  React.useEffect(() => {
    if (driver?.status) setIsOnline(driver.status === 'available');
  }, [driver?.status]);

  const handleToggleOnline = (value: boolean) => {
    setIsOnline(value);
    if (!driverId) return;
    updateDriver.mutate(
      { id: driverId, data: { status: value ? 'available' : 'offline' } },
      { onError: () => setIsOnline(!value) }
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

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => driverLogout?.() },
    ]);
  };

  const menuItems = [
    { key: 'settings', label: 'Settings', icon: 'settings-outline', onPress: () => Alert.alert('Settings', 'Coming soon') },
    { key: 'notifications', label: 'Notifications', icon: 'notifications-outline', onPress: () => navigation.navigate('DriverAlerts') },
    { key: 'password', label: 'Change Password', icon: 'lock-closed-outline', onPress: () => Alert.alert('Change Password', 'Coming soon') },
    { key: 'logout', label: 'Logout', icon: 'log-out-outline', danger: true, onPress: handleLogout },
  ];

  if (isLoading && !driver) {
    return (
      <SafeAreaView style={[styles.safe, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  const PersonalInfoCard = (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Personal Information</Text>
      <InfoRow icon="person-outline" label="Name" value={driver?.name} />
      <InfoRow icon="call-outline" label="Phone" value={driver?.phone} />
      <InfoRow icon="mail-outline" label="Email" value={driver?.email} isLast />
    </View>
  );

  const VehicleInfoCard = (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Vehicle Information</Text>
      <InfoRow icon="car-outline" label="Vehicle Number" value={driver?.vehicle_number} />
      <InfoRow icon="construct-outline" label="Vehicle Type" value={driver?.vehicle_type} isLast />
    </View>
  );

  const AccountOptionsCard = (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Account</Text>
      {menuItems.map((item, idx) => (
        <TouchableOpacity
          key={item.key}
          style={[styles.menuRow, idx === menuItems.length - 1 && { borderBottomWidth: 0 }, webNoOutlineStyle]}
          onPress={item.onPress}
          activeOpacity={0.7}
        >
          <View style={[styles.menuIconWrap, item.danger && { backgroundColor: COLORS.dangerLight }]}>
            <Ionicons
              name={item.icon as keyof typeof Ionicons.glyphMap}
              size={17}
              color={item.danger ? COLORS.danger : COLORS.primary}
            />
          </View>
          <Text style={[styles.menuLabel, item.danger && { color: COLORS.danger }]}>{item.label}</Text>
          {!item.danger && <Ionicons name="chevron-forward" size={16} color={COLORS.slateLight} />}
        </TouchableOpacity>
      ))}
    </View>
  );

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
          <RefreshControl refreshing={!isLoading && isFetching} onRefresh={refetchDriver} tintColor={COLORS.primary} />
        }
      >
        <View style={[styles.webContainer, isWideWeb && styles.webContainerWide]}>
          {!isWideWeb && <Text style={styles.headerTitle}>Profile</Text>}

          {/* Profile header */}
          <View style={styles.profileHeaderCard}>
            <View style={styles.avatarWrap}>
              <Text style={styles.avatarText}>{initials(driver?.name)}</Text>
              <View style={[styles.statusDot, { backgroundColor: isOnline ? COLORS.secondary : COLORS.slateLight }]} />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.driverName}>{driver?.name ?? 'Driver'}</Text>
              <Text style={styles.driverIdText}>ID: DRV-{driver?.id ?? '—'}</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusPillDot, { backgroundColor: isOnline ? COLORS.secondary : COLORS.slateLight }]} />
                <Text style={styles.statusText}>{isOnline ? 'Online' : 'Offline'}</Text>
              </View>
            </View>
            <Switch
              value={isOnline}
              onValueChange={handleToggleOnline}
              trackColor={{ false: '#D1D5DB', true: COLORS.secondary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {isWideWeb ? (
            <View style={styles.twoColRow}>
              <View style={styles.twoColLeft}>
                {PersonalInfoCard}
                <View style={{ height: 16 }} />
                {VehicleInfoCard}
              </View>
              <View style={styles.twoColRight}>{AccountOptionsCard}</View>
            </View>
          ) : (
            <>
              {PersonalInfoCard}
              {VehicleInfoCard}
              {AccountOptionsCard}
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

// ── Small local row component for Personal / Vehicle info cards ───────────
const InfoRow: React.FC<{ icon: string; label: string; value?: string | null; isLast?: boolean }> = ({
  icon,
  label,
  value,
  isLast,
}) => (
  <View style={[styles.infoRow, isLast && { borderBottomWidth: 0 }]}>
    <View style={styles.infoIconWrap}>
      <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={16} color={COLORS.primary} />
    </View>
    <View style={{ flex: 1, marginLeft: 12 }}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value && value.length > 0 ? value : '—'}</Text>
    </View>
  </View>
);

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

  headerTitle: { fontFamily: FONT_FAMILY, fontSize: 19, fontWeight: '700', color: COLORS.ink, paddingHorizontal: 20, paddingTop: 16, marginBottom: 4 },

  profileHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
  },
  avatarWrap: { width: 56, height: 56, borderRadius: 28, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: FONT_FAMILY, fontSize: 19, fontWeight: '700', color: COLORS.primaryDark },
  statusDot: { position: 'absolute', bottom: 1, right: 1, width: 13, height: 13, borderRadius: 6.5, borderWidth: 2, borderColor: COLORS.card },
  driverName: { fontFamily: FONT_FAMILY, fontSize: 16, fontWeight: '700', color: COLORS.ink },
  driverIdText: { fontFamily: FONT_FAMILY, fontSize: 12, color: COLORS.slate, marginTop: 2 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  statusPillDot: { width: 7, height: 7, borderRadius: 3.5 },
  statusText: { fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '600', color: COLORS.slate },

  twoColRow: { flexDirection: 'row', gap: 20, alignItems: 'flex-start', paddingHorizontal: 20, marginTop: 20 },
  twoColLeft: { flex: 1 },
  twoColRight: { flex: 1 },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
  },
  cardTitle: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '700', color: COLORS.ink, marginBottom: 6 },

  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoIconWrap: { width: 32, height: 32, borderRadius: 10, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slateLight },
  infoValue: { fontFamily: FONT_FAMILY, fontSize: 13.5, fontWeight: '600', color: COLORS.ink, marginTop: 1 },

  menuRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  menuIconWrap: { width: 32, height: 32, borderRadius: 10, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { flex: 1, fontFamily: FONT_FAMILY, fontSize: 13.5, fontWeight: '600', color: COLORS.ink, marginLeft: 12 },

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

export default DriverProfileScreen;