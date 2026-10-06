import apiClient from '../api/client';

export interface Promotion {
  id: number;
  business_id: number;
  name: string;
  promotion_type: string;
  apply_to: string;
  start_date: string;
  end_date: string;
  category: string | null;
  status: string;
  discount_percentage: number | null;
  description: string | null;
  promo_code: string | null;
  min_order_amount: number | null;
  banner_image: string | null;
  product_ids: number[];
  product_names: string[];
  created_at: string;
}

class PromotionService {
  async getActivePromotions(businessId: number): Promise<Promotion[]> {
    try {
      // The apiClient interceptor already returns response.data,
      // so `data` here is the response body itself (no `.data` needed).
      const data = await apiClient.get('/promotions/active', {
      params: { business_id: businessId },
      });
      return data as unknown as Promotion[];
    } catch (error) {
      console.error('Failed to fetch active promotions:', error);
      throw error;
    }
  }
}

export default new PromotionService();