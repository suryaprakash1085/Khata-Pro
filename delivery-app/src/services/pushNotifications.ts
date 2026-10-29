

// import * as Notifications from 'expo-notifications';
// import * as Device from 'expo-device';
// import Constants from 'expo-constants';
// import { Platform } from 'react-native';
// import { API_BASE_URL } from '../config/api';



// // const API_BASE_URL = process.env.REACT_APP_API_URL || ' /api';
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowBanner: true,
//     shouldShowList: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

// export async function registerForPushNotificationsAsync(): Promise<string | null> {
//   if (!Device.isDevice) {
//     console.warn('[push] Push notifications require a physical device');
//     return null;
//   }

//   const existingPermissions = await Notifications.getPermissionsAsync();
//   // @ts-expect-error — expo-notifications' NotificationPermissionsStatus type has a
//   // known upstream bug: it imports PermissionResponse from 'expo', which doesn't
//   // re-export it (it actually lives in expo-modules-core). Runtime shape is correct.
//   let granted: boolean = existingPermissions.status === 'granted';

//   if (!granted) {
//     const requestedPermissions = await Notifications.requestPermissionsAsync();
//     // @ts-expect-error — same upstream type bug as above
//     granted = requestedPermissions.status === 'granted';
//   }

//   if (!granted) {
//     console.warn('[push] Push notification permission denied');
//     return null;
//   }

//   if (Platform.OS === 'android') {
//     await Notifications.setNotificationChannelAsync('default', {
//       name: 'default',
//       importance: Notifications.AndroidImportance.MAX,
//     });
//   }

//   try {
//     const projectId = Constants.expoConfig?.extra?.eas?.projectId;
//     const tokenResponse = await Notifications.getExpoPushTokenAsync({ projectId });
//     return tokenResponse.data;
//   } catch (err) {
//     console.error('[push] Failed to get push token:', err);
//     return null;
//   }

  
// }

// export async function savePushTokenToServer(pushToken: string, authToken: string): Promise<void> {
//   try {
//     await fetch(`${API_BASE_URL}/customers/me/push-token`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${authToken}`,
//       },
//       body: JSON.stringify({ push_token: pushToken }),
//     });
//   } catch (err) {
//     console.error('[push] Failed to save push token to server:', err);
//   }
// }

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../config/api';

// Backend-la channelId: "orders" nu irukku, idhu same-ah irukkanum
export const ANDROID_CHANNEL_ID = 'orders';
const FCM_TOKEN_KEY = 'fcmDeviceToken';
export type PushUserKind = 'customer' | 'driver';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Orders & Deliveries',
    importance: Notifications.AndroidImportance.MAX,
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#6C5CE7',
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  });
}

/** Permission kekkum, native FCM token return pannum (kedaikkala na null). */
export async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (Platform.OS !== 'android') return null;
  if (!Device.isDevice) {
    console.warn('[push] Physical device venum');
    return null;
  }
  await ensureAndroidChannel();

  let perm: any = await Notifications.getPermissionsAsync();
  if (perm.status !== 'granted') perm = await Notifications.requestPermissionsAsync();
  if (perm.status !== 'granted') {
    console.warn('[push] Notification permission denied');
    return null;
  }

  try {
    const t = await Notifications.getDevicePushTokenAsync();
    return typeof t.data === 'string' ? t.data : null;
  } catch (err) {
    console.error('[push] FCM token kedaikkala (google-services.json build-la irukka?):', err);
    return null;
  }
}

export async function registerDeviceWithServer(
  kind: PushUserKind,
  authToken: string,
  fcmToken: string,
): Promise<void> {
  try {
    const res = await fetch(`${API_BASE_URL}/devices/${kind}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ token: fcmToken, platform: 'android' }),
    });
    if (res.ok) await AsyncStorage.setItem(FCM_TOKEN_KEY, fcmToken);
    else console.error('[push] Device registration rejected:', res.status);
  } catch (err) {
    console.error('[push] Device registration failed:', err);
  }
}

/** Logout-la, auth token clear panradhukku MUNNADI call pannunga. Eppovum throw pannaadhu. */
export async function unregisterDeviceFromServer(
  kind: PushUserKind,
  authToken: string | null,
): Promise<void> {
  try {
    const token = await AsyncStorage.getItem(FCM_TOKEN_KEY);
    if (!token || !authToken) return;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4000);
    await fetch(`${API_BASE_URL}/devices/${kind}/unregister`, {
      method: 'POST',
      signal: ctrl.signal,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
      body: JSON.stringify({ token }),
    }).finally(() => clearTimeout(timer));
    await AsyncStorage.removeItem(FCM_TOKEN_KEY);
  } catch (err) {
    console.warn('[push] Device unregister failed:', err);
  }
}