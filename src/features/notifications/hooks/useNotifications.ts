import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '../api/notifications.api';
import { queryKeys } from '@/core/lib/queryKeys';
import { NotificationDto, ApiError } from '@/core/types/api';
import { toast } from 'sonner';

// ============================================
// Notification Hooks
// ============================================

/**
 * Hook to get user notifications
 */
export const useUserNotifications = (userId: number) => {
  return useQuery<NotificationDto[], ApiError>({
    queryKey: queryKeys.notifications.user(userId),
    queryFn: () => notificationsApi.getUserNotifications(userId),
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
    staleTime: 15000, // 15 seconds
  });
};

/**
 * Hook to mark notification as read
 */
export const useMarkNotificationAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number>({
    mutationFn: notificationsApi.markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
};

/**
 * Hook to mark all notifications as read
 */
export const useMarkAllNotificationsAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number>({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success('تم تحديد جميع الإشعارات كمقروءة');
    },
  });
};

/**
 * Hook to delete notification
 */
export const useDeleteNotification = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number>({
    mutationFn: notificationsApi.deleteNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
      toast.success('تم حذف الإشعار بنجاح');
    },
  });
};

/**
 * Hook to get unread notification count
 */
export const useUnreadNotificationCount = (userId: number) => {
  return useQuery<number, ApiError>({
    queryKey: [...queryKeys.notifications.user(userId), 'unread-count'],
    queryFn: () => notificationsApi.getUnreadCount(userId),
    enabled: !!userId,
    refetchInterval: 30000, // Refetch every 30 seconds
    staleTime: 15000, // 15 seconds
  });
};
