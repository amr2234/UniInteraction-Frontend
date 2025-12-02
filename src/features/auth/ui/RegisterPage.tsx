import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, Mail, Lock, Phone, IdCard, Eye, EyeOff } from "lucide-react";
import { useRegisterPage } from "./RegisterPage.logic";
import { useI18n } from "@/i18n";

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    formData,
    errors,
    register,
    handleInputChange,
    handleRegister
  } = useRegisterPage();

  const { t } = useI18n();

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md p-8 relative z-10 rounded-2xl border-0 shadow-soft-lg my-8">
        <div className="text-center mb-8">
          <h2 className="text-[#2B2B2B] mb-2 text-center">{t("auth.register")}</h2>
          <p className="text-[#6F6F6F] text-center">{t("common.appName")}</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label htmlFor="nameAr" className="text-[#2B2B2B]">
              {t("form.fullNameAr")} <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-2">
              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
              <Input
                id="nameAr"
                type="text"
                placeholder={t("auth.fullNameArPlaceholder")}
                value={formData.nameAr}
                onChange={(e) => {
                  handleInputChange("nameAr", e.target.value);
                }}
                className={`pr-10 rounded-xl ${errors.nameAr ? 'border-red-500 focus:ring-red-500' : ''}`}
                disabled={register.isPending}
              />
            </div>
            {errors.nameAr && (
              <p className="text-red-500 text-sm mt-1">{errors.nameAr}</p>
            )}
          </div>

          <div>
            <Label htmlFor="nameEn" className="text-[#2B2B2B]">
              {t("form.fullNameEn")} ({t("form.optional")})
            </Label>
            <div className="relative mt-2">
              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
              <Input
                id="nameEn"
                type="text"
                placeholder="Enter name in English"
                value={formData.nameEn}
                onChange={(e) => handleInputChange("nameEn", e.target.value)}
                className="pr-10 rounded-xl"
                dir="ltr"
                disabled={register.isPending}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="username" className="text-[#2B2B2B]">
              {t("form.username")} <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-2">
              <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
              <Input
                id="username"
                type="text"
                placeholder={t("auth.usernamePlaceholder")}
                value={formData.username}
                onChange={(e) => {
                  handleInputChange("username", e.target.value);
                }}
                className={`pr-10 rounded-xl ${errors.username ? 'border-red-500 focus:ring-red-500' : ''}`}
                disabled={register.isPending}
              />
            </div>
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div>
            <Label htmlFor="email" className="text-[#2B2B2B]">
              {t("auth.email")} <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-2">
              <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
              <Input
                id="email"
                type="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={(e) => {
                  handleInputChange("email", e.target.value);
                }}
                className={`pr-10 rounded-xl ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                dir="ltr"
                disabled={register.isPending}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-[#2B2B2B]">
              {t("auth.password")} <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-2">
              <Eye
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </Eye>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.passwordPlaceholder")}
                value={formData.password}
                onChange={(e) => {
                  handleInputChange("password", e.target.value);
                }}
                className={`pr-10 rounded-xl ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                disabled={register.isPending}

       
              />

            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <Label htmlFor="confirmPassword" className="text-[#2B2B2B]">
              {t("auth.confirmPassword")} <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-2">
              <Eye
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </Eye>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder={t("auth.confirmPasswordPlaceholder")}
                value={formData.confirmPassword}
                onChange={(e) => {
                  handleInputChange("confirmPassword", e.target.value);
                }}
                className={`pr-10 rounded-xl ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                disabled={register.isPending}
              />

            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <div>
            <Label htmlFor="mobile" className="text-[#2B2B2B]">
              {t("form.mobile")} <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-2">
              <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
              <Input
                id="mobile"
                type="tel"
                placeholder="05xxxxxxxx"
                value={formData.mobile}
                onChange={(e) => {
                  handleInputChange("mobile", e.target.value);
                }}
                className={`pr-10 rounded-xl ${errors.mobile ? 'border-red-500 focus:ring-red-500' : ''}`}
                dir="ltr"
                disabled={register.isPending}
              />
            </div>
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
            )}
          </div>

          <div>
            <Label htmlFor="isStudent" className="text-[#2B2B2B] mb-3 block">
              {t("auth.isStudent")} <span className="text-red-500">*</span>
            </Label>
            <RadioGroup
              value={formData.isStudent ? "true" : "false"}
              onValueChange={(value: string) => handleInputChange("isStudent", value === "true")}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="false" id="not-student" />
                <Label htmlFor="not-student" className="pl-2 cursor-pointer text-[#2B2B2B]">
                  {t("requests.no")}
                </Label>
              </div>
              <div className="flex items-center space-x-2 space-x-reverse">
                <RadioGroupItem value="true" id="is-student" />
                <Label htmlFor="is-student" className="pl-2 cursor-pointer text-[#2B2B2B]">
                  {t("requests.yes")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          {formData.isStudent && (
            <div>
              <Label htmlFor="studentId" className="text-[#2B2B2B]">
                {t("auth.studentId")} <span className="text-red-500">*</span>
              </Label>
              <div className="relative mt-2">
                <IdCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
                <Input
                  id="studentId"
                  type="text"
                  placeholder={t("auth.studentIdPlaceholder")}
                  value={formData.studentId || ""}
                  onChange={(e) => {
                    handleInputChange("studentId", e.target.value);
                  }}
                  className={`pr-10 rounded-xl ${errors.studentId ? 'border-red-500 focus:ring-red-500' : ''}`}
                  dir="ltr"
                  disabled={register.isPending}
                />
              </div>
              {errors.studentId && (
                <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="nationalId" className="text-[#2B2B2B]">
              {t("form.nationalId")} <span className="text-red-500">*</span>
            </Label>
            <div className="relative mt-2">
              <IdCard className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
              <Input
                id="nationalId"
                type="text"
                placeholder="1234567890"
                value={formData.nationalId}
                onChange={(e) => {
                  handleInputChange("nationalId", e.target.value);
                }}
                className={`pr-10 rounded-xl ${errors.nationalId ? 'border-red-500 focus:ring-red-500' : ''}`}
                dir="ltr"
                disabled={register.isPending}
              />
            </div>
            {errors.nationalId && (
              <p className="text-red-500 text-sm mt-1">{errors.nationalId}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={register.isPending}
            className="w-full bg-[#875E9E] hover:bg-[#875E9E]/90 rounded-xl"
            size="lg"
          >
            {register.isPending ? t("common.loading") : t("auth.register")}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-sm text-[#6F6F6F]">
            {t("auth.alreadyHaveAccount")}{" "}
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