// delivery-app/src/api/customerNotifications.ts
import apiClient from './client';

// apiClient already adds the auth token and returns response.data,
// so we re-wrap as { data } to keep existing callers (res.data) working.
const wrap = async (request: Promise<any>): Promise<{ data: any }> => ({
  data: await request,
});

export const customerNotificationAPI = {
  list: (limit = 50) =>
    wrap(apiClient.get('/notifications/me', { params: { limit } })),

  unreadCount: () => wrap(apiClient.get('/notifications/me/unread-count')),

  markRead: (id: number) => wrap(apiClient.post('/notifications/me/mark-read', { id })),

  markAllRead: () => wrap(apiClient.post('/notifications/me/mark-all-read', {})),
};