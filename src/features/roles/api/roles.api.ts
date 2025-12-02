import { apiRequest } from '@/core/lib/apiClient';
import {
  RoleDto,
  PermissionDto,
  CreateRolePayload,
  UpdateRolePayload,
  AssignRolePayload,
  UserPermissionsDto,
} from '@/core/types/api';

// ============================================
// Roles & Permissions API Functions
// ============================================

export const rolesApi = {
  // ========== Roles Management ==========
  
  /**
   * Get all roles
   */
  getRoles: async (): Promise<RoleDto[]> => {
    return apiRequest.get<RoleDto[]>('/roles');
  },

  /**
   * Get role by ID
   */
  getRoleById: async (id: number): Promise<RoleDto> => {
    return apiRequest.get<RoleDto>(`/roles/${id}`);
  },

  /**
   * Create a new role
   */
  createRole: async (payload: CreateRolePayload): Promise<RoleDto> => {
    return apiRequest.post<RoleDto>('/roles', payload);
  },

  /**
   * Update a role
   */
  updateRole: async (id: number, payload: UpdateRolePayload): Promise<RoleDto> => {
    return apiRequest.put<RoleDto>(`/roles/${id}`, payload);
  },

  /**
   * Delete a role
   */
  deleteRole: async (id: number): Promise<void> => {
    return apiRequest.delete<void>(`/roles/${id}`);
  },

  // ========== Permissions Management ==========
  
  /**
   * Get all available permissions
   */
  getAllPermissions: async (): Promise<PermissionDto[]> => {
    return apiRequest.get<PermissionDto[]>('/permissions');
  },

  /**
   * Get permissions for a specific role
   */
  getRolePermissions: async (roleId: number): Promise<PermissionDto[]> => {
    return apiRequest.get<PermissionDto[]>(`/roles/${roleId}/permissions`);
  },

  /**
   * Update permissions for a role
   */
  updateRolePermissions: async (roleId: number, permissionIds: number[]): Promise<RoleDto> => {
    return apiRequest.put<RoleDto>(`/roles/${roleId}/permissions`, { permissionIds });
  },

  // ========== User Role Assignment ==========
  
  /**
   * Get user's roles and permissions
   */
  getUserPermissions: async (userId: number): Promise<UserPermissionsDto> => {
    return apiRequest.get<UserPermissionsDto>(`/users/${userId}/permissions`);
  },

  /**
   * Assign roles to a user
   */
  assignRolesToUser: async (userId: number, roleIds: number[]): Promise<void> => {
    return apiRequest.post<void>(`/users/${userId}/roles`, { roleIds });
  },

  /**
   * Remove role from user
   */
  removeRoleFromUser: async (userId: number, roleId: number): Promise<void> => {
    return apiRequest.delete<void>(`/users/${userId}/roles/${roleId}`);
  },

  /**
   * Get current user's permissions
   */
  getCurrentUserPermissions: async (): Promise<UserPermissionsDto> => {
    return apiRequest.get<UserPermissionsDto>('/auth/me/permissions');
  },

  /**
   * Check if current user has permission
   */
  checkPermission: async (permissionCode: string): Promise<boolean> => {
    return apiRequest.post<boolean>('/auth/check-permission', { permissionCode });
  },

  /**
   * Check if current user has any of the permissions
   */
  checkAnyPermission: async (permissionCodes: string[]): Promise<boolean> => {
    return apiRequest.post<boolean>('/auth/check-any-permission', { permissionCodes });
  },

  /**
   * Check if current user has all of the permissions
   */
  checkAllPermissions: async (permissionCodes: string[]): Promise<boolean> => {
    return apiRequest.post<boolean>('/auth/check-all-permissions', { permissionCodes });
  },
};
