// // // // import React, { useContext } from 'react';
// // // // import { NavigationContainer } from '@react-navigation/native';
// // // // import { AuthContext } from '../context/AuthContext';
// // // // import AuthNavigator from './AuthNavigator';
// // // // import MainNavigator from './MainNavigator';

// // // // export default function AppNavigator() {
// // // //   const { isAuthenticated } = useContext(AuthContext);

// // // //   return (
// // // //     <NavigationContainer>
// // // //       {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
// // // //     </NavigationContainer>
// // // //   );
// // // // }
// // // import React, { useContext } from 'react';
// // // import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
// // // import { AuthContext } from '../context/AuthContext';
// // // import AuthNavigator from './AuthNavigator';
// // // import MainNavigator from './MainNavigator';

// // // const linking: LinkingOptions<any> = {
// // //   prefixes: [],
// // //   config: {
// // //     screens: {
// // //       // Auth stack routes
// // //       Login: 'login',
// // //       Signup: 'signup',
// // //       ForgotPassword: 'forgot-password',

// // //       // Main stack routes
// // //       Tabs: {
// // //         screens: {
// // //           Home: 'home',
// // //           Search: 'search',
// // //           Cart: 'cart',
// // //           Orders: 'orders',
// // //           Profile: 'profile',
// // //         },
// // //       },
// // //       RestaurantDetail: 'restaurant/:restaurant',
// // //       FoodDetail: 'food/:item',
// // //       Checkout: 'checkout',
// // //       OrderTracking: 'order-tracking/:orderId',
// // //     },
// // //   },
// // // };

// // // export default function AppNavigator() {
// // //   const { isAuthenticated } = useContext(AuthContext);

// // //   return (
// // //     <NavigationContainer linking={linking}>
// // //       {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
// // //     </NavigationContainer>
// // //   );
// // // }
// // import React from 'react';
// // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // import LandingScreen from '../screens/LandingScreen';
// // import LoginScreen from '../screens/auth/LoginScreen';
// // import SignupScreen from '../screens/auth/SignupScreen';
// // import HomeScreen from '../screens/main/HomeScreen';
// // import SearchScreen from '../screens/main/SearchScreen';
// // import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';
// // import CartScreen from '../screens/main/CartScreen';
// // import ProfileScreen from '../screens/main/ProfileScreen';

// // const Stack = createNativeStackNavigator();

// // const AppNavigator: React.FC = () => {
// //   return (
// //     <Stack.Navigator 
// //       initialRouteName="Login"
// //       screenOptions={{ headerShown: false }}
// //     >
// //       {/* <Stack.Screen name="Landing" component={LandingScreen} /> */}
// //       <Stack.Screen name="Login" component={LoginScreen} />
// //       <Stack.Screen name="Signup" component={SignupScreen} />
// //       <Stack.Screen name="Home" component={HomeScreen} />
// //       <Stack.Screen name="Search" component={SearchScreen} />
// //       <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
// //       <Stack.Screen name="Cart" component={CartScreen} />
// //       <Stack.Screen name="Profile" component={ProfileScreen} />
// //     </Stack.Navigator>
// //   );
// // };

// // export default AppNavigator;
// // // // // // import React from 'react';
// // // // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // // // import { NavigationContainer } from '@react-navigation/native';
// // // // // // import TabNavigator from './TabNavigator';
// // // // // // import LoginScreen from '../screens/auth/LoginScreen';
// // // // // // import SignupScreen from '../screens/auth/SignupScreen';
// // // // // // import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';
// // // // // // import CartScreen from '../screens/main/CartScreen';

// // // // // // const Stack = createNativeStackNavigator();

// // // // // // const AppNavigator: React.FC = () => {
// // // // // //   return (
// // // // // //     <NavigationContainer>
// // // // // //       <Stack.Navigator 
// // // // // //         initialRouteName="Login"
// // // // // //         screenOptions={{ headerShown: false }}
// // // // // //       >
// // // // // //         {/* Auth Screens */}
// // // // // //         <Stack.Screen name="Login" component={LoginScreen} />
// // // // // //         <Stack.Screen name="Signup" component={SignupScreen} />
        
// // // // // //         {/* Main App with Tabs */}
// // // // // //         <Stack.Screen name="MainTabs" component={TabNavigator} />
        
// // // // // //         {/* Other Screens */}
// // // // // //         <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
// // // // // //         <Stack.Screen name="Cart" component={CartScreen} />
// // // // // //       </Stack.Navigator>
// // // // // //     </NavigationContainer>
// // // // // //   );
// // // // // // };

