import React, { useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
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
import { Stack, useRouter, useSegments, usePathname } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { Feather } from '@expo/vector-icons';
import { setBaseUrl } from '@workspace/api-client-react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { BusinessProvider, useBusiness } from '@/contexts/BusinessContext';
import { useColors } from '@/hooks/useColors';
import { WebSidebar, SIDEBAR_WIDTH } from '@/components/WebSidebar';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Set the API base URL - connects mobile app to API server and database
setBaseUrl(process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000');

const queryClient = new QueryClient();

// Below this window width, the fixed sidebar doesn't fit — switch to a
// hamburger + slide-out drawer instead. Tune this to taste.
const DESKTOP_BREAKPOINT = 900;

function RootLayoutNav() {
  const colors = useColors();
  const { isLoading: authLoading, user } = useAuth();
  const { isLoading: bizLoading, hasBusiness } = useBusiness();
  const segments = useSegments();
  const pathname = usePathname();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  // Auto-close the mobile drawer whenever the route changes.
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  if (authLoading) {
    return <View style={{ flex: 1, backgroundColor: colors.background }} />;
  }

  const stackNav = (
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

  // Web nav only shows once the user is logged in and has completed business
  // setup (keeps login / business-setup screens clean).
  const isWebAuthed = Platform.OS === 'web' && !!user && hasBusiness;
  const isDesktopWeb = isWebAuthed && width >= DESKTOP_BREAKPOINT;
  const isMobileWeb = isWebAuthed && width < DESKTOP_BREAKPOINT;

if (isDesktopWeb) {
  return (
    <View style={{ flex: 1, flexDirection: 'row', minHeight: '100%' as any }}>
      <WebSidebar />
      <View
        style={{
          flex: 1,
          width: '100%',
          alignSelf: 'stretch',
          minHeight: '100%' as any,
        }}
      >
        {stackNav}
      </View>
    </View>
  );
}

  if (isMobileWeb) {
    return (
      <View style={{ flex: 1, minHeight: '100%' as any }}>
        {/* Compact top bar with hamburger toggle */}
        <View style={[styles.mobileTopBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <Pressable onPress={() => setDrawerOpen(true)} hitSlop={10} style={styles.hamburgerBtn}>
            <Feather name="menu" size={22} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.mobileTopBarTitle, { color: colors.foreground }]} numberOfLines={1}>
            Khata-Pro
          </Text>
          <View style={{ width: 22 }} />
        </View>

        <View style={{ flex: 1 }}>{stackNav}</View>

        {drawerOpen && (
          <>
            <Pressable style={styles.drawerBackdrop} onPress={() => setDrawerOpen(false)} />
            <View style={[styles.drawer, { width: Math.min(SIDEBAR_WIDTH, width * 0.82) }]}>
              <WebSidebar />
            </View>
          </>
        )}
      </View>
    );
  }

  return stackNav;
}

const styles = StyleSheet.create({
  mobileTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  hamburgerBtn: { padding: 2 },
  mobileTopBarTitle: { fontSize: 16, fontFamily: 'Inter_600SemiBold', fontWeight: '600' },
  drawerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    // @ts-ignore - zIndex works fine on RN Web
    zIndex: 20,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    // @ts-ignore
    zIndex: 21,
    // @ts-ignore
    boxShadow: '2px 0 12px rgba(0,0,0,0.25)',
  },
});

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