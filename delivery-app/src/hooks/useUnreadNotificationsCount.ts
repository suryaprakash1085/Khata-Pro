// src/hooks/useUnreadNotificationsCount.ts
//
// Small shared hook so every screen wrapping DriverWebShell (Home, Orders,
// Order Details, Profile, Alerts) can feed the same live count into the
// shell's `notificationsCount` prop and sidebar/bell badge — instead of
// each screen guessing or hardcoding it.
//
// Usage in any screen:
//
//   const { unreadCount } = useUnreadNotificationsCount();
//   <DriverWebShell notificationsCount={unreadCount} ... />

import { useGetDriverUnreadNotificationCount } from '@workspace/api-client-react';

export function useUnreadNotificationsCount() {
  const { data, isLoading, refetch } = useGetDriverUnreadNotificationCount({
    query: {
      // Keep the badge reasonably fresh across screens without a websocket.
      refetchInterval: 30_000,
      refetchOnWindowFocus: true,
    },
  });

  return {
    unreadCount: data?.count ?? 0,
    isLoading,
    refetch,
  };
}