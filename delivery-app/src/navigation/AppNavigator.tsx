// // // // // // // // // // // // // // // import React, { useContext } from 'react';
// // // // // // // // // // // // // // // import { NavigationContainer } from '@react-navigation/native';
// // // // // // // // // // // // // // // import { AuthContext } from '../context/AuthContext';
// // // // // // // // // // // // // // // import AuthNavigator from './AuthNavigator';
// // // // // // // // // // // // // // // import MainNavigator from './MainNavigator';

// // // // // // // // // // // // // // // export default function AppNavigator() {
// // // // // // // // // // // // // // //   const { isAuthenticated } = useContext(AuthContext);

// // // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // // //     <NavigationContainer>
// // // // // // // // // // // // // // //       {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
// // // // // // // // // // // // // // //     </NavigationContainer>
// // // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // // }
// // // // // // // // // // // // // // import React, { useContext } from 'react';
// // // // // // // // // // // // // // import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
// // // // // // // // // // // // // // import { AuthContext } from '../context/AuthContext';
// // // // // // // // // // // // // // import AuthNavigator from './AuthNavigator';
// // // // // // // // // // // // // // import MainNavigator from './MainNavigator';

// // // // // // // // // // // // // // const linking: LinkingOptions<any> = {
// // // // // // // // // // // // // //   prefixes: [],
// // // // // // // // // // // // // //   config: {
// // // // // // // // // // // // // //     screens: {
// // // // // // // // // // // // // //       // Auth stack routes
// // // // // // // // // // // // // //       Login: 'login',
// // // // // // // // // // // // // //       Signup: 'signup',
// // // // // // // // // // // // // //       ForgotPassword: 'forgot-password',

// // // // // // // // // // // // // //       // Main stack routes
// // // // // // // // // // // // // //       Tabs: {
// // // // // // // // // // // // // //         screens: {
// // // // // // // // // // // // // //           Home: 'home',
// // // // // // // // // // // // // //           Search: 'search',
// // // // // // // // // // // // // //           Cart: 'cart',
// // // // // // // // // // // // // //           Orders: 'orders',
// // // // // // // // // // // // // //           Profile: 'profile',
// // // // // // // // // // // // // //         },
// // // // // // // // // // // // // //       },
// // // // // // // // // // // // // //       RestaurantDetail: 'restaurant/:restaurant',
// // // // // // // // // // // // // //       FoodDetail: 'food/:item',
// // // // // // // // // // // // // //       Checkout: 'checkout',
// // // // // // // // // // // // // //       OrderTracking: 'order-tracking/:orderId',
// // // // // // // // // // // // // //     },
// // // // // // // // // // // // // //   },
// // // // // // // // // // // // // // };

// // // // // // // // // // // // // // export default function AppNavigator() {
// // // // // // // // // // // // // //   const { isAuthenticated } = useContext(AuthContext);

// // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // //     <NavigationContainer linking={linking}>
// // // // // // // // // // // // // //       {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
// // // // // // // // // // // // // //     </NavigationContainer>
// // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // }
// // // // // // // // // // // // // import React from 'react';
// // // // // // // // // // // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // // // // // // // // // // // import LandingScreen from '../screens/LandingScreen';
// // // // // // // // // // // // // import LoginScreen from '../screens/auth/LoginScreen';
// // // // // // // // // // // // // import SignupScreen from '../screens/auth/SignupScreen';
// // // // // // // // // // // // // import HomeScreen from '../screens/main/HomeScreen';
// // // // // // // // // // // // // import SearchScreen from '../screens/main/SearchScreen';
// // // // // // // // // // // // // import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';
// // // // // // // // // // // // // import CartScreen from '../screens/main/CartScreen';
// // // // // // // // // // // // // import ProfileScreen from '../screens/main/ProfileScreen';

// // // // // // // // // // // // // const Stack = createNativeStackNavigator();

// // // // // // // // // // // // // const AppNavigator: React.FC = () => {
// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <Stack.Navigator 
// // // // // // // // // // // // //       initialRouteName="Login"
// // // // // // // // // // // // //       screenOptions={{ headerShown: false }}
// // // // // // // // // // // // //     >
// // // // // // // // // // // // //       {/* <Stack.Screen name="Landing" component={LandingScreen} /> */}
// // // // // // // // // // // // //       <Stack.Screen name="Login" component={LoginScreen} />
// // // // // // // // // // // // //       <Stack.Screen name="Signup" component={SignupScreen} />
// // // // // // // // // // // // //       <Stack.Screen name="Home" component={HomeScreen} />
// // // // // // // // // // // // //       <Stack.Screen name="Search" component={SearchScreen} />
// // // // // // // // // // // // //       <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
// // // // // // // // // // // // //       <Stack.Screen name="Cart" component={CartScreen} />
// // // // // // // // // // // // //       <Stack.Screen name="Profile" component={ProfileScreen} />
// // // // // // // // // // // // //     </Stack.Navigator>
// // // // // // // // // // // // //   );
// // // // // // // // // // // // // };

// // // // // // // // // // // // // export default AppNavigator;
// // // // // // // // // // // // // // // // // import React from 'react';
// // // // // // // // // // // // // // // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // // // // // // // // // // // // // // import { NavigationContainer } from '@react-navigation/native';
// // // // // // // // // // // // // // // // // import TabNavigator from './TabNavigator';
// // // // // // // // // // // // // // // // // import LoginScreen from '../screens/auth/LoginScreen';
// // // // // // // // // // // // // // // // // import SignupScreen from '../screens/auth/SignupScreen';
// // // // // // // // // // // // // // // // // import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';
// // // // // // // // // // // // // // // // // import CartScreen from '../screens/main/CartScreen';

// // // // // // // // // // // // // // // // // const Stack = createNativeStackNavigator();

// // // // // // // // // // // // // // // // // const AppNavigator: React.FC = () => {
// // // // // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // // // // //     <NavigationContainer>
// // // // // // // // // // // // // // // // //       <Stack.Navigator 
// // // // // // // // // // // // // // // // //         initialRouteName="Login"
// // // // // // // // // // // // // // // // //         screenOptions={{ headerShown: false }}
// // // // // // // // // // // // // // // // //       >
// // // // // // // // // // // // // // // // //         {/* Auth Screens */}
// // // // // // // // // // // // // // // // //         <Stack.Screen name="Login" component={LoginScreen} />
// // // // // // // // // // // // // // // // //         <Stack.Screen name="Signup" component={SignupScreen} />
        
// // // // // // // // // // // // // // // // //         {/* Main App with Tabs */}
// // // // // // // // // // // // // // // // //         <Stack.Screen name="MainTabs" component={TabNavigator} />
        
// // // // // // // // // // // // // // // // //         {/* Other Screens */}
// // // // // // // // // // // // // // // // //         <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
// // // // // // // // // // // // // // // // //         <Stack.Screen name="Cart" component={CartScreen} />
// // // // // // // // // // // // // // // // //       </Stack.Navigator>
// // // // // // // // // // // // // // // // //     </NavigationContainer>
// // // // // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // // // // };

// // // // // // // // // // // // // // // // // export default AppNavigator;
// // // // // // // // // // // // // // // // import React from 'react';
// // // // // // // // // // // // // // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // // // // // // // // // // // // // import { NavigationContainer } from '@react-navigation/native';
// // // // // // // // // // // // // // // // import LoginScreen from '../screens/auth/LoginScreen';
// // // // // // // // // // // // // // // // import SignupScreen from '../screens/auth/SignupScreen';
// // // // // // // // // // // // // // // // import TabNavigator from './TabNavigator';
// // // // // // // // // // // // // // // // import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';
// // // // // // // // // // // // // // // // import CartScreen from '../screens/main/CartScreen';

// // // // // // // // // // // // // // // // const Stack = createNativeStackNavigator();

