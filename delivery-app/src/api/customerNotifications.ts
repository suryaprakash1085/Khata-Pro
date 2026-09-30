// delivery-app/src/api/customerNotifications.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';

// Token comes from AsyncStorage ('authToken' — saved by AuthContext on login).
// The backend reads the customer id from this token, so we never send customer_id.
const authConfig = async (extra: any = {}) => {
  const token = await AsyncStorage.getItem('authToken');
  return {
    ...extra,
    headers: { Authorization: `Bearer ${token}` },
  };
};

export const customerNotificationAPI = {
  list: async (limit = 50) =>
    axios.get(`${API_URL}/notifications/me`, await authConfig({ params: { limit } })),

  unreadCount: async () =>
    axios.get(`${API_URL}/notifications/me/unread-count`, await authConfig()),

  markRead: async (id: number) =>
    axios.post(`${API_URL}/notifications/me/mark-read`, { id }, await authConfig()),

  markAllRead: async () =>
    axios.post(`${API_URL}/notifications/me/mark-all-read`, {}, await authConfig()),
};