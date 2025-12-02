import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { faqsApi } from '../api/faqs.api';
import { queryKeys } from '@/core/lib/queryKeys';
import { FaqDto, CreateFaqPayload, UpdateFaqPayload, ApiError } from '@/core/types/api';
import { toast } from 'sonner';

// ============================================
// FAQ Hooks
// ============================================

/**
 * Hook to get all FAQs
 */
export const useFaqs = () => {
  return useQuery<FaqDto[], ApiError>({
    queryKey: queryKeys.faqs.all,
    queryFn: faqsApi.getFaqs,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to get FAQ by ID
 */
export const useFaqById = (id: number) => {
  return useQuery<FaqDto, ApiError>({
    queryKey: queryKeys.faqs.detail(id),
    queryFn: () => faqsApi.getFaqById(id),
    enabled: !!id,
  });
};

/**
 * Hook to create a new FAQ (Admin only)
 */
export const useCreateFaq = () => {
  const queryClient = useQueryClient();

  return useMutation<FaqDto, ApiError, CreateFaqPayload>({
    mutationFn: faqsApi.createFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.faqs.all });
      toast.success('تم إنشاء السؤال الشائع بنجاح');
    },
    onError: (error) => {
      toast.error('فشل إنشاء السؤال الشائع', {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to update a FAQ (Admin only)
 */
export const useUpdateFaq = () => {
  const queryClient = useQueryClient();

  return useMutation<FaqDto, ApiError, { id: number; payload: UpdateFaqPayload }>({
    mutationFn: ({ id, payload }) => faqsApi.updateFaq(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.faqs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.faqs.detail(variables.id) });
      toast.success('تم تحديث السؤال الشائع بنجاح');
    },
    onError: (error) => {
      toast.error('فشل تحديث السؤال الشائع', {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to delete a FAQ (Admin only)
 */
export const useDeleteFaq = () => {
  const queryClient = useQueryClient();

  return useMutation<void, ApiError, number>({
    mutationFn: faqsApi.deleteFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.faqs.all });
      toast.success('تم حذف السؤال الشائع بنجاح');
    },
    onError: (error) => {
      toast.error('فشل حذف السؤال الشائع', {
        description: error.message,
      });
    },
  });
};
