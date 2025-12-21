import type { Control, FieldErrors } from "react-hook-form";

// Request Type IDs  
// Note: Complaint type handles both complaints and suggestions
export const REQUEST_TYPES = {
  INQUIRY: 1,
  COMPLAINT: 2,  
  VISIT: 3,
} as const;

export type RequestTypeId = typeof REQUEST_TYPES[keyof typeof REQUEST_TYPES];

// Form Data Type
export interface RequestFormData {
  // Personal Information (common for all types)
  nameAr: string;
  nameEn?: string;
  email: string;
  mobile: string;

  // Request Type
  requestTypeId: number;

  // Common Fields
  titleAr: string; // عنوان - Request title
  titleEn?: string;
  subjectAr: string; // For all types: Complaint/Inquiry content OR Visit response
  subjectEn?: string;

  // Category fields (Complaint, Inquiry, Suggestion)
  mainCategoryId?: string;
  subCategoryId?: string;
  serviceId?: string;

  // Visit-specific fields
  universityLeadershipId?: string;
  hasRelatedComplaint?: boolean;
  relatedRequestId?: string;
}

// Hook Return Type
export interface UseRequestFormReturn {
  control: Control<RequestFormData>;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  formState: {
    errors: FieldErrors<RequestFormData>;
    isSubmitting: boolean;
    isDirty: boolean;
  };
  watch: (name?: keyof RequestFormData | (keyof RequestFormData)[]) => any;
  setValue: (name: keyof RequestFormData, value: any, options?: any) => void;
  reset: () => void;
  trigger: () => Promise<boolean>;
  
  requestType: RequestTypeId;
  isLoading: boolean;
  
  // File handling
  files: File[];
  handleFileChange: (newFiles: FileList | null) => void;
  removeFile: (index: number) => void;
  
  // Actions
  handleCancel: () => void;
  
  // Categories (from API)
  mainCategories: CategoryOption[];
  subCategories: CategoryOption[];
  services: ServiceOption[];
  leadershipOptions: LeadershipOption[];
  userRequests: any[]; // User's previous requests for linking
  
  // Dynamic category loading
  isLoadingCategories: boolean;
  isLoadingSubCategories: boolean;
}

export interface CategoryOption {
  id: number;
  nameAr: string;
  nameEn?: string;
}

export interface ServiceOption {
  id: number;
  nameAr: string;
  nameEn?: string;
}

export interface LeadershipOption {
  id: number;
  nameAr: string;
  nameEn?: string;
  positionTitleAr: string;
  positionTitleEn?: string;
}