// // // // // // export default AppNavigator;
// // // // // import React from 'react';
// // // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // // import { NavigationContainer } from '@react-navigation/native';
// // // // // import LoginScreen from '../screens/auth/LoginScreen';
// // // // // import SignupScreen from '../screens/auth/SignupScreen';
// // // // // import TabNavigator from './TabNavigator';
// // // // // import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';
// // // // // import CartScreen from '../screens/main/CartScreen';

// // // // // const Stack = createNativeStackNavigator();

// // // // // const AppNavigator: React.FC = () => {
// // // // //   return (
// // // // //     <NavigationContainer>
// // // // //       <Stack.Navigator 
// // // // //         initialRouteName="Login"
// // // // //         screenOptions={{ headerShown: false }}
// // // // //       >
// // // // //         <Stack.Screen name="Login" component={LoginScreen} />
// // // // //         <Stack.Screen name="Signup" component={SignupScreen} />
// // // // //         <Stack.Screen name="MainTabs" component={TabNavigator} />
// // // // //         <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
// // // // //         <Stack.Screen name="Cart" component={CartScreen} />
// // // // //       </Stack.Navigator>
// // // // //     </NavigationContainer>
// // // // //   );
// // // // // };

// // // // // export default AppNavigator;
// // // // import React, { useContext } from 'react';
// // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // import { NavigationContainer } from '@react-navigation/native';
// // // // import LoginScreen from '../screens/auth/LoginScreen';
// // // // import SignupScreen from '../screens/auth/SignupScreen';
// // // // import TabNavigator from './TabNavigator';
// // // // import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';
// // // // import CartScreen from '../screens/main/CartScreen';
// // // // import { AuthContext } from '../context/AuthContext';

// // // // const Stack = createNativeStackNavigator();

// // // // const AppNavigator: React.FC = () => {
// // // //   const { isAuthenticated } = useContext(AuthContext);

// // // //   return (
// // // //     <NavigationContainer>
// // // //       <Stack.Navigator 
// // // //         initialRouteName="Login"
// // // //         screenOptions={{ headerShown: false }}
// // // //       >
// // // //         {!isAuthenticated ? (
// // // //           <>
// // // //             <Stack.Screen name="Login" component={LoginScreen} />
// // // //             <Stack.Screen name="Signup" component={SignupScreen} />
// // // //           </>
// // // //         ) : (
// // // //           <>
// // // //             <Stack.Screen name="MainTabs" component={TabNavigator} />
// // // //             <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
// // // //             <Stack.Screen name="Cart" component={CartScreen} />
// // // //           </>
// // // //         )}
// // // //       </Stack.Navigator>
// // // //     </NavigationContainer>
// // // //   );
// // // // };

// // // // export default AppNavigator;
// // // import React, { useContext, useEffect, useState } from 'react';
// // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // import { NavigationContainer } from '@react-navigation/native';
// // // import { View, Text, ActivityIndicator } from 'react-native';
// // // import LoginScreen from '../screens/auth/LoginScreen';
// // // import SignupScreen from '../screens/auth/SignupScreen';
// // // import TabNavigator from './TabNavigator';
// // // import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';
// // // import CartScreen from '../screens/main/CartScreen';
// // // import { AuthContext } from '../context/AuthContext';

// // // const Stack = createNativeStackNavigator();

// // // const AppNavigator: React.FC = () => {
// // //   const { isAuthenticated, loading } = useContext(AuthContext);
// // //   const [initialRoute, setInitialRoute] = useState<string>('Login');

// // //   useEffect(() => {
// // //     // Determine initial route based on URL and auth status
// // //     if (typeof window !== 'undefined') {
// // //       const path = window.location.pathname;
      
// // //       if (path.includes('/login')) {
// // //         setInitialRoute('Login');
// // //       } else if (path.includes('/signup')) {
// // //         setInitialRoute('Signup');
// // //       } else if (isAuthenticated) {
// // //         setInitialRoute('MainTabs');
// // //       } else {
// // //         setInitialRoute('Login');
// // //       }
// // //     } else {
// // //       setInitialRoute(isAuthenticated ? 'MainTabs' : 'Login');
// // //     }
// // //   }, [isAuthenticated]);

