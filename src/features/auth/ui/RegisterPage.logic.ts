import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRegister } from "@/features/auth/hooks/useAuth";
import type { RegisterRequest } from "@/core/types/api";
import { 
  validateForm as validateFormUtil, 
  validateField,
  requiredRule, 
  emailRule, 
  minLengthRule, 
  phoneRule, 
  nationalIdRule, 
  confirmPasswordRule,
  patternRule,
  hasArabicRegex,
  noEnglishRegex,
  noArabicRegex
} from "@/core/utils/validation";
import { useForm } from "@/core/utils/formUtils";
import { i18n } from "@/i18n/i18n";
import { isTokenExpired } from "@/core/lib/authUtils";

export const useRegisterPage = () => {
  const navigate = useNavigate();
  const register = useRegister();
  const { formData, errors, setFormData, setErrors } = useForm<RegisterRequest>({
    username: "",
    nameAr: "",
    nameEn: "",
    email: "",
    password: "",
    confirmPassword: "",
    mobile: "",
    nationalId: "",
    isStudent: false,
    studentId: ""
  });

  // Redirect to dashboard if user is already authenticated with a VALID token
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    // Only redirect if token exists AND is not expired
    if (token && !isTokenExpired(token)) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const getValidationRules = () => [
    requiredRule<RegisterRequest>('username', formData.username, i18n.t("validation.usernameRequired")),
    // Name Arabic - required, must contain Arabic, no English allowed
    requiredRule<RegisterRequest>('nameAr', formData.nameAr, i18n.t("validation.fullNameArRequired")),
    patternRule<RegisterRequest>('nameAr', formData.nameAr, hasArabicRegex, i18n.t("validation.arabicRequired")),
    patternRule<RegisterRequest>('nameAr', formData.nameAr, noEnglishRegex, i18n.t("validation.noEnglishAllowed")),
    // Name English - optional, but if provided must be English only
    ...(formData.nameEn && formData.nameEn.trim() 
      ? [patternRule<RegisterRequest>('nameEn', formData.nameEn, noArabicRegex, i18n.t("validation.noArabicAllowed"))]
      : []),
    requiredRule<RegisterRequest>('email', formData.email, i18n.t("validation.emailRequired")),
    emailRule<RegisterRequest>('email', formData.email, i18n.t("validation.invalidEmail")),
    requiredRule<RegisterRequest>('password', formData.password, i18n.t("validation.passwordRequired")),
    minLengthRule<RegisterRequest>('password', formData.password, 6, i18n.t("validation.passwordMinLength")),
    requiredRule<RegisterRequest>('confirmPassword', formData.confirmPassword, i18n.t("validation.confirmPasswordRequired")),
    confirmPasswordRule<RegisterRequest>('confirmPassword', formData.password, formData.confirmPassword, i18n.t("validation.passwordMismatch")),
    requiredRule<RegisterRequest>('mobile', formData.mobile, i18n.t("validation.mobileRequired")),
    phoneRule<RegisterRequest>('mobile', formData.mobile, i18n.t("validation.invalidPhone")),
    requiredRule<RegisterRequest>('nationalId', formData.nationalId || '', i18n.t("validation.nationalIdRequired")),
    nationalIdRule<RegisterRequest>('nationalId', formData.nationalId || '', i18n.t("validation.nationalIdFormat")),
    ...(formData.isStudent 
      ? [requiredRule<RegisterRequest>('studentId', formData.studentId || '', i18n.t("validation.studentIdRequired"))]
      : [])
  ];

  const handleInputChange = (field: keyof RegisterRequest, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear student ID and national ID errors when isStudent changes
    if (field === 'isStudent') {
      setErrors(prev => ({ ...prev, studentId: undefined, nationalId: undefined }));
      return;
    }
    
    // Live validation for nameAr
    if (field === 'nameAr') {
      const valueStr = value as string;
      const newErrors: Partial<Record<keyof RegisterRequest, string>> = {};
      
      if (!valueStr.trim()) {
        newErrors.nameAr = i18n.t("validation.fullNameArRequired");
      } else if (!hasArabicRegex.test(valueStr)) {
        newErrors.nameAr = i18n.t("validation.arabicRequired");
      } else if (!noEnglishRegex.test(valueStr)) {
        newErrors.nameAr = i18n.t("validation.noEnglishAllowed");
      }
      
      setErrors(prev => ({ ...prev, nameAr: newErrors.nameAr }));
      return;
    }
    
    // Live validation for nameEn
    if (field === 'nameEn') {
      const valueStr = value as string;
      const newErrors: Partial<Record<keyof RegisterRequest, string>> = {};
      
      // Only validate if value is provided (it's optional)
      if (valueStr && valueStr.trim() && !noArabicRegex.test(valueStr)) {
        newErrors.nameEn = i18n.t("validation.noArabicAllowed");
      }
      
      setErrors(prev => ({ ...prev, nameEn: newErrors.nameEn }));
      return;
    }
    
    // Clear error for the current field
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
    
    const rules = getValidationRules();
    const fieldError = validateField(field, value as string, rules);
    
    if (fieldError) {
      setErrors(prev => ({ ...prev, [field]: fieldError }));
    }
    
    // Special handling for password confirmation
    if (field === 'password' || field === 'confirmPassword') {
      const password = field === 'password' ? value as string : formData.password;
      const confirmPassword = field === 'confirmPassword' ? value as string : formData.confirmPassword;
      
      if (password && confirmPassword) {
        // Create a fresh validation rule with the updated password values
        const confirmPasswordValidation = confirmPasswordRule<RegisterRequest>(
          'confirmPassword', 
          password, 
          confirmPassword, 
          i18n.t("validation.passwordMismatch")
        );
        
        // Check if passwords match
        if (!confirmPasswordValidation.condition(confirmPassword)) {
          setErrors(prev => ({ ...prev, confirmPassword: confirmPasswordValidation.message }));
        } else {
          setErrors(prev => ({ ...prev, confirmPassword: undefined }));
        }
      }
    }
  };

  const validateFormFields = (): boolean => {
    const rules = getValidationRules();
    const newErrors = validateFormUtil(rules);
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFormFields()) {
      return;
    }

    try {
      await register.mutateAsync(formData);
    } catch (error) {
    }
  };

  return {
    formData,
    errors,
    register,
    handleInputChange,
    handleRegister
  };
};