// // // // // // // // // // // // // // // // const AppNavigator: React.FC = () => {
// // // // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // // // //     <NavigationContainer>
// // // // // // // // // // // // // // // //       <Stack.Navigator 
// // // // // // // // // // // // // // // //         initialRouteName="Login"
// // // // // // // // // // // // // // // //         screenOptions={{ headerShown: false }}
// // // // // // // // // // // // // // // //       >
// // // // // // // // // // // // // // // //         <Stack.Screen name="Login" component={LoginScreen} />
// // // // // // // // // // // // // // // //         <Stack.Screen name="Signup" component={SignupScreen} />
// // // // // // // // // // // // // // // //         <Stack.Screen name="MainTabs" component={TabNavigator} />
// // // // // // // // // // // // // // // //         <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
// // // // // // // // // // // // // // // //         <Stack.Screen name="Cart" component={CartScreen} />
// // // // // // // // // // // // // // // //       </Stack.Navigator>
// // // // // // // // // // // // // // // //     </NavigationContainer>
// // // // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // // // };

// // // // // // // // // // // // // // // // export default AppNavigator;
// // // // // // // // // // // // // // // import React, { useContext } from 'react';
// // // // // // // // // // // // // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // // // // // // // // // // // // import { NavigationContainer } from '@react-navigation/native';
// // // // // // // // // // // // // // // import LoginScreen from '../screens/auth/LoginScreen';
// // // // // // // // // // // // // // // import SignupScreen from '../screens/auth/SignupScreen';
// // // // // // // // // // // // // // // import TabNavigator from './TabNavigator';
// // // // // // // // // // // // // // // import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';
// // // // // // // // // // // // // // // import CartScreen from '../screens/main/CartScreen';
// // // // // // // // // // // // // // // import { AuthContext } from '../context/AuthContext';

// // // // // // // // // // // // // // // const Stack = createNativeStackNavigator();

// // // // // // // // // // // // // // // const AppNavigator: React.FC = () => {
// // // // // // // // // // // // // // //   const { isAuthenticated } = useContext(AuthContext);

// // // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // // //     <NavigationContainer>
// // // // // // // // // // // // // // //       <Stack.Navigator 
// // // // // // // // // // // // // // //         initialRouteName="Login"
// // // // // // // // // // // // // // //         screenOptions={{ headerShown: false }}
// // // // // // // // // // // // // // //       >
// // // // // // // // // // // // // // //         {!isAuthenticated ? (
// // // // // // // // // // // // // // //           <>
// // // // // // // // // // // // // // //             <Stack.Screen name="Login" component={LoginScreen} />
// // // // // // // // // // // // // // //             <Stack.Screen name="Signup" component={SignupScreen} />
// // // // // // // // // // // // // // //           </>
// // // // // // // // // // // // // // //         ) : (
// // // // // // // // // // // // // // //           <>
// // // // // // // // // // // // // // //             <Stack.Screen name="MainTabs" component={TabNavigator} />
// // // // // // // // // // // // // // //             <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
// // // // // // // // // // // // // // //             <Stack.Screen name="Cart" component={CartScreen} />
// // // // // // // // // // // // // // //           </>
// // // // // // // // // // // // // // //         )}
// // // // // // // // // // // // // // //       </Stack.Navigator>
// // // // // // // // // // // // // // //     </NavigationContainer>
// // // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // // };

// // // // // // // // // // // // // // // export default AppNavigator;
// // // // // // // // // // // // // // import React, { useContext, useEffect, useState } from 'react';
// // // // // // // // // // // // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // // // // // // // // // // // import { NavigationContainer } from '@react-navigation/native';
// // // // // // // // // // // // // // import { View, Text, ActivityIndicator } from 'react-native';
// // // // // // // // // // // // // // import LoginScreen from '../screens/auth/LoginScreen';
// // // // // // // // // // // // // // import SignupScreen from '../screens/auth/SignupScreen';
// // // // // // // // // // // // // // import TabNavigator from './TabNavigator';
// // // // // // // // // // // // // // import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';
// // // // // // // // // // // // // // import CartScreen from '../screens/main/CartScreen';
// // // // // // // // // // // // // // import { AuthContext } from '../context/AuthContext';

// // // // // // // // // // // // // // const Stack = createNativeStackNavigator();

// // // // // // // // // // // // // // const AppNavigator: React.FC = () => {
// // // // // // // // // // // // // //   const { isAuthenticated, loading } = useContext(AuthContext);
// // // // // // // // // // // // // //   const [initialRoute, setInitialRoute] = useState<string>('Login');

// // // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // // //     // Determine initial route based on URL and auth status
// // // // // // // // // // // // // //     if (typeof window !== 'undefined') {
// // // // // // // // // // // // // //       const path = window.location.pathname;
      
// // // // // // // // // // // // // //       if (path.includes('/login')) {
// // // // // // // // // // // // // //         setInitialRoute('Login');
// // // // // // // // // // // // // //       } else if (path.includes('/signup')) {
// // // // // // // // // // // // // //         setInitialRoute('Signup');
// // // // // // // // // // // // // //       } else if (isAuthenticated) {
// // // // // // // // // // // // // //         setInitialRoute('MainTabs');
// // // // // // // // // // // // // //       } else {
// // // // // // // // // // // // // //         setInitialRoute('Login');
// // // // // // // // // // // // // //       }
// // // // // // // // // // // // // //     } else {
// // // // // // // // // // // // // //       setInitialRoute(isAuthenticated ? 'MainTabs' : 'Login');
// // // // // // // // // // // // // //     }
// // // // // // // // // // // // // //   }, [isAuthenticated]);

// // // // // // // // // // // // // //   // Handle URL changes manually
// // // // // // // // // // // // // //   useEffect(() => {
// // // // // // // // // // // // // //     const handleUrlChange = () => {
// // // // // // // // // // // // // //       if (typeof window !== 'undefined') {
// // // // // // // // // // // // // //         const path = window.location.pathname;
// // // // // // // // // // // // // //         console.log('URL changed to:', path);
// // // // // // // // // // // // // //       }
// // // // // // // // // // // // // //     };

// // // // // // // // // // // // // //     if (typeof window !== 'undefined') {
// // // // // // // // // // // // // //       window.addEventListener('popstate', handleUrlChange);
// // // // // // // // // // // // // //     }
    
// // // // // // // // // // // // // //     return () => {
// // // // // // // // // // // // // //       if (typeof window !== 'undefined') {
// // // // // // // // // // // // // //         window.removeEventListener('popstate', handleUrlChange);
// // // // // // // // // // // // // //       }
// // // // // // // // // // // // // //     };
// // // // // // // // // // // // // //   }, []);

// // // // // // // // // // // // // //   if (loading) {
// // // // // // // // // // // // // //     return (
// // // // // // // // // // // // // //       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
// // // // // // // // // // // // // //         <ActivityIndicator size="large" color="#fc8019" />
// // // // // // // // // // // // // //         <Text style={{ marginTop: 10, color: '#666' }}>Loading...</Text>
// // // // // // // // // // // // // //       </View>
// // // // // // // // // // // // // //     );
// // // // // // // // // // // // // //   }

// // // // // // // // // // // // // //   return (
// // // // // // // // // // // // // //     <NavigationContainer>
// // // // // // // // // // // // // //       <Stack.Navigator 
// // // // // // // // // // // // // //         initialRouteName={initialRoute}
// // // // // // // // // // // // // //         screenOptions={{ headerShown: false }}
// // // // // // // // // // // // // //       >
// // // // // // // // // // // // // //         {!isAuthenticated ? (
// // // // // // // // // // // // // //           // Auth Screens - No bottom tabs
// // // // // // // // // // // // // //           <>
// // // // // // // // // // // // // //             <Stack.Screen name="Login" component={LoginScreen} />
// // // // // // // // // // // // // //             <Stack.Screen name="Signup" component={SignupScreen} />
// // // // // // // // // // // // // //           </>
// // // // // // // // // // // // // //         ) : (
// // // // // // // // // // // // // //           // Main App Screens - With bottom tabs
// // // // // // // // // // // // // //           <>
// // // // // // // // // // // // // //             <Stack.Screen name="MainTabs" component={TabNavigator} />
// // // // // // // // // // // // // //             <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
// // // // // // // // // // // // // //             <Stack.Screen name="Cart" component={CartScreen} />
// // // // // // // // // // // // // //           </>
// // // // // // // // // // // // // //         )}
// // // // // // // // // // // // // //       </Stack.Navigator>
// // // // // // // // // // // // // //     </NavigationContainer>
// // // // // // // // // // // // // //   );
// // // // // // // // // // // // // // };

