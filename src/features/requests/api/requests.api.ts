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
} from "@/core/types/api";

export const requestsApi = {
  createRequest: async (
    payload: CreateRequestPayload,
    files?: File[]
  ): Promise<UserRequestDto> => {
    if (files && files.length > 0) {
      const formData = new FormData();

      Object.keys(payload).forEach((key) => {
        const value = payload[key as keyof CreateRequestPayload];
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });

      files.forEach((file) => {
        formData.append("files", file);
      });

      return apiRequest.uploadFile<UserRequestDto>("/requests", formData);
    }
    return apiRequest.post<UserRequestDto>("/requests", payload);
  },

  getUserRequests: async (
    filters?: RequestFilters
  ): Promise<UserRequestDto[]> => {
    const params = new URLSearchParams();

    if (filters?.requestStatusId)
      params.append("requestStatusId", filters.requestStatusId.toString());
    if (filters?.requestTypeId)
      params.append("requestTypeId", filters.requestTypeId.toString());
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    if (filters?.searchTerm) params.append("searchTerm", filters.searchTerm);
    if (filters?.departmentId)
      params.append("departmentId", filters.departmentId.toString());
    if (filters?.universityLeadershipId)
      params.append(
        "universityLeadershipId",
        filters.universityLeadershipId.toString()
      );

    const queryString = params.toString();
    const url = queryString ? `/requests?${queryString}` : "/requests";

    return apiRequest.get<UserRequestDto[]>(url);
  },

  getUserRequestsPaginated: async (
    filters?: RequestFilters,
    pageNumber = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<UserRequestDto>> => {
    const params = new URLSearchParams({
      pageNumber: pageNumber.toString(),
      pageSize: pageSize.toString(),
    });

    if (filters?.requestStatusId)
      params.append("requestStatusId", filters.requestStatusId.toString());
    if (filters?.requestTypeId)
      params.append("requestTypeId", filters.requestTypeId.toString());
    if (filters?.startDate) params.append("startDate", filters.startDate);
    if (filters?.endDate) params.append("endDate", filters.endDate);
    if (filters?.searchTerm) params.append("searchTerm", filters.searchTerm);
    if (filters?.departmentId)
      params.append("departmentId", filters.departmentId.toString());
    if (filters?.universityLeadershipId)
      params.append(
        "universityLeadershipId",
        filters.universityLeadershipId.toString()
      );

    return apiRequest.get<PaginatedResponse<UserRequestDto>>(
      `/requests?${params.toString()}`
    );
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
    departmentId: number
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
};
