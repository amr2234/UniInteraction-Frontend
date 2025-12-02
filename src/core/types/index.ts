export interface PersonalInfo {
  nameAr: string;
  nameEn?: string;
  email: string;
  mobile: string;
}

export interface RequestCategory {
  requestCategory?: string;
  mainCategory?: string;
  subCategory?: string;
  service?: string;
}

export interface RequestFormData extends PersonalInfo, RequestCategory {
  titleAr: string;
  titleEn?: string;
  subjectAr: string;
  subjectEn?: string;
  detailsAr?: string;
  detailsEn?: string;
  files?: File[];
}

export interface ComplaintFormData extends RequestFormData {
  noteAr?: string;
  noteEn?: string;
}

export interface VisitFormData extends PersonalInfo {
  leadershipId: string;
  visitReasonAr: string;
  visitReasonEn?: string;
  visitStartDate: string;
  visitEndDate: string;
  relatedToPrevious: boolean;
  relatedRequestNumber?: string;
  files?: File[];
}

export interface ServiceCard {
  icon: any;
  title: string;
  description: string;
  link: string;
  color: string;
  bgColor: string;
}

export interface StatCard {
  title: string;
  value: string;
  icon: any;
  color: string;
  trend: string;
}

export interface Activity {
  type: string;
  title: string;
  status: string;
  date: string;
  color: string;
}
