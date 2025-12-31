import { BaseApi } from '@/core/lib/baseApi';
import {
  RequestTypeDto,
  RequestStatusDto,
  MainCategoryDto,
  SubCategoryDto,
  ServiceDto,
  UniversityLeadershipDto,
} from '@/core/types/api';

const handleArrayResponse = <T>(response: any): T[] => {
  if (response?.items && Array.isArray(response.items)) {
    return response.items;
  }
  if (Array.isArray(response)) {
    return response;
  }
  return [];
};

class LookupsApi extends BaseApi<any> {
  constructor() {
    super('/lookups');
  }

  async getRequestTypes(): Promise<RequestTypeDto[]> {
    return this.customGet<RequestTypeDto[]>('/request-types');
  }

  async getRequestStatuses(): Promise<RequestStatusDto[]> {
    return this.customGet<RequestStatusDto[]>('/request-statuses');
  }

  async getMainCategories(): Promise<MainCategoryDto[]> {
    const response = await this.customGet<any>('/main-categories');
    return handleArrayResponse<MainCategoryDto>(response);
  }

  async getSubCategories(mainCategoryId?: number): Promise<SubCategoryDto[]> {
    const endpoint = mainCategoryId 
      ? `/sub-categories?mainCategoryId=${mainCategoryId}`
      : '/sub-categories';
    const response = await this.customGet<any>(endpoint);
    return handleArrayResponse<SubCategoryDto>(response);
  }

  async getServices(subCategoryId?: number): Promise<ServiceDto[]> {
    const endpoint = subCategoryId
      ? `/services?subCategoryId=${subCategoryId}`
      : '/services';
    const response = await this.customGet<any>(endpoint);
    return handleArrayResponse<ServiceDto>(response);
  }

  async getUniversityLeaderships(): Promise<UniversityLeadershipDto[]> {
    const response = await this.customGet<any>('/university-leaderships');
    return handleArrayResponse<UniversityLeadershipDto>(response);
  }

  async getDepartments(): Promise<{ id: number; nameAr: string; nameEn?: string }[]> {
    const response = await this.customGet<any>('/departments');
    return handleArrayResponse<{ id: number; nameAr: string; nameEn?: string }>(response);
  }
}

const lookupsApiInstance = new LookupsApi();

export const lookupsApi = {
  getRequestTypes: () => lookupsApiInstance.getRequestTypes(),
  getRequestStatuses: () => lookupsApiInstance.getRequestStatuses(),
  getMainCategories: () => lookupsApiInstance.getMainCategories(),
  getSubCategories: (mainCategoryId?: number) => lookupsApiInstance.getSubCategories(mainCategoryId),
  getServices: (subCategoryId?: number) => lookupsApiInstance.getServices(subCategoryId),
  getUniversityLeaderships: () => lookupsApiInstance.getUniversityLeaderships(),
  getDepartments: () => lookupsApiInstance.getDepartments(),
};
