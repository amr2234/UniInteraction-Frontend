import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth.api';
import { LoginRequest, RegisterRequest, AuthResponse, UserInfo, ApiError } from '@/core/types/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { UserRole } from '@/core/constants/roles';
import { useState, useEffect } from 'react';
import { useI18n } from '@/i18n';

export const useLogin = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return useMutation<AuthResponse, ApiError, LoginRequest>({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      toast.success(t('auth.loginSuccess'));
      
      // Get user info to determine role
      const userInfo = authApi.getUserInfo();
      const roleIds = userInfo?.roleIds || [];
      
      // Redirect based on role
      // If SuperAdmin (0), Admin (1) or Employee (2) -> go to dashboard
      // If User (3) -> go to landing page
      if (roleIds.includes(UserRole.SUPER_ADMIN) || roleIds.includes(UserRole.ADMIN) || roleIds.includes(UserRole.EMPLOYEE)) {
        navigate('/dashboard');
      } else {
        // Regular user goes to landing page
        navigate('/');
      }
    },
    onError: (error) => {
      toast.error(error.message || t('auth.loginFailed'));
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return useMutation<boolean, ApiError, RegisterRequest>({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      toast.success(t('auth.registerSuccess'));
      navigate('/login');
    },
    onError: (error: ApiError) => {
      if (error.status === 0 || error.message.includes('Network Error')) {
        toast.error(t('auth.networkError'));
      } else if (error.status === 408 || error.message.includes('Request timeout')) {
        toast.error(t('auth.timeoutError'));
      } else {
        toast.error(error.message || t('auth.registerFailed'));
      }
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return () => {
    authApi.logout();
    toast.success(t('auth.logoutSuccess'));
    navigate('/login');
  };
};

export const useProfile = () => {
  return useQuery<UserInfo, ApiError>({
    queryKey: ['profile'],
    queryFn: authApi.getProfile,
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to get cached user profile from localStorage
 * This is synchronous and doesn't require an API call
 * Updates automatically when localStorage changes
 */
export const useUserProfile = (): UserInfo | null => {
  const [userProfile, setUserProfile] = useState<UserInfo | null>(() => 
    authApi.getUserProfile()
  );

  useEffect(() => {
    const handleStorageUpdate = () => {
      setUserProfile(authApi.getUserProfile());
    };

    // Listen for custom localStorage update events
    window.addEventListener('localStorageUpdate', handleStorageUpdate);
    
    // Also listen for storage events from other tabs
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('localStorageUpdate', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  return userProfile;
};