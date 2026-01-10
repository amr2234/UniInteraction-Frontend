// ============================================
// User Types & DTOs
// ============================================

/**
 * User Management DTO
 * Represents a user in the system
 */
export interface UserManagementDto {
  id: number;
  nameAr: string;
  nameEn?: string;
  email: string;
  emailConfirmed: boolean;
  mobile?: string;
  nationalId?: string;
  studentId?: string;
  departmentId?: string | number; // API may return number, but form expects string
  roleId: number;
  roleName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
  profilePictureUrl?: string; // Profile picture URL from backend
}

/**
 * Create User DTO
 * Payload for creating a new user
 */
export interface UserDto {
  id?: number;
  nameAr: string;
  nameEn?: string;
  email: string;
  password?: string;
  mobile?: string;
  nationalId?: string;
  studentId?: string;
  departmentId?: string;
  roleId: number;
  isActive: boolean;
}



/**
 * User Filters
 * Query parameters for filtering users
 */
export interface UserFilters {
  searchTerm?: string;
  roleId?: number;
  isActive?: boolean;
  departmentId?: number;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  enablePagination?: boolean; // Default true, set false for dropdowns
}

/**
 * Toggle User Status DTO
 * Payload for toggling user active status
 */
export interface ToggleUserStatusDto {
  isActive: boolean;
}

/**
 * Reset Password DTO
 * Payload for resetting user password
 */
export interface ResetPasswordDto {
  newPassword: string;
}
