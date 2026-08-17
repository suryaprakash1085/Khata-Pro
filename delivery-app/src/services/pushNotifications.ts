

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    console.warn('[push] Push notifications require a physical device');
    return null;
  }

  const existingPermissions = await Notifications.getPermissionsAsync();
  // @ts-expect-error — expo-notifications' NotificationPermissionsStatus type has a
  // known upstream bug: it imports PermissionResponse from 'expo', which doesn't
  // re-export it (it actually lives in expo-modules-core). Runtime shape is correct.
  let granted: boolean = existingPermissions.status === 'granted';

  if (!granted) {
    const requestedPermissions = await Notifications.requestPermissionsAsync();
    // @ts-expect-error — same upstream type bug as above
    granted = requestedPermissions.status === 'granted';
  }

  if (!granted) {
    console.warn('[push] Push notification permission denied');
    return null;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  try {
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
    return tokenResponse.data;
  } catch (err) {
    console.error('[push] Failed to get push token:', err);
    return null;
  }

  
}

export async function savePushTokenToServer(pushToken: string, authToken: string): Promise<void> {
  try {
    await fetch(`${API_BASE_URL}/customers/me/push-token`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ push_token: pushToken }),
    });
  } catch (err) {
    console.error('[push] Failed to save push token to server:', err);
  }
}

