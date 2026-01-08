import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { toast } from 'sonner';
import { useI18n } from '@/i18n';
import { ApiError } from '@/core/types/api';

export const useVerifyEmailPage = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Define mutations first
  const verifyMutation = useMutation({
    mutationFn: (otpCode: string) => authApi.verifyEmail(otpCode),
    onSuccess: () => {
      toast.success(t('auth.emailVerifiedSuccess'));
      // Redirect to dashboard after successful verification
      navigate('/dashboard');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || t('auth.verificationFailed'));
    },
  });

  const resendMutation = useMutation({
    mutationFn: () => authApi.resendVerificationOtp(),
    onSuccess: () => {
      toast.success(t('auth.otpResentSuccess'));
      setTimer(60);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || t('auth.otpResendFailed'));
    },
  });

  // Check if user has temp token OR URL params (from email link), otherwise redirect to register
  useEffect(() => {
    const tempToken = localStorage.getItem('tempAuthToken');
    const otpFromUrl = searchParams.get('otp');
    const tokenFromUrl = searchParams.get('token');
    const emailFromUrl = searchParams.get('email');
    
    // If coming from email link with OTP, auto-fill it
    if (otpFromUrl && otpFromUrl.length === 6) {
      const otpArray = otpFromUrl.split('');
      setOtp(otpArray);
      // Auto-submit if we have a valid OTP from URL
      setTimeout(() => {
        verifyMutation.mutate(otpFromUrl);
      }, 500);
    }
    
    // If user has verification token from email, store it temporarily
    if (tokenFromUrl) {
      localStorage.setItem('tempAuthToken', tokenFromUrl);
    }
    
    // Store email from URL if provided
    if (emailFromUrl) {
      localStorage.setItem('verificationEmail', emailFromUrl);
    }
    
    // Only redirect to register if no temp token AND no URL params
    if (!tempToken && !otpFromUrl && !tokenFromUrl) {
      toast.error(t('auth.pleaseRegisterFirst'));
      navigate('/register');
    }
  }, [navigate, t, searchParams, verifyMutation]);

  // Timer for resend OTP
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
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
      setOtp(newOtp);
      
      // Focus the next empty input or last input
      const nextEmptyIndex = newOtp.findIndex((val) => !val);
      const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
      const input = document.getElementById(`otp-${focusIndex}`);
      input?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');
    
    if (otpCode.length !== 6) {
      toast.error(t('auth.enterCompleteOtp'));
      return;
    }

    verifyMutation.mutate(otpCode);
  };

  const handleResend = () => {
    if (canResend && !resendMutation.isPending) {
      resendMutation.mutate();
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
