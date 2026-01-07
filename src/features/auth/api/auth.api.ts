import apiClient from '@/core/lib/apiClient';
import { apiRequest } from '@/core/lib/apiClient';
import { LoginRequest, RegisterRequest, AuthResponse, ApiResponse, UserInfo } from '@/core/types/api';
import { decodeToken } from '@/core/lib/authUtils';
import { use } from 'react';
import { i18n } from '@/i18n/i18n';

export const authApi = {
  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    try {
      const response = await apiRequest.post<any>('/auth/login', payload);
      
      if (!response) {
        throw new Error(i18n.t('errors.noResponse'));
      }
      
      const data = response.data || response;
      const accessToken = data.accessToken || '';
      const refreshToken = data.refreshToken || '';
      const expiresAt = data.expiresAt || '';
      
      if (accessToken) {
        localStorage.setItem('authToken', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
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
            permissions = await apiRequest.get<any>('/auth/me/permissions');   
          } catch (permError) {
            permissions = decoded.permissions || [];
          }


          // Fetch full user profile data from /auth/me
          let userProfileData: UserInfo | null = null;
          try {
            userProfileData = await apiRequest.get<UserInfo>('/auth/me');
            
            // Store complete user profile in localStorage
            if (userProfileData) {
              localStorage.setItem('userProfile', JSON.stringify(userProfileData));
            }
          } catch (profileError) {
            console.warn('Failed to fetch user profile:', profileError);
          }

          const userInfo = {
            permissions: permissions,
            roleIds: roleIds,
            userId: userId
          };
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          
          window.dispatchEvent(new Event('localStorageUpdate'));
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

      const response = await apiRequest.post<any>('/auth/register', backendPayload);
      
      if (!response) {
        throw new Error(i18n.t('errors.noResponse'));
      }
      
      const data = response.data || response;
      const accessToken = data.accessToken || '';
      const refreshToken = data.refreshToken || '';
      const expiresAt = data.expiresAt || '';
      
      // Store tokens temporarily (user can't use app until verified)
      if (accessToken) {
        localStorage.setItem('tempAuthToken', accessToken);
      }
      if (refreshToken) {
        localStorage.setItem('tempRefreshToken', refreshToken);
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

  verifyEmail: async (otp: string): Promise<boolean> => {
    try {
      const response = await apiRequest.post<any>('/auth/verify-email', { otp });
      
      if (!response) {
        throw new Error(i18n.t('errors.noResponse'));
      }
      
      // Move temp tokens to actual tokens after successful verification
      const tempToken = localStorage.getItem('tempAuthToken');
      const tempRefresh = localStorage.getItem('tempRefreshToken');
      
      if (tempToken) {
        localStorage.setItem('authToken', tempToken);
        localStorage.removeItem('tempAuthToken');
      }
      if (tempRefresh) {
        localStorage.setItem('refreshToken', tempRefresh);
        localStorage.removeItem('tempRefreshToken');
      }
      
      // Fetch user profile after verification
      try {
        const userProfileData = await apiRequest.get<UserInfo>('/auth/me');
        if (userProfileData) {
          localStorage.setItem('userProfile', JSON.stringify(userProfileData));
          
          // Decode token and store user info
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
                  roleIds = decoded.roleId.map((id: string) => parseInt(id, 10));
                } else {
                  roleIds = [parseInt(decoded.roleId, 10)];
                }
              }
              
              const permissions = decoded.permissions || [];
              
              const userInfo = {
                permissions: permissions,
                roleIds: roleIds,
                userId: userId
              };
              localStorage.setItem('userInfo', JSON.stringify(userInfo));
              window.dispatchEvent(new Event('localStorageUpdate'));
            }
          }
        }
      } catch (profileError) {
        console.warn('Failed to fetch user profile:', profileError);
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  },

  resendVerificationOtp: async (): Promise<boolean> => {
    try {
      const response = await apiRequest.post<any>('/auth/resend-verification-otp');
      
      if (!response) {
        throw new Error(i18n.t('errors.noResponse'));
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  },

  createPassword: async (email: string, newPassword: string): Promise<boolean> => {
    try {
      const response = await apiRequest.post<any>('/users/change-password', {
        email,
        newPassword
      });
      
      if (!response) {
        throw new Error(i18n.t('errors.noResponse'));
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  },

  logout: (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('userProfile');
  },

  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  isAuthenticated: (): boolean => {
    const token = localStorage.getItem('authToken');
    if (!token) return false;
      
      const decoded = decodeToken(token);
    if (!decoded) return false;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
  },

  getUserInfo: () => {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  },

  getUserProfile: (): UserInfo | null => {
    const userProfile = localStorage.getItem('userProfile');
    return userProfile ? JSON.parse(userProfile) : null;
  },

  getProfile: async (): Promise<UserInfo> => {
    return apiRequest.get<UserInfo>('/auth/me');
  },
};