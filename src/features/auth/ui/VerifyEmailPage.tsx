import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mail, Clock } from "lucide-react";
import logoImage from "@/assets/Logo-Test.png";
import { useVerifyEmailPage } from "./VerifyEmailPage.logic";
import { useI18n } from "@/i18n";
import { i18n } from "@/i18n/i18n";

export function VerifyEmailPage() {
  const {
    otp,
    timer,
    canResend,
    isVerifying,
    isResending,
    handleOtpChange,
    handleKeyDown,
    handlePaste,
    handleSubmit,
    handleResend,
  } = useVerifyEmailPage();

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
            <Mail className="w-8 h-8 text-[#875E9E]" />
          </div>
          
          <h2 className="text-[#2B2B2B] mb-2 text-center">{t("auth.verifyEmail")}</h2>
          <p className="text-[#6F6F6F] text-sm text-center">
            {t("auth.verifyEmailDescription")}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#2B2B2B] text-center mb-4">
              {t("auth.enterOtpCode")}
            </label>
            <div className="flex justify-center gap-2" dir="ltr">
              {otp.map((digit, index) => (
                <Input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={index === 0 ? handlePaste : undefined}
                  className="w-12 h-12 text-center text-lg font-semibold rounded-xl border-2 focus:border-[#875E9E]"
                  disabled={isVerifying}
                  autoFocus={index === 0}
                />
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isVerifying || otp.some(d => !d)}
            className="w-full bg-[#875E9E] hover:bg-[#875E9E]/90 rounded-xl"
            size="lg"
          >
            {isVerifying ? t("common.submitting") : t("auth.verifyEmail")}
          </Button>

          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-sm text-[#6F6F6F]">
              <Clock className="w-4 h-4" />
              <span>
                {canResend 
                  ? t("auth.canResendNow")
                  : i18n.interpolate("auth.resendIn", { seconds: timer.toString() })
                }
              </span>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={handleResend}
              disabled={!canResend || isResending}
              className="text-[#6CAEBD] hover:text-[#875E9E] disabled:opacity-50"
            >
              {isResending ? t("common.loading") : t("auth.resendOtp")}
            </Button>
          </div>
        </form>

        <div className="mt-6 pt-6 border-t text-center">
          <p className="text-sm text-[#6F6F6F]">
            {t("auth.wrongEmail")}{" "}
            <Link to="/register" className="text-[#6CAEBD] hover:text-[#875E9E] transition">
              {t("auth.changeEmail")}
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
