

import apiClient from '../api/client';
import { storeDriverToken, storeDriver, storeBusinessId, clearDriverAuthData } from '../utils/storage';
import { Driver } from '../types';

/**
 * NO hardcoded business_id — this delivery-app serves drivers across
 * multiple businesses (Zomato-style), so the driver logs in with just
 * their phone number. The backend resolves which business they belong
 * to by looking up the driver record by phone, and returns business_id
 * in the response. We store that and use it dynamically from then on.
 */

export const driverAuthService = {
  requestOtp: async (phone: string) => {
    const response = await apiClient.post('/drivers/login/request-otp', {
      phone,
    });
    return response.data ?? response;
  },

  verifyOtp: async (phone: string, otp: string) => {
    const response = await apiClient.post('/drivers/login/verify-otp', {
      phone,
      otp,
    });
    const result = response.data ?? response;
    if (result?.token) {
      storeDriverToken(result.token);
      storeDriver(result.driver as Driver);
      // Driver record must carry business_id — persist it so every
      // subsequent delivery-app API call can scope requests correctly.
      if (result.driver?.business_id) {
        storeBusinessId(result.driver.business_id);
      }
    }
    return result;
  },

  registerPushToken: async (pushToken: string) => {
    const response = await apiClient.post('/drivers/push-token', { push_token: pushToken });
    return response.data ?? response;
  },

  logout: async () => {
    clearDriverAuthData();
  },
};