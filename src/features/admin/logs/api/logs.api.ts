import { BaseApi } from '@/core/lib/baseApi';
import { SystemLogDto, LogFilters, Result } from "../types/logs.types";

class LogsApi extends BaseApi<SystemLogDto> {
  constructor() {
    super('/SystemLogs');
  }

  async getLogs(filters: LogFilters): Promise<Result<SystemLogDto[]>> {
    const params = new URLSearchParams();

    if (filters.level) params.append("level", filters.level);
    if (filters.category) params.append("category", filters.category);
    if (filters.fromDate) params.append("fromDate", filters.fromDate);
    if (filters.toDate) params.append("toDate", filters.toDate);
    if (filters.userId != null) params.append("userId", filters.userId.toString());
    if (filters.entityType) params.append("entityType", filters.entityType);
    if (filters.entityId != null) params.append("entityId", filters.entityId.toString());
    if (filters.searchTerm) params.append("searchTerm", filters.searchTerm);
    params.append("pageNumber", (filters.pageNumber ?? 1).toString());
    params.append("pageSize", (filters.pageSize ?? 20).toString());

    const queryString = params.toString();

    try {
      const data = await this.customGet<SystemLogDto[]>(`?${queryString}`);
      
      return {
        success: true,
        message: `Retrieved ${data.length} logs`,
        data: data,
        errors: [],
      };
    } catch (error: any) {
      return {
        success: false,
        message: error?.message || "Failed to fetch logs",
        data: null,
        errors: [error?.message || "Unknown error"],
      };
    }
  }

  async exportLogs(filters: LogFilters, format: "csv" | "excel" | "pdf"): Promise<Blob> {
    const params = new URLSearchParams();

    if (filters.level) params.append("level", filters.level);
    if (filters.category) params.append("category", filters.category);
    if (filters.fromDate) params.append("fromDate", filters.fromDate);
    if (filters.toDate) params.append("toDate", filters.toDate);
    if (filters.userId != null) params.append("userId", filters.userId.toString());
    if (filters.entityType) params.append("entityType", filters.entityType);
    if (filters.entityId != null) params.append("entityId", filters.entityId.toString());
    if (filters.searchTerm) params.append("searchTerm", filters.searchTerm);
    params.append("format", format);

    const queryString = params.toString();
    return this.customGet<Blob>(`/export?${queryString}`);
  }
}

const logsApiInstance = new LogsApi();

export const logsApi = {
  getLogs: (filters: LogFilters) => logsApiInstance.getLogs(filters),
  exportLogs: (filters: LogFilters, format: "csv" | "excel" | "pdf") => 
    logsApiInstance.exportLogs(filters, format),
};
