<<<<<<< HEAD
=======
// // // import React from 'react';
// // // import { NavigationContainer } from '@react-navigation/native';
// // // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // // import { AuthProvider } from './src/context/AuthContext';
// // // import { CartProvider } from './src/context/CartContext';
// // // import { OrderProvider } from './src/context/OrderContext';
// // // import AppNavigator from './src/navigation/AppNavigator';

// // // const App: React.FC = () => {
// // //   return (
// // //     <SafeAreaProvider>
// // //       <AuthProvider>
// // //         <CartProvider>
// // //           <OrderProvider>
// // //             <NavigationContainer>
// // //               <AppNavigator />
// // //             </NavigationContainer>
// // //           </OrderProvider>
// // //         </CartProvider>
// // //       </AuthProvider>
// // //     </SafeAreaProvider>
// // //   );
// // // };

// // // export default App;
// // import React from 'react';
// // import { NavigationContainer, LinkingOptions } from '@react-navigation/native';
// // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // import { AuthProvider } from './src/context/AuthContext';
// // import { CartProvider } from './src/context/CartContext';
// // import { OrderProvider } from './src/context/OrderContext';
// // import AppNavigator from './src/navigation/AppNavigator';

// // const linking: LinkingOptions<any> = {
// //   prefixes: [],
// //   config: {
// //     screens: {
// //       Login: 'login',
// //       Signup: 'signup',
// //       Home: 'home',
// //       Search: 'search',
// //       RestaurantDetail: 'restaurant',
// //       Cart: 'cart',
// //       Profile: 'profile',
// //     },
// //   },
// // };

// // const App: React.FC = () => {
// //   return (
// //     <SafeAreaProvider>
// //       <AuthProvider>
// //         <CartProvider>
// //           <OrderProvider>
// //             <NavigationContainer linking={linking}>
// //               <AppNavigator />
// //             </NavigationContainer>
// //           </OrderProvider>
// //         </CartProvider>
// //       </AuthProvider>
// //     </SafeAreaProvider>
// //   );
// // };

// // export default App;
// // // // import React from 'react';
// // // // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // // // import { NavigationContainer } from '@react-navigation/native';
// // // // import { AuthProvider } from './src/context/AuthContext';
// // // // import { CartProvider } from './src/context/CartContext';
// // // // import { OrderProvider } from './src/context/OrderContext';
// // // // import TabNavigator from './src/navigation/TabNavigator';

// // // // const App: React.FC = () => {
// // // //   return (
// // // //     <SafeAreaProvider>
// // // //       <AuthProvider>
// // // //         <CartProvider>
// // // //           <OrderProvider>
// // // //             <NavigationContainer>
// // // //               <TabNavigator />
// // // //             </NavigationContainer>
// // // //           </OrderProvider>
// // // //         </CartProvider>
// // // //       </AuthProvider>
// // // //     </SafeAreaProvider>
// // // //   );
// // // // };

// // // // export default App;
// // // import React from 'react';
// // // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // // import { AuthProvider } from './src/context/AuthContext';
// // // import { CartProvider } from './src/context/CartContext';
// // // import { OrderProvider } from './src/context/OrderContext';
// // // import AppNavigator from './src/navigation/AppNavigator';

// // // const App: React.FC = () => {
// // //   return (
// // //     <SafeAreaProvider>
// // //       <AuthProvider>
// // //         <CartProvider>
// // //           <OrderProvider>
// // //             <AppNavigator />
// // //           </OrderProvider>
// // //         </CartProvider>
// // //       </AuthProvider>
// // //     </SafeAreaProvider>
// // //   );
// // // };

// // // export default App;
// // // import React from 'react';
// // // import { SafeAreaProvider } from 'react-native-safe-area-context';
// // // import { AuthProvider } from './src/context/AuthContext';
// // // import { CartProvider } from './src/context/CartContext';
// // // import { OrderProvider } from './src/context/OrderContext';
// // // import AppNavigator from './src/navigation/AppNavigator';

// // // const App: React.FC = () => {
// // //   return (
// // //     <SafeAreaProvider>
// // //       <AuthProvider>
// // //         <CartProvider>
// // //           <OrderProvider>
// // //             <AppNavigator />
// // //           </OrderProvider>
// // //         </CartProvider>
// // //       </AuthProvider>
// // //     </SafeAreaProvider>
// // //   );
// // // };

// // // export default App;




>>>>>>> ac6bd4bc2969a1a1e43e3d7b270890302ced70d2
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { OrderProvider } from './src/context/OrderContext';
import { AddressProvider } from './src/context/AddressContext';
import { DeliveryProvider } from './src/context/DeliveryContext';
import { DriverAuthProvider } from './src/context/DriverAuthContext';

import AppNavigator from './src/navigation/AppNavigator';
import { setBaseUrl, setAuthTokenGetter } from '@workspace/api-client-react';
import { getDriverToken } from './src/utils/storage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

setBaseUrl(process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000');

// Attach the driver's auth token to every Orval-generated API call
// (useGetDriver, useGetDriverStats, useListDeliveries, etc.)
setAuthTokenGetter(async () => {
  const token = await getDriverToken();
  return token ?? null;
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <AuthProvider>
          <DriverAuthProvider>
            <AddressProvider>
              <CartProvider>
                <OrderProvider>
                  <DeliveryProvider>
                    <AppNavigator />
                  </DeliveryProvider>
                </OrderProvider>
              </CartProvider>
            </AddressProvider>
          </DriverAuthProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
};

export default App;
// delivery-app/App.tsx
