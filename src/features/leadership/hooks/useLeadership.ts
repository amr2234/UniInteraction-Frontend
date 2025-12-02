import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { leadershipApi } from '../api/leadership.api';
import { queryKeys } from '@/core/lib/queryKeys';
import {
  UniversityLeadershipDto,
  CreateLeadershipPayload,
  UpdateLeadershipPayload,
  ApiError,
} from '@/core/types/api';
import { toast } from 'sonner';

// ============================================
// Leadership Hooks (Admin)
// ============================================

/**
 * Hook to get all leadership members
 */
export const useLeadership = () => {
  return useQuery<UniversityLeadershipDto[], ApiError>({
    queryKey: queryKeys.leadership.list,
    queryFn: leadershipApi.getLeadership,
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

  return useMutation<UniversityLeadershipDto, ApiError, CreateLeadershipPayload>({
    mutationFn: leadershipApi.createLeadership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leadership.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.leadership });
      toast.success('تم إضافة القيادة الجامعية بنجاح');
    },
    onError: (error) => {
      toast.error('فشل إضافة القيادة الجامعية', {
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
      toast.success('تم تحديث القيادة الجامعية بنجاح');
    },
    onError: (error) => {
      toast.error('فشل تحديث القيادة الجامعية', {
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

  return useMutation<void, ApiError, number>({
    mutationFn: leadershipApi.deleteLeadership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leadership.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.leadership });
      toast.success('تم حذف القيادة الجامعية بنجاح');
    },
    onError: (error) => {
      toast.error('فشل حذف القيادة الجامعية', {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to upload leadership member image
 */
export const useUploadLeadershipImage = () => {
  const queryClient = useQueryClient();

  return useMutation<{ imageUrl: string }, ApiError, { id: number; file: File }>({
    mutationFn: ({ id, file }) => leadershipApi.uploadLeadershipImage(id, file),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.leadership.detail(variables.id) });
      toast.success('تم رفع الصورة بنجاح');
    },
    onError: (error) => {
      toast.error('فشل رفع الصورة', {
        description: error.message,
      });
    },
  });
};
