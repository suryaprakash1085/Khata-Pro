<<<<<<< HEAD

=======
 
>>>>>>> 54571b9db09ab889e729432cc5d0441746689f17
import React, { useContext } from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
 
import { AuthContext } from '../context/AuthContext';
import { DriverAuthContext } from '../context/DriverAuthContext';
import AuthNavigator from './AuthNavigator';
import DriverMainNavigator from './DriverMainNavigator';
 
// Main (customer) screens
import HomeScreen from '../screens/main/HomeScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
<<<<<<< HEAD

=======
// import SearchScreen from '../screens/main/SearchScreen';
>>>>>>> 54571b9db09ab889e729432cc5d0441746689f17
import CartScreen from '../screens/main/CartScreen';
import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';
import OrdersScreen from '../screens/main/OrdersScreen';
import OrderTrackingScreen from '../screens/order/OrderTrackingScreen';
import OrderSuccessScreen from '../screens/order/OrderSuccessScreen';
import AddressSelectionScreen from '../screens/checkout/AddressSelectionScreen';
import PaymentScreen from '../screens/checkout/PaymentScreen';
<<<<<<< HEAD

import ProductListScreen from '../screens/main/ProductListScreen';
import OrdersSummary from '../screens/main/OrdersSummary';
import EditProfileScreen from '../screens/main/EditProfileScreen';

=======
 
import ProductListScreen from '../screens/main/ProductListScreen';
import OrdersSummary from '../screens/main/OrdersSummary';
import EditProfileScreen from '../screens/main/EditProfileScreen';
 
>>>>>>> 54571b9db09ab889e729432cc5d0441746689f17
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
 
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
 
// Bottom tab navigator for the logged-in customer home area
const HomeTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: { name: string } }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
          let iconName: string = '';
<<<<<<< HEAD

=======
 
>>>>>>> 54571b9db09ab889e729432cc5d0441746689f17
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'Orders') {
            iconName = focused ? 'clipboard' : 'clipboard-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
<<<<<<< HEAD

=======
 
>>>>>>> 54571b9db09ab889e729432cc5d0441746689f17
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#fc8019',
        tabBarInactiveTintColor: '#7e808c',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f5',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '500',
        },
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
<<<<<<< HEAD
    
=======
      {/* <Stack.Screen name="Search" component={SearchScreen} /> */}
>>>>>>> 54571b9db09ab889e729432cc5d0441746689f17
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
 