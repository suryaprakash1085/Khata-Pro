import React, { useContext } from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/colors';
const scooterLogo = require('../../assets/images/scooter-logo.png');

import { AuthContext } from '../context/AuthContext';
import { DriverAuthContext } from '../context/DriverAuthContext';
import AuthNavigator from './AuthNavigator';
import DriverMainNavigator from './DriverMainNavigator';

// Main (customer) screens
import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
// import SearchScreen from '../screens/main/SearchScreen';
import CartScreen from '../screens/main/CartScreen';
import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';
import OrdersScreen from '../screens/main/OrdersScreen';
import OrderTrackingScreen from '../screens/order/OrderTrackingScreen';
import OrderSuccessScreen from '../screens/order/OrderSuccessScreen';
import AddressSelectionScreen from '../screens/checkout/AddressSelectionScreen';
import PaymentScreen from '../screens/checkout/PaymentScreen';

import ProductListScreen from '../screens/main/ProductListScreen';
import OrdersSummary from '../screens/main/OrdersSummary';
import EditProfileScreen from '../screens/main/EditProfileScreen';

import NotificationsScreen from '../screens/main/NotificationsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ============================================================
// 🎨 PURPLE THEME — local, so the sidebar's look doesn't depend
// on whatever colors.ts happens to define (same pattern used in
// HomeScreen.tsx / CartScreen.tsx / OrdersScreen.tsx).
// ============================================================
const PURPLE = {
  primary: '#6C5CE7',
  primaryLight: '#F1EEFF',
  text: '#1E1B2E',
  subtext: '#8A85A0',
  border: '#EFEDF7',
  white: '#FFFFFF',
};

const FONT_FAMILY = Platform.select({
  web: '"Times New Roman", Times, serif',
  ios: 'Times New Roman',
  android: 'serif',
  default: 'Times New Roman',
});

// ✅ Width of the web left sidebar — used both by the sidebar itself and
// by the screen content padding so content never sits underneath it.
const SIDEBAR_WIDTH = 240;

const DESKTOP_BREAKPOINT = 768;

const linking: LinkingOptions<any> = {
  prefixes: [],
  config: {
    screens: {
      Login: '',
      Signup: 'signup',
      ForgotPassword: 'forgot-password',
      StaffLogin: 'staff-login',
      StaffOtp: 'staff-otp',
      DriverHome: 'driver-home',
      Tabs: {
        screens: {
          Home: 'home',
          Search: 'search',
          Cart: 'cart',
          Orders: 'orders',
          Profile: 'profile',
        },
      },
      RestaurantDetail: 'restaurant/:restaurantId',
      FoodDetail: 'food/:itemId',
      MenuScreen: 'menu',
      Checkout: 'checkout',
      OrderTracking: 'order-tracking/:orderId',
      OrderHistory: 'order-history',
      Address: 'address',
      Payment: 'payment',
    },
  },
};

// ============================================================
// 🧭 WebSideNav — desktop web LEFT SIDEBAR
// Same tab logic as before (navigation.emit / tabPress / focus
// state) — only the layout changed from a horizontal top bar to
// a vertical left column, per the KhataPro sidebar spec:
//   KhataPro / Local Delivery
//   🏠 Home  🛒 Cart  📦 Orders  👤 Profile
// ============================================================
const WebSideNav = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={webNavStyles.sidebar}>
      {/* BRAND — logo + name on one row, like the reference design */}
      <View style={webNavStyles.brandBlock}>
        <View style={webNavStyles.brandLogoCircle}>
          <Image source={scooterLogo} style={webNavStyles.brandLogoImage} resizeMode="contain" />
        </View>
        <Text style={webNavStyles.brandName}>KhataPro Delivery</Text>
      </View>

      {/* MENU */}
      <View style={webNavStyles.menuList}>
        {state.routes.map((route: (typeof state.routes)[number], index: number) => {
          const { options } = descriptors[route.key];
          const label = (options.title as string) ?? route.name;
          const isFocused = state.index === index;

          let iconName = 'ellipse-outline';
          if (route.name === 'Home') iconName = isFocused ? 'home' : 'home-outline';
          else if (route.name === 'Cart') iconName = isFocused ? 'cart' : 'cart-outline';
          else if (route.name === 'Orders') iconName = isFocused ? 'clipboard' : 'clipboard-outline';
          else if (route.name === 'Profile') iconName = isFocused ? 'person' : 'person-outline';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[webNavStyles.menuItem, isFocused && webNavStyles.menuItemActive]}
              activeOpacity={0.75}
            >
              <Icon
                name={iconName}
                size={20}
                color={isFocused ? PURPLE.primary : PURPLE.subtext}
              />
              <Text style={[webNavStyles.menuLabel, isFocused && webNavStyles.menuLabelActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* DECORATIVE promo card at the bottom — purely visual, matches the
          mobile app's sidebar footer. No data/logic behind it. */}
      <View style={webNavStyles.promoCard}>
        <View style={webNavStyles.promoIconWrap}>
          <Image source={scooterLogo} style={webNavStyles.promoImage} resizeMode="contain" />
        </View>
        <Text style={webNavStyles.promoTitle}>Fast & Safe Delivery</Text>
        <Text style={webNavStyles.promoSubtitle}>Your favorite products at your doorstep</Text>
      </View>
    </View>
  );
};

const webNavStyles = StyleSheet.create({
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    zIndex: 100,
    backgroundColor: PURPLE.white,
    borderRightWidth: 1,
    borderRightColor: PURPLE.border,
    paddingTop: 24,
    paddingHorizontal: 16,
    flexDirection: 'column',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 2, height: 0 },
    elevation: 2,
  },
  brandBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 18,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: PURPLE.border,
  },
  brandLogoCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: PURPLE.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  brandLogoImage: {
    width: 36,
    height: 36,
  },
  brandName: {
    fontSize: 15.5,
    fontWeight: '800',
    color: PURPLE.text,
    fontFamily: FONT_FAMILY,
    flexShrink: 1,
  },
  menuList: {
    flexDirection: 'column',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 10,
    marginBottom: 4,
    borderWidth: 0,
    // ✅ Web-only: TouchableOpacity renders as a focusable <div> on
    // react-native-web, which gets a default black focus-ring outline
    // from the browser on click. Suppress it here.
    ...(Platform.OS === 'web'
      ? ({ outlineStyle: 'none', outlineWidth: 0 } as any)
      : {}),
  },
  // ✅ Light-lavender highlight for the active item
  menuItemActive: {
    backgroundColor: PURPLE.primaryLight,
  },
  menuLabel: {
    marginLeft: 12,
    fontSize: 14.5,
    fontWeight: '600',
    color: PURPLE.subtext,
    fontFamily: FONT_FAMILY,
  },
  menuLabelActive: {
    color: PURPLE.primary,
    fontWeight: '700',
  },
  // Decorative bottom card
  promoCard: {
    marginTop: 'auto',
    marginBottom: 20,
    backgroundColor: PURPLE.primaryLight,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  promoIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: PURPLE.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  promoImage: {
    width: 40,
    height: 40,
  },
  promoTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: PURPLE.text,
    fontFamily: FONT_FAMILY,
    textAlign: 'center',
    marginBottom: 4,
  },
  promoSubtitle: {
    fontSize: 11.5,
    color: PURPLE.subtext,
    fontFamily: FONT_FAMILY,
    textAlign: 'center',
    lineHeight: 15,
  },
});

