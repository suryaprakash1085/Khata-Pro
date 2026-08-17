import axios from 'axios';
import { getToken, removeToken, removeUser, setToken, setUser } from '../utils/storage';
import { registerForPushNotificationsAsync, savePushTokenToServer } from './pushNotifications';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear local session.
      // NOTE: no window.location redirect here — this is a React Native app,
      // there is no `window`. Navigation on 401 should be handled by whatever
      // screen/navigator watches auth state (e.g. AuthContext), not here.
      removeToken();
      removeUser();
    }
    return Promise.reject(error);
  }
);

// Shared helper — registers this device for push notifications and saves
// the token to the backend. Never throws: a failure here should not block
// login/signup.
async function registerPushAfterAuth(authToken: string) {
  try {
    const pushToken = await registerForPushNotificationsAsync();
    if (pushToken) {
      await savePushTokenToServer(pushToken, authToken);
    }
  } catch (err) {
    console.error('[authService] Push registration failed:', err);
  }
}

export const authService = {
  // Login — backend expects { phone, password }, not email.
  async login(credentials: { phone: string; password: string }) {
    try {
      const response = await api.post('/customer-auth/login', credentials);
      const { token, customer } = response.data;

      if (token) {
        setToken(token);
        setUser(customer);
        // fire-and-forget — don't block login on push registration
        registerPushAfterAuth(token);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Signup / Register — backend expects { businessId, name, phone, email?, address?, password }
  async signup(data: {
    businessId: number;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    password: string;
  }) {
    try {
      const response = await api.post('/customer-auth/signup', data);
      const { token, customer } = response.data;

      if (token) {
        setToken(token);
        setUser(customer);
        registerPushAfterAuth(token);
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user (verify token with backend)
  async getCurrentUser() {
    try {
      const response = await api.get('/customer-auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout — no backend /customer-auth/logout route exists yet, so this
  // just clears local session. Add a backend route later if you need to
  // invalidate tokens server-side (e.g. a token blocklist).
  async logout() {
    removeToken();
    removeUser();
  },
};