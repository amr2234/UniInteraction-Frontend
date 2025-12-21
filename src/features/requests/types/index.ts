// Request related interfaces
export interface UserRequestDetailsDto {
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
  statusId: number;
  requestCategoryId?: number;
  mainCategoryId?: number;
  subCategoryId?: number;
  serviceId?: number;
  visitReasonAr?: string;
  visitReasonEn?: string;
  universityLeadershipId?: number;
  submittedChannel?: string;
  createdAt: string;
  assignedEmployeeId ?: number;
}

export interface RequestType {
  id: number;
  nameAr: string;
}

export interface RequestCategory {
  id: number;
  nameAr: string;
}

export interface MainCategory {
  id: number;
  nameAr: string;
}

export interface SubCategory {
  id: number;
  nameAr: string;
  mainCategoryId: number;
}

export interface Service {
  id: number;
  nameAr: string;
  subCategoryId: number;
}

export interface UniversityLeadership {
  id: number;
  nameAr: string;
  positionAr: string;
}

// Request details interfaces
export interface RequestAttachment {
  name: string;
  size: string;
}

export interface RequestTimelineItem {
  status: string;
  date: string;
  description: string;
  completed: boolean;
}

export interface RequestMessage {
  sender: string;
  message: string;
  date: string;
  isAdmin: boolean;
}