// // // // // // // // // // // // // // export default AppNavigator;
// // // // // // // // // // // // // src/navigation/AppNavigator.js
// // // // // // // // // // // // // import React, { useContext } from 'react';
// // // // // // // // // // // // // import { NavigationContainer } from '@react-navigation/native';
// // // // // // // // // // // // // import { AuthContext } from '../context/AuthContext';
// // // // // // // // // // // // // import AuthNavigator from './AuthNavigator';
// // // // // // // // // // // // // import MainNavigator from './MainNavigator';

// // // // // // // // // // // // // export default function AppNavigator() {
// // // // // // // // // // // // //   const { isAuthenticated } = useContext(AuthContext);

// // // // // // // // // // // // //   return (
// // // // // // // // // // // // //     <NavigationContainer>
// // // // // // // // // // // // //       {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
// // // // // // // // // // // // //     </NavigationContainer>
// // // // // // // // // // // // //   );
// // // // // // // // // // // // // }
// // // // // // // // // // // // import React, { useContext } from 'react';
// // // // // // // // // // // // import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
// // // // // // // // // // // // import { AuthContext } from '../context/AuthContext';
// // // // // // // // // // // // import AuthNavigator from './AuthNavigator';
// // // // // // // // // // // // import MainNavigator from './MainNavigator';

// // // // // // // // // // // // const linking: LinkingOptions<any> = {
// // // // // // // // // // // //   prefixes: [],
// // // // // // // // // // // //   config: {
// // // // // // // // // // // //     screens: {
// // // // // // // // // // // //       Login: 'login',
// // // // // // // // // // // //       Signup: 'signup',
// // // // // // // // // // // //       ForgotPassword: 'forgot-password',
// // // // // // // // // // // //       Tabs: {
// // // // // // // // // // // //         screens: {
// // // // // // // // // // // //           Home: 'home',
// // // // // // // // // // // //           Search: 'search',
// // // // // // // // // // // //           Cart: 'cart',
// // // // // // // // // // // //           Orders: 'orders',
// // // // // // // // // // // //           Profile: 'profile',
// // // // // // // // // // // //         },
// // // // // // // // // // // //       },
// // // // // // // // // // // //       RestaurantDetail: 'restaurant',
// // // // // // // // // // // //       Checkout: 'checkout',
// // // // // // // // // // // //       OrderTracking: 'order-tracking',
// // // // // // // // // // // //     },
// // // // // // // // // // // //   },
// // // // // // // // // // // // };

// // // // // // // // // // // // export default function AppNavigator() {
// // // // // // // // // // // //   const { isAuthenticated } = useContext(AuthContext);

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <NavigationContainer linking={linking}>
// // // // // // // // // // // //       {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
// // // // // // // // // // // //     </NavigationContainer>
// // // // // // // // // // // //   );
// // // // // // // // // // // // }
// // // // // // // // // // // // import React, { useContext } from 'react';
// // // // // // // // // // // // import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
// // // // // // // // // // // // import { AuthContext } from '../context/AuthContext';
// // // // // // // // // // // // import AuthNavigator from './AuthNavigator';
// // // // // // // // // // // // import MainNavigator from './MainNavigator';

// // // // // // // // // // // // const linking: LinkingOptions<any> = {
// // // // // // // // // // // //   prefixes: [],
// // // // // // // // // // // //   config: {
// // // // // // // // // // // //     screens: {
// // // // // // // // // // // //       Login: '',
// // // // // // // // // // // //       Signup: 'signup',
// // // // // // // // // // // //       ForgotPassword: 'forgot-password',
// // // // // // // // // // // //       Tabs: {
// // // // // // // // // // // //         screens: {
// // // // // // // // // // // //           Home: 'home',
// // // // // // // // // // // //           Search: 'search',
// // // // // // // // // // // //           Cart: 'cart',
// // // // // // // // // // // //           Orders: 'orders',
// // // // // // // // // // // //           Profile: 'profile',
// // // // // // // // // // // //         },
// // // // // // // // // // // //       },
// // // // // // // // // // // //       RestaurantDetail: 'restaurant',
// // // // // // // // // // // //       Checkout: 'checkout',
// // // // // // // // // // // //       OrderTracking: 'order-tracking',
// // // // // // // // // // // //     },
// // // // // // // // // // // //   },
// // // // // // // // // // // // };

// // // // // // // // // // // // export default function AppNavigator() {
// // // // // // // // // // // //   const { isAuthenticated } = useContext(AuthContext);

// // // // // // // // // // // //   return (
// // // // // // // // // // // //     <NavigationContainer linking={linking}>
// // // // // // // // // // // //       {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
// // // // // // // // // // // //     </NavigationContainer>
// // // // // // // // // // // //   );
// // // // // // // // // // // // }
// // // // // // // // // // // import React, { useContext } from 'react';
// // // // // // // // // // // import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
// // // // // // // // // // // import { AuthContext } from '../context/AuthContext';
// // // // // // // // // // // import AuthNavigator from './AuthNavigator';
// // // // // // // // // // // import MainNavigator from './MainNavigator';

// // // // // // // // // // // const linking: LinkingOptions<any> = {
// // // // // // // // // // //   prefixes: [],
// // // // // // // // // // //   config: {
// // // // // // // // // // //     screens: {
// // // // // // // // // // //       Login: '',
// // // // // // // // // // //       Signup: 'signup',
// // // // // // // // // // //       ForgotPassword: 'forgot-password',
// // // // // // // // // // //       Tabs: {
// // // // // // // // // // //         screens: {
// // // // // // // // // // //           Home: 'home',
// // // // // // // // // // //           Search: 'search',
// // // // // // // // // // //           Cart: 'cart',
// // // // // // // // // // //           Orders: 'orders',
// // // // // // // // // // //           Profile: 'profile',
// // // // // // // // // // //         },
// // // // // // // // // // //       },
// // // // // // // // // // //       RestaurantDetail: 'restaurant/:restaurantId',
// // // // // // // // // // //        FoodDetail: 'food/:itemId',
// // // // // // // // // // //       MenuScreen: 'menu',
// // // // // // // // // // //       Checkout: 'checkout',
// // // // // // // // // // //       OrderTracking: 'order-tracking/:orderId',
// // // // // // // // // // //             OrderHistory: 'order-history',

// // // // // // // // // // //       Address: 'address',
// // // // // // // // // // //       Payment: 'payment',
// // // // // // // // // // //     },
// // // // // // // // // // //   },
// // // // // // // // // // // };

// // // // // // // // // // // export default function AppNavigator() {
// // // // // // // // // // //   const { isAuthenticated } = useContext(AuthContext);

// // // // // // // // // // //   return (
// // // // // // // // // // //     <NavigationContainer linking={linking}>
// // // // // // // // // // //       {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
// // // // // // // // // // //     </NavigationContainer>
// // // // // // // // // // //   );
// // // // // // // // // // // }
// // // // // // // // // // // delivery-app/src/navigation/AppNavigator.tsx
// // // // // // // // // // import React, { useContext } from 'react';
// // // // // // // // // // import { NavigationContainer } from '@react-navigation/native';
// // // // // // // // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // // // // // // // import { AuthContext } from '../context/AuthContext';

// // // // // // // // // // // Auth Screens
// // // // // // // // // // import LoginScreen from '../screens/auth/LoginScreen';
// // // // // // // // // // import SignupScreen from '../screens/auth/SignupScreen';

// // // // // // // // // // // Main Screens
// // // // // // // // // // import HomeScreen from '../screens/main/HomeScreen';           // ✅ screens/main/
// // // // // // // // // // import ProfileScreen from '../screens/main/ProfileScreen';     // ✅ screens/main/
// // // // // // // // // // import SearchScreen from '../screens/main/SearchScreen'; 
// // // // // // // // // // import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen'; // ✅ screens/restaurant/

// // // // // // // // // // const Stack = createNativeStackNavigator();

// // // // // // // // // // const AppNavigator = () => {
// // // // // // // // // //   const { user, loading } = useContext(AuthContext);

