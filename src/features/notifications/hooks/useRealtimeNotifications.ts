import { useState, useEffect, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { signalRService } from '@/core/lib/signalRService';
import { notificationsApi } from '../api/notifications.api';
import { NotificationDto } from '@/core/types/api';
import { queryKeys } from '@/core/lib/queryKeys';
import { toast } from 'sonner';
import { useI18n } from '@/i18n';
import { notificationSound } from '@/core/utils/notificationSound';

/**
 * Hook for real-time notifications using SignalR
 * Manages WebSocket connection and syncs with React Query cache
 */
export const useRealtimeNotifications = (userId: number, accessToken: string) => {
  const { t, language } = useI18n();
  const queryClient = useQueryClient();
  const [isConnected, setIsConnected] = useState(false);
  const hasInitialized = useRef(false);


  // Handle incoming notification from SignalR
  const handleNotification = useCallback(
    (notification: NotificationDto) => {
      
      // Add receivedAt timestamp for new notifications
      const enrichedNotification = {
        ...notification,
        receivedAt: new Date().toISOString(), // Mark when it was received by client
      };
      
      // Update React Query cache
      queryClient.setQueryData<NotificationDto[]>(
        queryKeys.notifications.user(userId),
        (oldData) => {
          if (!oldData) return [enrichedNotification];
          // Add new notification to the beginning
          return [enrichedNotification, ...oldData];
        }
      );

      // Invalidate related queries to refresh counts
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.notifications.all 
      });

      // Play notification sound
      // Play notification sound
      notificationSound.playNotificationSound();

      // Show toast notification with icon
      const title = language === 'ar' ? notification.titleAr : (notification.titleEn || notification.titleAr);
      const body = language === 'ar' ? notification.messageAr : (notification.messageEn || notification.messageAr);

      toast.success(title, {
        description: body,
        duration: 6000,
        position: 'top-right',
        className: 'notification-toast',
        action: notification.relatedEntityType === 'UserRequest' && notification.relatedEntityId
          ? {
              label: t('notifications.viewDetails'),
              onClick: () => {
                window.location.href = `/dashboard/request/${notification.relatedEntityId}`;
              },
            }
          : undefined,
      });
    },
    [userId, queryClient, language, t]
  );

  useEffect(() => {
    
    // Prevent double initialization in React StrictMode
    if (hasInitialized.current) {
      return;
    }
    
    // Skip if user is not authenticated
    if (!userId || !accessToken) {
      return;
    }

    const initializeSignalR = async () => {
      try {
        // Start SignalR connection
        await signalRService.start(accessToken);
        setIsConnected(true);
        hasInitialized.current = true;

        // Subscribe to notifications
        signalRService.onNotification(handleNotification);

      } catch (error) {
        console.warn('❌ Failed to initialize SignalR, falling back to polling:', error);
        setIsConnected(false);
        // Don't throw - let the polling mechanism handle notifications
      }
    };

    initializeSignalR();

    // Cleanup on unmount
    return () => {
      signalRService.offNotification();

    };
  }, [userId, accessToken, handleNotification]);

  return {
    isConnected,
    connectionState: signalRService.getConnectionState(),
  };
};

/**
 * Hook to manage SignalR connection lifecycle
 * Should be used at the app root level after authentication
 */
export const useSignalRConnection = (accessToken: string | null) => {
  useEffect(() => {
    if (!accessToken) {
      // Stop connection when user logs out
      signalRService.stop();
      return;
    }

    // Start connection when user logs in
    const connect = async () => {
      try {
        await signalRService.start(accessToken);
      } catch (error) {
        console.warn('Failed to connect to SignalR (notifications will use polling):', error);
        // Don't throw - this is not critical, polling will work as fallback
      }
    };

    connect();

    return () => {
      // Cleanup on unmount or when token changes
      signalRService.stop();
    };
  }, [accessToken]);

  return {
    isActive: signalRService.isConnectionActive(),
    state: signalRService.getConnectionState(),
  };
};
