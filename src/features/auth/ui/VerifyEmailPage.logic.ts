import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { ApiError } from "@/core/types/api";

export const useVerifyEmailPage = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(120); // 2 minutes timer
  const [canResend, setCanResend] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  
  const verifyMutation = useMutation({
    mutationFn: ({ otp, email }: { otp: string; email: string }) => 
      authApi.verifyEmail(otp, email),
    onSuccess: (data) => {
      toast.success(t("auth.emailVerifiedSuccess"));
  
      // Check if user needs to create password (admin-created user)
      if (data.needsPasswordSetup) {
        // User created by admin → needs to create password
        // Store email for create password page
        if (data.email) {
          localStorage.setItem('verificationEmail', data.email);
        }
        navigate("/create-password");
      } else {
        // User self-registered → already has password, redirect to login
        // authToken is already set by verifyEmail API, just clean up
        localStorage.removeItem('verificationEmail');
        localStorage.removeItem('tempAuthToken');
        localStorage.removeItem('authToken');
        navigate("/login");
      }
    },
    onError: (error: ApiError) => {
      // Check if backend returns "Invalid or expired OTP code"
      const errorMessage = error.message || '';
      
      if (errorMessage === 'Invalid or expired OTP code') {
        // Show translated error based on current language
        toast.error(t("auth.invalidOtp"));
      } else {
        // Show backend error message or fallback to generic message
        toast.error(error.message || t("auth.verificationFailed"));
      }
    },
  });

  const resendMutation = useMutation({
    mutationFn: (email: string) => authApi.resendVerificationOtp(email),
    onSuccess: () => {
      toast.success(t("auth.otpResentSuccess"));
      setTimer(120); // Reset to 2 minutes
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || t("auth.otpResendFailed"));
    },
  });

  
  useEffect(() => {
    const tempToken = localStorage.getItem("tempAuthToken");
    const emailFromUrl = searchParams.get("email");

    // Store email for later use (resending OTP)
    if (emailFromUrl) {
      localStorage.setItem("verificationEmail", emailFromUrl);
      setUserEmail(emailFromUrl);
    } else {
      // Try to get email from localStorage if not in URL
      const storedEmail = localStorage.getItem("verificationEmail");
      if (storedEmail) {
        setUserEmail(storedEmail);
      }
    }

    if (!tempToken && !emailFromUrl) {
      toast.error(t("auth.pleaseRegisterFirst"));
      navigate("/register");
    }
  }, [navigate, t, searchParams]);

  
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleOtpChange = (index: number, value: string) => {
    
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData
        .split("")
        .concat(Array(6 - pastedData.length).fill(""));
      setOtp(newOtp);

      
      const nextEmptyIndex = newOtp.findIndex((val) => !val);
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
      const input = document.getElementById(`otp-${focusIndex}`);
      input?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("");

    if (otpCode.length !== 6) {
      toast.error(t("auth.enterCompleteOtp"));
      return;
    }

    // Get email at submission time from URL or localStorage
    const emailFromUrl = searchParams.get("email");
    const storedEmail = localStorage.getItem("verificationEmail");
    const email = emailFromUrl || storedEmail || "";

    verifyMutation.mutate({ otp: otpCode, email });
  };

  const handleResend = () => {
    if (canResend && !resendMutation.isPending) {
      // Get email at resend time from URL or localStorage
      const emailFromUrl = searchParams.get("email");
      const storedEmail = localStorage.getItem("verificationEmail");
      const email = emailFromUrl || storedEmail || "";
      
      resendMutation.mutate(email);
    }
  };

  return {
    otp,
    timer,
    canResend,
    isVerifying: verifyMutation.isPending,
    isResending: resendMutation.isPending,
    handleOtpChange,
    handleKeyDown,
    handlePaste,
    handleSubmit,
    handleResend,
  };
};
