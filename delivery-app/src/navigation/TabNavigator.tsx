// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/Ionicons';
// import HomeScreen from '../screens/main/HomeScreen';
// import SearchScreen from '../screens/main/SearchScreen';
// import CartScreen from '../screens/main/CartScreen';
// import OrdersScreen from '../screens/main/OrdersScreen';
// import ProfileScreen from '../screens/main/ProfileScreen';
// import { colors } from '../constants/colors';

// export type TabParamList = {
//   Home: undefined;
//   Search: undefined;
//   Cart: undefined;
//   Orders: undefined;
//   Profile: undefined;
// };

// const Tab = createBottomTabNavigator<TabParamList>();

// export default function TabNavigator(){
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName: string;
//           if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
//           else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
//           else if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline';
//           else if (route.name === 'Orders') iconName = focused ? 'clipboard' : 'clipboard-outline';
//           else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
//           else iconName = 'home-outline';
//           return <Icon name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: colors.primary,
//         tabBarInactiveTintColor: colors.gray,
//         headerShown: false,
//         tabBarStyle: {
//           height: 60,
//           paddingBottom: 8,
//         },
//         tabBarLabelStyle: {
//           fontSize: 11,
//           fontWeight: '500',
//         },
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} />
//       <Tab.Screen name="Search" component={SearchScreen} />
//       <Tab.Screen name="Cart" component={CartScreen} />
//       <Tab.Screen name="Orders" component={OrdersScreen} />
//       <Tab.Screen name="Profile" component={ProfileScreen} />
//     </Tab.Navigator>
//   );
// }
// // // // // import React from 'react';
// // // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // import HomeScreen from '../screens/main/HomeScreen';
// // // // // import SearchScreen from '../screens/main/SearchScreen';
// // // // // import CartScreen from '../screens/main/CartScreen';
// // // // // import OrdersScreen from '../screens/main/OrdersScreen';
// // // // // import ProfileScreen from '../screens/main/ProfileScreen';
// // // // // import { colors } from '../constants/colors';

// // // // // export type TabParamList = {
// // // // //   Home: undefined;
// // // // //   Search: undefined;
// // // // //   Cart: undefined;
// // // // //   Orders: undefined;
// // // // //   Profile: undefined;
// // // // // };

// // // // // const Tab = createBottomTabNavigator<TabParamList>();

// // // // // export default function TabNavigator() {
// // // // //   return (
// // // // //     <Tab.Navigator
// // // // //       screenOptions={({ route }) => ({
// // // // //         tabBarIcon: ({ focused, color, size }) => {
// // // // //           let iconName: string;
// // // // //           if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
// // // // //           else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
// // // // //           else if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline';
// // // // //           else if (route.name === 'Orders') iconName = focused ? 'clipboard' : 'clipboard-outline';
// // // // //           else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
// // // // //           else iconName = 'home-outline';
// // // // //           return <Icon name={iconName} size={size} color={color} />;
// // // // //         },
// // // // //         tabBarActiveTintColor: colors.primary,
// // // // //         tabBarInactiveTintColor: colors.gray,
// // // // //         headerShown: false,
// // // // //         tabBarStyle: {
// // // // //           height: 60,
// // // // //           paddingBottom: 8,
// // // // //           paddingTop: 4,
// // // // //           backgroundColor: '#ffffff',
// // // // //           borderTopWidth: 1,
// // // // //           borderTopColor: '#f0f0f5',
// // // // //         },
// // // // //         tabBarLabelStyle: {
// // // // //           fontSize: 11,
// // // // //           fontWeight: '500',
// // // // //         },
// // // // //       })}
// // // // //     >
// // // // //       <Tab.Screen name="Home" component={HomeScreen} />
// // // // //       <Tab.Screen name="Search" component={SearchScreen} />
// // // // //       <Tab.Screen name="Cart" component={CartScreen} />
// // // // //       <Tab.Screen name="Orders" component={OrdersScreen} />
// // // // //       <Tab.Screen name="Profile" component={ProfileScreen} />
// // // // //     </Tab.Navigator>
// // // // //   );
// // // // // }
// // // // import React from 'react';
// // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // import HomeScreen from '../screens/main/HomeScreen';
// // // // import SearchScreen from '../screens/main/SearchScreen';
// // // // import CartScreen from '../screens/main/CartScreen';
// // // // import OrdersScreen from '../screens/main/OrdersScreen';
// // // // import ProfileScreen from '../screens/main/ProfileScreen';
// // // // import { colors } from '../constants/colors';

// // // // export type TabParamList = {
// // // //   Home: undefined;
// // // //   Search: undefined;
// // // //   Cart: undefined;
// // // //   Orders: undefined;
// // // //   Profile: undefined;
// // // // };

// // // // const Tab = createBottomTabNavigator<TabParamList>();

