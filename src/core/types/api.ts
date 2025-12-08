// ============================================
// API Response Envelope Types
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export interface PaginationParams {
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ============================================
// Authentication Types
// ============================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  nameAr: string;
  nameEn?: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
  nationalId?: string;
  isStudent?: boolean;
  studentId?: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user?: UserInfo;
}

export interface UserInfo {
  id: number;
  username: string;
  nameAr: string;
  nameEn?: string;
  email: string;
  mobile: string;
  roleIds: number[];
  universityId?: string;
  nationalId?: string;
  permissions?: string[]; // Permission codes from JWT
  isActive?: boolean;
  isInternal?: boolean;
  profilePicture?: string;
}

// ============================================
// Request (User Request) Types
// ============================================

export interface CreateRequestPayload {
  nameAr: string;
  nameEn?: string;
  email: string;
  mobile: string;
  titleAr: string;
  titleEn?: string;
  subjectAr: string;
  subjectEn?: string;
  additionalDetailsAr?: string;
  additionalDetailsEn?: string;
  requestTypeId: number;
  requestCategoryId?: number;
  mainCategoryId?: number;
  subCategoryId?: number;
  serviceId?: number;
  visitReasonAr?: string;
  visitReasonEn?: string;
  visitStartAt?: string;
  visitEndAt?: string;
  universityLeadershipId?: number;
}

export interface UserRequestDto {
  id: number;
  requestNumber: string;
  nameAr: string;
  nameEn?: string;
  email: string;
  mobile: string;
  titleAr: string;
  titleEn?: string;
  subjectAr: string;
  subjectEn?: string;
  additionalDetailsAr?: string;
  additionalDetailsEn?: string;
  requestTypeId: number;
  requestTypeName: string;
  statusId: number;
  statusName: string;
  requestCategoryId?: number;
  requestCategoryName?: string;
  mainCategoryId?: number;
  mainCategoryName?: string;
  subCategoryId?: number;
  subCategoryName?: string;
  serviceId?: number;
  serviceName?: string;
  visitReasonAr?: string;
  visitReasonEn?: string;
  visitStartAt?: string;
  visitEndAt?: string;
  universityLeadershipId?: number;
  universityLeadershipName?: string;
  submittedChannel?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RequestFilters {
  statusId?: number;
  requestTypeId?: number;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
}

export interface UpdateRequestStatusPayload {
  statusId: number;
  noteAr?: string;
  noteEn?: string;
}

export interface RequestAttachment {
  id: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
}

// ============================================
// Notification Types
// ============================================

export interface NotificationDto {
  id: number;
  userId: number;
  titleAr: string;
  titleEn?: string;
  messageAr: string;
  messageEn?: string;
  type: string;
  isRead: boolean;
  relatedEntityId?: number;
  relatedEntityType?: string;
  createdAt: string;
}

// ============================================
// Lookup Types
// ============================================

export interface RequestTypeDto {
  id: number;
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
}

export interface RequestStatusDto {
  id: number;
  nameAr: string;
  nameEn?: string;
  color?: string;
}

export interface MainCategoryDto {
  id: number;
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface SubCategoryDto {
  id: number;
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  mainCategoryId: number;
  mainCategoryName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface ServiceDto {
  id: number;
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  subCategoryId: number;
  subCategoryName?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface UniversityLeadershipDto {
  id: number;
  fullNameAr: string;
  fullNameEn?: string;
  positionTitleAr: string;
  positionTitleEn?: string;
  departmentId?: number;
  displayOrder?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// ============================================
// FAQ Types
// ============================================

export interface FaqDto {
  id: number;
  questionAr: string;
  questionEn?: string;
  answerAr: string;
  answerEn?: string;
  categoryId?: number;
  categoryName?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateFaqPayload {
  questionAr: string;
  questionEn?: string;
  answerAr: string;
  answerEn?: string;
  categoryId?: number;
  order?: number;
}

export interface UpdateFaqPayload extends CreateFaqPayload {
  isActive?: boolean;
}

// ============================================
// Leadership (Admin) Types
// ============================================

export interface CreateLeadershipPayload {
  fullNameAr: string;
  fullNameEn?: string;
  positionTitleAr: string;
  positionTitleEn?: string;
  departmentId?: number;
  displayOrder?: number;
}

export interface UpdateLeadershipPayload extends CreateLeadershipPayload {
  isActive?: boolean;
}

// ============================================
// User Management Types
// ============================================

export interface UserDto {
  id: number;
  nameAr: string;
  nameEn?: string;
  email: string;
  mobile: string;
  role: string;
  universityId?: string;
  nationalId?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface CreateUserPayload {
  nameAr: string;
  nameEn?: string;
  email: string;
  mobile: string;
  password: string;
  role: string;
  universityId?: string;
  nationalId?: string;
}

export interface UpdateUserPayload {
  nameAr?: string;
  nameEn?: string;
  email?: string;
  mobile?: string;
  role?: string;
  universityId?: string;
  nationalId?: string;
  isActive?: boolean;
}

// ============================================
// Category Management Types
// ============================================

export interface CreateMainCategoryPayload {
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  order?: number;
}

export interface UpdateMainCategoryPayload extends CreateMainCategoryPayload {
  isActive?: boolean;
}

export interface CreateSubCategoryPayload {
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  mainCategoryId: number;
  order?: number;
}

export interface UpdateSubCategoryPayload extends CreateSubCategoryPayload {
  isActive?: boolean;
}

export interface CreateServicePayload {
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  subCategoryId: number;
  order?: number;
}

export interface UpdateServicePayload extends CreateServicePayload {
  isActive?: boolean;
}

// ============================================
// Roles & Permissions Types
// ============================================

export interface PermissionDto {
  id: number;
  code: string;
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  group: string;
}

export interface RoleDto {
  id: number;
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  isSystem: boolean;
  isActive: boolean;
  permissions: PermissionDto[];
  userCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateRolePayload {
  nameAr: string;
  nameEn?: string;
  descriptionAr?: string;
  descriptionEn?: string;
  permissionIds: number[];
}

export interface UpdateRolePayload extends CreateRolePayload {
  isActive?: boolean;
}

export interface AssignRolePayload {
  userId: number;
  roleIds: number[];
}

export interface UserPermissionsDto {
  userId: number;
  roles: RoleDto[];
  permissions: PermissionDto[];
  permissionCodes: string[];
}
