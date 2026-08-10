// import { supabase } from '../../services/supabaseClient';
import { supabase } from "./supabaseClient";
export interface Delivery {
  id: number;
  business_id: number;
  customer_id: number;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  customer_address: string | null;
  order_id: string;
  product_description: string;
  amount: number;
  payment_mode: string;
  transaction_type: string;
  status: string;
  payment_status: string;
  transaction_id?: number;
  delivery_person_id?: number;
  estimated_delivery_time?: string;
  actual_delivery_time?: string;
  created_at: string;
  updated_at: string;
}

export const deliveryService = {
  // Get deliveries by customer
  getDeliveriesByCustomer: async (customerId: number): Promise<Delivery[]> => {
    try {
      const { data, error } = await supabase
        .from('deliveries')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching deliveries:', error);
      return [];
    }
  },

  // Get delivery by order ID
  getDeliveryByOrderId: async (orderId: string): Promise<Delivery | null> => {
    try {
      const { data, error } = await supabase
        .from('deliveries')
        .select('*')
        .eq('order_id', orderId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error fetching delivery:', error);
      return null;
    }
  },

  // Update delivery status
  updateDeliveryStatus: async (deliveryId: number, status: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('deliveries')
        .update({ 
          status, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', deliveryId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('❌ Error updating delivery:', error);
      return false;
    }
  },

  // Update payment status
  updatePaymentStatus: async (deliveryId: number, paymentStatus: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('deliveries')
        .update({ 
          payment_status: paymentStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('id', deliveryId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('❌ Error updating payment status:', error);
      return false;
    }
  },

  // Assign delivery person
  assignDeliveryPerson: async (deliveryId: number, deliveryPersonId: number): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('deliveries')
        .update({ 
          delivery_person_id: deliveryPersonId,
          status: 'Assigned',
          updated_at: new Date().toISOString() 
        })
        .eq('id', deliveryId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('❌ Error assigning delivery person:', error);
      return false;
    }
  },

  // Get deliveries by business
  getDeliveriesByBusiness: async (businessId: number): Promise<Delivery[]> => {
    try {
      const { data, error } = await supabase
        .from('deliveries')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching deliveries:', error);
      return [];
    }
  },

  // Get deliveries by status
  getDeliveriesByStatus: async (businessId: number, status: string): Promise<Delivery[]> => {
    try {
      const { data, error } = await supabase
        .from('deliveries')
        .select('*')
        .eq('business_id', businessId)
        .eq('status', status)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching deliveries:', error);
      return [];
    }
  },

  // Get delivery count by status
  getDeliveryCounts: async (businessId: number): Promise<Record<string, number>> => {
    try {
      const { data, error } = await supabase
        .from('deliveries')
        .select('status')
        .eq('business_id', businessId);

      if (error) throw error;

      const counts: Record<string, number> = {};
      data?.forEach((d: any) => {
        counts[d.status] = (counts[d.status] || 0) + 1;
      });
      return counts;
    } catch (error) {
      console.error('❌ Error getting delivery counts:', error);
      return {};
    }
  }
};