import { BaseApi } from '@/core/lib/baseApi';
import {
  RoleDto,
  PermissionDto,
  CreateRolePayload,
  UpdateRolePayload,
  UserPermissionsDto,
} from '@/core/types/api';

class RolesApi extends BaseApi<RoleDto, CreateRolePayload, UpdateRolePayload> {
  constructor() {
    super('/roles');
  }

  async getAllPermissions(): Promise<PermissionDto[]> {
    return this.customGet<PermissionDto[]>('/permissions', { baseURL: '' });
  }

  async getRolePermissions(roleId: number): Promise<PermissionDto[]> {
    return this.customGet<PermissionDto[]>(`/${roleId}/permissions`);
  }

  async updateRolePermissions(roleId: number, permissionIds: number[]): Promise<RoleDto> {
    return this.customPut<RoleDto>(`/${roleId}/permissions`, { permissionIds });
  }

  async getUserPermissions(userId: number): Promise<UserPermissionsDto> {
    return this.customGet<UserPermissionsDto>(`/users/${userId}/permissions`, { baseURL: '' });
  }

  async getCurrentUserPermissions(): Promise<UserPermissionsDto> {
    return this.customGet<UserPermissionsDto>('/auth/me/permissions', { baseURL: '' });
  }

  async checkPermission(permissionCode: string): Promise<boolean> {
    return this.customPost<boolean>('/auth/check-permission', { permissionCode }, { baseURL: '' });
  }

  async checkAnyPermission(permissionCodes: string[]): Promise<boolean> {
    return this.customPost<boolean>('/auth/check-any-permission', { permissionCodes }, { baseURL: '' });
  }

  async checkAllPermissions(permissionCodes: string[]): Promise<boolean> {
    return this.customPost<boolean>('/auth/check-all-permissions', { permissionCodes }, { baseURL: '' });
  }
}

const rolesApiInstance = new RolesApi();

export const rolesApi = {
  getRoles: () => rolesApiInstance.getList(),
  getRoleById: (id: number) => rolesApiInstance.getById(id),
  createRole: (payload: CreateRolePayload) => rolesApiInstance.create(payload),
  updateRole: (id: number, payload: UpdateRolePayload) => rolesApiInstance.update(id, payload),
  deleteRole: (id: number) => rolesApiInstance.delete(id),
  getAllPermissions: () => rolesApiInstance.getAllPermissions(),
  getRolePermissions: (roleId: number) => rolesApiInstance.getRolePermissions(roleId),
  updateRolePermissions: (roleId: number, permissionIds: number[]) => 
    rolesApiInstance.updateRolePermissions(roleId, permissionIds),
  getUserPermissions: (userId: number) => rolesApiInstance.getUserPermissions(userId),
  getCurrentUserPermissions: () => rolesApiInstance.getCurrentUserPermissions(),
  checkPermission: (permissionCode: string) => rolesApiInstance.checkPermission(permissionCode),
  checkAnyPermission: (permissionCodes: string[]) => rolesApiInstance.checkAnyPermission(permissionCodes),
  checkAllPermissions: (permissionCodes: string[]) => rolesApiInstance.checkAllPermissions(permissionCodes),
};