// // // // // // // // // //   if (loading) {
// // // // // // // // // //     // You can show a splash screen or loading indicator here
// // // // // // // // // //     return null;
// // // // // // // // // //   }

// // // // // // // // // //   return (
// // // // // // // // // //     <NavigationContainer>
// // // // // // // // // //       <Stack.Navigator
// // // // // // // // // //         screenOptions={{
// // // // // // // // // //           headerShown: false,
// // // // // // // // // //         }}
// // // // // // // // // //       >
// // // // // // // // // //         {user ? (
// // // // // // // // // //           // User is logged in - Show Main App
// // // // // // // // // //           <>
// // // // // // // // // //             <Stack.Screen name="Home" component={HomeScreen} />
// // // // // // // // // //             <Stack.Screen name="Profile" component={ProfileScreen} />
// // // // // // // // // //             <Stack.Screen name="Search" component={SearchScreen} />
// // // // // // // // // //             <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
// // // // // // // // // //           </>
// // // // // // // // // //         ) : (
// // // // // // // // // //           // User is NOT logged in - Show Auth Screens
// // // // // // // // // //           <>
// // // // // // // // // //             <Stack.Screen name="Login" component={LoginScreen} />
// // // // // // // // // //             <Stack.Screen name="Signup" component={SignupScreen} />
// // // // // // // // // //           </>
// // // // // // // // // //         )}
// // // // // // // // // //       </Stack.Navigator>
// // // // // // // // // //     </NavigationContainer>
// // // // // // // // // //   );
// // // // // // // // // // };

// // // // // // // // // // export default AppNavigator;
// // // // // // // // // // delivery-app/src/navigation/AppNavigator.tsx
// // // // // // // // // import React, { useContext } from 'react';
// // // // // // // // // import { NavigationContainer } from '@react-navigation/native';
// // // // // // // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // // // // // // import { AuthContext } from '../context/AuthContext';

// // // // // // // // // // Auth Screens
// // // // // // // // // import LoginScreen from '../screens/auth/LoginScreen';
// // // // // // // // // import SignupScreen from '../screens/auth/SignupScreen';

// // // // // // // // // // Main Screens
// // // // // // // // // import HomeScreen from '../screens/main/HomeScreen';
// // // // // // // // // import ProfileScreen from '../screens/main/ProfileScreen';
// // // // // // // // // import SearchScreen from '../screens/main/SearchScreen';
// // // // // // // // // import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';

// // // // // // // // // const Stack = createNativeStackNavigator();

// // // // // // // // // const AppNavigator = () => {
// // // // // // // // //   const { user, loading } = useContext(AuthContext);

// // // // // // // // //   if (loading) {
// // // // // // // // //     return null; // Or a loading screen
// // // // // // // // //   }

// // // // // // // // //   return (
// // // // // // // // //     <NavigationContainer>
// // // // // // // // //       <Stack.Navigator screenOptions={{ headerShown: false }}>
// // // // // // // // //         {user ? (
// // // // // // // // //           // ✅ User is logged in - Show Main App
// // // // // // // // //           <>
// // // // // // // // //             <Stack.Screen name="Home" component={HomeScreen} />
// // // // // // // // //             <Stack.Screen name="Profile" component={ProfileScreen} />
// // // // // // // // //             <Stack.Screen name="Search" component={SearchScreen} />
// // // // // // // // //             <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
// // // // // // // // //           </>
// // // // // // // // //         ) : (
// // // // // // // // //           // ✅ User is NOT logged in - Show Auth Screens
// // // // // // // // //           <>
// // // // // // // // //             <Stack.Screen name="Login" component={LoginScreen} />
// // // // // // // // //             <Stack.Screen name="Signup" component={SignupScreen} />
// // // // // // // // //           </>
// // // // // // // // //         )}
// // // // // // // // //       </Stack.Navigator>
// // // // // // // // //     </NavigationContainer>
// // // // // // // // //   );
// // // // // // // // // };

// // // // // // // // // export default AppNavigator;
// // // // // // // // // delivery-app/src/navigation/AppNavigator.tsx
// // // // // // // // import React, { useContext } from 'react';
// // // // // // // // import { NavigationContainer } from '@react-navigation/native';
// // // // // // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // // // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // // import { AuthContext } from '../context/AuthContext';

// // // // // // // // // Auth Screens
// // // // // // // // import LoginScreen from '../screens/auth/LoginScreen';
// // // // // // // // import SignupScreen from '../screens/auth/SignupScreen';

// // // // // // // // // Main Screens
// // // // // // // // import HomeScreen from '../screens/main/HomeScreen';
// // // // // // // // import ProfileScreen from '../screens/main/ProfileScreen';
// // // // // // // // import SearchScreen from '../screens/main/SearchScreen';
// // // // // // // // import CartScreen from '../screens/main/CartScreen';
// // // // // // // // import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';

// // // // // // // // const Stack = createNativeStackNavigator();
// // // // // // // // const Tab = createBottomTabNavigator();

// // // // // // // // // Tab Navigator Component
// // // // // // // // const MainTabs = () => {
// // // // // // // //   return (
// // // // // // // //     <Tab.Navigator
// // // // // // // //       screenOptions={({ route }) => ({
// // // // // // // //         headerShown: false,
// // // // // // // //         tabBarIcon: ({ focused, color, size }) => {
// // // // // // // //           let iconName: string = '';
          
// // // // // // // //           if (route.name === 'HomeTab') {
// // // // // // // //             iconName = focused ? 'home' : 'home-outline';
// // // // // // // //           } else if (route.name === 'SearchTab') {
// // // // // // // //             iconName = focused ? 'search' : 'search-outline';
// // // // // // // //           } else if (route.name === 'CartTab') {
// // // // // // // //             iconName = focused ? 'cart' : 'cart-outline';
// // // // // // // //           } else if (route.name === 'ProfileTab') {
// // // // // // // //             iconName = focused ? 'person' : 'person-outline';
// // // // // // // //           }
          
// // // // // // // //           return <Icon name={iconName} size={size} color={color} />;
// // // // // // // //         },
// // // // // // // //         tabBarActiveTintColor: '#1e90ff',
// // // // // // // //         tabBarInactiveTintColor: 'gray',
// // // // // // // //       })}
// // // // // // // //     >
// // // // // // // //       <Tab.Screen 
// // // // // // // //         name="HomeTab" 
// // // // // // // //         component={HomeScreen} 
// // // // // // // //         options={{ title: 'Home' }}
// // // // // // // //       />
// // // // // // // //       <Tab.Screen 
// // // // // // // //         name="SearchTab" 
// // // // // // // //         component={SearchScreen} 
// // // // // // // //         options={{ title: 'Search' }}
// // // // // // // //       />
// // // // // // // //       <Tab.Screen 
// // // // // // // //         name="CartTab" 
// // // // // // // //         component={CartScreen} 
// // // // // // // //         options={{ title: 'Cart' }}
// // // // // // // //       />
// // // // // // // //       <Tab.Screen 
// // // // // // // //         name="ProfileTab" 
// // // // // // // //         component={ProfileScreen} 
// // // // // // // //         options={{ title: 'Profile' }}
// // // // // // // //       />
// // // // // // // //     </Tab.Navigator>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // const AppNavigator = () => {
// // // // // // // //   const { user, loading } = useContext(AuthContext);

// // // // // // // //   if (loading) {
// // // // // // // //     return null; // Or a loading screen
// // // // // // // //   }

// // // // // // // //   return (
// // // // // // // //     <NavigationContainer>
// // // // // // // //       <Stack.Navigator screenOptions={{ headerShown: false }}>
// // // // // // // //         {user ? (
// // // // // // // //           // ✅ User is logged in - Show Main App with Tabs
// // // // // // // //           <>
// // // // // // // //             <Stack.Screen name="MainTabs" component={MainTabs} />
// // // // // // // //             <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
// // // // // // // //           </>
// // // // // // // //         ) : (
// // // // // // // //           // ✅ User is NOT logged in - Show Auth Screens
// // // // // // // //           <>
// // // // // // // //             <Stack.Screen name="Login" component={LoginScreen} />
// // // // // // // //             <Stack.Screen name="Signup" component={SignupScreen} />
// // // // // // // //           </>
// // // // // // // //         )}
// // // // // // // //       </Stack.Navigator>
// // // // // // // //     </NavigationContainer>
// // // // // // // //   );
// // // // // // // // };

