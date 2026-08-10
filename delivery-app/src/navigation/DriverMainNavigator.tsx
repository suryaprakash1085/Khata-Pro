import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DriverHomeScreen from '../screens/driver/DriverHomeScreen';
import DriverOrdersScreen from '../screens/driver/DriverOrdersScreen';
import DriverRouteScreen from '../screens/driver/DriverRouteScreen';
import DriverAlertsScreen from '../screens/driver/DriverAlertsscreen';
import DriverProfileScreen from '../screens/driver/DriverProfilescreen';

const Stack = createNativeStackNavigator();

export default function DriverMainNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DriverHome" component={DriverHomeScreen} />
      <Stack.Screen name="DriverOrders" component={DriverOrdersScreen} />
      <Stack.Screen name="DriverRoute" component={DriverRouteScreen} />
      <Stack.Screen name="DriverAlerts" component={DriverAlertsScreen} />
      <Stack.Screen name="DriverProfile" component={DriverProfileScreen} />
    </Stack.Navigator>
  );
}