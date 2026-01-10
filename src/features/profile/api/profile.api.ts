import { BaseApi } from '@/core/lib/baseApi';
import { UserInfo } from '@/core/types/api';

export interface UpdateProfilePayload {
  email?: string;
  mobile?: string;
}

class ProfileApi extends BaseApi<UserInfo> {
  constructor() {
    super('/auth/me');
  }

  async getAttachment(attachmentId: number): Promise<string> {
    const filePath = await this.customGet<string>(`/attachments/${attachmentId}`);
    
    if (filePath && typeof filePath === 'string' && filePath.includes('wwwroot')) {
      const relativePath = filePath.split('wwwroot')[1].replace(/\\/g, '/');
      return relativePath;
    }
    
    return filePath;
  }

  async updateProfile(payload: UpdateProfilePayload): Promise<UserInfo> {
    const response = await this.customPut<UserInfo>('/profile', payload);
    
    if (response) {
      const currentProfile = localStorage.getItem('userProfile');
      if (currentProfile) {
        const parsedProfile = JSON.parse(currentProfile);
        const updatedProfile = { ...parsedProfile, ...response };
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      } else {
        localStorage.setItem('userProfile', JSON.stringify(response));
      }
      window.dispatchEvent(new Event('localStorageUpdate'));
    }
    
    return response;
  }

  async uploadProfilePicture(file: File): Promise<UserInfo> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await this.customPost<UserInfo>('/profile-picture', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    
    console.log('Upload profile picture response:', response);
    
    if (response) {
      // Backend returns filePath directly in the response!
      if ((response as any).filePath) {
        response.profilePictureUrl = (response as any).filePath;
        console.log('Using filePath from response:', response.profilePictureUrl);
      } else if (response.profilePictureUrl) {
        console.log('Backend returned profilePictureUrl:', response.profilePictureUrl);
      } else if (response.profilePictureId) {
        // Fallback: try to fetch if backend doesn't provide filePath
        console.warn('Backend did not return filePath, trying to fetch...');
      }

      const currentProfile = localStorage.getItem('userProfile');
      if (currentProfile) {
        const parsedProfile = JSON.parse(currentProfile);
        const updatedProfile = { ...parsedProfile, ...response };
        localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
      } else {
        localStorage.setItem('userProfile', JSON.stringify(response));
      }
      window.dispatchEvent(new Event('localStorageUpdate'));
    }
    
    return response;
  }

  async getProfile(): Promise<UserInfo> {
    return this.customGet<UserInfo>('');
  }
}

const profileApiInstance = new ProfileApi();

export const profileApi = {
  getAttachment: (attachmentId: number) => profileApiInstance.getAttachment(attachmentId),
  updateProfile: (payload: UpdateProfilePayload) => profileApiInstance.updateProfile(payload),
  uploadProfilePicture: (file: File) => profileApiInstance.uploadProfilePicture(file),
  getProfile: () => profileApiInstance.getProfile(),
};
