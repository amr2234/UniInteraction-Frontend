import { BaseApi } from '@/core/lib/baseApi';
import {
  ScheduleVisitPayload,
  UpdateVisitStatusPayload,
  VisitDto,
  UserRequestDto,
} from '@/core/types/api';

class VisitsApi extends BaseApi<VisitDto> {
  constructor() {
    super('/visits');
  }

  async scheduleVisit(payload: ScheduleVisitPayload): Promise<UserRequestDto> {
    return this.customPost<UserRequestDto>('/schedule', payload);
  }

  async updateVisitStatus(visitId: number, payload: UpdateVisitStatusPayload): Promise<UserRequestDto> {
    return this.customPut<UserRequestDto>(`/${visitId}/status`, payload);
  }

  async getVisitById(visitId: number): Promise<VisitDto> {
    return this.getById(visitId);
  }

  async getAllVisits(leadershipId?: number): Promise<VisitDto[]> {
    const params = new URLSearchParams();
    if (leadershipId) {
      params.append('leadershipId', leadershipId.toString());
    }
    const queryString = params.toString();
    return this.customGet<VisitDto[]>(queryString ? `?${queryString}` : '');
  }

  async getVisitsByLeadership(leadershipId: number): Promise<VisitDto[]> {
    return this.customGet<VisitDto[]>(`?leadershipId=${leadershipId}`);
  }

  async getVisitsByRequest(requestId: number): Promise<VisitDto[]> {
    return this.customGet<VisitDto[]>(`/request/${requestId}`);
  }

  async updateVisit(payload: ScheduleVisitPayload): Promise<VisitDto> {
    return this.customPut<VisitDto>(`/${payload.visitId}`, payload);
  }
}

const visitsApiInstance = new VisitsApi();

export const visitsApi = {
  scheduleVisit: (payload: ScheduleVisitPayload) => visitsApiInstance.scheduleVisit(payload),
  updateVisitStatus: (visitId: number, payload: UpdateVisitStatusPayload) => 
    visitsApiInstance.updateVisitStatus(visitId, payload),
  getVisitById: (visitId: number) => visitsApiInstance.getVisitById(visitId),
  getAllVisits: (leadershipId?: number) => visitsApiInstance.getAllVisits(leadershipId),
  getVisitsByLeadership: (leadershipId: number) => visitsApiInstance.getVisitsByLeadership(leadershipId),
  getVisitsByRequest: (requestId: number) => visitsApiInstance.getVisitsByRequest(requestId),
  updateVisit: (payload: ScheduleVisitPayload) => visitsApiInstance.updateVisit(payload),
};
