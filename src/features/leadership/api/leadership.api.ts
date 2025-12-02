import { apiRequest } from '@/core/lib/apiClient';
import {
  UniversityLeadershipDto,
  CreateLeadershipPayload,
  UpdateLeadershipPayload,
} from '@/core/types/api';

// ============================================
// Leadership API Functions (Admin)
// ============================================

export const leadershipApi = {
  /**
   * Get all leadership members
   */
  getLeadership: async (): Promise<UniversityLeadershipDto[]> => {
    return apiRequest.get<UniversityLeadershipDto[]>('/leadership');
  },

  /**
   * Get leadership member by ID
   */
  getLeadershipById: async (id: number): Promise<UniversityLeadershipDto> => {
    return apiRequest.get<UniversityLeadershipDto>(`/leadership/${id}`);
  },

  /**
   * Create a new leadership member (Admin only)
   */
  createLeadership: async (payload: CreateLeadershipPayload): Promise<UniversityLeadershipDto> => {
    return apiRequest.post<UniversityLeadershipDto>('/leadership', payload);
  },

  /**
   * Update a leadership member (Admin only)
   */
  updateLeadership: async (
    id: number,
    payload: UpdateLeadershipPayload
  ): Promise<UniversityLeadershipDto> => {
    return apiRequest.put<UniversityLeadershipDto>(`/leadership/${id}`, payload);
  },

  /**
   * Delete a leadership member (Admin only)
   */
  deleteLeadership: async (id: number): Promise<void> => {
    return apiRequest.delete<void>(`/leadership/${id}`);
  },

  /**
   * Upload leadership member image
   */
  uploadLeadershipImage: async (id: number, file: File): Promise<{ imageUrl: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    return apiRequest.uploadFile<{ imageUrl: string }>(`/leadership/${id}/image`, formData);
  },
};
