
import React, { useContext } from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
  BottomTabBar,
  BottomTabBarProps,
} from '@react-navigation/bottom-tabs';
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors } from '../constants/colors';

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

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Height of the web top navbar — used both by the navbar itself and
// by the screen padding so content never sits underneath it.
const WEB_NAV_HEIGHT = 64;

// ✅ Below this window width we're on a phone-sized browser viewport —
// keep the familiar bottom tab bar there. At or above it (a real desktop
// browser window) we switch to the top navbar instead. Native apps
// (Platform.OS !== 'web') never use this — they always get the bottom bar.
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

// =====================================================
// ✅ WEB TOP NAVBAR — replaces the bottom tab bar ONLY on web.
// Receives the exact same props React Navigation gives a custom
// tabBar (state/descriptors/navigation), so tapping a link uses the
// normal tab navigation events — active-state detection, badge
// support, etc. all keep working the same way they do on mobile.
// =====================================================
const WebTopNavBar = ({ state, descriptors, navigation }: BottomTabBarProps) => {
  return (
    <View style={webNavStyles.container}>
      <View style={webNavStyles.links}>
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
              style={[webNavStyles.link, isFocused && webNavStyles.linkActive]}
              activeOpacity={0.7}
            >
              <Icon name={iconName} size={18} color={isFocused ? colors.primary : colors.textLight} />
              <Text style={[webNavStyles.linkText, isFocused && webNavStyles.linkTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const webNavStyles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: WEB_NAV_HEIGHT,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 28,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    // Subtle shadow so it visually sits above page content
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginLeft: 6,
  },
  linkActive: {
    backgroundColor: colors.lightGray,
  },
  linkText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '600',
    color: colors.textLight,
  },
  linkTextActive: {
    color: colors.primary,
  },
});

// Bottom tab navigator for the logged-in customer home area.
// On web this renders WebTopNavBar (fixed to the top) instead of the
// native bottom tab bar; mobile keeps the default BottomTabBar untouched.
const HomeTabs = () => {
  const { width } = useWindowDimensions();

  // ✅ Only a wide (desktop-sized) web browser window gets the top navbar.
  // A phone browser (narrow width) still gets the normal bottom tab bar,
  // exactly like the native app.
  const isDesktopWeb = Platform.OS === 'web' && width >= DESKTOP_BREAKPOINT;

  return (
    <Tab.Navigator
      tabBar={(props: BottomTabBarProps) =>
        isDesktopWeb ? <WebTopNavBar {...props} /> : <BottomTabBar {...props} />
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
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
        // ✅ Push screen content below the fixed top navbar — only when
        // the top navbar is actually showing (desktop-width web).
        sceneContainerStyle: isDesktopWeb ? { paddingTop: WEB_NAV_HEIGHT } : undefined,
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
