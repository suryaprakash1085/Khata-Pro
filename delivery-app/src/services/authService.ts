import apiClient from '../api/client';
import { storeToken, removeToken, storeUser, removeUser } from '../utils/storage';
import { User } from '../types';

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const result = response.data ?? response;

      if (result?.token) {
        await storeToken(result.token);
        await storeUser(result.user);
      }

      return result;
    } catch (error) {
      throw error;
    }
  },

  signup: async (userData: Partial<User> & { password: string }) => {
    try {
      const response = await apiClient.post('/auth/signup', userData);
      const result = response.data ?? response;

      if (result?.token) {
        await storeToken(result.token);
        await storeUser(result.user);
      }

      return result;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
      await removeToken();
      await removeUser();
    } catch (error) {
      throw error;
    }
  },

  forgotPassword: async (email: string) => {
    try {
      return await apiClient.post('/auth/forgot-password', { email });
    } catch (error) {
      throw error;
    }
  },

  resetPassword: async (data: { token: string; password: string }) => {
    try {
      return await apiClient.post('/auth/reset-password', data);
    } catch (error) {
      throw error;
    }
  },

  getProfile: async () => {
    try {
      return await apiClient.get('/auth/profile');
    } catch (error) {
      throw error;
    }
  },

//   updateProfile: async (data: Partial<User>) => {
//     try {
//       // const response = await apiClient.put('/auth/profile', data);
//       // if (response.user) {
//       //   await storeUser(response.user);
//       // }
//       // return response;
//       const response = await apiClient.post('/auth/login', credentials);

// if (response.data.token) {
//   await storeToken(response.data.token);
//   await storeUser(response.data.user);
// }

// return response.data;
//     } catch (error) {
//       throw error;
//     }
//   },
updateProfile: async (data: Partial<User>) => {
  try {
    const response = await apiClient.put('/auth/profile', data);

    if (response.data.user) {
      await storeUser(response.data.user);
    }

    return response.data;
  } catch (error) {
    throw error;
  }
},
  verifyToken: async () => {
    try {
      return await apiClient.get('/auth/verify');
    } catch (error) {
      throw error;
    }
  },
};