import { BaseApi } from '@/core/lib/baseApi';
import { PaginatedResponse } from '@/core/types/api';
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
import type { MainCategoryFilters, SubCategoryFilters } from '../types/category.types';
export type { MainCategoryFilters, SubCategoryFilters };

class MainCategoriesApi extends BaseApi<
  MainCategoryDto,
  CreateMainCategoryPayload,
  UpdateMainCategoryPayload,
  MainCategoryFilters
> {
  constructor() {
    super('/categories/main');
  }

  async getAll(filters?: MainCategoryFilters): Promise<PaginatedResponse<MainCategoryDto>> {
    const params = new URLSearchParams();

    if (filters?.searchTerm) params.append('search', filters.searchTerm);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.pageNumber) params.append('page', filters.pageNumber.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.sortOrder === 'desc') params.append('isDesc', 'true');

    const queryString = params.toString();
    return this.customGet<PaginatedResponse<MainCategoryDto>>(`/pagination${queryString ? `?${queryString}` : ''}`);
  }
}

class SubCategoriesApi extends BaseApi<
  SubCategoryDto,
  CreateSubCategoryPayload,
  UpdateSubCategoryPayload,
  SubCategoryFilters
> {
  constructor() {
    super('/categories/sub');
  }

  async getByMainCategory(mainCategoryId: number): Promise<SubCategoryDto[]> {
    return this.customGet<SubCategoryDto[]>(`?mainCategoryId=${mainCategoryId}`);
  }
}

class ServicesApi extends BaseApi<
  ServiceDto,
  CreateServicePayload,
  UpdateServicePayload
> {
  constructor() {
    super('/categories/services');
  }

  async getBySubCategory(subCategoryId: number): Promise<ServiceDto[]> {
    return this.customGet<ServiceDto[]>(`?subCategoryId=${subCategoryId}`);
  }
}

const mainCategoriesApi = new MainCategoriesApi();
const subCategoriesApi = new SubCategoriesApi();
const servicesApi = new ServicesApi();

export const categoriesApi = {
  getMainCategories: (filters?: MainCategoryFilters) => mainCategoriesApi.getAll(filters),
  getAllMainCategories: () => mainCategoriesApi.getList(),
  getMainCategoryById: (id: number) => mainCategoriesApi.getById(id),
  createMainCategory: (payload: CreateMainCategoryPayload) => mainCategoriesApi.create(payload),
  updateMainCategory: (id: number, payload: UpdateMainCategoryPayload) => mainCategoriesApi.update(id, payload),
  deleteMainCategory: (id: number) => mainCategoriesApi.delete(id),
  toggleMainCategoryStatus: (payload: { id: number; isActive: boolean }) => 
    mainCategoriesApi.toggleStatus(payload.id, payload.isActive),

  getSubCategories: (mainCategoryId?: number) => 
    mainCategoryId ? subCategoriesApi.getByMainCategory(mainCategoryId) : subCategoriesApi.getList(),
  getSubCategoryById: (id: number) => subCategoriesApi.getById(id),
  createSubCategory: (payload: CreateSubCategoryPayload) => subCategoriesApi.create(payload),
  updateSubCategory: (id: number, payload: UpdateSubCategoryPayload) => subCategoriesApi.update(id, payload),
  deleteSubCategory: (id: number) => subCategoriesApi.delete(id),

};
