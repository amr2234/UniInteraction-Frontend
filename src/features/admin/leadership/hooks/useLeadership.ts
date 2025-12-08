import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { leadershipApi } from '../api/leadership.api';
import { queryKeys } from '@/core/lib/queryKeys';
import type { LeadershipFilters } from '../types/leadership.types';
import {
  UniversityLeadershipDto,
  CreateLeadershipPayload,
  UpdateLeadershipPayload,
  ApiError,
  PaginatedResponse,
} from '@/core/types/api';
import { toast } from 'sonner';
import { useI18n } from '@/i18n';

// ============================================
// Leadership Hooks (Admin)
// ============================================

/**
 * Hook to get all leadership members with pagination and filters
 */
export const useLeadership = (
  filters?: LeadershipFilters,
  options?: UseQueryOptions<PaginatedResponse<UniversityLeadershipDto>, ApiError>
) => {
  return useQuery<PaginatedResponse<UniversityLeadershipDto>, ApiError>({
    queryKey: [...queryKeys.leadership.all, filters || {}],
    queryFn: () => leadershipApi.getLeadership(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to get all leadership members (without pagination)
 */
export const useAllLeadership = () => {
  return useQuery<UniversityLeadershipDto[], ApiError>({
    queryKey: queryKeys.leadership.list,
    queryFn: leadershipApi.getAllLeadership,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get leadership member by ID
 */
export const useLeadershipById = (id: number) => {
  return useQuery<UniversityLeadershipDto, ApiError>({
    queryKey: queryKeys.leadership.detail(id),
    queryFn: () => leadershipApi.getLeadershipById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a new leadership member (Admin only)
 */
export const useCreateLeadership = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<UniversityLeadershipDto, ApiError, CreateLeadershipPayload>({
    mutationFn: leadershipApi.createLeadership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leadership.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.leadership });
      toast.success(t('leadership.createSuccess'));
    },
    onError: (error) => {
      toast.error(t('leadership.createError'), {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to update a leadership member (Admin only)
 */
export const useUpdateLeadership = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<
    UniversityLeadershipDto,
    ApiError,
    { id: number; payload: UpdateLeadershipPayload }
  >({
    mutationFn: ({ id, payload }) => leadershipApi.updateLeadership(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leadership.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.leadership.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.leadership });
      toast.success(t('leadership.updateSuccess'));
    },
    onError: (error) => {
      toast.error(t('leadership.updateError'), {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to delete a leadership member (Admin only)
 */
export const useDeleteLeadership = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<void, ApiError, number>({
    mutationFn: leadershipApi.deleteLeadership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leadership.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.leadership });
      toast.success(t('leadership.deleteSuccess'));
    },
    onError: (error) => {
      toast.error(t('common.error'), {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to toggle leadership member active status
 */
export const useToggleLeadershipStatus = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<UniversityLeadershipDto, ApiError, { id: number; isActive: boolean }>({
    mutationFn: leadershipApi.toggleLeadershipStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leadership.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.leadership });
      toast.success(data.isActive ? t('leadership.activateSuccess') : t('leadership.deactivateSuccess'));
    },
    onError: (error) => {
      toast.error(t('leadership.toggleStatusError'), {
        description: error.message,
      });
    },
  });
};


