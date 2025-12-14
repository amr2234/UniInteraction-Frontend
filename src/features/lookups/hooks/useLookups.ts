import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { lookupsApi } from '../api/lookups.api';
import { queryKeys } from '@/core/lib/queryKeys';
import {
  RequestTypeDto,
  RequestStatusDto,
  MainCategoryDto,
  SubCategoryDto,
  ServiceDto,
  UniversityLeadershipDto,
  ApiError,
} from '@/core/types/api';

// ============================================
// Lookup Hooks - Cached for performance
// ============================================

/**
 * Hook to get all request types
 * Cached for 1 hour
 */
export const useRequestTypes = () => {
  return useQuery<RequestTypeDto[], ApiError>({
    queryKey: queryKeys.lookups.requestTypes,
    queryFn: lookupsApi.getRequestTypes,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours (formerly cacheTime)
  });
};

/**
 * Hook to get all request statuses
 * Cached for 1 hour
 */
export const useRequestStatuses = () => {
  return useQuery<RequestStatusDto[], ApiError>({
    queryKey: queryKeys.lookups.requestStatuses,
    queryFn: lookupsApi.getRequestStatuses,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
  });
};

/**
 * Hook to get all main categories
 * Cached for 30 minutes
 */
export const useMainCategories = () => {  
  return useQuery<MainCategoryDto[], ApiError>({
    queryKey: queryKeys.lookups.mainCategories,
    queryFn: lookupsApi.getMainCategories,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
    retry: 2,
  });
};

/**
 * Hook to get subcategories (optionally filtered by main category)
 * Cached for 30 minutes
 */
export const useSubCategories = (mainCategoryId?: number) => {
  return useQuery<SubCategoryDto[], ApiError>({
    queryKey: queryKeys.lookups.subCategories(mainCategoryId),
    queryFn: () => lookupsApi.getSubCategories(mainCategoryId),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Hook to get services (optionally filtered by subcategory)
 * Cached for 30 minutes
 */
export const useServices = (subCategoryId?: number) => {
  return useQuery<ServiceDto[], ApiError>({
    queryKey: queryKeys.lookups.services(subCategoryId),
    queryFn: () => lookupsApi.getServices(subCategoryId),
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};

/**
 * Hook to get university leadership members
 * Cached for 1 hour
 */
export const useLeadershipLookup = () => {
  return useQuery<UniversityLeadershipDto[], ApiError>({
    queryKey: queryKeys.lookups.leadership,
    queryFn: lookupsApi.getUniversityLeaderships,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 2 * 60 * 60 * 1000, // 2 hours
    retry: 2,
  });
};

/**
 * Hook to get all departments
 * Cached for 30 minutes
 */
export const useDepartmentsLookup = () => {
  return useQuery<{ id: number; nameAr: string; nameEn?: string }[], ApiError>({
    queryKey: ['lookups', 'departments'],
    queryFn: lookupsApi.getDepartments,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
};
