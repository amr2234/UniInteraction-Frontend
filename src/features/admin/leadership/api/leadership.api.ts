import { apiRequest } from '@/core/lib/apiClient';
import { PaginatedResponse } from '@/core/types/api';
import {
  UniversityLeadershipDto,
  CreateLeadershipPayload,
  UpdateLeadershipPayload,
} from '@/core/types/api';
import type { LeadershipFilters } from '../types/leadership.types';

// Re-export types for backward compatibility
export type { LeadershipFilters };

// ============================================
// Leadership API Functions (Admin)
// ============================================

export const leadershipApi = {
  /**
   * Get all leadership members with pagination and filters
   * GET /api/leadership/pagination
   */
  getLeadership: async (filters?: LeadershipFilters): Promise<PaginatedResponse<UniversityLeadershipDto>> => {
    const params = new URLSearchParams();
    
    if (filters?.searchTerm) params.append('search', filters.searchTerm);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.departmentId) params.append('departmentId', filters.departmentId.toString());
    if (filters?.pageNumber) params.append('page', filters.pageNumber.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.sortOrder === 'desc') params.append('isDesc', 'true');

    const queryString = params.toString();
    return apiRequest.get<PaginatedResponse<UniversityLeadershipDto>>(
      `/leadership/pagination${queryString ? `?${queryString}` : ''}`
    );
  },

  /**
   * Get all leadership members (without pagination)
   * GET /api/leadership
   */
  getAllLeadership: async (): Promise<UniversityLeadershipDto[]> => {
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
   * Toggle leadership member active status
   * PATCH /api/leadership/{id}/status
   */
  toggleLeadershipStatus: async (payload: {
    id: number;
    isActive: boolean;
  }): Promise<UniversityLeadershipDto> => {
    return apiRequest.patch<UniversityLeadershipDto>(`/leadership/${payload.id}/status`, {
      isActive: payload.isActive,
    });
  },

  getDepartments: async (): Promise<{ id: number; nameAr: string; nameEn?: string }[]> => {
    const response = await apiRequest.get<any>('/lookups/departments');
    // Handle paginated response with items array
    if (response?.items && Array.isArray(response.items)) {
      return response.items;
    }
    // Handle if response is a direct array
    if (Array.isArray(response)) {
      return response;
    }
    // Fallback to empty array
    return [];
  },
};
