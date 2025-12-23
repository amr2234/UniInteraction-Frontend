import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useUserNotifications } from '../hooks/useNotifications';
import { notificationsApi } from '../api/notifications.api';
import { NotificationDto } from '@/core/types/api';
import { useUser } from '@/core/hooks/useUser';
import { useI18n } from '@/i18n';
import { toast } from 'sonner';

export type FilterType = 'all' | 'unread' | 'requests';

export const useNotificationsLogic = () => {
  const { t, language } = useI18n();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { userId: userIdString } = useUser();
  const userId = userIdString ? parseInt(userIdString, 10) : 0;

  // State
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Fetch notifications using the API
  const { 
    data: notifications = [], 
    isLoading, 
    error,
    refetch 
  } = useUserNotifications(userId);



  // Filtered notifications based on active filter
  const filteredNotifications = useMemo(() => {
    switch (activeFilter) {
      case 'unread':
        return notifications.filter((n) => !n.isRead);
      case 'requests':
        return notifications.filter((n) => n.relatedEntityType === 'UserRequest');
      default:
        return notifications;
    }
  }, [notifications, activeFilter]);

  // Calculate unread count
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  // Calculate request-related count
  const requestsCount = useMemo(
    () => notifications.filter((n) => n.relatedEntityType === 'UserRequest').length,
    [notifications]
  );

  // Mark single notification as read
  const handleMarkAsRead = useCallback(async (notificationId: number) => {
    try {
      await notificationsApi.markNotificationAsRead(notificationId);
      
      // Optimistically update the cache
      queryClient.setQueryData<NotificationDto[]>(
        ['notifications', userId],
        (oldData) => oldData?.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        ) || []
      );

      refetch();
    } catch (error) {
      toast.error(t('notifications.markReadError'));
    }
  }, [userId, queryClient, refetch, t]);

  // Mark all notifications as read
  const handleMarkAllAsRead = useCallback(async () => {
    try {
      await notificationsApi.markAllAsRead(userId);
      
      // Optimistically update the cache
      queryClient.setQueryData<NotificationDto[]>(
        ['notifications', userId],
        (oldData) => oldData?.map((n) => ({ ...n, isRead: true })) || []
      );

      toast.success(t('notifications.markAllReadSuccess'));
      refetch();
    } catch (error) {
      toast.error(t('notifications.markAllReadError'));
    }
  }, [userId, queryClient, refetch, t]);

  // Handle notification click
  const handleNotificationClick = useCallback((notification: NotificationDto) => {
    // Mark as read
    if (!notification.isRead) {
      handleMarkAsRead(notification.id);
    }

    // Navigate to request details if it's a request-related notification
    const requestId = notification.relatedEntityId || notification.userRequestId;
    
    if (notification.relatedEntityType === 'UserRequest' && requestId) {
      // Navigate to request details page
      navigate(`/dashboard/request/${requestId}`);
    }
  }, [handleMarkAsRead, navigate]);

  // Get time ago string - use receivedAt for real-time notifications, createdAt for old ones
  const getTimeAgo = useCallback((dateString: string, receivedAt?: string): string => {
    // Use receivedAt if available (for real-time notifications), otherwise use createdAt
    const timeToUse = receivedAt || dateString;
    const date = new Date(timeToUse);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (language === 'ar') {
      if (diffMins < 1) return 'الآن';
      if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
      if (diffHours < 24) return `منذ ${diffHours} ساعة`;
      return `منذ ${diffDays} يوم`;
    } else {
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }
  }, [language]);

  // Get notification icon based on type
  const getNotificationIcon = useCallback((type: string) => {
    const iconMap: Record<string, string> = {
      request_update: '🔄',
      request_status_change: '🔄',
      new_reply: '💬',
      suggestion_accepted: '✅',
      request_closed: '✓',
      system: '🔔',
      visit_reminder: '📅',
      assignment: '📋',
      default: '🔔',
    };
    return iconMap[type] || iconMap.default;
  }, []);

  // Get notification type label
  const getNotificationTypeLabel = useCallback((type: string) => {
    const typeMap: Record<string, string> = {
      request_update: language === 'ar' ? 'تحديث طلب' : 'Request Update',
      request_status_change: language === 'ar' ? 'تغيير حالة' : 'Status Change',
      new_reply: language === 'ar' ? 'رد جديد' : 'New Reply',
      suggestion_accepted: language === 'ar' ? 'قبول مقترح' : 'Suggestion Accepted',
      request_closed: language === 'ar' ? 'إغلاق طلب' : 'Request Closed',
      system: language === 'ar' ? 'نظام' : 'System',
      visit_reminder: language === 'ar' ? 'تذكير زيارة' : 'Visit Reminder',
      assignment: language === 'ar' ? 'تعيين' : 'Assignment',
    };
    return typeMap[type] || (language === 'ar' ? 'إشعار' : 'Notification');
  }, [language]);

  return {
    // State
    notifications,
    filteredNotifications,
    activeFilter,
    isLoading,
    error,
    unreadCount,
    requestsCount,
    language,
    
    // Actions
    setActiveFilter,
    handleMarkAsRead,
    handleMarkAllAsRead,
    handleNotificationClick,
    
    // Helpers
    getTimeAgo,
    getNotificationIcon,
    getNotificationTypeLabel,
    t,
  };
};
