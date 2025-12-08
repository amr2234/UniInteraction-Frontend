import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { departmentsApi } from '../api/departments.api';
import type {
  DepartmentDto,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  DepartmentFilters,
} from '../types/department.types';
import { queryKeys } from '@/core/lib/queryKeys';
import { PaginatedResponse, ApiError } from '@/core/types/api';
import { toast } from 'sonner';
import { useI18n } from '@/i18n';

// ============================================
// Department Management Hooks
// ============================================

/**
 * Hook to get all departments with pagination and filters
 */
export const useDepartments = (
  filters?: DepartmentFilters,
  options?: UseQueryOptions<PaginatedResponse<DepartmentDto>, ApiError>
) => {
  return useQuery<PaginatedResponse<DepartmentDto>, ApiError>({
    queryKey: [...queryKeys.departments.all, filters || {}],
    queryFn: () => departmentsApi.getDepartments(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to get department by ID
 */
export const useDepartmentById = (
  id: number,
  options?: UseQueryOptions<DepartmentDto, ApiError>
) => {
  return useQuery<DepartmentDto, ApiError>({
    queryKey: [...queryKeys.departments.all, 'detail', id],
    queryFn: () => departmentsApi.getDepartmentById(id),
    enabled: !!id,
    ...options,
  });
};

/**
 * Hook to create a new department
 */
export const useCreateDepartment = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<DepartmentDto, ApiError, CreateDepartmentDto>({
    mutationFn: departmentsApi.createDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
      toast.success(t('departments.createSuccess'));
    },
    onError: (error) => {
      toast.error(t('departments.createError'), {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to update a department
 */
export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<DepartmentDto, ApiError, { id: number; payload: UpdateDepartmentDto }>({
    mutationFn: ({ id, payload }) => departmentsApi.updateDepartment(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
      toast.success(t('departments.updateSuccess'));
    },
    onError: (error) => {
      toast.error(t('departments.updateError'), {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to delete a department
 */
export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<void, ApiError, number>({
    mutationFn: departmentsApi.deleteDepartment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
      toast.success(t('departments.deleteSuccess'));
    },
    onError: (error) => {
      toast.error(t('departments.deleteError'), {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to toggle department active status
 */
export const useToggleDepartmentStatus = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<DepartmentDto, ApiError, { id: number; isActive: boolean }>({
    mutationFn: departmentsApi.toggleDepartmentStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.departments.all });
      toast.success(data.isActive ? t('departments.activateSuccess') : t('departments.deactivateSuccess'));
    },
    onError: (error) => {
      toast.error(t('departments.toggleStatusError'), {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to get active departments only
 */
export const useActiveDepartments = (
  options?: UseQueryOptions<DepartmentDto[], ApiError>
) => {
  return useQuery<DepartmentDto[], ApiError>({
    queryKey: [...queryKeys.departments.all, 'active'],
    queryFn: () => departmentsApi.getActiveDepartments(),
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};
