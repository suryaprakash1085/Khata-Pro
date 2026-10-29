import { useContext, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import { AuthContext } from '../context/AuthContext';
import { DriverAuthContext } from '../context/DriverAuthContext';
import { APP_MODE } from '../config/appMode';
import { getDriverToken, getToken } from '../utils/storage';
import {
  ensureAndroidChannel,
  registerForPushNotificationsAsync,
  registerDeviceWithServer,
} from '../services/pushNotifications';
import { navigationRef } from '../navigation/navigationRef';

const isDriver = APP_MODE === 'driver';
const kind = isDriver ? 'driver' : 'customer';
const getAuth = () => (isDriver ? getDriverToken() : getToken());

// Notification tap panna enga poganum
function routeFor(data: Record<string, any>): { name: string; params?: any } {
  if (isDriver) {
    const deliveryId = Number(data.deliveryId);
    return deliveryId
      ? { name: 'DriverOrderDetails', params: { deliveryId } }
      : { name: 'DriverAlerts' };
  }
  const orderId = Number(data.orderId);
  return orderId
    ? { name: 'OrderTracking', params: { orderId } }
    : { name: 'Notifications' };
}

export default function PushNotificationManager() {
  const { user } = useContext(AuthContext);
  const { isDriverAuthenticated } = useContext(DriverAuthContext);
  const isAuthed = isDriver ? isDriverAuthenticated : !!user;
  const handledId = useRef<string | null>(null);

  useEffect(() => {
    void ensureAndroidChannel();
  }, []);

  // Login aanavudane (or app restart-la session irundha) device register pannum
  useEffect(() => {
    if (!isAuthed) return;
    let cancelled = false;

    (async () => {
      const fcm = await registerForPushNotificationsAsync();
      const auth = await getAuth();
      if (fcm && auth && !cancelled) await registerDeviceWithServer(kind, auth, fcm);
    })().catch((e) => console.error('[push] register failed', e));

    // FCM token maarina marubadiyum register pannum
    const sub = Notifications.addPushTokenListener(async (t) => {
      const auth = await getAuth();
      if (auth && typeof t.data === 'string') void registerDeviceWithServer(kind, auth, t.data);
    });

    return () => {
      cancelled = true;
      sub.remove();
    };
  }, [isAuthed]);

  // Notification tap (app open-la irukkum pothum, closed-la irundhu open aagum pothum)
  const last = Notifications.useLastNotificationResponse();
  useEffect(() => {
    if (!isAuthed || !last) return;
    const id = last.notification.request.identifier;
    if (handledId.current === id) return;
    handledId.current = id;

    const route = routeFor(
      (last.notification.request.content.data ?? {}) as Record<string, any>,
    );

    let tries = 0;
    const timer = setInterval(() => {
      if (navigationRef.isReady()) {
        clearInterval(timer);
        (navigationRef as any).navigate(route.name, route.params);
      } else if (++tries > 20) {
        clearInterval(timer);
      }
    }, 300);
    return () => clearInterval(timer);
  }, [last, isAuthed]);

  return null;
}