// // // // export default function TabNavigator() {
// // // //   return (
// // // //     <Tab.Navigator
// // // //       screenOptions={({ route }) => ({
// // // //         tabBarIcon: ({ focused, color, size }) => {
// // // //           let iconName: string;
// // // //           if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
// // // //           else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
// // // //           else if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline';
// // // //           else if (route.name === 'Orders') iconName = focused ? 'clipboard' : 'clipboard-outline';
// // // //           else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
// // // //           else iconName = 'home-outline';
// // // //           return <Icon name={iconName} size={size} color={color} />;
// // // //         },
// // // //         tabBarActiveTintColor: colors.primary,
// // // //         tabBarInactiveTintColor: colors.gray,
// // // //         headerShown: false,
// // // //         tabBarStyle: {
// // // //           height: 60,
// // // //           paddingBottom: 8,
// // // //           paddingTop: 4,
// // // //           backgroundColor: '#ffffff',
// // // //           borderTopWidth: 1,
// // // //           borderTopColor: '#f0f0f5',
// // // //           position: 'absolute',
// // // //           bottom: 0,
// // // //           left: 0,
// // // //           right: 0,
// // // //           elevation: 0,
// // // //         },
// // // //         tabBarLabelStyle: {
// // // //           fontSize: 11,
// // // //           fontWeight: '500',
// // // //         },
// // // //       })}
// // // //     >
// // // //       <Tab.Screen name="Home" component={HomeScreen} />
// // // //       <Tab.Screen name="Search" component={SearchScreen} />
// // // //       <Tab.Screen name="Cart" component={CartScreen} />
// // // //       <Tab.Screen name="Orders" component={OrdersScreen} />
// // // //       <Tab.Screen name="Profile" component={ProfileScreen} />
// // // //     </Tab.Navigator>
// // // //   );
// // // // }
// // // import React from 'react';
// // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // import Icon from 'react-native-vector-icons/Ionicons';
// // // import HomeScreen from '../screens/main/HomeScreen';
// // // import SearchScreen from '../screens/main/SearchScreen';
// // // import CartScreen from '../screens/main/CartScreen';
// // // import OrdersScreen from '../screens/main/OrdersScreen';
// // // import ProfileScreen from '../screens/main/ProfileScreen';
// // // import { colors } from '../constants/colors';

// // // export type TabParamList = {
// // //   Home: undefined;
// // //   Search: undefined;
// // //   Cart: undefined;
// // //   Orders: undefined;
// // //   Profile: undefined;
// // // };

// // // const Tab = createBottomTabNavigator<TabParamList>();

// // // export default function TabNavigator() {
// // //   return (
// // //     <Tab.Navigator
// // //       screenOptions={({ route }) => ({
// // //         tabBarIcon: ({ focused, color, size }) => {
// // //           let iconName: string;
// // //           if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
// // //           else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
// // //           else if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline';
// // //           else if (route.name === 'Orders') iconName = focused ? 'clipboard' : 'clipboard-outline';
// // //           else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
// // //           else iconName = 'home-outline';
// // //           return <Icon name={iconName} size={size} color={color} />;
// // //         },
// // //         tabBarActiveTintColor: colors.primary,
// // //         tabBarInactiveTintColor: colors.gray,
// // //         headerShown: false,
// // //         tabBarStyle: {
// // //           height: 60,
// // //           paddingBottom: 8,
// // //           paddingTop: 4,
// // //           backgroundColor: '#ffffff',
// // //           borderTopWidth: 1,
// // //           borderTopColor: '#f0f0f5',
// // //         },
// // //         tabBarLabelStyle: {
// // //           fontSize: 11,
// // //           fontWeight: '500',
// // //         },
// // //       })}
// // //     >
// // //       <Tab.Screen name="Home" component={HomeScreen} />
// // //       <Tab.Screen name="Search" component={SearchScreen} />
// // //       <Tab.Screen name="Cart" component={CartScreen} />
// // //       <Tab.Screen name="Orders" component={OrdersScreen} />
// // //       <Tab.Screen name="Profile" component={ProfileScreen} />
// // //     </Tab.Navigator>
// // //   );
// // // }
// // import React from 'react';
// // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import HomeScreen from '../screens/main/HomeScreen';
// // import SearchScreen from '../screens/main/SearchScreen';
// // import CartScreen from '../screens/main/CartScreen';
// // import OrdersScreen from '../screens/main/OrdersScreen';
// // import ProfileScreen from '../screens/main/ProfileScreen';

// // const Tab = createBottomTabNavigator();

// // const TabNavigator: React.FC = () => {
// //   return (
// //     <Tab.Navigator
// //       screenOptions={({ route }) => ({
// //         tabBarIcon: ({ focused, color, size }) => {
// //           let iconName: string = 'home-outline';
          
