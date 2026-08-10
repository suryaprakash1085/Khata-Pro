// import apiClient from '../api/client';
// import { storeToken, removeToken, storeUser, removeUser } from '../utils/storage';
// import { User } from '../types';

// export const authService = {
//   login: async (credentials: { email: string; password: string }) => {
//     try {
//       const response = await apiClient.post('/auth/login', credentials);
//       const result = response.data ?? response;

//       if (result?.token) {
//         await storeToken(result.token);
//         await storeUser(result.user);
//       }

//       return result;
//     } catch (error) {
//       throw error;
//     }
//   },

//   signup: async (userData: Partial<User> & { password: string }) => {
//     try {
//       const response = await apiClient.post('/auth/signup', userData);
//       const result = response.data ?? response;

//       if (result?.token) {
//         await storeToken(result.token);
//         await storeUser(result.user);
//       }

//       return result;
//     } catch (error) {
//       throw error;
//     }
//   },

//   logout: async () => {
//     try {
//       await apiClient.post('/auth/logout');
//       await removeToken();
//       await removeUser();
//     } catch (error) {
//       throw error;
//     }
//   },

//   forgotPassword: async (email: string) => {
//     try {
//       return await apiClient.post('/auth/forgot-password', { email });
//     } catch (error) {
//       throw error;
//     }
//   },

//   resetPassword: async (data: { token: string; password: string }) => {
//     try {
//       return await apiClient.post('/auth/reset-password', data);
//     } catch (error) {
//       throw error;
//     }
//   },

//   getProfile: async () => {
//     try {
//       return await apiClient.get('/auth/profile');
//     } catch (error) {
//       throw error;
//     }
//   },

// //   updateProfile: async (data: Partial<User>) => {
// //     try {
// //       // const response = await apiClient.put('/auth/profile', data);
// //       // if (response.user) {
// //       //   await storeUser(response.user);
// //       // }
// //       // return response;
// //       const response = await apiClient.post('/auth/login', credentials);

// // if (response.data.token) {
// //   await storeToken(response.data.token);
// //   await storeUser(response.data.user);
// // }

// // return response.data;
// //     } catch (error) {
// //       throw error;
// //     }
// //   },
// updateProfile: async (data: Partial<User>) => {
//   try {
//     const response = await apiClient.put('/auth/profile', data);

//     if (response.data.user) {
//       await storeUser(response.data.user);
//     }

//     return response.data;
//   } catch (error) {
//     throw error;
//   }
// },
//   verifyToken: async () => {
//     try {
//       return await apiClient.get('/auth/verify');
//     } catch (error) {
//       throw error;
//     }
//   },
// };
import axios from 'axios';
import { getToken, removeToken, removeUser } from '../utils/storage';

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
      // Token expired or invalid
      removeToken();
      removeUser();
      // Redirect to login if needed
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  // Login
  async login(credentials: { email: string; password: string }) {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Signup / Register
  async signup(data: { name: string; email: string; phone: string; password: string }) {
    try {
      const response = await api.post('/auth/register', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current user (verify token with backend)
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  async logout() {
    try {
      const response = await api.post('/auth/logout');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update profile
  async updateProfile(userData: any) {
    try {
      const response = await api.put('/auth/profile', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Send OTP
  async sendOTP(phone: string) {
    try {
      const response = await api.post('/auth/send-otp', { phone });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify OTP
  async verifyOTP(phone: string, otp: string) {
    try {
      const response = await api.post('/auth/verify-otp', { phone, otp });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};