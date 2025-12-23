import { useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi, UpdateProfilePayload } from '../api/profile.api';
import { UserInfo, ApiError } from '@/core/types/api';
import { toast } from 'sonner';
import { useI18n } from '@/i18n';
import { useUserProfile } from '@/features/auth/hooks/useAuth';

// ============================================
// Profile Hooks
// ============================================

/**
 * Hook to update user profile
 * Only email and mobile can be updated
 * Uses /auth/me endpoint (no admin permissions required)
 * 
 * @example
 * const updateProfile = useUpdateProfile();
 * updateProfile.mutate({ email: 'new@email.com', mobile: '0501234567' });
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<UserInfo, ApiError, UpdateProfilePayload>({
    mutationFn: profileApi.updateProfile,
    onSuccess: (data) => {
      // Invalidate profile query to refetch
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      toast.success(t('profile.updateSuccess'));
    },
    onError: (error) => {
      toast.error(error.message || t('profile.updateError'));
    },
  });
};

/**
 * Hook to upload profile picture
 * Accepts image files (jpg, png, webp)
 * Maximum file size: 5MB
 * 
 * @example
 * const uploadPicture = useUploadProfilePicture();
 * uploadPicture.mutate(file);
 */
export const useUploadProfilePicture = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<UserInfo, ApiError, File>({
    mutationFn: profileApi.uploadProfilePicture,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      toast.success(t('profile.pictureUploadSuccess'));
    },
    onError: (error) => {
      toast.error(error.message || t('profile.pictureUploadError'));
    },
  });
};
