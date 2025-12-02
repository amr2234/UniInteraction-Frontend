import { apiRequest } from '@/core/lib/apiClient';
import { NotificationDto } from '@/core/types/api';

// ============================================
// Notifications API Functions
// ============================================

export const notificationsApi = {
  /**
   * Get notifications for a specific user
   */
  getUserNotifications: async (userId: number): Promise<NotificationDto[]> => {
    return apiRequest.get<NotificationDto[]>(`/notifications/user/${userId}`);
  },

  /**
   * Mark notification as read
   */
  markNotificationAsRead: async (notificationId: number): Promise<NotificationDto> => {
    return apiRequest.put<NotificationDto>(`/notifications/${notificationId}/mark-read`);
  },

  /**
   * Mark all notifications as read for current user
   */
  markAllAsRead: async (userId: number): Promise<void> => {
    return apiRequest.put<void>(`/notifications/user/${userId}/mark-all-read`);
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (notificationId: number): Promise<void> => {
    return apiRequest.delete<void>(`/notifications/${notificationId}`);
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (userId: number): Promise<number> => {
    return apiRequest.get<number>(`/notifications/user/${userId}/unread-count`);
  },
};
