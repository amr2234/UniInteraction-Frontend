import { apiRequest } from "@/core/lib/apiClient";

/**
 * System Settings DTO - Matches backend SystemSetting entity
 */
export interface SystemSettingDto {
  id?: number;
  // SMTP Configuration
  smtpHost: string;
  smtpPort: number;
  smtpUsername: string;
  smtpPassword: string;
  fromEmail: string;
  fromName: string;
  enableSsl: boolean;
  
  // Application Settings
  appBaseUrl?: string;
  
  // Feature Toggles
  enableEmails: boolean;
  enableNotifications: boolean;
  
  // Audit fields
  createdAt?: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
}

/**
 * Create System Setting Command
 */
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

/**
 * Update System Setting Command
 */
export interface UpdateSystemSettingCommand extends CreateSystemSettingCommand {
  id?: number;
}

/**
 * System Settings API
 */
export const systemSettingsApi = {
  /**
   * Get all system settings
   * GET /api/SystemSettings
   */
  getSettings: async (): Promise<SystemSettingDto[]> => {
    return apiRequest.get<SystemSettingDto[]>('/systemsettings');
  },

  /**
   * Get system setting by ID
   * GET /api/SystemSettings/{id}
   */
  getSettingById: async (id: number): Promise<SystemSettingDto> => {
    return apiRequest.get<SystemSettingDto>(`/systemsettings/${id}`);
  },

  /**
   * Create new system setting
   * POST /api/SystemSettings
   */
  createSetting: async (command: CreateSystemSettingCommand): Promise<SystemSettingDto> => {
    return apiRequest.post<SystemSettingDto>('/systemsettings', command);
  },

  /**
   * Update existing system setting
   * PUT /api/SystemSettings/{id}
   */
  updateSetting: async (id: number, command: UpdateSystemSettingCommand): Promise<SystemSettingDto> => {
    return apiRequest.put<SystemSettingDto>(`/systemsettings/${id}`, command);
  },
};
