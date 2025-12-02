import { apiRequest } from '@/core/lib/apiClient';
import { FaqDto, CreateFaqPayload, UpdateFaqPayload } from '@/core/types/api';

// ============================================
// FAQs API Functions
// ============================================

export const faqsApi = {
  /**
   * Get all FAQs
   */
  getFaqs: async (): Promise<FaqDto[]> => {
    return apiRequest.get<FaqDto[]>('/faqs');
  },

  /**
   * Get FAQ by ID
   */
  getFaqById: async (id: number): Promise<FaqDto> => {
    return apiRequest.get<FaqDto>(`/faqs/${id}`);
  },

  /**
   * Create a new FAQ (Admin only)
   */
  createFaq: async (payload: CreateFaqPayload): Promise<FaqDto> => {
    return apiRequest.post<FaqDto>('/faqs', payload);
  },

  /**
   * Update an existing FAQ (Admin only)
   */
  updateFaq: async (id: number, payload: UpdateFaqPayload): Promise<FaqDto> => {
    return apiRequest.put<FaqDto>(`/faqs/${id}`, payload);
  },

  /**
   * Delete a FAQ (Admin only)
   */
  deleteFaq: async (id: number): Promise<void> => {
    return apiRequest.delete<void>(`/faqs/${id}`);
  },

  /**
   * Reorder FAQs (Admin only)
   */
  reorderFaqs: async (orderedIds: number[]): Promise<void> => {
    return apiRequest.put<void>('/faqs/reorder', { orderedIds });
  },
};