// // // // // // // // export default AppNavigator;
// // // // // // // // delivery-app/src/navigation/AppNavigator.tsx
// // // // // // // import React, { useContext } from 'react';
// // // // // // // import { NavigationContainer } from '@react-navigation/native';
// // // // // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // // import { AuthContext } from '../context/AuthContext';

// // // // // // // // Auth Screens
// // // // // // // import LoginScreen from '../screens/auth/LoginScreen';
// // // // // // // import SignupScreen from '../screens/auth/SignupScreen';

// // // // // // // // Main Screens
// // // // // // // import HomeScreen from '../screens/main/HomeScreen';
// // // // // // // import ProfileScreen from '../screens/main/ProfileScreen';
// // // // // // // import SearchScreen from '../screens/main/SearchScreen';
// // // // // // // import CartScreen from '../screens/main/CartScreen';
// // // // // // // import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';

// // // // // // // const Stack = createNativeStackNavigator();
// // // // // // // const Tab = createBottomTabNavigator();

// // // // // // // // ✅ Tab Navigator - ONLY for Home Screen
// // // // // // // const HomeTabs = () => {
// // // // // // //   return (
// // // // // // //     <Tab.Navigator
// // // // // // //       screenOptions={({ route }) => ({
// // // // // // //         headerShown: false,
// // // // // // //         tabBarIcon: ({ focused, color, size }) => {
// // // // // // //           let iconName: string = '';
          
// // // // // // //           if (route.name === 'Home') {
// // // // // // //             iconName = focused ? 'home' : 'home-outline';
// // // // // // //           } else if (route.name === 'Search') {
// // // // // // //             iconName = focused ? 'search' : 'search-outline';
// // // // // // //           } else if (route.name === 'Cart') {
// // // // // // //             iconName = focused ? 'cart' : 'cart-outline';
// // // // // // //           } else if (route.name === 'Profile') {
// // // // // // //             iconName = focused ? 'person' : 'person-outline';
// // // // // // //           }
          
// // // // // // //           return <Icon name={iconName} size={size} color={color} />;
// // // // // // //         },
// // // // // // //         tabBarActiveTintColor: '#fc8019',
// // // // // // //         tabBarInactiveTintColor: '#7e808c',
// // // // // // //         tabBarStyle: {
// // // // // // //           backgroundColor: '#ffffff',
// // // // // // //           borderTopWidth: 1,
// // // // // // //           borderTopColor: '#f0f0f5',
// // // // // // //           height: 60,
// // // // // // //           paddingBottom: 8,
// // // // // // //           paddingTop: 8,
// // // // // // //         },
// // // // // // //         tabBarLabelStyle: {
// // // // // // //           fontSize: 11,
// // // // // // //           fontWeight: '500',
// // // // // // //         },
// // // // // // //       })}
// // // // // // //     >
// // // // // // //       <Tab.Screen 
// // // // // // //         name="Home" 
// // // // // // //         component={HomeScreen} 
// // // // // // //         options={{ title: 'Home' }}
// // // // // // //       />
// // // // // // //       <Tab.Screen 
// // // // // // //         name="Search" 
// // // // // // //         component={SearchScreen} 
// // // // // // //         options={{ title: 'Search' }}
// // // // // // //       />
// // // // // // //       <Tab.Screen 
// // // // // // //         name="Cart" 
// // // // // // //         component={CartScreen} 
// // // // // // //         options={{ title: 'Cart' }}
// // // // // // //       />
// // // // // // //       <Tab.Screen 
// // // // // // //         name="Profile" 
// // // // // // //         component={ProfileScreen} 
// // // // // // //         options={{ title: 'Profile' }}
// // // // // // //       />
// // // // // // //     </Tab.Navigator>
// // // // // // //   );
// // // // // // // };

// // // // // // // const AppNavigator = () => {
// // // // // // //   const { user, loading } = useContext(AuthContext);

// // // // // // //   if (loading) {
// // // // // // //     return null;
// // // // // // //   }

// // // // // // //   return (
// // // // // // //     <NavigationContainer>
// // // // // // //       <Stack.Navigator screenOptions={{ headerShown: false }}>
// // // // // // //         {user ? (
// // // // // // //           <>
// // // // // // //             {/* ✅ HomeTabs has bottom tabs */}
// // // // // // //             <Stack.Screen name="HomeTabs" component={HomeTabs} />
// // // // // // //             {/* ✅ These are stack screens - NO bottom tabs */}
// // // // // // //             <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
// // // // // // //           </>
// // // // // // //         ) : (
// // // // // // //           <>
// // // // // // //             <Stack.Screen name="Login" component={LoginScreen} />
// // // // // // //             <Stack.Screen name="Signup" component={SignupScreen} />
// // // // // // //           </>
// // // // // // //         )}
// // // // // // //       </Stack.Navigator>
// // // // // // //     </NavigationContainer>
// // // // // // //   );
// // // // // // // };

// // // // // // // export default AppNavigator;
// // // // // // // delivery-app/src/navigation/AppNavigator.tsx
// // // // // // import React, { useContext } from 'react';
// // // // // // import { NavigationContainer } from '@react-navigation/native';
// // // // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // // import { AuthContext } from '../context/AuthContext';

// // // // // // // Auth Screens
// // // // // // import LoginScreen from '../screens/auth/LoginScreen';
// // // // // // import SignupScreen from '../screens/auth/SignupScreen';

// // // // // // // Main Screens
// // // // // // import HomeScreen from '../screens/main/HomeScreen';
// // // // // // import ProfileScreen from '../screens/main/ProfileScreen';
// // // // // // import SearchScreen from '../screens/main/SearchScreen';
// // // // // // import CartScreen from '../screens/main/CartScreen';
// // // // // // import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';

// // // // // // const Stack = createNativeStackNavigator();
// // // // // // const Tab = createBottomTabNavigator();

// // // // // // // ✅ Tab Navigator - ONLY for Home Screen
// // // // // // const HomeTabs = () => {
// // // // // //   return (
// // // // // //     <Tab.Navigator
// // // // // //       screenOptions={({ route }) => ({
// // // // // //         headerShown: false,
// // // // // //         tabBarIcon: ({ focused, color, size }) => {
// // // // // //           let iconName: string = '';
          
// // // // // //           if (route.name === 'Home') {
// // // // // //             iconName = focused ? 'home' : 'home-outline';
// // // // // //           } else if (route.name === 'Search') {
// // // // // //             iconName = focused ? 'search' : 'search-outline';
// // // // // //           } else if (route.name === 'Cart') {
// // // // // //             iconName = focused ? 'cart' : 'cart-outline';
// // // // // //           } else if (route.name === 'Profile') {
// // // // // //             iconName = focused ? 'person' : 'person-outline';
// // // // // //           }
          
// // // // // //           return <Icon name={iconName} size={size} color={color} />;
// // // // // //         },
// // // // // //         tabBarActiveTintColor: '#fc8019',
// // // // // //         tabBarInactiveTintColor: '#7e808c',
// // // // // //         tabBarStyle: {
// // // // // //           backgroundColor: '#ffffff',
// // // // // //           borderTopWidth: 1,
// // // // // //           borderTopColor: '#f0f0f5',
// // // // // //           height: 60,
// // // // // //           paddingBottom: 8,
// // // // // //           paddingTop: 8,
// // // // // //         },
// // // // // //         tabBarLabelStyle: {
// // // // // //           fontSize: 11,
// // // // // //           fontWeight: '500',
// // // // // //         },
// // // // // //       })}
// // // // // //     >
// // // // // //       <Tab.Screen 
// // // // // //         name="Home" 
// // // // // //         component={HomeScreen} 
// // // // // //         options={{ title: 'Home' }}
// // // // // //       />
// // // // // //       <Tab.Screen 
// // // // // //         name="Search" 
// // // // // //         component={SearchScreen} 
// // // // // //         options={{ title: 'Search' }}
// // // // // //       />
// // // // // //       <Tab.Screen 
// // // // // //         name="Cart" 
// // // // // //         component={CartScreen} 
// // // // // //         options={{ title: 'Cart' }}
// // // // // //       />
// // // // // //       <Tab.Screen 
// // // // // //         name="Profile" 
// // // // // //         component={ProfileScreen} 
// // // // // //         options={{ title: 'Profile' }}
// // // // // //       />
// // // // // //     </Tab.Navigator>
// // // // // //   );
// // // // // // };

