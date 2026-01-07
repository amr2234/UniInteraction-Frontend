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
        return notifications.filter((n) => 
          n.relatedEntityType === 'UserRequest' || 
          n.userRequestId || 
          n.relatedEntityId
        );
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

    // Navigate based on notification type and related entity
    const requestId = notification.relatedEntityId || notification.userRequestId;
    
    if (requestId) {
      // For all request-related notifications, navigate to request details
      navigate(`/dashboard/request/${requestId}`);
    } else if (notification.relatedEntityType === 'Visit' && notification.relatedEntityId) {
      // For visit notifications
      navigate(`/dashboard/request/${notification.relatedEntityId}`);
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

    if (diffMins < 1) return t('notifications.justNow');
    if (diffMins < 60) return t('notifications.minutesAgo').replace('{count}', diffMins.toString());
    if (diffHours < 24) return t('notifications.hoursAgo').replace('{count}', diffHours.toString());
    return t('notifications.daysAgo').replace('{count}', diffDays.toString());
  }, [t]);

  // Get notification icon based on type
  const getNotificationIcon = useCallback((type: string) => {
    const normalizedType = type?.toLowerCase() || 'default';
    const iconMap: Record<string, string> = {
      request_update: '🔄',
      request_status_change: '📋',
      new_reply: '💬',
      suggestion_accepted: '✅',
      request_closed: '✓',
      system: '🔔',
      visit_reminder: '📅',
      visit_scheduled: '📅',
      visit_rescheduled: '🔄',
      assignment: '👤',
      department_assigned: '🏢',
      user_assigned: '👤',
      default: '🔔',
    };
    return iconMap[normalizedType] || iconMap.default;
  }, []);

  // Get notification type label
  const getNotificationTypeLabel = useCallback((type: string) => {
    const normalizedType = type?.toLowerCase() || 'default';
    return t(`notifications.types.${normalizedType}`) || t('notifications.types.default');
  }, [t]);

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
