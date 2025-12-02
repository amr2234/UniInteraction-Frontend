import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '../api/roles.api';
import { queryKeys } from '@/core/lib/queryKeys';
import {
  RoleDto,
  PermissionDto,
  CreateRolePayload,
  UpdateRolePayload,
  UserPermissionsDto,
  ApiError,
} from '@/core/types/api';
import { toast } from 'sonner';

// ============================================
// Roles Management Hooks
// ============================================

/**
 * Hook to get all roles
 */
export const useRoles = () => {
  return useQuery<RoleDto[], ApiError>({
    queryKey: ['roles', 'list'],
    queryFn: rolesApi.getRoles,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get role by ID
 */
export const useRoleById = (id: number) => {
  return useQuery<RoleDto, ApiError>({
    queryKey: ['roles', 'detail', id],
    queryFn: () => rolesApi.getRoleById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a new role
 */
export const useCreateRole = () => {
  const queryClient = useQueryClient();

  return useMutation<RoleDto, ApiError, CreateRolePayload>({
    mutationFn: rolesApi.createRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('تم إنشاء الدور بنجاح');
    },
    onError: (error) => {
      toast.error('فشل إنشاء الدور', {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to update a role
 */
export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  return useMutation<RoleDto, ApiError, { id: number; payload: UpdateRolePayload }>({
    mutationFn: ({ id, payload }) => rolesApi.updateRole(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['roles', 'detail', variables.id] });
      toast.success('تم تحديث الدور بنجاح');
    },
    onError: (error) => {
      toast.error('فشل تحديث الدور', {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to delete a role
 */
export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number>({
    mutationFn: rolesApi.deleteRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      toast.success('تم حذف الدور بنجاح');
    },
    onError: (error) => {
      toast.error('فشل حذف الدور', {
        description: error.message,
      });
    },
  });
};

// ============================================
// Permissions Hooks
// ============================================

/**
 * Hook to get all available permissions
 */
export const useAllPermissions = () => {
  return useQuery<PermissionDto[], ApiError>({
    queryKey: ['permissions', 'all'],
    queryFn: rolesApi.getAllPermissions,
    staleTime: 60 * 60 * 1000, // 1 hour - permissions rarely change
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
};

/**
 * Hook to get permissions for a specific role
 */
export const useRolePermissions = (roleId: number) => {
  return useQuery<PermissionDto[], ApiError>({
    queryKey: ['roles', roleId, 'permissions'],
    queryFn: () => rolesApi.getRolePermissions(roleId),
    enabled: !!roleId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to update role permissions
 */
export const useUpdateRolePermissions = () => {
  const queryClient = useQueryClient();

  return useMutation<RoleDto, ApiError, { roleId: number; permissionIds: number[] }>({
    mutationFn: ({ roleId, permissionIds }) =>
      rolesApi.updateRolePermissions(roleId, permissionIds),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      queryClient.invalidateQueries({ queryKey: ['roles', variables.roleId] });
      toast.success('تم تحديث صلاحيات الدور بنجاح');
    },
    onError: (error) => {
      toast.error('فشل تحديث الصلاحيات', {
        description: error.message,
      });
    },
  });
};

// ============================================
// User Permissions Hooks
// ============================================

/**
 * Hook to get user's permissions
 */
export const useUserPermissions = (userId: number) => {
  return useQuery<UserPermissionsDto, ApiError>({
    queryKey: ['users', userId, 'permissions'],
    queryFn: () => rolesApi.getUserPermissions(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get current user's permissions
 */
export const useCurrentUserPermissions = () => {
  return useQuery<UserPermissionsDto, ApiError>({
    queryKey: ['auth', 'permissions'],
    queryFn: rolesApi.getCurrentUserPermissions,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
};

/**
 * Hook to assign roles to a user
 */
export const useAssignRolesToUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, { userId: number; roleIds: number[] }>({
    mutationFn: ({ userId, roleIds }) => rolesApi.assignRolesToUser(userId, roleIds),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.userId, 'permissions'] });
      toast.success('تم تعيين الأدوار بنجاح');
    },
    onError: (error) => {
      toast.error('فشل تعيين الأدوار', {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to remove role from user
 */
export const useRemoveRoleFromUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, { userId: number; roleId: number }>({
    mutationFn: ({ userId, roleId }) => rolesApi.removeRoleFromUser(userId, roleId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['users', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['users', variables.userId, 'permissions'] });
      toast.success('تم إزالة الدور بنجاح');
    },
    onError: (error) => {
      toast.error('فشل إزالة الدور', {
        description: error.message,
      });
    },
  });
};
