
import axios from 'axios';


const API_BASE_URL = "http://localhost:3000/api";

interface CreateOrderResponse {
  success: boolean;
  order: {
    id: string;
    amount: number;
    currency: string;
    receipt?: string;
  };
  key: string;
  message?: string;
}

interface VerifyPaymentResponse {
  success: boolean;
  message?: string;
  data?: any;
}

// Payment service object with methods
export const paymentService = {
  // Create Razorpay order
  createOrder: async (amount: number, currency: string = 'INR'): Promise<CreateOrderResponse> => {
    try {
      const response = await axios.post(`${API_BASE_URL}/create-order`, {
        amount,
        currency,
      });

      if (response.data && response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Failed to create order');
      }
    } catch (error: any) {
      console.error('Error creating order:', error);
      
   
      
      throw error;
    }
  },

  // Verify payment
  verifyPayment: async (
    orderId: string,
    paymentId: string,
    signature: string,
    orderReference: string
  ): Promise<VerifyPaymentResponse> => {
    try {
   
const response=await axios.post(`${API_BASE_URL}/verify-payment`, {
  order_id: orderId,
  payment_id: paymentId,
  signature,
});
      return response.data;
    } catch (error: any) {
      console.error('Error verifying payment:', error);
      
    
      
      throw error;
    }
  },

  // Get payment status
  getPaymentStatus: async (paymentId: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/payment-status/${paymentId}`);
      return response.data;
    } catch (error) {
      console.error('Error getting payment status:', error);
      throw error;
    }
  },

  // Refund payment
  refundPayment: async (paymentId: string, amount?: number) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/refund-payment`, {
        paymentId,
        amount,
      });
      return response.data;
    } catch (error) {
      console.error('Error refunding payment:', error);
      throw error;
    }
  },
};

// If you want to use default export as well
export default paymentService;