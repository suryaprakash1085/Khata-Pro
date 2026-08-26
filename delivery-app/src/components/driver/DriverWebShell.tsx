import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from './DriverHomeComponents';

const FONT_FAMILY = Platform.select({
  web: '"Times New Roman", Times, serif',
  default: 'Times New Roman',
});

const webNoOutlineStyle = (Platform.OS === 'web' ? { outlineStyle: 'none' } : {}) as any;

// Local colors not yet in the shared COLORS palette — mirrors DriverHomeScreen.
const SIDEBAR = {
  bg: '#0B1220',
  bgActive: '#16A34A',
  text: '#CBD5E1',
  textMuted: '#64748B',
  border: '#1E293B',
};

export interface DriverShellTab {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  screen?: string;
}

export const DRIVER_SHELL_TABS: DriverShellTab[] = [
  { key: 'home', label: 'Home', icon: 'home', screen: 'DriverHome' },
  { key: 'orders', label: 'Orders', icon: 'cube-outline', screen: 'DriverOrders' },
  { key: 'earnings', label: 'Earnings', icon: 'wallet-outline', screen: 'DriverEarnings' },
  { key: 'notifications', label: 'Notifications', icon: 'notifications-outline', screen: 'DriverAlerts' },
  { key: 'profile', label: 'Profile', icon: 'person-outline', screen: 'DriverProfile' },
];

