import { useQuery, useMutation, useQueryClient, UseQueryOptions } from '@tanstack/react-query';
import { categoriesApi } from '../api/categories.api';
import { queryKeys } from '@/core/lib/queryKeys';
import type { MainCategoryFilters, SubCategoryFilters } from '../types/category.types';
import {
  MainCategoryDto,
  SubCategoryDto,
  ServiceDto,
  CreateMainCategoryPayload,
  UpdateMainCategoryPayload,
  CreateSubCategoryPayload,
  UpdateSubCategoryPayload,
  CreateServicePayload,
  UpdateServicePayload,
  ApiError,
  PaginatedResponse,
} from '@/core/types/api';
import { toast } from 'sonner';
import { useI18n } from '@/i18n';

// ============================================
// Main Category Hooks (Admin)
// ============================================

/**
 * Hook to get all main categories with pagination and filters
 */
export const useMainCategoriesAdmin = (
  filters?: MainCategoryFilters,
  options?: UseQueryOptions<PaginatedResponse<MainCategoryDto>, ApiError>
) => {
  return useQuery<PaginatedResponse<MainCategoryDto>, ApiError>({
    queryKey: [...queryKeys.categories.main.all, filters || {}],
    queryFn: () => categoriesApi.getMainCategories(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to get all main categories (without pagination)
 */
export const useAllMainCategories = () => {
  return useQuery<MainCategoryDto[], ApiError>({
    queryKey: queryKeys.categories.main.list,
    queryFn: categoriesApi.getAllMainCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to create main category
 */
export const useCreateMainCategory = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<MainCategoryDto, ApiError, CreateMainCategoryPayload>({
    mutationFn: categoriesApi.createMainCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.main.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.mainCategories });
      toast.success(t('categories.createMainCategorySuccess'));
    },
    onError: (error) => {
      toast.error(t('categories.createMainCategoryError'), {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to update main category
 */
export const useUpdateMainCategory = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<
    MainCategoryDto,
    ApiError,
    { id: number; payload: UpdateMainCategoryPayload }
  >({
    mutationFn: ({ id, payload }) => categoriesApi.updateMainCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.main.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.mainCategories });
      toast.success(t('categories.updateMainCategorySuccess'));
    },
    onError: (error) => {
      toast.error(t('categories.updateMainCategoryError'), {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to delete main category
 */
export const useDeleteMainCategory = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<void, ApiError, number>({
    mutationFn: categoriesApi.deleteMainCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.main.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.mainCategories });
      toast.success(t('categories.deleteMainCategorySuccess'));
    },
    onError: (error) => {
      toast.error(t('categories.deleteMainCategoryError'), {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to toggle main category status
 */
export const useToggleMainCategoryStatus = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<MainCategoryDto, ApiError, { id: number; isActive: boolean }>({  
    mutationFn: categoriesApi.toggleMainCategoryStatus,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.main.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.mainCategories });
      toast.success(data.isActive ? t('categories.activateMainCategorySuccess') : t('categories.deactivateMainCategorySuccess'));
    },
    onError: (error) => {
      toast.error(t('categories.toggleMainCategoryStatusError'), {
        description: error.message,
      });
    },
  });
};

// ============================================
// Sub Category Hooks (Admin)
// ============================================

/**
 * Hook to get all subcategories
 */
export const useSubCategoriesAdmin = (mainCategoryId?: number) => {
  return useQuery<SubCategoryDto[], ApiError>({
    queryKey: queryKeys.categories.sub.list,
    queryFn: () => categoriesApi.getSubCategories(mainCategoryId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to create subcategory
 */
export const useCreateSubCategory = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<SubCategoryDto, ApiError, CreateSubCategoryPayload>({
    mutationFn: categoriesApi.createSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.sub.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.subCategories() });
      toast.success(t('categories.createSubCategorySuccess'));
    },
    onError: (error) => {
      toast.error(t('categories.createSubCategoryError'), {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to update subcategory
 */
export const useUpdateSubCategory = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<
    SubCategoryDto,
    ApiError,
    { id: number; payload: UpdateSubCategoryPayload }
  >({
    mutationFn: ({ id, payload }) => categoriesApi.updateSubCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.sub.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.subCategories() });
      toast.success(t('categories.updateSubCategorySuccess'));
    },
    onError: (error) => {
      toast.error(t('categories.updateSubCategoryError'), {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to delete subcategory
 */
export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<void, ApiError, number>({
    mutationFn: categoriesApi.deleteSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.sub.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.subCategories() });
      toast.success(t('categories.deleteSubCategorySuccess'));
    },
    onError: (error) => {
      toast.error(t('categories.deleteSubCategoryError'), {
        description: error.message,
      });
    },
  });
};

// ============================================
// Service Hooks (Admin)
// ============================================

/**
 * Hook to get all services
 */
export const useServicesAdmin = (subCategoryId?: number) => {
  return useQuery<ServiceDto[], ApiError>({
    queryKey: queryKeys.categories.services.list,
    queryFn: () => categoriesApi.getServices(subCategoryId),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to create service
 */
export const useCreateService = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<ServiceDto, ApiError, CreateServicePayload>({
    mutationFn: categoriesApi.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.services.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.services() });
      toast.success(t('categories.createServiceSuccess'));
    },
    onError: (error) => {
      toast.error(t('categories.createServiceError'), {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to update service
 */
export const useUpdateService = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<ServiceDto, ApiError, { id: number; payload: UpdateServicePayload }>({
    mutationFn: ({ id, payload }) => categoriesApi.updateService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.services.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.services() });
      toast.success(t('categories.updateServiceSuccess'));
    },
    onError: (error) => {
      toast.error(t('categories.updateServiceError'), {
        description: error.message,
      });
    },
  });
};

/**
 * Hook to delete service
 */
export const useDeleteService = () => {
  const queryClient = useQueryClient();
  const { t } = useI18n();

  return useMutation<void, ApiError, number>({
    mutationFn: categoriesApi.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.services.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.services() });
      toast.success(t('categories.deleteServiceSuccess'));
    },
    onError: (error) => {
      toast.error(t('categories.deleteServiceError'), {
        description: error.message,
      });
    },
  });
};