// // // // // // const AppNavigator = () => {
// // // // // //   const { user, loading } = useContext(AuthContext);

// // // // // //   if (loading) {
// // // // // //     return null;
// // // // // //   }

// // // // // //   return (
// // // // // //     <NavigationContainer>
// // // // // //       <Stack.Navigator screenOptions={{ headerShown: false }}>
// // // // // //         {user ? (
// // // // // //           <>
// // // // // //             {/* ✅ HomeTabs has bottom tabs */}
// // // // // //             <Stack.Screen name="HomeTabs" component={HomeTabs} />
// // // // // //             {/* ✅ These are stack screens - NO bottom tabs */}
// // // // // //             <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
// // // // // //           </>
// // // // // //         ) : (
// // // // // //           <>
// // // // // //             <Stack.Screen name="Login" component={LoginScreen} />
// // // // // //             <Stack.Screen name="Signup" component={SignupScreen} />
// // // // // //           </>
// // // // // //         )}
// // // // // //       </Stack.Navigator>
// // // // // //     </NavigationContainer>
// // // // // //   );
// // // // // // };

// // // // // // export default AppNavigator;
// // // // // // delivery-app/src/navigation/AppNavigator.tsx
// // // // // import React, { useContext } from 'react';
// // // // // import { NavigationContainer } from '@react-navigation/native';
// // // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // // import { AuthContext } from '../context/AuthContext';

// // // // // // Auth Screens
// // // // // import LoginScreen from '../screens/auth/LoginScreen';
// // // // // import SignupScreen from '../screens/auth/SignupScreen';

// // // // // // Main Screens
// // // // // import HomeScreen from '../screens/main/HomeScreen';
// // // // // import ProfileScreen from '../screens/main/ProfileScreen';
// // // // // import SearchScreen from '../screens/main/SearchScreen';
// // // // // import CartScreen from '../screens/main/CartScreen';
// // // // // import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';

// // // // // const Stack = createNativeStackNavigator();
// // // // // const Tab = createBottomTabNavigator();

// // // // // // ✅ Tab Navigator - ONLY for Home Screen (shows bottom tabs)
// // // // // const HomeTabs = () => {
// // // // //   return (
// // // // //     <Tab.Navigator
// // // // //       screenOptions={({ route }) => ({
// // // // //         headerShown: false,
// // // // //         tabBarIcon: ({ focused, color, size }) => {
// // // // //           let iconName: string = '';
          
// // // // //           if (route.name === 'Home') {
// // // // //             iconName = focused ? 'home' : 'home-outline';
// // // // //           } else if (route.name === 'Search') {
// // // // //             iconName = focused ? 'search' : 'search-outline';
// // // // //           } else if (route.name === 'Cart') {
// // // // //             iconName = focused ? 'cart' : 'cart-outline';
// // // // //           } else if (route.name === 'Profile') {
// // // // //             iconName = focused ? 'person' : 'person-outline';
// // // // //           }
          
// // // // //           return <Icon name={iconName} size={size} color={color} />;
// // // // //         },
// // // // //         tabBarActiveTintColor: '#fc8019',
// // // // //         tabBarInactiveTintColor: '#7e808c',
// // // // //         tabBarStyle: {
// // // // //           backgroundColor: '#ffffff',
// // // // //           borderTopWidth: 1,
// // // // //           borderTopColor: '#f0f0f5',
// // // // //           height: 60,
// // // // //           paddingBottom: 8,
// // // // //           paddingTop: 8,
// // // // //         },
// // // // //         tabBarLabelStyle: {
// // // // //           fontSize: 11,
// // // // //           fontWeight: '500',
// // // // //         },
// // // // //       })}
// // // // //     >
// // // // //       <Tab.Screen 
// // // // //         name="Home" 
// // // // //         component={HomeScreen} 
// // // // //         options={{ title: 'Home' }}
// // // // //       />
// // // // //       <Tab.Screen 
// // // // //         name="Search" 
// // // // //         component={SearchScreen} 
// // // // //         options={{ title: 'Search' }}
// // // // //       />
// // // // //       <Tab.Screen 
// // // // //         name="Cart" 
// // // // //         component={CartScreen} 
// // // // //         options={{ title: 'Cart' }}
// // // // //       />
// // // // //       <Tab.Screen 
// // // // //         name="Profile" 
// // // // //         component={ProfileScreen} 
// // // // //         options={{ title: 'Profile' }}
// // // // //       />
// // // // //     </Tab.Navigator>
// // // // //   );
// // // // // };

// // // // // const AppNavigator = () => {
// // // // //   const { user, loading } = useContext(AuthContext);

// // // // //   if (loading) {
// // // // //     return null;
// // // // //   }

// // // // //   return (
// // // // //     <NavigationContainer>
// // // // //       <Stack.Navigator screenOptions={{ headerShown: false }}>
// // // // //         {user ? (
// // // // //           <>
// // // // //             <Stack.Screen name="HomeTabs" component={HomeTabs} />
// // // // //             <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
// // // // //           </>
// // // // //         ) : (
// // // // //           <>
// // // // //             <Stack.Screen name="Login" component={LoginScreen} />
// // // // //             <Stack.Screen name="Signup" component={SignupScreen} />
// // // // //           </>
// // // // //         )}
// // // // //       </Stack.Navigator>
// // // // //     </NavigationContainer>
// // // // //   );
// // // // // };

// // // // // export default AppNavigator;
// // // // // delivery-app/src/navigation/AppNavigator.tsx
// // // // import React, { useContext } from 'react';
// // // // import { NavigationContainer } from '@react-navigation/native';
// // // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // // import Icon from 'react-native-vector-icons/Ionicons';
// // // // import { AuthContext } from '../context/AuthContext';

// // // // // Auth Screens
// // // // import LoginScreen from '../screens/auth/LoginScreen';
// // // // import SignupScreen from '../screens/auth/SignupScreen';

// // // // // Main Screens
// // // // import HomeScreen from '../screens/main/HomeScreen';
// // // // import ProfileScreen from '../screens/main/ProfileScreen';
// // // // import SearchScreen from '../screens/main/SearchScreen';
// // // // import CartScreen from '../screens/main/CartScreen';
// // // // import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';
// // // // import OrdersScreen from '../screens/main/OrdersScreen'; // ✅ ADD THIS

// // // // const Stack = createNativeStackNavigator();
// // // // const Tab = createBottomTabNavigator();

// // // // // ✅ Tab Navigator
// // // // const HomeTabs = () => {
// // // //   return (
// // // //     <Tab.Navigator
// // // //       screenOptions={({ route }) => ({
// // // //         headerShown: false,
// // // //         tabBarIcon: ({ focused, color, size }) => {
// // // //           let iconName: string = '';
          
// // // //           if (route.name === 'Home') {
// // // //             iconName = focused ? 'home' : 'home-outline';
// // // //           } else if (route.name === 'Search') {
// // // //             iconName = focused ? 'search' : 'search-outline';
// // // //           } else if (route.name === 'Cart') {
// // // //             iconName = focused ? 'cart' : 'cart-outline';
// // // //           } else if (route.name === 'Profile') {
// // // //             iconName = focused ? 'person' : 'person-outline';
// // // //           }
          
