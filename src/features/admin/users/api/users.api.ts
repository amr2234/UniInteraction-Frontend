import { BaseApi } from '@/core/lib/baseApi';
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

class UsersApi extends BaseApi<
  UserManagementDto,
  UserDto,
  UserDto,
  UserFilters
> {
  constructor() {
    super('/users');
  }

  async getAll(filters?: UserFilters): Promise<PaginatedResponse<UserManagementDto>> {
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
    
    // Send enablePagination parameter to backend
    if (filters?.enablePagination === false) {
      params.append("enablePagination", "false");
    }

    const queryString = params.toString();
    return this.customGet<PaginatedResponse<UserManagementDto>>(
      `/pagination${queryString ? `?${queryString}` : ""}`
    );
  }

  async getUserDetails(id: number): Promise<UserManagementDto> {
    return this.customGet<UserManagementDto>(`/details/${id}`);
  }

  async activateUser(id: number): Promise<UserManagementDto> {
    return this.customPatch<UserManagementDto>(`/${id}/activate`);
  }

  async deactivateUser(id: number): Promise<UserManagementDto> {
    return this.customPatch<UserManagementDto>(`/${id}/deactivate`);
  }

  async resetUserPassword(id: number, payload: ResetPasswordDto): Promise<void> {
    return this.customPost<void>(`/${id}/reset-password`, payload);
  }

  async searchUsers(searchTerm: string, pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<UserManagementDto>> {
    return this.customGet<PaginatedResponse<UserManagementDto>>(
      `/search?term=${encodeURIComponent(searchTerm)}&pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }

  async getUsersByRole(roleId: number, pageNumber = 1, pageSize = 10): Promise<PaginatedResponse<UserManagementDto>> {
    return this.customGet<PaginatedResponse<UserManagementDto>>(
      `/by-role/${roleId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
  }
}

const usersApiInstance = new UsersApi();

export const usersApi = {
  getUsers: (filters?: UserFilters) => usersApiInstance.getAll(filters),
  getUserById: (id: number) => usersApiInstance.getUserDetails(id),
  createUser: (payload: UserDto) => usersApiInstance.create(payload),
  updateUser: (id: number, payload: UserDto) => usersApiInstance.update(id, payload),
  deleteUser: (id: number) => usersApiInstance.delete(id),
  toggleUserStatus: (payload: { id: number; isActive: boolean }) =>
    usersApiInstance.toggleStatus(payload.id, payload.isActive),
  activateUser: (id: number) => usersApiInstance.activateUser(id),
  deactivateUser: (id: number) => usersApiInstance.deactivateUser(id),
  resetUserPassword: (id: number, payload: ResetPasswordDto) => usersApiInstance.resetUserPassword(id, payload),
  searchUsers: (searchTerm: string, pageNumber?: number, pageSize?: number) =>
    usersApiInstance.searchUsers(searchTerm, pageNumber, pageSize),
  getUsersByRole: (roleId: number, pageNumber?: number, pageSize?: number) =>
    usersApiInstance.getUsersByRole(roleId, pageNumber, pageSize),
};
