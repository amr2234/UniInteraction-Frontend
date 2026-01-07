import { useState } from "react";
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

interface NafathLoginData {
  nationalId: string;
}

interface NafathSession {
  transactionId: string;
  randomNumber: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const useLoginPage = () => {
  const navigate = useNavigate();
  const login = useLogin();
  const { formData, errors, setFormData, setErrors } = useForm<LoginRequest>({
    email: "",
    password: ""
  });
  const [nafathData, setNafathData] = useState<NafathLoginData>({
    nationalId: ""
  });
  const [nafathErrors, setNafathErrors] = useState<Partial<NafathLoginData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showNafathLogin, setShowNafathLogin] = useState(false);
  const [nafathStep, setNafathStep] = useState<'nationalId' | 'waiting'>('nationalId');
  const [nafathSession, setNafathSession] = useState<NafathSession | null>(null);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

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
    
    if (!nafathData.nationalId) {
      newErrors.nationalId = i18n.t("validation.nationalIdRequired");
    } else if (!/^[0-9]{10}$/.test(nafathData.nationalId)) {
      newErrors.nationalId = i18n.t("validation.nationalIdFormat");
    }
    
    setNafathErrors(newErrors);
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
        setPollingInterval(null);
        
        setTimeout(() => {
          navigate("/dashboard");
        }, 500);
      } else if (status === 'rejected') {
        clearInterval(interval);
        setPollingInterval(null);
        setNafathStep('nationalId');
        setNafathSession(null);
      }
    }, 3000);
    
    setPollingInterval(interval);
    
    setTimeout(() => {
      if (interval) {
        clearInterval(interval);
        setPollingInterval(null);
        setNafathStep('nationalId');
        setNafathSession(null);
      }
    }, 180000);
  };

  const handleNafathRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateNafathNationalId()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const randomNumber = generateRandomNumber();
      await new Promise(resolve => setTimeout(resolve, 1000));
      const transactionId = `TXN-${Date.now()}`;
      
      setNafathSession({
        transactionId,
        randomNumber,
        status: 'pending'
      });
      
      setNafathStep('waiting');
      startPollingNafathStatus(transactionId);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelNafath = () => {
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    setNafathStep('nationalId');
    setNafathSession(null);
    setNafathData({ nationalId: "" });
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
    if (pollingInterval) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
    setShowNafathLogin(!showNafathLogin);
    setNafathStep('nationalId');
    setNafathData({ nationalId: "" });
    setNafathErrors({});
    setNafathSession(null);
    setErrors({});
  };

  return {
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
  };
};