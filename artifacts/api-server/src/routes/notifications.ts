// // import { Router } from 'express';
// // import { db } from '../../../../lib/db/src'; // adjust to match your existing db import path
// // import { notifications } from '../../../../lib/db/src/schema/notifications';
// // import { eq, desc } from 'drizzle-orm';

// // const router = Router();

// // // GET /notifications?driver_id=X&business_id=Y&limit=20
// // router.get('/', async (req, res) => {
// //   const driverId = req.query.driver_id ? Number(req.query.driver_id) : undefined;
// //   const businessId = req.query.business_id ? Number(req.query.business_id) : undefined;
// //   const limit = req.query.limit ? Number(req.query.limit) : 20;

// //   let query = db.select().from(notifications).orderBy(desc(notifications.created_at)).limit(limit);

// //   if (driverId) {
// //     query = db
// //       .select()
// //       .from(notifications)
// //       .where(eq(notifications.driver_id, driverId))
// //       .orderBy(desc(notifications.created_at))
// //       .limit(limit);
// //   } else if (businessId) {
// //     query = db
// //       .select()
// //       .from(notifications)
// //       .where(eq(notifications.business_id, businessId))
// //       .orderBy(desc(notifications.created_at))
// //       .limit(limit);
// //   }

// //   const result = await query;
// //   res.json(result);
// // });

// // export default router;
 
// import { Router, type IRouter } from "express";
// import { db, notificationsTable } from "@workspace/db";
// import { eq, and, desc } from "drizzle-orm";
 
// const router: IRouter = Router();
 
// // GET /notifications?driver_id=X&business_id=Y&limit=20
// router.get("/", async (req, res): Promise<void> => {
//   const driverId = req.query.driver_id ? Number(req.query.driver_id) : undefined;
//   const businessId = req.query.business_id ? Number(req.query.business_id) : undefined;
//   const limit = req.query.limit ? Number(req.query.limit) : 20;
 
//   // 🔶 FIX — build the where conditions as an array and pass them to a
//   // single .where(and(...)) call. Drizzle's query builder returns a
//   // narrower type after each chained .where()/.orderBy()/.limit(), so
//   // reassigning `query = db.select()...` in different branches (as the
//   // original code did) breaks TypeScript — each branch produces an
//   // incompatible type for the same variable.
//   const conditions: any[] = [];
//   if (driverId) conditions.push(eq(notificationsTable.driverId, driverId));
//   if (businessId) conditions.push(eq(notificationsTable.businessId, businessId));
 
//   const result = await db
//     .select()
//     .from(notificationsTable)
//     .where(conditions.length > 0 ? and(...conditions) : undefined)
//     .orderBy(desc(notificationsTable.createdAt))
//     .limit(limit);
 
//   res.json(result);
// });
 
// export default router;
 // delivery-app/src/services/notificationService.ts
import { supabase } from './supabaseClient';

// ------------------------------------------------------------
// TYPES
// ------------------------------------------------------------
export interface Notification {
  id: number;
  business_id: number | null;
  driver_id: number | null;
  customer_id: number | null;
  type: string;
  message_text: string;
  is_read: boolean;
  created_at: string;
}

// ------------------------------------------------------------
// EXPRESS BACKEND API CALLS (GET)
// ------------------------------------------------------------

/**
 * Fetches notifications from your Express backend API.
 * Matches the GET /notifications?driver_id=X&business_id=Y&limit=Z route.
 */
const getNotifications = async (params: { 
  business_id?: number; 
  driver_id?: number; 
  limit?: number 
}): Promise<Notification[]> => {
  // ⚠️ REPLACE THIS WITH YOUR ACTUAL BACKEND URL
  const BASE_URL = 'YOUR_BACKEND_URL'; 
  
  // Build the URL with query parameters
  const queryParams = new URLSearchParams();
  if (params.business_id) queryParams.append('business_id', String(params.business_id));
  if (params.driver_id) queryParams.append('driver_id', String(params.driver_id));
  if (params.limit) queryParams.append('limit', String(params.limit));

  const url = `${BASE_URL}/notifications?${queryParams.toString()}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch notifications from server');
  }

  return response.json();
};

// ------------------------------------------------------------
// SUPABASE DIRECT MUTATIONS (Mark Read / Delete)
// ------------------------------------------------------------

/**
 * Marks a single notification as read directly via Supabase.
 */
const markAsRead = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', id);

  if (error) {
    console.error('Error marking notification as read:', error);
    throw new Error('Failed to mark notification as read');
  }
};

/**
 * Marks all notifications as read for a specific driver or business directly via Supabase.
 */
const markAllAsRead = async (params: { 
  business_id?: number; 
  driver_id?: number 
}): Promise<void> => {
  let query = supabase
    .from('notifications')
    .update({ is_read: true });

  if (params.driver_id) {
    query = query.eq('driver_id', params.driver_id);
  } else if (params.business_id) {
    query = query.eq('business_id', params.business_id);
  } else {
    throw new Error('Either driver_id or business_id is required to mark all as read');
  }

  const { error } = await query;

  if (error) {
    console.error('Error marking all notifications as read:', error);
    throw new Error('Failed to mark all notifications as read');
  }
};

/**
 * Deletes a single notification directly via Supabase.
 */
const deleteNotification = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting notification:', error);
    throw new Error('Failed to delete notification');
  }
};

// ------------------------------------------------------------
// EXPORT
// ------------------------------------------------------------
export default {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};