import { BaseApi } from '@/core/lib/baseApi';
import { NotificationDto } from '@/core/types/api';

class NotificationsApi extends BaseApi<NotificationDto> {
  constructor() {
    super('/Notifications');
  }

  async getUserNotifications(userId: number, unreadOnly = false): Promise<NotificationDto[]> {
    return this.customGet<NotificationDto[]>(`/user/${userId}?unreadOnly=${unreadOnly}`);
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    return this.customPut<void>(`/${notificationId}/mark-read`);
  }

  async markAllAsRead(userId: number): Promise<void> {
    return this.customPut<void>(`/user/${userId}/mark-all-read`);
  }

  async getUnreadCount(userId: number): Promise<number> {
    const notifications = await this.getUserNotifications(userId, true);
    return notifications.length;
  }
}

const notificationsApiInstance = new NotificationsApi();

export const notificationsApi = {
  getUserNotifications: (userId: number, unreadOnly?: boolean) => 
    notificationsApiInstance.getUserNotifications(userId, unreadOnly),
  markNotificationAsRead: (notificationId: number) => 
    notificationsApiInstance.markNotificationAsRead(notificationId),
  markAllAsRead: (userId: number) => notificationsApiInstance.markAllAsRead(userId),
  deleteNotification: (notificationId: number) => notificationsApiInstance.delete(notificationId),
  getUnreadCount: (userId: number) => notificationsApiInstance.getUnreadCount(userId),
};
