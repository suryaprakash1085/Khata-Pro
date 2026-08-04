import apiClient from '../api/client';

export const restaurantService = {
  getRestaurants: async (params: any = {}) => {
    try {
      return await apiClient.get('/restaurants', { params });
    } catch (error) {
      throw error;
    }
  },

  getRestaurantById: async (id: string) => {
    try {
      return await apiClient.get(`/restaurants/${id}`);
    } catch (error) {
      throw error;
    }
  },

  getRestaurantMenu: async (id: string) => {
    try {
      return await apiClient.get(`/restaurants/${id}/menu`);
    } catch (error) {
      throw error;
    }
  },

  getCategories: async () => {
    try {
      return await apiClient.get('/restaurants/categories');
    } catch (error) {
      throw error;
    }
  },

  searchRestaurants: async (query: string) => {
    try {
      return await apiClient.get('/restaurants/search', { params: { q: query } });
    } catch (error) {
      throw error;
    }
  },

  getFeaturedRestaurants: async () => {
    try {
      return await apiClient.get('/restaurants/featured');
    } catch (error) {
      throw error;
    }
  },

  getOffers: async () => {
    try {
      return await apiClient.get('/restaurants/offers');
    } catch (error) {
      throw error;
    }
  },

  getRestaurantsByCategory: async (categoryId: string) => {
    try {
      return await apiClient.get(`/restaurants/category/${categoryId}`);
    } catch (error) {
      throw error;
    }
  },
};