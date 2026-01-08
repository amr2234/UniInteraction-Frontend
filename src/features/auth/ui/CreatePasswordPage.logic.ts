import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { toast } from 'sonner';
import { useI18n } from '@/i18n';
import { ApiError } from '@/core/types/api';
import {
  validateField,
  requiredRule,
  emailRule,
  minLengthRule,
  confirmPasswordRule,
} from '@/core/utils/validation';

interface CreatePasswordFormData {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export const useCreatePasswordPage = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  
  // Pre-fill email from verification flow
  const storedEmail = localStorage.getItem('verificationEmail') || '';
  
  const [formData, setFormData] = useState<CreatePasswordFormData>({
    email: storedEmail,
    newPassword: '',
    confirmPassword: '',
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof CreatePasswordFormData, string>>>({});

  // Clean up verification email after component mounts
  useEffect(() => {
    // Remove verification email from localStorage after it's used
    return () => {
      localStorage.removeItem('verificationEmail');
    };
  }, []);

  const createPasswordMutation = useMutation({
    mutationFn: ({ email, newPassword }: { email: string; newPassword: string }) =>
      authApi.createPassword(email, newPassword),
    onSuccess: () => {
      toast.success(t('auth.passwordCreatedSuccess'));
      // Redirect to login page after successful password creation
      navigate('/login');
    },
    onError: (error: ApiError) => {
      toast.error(error.message || t('auth.passwordCreationFailed'));
    },
  });

  const getValidationRules = () => [
    requiredRule<CreatePasswordFormData>('email', formData.email, t('validation.emailRequired')),
    emailRule<CreatePasswordFormData>('email', formData.email, t('validation.invalidEmail')),
    requiredRule<CreatePasswordFormData>('newPassword', formData.newPassword, t('validation.passwordRequired')),
    minLengthRule<CreatePasswordFormData>('newPassword', formData.newPassword, 6, t('validation.passwordMinLength')),
    requiredRule<CreatePasswordFormData>('confirmPassword', formData.confirmPassword, t('validation.confirmPasswordRequired')),
    confirmPasswordRule<CreatePasswordFormData>('confirmPassword', formData.newPassword, formData.confirmPassword, t('validation.passwordMismatch')),
  ];

  const handleInputChange = (field: keyof CreatePasswordFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Validate field on change
    const rules = getValidationRules();
    const fieldError = validateField(field, value, rules);
    
    if (fieldError) {
      setErrors(prev => ({ ...prev, [field]: fieldError }));
    }
    
    // Special handling for password confirmation
    if (field === 'newPassword' || field === 'confirmPassword') {
      const password = field === 'newPassword' ? value : formData.newPassword;
      const confirmPassword = field === 'confirmPassword' ? value : formData.confirmPassword;
      
      if (password && confirmPassword) {
        // Create a fresh validation rule with the updated password values
        const confirmPasswordValidation = confirmPasswordRule<CreatePasswordFormData>(
          'confirmPassword',
          password,
          confirmPassword,
          t('validation.passwordMismatch')
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

  const validateForm = (): boolean => {
    const rules = getValidationRules();
    const newErrors: Partial<Record<keyof CreatePasswordFormData, string>> = {};
    
    rules.forEach(rule => {
      if (!rule.condition(rule.value)) {
        newErrors[rule.field as keyof CreatePasswordFormData] = rule.message;
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    createPasswordMutation.mutate({
      email: formData.email,
      newPassword: formData.newPassword,
    });
  };

  return {
    formData,
    errors,
    isSubmitting: createPasswordMutation.isPending,
    handleInputChange,
    handleSubmit,
  };
};
