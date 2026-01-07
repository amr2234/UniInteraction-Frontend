import { apiRequest } from "@/core/lib/apiClient";
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
  RequestStatusCount,
  MonthlyStatistics,
  RequestTypeDistribution,
} from "@/core/types/api";

// Generic helper function to build query parameters from any object
const buildQueryParams = (params: Record<string, any>): URLSearchParams => {
  const urlParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    // Skip null, undefined, or empty string values
    if (value !== null && value !== undefined && value !== '') {
      urlParams.append(key, value.toString());
    }
  });

  return urlParams;
};

// Helper function to build request query parameters from filters
const buildRequestQueryParams = (
  filters?: RequestFilters,
  enablePagination: boolean = true
): URLSearchParams => {
  const params: Record<string, any> = {
    enablePagination,
  };

  if (filters) {
    Object.assign(params, filters);
  }

  return buildQueryParams(params);
};

export const requestsApi = {
  createRequest: async (
    payload: CreateRequestPayload,
    files?: File[]
  ): Promise<UserRequestDto> => {
    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    // Add files if present
    if (files && files.length > 0) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }

    return apiRequest.uploadFile<UserRequestDto>("/requests", formData);
  },

  getUserRequests: async (
    filters?: RequestFilters,
  ): Promise<UserRequestDto[] | PaginatedResponse<UserRequestDto>> => {
    const params = buildRequestQueryParams(filters, filters?.enablePagination);
    return apiRequest.get<UserRequestDto[] | PaginatedResponse<UserRequestDto>>(`/requests?${params.toString()}`);
  },

  getRequestById: async (id: number | string): Promise<UserRequestDto> => {
    return apiRequest.get<UserRequestDto>(`/requests/${id}`);
  },

  updateRequestStatus: async (
    id: number | string,
    payload: UpdateRequestStatusPayload
  ): Promise<UserRequestDto> => {
    const result = await apiRequest.put<Result<UserRequestDto>>(
      `/requests/${id}/status`,
      payload
    );

    if ("isSuccess" in result && "value" in result) {
      if (result.isSuccess && result.value) {
        return result.value;
      }

      if (result.value) {
        return result.value;
      }
      throw new Error(result.message || "Failed to update request status");
    }

    if (
      result &&
      typeof result === "object" &&
      "id" in result &&
      "requestNumber" in result
    ) {
      return result as any as UserRequestDto;
    }

    throw new Error("Unexpected response structure from API");
  },

  uploadRequestAttachment: async (
    id: number | string,
    file: File
  ): Promise<RequestAttachment> => {
    const formData = new FormData();
    formData.append("file", file);

    return apiRequest.uploadFile<RequestAttachment>(
      `/requests/${id}/attachments`,
      formData
    );
  },

  uploadRequestAttachments: async (
    id: number | string,
    files: File[]
  ): Promise<RequestAttachment[]> => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    return apiRequest.uploadFile<RequestAttachment[]>(
      `/requests/${id}/attachments`,
      formData
    );
  },

  getRequestAttachments: async (
    id: number | string
  ): Promise<RequestAttachment[]> => {
    return apiRequest.get<RequestAttachment[]>(`/requests/${id}/attachments`);
  },

  deleteRequestAttachment: async (
    requestId: number | string,
    attachmentId: number
  ): Promise<void> => {
    return apiRequest.delete<void>(
      `/requests/${requestId}/attachments/${attachmentId}`
    );
  },

  assignDepartment: async (
    requestId: number | string,
    departmentId: number | null
  ): Promise<UserRequestDto> => {
    return apiRequest.put<UserRequestDto>(
      `/requests/${requestId}/assign-department`,
      { departmentId }
    );
  },

  submitResolution: async (
    requestId: number | string,
    payload: SubmitResolutionPayload
  ): Promise<UserRequestDto> => {
    const formData = new FormData();
    formData.append("resolutionDetailsAr", payload.resolutionDetailsAr);
    if (payload.resolutionDetailsEn) {
      formData.append("resolutionDetailsEn", payload.resolutionDetailsEn);
    }
    if (payload.attachments) {
      payload.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    return apiRequest.uploadFile<UserRequestDto>(
      `/requests/${requestId}/resolution`,
      formData
    );
  },

  assignVisit: async (
    requestId: number | string,
    payload: AssignVisitPayload
  ): Promise<UserRequestDto> => {
    return apiRequest.put<UserRequestDto>(
      `/requests/${requestId}/assign-visit`,
      payload
    );
  },

  acceptVisit: async (requestId: number | string): Promise<UserRequestDto> => {
    return apiRequest.put<UserRequestDto>(
      `/requests/${requestId}/accept-visit`,
      {}
    );
  },

  declineVisit: async (requestId: number | string): Promise<UserRequestDto> => {
    return apiRequest.put<UserRequestDto>(
      `/requests/${requestId}/decline-visit`,
      {}
    );
  },

  submitRating: async (
    requestId: number | string,
    payload: SubmitRatingPayload
  ): Promise<UserRequestDto> => {
    return apiRequest.put<UserRequestDto>(
      `/requests/${requestId}/rating`,
      payload
    );
  },

  downloadAttachment: async (attachmentId: number): Promise<Blob> => {
    return apiRequest.get<Blob>(`/attachments/${attachmentId}/download`, {
      responseType: "blob",
    });
  },

  scheduleVisit: async (
    payload: ScheduleVisitPayload
  ): Promise<UserRequestDto> => {
    return apiRequest.post<UserRequestDto>("/visits/schedule", payload);
  },

  updateVisitStatus: async (
    visitId: number,
    payload: UpdateVisitStatusPayload
  ): Promise<UserRequestDto> => {
    return apiRequest.put<UserRequestDto>(`/visits/${visitId}/status`, payload);
  },

  submitRatingNew: async (
    payload: SubmitRatingPayload & { userRequestId: number }
  ): Promise<UserRequestDto> => {
    return apiRequest.post<UserRequestDto>("/ratings", payload);
  },

  // Delete request (Super Admin only)
  deleteRequest: async (requestId: number | string): Promise<void> => {
    return apiRequest.delete<void>(`/requests/${requestId}`);
  },

  // Assign request to current user (Employee)
  assignToMe: async (requestId: number | string): Promise<UserRequestDto> => {
    return apiRequest.put<UserRequestDto>(
      `/requests/${requestId}/assign-to-user`,
      {}
    );
  },

  // Get request counts by status
  getCountsByStatus: async (): Promise<RequestStatusCount[]> => {
    return apiRequest.get<RequestStatusCount[]>("/requests/counts-by-status");
  },

  // Assign related request (link visit to complaint)
  assignRelatedRequest: async (
    requestId: number | string,
    relatedRequestId: number | null
  ): Promise<UserRequestDto> => {
    return apiRequest.put<UserRequestDto>(
      `/requests/${requestId}/assign-related-request`,
      { relatedRequestId }
    );
  },

  getMonthlyStatistics: async (months: number = 6): Promise<MonthlyStatistics[]> => {
    return apiRequest.get<MonthlyStatistics[]>(`/requests/statistics/monthly?months=${months}`);
  },

  getRequestTypesDistribution: async (): Promise<RequestTypeDistribution[]> => {
    return apiRequest.get<RequestTypeDistribution[]>("/requests/statistics/types-distribution");
  },
};
