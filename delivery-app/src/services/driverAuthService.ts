import apiClient from '../api/client';
import { storeDriverToken, storeDriver, removeDriverToken, removeDriver } from '../utils/storage';
import { Driver } from '../types';

/**
 * !! ASSUMPTION: this delivery-app is deployed per-business (single "The Green
 * Cart" style store), so business_id is a fixed constant rather than something
 * the driver types in. Set it via env var. If you later support multiple
 * businesses in one app, this would need to become a runtime selection instead.
 */
const BUSINESS_ID = Number(process.env.EXPO_PUBLIC_BUSINESS_ID ?? 1);

export const driverAuthService = {
  requestOtp: async (phone: string) => {
    const response = await apiClient.post('/drivers/login/request-otp', {
      phone,
      business_id: BUSINESS_ID,
    });
    return response.data ?? response;
  },

  verifyOtp: async (phone: string, otp: string) => {
    const response = await apiClient.post('/drivers/login/verify-otp', {
      phone,
      business_id: BUSINESS_ID,
      otp,
    });
    const result = response.data ?? response;
    if (result?.token) {
      await storeDriverToken(result.token);
      await storeDriver(result.driver as Driver);
    }
    return result;
  },

  registerPushToken: async (pushToken: string) => {
    const response = await apiClient.post('/drivers/push-token', { push_token: pushToken });
    return response.data ?? response;
  },

  logout: async () => {
    await removeDriverToken();
    await removeDriver();
  },
};