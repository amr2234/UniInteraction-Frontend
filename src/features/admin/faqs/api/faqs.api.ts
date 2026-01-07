import { BaseApi } from '@/core/lib/baseApi';
import { FaqDto, CreateFaqPayload, UpdateFaqPayload, PaginatedResponse } from '@/core/types/api';
import type { FaqFilters } from '../types/faq.types';

export type { FaqFilters };

class FaqsApi extends BaseApi<
  FaqDto,
  CreateFaqPayload,
  UpdateFaqPayload,
  FaqFilters
> {
  constructor() {
    super('/faqs');
  }

  async getAll(filters?: FaqFilters): Promise<PaginatedResponse<FaqDto>> {
    const params = new URLSearchParams();
    
    if (filters?.searchTerm) params.append('search', filters.searchTerm);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());
    if (filters?.pageNumber) params.append('page', filters.pageNumber.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.sortOrder === 'desc') params.append('isDesc', 'true');

    const queryString = params.toString();
    return this.customGet<PaginatedResponse<FaqDto>>(`/pagination${queryString ? `?${queryString}` : ''}`);
  }

  async reorderFaqs(orderedIds: number[]): Promise<void> {
    return this.customPut<void>('/reorder', { orderedIds });
  }
}

const faqsApiInstance = new FaqsApi();

export const faqsApi = {
  getFaqs: (filters?: FaqFilters) => faqsApiInstance.getAll(filters),
  getAllFaqs: () => faqsApiInstance.getList(),
  getFaqById: (id: number) => faqsApiInstance.getById(id),
  createFaq: (payload: CreateFaqPayload) => faqsApiInstance.create(payload),
  updateFaq: (id: number, payload: UpdateFaqPayload) => faqsApiInstance.update(id, payload),
  deleteFaq: (id: number) => faqsApiInstance.delete(id),
  toggleFaqStatus: (payload: { id: number; isActive: boolean }) => 
    faqsApiInstance.toggleStatus(payload.id, payload.isActive),
  reorderFaqs: (orderedIds: number[]) => faqsApiInstance.reorderFaqs(orderedIds),
};
