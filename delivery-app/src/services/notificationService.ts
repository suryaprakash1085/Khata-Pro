// // src/services/notificationService.ts
// import axios from 'axios';

// // Replace with your actual backend URL
// const API_BASE_URL = 'http://localhost:3000/api'; // For development
// // const API_BASE_URL = 'https://your-backend-url.com/api'; // For production

// export interface Notification {
//   id: number;
//   driver_id: number | null;
//   business_id: number | null;
//   customer_id: number | null;
//   type: string;
//   message_text: string;
//   is_read: boolean;
//   created_at: string;
//   updated_at: string;
// }

// class NotificationService {
//   async getNotifications(params?: {
//     driver_id?: number;
//     business_id?: number;
//     customer_id?: number;
//     limit?: number;
//   }): Promise<Notification[]> {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/notifications`, { 
//         params 
//       });
//       return response.data;
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//       throw error;
//     }
//   }

//   async markAsRead(notificationId: number): Promise<void> {
//     try {
//       await axios.post(`${API_BASE_URL}/notifications/mark-read`, { 
//         notificationId 
//       });
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//       throw error;
//     }
//   }

//   async deleteNotification(notificationId: number): Promise<void> {
//     try {
//       await axios.delete(`${API_BASE_URL}/notifications/${notificationId}`);
//     } catch (error) {
//       console.error('Error deleting notification:', error);
//       throw error;
//     }
//   }
// }

// export default new NotificationService();
// src/services/notificationService.ts
import axios from 'axios';

// Replace with your actual backend URL
const API_BASE_URL = 'http://localhost:3000/api'; // For development
// const API_BASE_URL = 'https://your-backend-url.com/api'; // For production

export interface Notification {
  id: number;
  driver_id: number | null;
  business_id: number | null;
  customer_id: number | null;
  type: string;
  message_text: string;
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
      
      // ✅ Handle both response formats (data.data or data)
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

  // ✅ Add this missing method
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
}

export default new NotificationService();