// // //   // Handle URL changes manually
// // //   useEffect(() => {
// // //     const handleUrlChange = () => {
// // //       if (typeof window !== 'undefined') {
// // //         const path = window.location.pathname;
// // //         console.log('URL changed to:', path);
// // //       }
// // //     };

// // //     if (typeof window !== 'undefined') {
// // //       window.addEventListener('popstate', handleUrlChange);
// // //     }
    
// // //     return () => {
// // //       if (typeof window !== 'undefined') {
// // //         window.removeEventListener('popstate', handleUrlChange);
// // //       }
// // //     };
// // //   }, []);

// // //   if (loading) {
// // //     return (
// // //       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
// // //         <ActivityIndicator size="large" color="#fc8019" />
// // //         <Text style={{ marginTop: 10, color: '#666' }}>Loading...</Text>
// // //       </View>
// // //     );
// // //   }

// // //   return (
// // //     <NavigationContainer>
// // //       <Stack.Navigator 
// // //         initialRouteName={initialRoute}
// // //         screenOptions={{ headerShown: false }}
// // //       >
// // //         {!isAuthenticated ? (
// // //           // Auth Screens - No bottom tabs
// // //           <>
// // //             <Stack.Screen name="Login" component={LoginScreen} />
// // //             <Stack.Screen name="Signup" component={SignupScreen} />
// // //           </>
// // //         ) : (
// // //           // Main App Screens - With bottom tabs
// // //           <>
// // //             <Stack.Screen name="MainTabs" component={TabNavigator} />
// // //             <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
// // //             <Stack.Screen name="Cart" component={CartScreen} />
// // //           </>
// // //         )}
// // //       </Stack.Navigator>
// // //     </NavigationContainer>
// // //   );
// // // };

// // // export default AppNavigator;
// // src/navigation/AppNavigator.js
// // import React, { useContext } from 'react';
// // import { NavigationContainer } from '@react-navigation/native';
// // import { AuthContext } from '../context/AuthContext';
// // import AuthNavigator from './AuthNavigator';
// // import MainNavigator from './MainNavigator';

// // export default function AppNavigator() {
// //   const { isAuthenticated } = useContext(AuthContext);

// //   return (
// //     <NavigationContainer>
// //       {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
// //     </NavigationContainer>
// //   );
// // }
// import React, { useContext } from 'react';
// import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
// import { AuthContext } from '../context/AuthContext';
// import AuthNavigator from './AuthNavigator';
// import MainNavigator from './MainNavigator';

// const linking: LinkingOptions<any> = {
//   prefixes: [],
//   config: {
//     screens: {
//       Login: 'login',
//       Signup: 'signup',
//       ForgotPassword: 'forgot-password',
//       Tabs: {
//         screens: {
//           Home: 'home',
//           Search: 'search',
//           Cart: 'cart',
//           Orders: 'orders',
//           Profile: 'profile',
//         },
//       },
//       RestaurantDetail: 'restaurant',
//       Checkout: 'checkout',
//       OrderTracking: 'order-tracking',
//     },
//   },
// };

// export default function AppNavigator() {
//   const { isAuthenticated } = useContext(AuthContext);

//   return (
//     <NavigationContainer linking={linking}>
//       {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
//     </NavigationContainer>
//   );
// }
// import React, { useContext } from 'react';
// import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
// import { AuthContext } from '../context/AuthContext';
// import AuthNavigator from './AuthNavigator';
// import MainNavigator from './MainNavigator';

// const linking: LinkingOptions<any> = {
//   prefixes: [],
//   config: {
//     screens: {
//       Login: '',
//       Signup: 'signup',
//       ForgotPassword: 'forgot-password',
//       Tabs: {
//         screens: {
//           Home: 'home',
//           Search: 'search',
//           Cart: 'cart',
//           Orders: 'orders',
//           Profile: 'profile',
//         },
//       },
//       RestaurantDetail: 'restaurant',
//       Checkout: 'checkout',
//       OrderTracking: 'order-tracking',
//     },
//   },
// };

// export default function AppNavigator() {
//   const { isAuthenticated } = useContext(AuthContext);

//   return (
//     <NavigationContainer linking={linking}>
//       {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
//     </NavigationContainer>
//   );
// }
import React, { useContext } from 'react';
import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

const linking: LinkingOptions<any> = {
  prefixes: [],
  config: {
    screens: {
      Login: '',
      Signup: 'signup',
      ForgotPassword: 'forgot-password',
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

export default function AppNavigator() {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <NavigationContainer linking={linking}>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}