import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  UserInfo,
  ApiError,
} from "@/core/types/api";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserRole } from "@/core/constants/roles";
import { useState, useEffect } from "react";
import { useI18n } from "@/i18n";

export const useLogin = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return useMutation<AuthResponse, ApiError, LoginRequest>({
    mutationFn: authApi.login,
    onSuccess: () => {
      toast.success(t("auth.loginSuccess"));

      const userInfo = authApi.getUserInfo();
      const roleIds = userInfo?.roleIds || [];

      // Admin, Super Admin, and Employees go to dashboard
      if (
        roleIds.includes(UserRole.SUPER_ADMIN) ||
        roleIds.includes(UserRole.ADMIN) ||
        roleIds.includes(UserRole.EMPLOYEE)
      ) {
        navigate("/dashboard");
      } else {
        // Normal users go to landing page
        navigate("/");
      }
    },
    onError: (error) => {
      toast.error(error.message || t("auth.loginFailed"));
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return useMutation<AuthResponse, ApiError, RegisterRequest>({
    mutationFn: authApi.register,
    onSuccess: (_data, variables) => {
      toast.success(t("auth.registerSuccess"));

      // Navigate to verify-email with the email parameter
      navigate(`/verify-email?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error: ApiError) => {
      toast.error(error.message || t("auth.registerFailed"));
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  return () => {
    authApi.logout();
    toast.success(t("auth.logoutSuccess"));
    navigate("/login");
  };
};

export const useProfile = () => {
  return useQuery<UserInfo, ApiError>({
    queryKey: ["profile"],
    queryFn: authApi.getProfile,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUserProfile = (): UserInfo | null => {
  const [userProfile, setUserProfile] = useState<UserInfo | null>(() =>
    authApi.getUserProfile()
  );

  useEffect(() => {
    const handleStorageUpdate = () => {
      setUserProfile(authApi.getUserProfile());
    };

    window.addEventListener("localStorageUpdate", handleStorageUpdate);

    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener("localStorageUpdate", handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  return userProfile;
};
