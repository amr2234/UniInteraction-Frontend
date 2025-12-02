import { apiRequest } from '@/core/lib/apiClient';
import { PaginatedResponse } from '@/core/types/api';
import type {
  DepartmentDto,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  DepartmentFilters,
} from '../types/department.types';

// Re-export types for backward compatibility
export type {
  DepartmentDto,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  DepartmentFilters,
};

// ============================================
// Departments API Functions
// ============================================

export const departmentsApi = {
  /**
   * Get all departments with pagination and filters
   * GET /api/departments/pagination
   */
  getDepartments: async (filters?: DepartmentFilters): Promise<PaginatedResponse<DepartmentDto>> => {
    const params = new URLSearchParams();
    
    if (filters?.searchTerm) params.append('search', filters.searchTerm);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.pageNumber) params.append('page', filters.pageNumber.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.sortOrder === 'desc') params.append('isDesc', 'true');

    const queryString = params.toString();
    return apiRequest.get<PaginatedResponse<DepartmentDto>>(
      `/departments/pagination${queryString ? `?${queryString}` : ''}`
    );
  },

  /**
   * Get department by ID
   * GET /api/departments/{id}
   */
  getDepartmentById: async (id: number): Promise<DepartmentDto> => {
    return apiRequest.get<DepartmentDto>(`/departments/${id}`);
  },

  /**
   * Create a new department
   * POST /api/departments
   */
  createDepartment: async (payload: CreateDepartmentDto): Promise<DepartmentDto> => {
    return apiRequest.post<DepartmentDto>('/departments', payload);
  },

  /**
   * Update a department
   * PUT /api/departments/{id}
   */
  updateDepartment: async (id: number, payload: UpdateDepartmentDto): Promise<DepartmentDto> => {
    return apiRequest.put<DepartmentDto>(`/departments/${id}`, payload);
  },

  /**
   * Delete a department
   * DELETE /api/departments/{id}
   */
  deleteDepartment: async (id: number): Promise<void> => {
    return apiRequest.delete<void>(`/departments/${id}`);
  },

  /**
   * Toggle department active status
   * PATCH /api/departments/{id}/toggle-status
   */
  toggleDepartmentStatus: async (id: number): Promise<DepartmentDto> => {
    return apiRequest.patch<DepartmentDto>(`/departments/${id}/toggle-status`);
  },

  /**
   * Get active departments only
   * GET /api/departments/active
   */
  getActiveDepartments: async (): Promise<DepartmentDto[]> => {
    return apiRequest.get<DepartmentDto[]>('/departments/active');
  },
};
