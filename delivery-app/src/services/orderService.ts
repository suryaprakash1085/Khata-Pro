import apiClient from '../api/client';
import { Order, Address, CartItem } from '../types';

interface CreateOrderData {
  restaurantId: string;
  items: CartItem[];
  total: number;
  deliveryAddress: Address;
  paymentMethod: string;
  instructions?: string;
  couponCode?: string;
  isNoContactDelivery?: boolean;
}

interface RateOrderData {
  rating: number;
  feedback?: string;
}

export const orderService = {
  createOrder: async (orderData: CreateOrderData): Promise<Order> => {
    try {
      return await apiClient.post('/orders', orderData);
    } catch (error) {
      throw error;
    }
  },

  getOrders: async (): Promise<Order[]> => {
    try {
      return await apiClient.get('/orders');
    } catch (error) {
      throw error;
    }
  },

  getOrderById: async (id: string): Promise<Order> => {
    try {
      return await apiClient.get(`/orders/${id}`);
    } catch (error) {
      throw error;
    }
  },

  updateOrderStatus: async (id: string, status: Order['status']): Promise<Order> => {
    try {
      return await apiClient.patch(`/orders/${id}/status`, { status });
    } catch (error) {
      throw error;
    }
  },

  cancelOrder: async (id: string): Promise<Order> => {
    try {
      return await apiClient.post(`/orders/${id}/cancel`);
    } catch (error) {
      throw error;
    }
  },

  getOrderHistory: async (): Promise<Order[]> => {
    try {
      return await apiClient.get('/orders/history');
    } catch (error) {
      throw error;
    }
  },

  trackOrder: async (id: string): Promise<{
    status: Order['status'];
    estimatedDelivery: string;
    riderName?: string;
    riderPhone?: string;
    riderLocation?: { lat: number; lng: number };
  }> => {
    try {
      return await apiClient.get(`/orders/${id}/track`);
    } catch (error) {
      throw error;
    }
  },

  rateOrder: async (id: string, data: RateOrderData): Promise<any> => {
    try {
      return await apiClient.post(`/orders/${id}/rate`, data);
    } catch (error) {
      throw error;
    }
  },

  reorder: async (id: string): Promise<Order> => {
    try {
      return await apiClient.post(`/orders/${id}/reorder`);
    } catch (error) {
      throw error;
    }
  },

  getOrderStatus: async (id: string): Promise<{
    status: Order['status'];
    progress: number;
    steps: Array<{ label: string; completed: boolean; active: boolean }>;
  }> => {
    try {
      return await apiClient.get(`/orders/${id}/status`);
    } catch (error) {
      throw error;
    }
  },

  getDeliveryTracking: async (id: string): Promise<{
    riderName: string;
    riderPhone: string;
    riderRating: number;
    estimatedArrival: string;
    currentLocation: { lat: number; lng: number };
    distance: string;
    duration: string;
  }> => {
    try {
      return await apiClient.get(`/orders/${id}/tracking`);
    } catch (error) {
      throw error;
    }
  },
};