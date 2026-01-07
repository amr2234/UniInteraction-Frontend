import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Mail, Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import logoImage from "@/assets/Logo-Test.png";
import { useCreatePasswordPage } from "./CreatePasswordPage.logic";
import { useI18n } from "@/i18n";

export function CreatePasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    formData,
    errors,
    isSubmitting,
    handleInputChange,
    handleSubmit
  } = useCreatePasswordPage();

  const { t } = useI18n();

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md p-8 relative z-10 rounded-2xl border-0 shadow-soft-lg">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img src={logoImage} alt={t("common.appName")} className="h-16" />
          </div>
          
          <div className="mx-auto w-16 h-16 bg-[#875E9E]/10 rounded-full flex items-center justify-center mb-4">
            <KeyRound className="w-8 h-8 text-[#875E9E]" />
          </div>
          
          <h2 className="text-[#2B2B2B] mb-2 text-center">{t("auth.createPassword")}</h2>
          <p className="text-[#6F6F6F] text-sm text-center">
            {t("auth.createPasswordDescription")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <Label htmlFor="email" className="text-[#2B2B2B]">
              {t("auth.email")} <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-2">
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
              <Input
                id="email"
                type="email"
                placeholder={t("auth.emailPlaceholder")}
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`pr-10 rounded-xl ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                dir="ltr"
                disabled={isSubmitting}
                autoFocus
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* New Password Field */}
          <div>
            <Label htmlFor="newPassword" className="text-[#2B2B2B]">
              {t("auth.newPassword")} <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] hover:text-[#875E9E] transition-colors z-10"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.newPasswordPlaceholder")}
                value={formData.newPassword}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                className={`pr-10 rounded-xl ${errors.newPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                disabled={isSubmitting}
              />
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
            )}
            <p className="text-xs text-[#6F6F6F] mt-1">
              {t("auth.passwordRequirements")}
            </p>
          </div>

          {/* Confirm Password Field */}
          <div>
            <Label htmlFor="confirmPassword" className="text-[#2B2B2B]">
              {t("auth.confirmPassword")} <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-2">
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] hover:text-[#875E9E] transition-colors z-10"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("auth.confirmPasswordPlaceholder")}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                className={`pr-10 rounded-xl ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                disabled={isSubmitting}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#875E9E] hover:bg-[#875E9E]/90 rounded-xl"
            size="lg"
          >
            {isSubmitting ? t("common.submitting") : t("auth.createPassword")}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-sm text-[#6F6F6F]">
            {t("auth.alreadyHavePassword")}{" "}
            <Link to="/login" className="text-[#6CAEBD] hover:text-[#875E9E] transition">
              {t("auth.login")}
            </Link>
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link to="/">
            <Button variant="ghost" className="text-[#6F6F6F] hover:text-[#6CAEBD]">
              {t("navigation.backToHome")}
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
