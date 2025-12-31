import { BaseApi } from '@/core/lib/baseApi';
import { apiRequest } from '@/core/lib/apiClient';
import { PaginatedResponse } from '@/core/types/api';
import {
  UniversityLeadershipDto,
  CreateLeadershipPayload,
  UpdateLeadershipPayload,
} from '@/core/types/api';
import type { LeadershipFilters } from '../types/leadership.types';

export type { LeadershipFilters };

class LeadershipApi extends BaseApi<
  UniversityLeadershipDto,
  CreateLeadershipPayload,
  UpdateLeadershipPayload,
  LeadershipFilters
> {
  constructor() {
    super('/leadership');
  }

  async getAll(filters?: LeadershipFilters): Promise<PaginatedResponse<UniversityLeadershipDto>> {
    const params = new URLSearchParams();
    
    if (filters?.searchTerm) params.append('search', filters.searchTerm);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.departmentId) params.append('departmentId', filters.departmentId.toString());
    if (filters?.pageNumber) params.append('page', filters.pageNumber.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.sortOrder === 'desc') params.append('isDesc', 'true');

    const queryString = params.toString();
    return this.customGet<PaginatedResponse<UniversityLeadershipDto>>(`/pagination${queryString ? `?${queryString}` : ''}`);
  }

  async getDepartments(): Promise<{ id: number; nameAr: string; nameEn?: string }[]> {
    const response = await apiRequest.get<any>('/lookups/departments');
    if (response?.items && Array.isArray(response.items)) {
      return response.items;
    }
    if (Array.isArray(response)) {
      return response;
    }
    return [];
  }
}

const leadershipApiInstance = new LeadershipApi();

export const leadershipApi = {
  getLeadership: (filters?: LeadershipFilters) => leadershipApiInstance.getAll(filters),
  getAllLeadership: () => leadershipApiInstance.getList(),
  getLeadershipById: (id: number) => leadershipApiInstance.getById(id),
  createLeadership: (payload: CreateLeadershipPayload) => leadershipApiInstance.create(payload),
  updateLeadership: (id: number, payload: UpdateLeadershipPayload) => leadershipApiInstance.update(id, payload),
  deleteLeadership: (id: number) => leadershipApiInstance.delete(id),
  toggleLeadershipStatus: (payload: { id: number; isActive: boolean }) => 
    leadershipApiInstance.toggleStatus(payload.id, payload.isActive),
  getDepartments: () => leadershipApiInstance.getDepartments(),
};
