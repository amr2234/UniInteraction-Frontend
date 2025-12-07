import { apiRequest } from "@/core/lib/apiClient";
import { PaginatedResponse } from "@/core/types/api";
import type {
  UserManagementDto,
  UserDto,
  UserFilters,
  ToggleUserStatusDto,
  ResetPasswordDto,
} from "../types/user.types";

export type {
  UserManagementDto,
  UserDto,
  UserFilters,
  ToggleUserStatusDto,
  ResetPasswordDto,
};

export const usersApi = {
  getUsers: async (
    filters?: UserFilters
  ): Promise<PaginatedResponse<UserManagementDto>> => {
    const params = new URLSearchParams();

    if (filters?.searchTerm) params.append("search", filters.searchTerm);
    if (filters?.roleId !== undefined)
      params.append("roleId", filters.roleId.toString());
    if (filters?.isActive !== undefined)
      params.append("isActive", filters.isActive.toString());
    if (filters?.departmentId) params.append("departmentId", filters.departmentId.toString());
    if (filters?.pageNumber)
      params.append("page", filters.pageNumber.toString());
    if (filters?.pageSize)
      params.append("pageSize", filters.pageSize.toString());
    if (filters?.sortOrder === "desc") params.append("isDesc", "true");

    const queryString = params.toString();
    return apiRequest.get<PaginatedResponse<UserManagementDto>>(
      `/users/pagination${queryString ? `?${queryString}` : ""}`
    );
  },

  getUserById: async (id: number): Promise<UserManagementDto> => {
    return apiRequest.get<UserManagementDto>(`/users/details/${id}`);
  },

  createUser: async (payload: UserDto): Promise<UserManagementDto> => {
    return apiRequest.post<UserManagementDto>("/users", payload);
  },

  updateUser: async (
    id: number,
    payload: UserDto
  ): Promise<UserManagementDto> => {
    return apiRequest.put<UserManagementDto>(`/users/${id}`, payload);
  },

  deleteUser: async (id: number): Promise<void> => {
    return apiRequest.delete<void>(`/users/${id}`);
  },

  toggleUserStatus: async (payload: {
    id: number;
    isActive: boolean;
  }): Promise<UserManagementDto> => {
    return apiRequest.patch<UserManagementDto>(`/users/${payload.id}/status`, {
      isActive: payload.isActive,
    });
  },

  activateUser: async (id: number): Promise<UserManagementDto> => {
    return apiRequest.patch<UserManagementDto>(`/users/${id}/activate`);
  },

  deactivateUser: async (id: number): Promise<UserManagementDto> => {
    return apiRequest.patch<UserManagementDto>(`/users/${id}/deactivate`);
  },

  resetUserPassword: async (
    id: number,
    payload: ResetPasswordDto
  ): Promise<void> => {
    return apiRequest.post<void>(`/users/${id}/reset-password`, payload);
  },

  searchUsers: async (
    searchTerm: string,
    pageNumber = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<UserManagementDto>> => {
    return apiRequest.get<PaginatedResponse<UserManagementDto>>(
      `/users/search?term=${encodeURIComponent(
        searchTerm
      )}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  },

  getUsersByRole: async (
    roleId: number,
    pageNumber = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<UserManagementDto>> => {
    return apiRequest.get<PaginatedResponse<UserManagementDto>>(
      `/users/by-role/${roleId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  },

  getUsersByDepartment: async (
    department: string,
    pageNumber = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<UserManagementDto>> => {
    return apiRequest.get<PaginatedResponse<UserManagementDto>>(
      `/users/by-department?department=${encodeURIComponent(
        department
      )}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  },

  getActiveUsers: async (
    pageNumber = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<UserManagementDto>> => {
    return apiRequest.get<PaginatedResponse<UserManagementDto>>(
      `/users/active?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  },

  getInactiveUsers: async (
    pageNumber = 1,
    pageSize = 10
  ): Promise<PaginatedResponse<UserManagementDto>> => {
    return apiRequest.get<PaginatedResponse<UserManagementDto>>(
      `/users/inactive?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  },

  bulkDeleteUsers: async (userIds: number[]): Promise<void> => {
    return apiRequest.delete<void>("/users/bulk-delete", { data: { userIds } });
  },

  bulkActivateUsers: async (userIds: number[]): Promise<void> => {
    return apiRequest.patch<void>("/users/bulk-activate", { userIds });
  },

  bulkDeactivateUsers: async (userIds: number[]): Promise<void> => {
    return apiRequest.patch<void>("/users/bulk-deactivate", { userIds });
  },

  exportUsers: async (filters?: UserFilters): Promise<Blob> => {
    const params = new URLSearchParams();

    if (filters?.searchTerm) params.append("searchTerm", filters.searchTerm);
    if (filters?.roleId !== undefined)
      params.append("roleId", filters.roleId.toString());
    if (filters?.isActive !== undefined)
      params.append("isActive", filters.isActive.toString());
    if (filters?.departmentId) params.append("departmentId", filters.departmentId.toString());

    const queryString = params.toString();
    return apiRequest.get<Blob>(
      `/users/export${queryString ? `?${queryString}` : ""}`,
      { responseType: "blob" }
    );
  },
};
