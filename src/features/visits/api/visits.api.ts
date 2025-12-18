import { apiRequest } from '@/core/lib/apiClient';
import {
  ScheduleVisitPayload,
  UpdateVisitStatusPayload,
  VisitDto,
  UserRequestDto,
} from '@/core/types/api';

/**
 * Visits API
 * Handles all visit-related endpoints
 */
export const visitsApi = {
  /**
   * Schedule a visit (Employee sets visit date and leadership)
   * POST /api/Visits/schedule
   */
  scheduleVisit: async (payload: ScheduleVisitPayload): Promise<UserRequestDto> => {
    return apiRequest.post<UserRequestDto>('/visits/schedule', payload);
  },

  /**
   * Update visit status (Accept, Reschedule, Complete, etc.)
   * PUT /api/Visits/{visitId}/status
   */
  updateVisitStatus: async (
    visitId: number,
    payload: UpdateVisitStatusPayload
  ): Promise<UserRequestDto> => {
    return apiRequest.put<UserRequestDto>(`/visits/${visitId}/status`, payload);
  },

  /**
   * Get visit details by ID
   * GET /api/Visits/{visitId}
   */
  getVisitById: async (visitId: number): Promise<VisitDto> => {
    return apiRequest.get<VisitDto>(`/visits/${visitId}`);
  },

  /**
   * Get all visits (for calendar)
   * GET /api/Visits
   */
  getAllVisits: async (leadershipId?: number): Promise<VisitDto[]> => {
    const params = new URLSearchParams();
    if (leadershipId) {
      params.append('leadershipId', leadershipId.toString());
    }
    
    const queryString = params.toString();
    const url = queryString ? `/visits?${queryString}` : '/visits';
    
    return apiRequest.get<VisitDto[]>(url);
  },

  /**
   * Get visits filtered by leadership
   * GET /api/Visits?leadershipId={id}
   */
  getVisitsByLeadership: async (leadershipId: number): Promise<VisitDto[]> => {
    return apiRequest.get<VisitDto[]>(`/visits?leadershipId=${leadershipId}`);
  },

  /**
   * Get visits for a specific request
   * GET /api/Visits/request/{requestId}
   */
  getVisitsByRequest: async (requestId: number): Promise<VisitDto[]> => {
    return apiRequest.get<VisitDto[]>(`/visits/request/${requestId}`);
  },
};
