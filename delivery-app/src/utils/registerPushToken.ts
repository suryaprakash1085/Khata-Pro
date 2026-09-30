import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import apiClient from '../api/client';

type UserRole = 'driver' | 'customer';

export async function registerForPushNotificationsAsync(role: UserRole) {
  if (!Device.isDevice) {
    console.warn('[push] Skipping — push tokens only work on physical devices');
    return;
  }

  const existingPermission: any = await Notifications.getPermissionsAsync();
  let finalStatus: string = existingPermission.status;

  if (finalStatus !== 'granted') {
    const requestedPermission: any = await Notifications.requestPermissionsAsync();
    finalStatus = requestedPermission.status;
  }

  if (finalStatus !== 'granted') {
    console.warn('[push] Notification permission not granted');
    return;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({
    projectId: 'bccd95c3-e9af-4578-9ab0-f57f9ee1ad4c',
  });
  const pushToken = tokenData.data;

  const endpoint =
    role === 'driver' ? '/drivers/push-token' : '/customers/me/push-token';

  await apiClient.put(endpoint, { push_token: pushToken });
}