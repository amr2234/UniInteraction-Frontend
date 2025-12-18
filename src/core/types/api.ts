// ============================================
// API Response Envelope Types
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors?: Record<string, string[]>;
}

export interface Result<T> {
  isSuccess: boolean;
  value?: T;
  message: string;
  errors?: string[];
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
  userId: number;
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
  requestStatusId?: number;
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
  requestTypeNameAr: string;
  requestTypeNameEn?: string;
  requestStatusId: number;
  requestStatusNameAr: string;
  requestStatusNameEn?: string;
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
  visitStatus?: number; // 1=Scheduled, 2=Accepted, 3=Rescheduled, 4=Completed
  universityLeadershipId?: number;
  universityLeadershipName?: string;
  departmentId?: number;
  assignedDepartmentId?: number;
  departmentNameAr?: string;
  departmentNameEn?: string;
  departmentName?: string; 
  assignedToUserId?: number;
  assignedToNameAr?: string;
  assignedToNameEn?: string;
  submittedChannel?: string;
  createdAt: string;
  updatedAt?: string;
  resolutionDetailsAr?: string;
  resolutionDetailsEn?: string;
  attachments?: RequestAttachment[];  // Changed from Attachments to match backend
  resolvedBy?: string;
  resolvedAt?: string;
  relatedRequestId?: number;
  relatedRequestNumber?: string;
  rating?: number;
  feedbackAr?: string;
  feedbackEn?: string;
  ratedAt?: string;
  needDateReschedule?: boolean;
}

export interface RequestFilters {
  requestStatusId?: number;
  requestTypeId?: number;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  departmentId?: number;
  universityLeadershipId?: number;
}

export interface RequestStatusCount {
  statusId: number;
  statusNameAr: string;
  statusNameEn: string;
  count: number;
}

export interface UpdateRequestStatusPayload {
  requestId: number;
  newStatusId: number;
  changeNoteAr?: string;
  changeNoteEn?: string;
  changedByUserId?: number;
}

export interface SubmitResolutionPayload {
  resolutionDetailsAr: string;
  resolutionDetailsEn?: string;
  attachments?: File[];
}

export interface AssignVisitPayload {
  visitStartAt: string;
  visitEndAt?: string;
  visitLocation?: string;
  universityLeadershipId: number;
}

export interface SubmitRatingPayload {
  rating: number;
  feedbackAr?: string;
  feedbackEn?: string;
}

export interface RequestNewVisitDatePayload {
  needDateReschedule: boolean;
}

export interface ScheduleVisitPayload {
  requestId: number;
  visitDate: string; // ISO-8601 format: "2025-12-20T10:00:00Z"
  leadershipId: number;
}

export interface UpdateVisitStatusPayload {
  visitId: number;
  status: number; // VisitStatus enum: 1=Scheduled, 2=Accepted, 3=Rescheduled, 4=Completed
  newVisitDate?: string; // ISO string, required when status is Rescheduled (3)
}

/**
 * Visit DTO - Represents a visit record
 */
export interface VisitDto {
  id: number;
  requestId: number;
  requestNumber?: string;
  visitDate: string;
  leadershipId: number;
  leadershipName?: string;
  leadershipNameAr?: string;
  leadershipNameEn?: string;
  status: number; // VisitStatus enum: 1=Scheduled, 2=Accepted, 3=Rescheduled, 4=Completed
  statusName?: string;
  userId?: number;
  userName?: string;
  userNameAr?: string;
  userEmail?: string;
  visitReasonAr?: string;
  visitReasonEn?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRelatedRequestPayload {
  relatedRequestId: number;
  // ... other request fields
}

export interface RequestAttachment {
  id: number;
  fileName: string;
  filePath: string;  // Backend returns filePath, not fileUrl
  fileUrl?: string;  // Keep for backward compatibility
  contentType: string;  // Backend returns contentType
  fileSizeKb: number;  // Backend returns fileSizeKb, not fileSize
  fileSize?: number;  // Keep for backward compatibility
  uploadedAt: string;
  attachmentTypeId: number; // 1 = Request Form, 2 = Resolution Response, 3 = Profile Picture
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
  bodyAr?: string; // Alias for messageAr
  bodyEn?: string; // Alias for messageEn
  type: string;
  isRead: boolean;
  relatedEntityId?: number;
  relatedEntityType?: string;
  userRequestId?: number; // For backward compatibility
  createdAt: string;
  receivedAt?: string; // Client-side timestamp when notification was received
  // Additional metadata
  senderName?: string;
  senderNameAr?: string;
  senderNameEn?: string;
  departmentName?: string;
  departmentNameAr?: string;
  departmentNameEn?: string;
  requestNumber?: string;
  requestTypeNameAr?: string;
  requestTypeNameEn?: string;
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
  nameAr: string;
  nameEn?: string;
  positionTitleAr: string;
  positionTitleEn?: string;
  departmentId?: number;
  departmentName?: string;
  departmentNameAr?: string;
  userId?: number;
  userNameAr?: string;
  userNameEn?: string;
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
  nameAr: string;
  nameEn?: string;
  positionTitleAr: string;
  positionTitleEn?: string;
  departmentId?: number;
  userId?: number;
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
  roleId?: number;
  departmentId?: number | string;
  universityId?: string;
  nationalId?: string;
  isActive: boolean;
  leadershipId?: number;
  leadershipPositionAr?: string;
  leadershipPositionEn?: string;
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

// ============================================
// Notification Types
// ============================================

export interface NotificationDto {
  id: number;
  userId: number;
  titleAr: string;
  titleEn?: string;
  bodyAr: string;
  bodyEn?: string;
  type: string;
  userRequestId?: number;
  isRead: boolean;
  createdAt: string;
  updatedAt?: string;
}
