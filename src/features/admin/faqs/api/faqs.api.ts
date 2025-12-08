import { apiRequest } from '@/core/lib/apiClient';
import { FaqDto, CreateFaqPayload, UpdateFaqPayload, PaginatedResponse } from '@/core/types/api';
import type { FaqFilters } from '../types/faq.types';

// Re-export types for backward compatibility
export type { FaqFilters };

// ============================================
// FAQs API Functions (Admin)
// ============================================

export const faqsApi = {
  /**
   * Get all FAQs with pagination and filters
   * GET /api/faqs/pagination
   */
  getFaqs: async (filters?: FaqFilters): Promise<PaginatedResponse<FaqDto>> => {
    const params = new URLSearchParams();
    
    if (filters?.searchTerm) params.append('search', filters.searchTerm);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.categoryId) params.append('categoryId', filters.categoryId.toString());
    if (filters?.pageNumber) params.append('page', filters.pageNumber.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.sortOrder === 'desc') params.append('isDesc', 'true');

    const queryString = params.toString();
    return apiRequest.get<PaginatedResponse<FaqDto>>(
      `/faqs/pagination${queryString ? `?${queryString}` : ''}`
    );
  },

  /**
   * Get all FAQs (without pagination) - for public FAQ page
   * GET /api/faqs
   */
  getAllFaqs: async (): Promise<FaqDto[]> => {
    return apiRequest.get<FaqDto[]>('/faqs');
  },

  /**
   * Get FAQ by ID
   * GET /api/faqs/{id}
   */
  getFaqById: async (id: number): Promise<FaqDto> => {
    return apiRequest.get<FaqDto>(`/faqs/${id}`);
  },

  /**
   * Create a new FAQ (Admin only)
   * POST /api/faqs
   */
  createFaq: async (payload: CreateFaqPayload): Promise<FaqDto> => {
    return apiRequest.post<FaqDto>('/faqs', payload);
  },

  /**
   * Update an existing FAQ (Admin only)
   * PUT /api/faqs/{id}
   */
  updateFaq: async (id: number, payload: UpdateFaqPayload): Promise<FaqDto> => {
    return apiRequest.put<FaqDto>(`/faqs/${id}`, payload);
  },

  /**
   * Delete a FAQ (Admin only)
   * DELETE /api/faqs/{id}
   */
  deleteFaq: async (id: number): Promise<void> => {
    return apiRequest.delete<void>(`/faqs/${id}`);
  },

  /**
   * Toggle FAQ active status
   * PATCH /api/faqs/{id}/status
   */
  toggleFaqStatus: async (payload: {
    id: number;
    isActive: boolean;
  }): Promise<FaqDto> => {
    return apiRequest.patch<FaqDto>(`/faqs/${payload.id}/status`, {
      isActive: payload.isActive,
    });
  },

  /**
   * Reorder FAQs (Admin only)
   * PUT /api/faqs/reorder
   */
  reorderFaqs: async (orderedIds: number[]): Promise<void> => {
    return apiRequest.put<void>('/faqs/reorder', { orderedIds });
  },
};
