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
      return;
    }

    if (!accessToken || accessToken.trim() === '') {
      return;
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5193/api';
    const baseUrl = apiUrl.replace(/\/api$/, '');



    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/hubs/notifications`, {
          accessTokenFactory: () => {
            return accessToken;
          },
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
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
        this.isConnected = true;
      });

      this.connection.onclose((error) => {
        this.isConnected = false;
      });

      await this.connection.start();
      this.isConnected = true;
    } catch (error) {
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
      return;
    }
    this.connection.on('ReceiveNotification', (notification: NotificationDto) => {
    });
    
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
    } catch (error) {
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
