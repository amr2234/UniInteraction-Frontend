import { useQuery, useMutation, useQueryClient, UseQueryResult, UseMutationResult } from '@tanstack/react-query';
import { requestsApi } from '../api/requests.api';
import { queryKeys } from '@/core/lib/queryKeys';
import {
  CreateRequestPayload,
  UserRequestDto,
  RequestFilters,
  UpdateRequestStatusPayload,
  RequestAttachment,
  ApiError,
  RequestStatusCount,
} from '@/core/types/api';
import { toast } from 'sonner';

// ============================================
// Request Hooks
// ============================================

/**
 * Hook to create a new request
 */
export const useCreateRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<UserRequestDto, ApiError, CreateRequestPayload>({
    mutationFn: requestsApi.createRequest,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      toast.success('تم إنشاء الطلب بنجاح', {
        description: `رقم الطلب: ${data.requestNumber}`,
      });
    },
    onError: (error) => {
      toast.error('فشل إنشاء الطلب', {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to get user requests with optional filters
 */
export const useUserRequests = (filters?: RequestFilters, enablePagination: boolean = true) => {
  return useQuery<UserRequestDto[], ApiError>({
    queryKey: queryKeys.requests.list(filters),
    queryFn: () => requestsApi.getUserRequests(filters, enablePagination),
    enabled: !!filters, // Only fetch when filters are provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to get request details by ID
 */
export const useRequestDetails = (id: number | string) => {
  return useQuery<UserRequestDto, ApiError>({
    queryKey: queryKeys.requests.detail(id),
    queryFn: () => requestsApi.getRequestById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to update request status
 */
export const useUpdateRequestStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    UserRequestDto,
    ApiError,
    { id: number | string; payload: UpdateRequestStatusPayload }
  >({
    mutationFn: ({ id, payload }) => requestsApi.updateRequestStatus(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.detail(variables.id) });
      toast.success('تم تحديث حالة الطلب بنجاح');
    },
    onError: (error) => {
      toast.error('فشل تحديث حالة الطلب', {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to upload request attachment
 */
export const useUploadRequestAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RequestAttachment,
    ApiError,
    { id: number | string; file: File }
  >({
    mutationFn: ({ id, file }) => requestsApi.uploadRequestAttachment(id, file),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.attachments(variables.id) });
      toast.success('تم رفع المرفق بنجاح');
    },
    onError: (error) => {
      toast.error('فشل رفع المرفق', {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to upload multiple request attachments
 */
export const useUploadRequestAttachments = () => {
  const queryClient = useQueryClient();

  return useMutation<
    RequestAttachment[],
    ApiError,
    { id: number | string; files: File[] }
  >({
    mutationFn: ({ id, files }) => requestsApi.uploadRequestAttachments(id, files),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.attachments(variables.id) });
      toast.success(`تم رفع ${data.length} مرفق بنجاح`);
    },
    onError: (error) => {
      toast.error('فشل رفع المرفقات', {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to get request attachments
 */
export const useRequestAttachments = (id: number | string) => {
  return useQuery<RequestAttachment[], ApiError>({
    queryKey: queryKeys.requests.attachments(id),
    queryFn: () => requestsApi.getRequestAttachments(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to delete request attachment
 */
export const useDeleteRequestAttachment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    void,
    ApiError,
    { requestId: number | string; attachmentId: number }
  >({
    mutationFn: ({ requestId, attachmentId }) =>
      requestsApi.deleteRequestAttachment(requestId, attachmentId),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.attachments(variables.requestId) });
      toast.success('تم حذف المرفق بنجاح');
    },
    onError: (error) => {
      toast.error('فشل حذف المرفق', {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to get request counts by status
 */
export const useRequestCountsByStatus = () => {
  return useQuery<RequestStatusCount[], ApiError>({
    queryKey: queryKeys.requests.countsByStatus,
    queryFn: () => requestsApi.getCountsByStatus(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
