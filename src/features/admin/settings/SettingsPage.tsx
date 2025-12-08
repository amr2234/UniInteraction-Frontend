import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/i18n";
import { Mail, Bell, Save, TestTube } from "lucide-react";
import { toast } from "sonner";

interface EmailSettings {
  smtpServer: string;
  smtpPort: string;
  smtpUsername: string;
  smtpPassword: string;
  senderEmail: string;
  senderName: string;
  enableSsl: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  notifyOnRequestStatus: boolean;
  notifyOnNewRequest: boolean;
  notifyOnRequestAssignment: boolean;
}

export function SettingsPage() {
  const { t } = useI18n();
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const [emailSettings, setEmailSettings] = useState<EmailSettings>({
    smtpServer: "",
    smtpPort: "587",
    smtpUsername: "",
    smtpPassword: "",
    senderEmail: "",
    senderName: "",
    enableSsl: true,
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    notifyOnRequestStatus: true,
    notifyOnNewRequest: true,
    notifyOnRequestAssignment: true,
  });

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success(t("settings.testConnection") + " - " + t("common.success"));
    } catch (error) {
      toast.error(t("common.error"));
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveEmailSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(t("settings.settingsSaved"));
    } catch (error) {
      toast.error(t("settings.settingsFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotificationSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(t("settings.settingsSaved"));
    } catch (error) {
      toast.error(t("settings.settingsFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#2B2B2B]">{t("settings.systemSettings")}</h1>
        <p className="text-[#6F6F6F] mt-2">{t("settings.title")}</p>
      </div>

      <Tabs defaultValue="email" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-auto">
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {t("settings.emailSettings")}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            {t("settings.notificationSettings")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="email">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[#2B2B2B] mb-4">
                  {t("settings.emailSettings")}
                </h3>
                <p className="text-sm text-[#6F6F6F] mb-6">
                  Configure SMTP settings for sending emails
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="smtpServer">{t("settings.smtpServer")}</Label>
                  <Input
                    id="smtpServer"
                    value={emailSettings.smtpServer}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpServer: e.target.value })}
                    placeholder="smtp.gmail.com"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="smtpPort">{t("settings.smtpPort")}</Label>
                  <Input
                    id="smtpPort"
                    value={emailSettings.smtpPort}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                    placeholder="587"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="smtpUsername">{t("settings.smtpUsername")}</Label>
                  <Input
                    id="smtpUsername"
                    value={emailSettings.smtpUsername}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpUsername: e.target.value })}
                    placeholder="your-email@domain.com"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="smtpPassword">{t("settings.smtpPassword")}</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={emailSettings.smtpPassword}
                    onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                    placeholder="••••••••"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="senderEmail">{t("settings.senderEmail")}</Label>
                  <Input
                    id="senderEmail"
                    value={emailSettings.senderEmail}
                    onChange={(e) => setEmailSettings({ ...emailSettings, senderEmail: e.target.value })}
                    placeholder="noreply@domain.com"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="senderName">{t("settings.senderName")}</Label>
                  <Input
                    id="senderName"
                    value={emailSettings.senderName}
                    onChange={(e) => setEmailSettings({ ...emailSettings, senderName: e.target.value })}
                    placeholder={t("common.appName")}
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="enableSsl" className="text-base">{t("settings.enableSsl")}</Label>
                  <p className="text-sm text-[#6F6F6F]">Enable SSL/TLS encryption</p>
                </div>
                <Switch
                  id="enableSsl"
                  checked={emailSettings.enableSsl}
                  onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, enableSsl: checked })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleTestConnection}
                  disabled={isTesting}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <TestTube className="w-4 h-4" />
                  {isTesting ? t("common.loading") : t("settings.testConnection")}
                </Button>
                <Button
                  onClick={handleSaveEmailSettings}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-[#875E9E] hover:bg-[#875E9E]/90"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? t("common.loading") : t("settings.saveSettings")}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-[#2B2B2B] mb-4">
                  {t("settings.notificationSettings")}
                </h3>
                <p className="text-sm text-[#6F6F6F] mb-6">
                  Manage how you receive notifications
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="emailNotifications" className="text-base">
                      {t("settings.enableEmailNotifications")}
                    </Label>
                    <p className="text-sm text-[#6F6F6F]">Receive notifications via email</p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="smsNotifications" className="text-base">
                      {t("settings.enableSmsNotifications")}
                    </Label>
                    <p className="text-sm text-[#6F6F6F]">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    id="smsNotifications"
                    checked={notificationSettings.smsNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, smsNotifications: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="pushNotifications" className="text-base">
                      {t("settings.enablePushNotifications")}
                    </Label>
                    <p className="text-sm text-[#6F6F6F]">Receive push notifications</p>
                  </div>
                  <Switch
                    id="pushNotifications"
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) =>
                      setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                    }
                  />
                </div>

                <div className="border-t pt-4 mt-6">
                  <h4 className="font-semibold text-[#2B2B2B] mb-4">Notification Events</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label htmlFor="notifyOnRequestStatus" className="text-base">
                          {t("settings.notifyOnRequestStatus")}
                        </Label>
                      </div>
                      <Switch
                        id="notifyOnRequestStatus"
                        checked={notificationSettings.notifyOnRequestStatus}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, notifyOnRequestStatus: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label htmlFor="notifyOnNewRequest" className="text-base">
                          {t("settings.notifyOnNewRequest")}
                        </Label>
                      </div>
                      <Switch
                        id="notifyOnNewRequest"
                        checked={notificationSettings.notifyOnNewRequest}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, notifyOnNewRequest: checked })
                        }
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <Label htmlFor="notifyOnRequestAssignment" className="text-base">
                          {t("settings.notifyOnRequestAssignment")}
                        </Label>
                      </div>
                      <Switch
                        id="notifyOnRequestAssignment"
                        checked={notificationSettings.notifyOnRequestAssignment}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({ ...notificationSettings, notifyOnRequestAssignment: checked })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSaveNotificationSettings}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-[#875E9E] hover:bg-[#875E9E]/90"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? t("common.loading") : t("settings.saveSettings")}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
