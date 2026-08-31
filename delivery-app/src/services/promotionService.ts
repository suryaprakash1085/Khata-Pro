
import axios from 'axios';
import { API_URL } from '@env';

export interface Promotion {
  id: number;
  business_id: number;
  name: string;
  promotion_type: string;
  apply_to: string;
  start_date: string;
  end_date: string;
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
      // const response = await axios.get(`${API_URL}/public/promotions/active`, {
      const response = await axios.get(`${API_URL}/promotions/active`, {
        params: { business_id: businessId }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch active promotions:', error);
      throw error;
    }
  }
}

export default new PromotionService();