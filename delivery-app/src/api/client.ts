// import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getToken, removeToken, removeUser } from '../utils/storage';
import { API_BASE_URL } from '../config/api';


const BASE_URL = API_BASE_URL;
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
      if (error.response.status === 401) {
        void removeToken();
        void removeUser();
      }
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