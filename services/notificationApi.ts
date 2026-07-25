import apiClient from '@/lib/apiClient';
import type {
  GetNotificationsParams,
  NotificationItem,
  PaginatedNotifications,
  UnreadCount,
  UpdatedCount,
} from '@/types/notifications';

export const notificationApi = {
  getNotifications: (params?: GetNotificationsParams) =>
    apiClient.get<PaginatedNotifications>('/notifications', { params }),

  getUnreadCount: () => apiClient.get<UnreadCount>('/notifications/unread-count'),

  markSeen: () => apiClient.patch<UpdatedCount>('/notifications/seen'),

  markAllRead: () => apiClient.patch<UpdatedCount>('/notifications/read-all'),

  markRead: (id: string) => apiClient.patch<NotificationItem>(`/notifications/${id}/read`),
};
