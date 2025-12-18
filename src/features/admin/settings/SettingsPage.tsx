import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useI18n } from "@/i18n";
import { Mail, Save, TestTube, Loader2 } from "lucide-react";
import { useSettingsPage } from "./SettingsPage.logic";

export function SettingsPage() {
  const { t } = useI18n();
  const {
    formData,
    isLoading,
    isSaving,
    isTesting,
    handleChange,
    handleSave,
    handleTestConnection,
  } = useSettingsPage();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-6xl flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#875E9E]" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#2B2B2B]">{t("settings.systemSettings")}</h1>
        <p className="text-[#6F6F6F] mt-2">{t("settings.title")}</p>
      </div>

      <Card className="p-6">
        <div className="space-y-6">
          {/* Email/SMTP Settings Section */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-5 h-5 text-[#875E9E]" />
              <h3 className="text-xl font-semibold text-[#2B2B2B]">
                {t("settings.emailSettings")}
              </h3>
            </div>
            <p className="text-sm text-[#6F6F6F] mb-6">
              {t("settings.smtpDescription")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="smtpHost">{t("settings.smtpServer")}</Label>
              <Input
                id="smtpHost"
                value={formData.smtpHost}
                onChange={(e) => handleChange("smtpHost", e.target.value)}
                placeholder="smtp.gmail.com"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="smtpPort">{t("settings.smtpPort")}</Label>
              <Input
                id="smtpPort"
                type="number"
                value={formData.smtpPort}
                onChange={(e) => handleChange("smtpPort", parseInt(e.target.value) || 587)}
                placeholder="587"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="smtpUsername">{t("settings.smtpUsername")}</Label>
              <Input
                id="smtpUsername"
                value={formData.smtpUsername}
                onChange={(e) => handleChange("smtpUsername", e.target.value)}
                placeholder="your-email@domain.com"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="smtpPassword">{t("settings.smtpPassword")}</Label>
              <Input
                id="smtpPassword"
                type="password"
                value={formData.smtpPassword}
                onChange={(e) => handleChange("smtpPassword", e.target.value)}
                placeholder="••••••••"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="fromEmail">{t("settings.senderEmail")}</Label>
              <Input
                id="fromEmail"
                value={formData.fromEmail}
                onChange={(e) => handleChange("fromEmail", e.target.value)}
                placeholder="noreply@domain.com"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="fromName">{t("settings.senderName")}</Label>
              <Input
                id="fromName"
                value={formData.fromName}
                onChange={(e) => handleChange("fromName", e.target.value)}
                placeholder={t("common.appName")}
                className="mt-2"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="appBaseUrl">{t("settings.appBaseUrl")}</Label>
              <Input
                id="appBaseUrl"
                value={formData.appBaseUrl}
                onChange={(e) => handleChange("appBaseUrl", e.target.value)}
                placeholder="https://university.edu.sa"
                className="mt-2"
                dir="ltr"
              />
              <p className="text-xs text-[#6F6F6F] mt-1">{t("settings.appBaseUrlHint")}</p>
            </div>
          </div>

          {/* SSL Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <Label htmlFor="enableSsl" className="text-base">{t("settings.enableSsl")}</Label>
              <p className="text-sm text-[#6F6F6F]">Enable SSL/TLS encryption</p>
            </div>
            <Switch
              id="enableSsl"
              checked={formData.enableSsl}
              onCheckedChange={(checked) => handleChange("enableSsl", checked)}
            />
          </div>

          {/* Feature Toggles Section */}
          <div className="border-t pt-6 mt-6">
            <h4 className="font-semibold text-[#2B2B2B] mb-4">{t("settings.featureToggles")}</h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="enableEmails" className="text-base">
                    {t("settings.enableEmails")}
                  </Label>
                  <p className="text-sm text-[#6F6F6F]">{t("settings.enableEmailsDescription")}</p>
                </div>
                <Switch
                  id="enableEmails"
                  checked={formData.enableEmails}
                  onCheckedChange={(checked) => handleChange("enableEmails", checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <Label htmlFor="enableNotifications" className="text-base">
                    {t("settings.enableNotifications")}
                  </Label>
                  <p className="text-sm text-[#6F6F6F]">{t("settings.enableNotificationsDescription")}</p>
                </div>
                <Switch
                  id="enableNotifications"
                  checked={formData.enableNotifications}
                  onCheckedChange={(checked) => handleChange("enableNotifications", checked)}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleTestConnection}
              disabled={isTesting || isSaving}
              variant="outline"
              className="flex items-center gap-2"
            >
              {isTesting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <TestTube className="w-4 h-4" />
              )}
              {isTesting ? t("common.loading") : t("settings.testConnection")}
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving || isTesting}
              className="flex items-center gap-2 bg-[#875E9E] hover:bg-[#875E9E]/90"
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? t("common.saving") : t("settings.saveSettings")}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
