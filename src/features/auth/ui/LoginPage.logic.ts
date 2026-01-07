import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLogin } from "@/features/auth/hooks/useAuth";
import type { LoginRequest } from "@/core/types/api";
import { 
  validateForm as validateFormUtil, 
  validateField,
  requiredRule, 
  emailRule
} from "@/core/utils/validation";
import { useForm } from "@/core/utils/formUtils";
import { i18n } from "@/i18n/i18n";
import { toast } from "sonner";
import type { NafathLoginData, NafathSession } from "./LoginPage.types";

export const useLoginPage = () => {
  const navigate = useNavigate();
  const login = useLogin();
  const { formData, errors, setFormData, setErrors } = useForm<LoginRequest>({
    email: "",
    password: ""
  });
  
  // Consolidated state for Nafath login
  const [nafathState, setNafathState] = useState({
    data: { nationalId: "" } as NafathLoginData,
    errors: {} as Partial<NafathLoginData>,
    isLoading: false,
    showNafathLogin: false,
    step: 'nationalId' as 'nationalId' | 'waiting',
    session: null as NafathSession | null,
    pollingInterval: null as NodeJS.Timeout | null,
  });

  // Redirect to dashboard if user is already authenticated
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  // Helper to update nafath state
  const updateNafathState = (updates: Partial<typeof nafathState>) => {
    setNafathState(prev => ({ ...prev, ...updates }));
  };

  const getValidationRules = () => [
    requiredRule<LoginRequest>('email', formData.email, i18n.t("validation.emailRequired")),
    emailRule<LoginRequest>('email', formData.email, i18n.t("validation.invalidEmail")),
    requiredRule<LoginRequest>('password', formData.password, i18n.t("validation.passwordRequired")),
  ];

  const handleInputChange = (field: keyof LoginRequest, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
    
    const rules = getValidationRules();
    const fieldError = validateField(field, value, rules);
    
    if (fieldError) {
      setErrors(prev => ({ ...prev, [field]: fieldError }));
    }
  };

  const validateNafathNationalId = (): boolean => {
    const newErrors: Partial<NafathLoginData> = {};
    
    if (!nafathState.data.nationalId) {
      newErrors.nationalId = i18n.t("validation.nationalIdRequired");
    } else if (!/^[0-9]{10}$/.test(nafathState.data.nationalId)) {
      newErrors.nationalId = i18n.t("validation.nationalIdFormat");
    }
    
    updateNafathState({ errors: newErrors });
    return Object.keys(newErrors).length === 0;
  };

  const generateRandomNumber = (): string => {
    return Math.floor(10 + Math.random() * 90).toString();
  };

  const checkNafathStatus = async (transactionId: string) => {
    try {
      return 'pending';
    } catch (error) {
      return 'pending';
    }
  };

  const startPollingNafathStatus = (transactionId: string) => {
    const interval = setInterval(async () => {
      const status = await checkNafathStatus(transactionId);
      
      if (status === 'approved') {
        clearInterval(interval);
        updateNafathState({ pollingInterval: null });
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else if (status === 'rejected') {
        clearInterval(interval);
        updateNafathState({
          pollingInterval: null,
          step: 'nationalId',
          session: null,
        });
      }
    }, 3000);
    
    updateNafathState({ pollingInterval: interval });
    
    setTimeout(() => {
      if (interval) {
        clearInterval(interval);
        updateNafathState({
          pollingInterval: null,
          step: 'nationalId',
          session: null,
        });
      }
    }, 180000);
  };

  const handleNafathRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateNafathNationalId()) {
      return;
    }

    updateNafathState({ isLoading: true });
    
    try {
      const randomNumber = generateRandomNumber();
      await new Promise(resolve => setTimeout(resolve, 1000));
      const transactionId = `TXN-${Date.now()}`;
      
      updateNafathState({
        session: {
          transactionId,
          randomNumber,
          status: 'pending'
        },
        step: 'waiting',
      });
      
      startPollingNafathStatus(transactionId);
    } catch (error) {
    } finally {
      updateNafathState({ isLoading: false });
    }
  };

  const handleCancelNafath = () => {
    if (nafathState.pollingInterval) {
      clearInterval(nafathState.pollingInterval);
    }
    updateNafathState({
      pollingInterval: null,
      step: 'nationalId',
      session: null,
      data: { nationalId: "" },
    });
  };
  
  const validateFormFields = (): boolean => {
    const rules = getValidationRules();
    const newErrors = validateFormUtil(rules);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFormFields()) {
      return;
    }

    try {
      await login.mutateAsync(formData);
    } catch (error) {

    }
  };

  const toggleLoginMethod = () => {
    if (nafathState.pollingInterval) {
      clearInterval(nafathState.pollingInterval);
    }
    updateNafathState({
      showNafathLogin: !nafathState.showNafathLogin,
      pollingInterval: null,
      step: 'nationalId',
      data: { nationalId: "" },
      errors: {},
      session: null,
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    nafathData: nafathState.data,
    nafathErrors: nafathState.errors,
    isLoading: nafathState.isLoading,
    showNafathLogin: nafathState.showNafathLogin,
    nafathStep: nafathState.step,
    nafathSession: nafathState.session,
    login,
    setNafathData: (data: NafathLoginData) => updateNafathState({ data }),
    setNafathErrors: (errors: Partial<NafathLoginData>) => updateNafathState({ errors }),
    handleInputChange,
    handleNafathRequestOtp,
    handleCancelNafath,
    handleCredentialsLogin,
    toggleLoginMethod
  };
};