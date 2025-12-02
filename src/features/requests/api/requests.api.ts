import { apiRequest } from '@/core/lib/apiClient';
import {
  CreateRequestPayload,
  UserRequestDto,
  RequestFilters,
  UpdateRequestStatusPayload,
  RequestAttachment,
  PaginatedResponse,
} from '@/core/types/api';

// ============================================
// Requests API Functions
// ============================================

export const requestsApi = {
  /**
   * Create a new request
   */
  createRequest: async (payload: CreateRequestPayload): Promise<UserRequestDto> => {
    return apiRequest.post<UserRequestDto>('/requests', payload);
  },

  /**
   * Get user requests with optional filters
   */
  getUserRequests: async (filters?: RequestFilters): Promise<UserRequestDto[]> => {
    const params = new URLSearchParams();
    
    if (filters?.statusId) params.append('statusId', filters.statusId.toString());
    if (filters?.requestTypeId) params.append('requestTypeId', filters.requestTypeId.toString());
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);

    const queryString = params.toString();
    const url = queryString ? `/requests?${queryString}` : '/requests';
    
    return apiRequest.get<UserRequestDto[]>(url);
  },

  /**
   * Get paginated user requests
   */
  getUserRequestsPaginated: async (
    filters?: RequestFilters,
    pageNumber = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<UserRequestDto>> => {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });
    
    if (filters?.statusId) params.append('statusId', filters.statusId.toString());
    if (filters?.requestTypeId) params.append('requestTypeId', filters.requestTypeId.toString());
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);

    return apiRequest.get<PaginatedResponse<UserRequestDto>>(`/requests?${params.toString()}`);
  },

  /**
   * Get request details by ID or request number
   */
  getRequestById: async (id: number | string): Promise<UserRequestDto> => {
    return apiRequest.get<UserRequestDto>(`/requests/${id}`);
  },

  /**
   * Update request status
   */
  updateRequestStatus: async (
    id: number | string,
    payload: UpdateRequestStatusPayload
  ): Promise<UserRequestDto> => {
    return apiRequest.put<UserRequestDto>(`/requests/${id}/status`, payload);
  },

  /**
   * Upload attachment to a request
   */
  uploadRequestAttachment: async (
    id: number | string,
    file: File
  ): Promise<RequestAttachment> => {
    const formData = new FormData();
    formData.append('file', file);

    return apiRequest.uploadFile<RequestAttachment>(`/requests/${id}/attachments`, formData);
  },

  /**
   * Upload multiple attachments to a request
   */
  uploadRequestAttachments: async (
    id: number | string,
    files: File[]
  ): Promise<RequestAttachment[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    return apiRequest.uploadFile<RequestAttachment[]>(`/requests/${id}/attachments`, formData);
  },

  /**
   * Get all attachments for a request
   */
  getRequestAttachments: async (id: number | string): Promise<RequestAttachment[]> => {
    return apiRequest.get<RequestAttachment[]>(`/requests/${id}/attachments`);
  },

  /**
   * Delete a request attachment
   */
  deleteRequestAttachment: async (
    requestId: number | string,
    attachmentId: number
  ): Promise<void> => {
    return apiRequest.delete<void>(`/requests/${requestId}/attachments/${attachmentId}`);
  },
};
