// // src/context/NotificationContext.tsx
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import notificationService, { Notification } from '../services/notificationService';

// interface NotificationContextType {
//   notifications: Notification[];
//   unreadCount: number;
//   loading: boolean;
//   fetchNotifications: (params?: any) => Promise<void>;
//   markAsRead: (id: number) => Promise<void>;
//   deleteNotification: (id: number) => Promise<void>;
// }

// const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// export const NotificationProvider: React.FC<{ children: React.ReactNode, userId?: number }> = ({ 
//   children, 
//   userId 
// }) => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [unreadCount, setUnreadCount] = useState(0);

//   const fetchNotifications = async (params?: any) => {
//     try {
//       setLoading(true);
//       const data = await notificationService.getNotifications({
//         customer_id: userId,
//         ...params
//       });
//       setNotifications(data);
//       setUnreadCount(data.filter(n => !n.is_read).length);
//     } catch (error) {
//       console.error('Failed to fetch notifications:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAsRead = async (id: number) => {
//     try {
//       await notificationService.markAsRead(id);
//       await fetchNotifications();
//     } catch (error) {
//       console.error('Failed to mark notification as read:', error);
//     }
//   };

//   const deleteNotification = async (id: number) => {
//     try {
//       await notificationService.deleteNotification(id);
//       await fetchNotifications();
//     } catch (error) {
//       console.error('Failed to delete notification:', error);
//     }
//   };

//   useEffect(() => {
//     if (userId) {
//       fetchNotifications();
//     }
//   }, [userId]);

//   return (
//     <NotificationContext.Provider value={{
//       notifications,
//       unreadCount,
//       loading,
//       fetchNotifications,
//       markAsRead,
//       deleteNotification
//     }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotifications = () => {
//   const context = useContext(NotificationContext);
//   if (!context) {
//     throw new Error('useNotifications must be used within NotificationProvider');
//   }
//   return context;
// };

// src/context/NotificationContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import notificationService, { Notification } from '../services/notificationService';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: (params?: any) => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: (params?: any) => Promise<void>; // ✅ Added
  deleteNotification: (id: number) => Promise<void>;
  refreshNotifications: () => Promise<void>; // ✅ Added
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode, userId?: number }> = ({ 
  children, 
  userId 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async (params?: any) => {
    try {
      setLoading(true);
      console.log('📬 Fetching notifications for userId:', userId);
      
      const data = await notificationService.getNotifications({
        customer_id: userId,
        ...params
      });
      
      setNotifications(data);
      const unread = data.filter(n => !n.is_read).length;
      setUnreadCount(unread);
      console.log('✅ Notifications loaded:', data.length, 'Unread:', unread);
    } catch (error) {
      console.error('❌ Failed to fetch notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      console.log('📬 Marking notification as read:', id);
      await notificationService.markAsRead(id);
      
      // ✅ Update local state immediately instead of refetching
      setNotifications(prev => 
        prev.map(n => 
          n.id === id ? { ...n, is_read: true } : n
        )
      );
      
      // ✅ Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      console.log('✅ Notification marked as read locally');
    } catch (error) {
      console.error('❌ Failed to mark notification as read:', error);
      // ✅ Refetch on error to sync
      await fetchNotifications();
    }
  };

  // ✅ Add markAllAsRead method
  const markAllAsRead = async (params?: any) => {
    try {
      console.log('📬 Marking all notifications as read');
      
      await notificationService.markAllAsRead({
        customer_id: userId,
        ...params
      });
      
      // ✅ Update local state immediately
      setNotifications(prev => 
        prev.map(n => ({ ...n, is_read: true }))
      );
      setUnreadCount(0);
      
      console.log('✅ All notifications marked as read locally');
    } catch (error) {
      console.error('❌ Failed to mark all as read:', error);
      // ✅ Refetch on error to sync
      await fetchNotifications();
    }
  };

  const deleteNotification = async (id: number) => {
    try {
      console.log('📬 Deleting notification:', id);
      await notificationService.deleteNotification(id);
      
      // ✅ Update local state immediately
      const updatedNotifications = notifications.filter(n => n.id !== id);
      setNotifications(updatedNotifications);
      
      // ✅ Update unread count
      const wasUnread = notifications.find(n => n.id === id)?.is_read === false;
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      console.log('✅ Notification deleted locally');
    } catch (error) {
      console.error('❌ Failed to delete notification:', error);
      // ✅ Refetch on error to sync
      await fetchNotifications();
    }
  };

  // ✅ Add refresh method
  const refreshNotifications = async () => {
    console.log('🔄 Refreshing notifications...');
    await fetchNotifications();
  };

  // ✅ Auto-fetch on mount or userId change
  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  // ✅ Auto-refresh every 30 seconds (optional)
  useEffect(() => {
    if (!userId) return;
    
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing notifications...');
      fetchNotifications();
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [userId]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      fetchNotifications,
      markAsRead,
      markAllAsRead, // ✅ Now included
      deleteNotification,
      refreshNotifications, // ✅ Now included
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};