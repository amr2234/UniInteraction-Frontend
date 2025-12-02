import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { usersApi } from '../api/users.api';
import type {
  UserManagementDto,
  UserDto,
  UserFilters,
  ResetPasswordDto,
} from '../types/user.types';
import { queryKeys } from '@/core/lib/queryKeys';
import { PaginatedResponse, ApiError } from '@/core/types/api';
import { toast } from 'sonner';

// ============================================
// User Management Hooks (Admin)
// ============================================

/**
 * Hook to get all users with pagination and filters
 */
export const useUsers = (filters?: UserFilters, options?: UseQueryOptions<PaginatedResponse<UserManagementDto>, ApiError>) => {
  return useQuery<PaginatedResponse<UserManagementDto>, ApiError>({
    queryKey: queryKeys.users.list(filters || {}),
    queryFn: () => usersApi.getUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to get user by ID
 */
export const useUserById = (id: number, options?: UseQueryOptions<UserManagementDto, ApiError>) => {
  return useQuery<UserManagementDto, ApiError>({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => usersApi.getUserById(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook to create a new user
 */
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UserManagementDto, ApiError, UserDto>({
    mutationFn: usersApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('تم إنشاء المستخدم بنجاح');
    },
    onError: (error) => {
      toast.error('فشل إنشاء المستخدم', {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to update a user
 */
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UserManagementDto, ApiError, { id: number; payload: UserDto }>({
    mutationFn: ({ id, payload }) => usersApi.updateUser(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) });
      toast.success('تم تحديث المستخدم بنجاح');
    },
    onError: (error) => {
      toast.error('فشل تحديث المستخدم', {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to delete a user
 */
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number>({
    mutationFn: usersApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('تم حذف المستخدم بنجاح');
    },
    onError: (error) => {
      toast.error('فشل حذف المستخدم', {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to toggle user active status
 */
export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<UserManagementDto, ApiError, number>({
    mutationFn: usersApi.toggleUserStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(data.id) });
      toast.success(data.isActive ? 'تم تفعيل المستخدم بنجاح' : 'تم إلغاء تفعيل المستخدم بنجاح');
    },
    onError: (error) => {
      toast.error('فشل تغيير حالة المستخدم', {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to activate a user
 */
export const useActivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UserManagementDto, ApiError, number>({
    mutationFn: usersApi.activateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(data.id) });
      toast.success('تم تفعيل المستخدم بنجاح');
    },
    onError: (error) => {
      toast.error('فشل تفعيل المستخدم', {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to deactivate a user
 */
export const useDeactivateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<UserManagementDto, ApiError, number>({
    mutationFn: usersApi.deactivateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(data.id) });
      toast.success('تم إلغاء تفعيل المستخدم بنجاح');
    },
    onError: (error) => {
      toast.error('فشل إلغاء تفعيل المستخدم', {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to search users
 */
export const useSearchUsers = (
  searchTerm: string,
  pageNumber = 1,
  pageSize = 10,
  options?: UseQueryOptions<PaginatedResponse<UserManagementDto>, ApiError>
) => {
  return useQuery<PaginatedResponse<UserManagementDto>, ApiError>({
    queryKey: [...queryKeys.users.all, 'search', searchTerm, pageNumber, pageSize],
    queryFn: () => usersApi.searchUsers(searchTerm, pageNumber, pageSize),
    enabled: searchTerm.length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
    ...options,
  });
};

/**
 * Hook to get users by role
 */
export const useUsersByRole = (
  roleId: number,
  pageNumber = 1,
  pageSize = 10,
  options?: UseQueryOptions<PaginatedResponse<UserManagementDto>, ApiError>
) => {
  return useQuery<PaginatedResponse<UserManagementDto>, ApiError>({
    queryKey: [...queryKeys.users.all, 'role', roleId, pageNumber, pageSize],
    queryFn: () => usersApi.getUsersByRole(roleId, pageNumber, pageSize),
    enabled: !!roleId,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to get users by department
 */
export const useUsersByDepartment = (
  department: string,
  pageNumber = 1,
  pageSize = 10,
  options?: UseQueryOptions<PaginatedResponse<UserManagementDto>, ApiError>
) => {
  return useQuery<PaginatedResponse<UserManagementDto>, ApiError>({
    queryKey: [...queryKeys.users.all, 'department', department, pageNumber, pageSize],
    queryFn: () => usersApi.getUsersByDepartment(department, pageNumber, pageSize),
    enabled: department.length > 0,
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to get active users only
 */
export const useActiveUsers = (
  pageNumber = 1,
  pageSize = 10,
  options?: UseQueryOptions<PaginatedResponse<UserManagementDto>, ApiError>
) => {
  return useQuery<PaginatedResponse<UserManagementDto>, ApiError>({
    queryKey: [...queryKeys.users.all, 'active', pageNumber, pageSize],
    queryFn: () => usersApi.getActiveUsers(pageNumber, pageSize),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to get inactive users only
 */
export const useInactiveUsers = (
  pageNumber = 1,
  pageSize = 10,
  options?: UseQueryOptions<PaginatedResponse<UserManagementDto>, ApiError>
) => {
  return useQuery<PaginatedResponse<UserManagementDto>, ApiError>({
    queryKey: [...queryKeys.users.all, 'inactive', pageNumber, pageSize],
    queryFn: () => usersApi.getInactiveUsers(pageNumber, pageSize),
    staleTime: 5 * 60 * 1000,
    ...options,
  });
};

/**
 * Hook to reset user password
 */
export const useResetUserPassword = () => {
  return useMutation<void, ApiError, { id: number; payload: ResetPasswordDto }>({
    mutationFn: ({ id, payload }) => usersApi.resetUserPassword(id, payload),
    onSuccess: () => {
      toast.success('تم إعادة تعيين كلمة المرور بنجاح');
    },
    onError: (error) => {
      toast.error('فشل إعادة تعيين كلمة المرور', {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to bulk delete users
 */
export const useBulkDeleteUsers = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number[]>({
    mutationFn: usersApi.bulkDeleteUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('تم حذف المستخدمين بنجاح');
    },
    onError: (error) => {
      toast.error('فشل حذف المستخدمين', {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to bulk activate users
 */
export const useBulkActivateUsers = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number[]>({
    mutationFn: usersApi.bulkActivateUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('تم تفعيل المستخدمين بنجاح');
    },
    onError: (error) => {
      toast.error('فشل تفعيل المستخدمين', {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to bulk deactivate users
 */
export const useBulkDeactivateUsers = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number[]>({
    mutationFn: usersApi.bulkDeactivateUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success('تم إلغاء تفعيل المستخدمين بنجاح');
    },
    onError: (error) => {
      toast.error('فشل إلغاء تفعيل المستخدمين', {
        description: error.message,
      });
    },
  });
};
