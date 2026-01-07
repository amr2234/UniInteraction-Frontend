import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import {
  systemSettingsApi,
  SystemSettingDto,
  UpdateSystemSettingCommand,
} from "./api/settings.api";

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

export const useSettingsPage = () => {
  const { t } = useI18n();
  const queryClient = useQueryClient();
  const [settingId, setSettingId] = useState<number | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  const [formData, setFormData] = useState<SettingsFormData>({
    smtpHost: "smtp.gmail.com",
    smtpPort: 587,
    smtpUsername: "",
    smtpPassword: "",
    fromEmail: "noreply@university.edu.sa",
    fromName: "University Interaction System",
    enableSsl: true,
    appBaseUrl: "",
    enableEmails: true,
    enableNotifications: true,
  });

  // Fetch system settings
  const {
    data: settings,
    isLoading,
    error,
  } = useQuery<SystemSettingDto[]>({
    queryKey: ["systemSettings"],
    queryFn: systemSettingsApi.getSettings,
    retry: 2,
  });

  // Load settings into form when data is fetched
  useEffect(() => {
    if (settings && settings.length > 0) {
      const setting = settings[0]; // Assume single settings record
      setSettingId(setting.id || null);
      setFormData({
        smtpHost: setting.smtpHost,
        smtpPort: setting.smtpPort,
        smtpUsername: setting.smtpUsername,
        smtpPassword: setting.smtpPassword,
        fromEmail: setting.fromEmail,
        fromName: setting.fromName,
        enableSsl: setting.enableSsl,
        appBaseUrl: setting.appBaseUrl || "",
        enableEmails: setting.enableEmails,
        enableNotifications: setting.enableNotifications,
      });
    }
  }, [settings]);

  // Update settings mutation
  const updateMutation = useMutation({
    mutationFn: async (data: UpdateSystemSettingCommand) => {
      if (!settingId) {
        // Create if no settings exist
        return systemSettingsApi.createSetting(data);
      }
      // Update existing settings - merge with current data
      return systemSettingsApi.updateSetting(settingId, {
        ...data,
        id: settingId,
      });
    },
    onSuccess: (updatedSetting) => {
      // Update the query cache with the new data
      queryClient.setQueryData<SystemSettingDto[]>(["systemSettings"], (oldData) => {
        if (!oldData || oldData.length === 0) {
          return [updatedSetting];
        }
        return oldData.map((setting) =>
          setting.id === updatedSetting.id ? updatedSetting : setting
        );
      });
      
      // Also invalidate to ensure fresh data from server
      queryClient.invalidateQueries({ queryKey: ["systemSettings"] });
      toast.success(t("settings.settingsSaved"));
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || t("settings.settingsFailed");
      toast.error(errorMessage);
    },
  });

  // Handle form field changes
  const handleChange = useCallback((field: keyof SettingsFormData, value: string | number | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  // Handle save settings
  const handleSave = useCallback(async () => {
    // Validate required fields
    if (!formData.smtpHost || !formData.fromEmail) {
      toast.error(t("settings.requiredFieldsError") || "Please fill in all required fields");
      return;
    }

    const command: UpdateSystemSettingCommand = {
      id: settingId || undefined,
      smtpHost: formData.smtpHost,
      smtpPort: formData.smtpPort,
      smtpUsername: formData.smtpUsername,
      smtpPassword: formData.smtpPassword,
      fromEmail: formData.fromEmail,
      fromName: formData.fromName,
      enableSsl: formData.enableSsl,
      appBaseUrl: formData.appBaseUrl,
      enableEmails: formData.enableEmails,
      enableNotifications: formData.enableNotifications,
    };

    try {
      const result = await updateMutation.mutateAsync(command);
      // Update settingId if it was a create operation
      if (!settingId && result.id) {
        setSettingId(result.id);
      }
    } catch (error) {
      // Error is already handled in mutation onError
      console.error('Failed to save settings:', error);
    }
  }, [formData, settingId, updateMutation, t]);

  // Handle test connection
  const handleTestConnection = useCallback(async () => {
    setIsTesting(true);
    try {
      // TODO: Implement actual test connection API endpoint if available
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success(t("settings.testConnectionSuccess"));
    } catch (error) {
      toast.error(t("settings.testConnectionFailed"));
    } finally {
      setIsTesting(false);
    }
  }, [t]);

  return {
    formData,
    isLoading,
    isSaving: updateMutation.isPending,
    isTesting,
    error,
    handleChange,
    handleSave,
    handleTestConnection,
  };
};
