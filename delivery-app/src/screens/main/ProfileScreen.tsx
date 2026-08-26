

import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Alert,
  FlatList,
  ActivityIndicator,
  Platform,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../../context/AuthContext';
import { CartContext } from '../../context/CartContext';
import { OrderContext } from '../../context/OrderContext';

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

  const { user, logout, updateUser } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const { orders } = useContext(OrderContext);

  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);

  // ============================================================
  // COUNTS
  // ============================================================

  const orderCount = orders?.length || 0;
  const deliveredOrders = orders?.filter((o) => o.status === 'Delivered').length || 0;
  const cancelledOrders = orders?.filter((o) => o.status === 'Cancelled').length || 0;
  const totalSpent = orders?.reduce((sum, order) => {
    if (order.status !== 'Cancelled') {
      return sum + (order.total || 0);
    }
    return sum;
  }, 0) || 0;
  const itemsInCart = cartItems?.length || 0;

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
  // MENU ITEMS
  // ============================================================

  const menuItems = [
    {
      id: 1,
      icon: 'person-outline',
      label: 'Edit Profile',
      onPress: () => navigation.navigate('EditProfile'), // ✅ Navigate to EditProfile page
      color: '#fc8019',
    },
    {
      id: 2,
      icon: 'list-outline',
      label: 'Your Orders',
      onPress: () => {
        navigation.navigate('OrdersSummary');
      },
      color: '#28a745',
    },
  ];

  // ============================================================
  // RENDER MENU ITEM
  // ============================================================

  const renderMenuItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        style={styles.menuItem}
        onPress={item.onPress}
        activeOpacity={0.7}
      >
        <View style={styles.menuItemLeft}>
          <View
            style={[
              styles.menuIconContainer,
              {
                backgroundColor: item.color + '20',
              },
            ]}
          >
            <Icon name={item.icon} size={22} color={item.color} />
          </View>
          <Text style={styles.menuLabel}>{item.label}</Text>
        </View>
        <Icon name="chevron-forward" size={20} color="#ccc" />
      </TouchableOpacity>
    );
  };

  // ============================================================
  // SCREEN
  // ============================================================

  return (
    <SafeAreaView style={[styles.container, isDesktopWeb && { paddingTop: WEB_NAV_HEIGHT }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PROFILE HEADER */}
        <View style={styles.header}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@email.com'}</Text>
              {user?.phone && <Text style={styles.userPhone}>{user.phone}</Text>}
            </View>
          </View>
        </View>

        {/* MENU - ONLY EDIT PROFILE AND YOUR ORDERS */}
        <View style={styles.menuContainer}>
          <FlatList
            data={menuItems}
            renderItem={renderMenuItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
          />
        </View>

        {/* LOGOUT - EXACT FUNCTIONALITY FROM FIRST CODE (NOT CHANGED) */}
        <TouchableOpacity
          style={[
            styles.logoutButton,
            isLoggingOut && styles.logoutButtonDisabled,
          ]}
          onPress={handleLogout}
          disabled={isLoggingOut}
          activeOpacity={0.7}
        >
          {isLoggingOut ? (
            <ActivityIndicator size="small" color="#dc3545" />
          ) : (
            <Icon name="log-out-outline" size={24} color="#dc3545" />
          )}
          <Text style={styles.logoutText}>
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Text>
        </TouchableOpacity>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>QuickBite v1.0.0</Text>
          <Text style={styles.footerSub}>Order food from your favourite restaurants</Text>
        </View>
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
  header: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fc8019',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#ffffff',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#282c3f',
  },
  userEmail: {
    fontSize: 13,
    color: '#7e808c',
    marginTop: 2,
  },
  userPhone: {
    fontSize: 13,
    color: '#7e808c',
    marginTop: 2,
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f5',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuLabel: {
    fontSize: 15,
    color: '#282c3f',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ffcdd2',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  logoutButtonDisabled: {
    opacity: 0.6,
  },
  logoutText: {
    fontSize: 16,
    color: '#dc3545',
    marginLeft: 8,
    fontWeight: '500',
  },
  footer: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#93959f',
  },
  footerSub: {
    fontSize: 12,
    color: '#c0c0c0',
    marginTop: 4,
  },
});

export default ProfileScreen;
