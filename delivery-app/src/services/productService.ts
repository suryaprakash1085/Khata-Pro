import apiClient from '../api/client';

export const productService = {
  getProducts: async (businessId: string, params: any = {}) => {
    try {
      return await apiClient.get('/products', { params: { business_id: businessId, ...params } });
    } catch (error) {
      throw error;
    }
  },
};
