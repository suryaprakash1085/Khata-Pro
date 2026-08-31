

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

// ✅ Theme color — matched to Address / Payment / Orders / Tracking screens' purple/indigo
const THEME_COLOR = '#6C5CE7';
const THEME_COLOR_DARK = '#5541D7';

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

  // ============================================================
  // LOGOUT - EXACT FUNCTIONALITY FROM FIRST CODE (NOT CHANGED)
  // ============================================================

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

  // ============================================================
  // MENU ITEMS — grouped like a real app's Account settings page
  // ============================================================

  const accountItems = [
    {
      id: 1,
      icon: 'person-outline',
      label: 'Edit Profile',
      sublabel: 'Name, email, phone number',
      onPress: () => navigation.navigate('EditProfile'),
      color: THEME_COLOR,
    },
    {
      id: 2,
      icon: 'receipt-outline',
      label: 'Your Orders',
      sublabel: 'Track, view history & receipts',
      onPress: () => navigation.navigate('OrdersSummary'),
      color: '#28a745',
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
      <View style={[styles.menuIconContainer, { backgroundColor: item.color + '18' }]}>
        <Icon name={item.icon} size={20} color={item.color} />
      </View>
      <View style={styles.menuTextGroup}>
        <Text style={styles.menuLabel}>{item.label}</Text>
        <Text style={styles.menuSublabel}>{item.sublabel}</Text>
      </View>
      <Icon name="chevron-forward" size={18} color="#c7c7cc" />
    </TouchableOpacity>
  );

  // ============================================================
  // SCREEN
  // ============================================================

  const initial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <SafeAreaView style={[styles.container, isDesktopWeb && { paddingTop: WEB_NAV_HEIGHT }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
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
              <Icon name="pencil" size={12} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.name || 'User'}</Text>

          <View style={styles.contactRow}>
            <Icon name="mail-outline" size={13} color="#8a8d99" />
            <Text style={styles.contactText}>{user?.email || 'user@email.com'}</Text>
          </View>
          {user?.phone && (
            <View style={styles.contactRow}>
              <Icon name="call-outline" size={13} color="#8a8d99" />
              <Text style={styles.contactText}>{user.phone}</Text>
            </View>
          )}
        </View>

        {/* ACCOUNT SECTION */}
        <Text style={styles.sectionLabel}>ACCOUNT</Text>
        <View style={styles.menuContainer}>
          {accountItems.map((item, idx) => renderMenuItem(item, idx === accountItems.length - 1))}
        </View>

        {/* LOGOUT SECTION */}
        <Text style={styles.sectionLabel}>SESSION</Text>
        <TouchableOpacity
          style={[styles.logoutButton, isLoggingOut && styles.logoutButtonDisabled]}
          onPress={handleLogout}
          disabled={isLoggingOut}
          activeOpacity={0.7}
        >
          <View style={styles.logoutIconContainer}>
            {isLoggingOut ? (
              <ActivityIndicator size="small" color="#dc3545" />
            ) : (
              <Icon name="log-out-outline" size={18} color="#dc3545" />
            )}
          </View>
          <Text style={styles.logoutText}>
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 40,
  },

  // Profile card
  profileCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 18,
    borderRadius: 20,
    paddingVertical: 26,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f0f0f5',
    shadowColor: THEME_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  avatarRing: {
    width: 84,
    height: 84,
    borderRadius: 42,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2.5,
    borderColor: '#EDE9FE',
  },
  avatarContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: THEME_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
  },
  avatarEditBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: THEME_COLOR_DARK,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  userName: {
    fontSize: 19,
    fontWeight: '700',
    color: '#282c3f',
    marginTop: 14,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  contactText: {
    fontSize: 13,
    color: '#8a8d99',
  },

  // Section label
  sectionLabel: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#a2a4b0',
    letterSpacing: 0.6,
    marginTop: 24,
    marginBottom: 8,
    marginHorizontal: 20,
  },

  // Menu list
  menuContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f0f0f5',
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#f4f4f8',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTextGroup: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#282c3f',
  },
  menuSublabel: {
    fontSize: 11.5,
    color: '#9a9ca8',
    marginTop: 2,
  },

  // Logout
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 13,
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FCDCDC',
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutIconContainer: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  logoutText: {
    fontSize: 14.5,
    fontWeight: '700',
    color: '#dc3545',
  },
});

export default ProfileScreen;
