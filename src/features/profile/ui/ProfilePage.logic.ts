import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useI18n } from '@/i18n';
import { validateField, validateForm, requiredRule, emailRule, phoneRule } from '@/core/utils/validation';
import { useUserProfile } from '@/features/auth/hooks/useAuth';
import { useUpdateProfile, useUploadProfilePicture } from '@/features/profile/hooks/useProfile';
import { authApi } from '@/features/auth/api/auth.api';
import { profileApi } from '@/features/profile/api/profile.api';
import { queryClient } from '@/core/lib/QueryProvider';

interface ProfileFormData {
  nameAr: string;
  nameEn: string;
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
  const uploadPictureMutation = useUploadProfilePicture();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showNafathDialog, setShowNafathDialog] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProfileFormData>({
    nameAr: '',
    nameEn: '',
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
        email: profileData.email || '',
        mobile: profileData.mobile || '',
        nationalId: profileData.nationalId || '',
      });
      
      // Fetch profile picture using attachment ID if available
      if (profileData.profilePictureId) {
        profileApi.getAttachment(profileData.profilePictureId)
          .then((filePath) => {
            if (filePath) {
              console.log('Profile picture file path:', filePath);
              // Construct full URL from backend base URL + file path
              const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5193/api';
              const fullUrl = baseUrl.replace('/api', '') + filePath;
              setProfilePicture(fullUrl);
            }
          })
          .catch((error) => {
            console.error('Failed to fetch profile picture:', error);
            setProfilePicture(null);
          });
      } else if (profileData.profilePicture) {
        // Fallback to direct URL for backward compatibility
        setProfilePicture(profileData.profilePicture);
      } else {
        setProfilePicture(null);
      }
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

  const handleLogout = () => {
    // Clear all authentication data
    authApi.logout();
    
    // Clear React Query cache
    queryClient.clear();
    
    // Show success message
    toast.success(t('auth.logoutSuccess'));
    
    // Redirect to login page
    navigate('/login', { replace: true });
  };

  const handleOpenNafathDialog = () => {
    setShowNafathDialog(true);
  };

  const handleNafathSuccess = (nationalId: string) => {
    // Update form data with the new National ID
    setFormData(prev => ({ ...prev, nationalId }));
    
    // Update the profile data in localStorage
    const currentProfile = localStorage.getItem('userProfile');
    if (currentProfile) {
      const parsedProfile = JSON.parse(currentProfile);
      const updatedProfile = { ...parsedProfile, nationalId };
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      window.dispatchEvent(new Event('localStorageUpdate'));
    }
    
    // Show success toast
    toast.success(t('profile.nafathActivatedSuccess'));
    
    // Close dialog
    setShowNafathDialog(false);
  };

  const handleChangePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const validateImageFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return t('profile.invalidImageType');
    }

    // Check file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return t('profile.imageTooLarge');
    }

    return null;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    // Upload the file
    uploadPictureMutation.mutate(file, {
      onSuccess: async (data) => {
        // Fetch the profile picture using the new ID
        if (data.profilePictureId) {
          try {
            const filePath = await profileApi.getAttachment(data.profilePictureId);
            if (filePath) {
              const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5193/api';
              const fullUrl = baseUrl.replace('/api', '') + filePath;
              setProfilePicture(fullUrl);
            }
          } catch (error) {
            console.error('Failed to fetch uploaded profile picture:', error);
          }
        } else if (data.profilePicture) {
          // Fallback to direct URL
          setProfilePicture(data.profilePicture);
        }
      },
    });

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return {
    isEditing,
    showChangePassword,
    showNafathDialog,
    profilePicture,
    formData,
    formErrors,
    isUploadingPicture: uploadPictureMutation.isPending,
    fileInputRef,
    
    setIsEditing,
    setShowChangePassword,
    setShowNafathDialog,
    handleInputChange,
    handleSave,
    handleCancel,
    handleLogout,
    handleOpenNafathDialog,
    handleNafathSuccess,
    handleChangePhotoClick,
    handleFileChange,
    navigate,
    t,
  };
};
