

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

export interface Notification {
  id: number;
  driver_id: number | null;
  business_id: number | null;
  customer_id: number | null;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

class NotificationService {
  async getNotifications(params?: {
    driver_id?: number;
    business_id?: number;
    customer_id?: number;
    limit?: number;
  }): Promise<Notification[]> {
    try {
      console.log('📤 Fetching notifications with params:', params);
      const response = await axios.get(`${API_BASE_URL}/notifications`, { 
        params 
      });
      
      const data = response.data.data || response.data;
      console.log('✅ Notifications fetched:', data.length);
      return data;
    } catch (error) {
      console.error('❌ Error fetching notifications:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: number): Promise<void> {
    try {
      console.log('📤 Marking notification as read:', notificationId);
      await axios.post(`${API_BASE_URL}/notifications/mark-read`, { 
        notificationId 
      });
      console.log('✅ Notification marked as read');
    } catch (error) {
      console.error('❌ Error marking notification as read:', error);
      throw error;
    }
  }

  async markAllAsRead(params: {
    driver_id?: number;
    business_id?: number;
    customer_id?: number;
  }): Promise<void> {
    try {
      console.log('📤 Marking all notifications as read:', params);
      await axios.post(`${API_BASE_URL}/notifications/mark-read`, params);
      console.log('✅ All notifications marked as read');
    } catch (error) {
      console.error('❌ Error marking all as read:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: number): Promise<void> {
    try {
      console.log('📤 Deleting notification:', notificationId);
      await axios.delete(`${API_BASE_URL}/notifications/${notificationId}`);
      console.log('✅ Notification deleted');
    } catch (error) {
      console.error('❌ Error deleting notification:', error);
      throw error;
    }
  }

  async createOrderConfirmationNotification(params: {
    orderId: number;
    businessId: number;
    customerId?: number;
    type: 'confirmed' | 'assigned';
    deliveryAddress?: string;
    driverName?: string;
  }): Promise<any> {
    try {
      console.log('📤 Creating notification with params:', JSON.stringify(params, null, 2));
      
      // ✅ Ensure all required fields are present
      const payload = {
        orderId: params.orderId,
        businessId: params.businessId,
        customerId: params.customerId || null,
        type: params.type,
        deliveryAddress: params.deliveryAddress || 'address not specified',
        driverName: params.driverName || null
      };
      
      console.log('📤 Sending payload:', JSON.stringify(payload, null, 2));
      
      const response = await axios.post(`${API_BASE_URL}/notifications/order-confirmed`, payload);
      console.log('✅ Notification created:', response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error creating notification:', error);
      throw error;
    }
  }
}

export default new NotificationService();