



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
  permissions?: string[]; 
  isActive?: boolean;
  isInternal?: boolean;
  profilePicture?: string; 
  profilePictureId?: number; 
}





export interface CreateRequestPayload {
  userId?: number;
  email: string;
  mobile: string;
  titleAr: string;
  titleEn?: string;
  subjectAr: string;
  subjectEn?: string;
  requestTypeId: number;
  mainCategoryId?: number;
  subCategoryId?: number;
  isVisitRelatedToPreviousRequest: boolean;
  relatedRequestId?: number;
  universityLeadershipId?: number;
  needDateReschedule: boolean;
  redirectToNewRequest?: boolean;
}

export interface UserRequestDto {
  id: number;
  userId: number;
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
  mainCategoryNameAr?: string;
  mainCategoryNameEn?: string;  
  subCategoryId?: number;
  subCategoryName?: string;
  serviceId?: number;
  serviceName?: string;
  visitReasonAr?: string;
  visitReasonEn?: string;
  visitDate?: string; 
  visitId?: number; 
  visitStatus?: number; 
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
  attachments?: RequestAttachment[];  
  resolvedBy?: string;
  resolvedAt?: string;
  relatedRequestId?: number;
  relatedRequestNumber?: string;
  rating?: number;
  feedbackAr?: string;
  feedbackEn?: string;
  ratedAt?: string;
  needDateReschedule?: boolean;
  redirectToNewRequest?: boolean;
  isVisitRelatedToPreviousRequest?: boolean;
}

export interface RequestFilters {
  userId?: number;
  requestStatusId?: number;
  requestTypeId?: number;
  startDate?: string;
  endDate?: string;
  searchTerm?: string;
  departmentId?: number;
  universityLeadershipId?: number;
  pageNumber?: number;
  pageSize?: number;
  enablePagination?: boolean;
}

export interface RequestStatusCount {
  statusId: number;
  statusNameAr: string;
  statusNameEn: string;
  count: number;
}

export interface UpdateRequestStatusPayload {
  requestId: number;
  newStatus: number;
  changeNoteAr?: string;
  changeNoteEn?: string;
  changedByUserId?: number;
  redirectToNewRequest?: boolean;
  relatedRequestId?: number;
  visitId?: number; 
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
  visitDate: string; 
  leadershipId: number;
  visitId?: number; 
}

export interface UpdateVisitStatusPayload {
  visitId: number;
  newStatus: number; 
  newVisitDate?: string; 
}


export interface VisitDto {
  id: number;
  requestId: number;
  requestNumber?: string;
  visitDate: string;
  leadershipId: number;
  leadershipName?: string;
  leadershipNameAr?: string;
  leadershipNameEn?: string;
  status: number; 
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
  
}

export interface RequestAttachment {
  id: number;
  fileName: string;
  filePath: string;  
  fileUrl?: string;  
  contentType: string;  
  fileSizeKb: number;  
  fileSize?: number;  
  uploadedAt: string;
  attachmentTypeId: number; 
}





export interface NotificationDto {
  id: number;
  userId: number;
  titleAr: string;
  titleEn?: string;
  messageAr: string;
  messageEn?: string;
  bodyAr: string; 
  bodyEn?: string; 
  type: string;
  isRead: boolean;
  relatedEntityId?: number;
  relatedEntityType?: string;
  userRequestId?: number; 
  createdAt: string;
  receivedAt?: string; 
  
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
