import { apiRequest } from '@/core/lib/apiClient';
import { UserInfo } from '@/core/types/api';

// ============================================
// Profile API Functions
// ============================================

export interface UpdateProfilePayload {
  email?: string;
  mobile?: string;
}

export const profileApi = {
  /**
   * Update current user's own profile
   * Uses /auth/me/profile endpoint which doesn't require USERS_EDIT permission
   * Only email and mobile can be updated
   */
  updateProfile: async (payload: UpdateProfilePayload): Promise<UserInfo> => {
    const response = await apiRequest.put<UserInfo>('/auth/me/profile', payload);
    
    // Update cached user profile in localStorage
    if (response) {
      // Get current profile and merge with updated data
      const currentProfile = localStorage.getItem('userProfile');
      if (currentProfile) {
        const parsedProfile = JSON.parse(currentProfile);
        const updatedProfile = { ...parsedProfile, ...response };
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      } else {
        localStorage.setItem('userProfile', JSON.stringify(response));
      }
      // Dispatch event to notify components of the update
      window.dispatchEvent(new Event('localStorageUpdate'));
    }
    
    return response;
  },

  /**
   * Get current user profile (from API)
   */
  getProfile: async (): Promise<UserInfo> => {
    return apiRequest.get<UserInfo>('/auth/me');
  },
};