function initials(name?: string) {
  if (!name) return '?';
  return name.trim().split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

interface Props {
  activeTabKey: string;
  driverName?: string;
  driverPhone?: string;
  isOnline: boolean;
  onToggleOnline: (value: boolean) => void;
  notificationsCount?: number;
  greetingTitle?: string;
  greetingSubtitle?: string;
  onTabPress: (tab: DriverShellTab) => void;
  onNotificationsPress: () => void;
  onProfilePress?: () => void;
  onHelpPress?: () => void;
  children: React.ReactNode;
}

/**
 * Persistent dark sidebar + top bar for wide-web driver screens.
 * Extracted from DriverHomeScreen so Home / Orders / Order Details all
 * share one implementation instead of three copies.
 */
export const DriverWebShell: React.FC<Props> = ({
  activeTabKey,
  driverName,
  driverPhone,
  isOnline,
  onToggleOnline,
  notificationsCount = 0,
  greetingTitle,
  greetingSubtitle = 'Stay safe and deliver happiness.',
  onTabPress,
  onNotificationsPress,
  onProfilePress,
  onHelpPress,
  children,
}) => {
  const greeting = React.useMemo(() => {
    if (greetingTitle) return greetingTitle;
    const hour = new Date().getHours();
    const period = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening';
    return `Good ${period}, ${driverName?.split(' ')[0] ?? 'Driver'}!`;
  }, [greetingTitle, driverName]);

  return (
    <View style={styles.webShell}>
      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <View style={styles.sidebar}>
        <View>
          <View style={styles.sidebarBrandRow}>
            <View style={styles.sidebarLogo}>
              <Ionicons name="bicycle" size={18} color="#FFFFFF" />
            </View>
            <Text style={styles.sidebarBrand}>Khata-Pro{'\n'}Drivers</Text>
          </View>

          <View style={{ marginTop: 8 }}>
            {DRIVER_SHELL_TABS.map((tab) => {
              const active = tab.key === activeTabKey;
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.sidebarItem, active && styles.sidebarItemActive, webNoOutlineStyle]}
                  onPress={() => onTabPress(tab)}
                >
                  <Ionicons name={tab.icon} size={18} color={active ? '#FFFFFF' : SIDEBAR.text} />
                  <Text style={[styles.sidebarItemText, active && { color: '#FFFFFF', fontWeight: '700' }]}>
                    {tab.label}
                  </Text>
                  {tab.key === 'notifications' && notificationsCount > 0 && (
                    <View style={styles.sidebarBadge}>
                      <Text style={styles.sidebarBadgeText}>{Math.min(notificationsCount, 9)}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.sidebarBottom}>
          <View style={styles.sidebarStatusCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={[styles.onlineDot, { backgroundColor: isOnline ? COLORS.secondary : SIDEBAR.textMuted }]} />
              <Text style={styles.sidebarStatusTitle}>{isOnline ? 'Online' : 'Offline'}</Text>
            </View>
            <Text style={styles.sidebarStatusSub}>
              {isOnline ? 'You are available for new deliveries' : 'You will not receive new deliveries'}
            </Text>
            <TouchableOpacity style={[styles.sidebarToggleBtn, webNoOutlineStyle]} onPress={() => onToggleOnline(!isOnline)}>
              <Ionicons name={isOnline ? 'power' : 'power-outline'} size={14} color={isOnline ? '#FCA5A5' : COLORS.secondary} />
              <Text style={[styles.sidebarToggleBtnText, { color: isOnline ? '#FCA5A5' : COLORS.secondary }]}>
                {isOnline ? 'Go Offline' : 'Go Online'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={[styles.sidebarHelp, webNoOutlineStyle]} onPress={onHelpPress} disabled={!onHelpPress}>
            <Ionicons name="headset-outline" size={16} color={SIDEBAR.text} />
            <View>
              <Text style={styles.sidebarHelpTitle}>Need Help?</Text>
              <Text style={styles.sidebarHelpSub}>{driverPhone ?? 'Contact support'}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Main column ─────────────────────────────────────────────── */}
      <View style={styles.webMain}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.greetingText}>{greeting} </Text>
            <Text style={styles.greetingSub}>{greetingSubtitle}</Text>
          </View>

          <View style={styles.headerRight}>
            <View style={styles.onlinePill}>
              <View style={[styles.onlineDot, { backgroundColor: isOnline ? COLORS.secondary : COLORS.slateLight }]} />
              <Text style={styles.onlinePillText}>{isOnline ? 'Online' : 'Offline'}</Text>
              <Switch
                value={isOnline}
                onValueChange={onToggleOnline}
                trackColor={{ false: '#D1D5DB', true: COLORS.secondary }}
                thumbColor="#FFFFFF"
                style={{ transform: [{ scaleX: 0.75 }, { scaleY: 0.75 }], marginLeft: 4 }}
              />
            </View>

            <TouchableOpacity style={[styles.iconBtn, webNoOutlineStyle]} hitSlop={8} onPress={onNotificationsPress}>
              <Ionicons name="notifications-outline" size={20} color={COLORS.ink} />
              {notificationsCount > 0 && (
                <View style={styles.notifBadge}>
                  <Text style={styles.notifBadgeText}>{Math.min(notificationsCount, 9)}</Text>
                </View>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={[styles.profileChip, webNoOutlineStyle]} onPress={onProfilePress} disabled={!onProfilePress}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{initials(driverName)}</Text>
              </View>
              <View>
                <Text style={styles.profileName}>{driverName ?? 'Driver'}</Text>
                <Text style={styles.profileRole}>Driver</Text>
              </View>
              <Ionicons name="chevron-down" size={14} color={COLORS.slate} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Page content */}
        <View style={styles.content}>{children}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  webShell: { flex: 1, flexDirection: 'row', ...(Platform.OS === 'web' ? ({ height: '100%', overflow: 'hidden' } as any) : null) },

  sidebar: { width: 220, backgroundColor: SIDEBAR.bg, paddingVertical: 14, paddingHorizontal: 14, justifyContent: 'space-between' },
  sidebarBrandRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 6, marginBottom: 14 },
  sidebarLogo: { width: 32, height: 32, borderRadius: 10, backgroundColor: COLORS.secondary, alignItems: 'center', justifyContent: 'center' },
  sidebarBrand: { fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '700', color: '#FFFFFF', lineHeight: 16 },
  sidebarItem: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 11, borderRadius: 10, marginBottom: 2 },
  sidebarItemActive: { backgroundColor: SIDEBAR.bgActive },
  sidebarItemText: { fontFamily: FONT_FAMILY, fontSize: 13.5, color: SIDEBAR.text, flex: 1 },
  sidebarBadge: { minWidth: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.danger, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  sidebarBadgeText: { fontFamily: FONT_FAMILY, fontSize: 10, fontWeight: '700', color: '#FFFFFF' },
  sidebarBottom: { gap: 12 },
  sidebarStatusCard: { backgroundColor: '#111C33', borderRadius: 14, padding: 12 },
  sidebarStatusTitle: { fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  sidebarStatusSub: { fontFamily: FONT_FAMILY, fontSize: 11, color: SIDEBAR.textMuted, marginTop: 4, lineHeight: 15 },
  sidebarToggleBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, borderWidth: 1, borderColor: SIDEBAR.border, borderRadius: 10, paddingVertical: 8, justifyContent: 'center' },
  sidebarToggleBtnText: { fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '700' },
  sidebarHelp: { flexDirection: 'row', alignItems: 'center', gap: 10, borderTopWidth: 1, borderTopColor: SIDEBAR.border, paddingTop: 14, paddingHorizontal: 2 },
  sidebarHelpTitle: { fontFamily: FONT_FAMILY, fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  sidebarHelpSub: { fontFamily: FONT_FAMILY, fontSize: 11, color: SIDEBAR.textMuted, marginTop: 1 },

  webMain: { flex: 1, backgroundColor: COLORS.bg, ...(Platform.OS === 'web' ? ({ height: '100%', overflow: 'hidden' } as any) : null) },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    paddingVertical: 18,
    backgroundColor: COLORS.card,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  greetingText: { fontFamily: FONT_FAMILY, fontSize: 19, fontWeight: '700', color: COLORS.ink },
  greetingSub: { fontFamily: FONT_FAMILY, fontSize: 12.5, color: COLORS.slate, marginTop: 2 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },

  onlinePill: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.secondaryLight, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  onlineDot: { width: 8, height: 8, borderRadius: 4 },
  onlinePillText: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.secondary },

  iconBtn: { width: 38, height: 38, borderRadius: 12, backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border, alignItems: 'center', justifyContent: 'center' },
  notifBadge: { position: 'absolute', top: -4, right: -4, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.danger, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 },
  notifBadgeText: { fontFamily: FONT_FAMILY, fontSize: 9, fontWeight: '700', color: '#FFFFFF' },

  profileChip: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 6 },
  avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: COLORS.primaryLight, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: FONT_FAMILY, fontSize: 13, fontWeight: '700', color: COLORS.primaryDark },
  profileName: { fontFamily: FONT_FAMILY, fontSize: 12.5, fontWeight: '700', color: COLORS.ink },
  profileRole: { fontFamily: FONT_FAMILY, fontSize: 10.5, color: COLORS.slate },

  content: { flex: 1, ...(Platform.OS === 'web' ? ({ overflowY: 'auto' } as any) : null) },
});

export default DriverWebShell;