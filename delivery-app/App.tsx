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