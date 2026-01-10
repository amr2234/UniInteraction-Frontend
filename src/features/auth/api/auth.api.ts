import apiClient from "@/core/lib/apiClient";
import { apiRequest } from "@/core/lib/apiClient";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ApiResponse,
  UserInfo,
} from "@/core/types/api";
import { decodeToken } from "@/core/lib/authUtils";
import { use } from "react";
import { i18n } from "@/i18n/i18n";

export const authApi = {
  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiRequest.post<any>("/auth/login", payload);

      if (!response) {
        throw new Error(i18n.t("errors.noResponse"));
      }

      const data = response.data || response;
      const accessToken = data.accessToken || "";
      const refreshToken = data.refreshToken || "";
      const expiresAt = data.expiresAt || "";

      if (accessToken) {
        try {
          localStorage.setItem("authToken", accessToken);
        } catch (error) {
          console.warn("Failed to save auth token", error);
        }
      }
      if (refreshToken) {
        try {
          localStorage.setItem("refreshToken", refreshToken);
        } catch (error) {
          console.warn("Failed to save refresh token", error);
        }
      }

      const authResponse: AuthResponse = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresAt: expiresAt,
      };

      if (accessToken) {
        const decoded = decodeToken(accessToken);
        if (decoded) {
          let roleIds: number[] = [];
          let userId: number = 0;

          if (decoded.userId) {
            userId = parseInt(decoded.userId as string, 10);
          } else if (decoded.id) {
            userId = parseInt(decoded.id as string, 10);
          }
          if (decoded.roleId) {
            if (Array.isArray(decoded.roleId)) {
              roleIds = decoded.roleId.map((id: string) => parseInt(id, 10));
            } else {
              roleIds = [parseInt(decoded.roleId, 10)];
            }
          }

          let permissions: string[] = [];
          try {
            permissions = await apiRequest.get<any>("/auth/me/permissions");
          } catch (permError) {
            permissions = decoded.permissions || [];
          }

          let userProfileData: UserInfo | null = null;
          try {
            userProfileData = await apiRequest.get<UserInfo>("/auth/me");

            if (userProfileData) {
              try {
                localStorage.setItem(
                  "userProfile",
                  JSON.stringify(userProfileData)
                );
              } catch (error) {
                console.warn("Failed to save user profile", error);
              }
            }
          } catch (profileError) {
            console.warn("Failed to fetch user profile:", profileError);
          }

          const userInfo = {
            permissions: permissions,
            roleIds: roleIds,
            userId: userId,
          };
          try {
            localStorage.setItem("userInfo", JSON.stringify(userInfo));
            window.dispatchEvent(new Event("localStorageUpdate"));
          } catch (error) {
            console.warn("Failed to save user info", error);
          }
        }
      }

      return authResponse;
    } catch (error) {
      throw error;
    }
  },

  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
    try {
      const backendPayload = {
        username: payload.username,
        nameAr: payload.nameAr,
        nameEn: payload.nameEn,
        email: payload.email,
        password: payload.password,
        mobile: payload.mobile,
        nationalId: payload.nationalId,
        roleIds: [3],
      };

      const response = await apiRequest.post<any>(
        "/auth/register",
        backendPayload
      );

      if (!response) {
        throw new Error(i18n.t("errors.noResponse"));
      }

      const data = response.data || response;
      const accessToken = data.accessToken || "";
      const refreshToken = data.refreshToken || "";
      const expiresAt = data.expiresAt || "";

      if (accessToken) {
        try {
          localStorage.setItem("tempAuthToken", accessToken);
        } catch (error) {
          console.warn("Failed to save temp auth token", error);
        }
      }
      if (refreshToken) {
        try {
          localStorage.setItem("tempRefreshToken", refreshToken);
        } catch (error) {
          console.warn("Failed to save temp refresh token", error);
        }
      }

      const authResponse: AuthResponse = {
        accessToken: accessToken,
        refreshToken: refreshToken,
        expiresAt: expiresAt,
      };

      return authResponse;
    } catch (error) {
      throw error;
    }
  },

  verifyEmail: async (
    otp: string,
    email?: string
  ): Promise<{ needsPasswordSetup: boolean; email?: string }> => {
    try {
      const payload = email ? { otp, email } : { otp };
      const response = await apiRequest.post<{
        success?: boolean;
        message?: string;
        needsPasswordSetup?: boolean;
        email?: string;
      }>("/auth/verify-email", payload);

      if (!response) {
        throw new Error(i18n.t("errors.noResponse"));
      }

      const needsPasswordSetup = response.needsPasswordSetup || false;
      const userEmail = response.email || email;

      let tempToken: string | null = null;
      let tempRefresh: string | null = null;
      try {
        tempToken = localStorage.getItem("tempAuthToken");
        tempRefresh = localStorage.getItem("tempRefreshToken");
      } catch (error) {
        console.warn("Failed to get temp tokens", error);
      }

      if (!needsPasswordSetup) {
        if (tempToken) {
          try {
            localStorage.setItem("authToken", tempToken);
            localStorage.removeItem("tempAuthToken");
          } catch (error) {
            console.warn("Failed to set authToken", error);
          }
        }
        if (tempRefresh) {
          try {
            localStorage.setItem("refreshToken", tempRefresh);
            localStorage.removeItem("tempRefreshToken");
          } catch (error) {
            console.warn("Failed to set refreshToken", error);
          }
        }
      }

      try {
        const userProfileData = await apiRequest.get<UserInfo>("/auth/me");
        if (userProfileData) {
          try {
            localStorage.setItem("userProfile", JSON.stringify(userProfileData));
          } catch (error) {
            console.warn("Failed to save user profile", error);
          }

          if (tempToken) {
            const decoded = decodeToken(tempToken);
            if (decoded) {
              let roleIds: number[] = [];
              let userId: number = 0;

              if (decoded.userId) {
                userId = parseInt(decoded.userId as string, 10);
              } else if (decoded.id) {
                userId = parseInt(decoded.id as string, 10);
              }
              if (decoded.roleId) {
                if (Array.isArray(decoded.roleId)) {
                  roleIds = decoded.roleId.map((id: string) =>
                    parseInt(id, 10)
                  );
                } else {
                  roleIds = [parseInt(decoded.roleId, 10)];
                }
              }

              const permissions = decoded.permissions || [];

              const userInfo = {
                permissions: permissions,
                roleIds: roleIds,
                userId: userId,
              };
              try {
                localStorage.setItem("userInfo", JSON.stringify(userInfo));
                window.dispatchEvent(new Event("localStorageUpdate"));
              } catch (error) {
                console.warn("Failed to save user info", error);
              }
            }
          }
        }
      } catch (profileError) {
        console.warn("Failed to fetch user profile:", profileError);
      }

      return { needsPasswordSetup, email: userEmail };
    } catch (error) {
      throw error;
    }
  },

  resendVerificationOtp: async (email?: string): Promise<boolean> => {
    try {
      const payload = email ? { email } : {};
      const response = await apiRequest.post<any>(
        "/auth/resend-verification-otp",
        payload
      );

      if (!response) {
        throw new Error(i18n.t("errors.noResponse"));
      }

      return true;
    } catch (error) {
      throw error;
    }
  },

  createPassword: async (
    email: string,
    newPassword: string
  ): Promise<boolean> => {
    try {
      const response = await apiRequest.post<any>("/users/change-password", {
        email,
        newPassword,
      });

      if (!response) {
        throw new Error(i18n.t("errors.noResponse"));
      }

      return true;
    } catch (error) {
      throw error;
    }
  },

  logout: (): void => {
    try {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userProfile");
    } catch (error) {
      console.warn("Failed to clear localStorage on logout", error);
    }
  },

  getToken: (): string | null => {
    try {
      return localStorage.getItem("authToken");
    } catch (error) {
      console.warn("Failed to get token from localStorage", error);
      return null;
    }
  },

  isAuthenticated: (): boolean => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return false;

      const decoded = decodeToken(token);
      if (!decoded) return false;

      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      console.warn("Failed to check authentication", error);
      return false;
    }
  },

  getUserInfo: () => {
    try {
      const userInfo = localStorage.getItem("userInfo");
      return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
      console.warn("Failed to get user info from localStorage", error);
      return null;
    }
  },

  getUserProfile: (): UserInfo | null => {
    try {
      const userProfile = localStorage.getItem("userProfile");
      return userProfile ? JSON.parse(userProfile) : null;
    } catch (error) {
      console.warn("Failed to get user profile from localStorage", error);
      return null;
    }
  },

  getProfile: async (): Promise<UserInfo> => {
    return apiRequest.get<UserInfo>("/auth/me");
  },
};
