import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { faqsApi } from '../api/faqs.api';
import { queryKeys } from '@/core/lib/queryKeys';
import type { FaqFilters } from '../types/faq.types';
import { FaqDto, CreateFaqPayload, UpdateFaqPayload, ApiError, PaginatedResponse } from '@/core/types/api';
import { toast } from 'sonner';
import { useI18n } from '@/i18n';

// ============================================
// FAQ Hooks (Admin)
// ============================================

/**
 * Hook to get all FAQs with pagination and filters
 */
export const useFaqs = (
  filters?: FaqFilters,
  options?: UseQueryOptions<PaginatedResponse<FaqDto>, ApiError>
) => {
  return useQuery<PaginatedResponse<FaqDto>, ApiError>({
    queryKey: [...queryKeys.faqs.all, filters || {}],
    queryFn: () => faqsApi.getFaqs(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to get all FAQs (without pagination) - for public FAQ page
 */
export const useAllFaqs = () => {
  return useQuery<FaqDto[], ApiError>({
    queryKey: queryKeys.faqs.list,
    queryFn: faqsApi.getAllFaqs,
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
  const { t } = useI18n();

  return useMutation<FaqDto, ApiError, CreateFaqPayload>({
    mutationFn: faqsApi.createFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.faqs.all });
      toast.success(t('faq.createSuccess'));
    },
    onError: (error) => {
      toast.error(t('faq.createError'), {
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
  const { t } = useI18n();

  return useMutation<FaqDto, ApiError, { id: number; payload: UpdateFaqPayload }>({
    mutationFn: ({ id, payload }) => faqsApi.updateFaq(id, payload),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.faqs.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.faqs.detail(variables.id) });
      toast.success(t('faq.updateSuccess'));
    },
    onError: (error) => {
      toast.error(t('faq.updateError'), {
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
  const { t } = useI18n();

  return useMutation<void, ApiError, number>({
    mutationFn: faqsApi.deleteFaq,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.faqs.all });
      toast.success(t('faq.deleteSuccess'));
    },
    onError: (error) => {
      toast.error(t('common.error'), {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to toggle FAQ active status
 */
export const useToggleFaqStatus = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<FaqDto, ApiError, { id: number; isActive: boolean }>({
    mutationFn: faqsApi.toggleFaqStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.faqs.all });
      toast.success(data.isActive ? t('faq.activateSuccess') : t('faq.deactivateSuccess'));
    },
    onError: (error) => {
      toast.error(t('faq.toggleStatusError'), {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to reorder FAQs
 */
export const useReorderFaqs = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<void, ApiError, number[]>({
    mutationFn: faqsApi.reorderFaqs,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.faqs.all });
      toast.success(t('faq.reorderSuccess'));
    },
    onError: (error) => {
      toast.error(t('faq.reorderError'), {
        description: error.message,
      });
    },
  });
};
