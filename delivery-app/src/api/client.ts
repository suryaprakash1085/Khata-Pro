// import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getToken } from '../utils/storage';
import { API_URL } from '@env';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  // async (config: AxiosRequestConfig) => {
  async (config: InternalAxiosRequestConfig) => {
    const token = await getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      console.error('API Error:', error.response.data);
      return Promise.reject(error.response.data);
    } else if (error.request) {
      console.error('No response from server:', error.request);
      return Promise.reject({ message: 'No response from server' });
    } else {
      console.error('Request error:', error.message);
      return Promise.reject({ message: error.message });
    }
  }
);

export default apiClient;