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
  getFieldRules
} from "@/core/utils/validation";
import { useForm } from "@/core/utils/formUtils";
import { i18n } from "@/i18n/i18n";

export const useRegisterPage = () => {
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

  const getValidationRules = () => [
    requiredRule<RegisterRequest>('username', formData.username, i18n.t("validation.usernameRequired")),
    requiredRule<RegisterRequest>('nameAr', formData.nameAr, i18n.t("validation.fullNameArRequired")),
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
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
    
    // Clear student ID and national ID errors when isStudent changes
    if (field === 'isStudent') {
      setErrors(prev => ({ ...prev, studentId: undefined, nationalId: undefined }));
      return;
    }
    
    const rules = getValidationRules();
    const fieldError = validateField(field, value as string, rules);
    
    if (fieldError) {
      setErrors(prev => ({ ...prev, [field]: fieldError }));
    }
    
    if (field === 'password' || field === 'confirmPassword') {
      const password = field === 'password' ? value as string : formData.password;
      const confirmPassword = field === 'confirmPassword' ? value as string : formData.confirmPassword;
      
      if (password && confirmPassword) {
        const confirmPasswordError = validateField('confirmPassword', confirmPassword, rules);
        if (confirmPasswordError) {
          setErrors(prev => ({ ...prev, confirmPassword: confirmPasswordError }));
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