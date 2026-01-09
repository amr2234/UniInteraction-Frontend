import * as signalR from "@microsoft/signalr";
import { NotificationDto } from "@/core/types/api";

class SignalRService {
  private connection: signalR.HubConnection | null = null;
  private isConnected = false;

  async start(accessToken: string): Promise<void> {
    if (
      this.connection?.state === signalR.HubConnectionState.Connected ||
      this.connection?.state === signalR.HubConnectionState.Connecting
    ) {
      return;
    }

    if (!accessToken || accessToken.trim() === "") {
      return;
    }

    const apiUrl = import.meta.env.VITE_API_BASE_URL;
    const baseUrl = apiUrl.replace(/\/api$/, "");

    try {
      this.connection = new signalR.HubConnectionBuilder()
        .withUrl(`${baseUrl}/hubs/notifications`, {
          accessTokenFactory: () => {
            return accessToken;
          },
        })
        .withAutomaticReconnect({
          nextRetryDelayInMilliseconds: (retryContext) => {
            if (retryContext.previousRetryCount === 0) return 0;
            if (retryContext.previousRetryCount === 1) return 2000;
            if (retryContext.previousRetryCount === 2) return 10000;
            return 30000;
          },
        })
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this.connection.onreconnecting((error) => {
        console.warn("SignalR reconnecting...", error);
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

  onNotification(callback: (notification: NotificationDto) => void): void {
    if (!this.connection) {
      return;
    }
    this.connection.on(
      "ReceiveNotification",
      (notification: NotificationDto) => {
        // Trigger the callback with the notification
        callback(notification);
      }
    );
  }

  offNotification(): void {
    if (!this.connection) return;
    this.connection.off("ReceiveNotification");
  }

  async stop(): Promise<void> {
    if (!this.connection) return;

    try {
      await this.connection.stop();
      this.isConnected = false;
    } catch (error) {}
  }

  isConnectionActive(): boolean {
    return (
      this.isConnected &&
      this.connection?.state === signalR.HubConnectionState.Connected
    );
  }

  getConnectionState(): signalR.HubConnectionState | null {
    return this.connection?.state || null;
  }
}

export const signalRService = new SignalRService();
