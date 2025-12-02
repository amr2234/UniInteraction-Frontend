import { apiRequest } from '@/core/lib/apiClient';
import { PaginatedResponse } from '@/core/types/api';
import type {
  UserManagementDto,
  
UserDto,
  UserFilters,
  ToggleUserStatusDto,
  ResetPasswordDto,
} from '../types/user.types';

// Re-export types for backward compatibility
export type {
  UserManagementDto,
  UserDto,
  UserFilters,
  ToggleUserStatusDto,
  ResetPasswordDto,
};

// ============================================
// Users API Functions
// ============================================

export const usersApi = {
  /**
   * Get all users with pagination and filters
   * GET /api/users/pagination
   */
  getUsers: async (filters?: UserFilters): Promise<PaginatedResponse<UserManagementDto>> => {
    const params = new URLSearchParams();
    
    if (filters?.searchTerm) params.append('search', filters.searchTerm);
    if (filters?.roleId !== undefined) params.append('roleId', filters.roleId.toString());
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.department) params.append('department', filters.department);
    if (filters?.pageNumber) params.append('page', filters.pageNumber.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.sortOrder === 'desc') params.append('isDesc', 'true');

    const queryString = params.toString();
    return apiRequest.get<PaginatedResponse<UserManagementDto>>(
      `/users/pagination${queryString ? `?${queryString}` : ''}`
    );
  },

  /**
   * Get user by ID
   * GET /api/users/details/{id}
   */
  getUserById: async (id: number): Promise<UserManagementDto> => {
    return apiRequest.get<UserManagementDto>(`/users/details/${id}`);
  },

  /**
   * Create a new user
   * POST /api/users
   */
  createUser: async (payload: UserDto): Promise<UserManagementDto> => {
    return apiRequest.post<UserManagementDto>('/users', payload);
  },

  /**
   * Update a user
   * PUT /api/users/{id}
   */
  updateUser: async (id: number, payload: UserDto): Promise<UserManagementDto> => {
    return apiRequest.put<UserManagementDto>(`/users/${id}`, payload);
  },

  /**
   * Delete a user
   * DELETE /api/users/{id}
   */
  deleteUser: async (id: number): Promise<void> => {
    return apiRequest.delete<void>(`/users/${id}`);
  },

  /**
   * Toggle user active status
   * PATCH /api/users/{id}/toggle-status
   */
  toggleUserStatus: async (id: number): Promise<UserManagementDto> => {
    return apiRequest.patch<UserManagementDto>(`/users/${id}/toggle-status`);
  },

  /**
   * Activate a user
   * PATCH /api/users/{id}/activate
   */
  activateUser: async (id: number): Promise<UserManagementDto> => {
    return apiRequest.patch<UserManagementDto>(`/users/${id}/activate`);
  },

  /**
   * Deactivate a user
   * PATCH /api/users/{id}/deactivate
   */
  deactivateUser: async (id: number): Promise<UserManagementDto> => {
    return apiRequest.patch<UserManagementDto>(`/users/${id}/deactivate`);
  },

  /**
   * Reset user password
   * POST /api/users/{id}/reset-password
   */
  resetUserPassword: async (id: number, payload: ResetPasswordDto): Promise<void> => {
    return apiRequest.post<void>(`/users/${id}/reset-password`, payload);
  },

  /**
   * Search users by term
   * GET /api/users/search
   */
  searchUsers: async (
    searchTerm: string,
    pageNumber = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<UserManagementDto>> => {
    return apiRequest.get<PaginatedResponse<UserManagementDto>>(
      `/users/search?term=${encodeURIComponent(searchTerm)}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  },

  /**
   * Get users by role
   * GET /api/users/by-role/{roleId}
   */
  getUsersByRole: async (
    roleId: number,
    pageNumber = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<UserManagementDto>> => {
    return apiRequest.get<PaginatedResponse<UserManagementDto>>(
      `/users/by-role/${roleId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  },

  /**
   * Get users by department
   * GET /api/users/by-department
   */
  getUsersByDepartment: async (
    department: string,
    pageNumber = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<UserManagementDto>> => {
    return apiRequest.get<PaginatedResponse<UserManagementDto>>(
      `/users/by-department?department=${encodeURIComponent(department)}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  },

  /**
   * Get active users only
   * GET /api/users/active
   */
  getActiveUsers: async (
    pageNumber = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<UserManagementDto>> => {
    return apiRequest.get<PaginatedResponse<UserManagementDto>>(
      `/users/active?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  },

  /**
   * Get inactive users only
   * GET /api/users/inactive
   */
  getInactiveUsers: async (
    pageNumber = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<UserManagementDto>> => {
    return apiRequest.get<PaginatedResponse<UserManagementDto>>(
      `/users/inactive?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  },

  /**
   * Bulk delete users
   * DELETE /api/users/bulk-delete
   */
  bulkDeleteUsers: async (userIds: number[]): Promise<void> => {
    return apiRequest.delete<void>('/users/bulk-delete', { data: { userIds } });
  },

  /**
   * Bulk activate users
   * PATCH /api/users/bulk-activate
   */
  bulkActivateUsers: async (userIds: number[]): Promise<void> => {
    return apiRequest.patch<void>('/users/bulk-activate', { userIds });
  },

  /**
   * Bulk deactivate users
   * PATCH /api/users/bulk-deactivate
   */
  bulkDeactivateUsers: async (userIds: number[]): Promise<void> => {
    return apiRequest.patch<void>('/users/bulk-deactivate', { userIds });
  },

  /**
   * Export users to Excel
   * GET /api/users/export
   */
  exportUsers: async (filters?: UserFilters): Promise<Blob> => {
    const params = new URLSearchParams();
    
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters?.roleId !== undefined) params.append('roleId', filters.roleId.toString());
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.department) params.append('department', filters.department);

    const queryString = params.toString();
    return apiRequest.get<Blob>(
      `/users/export${queryString ? `?${queryString}` : ''}`,
      { responseType: 'blob' }
    );
  },
};
