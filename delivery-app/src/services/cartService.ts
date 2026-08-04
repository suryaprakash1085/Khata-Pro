import apiClient from '../api/client';

export const cartService = {
  getCart: async () => {
    try {
      return await apiClient.get('/cart');
    } catch (error) {
      throw error;
    }
  },

  addToCart: async (data: any) => {
    try {
      return await apiClient.post('/cart/add', data);
    } catch (error) {
      throw error;
    }
  },

  updateCart: async (data: any) => {
    try {
      return await apiClient.put('/cart/update', data);
    } catch (error) {
      throw error;
    }
  },

  removeFromCart: async (data: any) => {
    try {
      return await apiClient.post('/cart/remove', data);
    } catch (error) {
      throw error;
    }
  },

  clearCart: async () => {
    try {
      return await apiClient.delete('/cart/clear');
    } catch (error) {
      throw error;
    }
  },

  applyCoupon: async (code: string) => {
    try {
      return await apiClient.post('/cart/apply-coupon', { code });
    } catch (error) {
      throw error;
    }
  },
};