// ============================================
// Department Types & DTOs
// ============================================

/**
 * Department DTO
 * Represents a department in the system
 */
export interface DepartmentDto {
  id: number;
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  code?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Create Department DTO
 * Payload for creating a new department
 */
export interface CreateDepartmentDto {
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  code?: string;
}

/**
 * Update Department DTO
 * Payload for updating an existing department
 */
export interface UpdateDepartmentDto {
  nameAr?: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  code?: string;
  isActive?: boolean;
}

/**
 * Department Filters
 * Query parameters for filtering departments
 */
export interface DepartmentFilters {
  searchTerm?: string;
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
