import { BaseApi } from '@/core/lib/baseApi';
import { PaginatedResponse } from '@/core/types/api';
import type {
  DepartmentDto,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  DepartmentFilters,
} from '../types/department.types';

export type {
  DepartmentDto,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  DepartmentFilters,
};

class DepartmentsApi extends BaseApi<
  DepartmentDto,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  DepartmentFilters
> {
  constructor() {
    super('/departments');
  }

  async getAll(filters?: DepartmentFilters): Promise<PaginatedResponse<DepartmentDto>> {
    const params = new URLSearchParams();
    
    if (filters?.searchTerm) params.append('search', filters.searchTerm);
    if (filters?.isActive !== undefined) params.append('isActive', filters.isActive.toString());
    if (filters?.pageNumber) params.append('page', filters.pageNumber.toString());
    if (filters?.pageSize) params.append('pageSize', filters.pageSize.toString());
    if (filters?.sortOrder === 'desc') params.append('isDesc', 'true');

    const queryString = params.toString();
    return this.customGet<PaginatedResponse<DepartmentDto>>(`/pagination${queryString ? `?${queryString}` : ''}`);
  }
}

const departmentsApiInstance = new DepartmentsApi();

export const departmentsApi = {
  getDepartments: (filters?: DepartmentFilters) => departmentsApiInstance.getAll(filters),
  getDepartmentById: (id: number) => departmentsApiInstance.getById(id),
  createDepartment: (payload: CreateDepartmentDto) => departmentsApiInstance.create(payload),
  updateDepartment: (id: number, payload: UpdateDepartmentDto) => departmentsApiInstance.update(id, payload),
  deleteDepartment: (id: number) => departmentsApiInstance.delete(id),
  toggleDepartmentStatus: (payload: { id: number; isActive: boolean }) => 
    departmentsApiInstance.toggleStatus(payload.id, payload.isActive),
};
