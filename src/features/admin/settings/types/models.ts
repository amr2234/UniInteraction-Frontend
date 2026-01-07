export interface SystemSettingDto {
  id?: number;
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  enableSsl: boolean;
  appBaseUrl?: string;
  enableEmails: boolean;
  enableNotifications: boolean;
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateSystemSettingCommand {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  enableSsl: boolean;
  appBaseUrl?: string;
  enableEmails: boolean;
  enableNotifications: boolean;
}
export interface SettingsFormData {
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  enableSsl: boolean;
  appBaseUrl: string;
  enableEmails: boolean;
  enableNotifications: boolean;
}