// //           if (route.name === 'Home') {
// //             iconName = focused ? 'home' : 'home-outline';
// //           } else if (route.name === 'Search') {
// //             iconName = focused ? 'search' : 'search-outline';
// //           } else if (route.name === 'Cart') {
// //             iconName = focused ? 'cart' : 'cart-outline';
// //           } else if (route.name === 'Orders') {
// //             iconName = focused ? 'clipboard' : 'clipboard-outline';
// //           } else if (route.name === 'Profile') {
// //             iconName = focused ? 'person' : 'person-outline';
// //           }
          
// //           return <Icon name={iconName} size={size} color={color} />;
// //         },
// //         tabBarActiveTintColor: '#fc8019',
// //         tabBarInactiveTintColor: '#7e808c',
// //         tabBarStyle: {
// //           height: 60,
// //           paddingBottom: 8,
// //           paddingTop: 4,
// //           backgroundColor: '#ffffff',
// //           borderTopWidth: 1,
// //           borderTopColor: '#f0f0f5',
// //         },
// //         tabBarLabelStyle: {
// //           fontSize: 11,
// //           fontWeight: '500',
// //         },
// //         headerShown: false,
// //       })}
// //     >
// //       <Tab.Screen name="Home" component={HomeScreen} />
// //       <Tab.Screen name="Search" component={SearchScreen} />
// //       <Tab.Screen name="Cart" component={CartScreen} />
// //       <Tab.Screen name="Orders" component={OrdersScreen} />
// //       <Tab.Screen name="Profile" component={ProfileScreen} />
// //     </Tab.Navigator>
// //   );
// // };

// // export default TabNavigator;
// // import React from 'react';
// // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import HomeScreen from '../screens/main/HomeScreen';
// // import SearchScreen from '../screens/main/SearchScreen';
// // import CartScreen from '../screens/main/CartScreen';
// // import OrdersScreen from '../screens/main/OrdersScreen';
// // import ProfileScreen from '../screens/main/ProfileScreen';

// // const Tab = createBottomTabNavigator();

// // const TabNavigator: React.FC = () => {
// //   return (
// //     <Tab.Navigator
// //       screenOptions={({ route }) => ({
// //         tabBarIcon: ({ focused, color, size }) => {
// //           let iconName: string = 'home-outline';
          
// //           if (route.name === 'Home') {
// //             iconName = focused ? 'home' : 'home-outline';
// //           } else if (route.name === 'Search') {
// //             iconName = focused ? 'search' : 'search-outline';
// //           } else if (route.name === 'Cart') {
// //             iconName = focused ? 'cart' : 'cart-outline';
// //           } else if (route.name === 'Orders') {
// //             iconName = focused ? 'clipboard' : 'clipboard-outline';
// //           } else if (route.name === 'Profile') {
// //             iconName = focused ? 'person' : 'person-outline';
// //           }
          
// //           return <Icon name={iconName} size={size} color={color} />;
// //         },
// //         tabBarActiveTintColor: '#fc8019',
// //         tabBarInactiveTintColor: '#7e808c',
// //         tabBarStyle: {
// //           height: 60,
// //           paddingBottom: 8,
// //           paddingTop: 4,
// //           backgroundColor: '#ffffff',
// //           borderTopWidth: 1,
// //           borderTopColor: '#f0f0f5',
// //         },
// //         tabBarLabelStyle: {
// //           fontSize: 11,
// //           fontWeight: '500',
// //         },
// //         headerShown: false,
// //       })}
// //     >
// //       <Tab.Screen name="Home" component={HomeScreen} />
// //       <Tab.Screen name="Search" component={SearchScreen} />
// //       <Tab.Screen name="Cart" component={CartScreen} />
// //       <Tab.Screen name="Orders" component={OrdersScreen} />
// //       <Tab.Screen name="Profile" component={ProfileScreen} />
// //     </Tab.Navigator>
// //   );
// // };

// // export default TabNavigator;
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/main/HomeScreen';
// import SearchScreen from '../screens/main/SearchScreen';
import CartScreen from '../screens/main/CartScreen';
import OrdersScreen from '../screens/main/OrdersScreen';
import ProfileScreen from '../screens/main/ProfileScreen';
import { colors } from '../constants/colors';

export type TabParamList = {
  Home: undefined;
  // Search: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          // else if (route.name === 'Search') iconName = focused ? 'search' : 'search-outline';
          else if (route.name === 'Cart') iconName = focused ? 'cart' : 'cart-outline';
          else if (route.name === 'Orders') iconName = focused ? 'clipboard' : 'clipboard-outline';
          else if (route.name === 'Profile') iconName = focused ? 'person' : 'person-outline';
          else iconName = 'home-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        headerShown: false,
        tabBarStyle: { height: 60, paddingBottom: 8 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      {/* <Tab.Screen name="Search" component={SearchScreen} /> */}
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
