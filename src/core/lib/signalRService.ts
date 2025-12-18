import * as signalR from '@microsoft/signalr';
import { NotificationDto } from '@/core/types/api';

/**
 * SignalR Service for real-time notifications
 * Manages WebSocket connection to the backend notification hub
 */
class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isConnected = false;

  /**
   * Start SignalR connection
   * @param accessToken - JWT access token for authentication
   */
  async start(accessToken: string): Promise<void> {
    if (this.connection?.state === signalR.HubConnectionState.Connected || 
        this.connection?.state === signalR.HubConnectionState.Connecting) {
      console.log('SignalR already connected or connecting, state:', this.connection.state);
      return;
    }

    if (!accessToken || accessToken.trim() === '') {
      console.log('SignalR: No valid access token provided, skipping connection');
      return;
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5193/api';
    const baseUrl = apiUrl.replace(/\/api$/, '');

    console.log('SignalR connecting to:', `${baseUrl}/hubs/notifications`);
    console.log('SignalR token length:', accessToken?.length);

    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/hubs/notifications`, {
          accessTokenFactory: () => {
            console.log('SignalR requesting token for authentication');
            return accessToken;
          },
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            console.log('SignalR reconnect attempt:', retryContext.previousRetryCount);
            // Exponential backoff: 0s, 2s, 10s, 30s, then 30s
            if (retryContext.previousRetryCount === 0) return 0;
            if (retryContext.previousRetryCount === 1) return 2000;
            if (retryContext.previousRetryCount === 2) return 10000;
            return 30000;
          },
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

      // Connection event handlers
      this.connection.onreconnecting((error) => {
        console.warn('SignalR reconnecting...', error);
        this.isConnected = false;
      });

      this.connection.onreconnected((connectionId) => {
        console.log('SignalR reconnected:', connectionId);
        this.isConnected = true;
      });

      this.connection.onclose((error) => {
        console.error('SignalR connection closed:', error);
        this.isConnected = false;
      });

      await this.connection.start();
      this.isConnected = true;
      console.log('SignalR connected successfully');
    } catch (error) {
      console.error('Error starting SignalR connection:', error);
      this.isConnected = false;
      throw error;
    }
  }

  /**
   * Subscribe to real-time notification events
   * @param callback - Function to call when notification is received
   */
  onNotification(callback: (notification: NotificationDto) => void): void {
    if (!this.connection) {
      console.error('SignalR connection not initialized');
      return;
    }

    console.log('📡 SignalR: Setting up "ReceiveNotification" event listener');
    
    this.connection.on('ReceiveNotification', (notification: NotificationDto) => {
      console.log('🚨 SignalR EVENT FIRED: ReceiveNotification', notification);
      console.log('📦 Notification data:', {
        id: notification.id,
        titleAr: notification.titleAr,
        titleEn: notification.titleEn,
        messageAr: notification.messageAr,
        type: notification.type
      });
      console.log('🔔 Calling handleNotification callback...');
      callback(notification);
      console.log('✅ handleNotification callback executed');
    });
    
    console.log('✅ SignalR: "ReceiveNotification" listener registered successfully');
  }

  /**
   * Remove notification listener
   */
  offNotification(): void {
    if (!this.connection) return;
    this.connection.off('ReceiveNotification');
  }

  /**
   * Stop SignalR connection
   */
  async stop(): Promise<void> {
    if (!this.connection) return;

    try {
      await this.connection.stop();
      this.isConnected = false;
      console.log('SignalR disconnected');
    } catch (error) {
      console.error('Error stopping SignalR connection:', error);
    }
  }

  /**
   * Check if SignalR is connected
   */
  isConnectionActive(): boolean {
    return this.isConnected && this.connection?.state === signalR.HubConnectionState.Connected;
  }

  /**
   * Get current connection state
   */
  getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state || null;
  }
}

export const signalRService = new SignalRService();
