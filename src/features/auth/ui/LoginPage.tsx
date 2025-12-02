import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Shield, IdCard, Eye, EyeOff } from "lucide-react";
import nafathLogo from "@/assets/Nafaz.png";
import { useLoginPage } from "./LoginPage.logic";
import { useI18n } from "@/i18n";

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  
  const {
    formData,
    errors,
    nafathData,
    nafathErrors,
    isLoading,
    showNafathLogin,
    nafathStep,
    nafathSession,
    login,
    setNafathData,
    setNafathErrors,
    handleInputChange,
    handleNafathRequestOtp,
    handleCancelNafath,
    handleCredentialsLogin,
    toggleLoginMethod
  } = useLoginPage();

  const { t } = useI18n();

  return (
    <div className="min-h-screen gradient-primary flex items-center justify-center p-4">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <Card className="w-full max-w-md p-8 relative z-10 rounded-2xl border-0 shadow-soft-lg">
        <div className="text-center mb-6 items-center justify-center">
          <div className="items-center justify-center mb-6">
          </div>
          <h2 className="text-[#2B2B2B] mb-2 text-center">{t("auth.login")}</h2>
          <p className="text-[#6F6F6F] text-center">{t("common.appName")}</p>
        </div>

        {!showNafathLogin ? (
          <>
            <div className="mb-6">
              <Button
                onClick={toggleLoginMethod}
                className="w-full gradient-primary hover:opacity-90 h-14 gap-3 rounded-xl shadow-soft"
                size="lg"
                type="button"
              >
                <Shield className="w-6 h-6" />
                <span>{t("auth.login")} {t("common.nafath")}</span>
              </Button>
              <p className="text-xs text-[#6F6F6F] text-center mt-2">
                {t("auth.nafathRecommended")}
              </p>
            </div>

            <div className="relative my-6">
              <Separator />
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-sm text-[#6F6F6F]">
                {t("common.or")}
              </span>
            </div>

            <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-[#2B2B2B]">
              {t("auth.email")}
            </Label>
            <div className="relative mt-2">
              {/* <Mail className="absolute top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5 rtl:right-3 ltr:left-3" /> */}
              <Input
                id="email"
                type="email"
                placeholder={t("auth.emailPlaceholder")}
                value={formData.email}
                onChange={(e) => {
                  handleInputChange("email", e.target.value);
                }}
                className={`rounded-xl rtl:pr-12 ltr:pl-12 ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                dir="ltr"
                disabled={login.isPending}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-[#2B2B2B]">
              {t("auth.password")}
            </Label>
            <div className="relative mt-2">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={t("auth.passwordPlaceholder")}
                value={formData.password}
                onChange={(e) => {
                  handleInputChange("password", e.target.value);
                }}
                className={`rounded-xl pr-12 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                disabled={login.isPending}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-1/2 transform -translate-y-1/2 text-[#6F6F6F] hover:text-[#2B2B2B] right-3"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Link
              to="/forgot-password"
              className="text-sm text-[#6CAEBD] hover:text-[#875E9E] transition"
            >
              {t("auth.forgotPassword")}
            </Link>
          </div>

          <Button
            type="submit"
            disabled={login.isPending}
            className="w-full bg-[#875E9E] hover:bg-[#875E9E]/90 rounded-xl"
            size="lg"
          >
            {login.isPending ? t("common.loading") : t("auth.login")}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-sm text-[#6F6F6F]">
            {t("auth.dontHaveAccount")}{" "}
            <Link to="/register" className="text-[#6CAEBD] hover:text-[#875E9E] transition">
              {t("auth.register")}
            </Link>
          </p>
        </div>
          </>
        ) : (
          <>
            {nafathStep === 'nationalId' ? (
              <form onSubmit={handleNafathRequestOtp} className="space-y-4">
                <div>
                  <Label htmlFor="nationalId" className="text-[#2B2B2B]">
                    {t("form.nationalId")}
                  </Label>
                  <div className="relative mt-2">
                    <IdCard className="absolute top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5 rtl:right-3 ltr:left-3" />
                    <Input
                      id="nationalId"
                      type="text"
                      placeholder="1234567890"
                      value={nafathData.nationalId}
                      onChange={(e) => {
                        setNafathData({ ...nafathData, nationalId: e.target.value });
                        if (nafathErrors.nationalId) setNafathErrors({ ...nafathErrors, nationalId: undefined });
                      }}
                      className={`rounded-xl rtl:pr-12 ltr:pl-12 ${nafathErrors.nationalId ? 'border-red-500 focus:ring-red-500' : ''}`}
                      dir="ltr"
                      maxLength={10}
                    />
                  </div>
                  {nafathErrors.nationalId && (
                    <p className="text-red-500 text-sm mt-1">{nafathErrors.nationalId}</p>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex gap-3">
                    <Shield className="w-5 h-5 text-[#6CAEBD] mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-[#2B2B2B]">
                      <p className="font-semibold mb-1">{t("auth.nafathInstructions")}</p>
                      <ul className="list-disc list-inside space-y-1 text-[#6F6F6F]">
                        <li>{t("auth.nafathStep1")}</li>
                        <li>{t("auth.nafathStep2")}</li>
                        <li>{t("auth.nafathStep3")}</li>
                        <li>{t("auth.nafathStep4")}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full gradient-primary hover:opacity-90 rounded-xl"
                  size="lg"
                >
                  {isLoading ? t("common.loading") : t("auth.continueWithNafath")}
                </Button>

                <Button
                  type="button"
                  onClick={toggleLoginMethod}
                  variant="outline"
                  className="w-full rounded-xl"
                  size="lg"
                >
                  {t("auth.loginWithEmail")}
                </Button>
              </form>
            ) : (
               <div className="space-y-4">
                <div className="bg-gradient-to-br from-[#4A9B8E] to-[#3A8A7E] rounded-3xl p-8 text-white shadow-lg">
                  <div className="text-center">
                    <div className="flex justify-center mb-6">
                      <img src={nafathLogo} alt="نفاذ" className="h-16 rounded-2xl" />
                    </div>
                    
                    <p className="text-base font-semibold mb-4 text-white">{t("auth.verificationNumber")}</p>
                    
                    <div className="bg-white rounded-2xl py-8 px-6 mb-4">
                      <div className="text-8xl font-bold tracking-[0.3em] font-mono text-[#4A9B8E]">
                        {nafathSession?.randomNumber || '00'}
                      </div>
                    </div>
                    
                    <p className="text-sm text-white font-medium">{t("auth.matchNumber")}</p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0 mt-1">
                      <span className="text-white text-lg">✓</span>
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-[#2B2B2B] mb-2">{t("auth.nextSteps")}</p>
                      <ol className="list-decimal list-inside space-y-1 text-[#6F6F6F]">
                        <li>{t("auth.openNafathApp")}</li>
                        <li>{t("auth.checkSameNumber")}</li>
                        <li>{t("auth.confirmLogin")}</li>
                      </ol>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 py-4">
                  <div className="w-2 h-2 bg-[#6CAEBD] rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-[#6CAEBD] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-[#6CAEBD] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  <p className="text-sm text-[#6F6F6F] mr-3">{t("auth.waitingConfirmation")}</p>
                </div>

                <Button
                  type="button"
                  onClick={handleCancelNafath}
                  variant="outline"
                  className="w-full rounded-xl border-red-300 text-red-600 hover:bg-red-50"
                  size="lg"
                >
                  {t("common.cancel")}
                </Button>
              </div>
            )}
          </>
        )}

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
