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
   * Get attachment by ID (for profile pictures)
   * Returns the file path as a string
   * Note: Backend returns absolute path, we need to extract the relative path
   */
  getAttachment: async (attachmentId: number): Promise<string> => {
    const filePath = await apiRequest.get<string>(`/attachments/${attachmentId}`);
    
    // Extract relative path from absolute Windows path
    // Example: "C:\...\wwwroot\uploads\profiles\image.jpg" -> "/uploads/profiles/image.jpg"
    if (filePath && filePath.includes('wwwroot')) {
      const relativePath = filePath.split('wwwroot')[1].replace(/\\/g, '/');
      return relativePath;
    }
    
    return filePath;
  },

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
   * Upload profile picture
   * Uses /auth/me/profile-picture endpoint
   * Accepts image files (jpg, png, webp)
   */
  uploadProfilePicture: async (file: File): Promise<UserInfo> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiRequest.uploadFile<UserInfo>('/auth/me/profile-picture', formData);
    
    // Update cached user profile in localStorage
    if (response) {
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