// // // //           return <Icon name={iconName} size={size} color={color} />;
// // // //         },
// // // //         tabBarActiveTintColor: '#fc8019',
// // // //         tabBarInactiveTintColor: '#7e808c',
// // // //         tabBarStyle: {
// // // //           backgroundColor: '#ffffff',
// // // //           borderTopWidth: 1,
// // // //           borderTopColor: '#f0f0f5',
// // // //           height: 60,
// // // //           paddingBottom: 8,
// // // //           paddingTop: 8,
// // // //         },
// // // //         tabBarLabelStyle: {
// // // //           fontSize: 11,
// // // //           fontWeight: '500',
// // // //         },
// // // //       })}
// // // //     >
// // // //       <Tab.Screen 
// // // //         name="Home" 
// // // //         component={HomeScreen} 
// // // //         options={{ title: 'Home' }}
// // // //       />
// // // //       <Tab.Screen 
// // // //         name="Search" 
// // // //         component={SearchScreen} 
// // // //         options={{ title: 'Search' }}
// // // //       />
// // // //       <Tab.Screen 
// // // //         name="Cart" 
// // // //         component={CartScreen} 
// // // //         options={{ title: 'Cart' }}
// // // //       />
// // // //       <Tab.Screen 
// // // //         name="Profile" 
// // // //         component={ProfileScreen} 
// // // //         options={{ title: 'Profile' }}
// // // //       />
// // // //     </Tab.Navigator>
// // // //   );
// // // // };

// // // // const AppNavigator = () => {
// // // //   const { user, loading } = useContext(AuthContext);

// // // //   if (loading) {
// // // //     return null;
// // // //   }

// // // //   return (
// // // //     <NavigationContainer>
// // // //       <Stack.Navigator screenOptions={{ headerShown: false }}>
// // // //         {user ? (
// // // //           <>
// // // //             <Stack.Screen name="HomeTabs" component={HomeTabs} />
// // // //             <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
// // // //             <Stack.Screen name="Orders" component={OrdersScreen} /> {/* ✅ ADD THIS */}
// // // //           </>
// // // //         ) : (
// // // //           <>
// // // //             <Stack.Screen name="Login" component={LoginScreen} />
// // // //             <Stack.Screen name="Signup" component={SignupScreen} />
// // // //           </>
// // // //         )}
// // // //       </Stack.Navigator>
// // // //     </NavigationContainer>
// // // //   );
// // // // };

// // // // export default AppNavigator;
// // // // delivery-app/src/navigation/AppNavigator.tsx
// // // import React, { useContext } from 'react';
// // // import { NavigationContainer } from '@react-navigation/native';
// // // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // // import Icon from 'react-native-vector-icons/Ionicons';
// // // import { AuthContext } from '../context/AuthContext';

// // // // Auth Screens
// // // import LoginScreen from '../screens/auth/LoginScreen';
// // // import SignupScreen from '../screens/auth/SignupScreen';

// // // // Main Screens
// // // import HomeScreen from '../screens/main/HomeScreen';
// // // import ProfileScreen from '../screens/main/ProfileScreen';
// // // import SearchScreen from '../screens/main/SearchScreen';
// // // import CartScreen from '../screens/main/CartScreen';
// // // import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';
// // // import OrdersScreen from '../screens/main/OrdersScreen';

// // // const Stack = createNativeStackNavigator();
// // // const Tab = createBottomTabNavigator();

// // // // ✅ Tab Navigator
// // // const HomeTabs = () => {
// // //   return (
// // //     <Tab.Navigator
// // //       screenOptions={({ route }) => ({
// // //         headerShown: false,
// // //         tabBarIcon: ({ focused, color, size }) => {
// // //           let iconName: string = '';
          
// // //           if (route.name === 'Home') {
// // //             iconName = focused ? 'home' : 'home-outline';
// // //           } else if (route.name === 'Search') {
// // //             iconName = focused ? 'search' : 'search-outline';
// // //           } else if (route.name === 'Cart') {
// // //             iconName = focused ? 'cart' : 'cart-outline';
// // //           } else if (route.name === 'Profile') {
// // //             iconName = focused ? 'person' : 'person-outline';
// // //           }
          
// // //           return <Icon name={iconName} size={size} color={color} />;
// // //         },
// // //         tabBarActiveTintColor: '#fc8019',
// // //         tabBarInactiveTintColor: '#7e808c',
// // //         tabBarStyle: {
// // //           backgroundColor: '#ffffff',
// // //           borderTopWidth: 1,
// // //           borderTopColor: '#f0f0f5',
// // //           height: 60,
// // //           paddingBottom: 8,
// // //           paddingTop: 8,
// // //         },
// // //         tabBarLabelStyle: {
// // //           fontSize: 11,
// // //           fontWeight: '500',
// // //         },
// // //       })}
// // //     >
// // //       <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
// // //       <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
// // //       <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
// // //       <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
// // //     </Tab.Navigator>
// // //   );
// // // };

// // // const AppNavigator = () => {
// // //   const { user, loading } = useContext(AuthContext);

// // //   if (loading) {
// // //     return null;
// // //   }

// // //   return (
// // //     <NavigationContainer>
// // //       <Stack.Navigator screenOptions={{ headerShown: false }}>
// // //         {user ? (
// // //           <>
// // //             <Stack.Screen name="HomeTabs" component={HomeTabs} />
// // //             <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
// // //             <Stack.Screen name="Orders" component={OrdersScreen} />
// // //           </>
// // //         ) : (
// // //           <>
// // //             <Stack.Screen name="Login" component={LoginScreen} />
// // //             <Stack.Screen name="Signup" component={SignupScreen} />
// // //           </>
// // //         )}
// // //       </Stack.Navigator>
// // //     </NavigationContainer>
// // //   );
// // // };

// // // export default AppNavigator;
// // // delivery-app/src/navigation/AppNavigator.tsx
// // import React, { useContext } from 'react';
// // import { NavigationContainer } from '@react-navigation/native';
// // import { createNativeStackNavigator } from '@react-navigation/native-stack';
// // import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// // import Icon from 'react-native-vector-icons/Ionicons';
// // import { AuthContext } from '../context/AuthContext';

// // // Auth Screens
// // import LoginScreen from '../screens/auth/LoginScreen';
// // import SignupScreen from '../screens/auth/SignupScreen';

// // // Main Screens
// // import HomeScreen from '../screens/main/HomeScreen';
// // import ProfileScreen from '../screens/main/ProfileScreen';
// // import SearchScreen from '../screens/main/SearchScreen';
// // import CartScreen from '../screens/main/CartScreen';
// // import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';
// // import OrdersScreen from '../screens/main/OrdersScreen';
// // // import OrderTrackingScreen from '../screens/main/OrderTrackingScreen'; 
// // import OrderTrackingScreen from '../screens/order/OrderTrackingScreen';
// // const Stack = createNativeStackNavigator();
// // const Tab = createBottomTabNavigator();

// // // ✅ Tab Navigator
// // const HomeTabs = () => {
// //   return (
// //     <Tab.Navigator
// //       screenOptions={({ route }) => ({
// //         headerShown: false,
// //         tabBarIcon: ({ focused, color, size }) => {
// //           let iconName: string = '';
          
// //           if (route.name === 'Home') {
// //             iconName = focused ? 'home' : 'home-outline';
// //           } else if (route.name === 'Search') {
// //             iconName = focused ? 'search' : 'search-outline';
// //           } else if (route.name === 'Cart') {
// //             iconName = focused ? 'cart' : 'cart-outline';
// //           } else if (route.name === 'Profile') {
// //             iconName = focused ? 'person' : 'person-outline';
// //           }
          
// //           return <Icon name={iconName} size={size} color={color} />;
// //         },
// //         tabBarActiveTintColor: '#fc8019',
// //         tabBarInactiveTintColor: '#7e808c',
// //         tabBarStyle: {
// //           backgroundColor: '#ffffff',
// //           borderTopWidth: 1,
// //           borderTopColor: '#f0f0f5',
// //           height: 60,
// //           paddingBottom: 8,
// //           paddingTop: 8,
// //         },
// //         tabBarLabelStyle: {
// //           fontSize: 11,
// //           fontWeight: '500',
// //         },
// //       })}
// //     >
// //       <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
// //       <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
// //       <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
// //       <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
// //     </Tab.Navigator>
// //   );
// // };

// // const AppNavigator = () => {
// //   const { user, loading } = useContext(AuthContext);

// //   if (loading) {
// //     return null;
// //   }

