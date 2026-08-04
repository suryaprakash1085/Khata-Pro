
// import React from 'react';
// import { isLiquidGlassAvailable } from 'expo-glass-effect';
// import { Slot, Tabs } from 'expo-router';
// import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
// import { BlurView } from 'expo-blur';
// import { Platform, StyleSheet, useColorScheme, View } from 'react-native';
// import { SymbolView } from 'expo-symbols';
// import { Feather } from '@expo/vector-icons';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useColors } from '@/hooks/useColors';

// function NativeTabLayout() {
//   return (
//     <NativeTabs>
//       <NativeTabs.Trigger name="index">
//         <Icon sf={{ default: 'house', selected: 'house.fill' }} />
//         <Label>Home</Label>
//       </NativeTabs.Trigger>
//       <NativeTabs.Trigger name="reports">
//         <Icon sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }} />
//         <Label>Reports</Label>
//       </NativeTabs.Trigger>
//       <NativeTabs.Trigger name="profile">
//         <Icon sf={{ default: 'person', selected: 'person.fill' }} />
//         <Label>Profile</Label>
//       </NativeTabs.Trigger>
//     </NativeTabs>
//   );
// }

// function ClassicTabLayout() {
//   const colors = useColors();
//   const colorScheme = useColorScheme();
//   const safeAreaInsets = useSafeAreaInsets();
//   const isDark = colorScheme === 'dark';
//   const isIOS = Platform.OS === 'ios';

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: false,
//         tabBarActiveTintColor: colors.primary,
//         tabBarInactiveTintColor: colors.mutedForeground,
//         tabBarStyle: {
//           position: 'absolute',
//           backgroundColor: isIOS ? 'transparent' : colors.card,
//           borderTopWidth: 0,
//           elevation: 0,
//           paddingBottom: safeAreaInsets.bottom,
//         },
//         tabBarBackground: () =>
//           isIOS ? (
//             <BlurView intensity={100} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
//           ) : null,
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color }) =>
//             isIOS ? (
//               <SymbolView name="house" tintColor={color} size={24} />
//             ) : (
//               <Feather name="home" size={22} color={color} />
//             ),
//         }}
//       />
//       <Tabs.Screen
//         name="reports"
//         options={{
//           title: 'Reports',
//           tabBarIcon: ({ color }) =>
//             isIOS ? (
//               <SymbolView name="chart.bar" tintColor={color} size={24} />
//             ) : (
//               <Feather name="bar-chart-2" size={22} color={color} />
//             ),
//         }}
//       />
//       <Tabs.Screen
//         name="profile"
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ color }) =>
//             isIOS ? (
//               <SymbolView name="person" tintColor={color} size={24} />
//             ) : (
//               <Feather name="user" size={22} color={color} />
//             ),
//         }}
//       />
//     </Tabs>
//   );
// }

// export default function TabLayout() {
//   // Web now has a persistent left sidebar (added in the root layout) that
//   // handles navigation between Home/Billing/Products/Reports/Profile, so we
//   // skip the bottom tab bar entirely and just render the active screen.
//   if (Platform.OS === 'web') {
//     return <Slot />;
//   }

//   if (isLiquidGlassAvailable()) {
//     return <NativeTabLayout />;
//   }
//   return <ClassicTabLayout />;
// }

import React from 'react';
import { isLiquidGlassAvailable } from 'expo-glass-effect';
import { Slot, Tabs } from 'expo-router';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';
import { BlurView } from 'expo-blur';
import { Platform, StyleSheet, useColorScheme, View } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { useAuth } from '@/contexts/AuthContext';

// Owner/admin always gets every tab. A staff account only gets Reports
// if the owner explicitly granted `view_reports` when adding them.
function useCanViewReports() {
  const { user } = useAuth();
  const isOwner = user?.role === 'owner';
  const hasReportsPermission = !!user?.permissions?.view_reports;
  return isOwner || hasReportsPermission;
}

function NativeTabLayout() {
  const canViewReports = useCanViewReports();

  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Icon sf={{ default: 'house', selected: 'house.fill' }} />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      {canViewReports && (
        <NativeTabs.Trigger name="reports">
          <Icon sf={{ default: 'chart.bar', selected: 'chart.bar.fill' }} />
          <Label>Reports</Label>
        </NativeTabs.Trigger>
      )}
      <NativeTabs.Trigger name="profile">
        <Icon sf={{ default: 'person', selected: 'person.fill' }} />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

function ClassicTabLayout() {
  const colors = useColors();
  const colorScheme = useColorScheme();
  const safeAreaInsets = useSafeAreaInsets();
  const isDark = colorScheme === 'dark';
  const isIOS = Platform.OS === 'ios';
  const canViewReports = useCanViewReports();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: isIOS ? 'transparent' : colors.card,
          borderTopWidth: 0,
          elevation: 0,
          paddingBottom: safeAreaInsets.bottom,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView intensity={100} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="house" tintColor={color} size={24} />
            ) : (
              <Feather name="home" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="reports"
        // href: null removes the tab from the bar (and blocks direct
        // navigation to it) while still letting the route exist, which is
        // safer than trying to conditionally omit <Tabs.Screen> entirely.
        options={{
          title: 'Reports',
          href: canViewReports ? undefined : null,
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="chart.bar" tintColor={color} size={24} />
            ) : (
              <Feather name="bar-chart-2" size={22} color={color} />
            ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) =>
            isIOS ? (
              <SymbolView name="person" tintColor={color} size={24} />
            ) : (
              <Feather name="user" size={22} color={color} />
            ),
        }}
      />
    </Tabs>
  );
}

export default function TabLayout() {
  // Web now has a persistent left sidebar (added in the root layout) that
  // handles navigation between Home/Billing/Products/Reports/Profile, so we
  // skip the bottom tab bar entirely and just render the active screen.
  if (Platform.OS === 'web') {
    return <Slot />;
  }

  if (isLiquidGlassAvailable()) {
    return <NativeTabLayout />;
  }
  return <ClassicTabLayout />;
}