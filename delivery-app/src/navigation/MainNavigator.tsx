// // import React from 'react';
// // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // import { Restaurant } from '../types';
// // import TabNavigator from './TabNavigator';
// // import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';
// // import CheckoutScreen from '../screens/checkout/CheckoutScreen';
// // import OrderTrackingScreen from '../screens/order/OrderTrackingScreen';
// // import FoodDetailScreen from '../screens/restaurant/FoodDetailScreen';

// // export type MainStackParamList = {
// //   Tabs: undefined;
// //   RestaurantDetail: { restaurant: Restaurant };
// //   FoodDetail: { item: any; restaurant: Restaurant };
// //   Checkout: undefined;
// //   OrderTracking: { orderId?: string };
// // };

// // const Stack = createNativeStackNavigator<MainStackParamList>();

// // export default function MainNavigator(){
// //   return (
// //     <Stack.Navigator screenOptions={{ headerShown: false }}>
// //       <Stack.Screen name="Tabs" component={TabNavigator} />
// //       <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
// //       <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
// //       <Stack.Screen name="Checkout" component={CheckoutScreen} />
// //       <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
// //     </Stack.Navigator>
// //   );
// // }
// // src/navigation/MainNavigator.js
// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import TabNavigator from './TabNavigator';
// import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';
// import CheckoutScreen from '../screens/checkout/CheckoutScreen';
// import OrderTrackingScreen from '../screens/order/OrderTrackingScreen';

// const Stack = createNativeStackNavigator();

// export default function MainNavigator() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Tabs" component={TabNavigator} />
//       <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
//       <Stack.Screen name="Checkout" component={CheckoutScreen} />
//       <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
//     </Stack.Navigator>
//   );
// }
// import React from 'react';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import TabNavigator from './TabNavigator';
// import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';
// import CheckoutScreen from '../screens/checkout/CheckoutScreen';
// import OrderTrackingScreen from '../screens/order/OrderTrackingScreen';

// const Stack = createNativeStackNavigator();

// export default function MainNavigator() {
//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="Tabs" component={TabNavigator} />
//       <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
//       <Stack.Screen name="Checkout" component={CheckoutScreen} />
//       <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
//     </Stack.Navigator>
//   );
// }
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './TabNavigator';
import FoodDetailScreen from '../screens/restaurant/FoodDetailScreen';
import MenuScreen from '../screens/restaurant/MenuScreen';
import OrderHistoryScreen from '../screens/order/OrderHistoryScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';

import CartScreen from '../screens/main/CartScreen';
import CheckoutScreen from '../screens/checkout/CheckoutScreen';
import AddressScreen from '../screens/checkout/AddressScreen';
import PaymentScreen from '../screens/checkout/PaymentScreen';
import OrderTrackingScreen from '../screens/order/OrderTrackingScreen';
import OrdersScreen from '../screens/main/OrdersScreen';
// import OrderSuccessScreen from '../screens/order/OrderSuccessScreen';
import OrderSuccessScreen from '../screens/order/OrderSuccessScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
// import AddressSelectionScreen from '../screens/checkout/AddressSelectionScreen';
import AddressSelectionScreen from '../screens/checkout/AddressSelectionScreen';
const Stack = createNativeStackNavigator();

export default function MainNavigator() {
  return (
    
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={TabNavigator} />
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
       <Stack.Screen name="FoodDetail" component={FoodDetailScreen} />
      <Stack.Screen name="MenuScreen" component={MenuScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="Address" component={AddressScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
            <Stack.Screen name="OrderHistory" component={OrderHistoryScreen} />

      <Stack.Screen name="Orders" component={OrdersScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
      <Stack.Screen name="AddressSelection" component={AddressSelectionScreen} />

    </Stack.Navigator>
  );
}