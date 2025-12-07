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
import { useI18n } from '@/i18n';






export const useUsers = (filters?: UserFilters, options?: UseQueryOptions<PaginatedResponse<UserManagementDto>, ApiError>) => {
  return useQuery<PaginatedResponse<UserManagementDto>, ApiError>({
    queryKey: queryKeys.users.list(filters || {}),
    queryFn: () => usersApi.getUsers(filters),
    staleTime: 5 * 60 * 1000, 
    ...options,
  });
};


export const useUserById = (id: number, options?: UseQueryOptions<UserManagementDto, ApiError>) => {
  return useQuery<UserManagementDto, ApiError>({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => usersApi.getUserById(id),
    enabled: !!id,
    ...options,
  });
};


export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<UserManagementDto, ApiError, UserDto>({
    mutationFn: usersApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      // Toast handled by form component for better i18n
    },
    onError: (error) => {
      // Error handled by form component for better i18n
    },
  });
};


export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<UserManagementDto, ApiError, { id: number; payload: UserDto }>({
    mutationFn: ({ id, payload }) => usersApi.updateUser(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(variables.id) });
      
    },
    onError: (error) => {
      toast.error(t('users.updateError'), {
        description: error.message,
      });
    },
  });
};


export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<void, ApiError, number>({
    mutationFn: usersApi.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success(t('users.deleteSuccess'));
    },
    onError: (error) => {
      toast.error(t('users.deleteError'), {
        description: error.message,
      });
    },
  });
};


export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<UserManagementDto, ApiError, { id: number; isActive: boolean }>({
    mutationFn: usersApi.toggleUserStatus,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(data.id) });
      // Use the input variable (what we're setting TO) not the response
      toast.success(variables.isActive ? t('users.activateSuccess') : t('users.deactivateSuccess'));
    },
    onError: (error) => {
      toast.error(t('users.toggleStatusError'), {
        description: error.message,
      });
    },
  });
};


export const useActivateUser = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<UserManagementDto, ApiError, number>({
    mutationFn: usersApi.activateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(data.id) });
      toast.success(t('users.activateSuccess'));
    },
    onError: (error) => {
      toast.error(t('users.activateError'), {
        description: error.message,
      });
    },
  });
};


export const useDeactivateUser = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<UserManagementDto, ApiError, number>({
    mutationFn: usersApi.deactivateUser,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(data.id) });
      toast.success(t('users.deactivateSuccess'));
    },
    onError: (error) => {
      toast.error(t('users.deactivateError'), {
        description: error.message,
      });
    },
  });
};


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
    staleTime: 2 * 60 * 1000, 
    ...options,
  });
};


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


export const useResetUserPassword = () => {
  const { t } = useI18n();

  return useMutation<void, ApiError, { id: number; payload: ResetPasswordDto }>({
    mutationFn: ({ id, payload }) => usersApi.resetUserPassword(id, payload),
    onSuccess: () => {
      toast.success(t('users.resetPasswordSuccess'));
    },
    onError: (error) => {
      toast.error(t('users.resetPasswordError'), {
        description: error.message,
      });
    },
  });
};


export const useBulkDeleteUsers = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<void, ApiError, number[]>({
    mutationFn: usersApi.bulkDeleteUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success(t('users.bulkDeleteSuccess'));
    },
    onError: (error) => {
      toast.error(t('users.bulkDeleteError'), {
        description: error.message,
      });
    },
  });
};


export const useBulkActivateUsers = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<void, ApiError, number[]>({
    mutationFn: usersApi.bulkActivateUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success(t('users.bulkActivateSuccess'));
    },
    onError: (error) => {
      toast.error(t('users.bulkActivateError'), {
        description: error.message,
      });
    },
  });
};


export const useBulkDeactivateUsers = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<void, ApiError, number[]>({
    mutationFn: usersApi.bulkDeactivateUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
      toast.success(t('users.bulkDeactivateSuccess'));
    },
    onError: (error) => {
      toast.error(t('users.bulkDeactivateError'), {
        description: error.message,
      });
    },
  });
};
