import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { OrderContext } from '../../context/OrderContext';

// ✅ KhataPro Delivery brand palette
const COLORS = {
  primary: '#6C5CE7',
  primaryDark: '#5541D7',
  lightPurple: '#F1EEFF',
  softPurple: '#EDE9FE',
  accent: '#8B7CF6',
  success: '#22C55E',
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  dangerBorder: '#FCDCDC',
  textMain: '#1E1B2E',
  textSecondary: '#8A85A0',
  border: '#EFEDF7',
  background: '#FAFAFD',
  white: '#FFFFFF',
};

const FONT_FAMILY = 'Times New Roman';

// ✅ Same constants as AppNavigator's WebTopNavBar — kept in sync so this
// screen always clears the fixed top navbar on desktop web, no matter
// what padding the navigator itself does or doesn't apply.
const WEB_NAV_HEIGHT = 64;
const DESKTOP_BREAKPOINT = 768;

interface ProfileScreenProps {
  navigation: any;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ navigation }) => {
  const { width: windowWidth } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && windowWidth >= DESKTOP_BREAKPOINT;

  const { user, logout } = useContext(AuthContext);

  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  const resetToLogin = () => {
    let nav = navigation;

    while (nav) {
      const state = nav.getState?.();
      const hasLogin = state?.routeNames?.includes('Login');

      if (hasLogin) {
        nav.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
        return true;
      }

      nav = nav.getParent?.();
    }

    return false;
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      await logout();

      const didReset = resetToLogin();

      if (!didReset) {
        console.warn(
          "⚠️ No 'Login' route found in any parent navigator. " +
          'Check the route name registered in your AuthNavigator, ' +
          'or confirm AppNavigator switches to it automatically when ' +
          '`user` becomes null.'
        );
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('❌ Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const accountItems = [
    {
      id: 1,
      icon: 'person-outline',
      label: 'Edit Profile',
      sublabel: 'Name, email, phone number',
      onPress: () => navigation.navigate('EditProfile'),
      color: COLORS.primary,
      iconBg: COLORS.softPurple,
    },
    {
      id: 2,
      icon: 'receipt-outline',
      label: 'Your Orders',
      sublabel: 'Track, view history & receipts',
      onPress: () => navigation.navigate('OrdersSummary'),
      color: COLORS.success,
      iconBg: '#DCFCE7',
    },
  ];

  // ============================================================
  // RENDER MENU ROW
  // ============================================================

  const renderMenuItem = (item: (typeof accountItems)[number], isLast: boolean) => (
    <TouchableOpacity
      key={item.id}
      style={[styles.menuItem, isLast && styles.menuItemLast]}
      onPress={item.onPress}
      activeOpacity={0.6}
    >
      <View style={[styles.menuIconContainer, { backgroundColor: item.iconBg }]}>
        <Icon name={item.icon} size={20} color={item.color} />
      </View>
      <View style={styles.menuTextGroup}>
        <Text style={styles.menuLabel}>{item.label}</Text>
        <Text style={styles.menuSublabel}>{item.sublabel}</Text>
      </View>
      <Icon name="chevron-forward" size={18} color={COLORS.textSecondary} />
    </TouchableOpacity>
  );

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  // ============================================================
  // PROFILE HERO CARD (shared between mobile & desktop)
  // ============================================================

  const renderProfileHero = () => (
    <View style={[styles.profileCard, isDesktopWeb && styles.profileCardDesktop]}>
      {/* subtle decorative purple glow shapes */}
      <View style={styles.decorShapeTopRight} pointerEvents="none" />
      <View style={styles.decorShapeBottomLeft} pointerEvents="none" />

      <View style={styles.avatarRing}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <TouchableOpacity
          style={styles.avatarEditBadge}
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.8}
          hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
        >
          <Icon name="pencil" size={12} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <Text style={styles.userName}>{user?.name || 'User'}</Text>

      <View style={styles.contactRow}>
        <Icon name="mail-outline" size={14} color={COLORS.textSecondary} />
        <Text style={styles.contactText}>{user?.email || 'user@email.com'}</Text>
      </View>
      {user?.phone ? (
        <View style={styles.contactRow}>
          <Icon name="call-outline" size={14} color={COLORS.textSecondary} />
          <Text style={styles.contactText}>{user.phone}</Text>
        </View>
      ) : null}
    </View>
  );

  // ============================================================
  // ACCOUNT + SESSION SECTIONS (shared)
  // ============================================================

  const renderAccountAndSession = () => (
    <>
      <Text style={styles.sectionLabel}>ACCOUNT</Text>
      <View style={[styles.menuContainer, isDesktopWeb && styles.menuContainerDesktop]}>
        {accountItems.map((item, idx) => renderMenuItem(item, idx === accountItems.length - 1))}
      </View>

      <Text style={styles.sectionLabel}>SESSION</Text>
      <TouchableOpacity
        style={[
          styles.logoutButton,
          isDesktopWeb && styles.logoutButtonDesktop,
          isLoggingOut && styles.logoutButtonDisabled,
        ]}
        onPress={handleLogout}
        disabled={isLoggingOut}
        activeOpacity={0.7}
      >
        <View style={styles.logoutIconContainer}>
          {isLoggingOut ? (
            <ActivityIndicator size="small" color={COLORS.danger} />
          ) : (
            <Icon name="log-out-outline" size={18} color={COLORS.danger} />
          )}
        </View>
        <Text style={styles.logoutText}>
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </Text>
        {!isLoggingOut && (
          <Icon name="chevron-forward" size={16} color={COLORS.danger} style={{ marginLeft: 'auto' }} />
        )}
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      {/* TOP HEADER (mobile only — desktop web uses the app's sidebar/navbar) */}
      {!isDesktopWeb && (
        <View style={styles.header}>
          {navigation?.canGoBack?.() ? (
            <TouchableOpacity
              style={styles.headerBackButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Icon name="chevron-back" size={24} color={COLORS.textMain} />
            </TouchableOpacity>
          ) : (
            <View style={styles.headerBackButtonPlaceholder} />
          )}
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={styles.headerBackButtonPlaceholder} />
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          isDesktopWeb && { paddingTop: WEB_NAV_HEIGHT + 24 },
        ]}
      >
        {isDesktopWeb ? (
          <View style={styles.desktopContentWrap}>
            <Text style={styles.desktopPageTitle}>Profile</Text>
            {renderProfileHero()}
            {renderAccountAndSession()}
          </View>
        ) : (
          <>
            {renderProfileHero()}
            {renderAccountAndSession()}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Mobile header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerBackButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBackButtonPlaceholder: {
    width: 36,
    height: 36,
  },
  headerTitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 19,
    fontWeight: '700',
    color: COLORS.textMain,
  },

  // Desktop content wrapper
  desktopContentWrap: {
    width: '100%',
    maxWidth: 1080,
    alignSelf: 'center',
    paddingHorizontal: 24,
  },
  desktopPageTitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.textMain,
    marginBottom: 20,
  },

  // Profile hero card
  profileCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightPurple,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  profileCardDesktop: {
    marginHorizontal: 0,
    marginTop: 0,
    paddingVertical: 44,
  },
  decorShapeTopRight: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.lightPurple,
    opacity: 0.6,
  },
  decorShapeBottomLeft: {
    position: 'absolute',
    bottom: -50,
    left: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.softPurple,
    opacity: 0.4,
  },
  avatarRing: {
    width: 92,
    height: 92,
    borderRadius: 46,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: COLORS.softPurple,
    backgroundColor: COLORS.white,
  },
  avatarContainer: {
    width: 78,
    height: 78,
    borderRadius: 39,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontFamily: FONT_FAMILY,
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.white,
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  userName: {
    fontFamily: FONT_FAMILY,
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.textMain,
    marginTop: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 6,
  },
  contactText: {
    fontFamily: FONT_FAMILY,
    fontSize: 14,
    color: COLORS.textSecondary,
  },

  // Section label
  sectionLabel: {
    fontFamily: FONT_FAMILY,
    fontSize: 12.5,
    fontWeight: '700',
    color: COLORS.textSecondary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 26,
    marginBottom: 10,
    marginHorizontal: 20,
  },

  // Menu list
  menuContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  menuContainerDesktop: {
    marginHorizontal: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuTextGroup: {
    flex: 1,
  },
  menuLabel: {
    fontFamily: FONT_FAMILY,
    fontSize: 15.5,
    fontWeight: '700',
    color: COLORS.textMain,
  },
  menuSublabel: {
    fontFamily: FONT_FAMILY,
    fontSize: 12.5,
    color: COLORS.textSecondary,
    marginTop: 3,
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 18,
    paddingVertical: 16,
    backgroundColor: COLORS.dangerBg,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.dangerBorder,
  },
  logoutButtonDesktop: {
    marginHorizontal: 0,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutIconContainer: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  logoutText: {
    fontFamily: FONT_FAMILY,
    fontSize: 15.5,
    fontWeight: '700',
    color: COLORS.danger,
  },
});

export default ProfileScreen;