// ============================================================
// 📱 MobileTabBar — custom bottom bar for phones / narrow web.
// Replaces the built-in BottomTabBar, which squashed the label
// Text to ~5px tall (labels looked half cut off). Every size here
// is explicit (lineHeight, icon size, padding) so nothing shrinks.
// ============================================================
const MobileTabBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[mobileNavStyles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route: (typeof state.routes)[number], index: number) => {
        const { options } = descriptors[route.key];
        const label = (options.title as string) ?? route.name;
        const isFocused = state.index === index;

        let iconName = 'ellipse-outline';
        if (route.name === 'Home') iconName = isFocused ? 'home' : 'home-outline';
        else if (route.name === 'Cart') iconName = isFocused ? 'cart' : 'cart-outline';
        else if (route.name === 'Orders') iconName = isFocused ? 'clipboard' : 'clipboard-outline';
        else if (route.name === 'Profile') iconName = isFocused ? 'person' : 'person-outline';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const color = isFocused ? PURPLE.primary : PURPLE.subtext;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            style={mobileNavStyles.item}
          >
            <Icon name={iconName} size={24} color={color} />
            <Text style={[mobileNavStyles.label, { color }]} numberOfLines={1}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const mobileNavStyles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: PURPLE.white,
    borderTopWidth: 1,
    borderTopColor: PURPLE.border,
    paddingTop: 8,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    ...(Platform.OS === 'web'
      ? ({ outlineStyle: 'none', outlineWidth: 0 } as any)
      : {}),
  },
  label: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 3,
    fontWeight: '600',
    fontFamily: FONT_FAMILY,
    textAlign: 'center',
    flexShrink: 0,
  },
});

// Bottom tab navigator for the logged-in customer home area.
// On desktop web this renders WebSideNav (fixed to the left) instead of the
// native bottom tab bar; mobile / narrow web keeps the default BottomTabBar.
const HomeTabs = () => {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // ✅ Only a wide (desktop-sized) web browser window gets the sidebar.
  const isDesktopWeb = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;

  return (
    <Tab.Navigator
      tabBar={(props: BottomTabBarProps) =>
        isDesktopWeb ? <WebSideNav {...props} /> : <MobileTabBar {...props} />
      }
      screenOptions={({ route }: { route: { name: string } }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          let iconName: string = '';

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: PURPLE.primary,
        tabBarInactiveTintColor: PURPLE.subtext,
        // ✅ FIX: taller bar + safe-area padding so labels
        // (Home / Cart / Orders / Profile) are no longer clipped.
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 68 + insets.bottom,
          paddingTop: 8,
          paddingBottom: 10 + insets.bottom,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          fontFamily: FONT_FAMILY,
          marginBottom: 2,
        },
        tabBarItemStyle: {
          paddingVertical: 2,
        },
        // ✅ Push screen content to the right of the fixed left sidebar —
        // only when the sidebar is actually showing (desktop-width web).
        sceneContainerStyle: isDesktopWeb ? { paddingLeft: SIDEBAR_WIDTH } : undefined,
        sceneStyle: isDesktopWeb ? { paddingLeft: SIDEBAR_WIDTH } : undefined,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
      <Tab.Screen name="Orders" component={OrdersScreen} options={{ title: 'Orders' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

// Stack for the logged-in customer: tabs + all the screens layered on top of them
const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
      {/* <Stack.Screen name="Search" component={SearchScreen} /> */}
      <Stack.Screen name="AddressSelection" component={AddressSelectionScreen} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="OrdersSummary" component={OrdersSummary} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  );
};

export default function AppNavigator() {
  const { user, loading } = useContext(AuthContext);
  const { isDriverAuthenticated, loading: driverLoading } = useContext(DriverAuthContext);

  // Wait for both auth checks before deciding what to show — otherwise a
  // logged-in driver or customer can briefly flash the login screen on reload.
  if (loading || driverLoading) return null;

  return (
    <NavigationContainer linking={linking}>
      {isDriverAuthenticated ? (
        <DriverMainNavigator />
      ) : user ? (
        <MainStack />
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}