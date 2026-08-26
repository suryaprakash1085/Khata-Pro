import React, { useContext, useState, useEffect } from 'react';
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
  TextInput,
  Linking,
  useWindowDimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { DriverAuthContext } from '../../context/DriverAuthContext';
import { COLORS } from '../../components/driver/DriverHomeComponents';
import { DriverWebShell, DRIVER_SHELL_TABS, type DriverShellTab } from '../../components/driver/DriverWebShell';

// ── Orval-generated hooks (same pattern as the other driver screens) ───────
import { useGetDriver, useUpdateDriver, useGetDriverStats } from '@workspace/api-client-react';

const FONT_FAMILY = Platform.select({
  web: '"Times New Roman", Times, serif',
  default: 'Times New Roman',
});
const webNoOutlineStyle = (Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any;

function initials(name?: string) {
  if (!name) return '?';
  return name.trim().split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

// Alert.alert() renders nothing on react-native-web — use window.alert there.
const notifyComingSoon = (title: string) => {
  if (Platform.OS === 'web') {
    window.alert(`${title} — Coming soon`);
  } else {
    Alert.alert(title, 'Coming soon');
  }
};

const VEHICLE_TYPES: { key: string; label: string }[] = [
  { key: 'bike', label: 'Bike' },
  { key: 'auto', label: 'Auto' },
  { key: 'van', label: 'Van' },
  { key: 'truck', label: 'Truck' },
];

const GENDERS: { key: string; label: string }[] = [
  { key: 'male', label: 'Male' },
  { key: 'female', label: 'Female' },
  { key: 'other', label: 'Other' },
];

const ACTIVE_TAB = 'profile';

type PersonalForm = {
  name: string;
  phone: string;
  email: string;
  date_of_birth: string;
  gender: string;
  address: string;
  emergency_contact_name: string;
  emergency_contact_relation: string;
  emergency_contact_phone: string;
};

type VehicleForm = {
  vehicle_type: string;
  vehicle_number: string;
};

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

  const { data: statsData } = useGetDriverStats(driverId, { query: { enabled: !!driverId } });

  const updateDriver = useUpdateDriver();

  // Prefer the freshly-fetched driver record; fall back to the auth
  // context's cached copy while the request is in flight.
  const driver: any = driverData ?? authDriver;
  const stats: any = statsData ?? {};

  const [isOnline, setIsOnline] = useState<boolean>(driver?.status === 'available');

  // Keep the toggle in sync if the fetched driver record changes underneath
  // it (e.g. after a refetch/pull-to-refresh).
  useEffect(() => {
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

  // ── Personal info — inline edit ───────────────────────────────────────
  const [editingPersonal, setEditingPersonal] = useState(false);
  const [personalForm, setPersonalForm] = useState<PersonalForm>({
    name: '', phone: '', email: '', date_of_birth: '', gender: '',
    address: '', emergency_contact_name: '', emergency_contact_relation: '', emergency_contact_phone: '',
  });

  const resetPersonalForm = () => {
    setPersonalForm({
      name: driver?.name ?? '',
      phone: driver?.phone ?? '',
      email: driver?.email ?? '',
      date_of_birth: driver?.date_of_birth ?? '',
      gender: driver?.gender ?? '',
      address: driver?.address ?? '',
      emergency_contact_name: driver?.emergency_contact_name ?? '',
      emergency_contact_relation: driver?.emergency_contact_relation ?? '',
      emergency_contact_phone: driver?.emergency_contact_phone ?? '',
    });
  };

  const startEditPersonal = () => {
    resetPersonalForm();
    setEditingPersonal(true);
  };

  const savePersonal = () => {
    if (!driverId) return;
    updateDriver.mutate(
      { id: driverId, data: { ...personalForm } },
      {
        onSuccess: () => { setEditingPersonal(false); refetchDriver(); },
        onError: () => Alert.alert('Error', 'Could not update personal information. Please try again.'),
      }
    );
  };

  // ── Vehicle info — inline edit ────────────────────────────────────────
  const [editingVehicle, setEditingVehicle] = useState(false);
  const [vehicleForm, setVehicleForm] = useState<VehicleForm>({ vehicle_type: 'bike', vehicle_number: '' });

  const startEditVehicle = () => {
    setVehicleForm({
      vehicle_type: driver?.vehicle_type ?? 'bike',
      vehicle_number: driver?.vehicle_number ?? '',
    });
    setEditingVehicle(true);
  };

  const saveVehicle = () => {
    if (!driverId) return;
    updateDriver.mutate(
      { id: driverId, data: { ...vehicleForm } },
      {
        onSuccess: () => { setEditingVehicle(false); refetchDriver(); },
        onError: () => Alert.alert('Error', 'Could not update vehicle information. Please try again.'),
      }
    );
  };

  const handleTabPress = (tab: DriverShellTab) => {
    if (tab.key === ACTIVE_TAB) return;
    if (tab.screen) {
      navigation.navigate(tab.screen);
    } else {
      notifyComingSoon(tab.label);
    }
  };

  const handleLogout = () => {
    const doLogout = () => {
      driverLogout?.();
      navigation.reset({ index: 0, routes: [{ name: 'DriverLogin' }] });
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to log out?')) {
        doLogout();
      }
    } else {
      Alert.alert('Log Out', 'Are you sure you want to log out?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: doLogout },
      ]);
    }
  };

  // "Change Password" is intentionally not offered — drivers authenticate
  // via OTP (see /drivers/login/request-otp, /drivers/login/verify-otp),
  // there is no password field on the drivers table.
  const menuItems = [
    { key: 'notifications', label: 'Notifications', icon: 'notifications-outline', onPress: () => navigation.navigate('DriverAlerts') },
    { key: 'logout', label: 'Logout', icon: 'log-out-outline', danger: true, onPress: handleLogout },
  ];

  if (isLoading && !driver) {
    return (
      <SafeAreaView style={[styles.safe, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }

  const totalDeliveries = stats.total_deliveries ?? 0;
  const completedDeliveries = stats.completed_deliveries ?? 0;
  const cancelledDeliveries = stats.cancelled_deliveries ?? 0;
  const successRate = totalDeliveries > 0 ? ((completedDeliveries / totalDeliveries) * 100).toFixed(1) : '0.0';

  const PersonalInfoCard = (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardTitle}>Personal Information</Text>
        {!editingPersonal ? (
          <TouchableOpacity style={[styles.editBtn, webNoOutlineStyle]} onPress={startEditPersonal} activeOpacity={0.7}>
            <Ionicons name="create-outline" size={14} color={COLORS.primary} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={[styles.cancelBtn, webNoOutlineStyle]} onPress={() => setEditingPersonal(false)} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.saveBtn, webNoOutlineStyle]} onPress={savePersonal} activeOpacity={0.7} disabled={updateDriver.isPending}>
              {updateDriver.isPending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveBtnText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {!editingPersonal ? (
        <>
          <InfoRow icon="person-outline" label="Full Name" value={driver?.name} />
          <InfoRow icon="call-outline" label="Mobile Number" value={driver?.phone} />
          <InfoRow icon="mail-outline" label="Email Address" value={driver?.email} />
          <InfoRow icon="calendar-outline" label="Date of Birth" value={driver?.date_of_birth} />
          <InfoRow icon="male-female-outline" label="Gender" value={driver?.gender} />
          <InfoRow icon="location-outline" label="Address" value={driver?.address} />
          <InfoRow
            icon="alert-circle-outline"
            label="Emergency Contact"
            value={
              driver?.emergency_contact_name
                ? `${driver.emergency_contact_name}${driver.emergency_contact_relation ? ` (${driver.emergency_contact_relation})` : ''}${driver.emergency_contact_phone ? ` — ${driver.emergency_contact_phone}` : ''}`
                : null
            }
            isLast
          />
        </>
      ) : (
        <View style={{ gap: 12, marginTop: 4 }}>
          <EditField label="Full Name" value={personalForm.name} onChangeText={(v) => setPersonalForm((f) => ({ ...f, name: v }))} />
          <EditField label="Mobile Number" value={personalForm.phone} onChangeText={(v) => setPersonalForm((f) => ({ ...f, phone: v }))} keyboardType="phone-pad" />
          <EditField label="Email Address" value={personalForm.email} onChangeText={(v) => setPersonalForm((f) => ({ ...f, email: v }))} keyboardType="email-address" />
          <EditField label="Date of Birth (YYYY-MM-DD)" value={personalForm.date_of_birth} onChangeText={(v) => setPersonalForm((f) => ({ ...f, date_of_birth: v }))} placeholder="1998-08-15" />

          <View>
            <Text style={styles.fieldLabel}>Gender</Text>
            <View style={styles.chipRow}>
              {GENDERS.map((g) => {
                const active = personalForm.gender === g.key;
                return (
                  <TouchableOpacity
                    key={g.key}
                    style={[styles.chip, active && styles.chipActive, webNoOutlineStyle]}
                    onPress={() => setPersonalForm((f) => ({ ...f, gender: g.key }))}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{g.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <EditField label="Address" value={personalForm.address} onChangeText={(v) => setPersonalForm((f) => ({ ...f, address: v }))} multiline />
          <EditField label="Emergency Contact Name" value={personalForm.emergency_contact_name} onChangeText={(v) => setPersonalForm((f) => ({ ...f, emergency_contact_name: v }))} />
          <EditField label="Relation" value={personalForm.emergency_contact_relation} onChangeText={(v) => setPersonalForm((f) => ({ ...f, emergency_contact_relation: v }))} placeholder="e.g. Brother" />
          <EditField label="Emergency Contact Phone" value={personalForm.emergency_contact_phone} onChangeText={(v) => setPersonalForm((f) => ({ ...f, emergency_contact_phone: v }))} keyboardType="phone-pad" />
        </View>
      )}
    </View>
  );

  const VehicleInfoCard = (
    <View style={styles.card}>
      <View style={styles.cardHeaderRow}>
        <Text style={styles.cardTitle}>Vehicle Information</Text>
        {!editingVehicle ? (
          <TouchableOpacity style={[styles.editBtn, webNoOutlineStyle]} onPress={startEditVehicle} activeOpacity={0.7}>
            <Ionicons name="create-outline" size={14} color={COLORS.primary} />
            <Text style={styles.editBtnText}>Edit</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={[styles.cancelBtn, webNoOutlineStyle]} onPress={() => setEditingVehicle(false)} activeOpacity={0.7}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.saveBtn, webNoOutlineStyle]} onPress={saveVehicle} activeOpacity={0.7} disabled={updateDriver.isPending}>
              {updateDriver.isPending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.saveBtnText}>Save</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {!editingVehicle ? (
        <>
          <InfoRow icon="construct-outline" label="Vehicle Type" value={driver?.vehicle_type} />
          <InfoRow icon="car-outline" label="Vehicle Number" value={driver?.vehicle_number} isLast />
        </>
      ) : (
        <View style={{ gap: 12, marginTop: 4 }}>
          <View>
            <Text style={styles.fieldLabel}>Vehicle Type</Text>
            <View style={styles.chipRow}>
              {VEHICLE_TYPES.map((v) => {
                const active = vehicleForm.vehicle_type === v.key;
                return (
                  <TouchableOpacity
                    key={v.key}
                    style={[styles.chip, active && styles.chipActive, webNoOutlineStyle]}
                    onPress={() => setVehicleForm((f) => ({ ...f, vehicle_type: v.key }))}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.chipText, active && styles.chipTextActive]}>{v.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
          <EditField label="Vehicle Number" value={vehicleForm.vehicle_number} onChangeText={(v) => setVehicleForm((f) => ({ ...f, vehicle_number: v }))} placeholder="TN-67-AB-1234" />
        </View>
      )}
    </View>
  );

  const PerformanceCard = (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Delivery Performance</Text>
      <View style={styles.statsGrid}>
        <StatBlock icon="cube-outline" color={COLORS.primary} label="Total Deliveries" value={String(totalDeliveries)} />
        <StatBlock icon="checkmark-circle-outline" color={COLORS.secondary} label="Completed" value={String(completedDeliveries)} />
        <StatBlock icon="close-circle-outline" color={COLORS.danger} label="Cancelled" value={String(cancelledDeliveries)} />
        <StatBlock icon="trending-up-outline" color={COLORS.primary} label="Success Rate" value={`${successRate}%`} />
        <StatBlock icon="star-outline" color="#F59E0B" label="Average Rating" value={driver?.rating != null ? String(driver.rating) : '—'} />
      </View>
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

  const ProfileHeaderCard = (
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
  );

  const PageBody = (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContent, !isWideWeb && { paddingBottom: 90 }]}
      refreshControl={
        <RefreshControl refreshing={!isLoading && isFetching} onRefresh={refetchDriver} tintColor={COLORS.primary} />
      }
    >
      <View style={[styles.webContainer, isWideWeb && styles.webContainerWide]}>
        {!isWideWeb && <Text style={styles.headerTitle}>Profile</Text>}

        {ProfileHeaderCard}

        {isWideWeb ? (
          <View style={styles.twoColRow}>
            <View style={styles.twoColLeft}>
              {PersonalInfoCard}
              <View style={{ height: 16 }} />
              {VehicleInfoCard}
            </View>
            <View style={styles.twoColRight}>
              {PerformanceCard}
              <View style={{ height: 16 }} />
              {AccountOptionsCard}
            </View>
          </View>
        ) : (
          <>
            {PersonalInfoCard}
            {VehicleInfoCard}
            {PerformanceCard}
            {AccountOptionsCard}
          </>
        )}
      </View>
    </ScrollView>
  );

  // ── Wide web: reuse the shared dark-sidebar shell (same as Home / Orders / Alerts) ──
  if (isWideWeb) {
    return (
      <DriverWebShell
        activeTabKey={ACTIVE_TAB}
        driverName={driver?.name}
        driverPhone={driver?.phone}
        isOnline={isOnline}
        onToggleOnline={handleToggleOnline}
        notificationsCount={0}
        greetingTitle="My Profile"
        greetingSubtitle="Manage your personal information and driver account."
        onTabPress={handleTabPress}
        onNotificationsPress={() => navigation.navigate('DriverAlerts')}
        onHelpPress={() => driver?.phone && Linking.openURL(`tel:${driver.phone}`)}
      >
        {PageBody}
      </DriverWebShell>
    );
  }

  // ── Mobile: plain screen + bottom tab bar ───────────────────────────────
  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.bg} />
      {PageBody}
      <View style={styles.bottomNav}>
        {DRIVER_SHELL_TABS.map((tab) => {
          const active = tab.key === ACTIVE_TAB;
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

// ── Small local edit field for the inline-edit forms ───────────────────────
const EditField: React.FC<{
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'phone-pad' | 'email-address';
  multiline?: boolean;
}> = ({ label, value, onChangeText, placeholder, keyboardType = 'default', multiline }) => (
  <View>
    <Text style={styles.fieldLabel}>{label}</Text>
    <TextInput
      style={[styles.textInput, multiline && { height: 72, textAlignVertical: 'top' }, webNoOutlineStyle]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={COLORS.slateLight}
      keyboardType={keyboardType}
      multiline={multiline}
    />
  </View>
);

// ── Small local stat block for the Delivery Performance card ───────────────
const StatBlock: React.FC<{ icon: string; color: string; label: string; value: string }> = ({ icon, color, label, value }) => (
  <View style={styles.statBlock}>
    <View style={[styles.statIconWrap, { backgroundColor: `${color}1A` }]}>
      <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={18} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scrollContent: { flexGrow: 1 },

  webContainer: { width: '100%' },
  webContainerWide: { width: '100%', paddingHorizontal: 32, paddingTop: 4 },

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
  cardHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  cardTitle: { fontFamily: FONT_FAMILY, fontSize: 14, fontWeight: '700', color: COLORS.ink, marginBottom: 6 },

  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: COLORS.primary },
  editBtnText: { fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '600', color: COLORS.primary },
  cancelBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1, borderColor: COLORS.border },
  cancelBtnText: { fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '600', color: COLORS.slate },
  saveBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: COLORS.primary, minWidth: 56, alignItems: 'center' },
  saveBtnText: { fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '700', color: '#FFFFFF' },

  fieldLabel: { fontFamily: FONT_FAMILY, fontSize: 11.5, fontWeight: '600', color: COLORS.slate, marginBottom: 6 },
  textInput: {
    fontFamily: FONT_FAMILY,
    fontSize: 13.5,
    color: COLORS.ink,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.bg,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bg },
  chipActive: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  chipText: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '600', color: COLORS.slate },
  chipTextActive: { color: COLORS.primaryDark },

  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  infoIconWrap: { width: 32, height: 32, borderRadius: 10, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  infoLabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slateLight },
  infoValue: { fontFamily: FONT_FAMILY, fontSize: 13.5, fontWeight: '600', color: COLORS.ink, marginTop: 1 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
  statBlock: { width: '31%', alignItems: 'flex-start', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 12, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.bg },
  statIconWrap: { width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  statValue: { fontFamily: FONT_FAMILY, fontSize: 16, fontWeight: '700', color: COLORS.ink },
  statLabel: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slateLight, marginTop: 2 },

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