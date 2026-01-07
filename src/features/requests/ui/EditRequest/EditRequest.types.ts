export interface EditFormData {
  titleAr: string;
  titleEn?: string;
  subjectAr: string;
  subjectEn?: string;
  additionalDetailsAr?: string;
  additionalDetailsEn?: string;
  mainCategoryId?: number;
  subCategoryId?: number;
  serviceId?: number;
  visitReasonAr?: string;
  visitReasonEn?: string;
  universityLeadershipId?: number;
}

export interface FormErrors {
  [key: string]: string;
}
