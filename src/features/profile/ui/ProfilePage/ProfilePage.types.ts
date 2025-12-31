export interface ProfileFormData {
  nameAr: string;
  nameEn: string;
  email: string;
  mobile: string;
  nationalId: string;
}

export interface ProfileFormErrors {
  email?: string;
  mobile?: string;
}
