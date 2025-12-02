import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { categoriesApi } from '../api/categories.api';
import { queryKeys } from '@/core/lib/queryKeys';
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
} from '@/core/types/api';
import { toast } from 'sonner';

// ============================================
// Main Category Hooks (Admin)
// ============================================

/**
 * Hook to get all main categories
 */
export const useMainCategoriesAdmin = () => {
  return useQuery<MainCategoryDto[], ApiError>({
    queryKey: queryKeys.categories.main.list,
    queryFn: categoriesApi.getMainCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Hook to create main category
 */
export const useCreateMainCategory = () => {
  const queryClient = useQueryClient();

  return useMutation<MainCategoryDto, ApiError, CreateMainCategoryPayload>({
    mutationFn: categoriesApi.createMainCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.main.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.mainCategories });
      toast.success('تم إنشاء التصنيف الرئيسي بنجاح');
    },
    onError: (error) => {
      toast.error('فشل إنشاء التصنيف الرئيسي', {
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

  return useMutation<
    MainCategoryDto,
    ApiError,
    { id: number; payload: UpdateMainCategoryPayload }
  >({
    mutationFn: ({ id, payload }) => categoriesApi.updateMainCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.main.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.mainCategories });
      toast.success('تم تحديث التصنيف الرئيسي بنجاح');
    },
    onError: (error) => {
      toast.error('فشل تحديث التصنيف الرئيسي', {
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

  return useMutation<void, ApiError, number>({
    mutationFn: categoriesApi.deleteMainCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.main.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.mainCategories });
      toast.success('تم حذف التصنيف الرئيسي بنجاح');
    },
    onError: (error) => {
      toast.error('فشل حذف التصنيف الرئيسي', {
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

  return useMutation<SubCategoryDto, ApiError, CreateSubCategoryPayload>({
    mutationFn: categoriesApi.createSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.sub.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.subCategories() });
      toast.success('تم إنشاء التصنيف الفرعي بنجاح');
    },
    onError: (error) => {
      toast.error('فشل إنشاء التصنيف الفرعي', {
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

  return useMutation<
    SubCategoryDto,
    ApiError,
    { id: number; payload: UpdateSubCategoryPayload }
  >({
    mutationFn: ({ id, payload }) => categoriesApi.updateSubCategory(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.sub.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.subCategories() });
      toast.success('تم تحديث التصنيف الفرعي بنجاح');
    },
    onError: (error) => {
      toast.error('فشل تحديث التصنيف الفرعي', {
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

  return useMutation<void, ApiError, number>({
    mutationFn: categoriesApi.deleteSubCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.sub.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.subCategories() });
      toast.success('تم حذف التصنيف الفرعي بنجاح');
    },
    onError: (error) => {
      toast.error('فشل حذف التصنيف الفرعي', {
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

  return useMutation<ServiceDto, ApiError, CreateServicePayload>({
    mutationFn: categoriesApi.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.services.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.services() });
      toast.success('تم إنشاء الخدمة بنجاح');
    },
    onError: (error) => {
      toast.error('فشل إنشاء الخدمة', {
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

  return useMutation<ServiceDto, ApiError, { id: number; payload: UpdateServicePayload }>({
    mutationFn: ({ id, payload }) => categoriesApi.updateService(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.services.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.services() });
      toast.success('تم تحديث الخدمة بنجاح');
    },
    onError: (error) => {
      toast.error('فشل تحديث الخدمة', {
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

  return useMutation<void, ApiError, number>({
    mutationFn: categoriesApi.deleteService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.services.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.lookups.services() });
      toast.success('تم حذف الخدمة بنجاح');
    },
    onError: (error) => {
      toast.error('فشل حذف الخدمة', {
        description: error.message,
      });
    },
  });
};
