import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useI18n } from '@/i18n';
import { validateField, validateForm, requiredRule, emailRule, phoneRule } from '@/core/utils/validation';
import { useUserProfile } from '@/features/auth/hooks/useAuth';
import { useUpdateProfile } from '@/features/profile/hooks/useProfile';

interface ProfileFormData {
  nameAr: string;
  nameEn: string;
  username: string;
  email: string;
  mobile: string;
  nationalId: string;
}

interface ProfileFormErrors {
  email?: string;
  mobile?: string;
}

export const useProfilePageLogic = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const profileData = useUserProfile();
  const updateProfileMutation = useUpdateProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    nameAr: '',
    nameEn: '',
    username: '',
    email: '',
    mobile: '',
    nationalId: '',
  });
  const [formErrors, setFormErrors] = useState<ProfileFormErrors>({});

  // Update form data when profile data is loaded
  useEffect(() => {
    if (profileData) {
      setFormData({
        nameAr: profileData.nameAr || '',
        nameEn: profileData.nameEn || '',
        username: profileData.username || '',
        email: profileData.email || '',
        mobile: profileData.mobile || '',
        nationalId: profileData.nationalId || '',
      });
    }
  }, [profileData]);

  // Validation rules
  const getValidationRules = () => [
    requiredRule<ProfileFormData>('email', formData.email, t('validation.emailRequired')),
    emailRule<ProfileFormData>('email', formData.email, t('validation.invalidEmail')),
    requiredRule<ProfileFormData>('mobile', formData.mobile, t('validation.phoneRequired')),
    phoneRule<ProfileFormData>('mobile', formData.mobile, t('validation.invalidPhone')),
  ];

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    // Clear error for this field
    if (formErrors[field as keyof ProfileFormErrors]) {
      setFormErrors({ ...formErrors, [field as keyof ProfileFormErrors]: undefined });
    }
    
    // Validate field if it's editable
    if (field === 'email' || field === 'mobile') {
      const rules = getValidationRules();
      const fieldError = validateField(field, value, rules);
      
      if (fieldError) {
        setFormErrors(prev => ({ ...prev, [field]: fieldError }));
      }
    }
  };

  const handleSave = async () => {
    // Validate form
    const rules = getValidationRules();
    const newErrors = validateForm(rules);

    if (Object.keys(newErrors).length > 0) {
      setFormErrors(newErrors);
      toast.error(t('validation.pleaseFixErrors'));
      return;
    }

    // Call the update API with only email and mobile
    updateProfileMutation.mutate(
      {
        email: formData.email,
        mobile: formData.mobile,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormErrors({});
  };

  return {
    isEditing,
    showChangePassword,
    formData,
    formErrors,
    
    setIsEditing,
    setShowChangePassword,
    handleInputChange,
    handleSave,
    handleCancel,
    navigate,
    t,
  };
};
