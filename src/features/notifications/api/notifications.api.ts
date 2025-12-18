import { apiRequest } from '@/core/lib/apiClient';
import { NotificationDto } from '@/core/types/api';

// ============================================
// Notifications API Functions
// ============================================

export const notificationsApi = {
  /**
   * Get notifications for a specific user
   * @param userId - User ID
   * @param unreadOnly - Optional flag to get only unread notifications
   */
  getUserNotifications: async (userId: number, unreadOnly = false): Promise<NotificationDto[]> => {
    console.log("📡 Fetching notifications for user:", userId, "unreadOnly:", unreadOnly);
    const result = await apiRequest.get<NotificationDto[]>(
      `/Notifications/user/${userId}?unreadOnly=${unreadOnly}`
    );
    console.log("✅ Notifications fetched:", result);
    return result;
  },

  /**
   * Mark notification as read
   */
  markNotificationAsRead: async (notificationId: number): Promise<void> => {
    return apiRequest.put<void>(`/Notifications/${notificationId}/mark-read`);
  },

  /**
   * Mark all notifications as read for current user
   */
  markAllAsRead: async (userId: number): Promise<void> => {
    return apiRequest.put<void>(`/Notifications/user/${userId}/mark-all-read`);
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (notificationId: number): Promise<void> => {
    return apiRequest.delete<void>(`/Notifications/${notificationId}`);
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (userId: number): Promise<number> => {
    const notifications = await apiRequest.get<NotificationDto[]>(
      `/Notifications/user/${userId}?unreadOnly=true`
    );
    return notifications.length;
  },
};
