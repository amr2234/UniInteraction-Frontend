import { apiRequest } from '@/core/lib/apiClient';
import {
  CreateRequestPayload,
  UserRequestDto,
  RequestFilters,
  UpdateRequestStatusPayload,
  RequestAttachment,
  PaginatedResponse,
  SubmitResolutionPayload,
  AssignVisitPayload,
  ScheduleVisitPayload,
  UpdateVisitStatusPayload,
  SubmitRatingPayload,
  RequestNewVisitDatePayload,
  Result,
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
    
    if (filters?.requestStatusId) params.append('requestStatusId', filters.requestStatusId.toString());
    if (filters?.requestTypeId) params.append('requestTypeId', filters.requestTypeId.toString());
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters?.departmentId) params.append('departmentId', filters.departmentId.toString());
    if (filters?.universityLeadershipId) params.append('universityLeadershipId', filters.universityLeadershipId.toString());

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
    
    if (filters?.requestStatusId) params.append('requestStatusId', filters.requestStatusId.toString());
    if (filters?.requestTypeId) params.append('requestTypeId', filters.requestTypeId.toString());
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.searchTerm) params.append('searchTerm', filters.searchTerm);
    if (filters?.departmentId) params.append('departmentId', filters.departmentId.toString());
    if (filters?.universityLeadershipId) params.append('universityLeadershipId', filters.universityLeadershipId.toString());

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
    const result = await apiRequest.put<Result<UserRequestDto>>(`/requests/${id}/status`, payload);
    
    // Handle Result<T> wrapper
    if ('isSuccess' in result && 'value' in result) {
      if (result.isSuccess && result.value) {
        return result.value;
      }
      // If isSuccess is false but we got 200, still treat as success if value exists
      if (result.value) {
        return result.value;
      }
      throw new Error(result.message || 'Failed to update request status');
    }
    
    // If response is UserRequestDto directly (no wrapper)
    if (result && typeof result === 'object' && 'id' in result && 'requestNumber' in result) {
      return result as any as UserRequestDto;
    }
    
    throw new Error('Unexpected response structure from API');
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

  /**
   * Assign department to a request
   */
  assignDepartment: async (
    requestId: number | string,
    departmentId: number
  ): Promise<UserRequestDto> => {
    return apiRequest.put<UserRequestDto>(`/requests/${requestId}/assign-department`, { departmentId });
  },

  /**
   * Submit employee resolution/response
   */
  submitResolution: async (
    requestId: number | string,
    payload: SubmitResolutionPayload
  ): Promise<UserRequestDto> => {
    const formData = new FormData();
    formData.append('resolutionDetailsAr', payload.resolutionDetailsAr);
    if (payload.resolutionDetailsEn) {
      formData.append('resolutionDetailsEn', payload.resolutionDetailsEn);
    }
    if (payload.attachments) {
      payload.attachments.forEach((file) => {
        formData.append('attachments', file);
      });
    }

    return apiRequest.uploadFile<UserRequestDto>(`/requests/${requestId}/resolution`, formData);
  },

  /**
   * Assign visit date/time
   */
  assignVisit: async (
    requestId: number | string,
    payload: AssignVisitPayload
  ): Promise<UserRequestDto> => {
    return apiRequest.put<UserRequestDto>(`/requests/${requestId}/assign-visit`, payload);
  },

  /**
   * Accept visit by user
   */
  acceptVisit: async (requestId: number | string): Promise<UserRequestDto> => {
    return apiRequest.put<UserRequestDto>(`/requests/${requestId}/accept-visit`, {});
  },

  /**
   * Decline visit by user
   */
  declineVisit: async (requestId: number | string): Promise<UserRequestDto> => {
    return apiRequest.put<UserRequestDto>(`/requests/${requestId}/decline-visit`, {});
  },

  /**
   * Submit user rating and feedback
   */
  submitRating: async (
    requestId: number | string,
    payload: SubmitRatingPayload
  ): Promise<UserRequestDto> => {
    return apiRequest.put<UserRequestDto>(`/requests/${requestId}/rating`, payload);
  },

  /**
   * Download attachment
   */
  downloadAttachment: async (attachmentId: number): Promise<Blob> => {
    return apiRequest.get<Blob>(`/attachments/${attachmentId}/download`, {
      responseType: 'blob',
    });
  },
  
 
  scheduleVisit: async (payload: ScheduleVisitPayload): Promise<UserRequestDto> => {
    return apiRequest.post<UserRequestDto>('/visits/schedule', payload);
  },

  /**
   * Update visit status (Accept/Reschedule/Complete/Cancel)
   */
  updateVisitStatus: async (visitId: number, payload: UpdateVisitStatusPayload): Promise<UserRequestDto> => {
    return apiRequest.put<UserRequestDto>(`/visits/${visitId}/status`, payload);
  },

  /**
   * Submit rating (new endpoint)
   */
  submitRatingNew: async (payload: SubmitRatingPayload & { userRequestId: number }): Promise<UserRequestDto> => {
    return apiRequest.post<UserRequestDto>('/ratings', payload);
  },
};
