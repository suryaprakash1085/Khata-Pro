import React, { useEffect } from 'react';
import { View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { setBaseUrl } from '@workspace/api-client-react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { BusinessProvider, useBusiness } from '@/contexts/BusinessContext';
import { useColors } from '@/hooks/useColors';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

setBaseUrl(`https://${process.env.EXPO_PUBLIC_DOMAIN}`);

const queryClient = new QueryClient();

function RootLayoutNav() {
  const colors = useColors();
  const { isLoading: authLoading, user } = useAuth();
  const { isLoading: bizLoading, hasBusiness } = useBusiness();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    const top = segments[0] as string | undefined;
    const inLogin = top === 'login';
    const inBusinessSetup = top === 'business-setup';

    if (!user) {
      if (!inLogin) router.replace('/login');
      return;
    }

    if (bizLoading) return;

    if (!hasBusiness) {
      if (!inBusinessSetup) router.replace('/business-setup');
      return;
    }

    if (inLogin || inBusinessSetup) {
      router.replace('/(tabs)');
    }
  }, [authLoading, user, bizLoading, hasBusiness, segments]);

  if (authLoading) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  return (
    <Stack screenOptions={{ headerBackTitle: 'Back' }}>
      <Stack.Screen name="login" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="business-setup" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="customer/[id]" options={{ title: 'Ledger', headerShadowVisible: false }} />
      <Stack.Screen
        name="add-customer"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.8, 1],
          sheetGrabberVisible: true,
          title: 'New Customer',
        }}
      />
      <Stack.Screen
        name="add-transaction"
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.9, 1],
          sheetGrabberVisible: true,
          title: 'Add Entry',
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView>
            <KeyboardProvider>
              <AuthProvider>
                <BusinessProvider>
                  <RootLayoutNav />
                </BusinessProvider>
              </AuthProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
