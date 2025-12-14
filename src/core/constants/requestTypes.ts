// ============================================
// Request Type Constants
// ============================================

/**
 * Request Types Enum
 * Maps type IDs to their semantic names
 */
export enum RequestType {
  INQUIRY = 1,
  COMPLAINT = 2,
  VISIT = 3,
  OTHER = 4,
}

/**
 * Request Type Names (Arabic)
 */
export const REQUEST_TYPE_NAMES_AR: Record<RequestType, string> = {
  [RequestType.INQUIRY]: 'استفسار',
  [RequestType.COMPLAINT]: 'شكوى',
  [RequestType.VISIT]: 'حجز زيارة',
  [RequestType.OTHER]: 'أخرى',
};

/**
 * Request Type Names (English)
 */
export const REQUEST_TYPE_NAMES_EN: Record<RequestType, string> = {
  [RequestType.INQUIRY]: 'Inquiry',
  [RequestType.COMPLAINT]: 'Complaint',
  [RequestType.VISIT]: 'Visit',
  [RequestType.OTHER]: 'Other',
};

/**
 * Helper function to check if a value is a valid request type
 */
export const isValidRequestType = (typeId: number): typeId is RequestType => {
  return Object.values(RequestType).includes(typeId as RequestType);
};

/**
 * Helper function to get type name by ID
 */
export const getRequestTypeName = (typeId: number, language: 'ar' | 'en' = 'ar'): string => {
  if (!isValidRequestType(typeId)) {
    return language === 'ar' ? 'غير معروف' : 'Unknown';
  }
  return language === 'ar' ? REQUEST_TYPE_NAMES_AR[typeId] : REQUEST_TYPE_NAMES_EN[typeId];
};

/**
 * All available request types as an array
 */
export const ALL_REQUEST_TYPES = Object.values(RequestType).filter(
  (value): value is RequestType => typeof value === 'number'
);