// //   return (
// //     <NavigationContainer>
// //       <Stack.Navigator screenOptions={{ headerShown: false }}>
// //         {user ? (
// //           <>
// //             <Stack.Screen name="HomeTabs" component={HomeTabs} />
// //             <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
// //             <Stack.Screen name="Orders" component={OrdersScreen} />
// //             <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
// //           </>
// //         ) : (
// //           <>
// //             <Stack.Screen name="Login" component={LoginScreen} />
// //             <Stack.Screen name="Signup" component={SignupScreen} />
// //           </>
// //         )}
// //       </Stack.Navigator>
// //     </NavigationContainer>
// //   );
// // };

// // export default function AppNavigator() {
// //   const { isAuthenticated } = useContext(AuthContext);

// //   return (
// //     <NavigationContainer linking={linking}>
// //       {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
// //     </NavigationContainer>
// //   );
// // }
// // import React, { useContext } from 'react';
// // import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
// // import { AuthContext } from '../context/AuthContext';
// // import AuthNavigator from './AuthNavigator';
// // import MainNavigator from './MainNavigator';

// // const linking: LinkingOptions<any> = {
// //   prefixes: [],
// //   config: {
// //     screens: {
// //       Login: '',
// //       Signup: 'signup',
// //       ForgotPassword: 'forgot-password',
// //       Tabs: {
// //         screens: {
// //           Home: 'home',
// //           Search: 'search',
// //           Cart: 'cart',
// //           Orders: 'orders',
// //           Profile: 'profile',
// //         },
// //       },
// //       RestaurantDetail: 'restaurant/:restaurantId',
// //        FoodDetail: 'food/:itemId',
// //       MenuScreen: 'menu',
// //       Checkout: 'checkout',
// //       OrderTracking: 'order-tracking/:orderId',
// //             OrderHistory: 'order-history',

// //       Address: 'address',
// //       Payment: 'payment',
// //     },
// //   },
// // };

// // export default function AppNavigator() {
// //   const { isAuthenticated } = useContext(AuthContext);

// //   return (
// //     <NavigationContainer linking={linking}>
// //       {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
// //     </NavigationContainer>
// //   );
// // }

// // export default AppNavigator;

// import React, { useContext } from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import Icon from 'react-native-vector-icons/Ionicons';
// import { AuthContext } from '../context/AuthContext';

// import { DriverAuthContext } from '../context/DriverAuthContext';
// import AuthNavigator from './AuthNavigator';
// import MainNavigator from './MainNavigator';
// import DriverMainNavigator from './DriverMainNavigator';

// const linking: LinkingOptions<any> = {
//   prefixes: [],
//   config: {
//     screens: {
//       Login: '',
//       Signup: 'signup',
//       ForgotPassword: 'forgot-password',
//       StaffLogin: 'staff-login',
//       StaffOtp: 'staff-otp',
//       DriverHome: 'driver-home',
//       Tabs: {
//         screens: {
//           Home: 'home',
//           Search: 'search',
//           Cart: 'cart',
//           Orders: 'orders',
//           Profile: 'profile',
//         },
//       },
//       RestaurantDetail: 'restaurant/:restaurantId',
//       FoodDetail: 'food/:itemId',
//       MenuScreen: 'menu',
//       Checkout: 'checkout',
//       OrderTracking: 'order-tracking/:orderId',
//       OrderHistory: 'order-history',
//       Address: 'address',
//       Payment: 'payment',
//     },
//   },
// };

// export default function AppNavigator() {
//   const { isAuthenticated } = useContext(AuthContext);
//   const { isDriverAuthenticated, loading: driverLoading } = useContext(DriverAuthContext);

//   // Wait for driver auth check to finish before deciding what to show —
//   // otherwise a logged-in driver briefly flashes the Auth screen on reload.
//   if (driverLoading) return null;

//   return (
//     <NavigationContainer linking={linking}>
//       {isDriverAuthenticated ? (
//         <DriverMainNavigator />
//       ) : isAuthenticated ? (
//         <MainNavigator />
//       ) : (
//         <AuthNavigator />
//       )}


// // Auth Screens
// import LoginScreen from '../screens/auth/LoginScreen';
// import SignupScreen from '../screens/auth/SignupScreen';

// // Main Screens
// import HomeScreen from '../screens/main/HomeScreen';
// import ProfileScreen from '../screens/main/ProfileScreen';
// import SearchScreen from '../screens/main/SearchScreen';
// import CartScreen from '../screens/main/CartScreen';
// import RestaurantDetailScreen from '../screens/restaurant/RestaurantDetailScreen';
// // import OrdersScreen from '../screens/main/OrdersScreen';
// import OrdersScreen from '../screens/main/OrdersScreen';
// import OrderTrackingScreen from '../screens/order/OrderTrackingScreen';
// import OrderSuccessScreen from '../screens/order/OrderSuccessScreen';

// // ✅ IMPORT Address Selection and Payment Screens
// import AddressSelectionScreen from '../screens/checkout/AddressSelectionScreen';
// // import PaymentScreen from '../screens/checkout/PaymentScreen';
// import PaymentScreen from '../screens/checkout/PaymentScreen';
// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();

// // ✅ Tab Navigator
// const HomeTabs = () => {
//   return (
//     <Tab.Navigator
//       screenOptions={({ route }) => ({
//         headerShown: false,
//         tabBarIcon: ({ focused, color, size }) => {
//           let iconName: string = '';
          
//           if (route.name === 'Home') {
//             iconName = focused ? 'home' : 'home-outline';
//           } else if (route.name === 'Search') {
//             iconName = focused ? 'search' : 'search-outline';
//           } else if (route.name === 'Cart') {
//             iconName = focused ? 'cart' : 'cart-outline';
//           } else if (route.name === 'Profile') {
//             iconName = focused ? 'person' : 'person-outline';
//           }
          
//           return <Icon name={iconName} size={size} color={color} />;
//         },
//         tabBarActiveTintColor: '#fc8019',
//         tabBarInactiveTintColor: '#7e808c',
//         tabBarStyle: {
//           backgroundColor: '#ffffff',
//           borderTopWidth: 1,
//           borderTopColor: '#f0f0f5',
//           height: 60,
//           paddingBottom: 8,
//           paddingTop: 8,
//         },
//         tabBarLabelStyle: {
//           fontSize: 11,
//           fontWeight: '500',
//         },
//       })}
//     >
//       <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home' }} />
//       <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} />
//       <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
//       <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
//     </Tab.Navigator>
//   );
// };

// const AppNavigator = () => {
//   const { user, loading } = useContext(AuthContext);

//   if (loading) {
//     return null;
//   }

//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }}>
//         {user ? (
//           <>
//             {/* ✅ Tab Navigator - Contains CartScreen */}
//             <Stack.Screen name="HomeTabs" component={HomeTabs} />
            
//             {/* ✅ Add AddressSelection HERE - in the same Stack as HomeTabs */}
//             <Stack.Screen name="AddressSelection" component={AddressSelectionScreen} />
            
//             {/* ✅ Add PaymentScreen HERE */}
//             <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
            
//             {/* ✅ Add OrderSuccess HERE */}
//             <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
            
//             {/* Your other screens */}
//             <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
//             <Stack.Screen name="Orders" component={OrdersScreen} />
//             <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
//           </>
//         ) : (
//           <>
//             <Stack.Screen name="Login" component={LoginScreen} />
//             <Stack.Screen name="Signup" component={SignupScreen} />
//           </>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// export default AppNavigator;

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
import SearchScreen from '../screens/main/SearchScreen';
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

          // if (route.name === 'Home') {
          //   iconName = focused ? 'home' : 'home-outline';
          // } else if (route.name === 'Search') {
          //   iconName = focused ? 'search' : 'search-outline';
          // } else if (route.name === 'Cart') {
          //   iconName = focused ? 'cart' : 'cart-outline';
          // } else if (route.name === 'Profile') {
          //   iconName = focused ? 'person' : 'person-outline';
          // }
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
      {/* <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Search' }} /> */}
      <Tab.Screen name="Cart" component={CartScreen} options={{ title: 'Cart' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

// Stack for the logged-in customer: tabs + all the screens layered on top of them
const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeTabs" component={HomeTabs} />
        <Stack.Screen name="Search" component={SearchScreen} /> 
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