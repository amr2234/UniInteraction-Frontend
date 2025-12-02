import { apiRequest } from '@/core/lib/apiClient';
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
} from '@/core/types/api';

// ============================================
// Categories API Functions (Admin)
// ============================================

export const categoriesApi = {
  // ========== Main Categories ==========
  /**
   * Get all main categories (Admin)
   */
  getMainCategories: async (): Promise<MainCategoryDto[]> => {
    return apiRequest.get<MainCategoryDto[]>('/categories/main');
  },

  /**
   * Get main category by ID
   */
  getMainCategoryById: async (id: number): Promise<MainCategoryDto> => {
    return apiRequest.get<MainCategoryDto>(`/categories/main/${id}`);
  },

  /**
   * Create a new main category
   */
  createMainCategory: async (payload: CreateMainCategoryPayload): Promise<MainCategoryDto> => {
    return apiRequest.post<MainCategoryDto>('/categories/main', payload);
  },

  /**
   * Update a main category
   */
  updateMainCategory: async (
    id: number,
    payload: UpdateMainCategoryPayload
  ): Promise<MainCategoryDto> => {
    return apiRequest.put<MainCategoryDto>(`/categories/main/${id}`, payload);
  },

  /**
   * Delete a main category
   */
  deleteMainCategory: async (id: number): Promise<void> => {
    return apiRequest.delete<void>(`/categories/main/${id}`);
  },

  // ========== Sub Categories ==========
  /**
   * Get all subcategories (Admin)
   */
  getSubCategories: async (mainCategoryId?: number): Promise<SubCategoryDto[]> => {
    const url = mainCategoryId
      ? `/categories/sub?mainCategoryId=${mainCategoryId}`
      : '/categories/sub';
    return apiRequest.get<SubCategoryDto[]>(url);
  },

  /**
   * Get subcategory by ID
   */
  getSubCategoryById: async (id: number): Promise<SubCategoryDto> => {
    return apiRequest.get<SubCategoryDto>(`/categories/sub/${id}`);
  },

  /**
   * Create a new subcategory
   */
  createSubCategory: async (payload: CreateSubCategoryPayload): Promise<SubCategoryDto> => {
    return apiRequest.post<SubCategoryDto>('/categories/sub', payload);
  },

  /**
   * Update a subcategory
   */
  updateSubCategory: async (
    id: number,
    payload: UpdateSubCategoryPayload
  ): Promise<SubCategoryDto> => {
    return apiRequest.put<SubCategoryDto>(`/categories/sub/${id}`, payload);
  },

  /**
   * Delete a subcategory
   */
  deleteSubCategory: async (id: number): Promise<void> => {
    return apiRequest.delete<void>(`/categories/sub/${id}`);
  },

  // ========== Services ==========
  /**
   * Get all services (Admin)
   */
  getServices: async (subCategoryId?: number): Promise<ServiceDto[]> => {
    const url = subCategoryId
      ? `/categories/services?subCategoryId=${subCategoryId}`
      : '/categories/services';
    return apiRequest.get<ServiceDto[]>(url);
  },

  /**
   * Get service by ID
   */
  getServiceById: async (id: number): Promise<ServiceDto> => {
    return apiRequest.get<ServiceDto>(`/categories/services/${id}`);
  },

  /**
   * Create a new service
   */
  createService: async (payload: CreateServicePayload): Promise<ServiceDto> => {
    return apiRequest.post<ServiceDto>('/categories/services', payload);
  },

  /**
   * Update a service
   */
  updateService: async (id: number, payload: UpdateServicePayload): Promise<ServiceDto> => {
    return apiRequest.put<ServiceDto>(`/categories/services/${id}`, payload);
  },

  /**
   * Delete a service
   */
  deleteService: async (id: number): Promise<void> => {
    return apiRequest.delete<void>(`/categories/services/${id}`);
  },
};
