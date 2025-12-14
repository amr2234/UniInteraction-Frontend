import { apiRequest } from '@/core/lib/apiClient';
import {
  RequestTypeDto,
  RequestStatusDto,
  MainCategoryDto,
  SubCategoryDto,
  ServiceDto,
  UniversityLeadershipDto,
} from '@/core/types/api';

// ============================================
// Lookups API Functions
// ============================================

export const lookupsApi = {
  /**
   * Get all request types
   */
  getRequestTypes: async (): Promise<RequestTypeDto[]> => {
    return apiRequest.get<RequestTypeDto[]>('/lookups/request-types');
  },

  /**
   * Get all request statuses
   */
  getRequestStatuses: async (): Promise<RequestStatusDto[]> => {
    return apiRequest.get<RequestStatusDto[]>('/lookups/request-statuses');
  },

  /**
   * Get all main categories
   */
  getMainCategories: async (): Promise<MainCategoryDto[]> => {
    const response = await apiRequest.get<any>('/lookups/main-categories');
    // Handle paginated response with items array
    if (response?.items && Array.isArray(response.items)) {
      return response.items;
    }
    // Handle if response is a direct array
    if (Array.isArray(response)) {
      return response;
    }
    // Fallback to empty array
    return [];
  },

  /**
   * Get subcategories (optionally filtered by main category)
   */
  getSubCategories: async (mainCategoryId?: number): Promise<SubCategoryDto[]> => {
    const url = mainCategoryId 
      ? `/lookups/sub-categories?mainCategoryId=${mainCategoryId}`
      : '/lookups/sub-categories';
    const response = await apiRequest.get<any>(url);
    // Handle paginated response with items array
    if (response?.items && Array.isArray(response.items)) {
      return response.items;
    }
    // Handle if response is a direct array
    if (Array.isArray(response)) {
      return response;
    }
    // Fallback to empty array
    return [];
  },

  /**
   * Get services (optionally filtered by subcategory)
   */
  getServices: async (subCategoryId?: number): Promise<ServiceDto[]> => {
    const url = subCategoryId
      ? `/lookups/services?subCategoryId=${subCategoryId}`
      : '/lookups/services';
    const response = await apiRequest.get<any>(url);
    // Handle paginated response with items array
    if (response?.items && Array.isArray(response.items)) {
      return response.items;
    }
    // Handle if response is a direct array
    if (Array.isArray(response)) {
      return response;
    }
    // Fallback to empty array
    return [];
  },

  /**
   * Get university leadership members
   */
  getUniversityLeaderships: async (): Promise<UniversityLeadershipDto[]> => {
    const response = await apiRequest.get<any>('/lookups/university-leaderships');
    // Handle paginated response with items array
    if (response?.items && Array.isArray(response.items)) {
      return response.items;
    }
    // Handle if response is a direct array
    if (Array.isArray(response)) {
      return response;
    }
    // Fallback to empty array
    return [];
  },

  /**
   * Get all departments
   */
  getDepartments: async (): Promise<{ id: number; nameAr: string; nameEn?: string }[]> => {
    const response = await apiRequest.get<any>('/lookups/departments');
    // Handle paginated response with items array
    if (response?.items && Array.isArray(response.items)) {
      return response.items;
    }
    // Handle if response is a direct array
    if (Array.isArray(response)) {
      return response;
    }
    // Fallback to empty array
    return [];
  },
};
