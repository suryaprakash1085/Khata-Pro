import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DriverHomeScreen from '../screens/driver/DriverHomeScreen';
import DriverOrdersScreen from '../screens/driver/DriverOrdersScreen';
import DriverOrderDetailsScreen from '../screens/driver/DriverOrderDetailsScreen';
import DriverEarningsScreen from '../screens/driver/DriverEarningsScreen';
import DriverRouteScreen from '../screens/driver/DriverRouteScreen';
import DriverAlertsScreen from '../screens/driver/DriverAlertsscreen';
import DriverProfileScreen from '../screens/driver/DriverProfilescreen';

export type DriverMainStackParamList = {
  DriverHome: undefined;
  DriverOrders: undefined;
  DriverOrderDetails: { deliveryId: number };
  DriverEarnings: undefined;
  DriverRoute: undefined;
  DriverAlerts: undefined;
  DriverProfile: undefined;
};

const Stack = createNativeStackNavigator<DriverMainStackParamList>();

export default function DriverMainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriverHome" component={DriverHomeScreen} />
      <Stack.Screen name="DriverOrders" component={DriverOrdersScreen} />
      <Stack.Screen name="DriverOrderDetails" component={DriverOrderDetailsScreen} />
      <Stack.Screen name="DriverEarnings" component={DriverEarningsScreen} />
      <Stack.Screen name="DriverRoute" component={DriverRouteScreen} />
      <Stack.Screen name="DriverAlerts" component={DriverAlertsScreen} />
      <Stack.Screen name="DriverProfile" component={DriverProfileScreen} />
    </Stack.Navigator>
  );
}