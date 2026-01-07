




export enum RequestType {
  INQUIRY = 1,
  COMPLAINT = 2,
  VISIT = 3,
  OTHER = 4,
}


export const REQUEST_TYPE_NAMES_AR: Record<RequestType, string> = {
  [RequestType.INQUIRY]: 'استفسار',
  [RequestType.COMPLAINT]: 'شكوى',
  [RequestType.VISIT]: 'حجز زيارة',
  [RequestType.OTHER]: 'أخرى',
};


export const REQUEST_TYPE_NAMES_EN: Record<RequestType, string> = {
  [RequestType.INQUIRY]: 'Inquiry',
  [RequestType.COMPLAINT]: 'Complaint',
  [RequestType.VISIT]: 'Visit',
  [RequestType.OTHER]: 'Other',
};


export const isValidRequestType = (typeId: number): typeId is RequestType => {
  return Object.values(RequestType).includes(typeId as RequestType);
};


export const getRequestTypeName = (typeId: number, language: 'ar' | 'en' = 'ar'): string => {
  if (!isValidRequestType(typeId)) {
    return language === 'ar' ? 'غير معروف' : 'Unknown';
  }
  return language === 'ar' ? REQUEST_TYPE_NAMES_AR[typeId] : REQUEST_TYPE_NAMES_EN[typeId];
};


export const ALL_REQUEST_TYPES = Object.values(RequestType).filter(
  (value): value is RequestType => typeof value === 'number'
);
