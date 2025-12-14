// ============================================
// Request Status Constants - RBAC System
// ============================================

/**
 * Request Statuses Enum
 * Maps status IDs to their semantic names
 */
export enum RequestStatus {
  RECEIVED = 1,
  UNDER_REVIEW = 2,
  REPLIED = 3,
  CLOSED = 4,
}

/**
 * Request Status Names (Arabic)
 */
export const REQUEST_STATUS_NAMES_AR: Record<RequestStatus, string> = {
  [RequestStatus.RECEIVED]: 'مستلم',
  [RequestStatus.UNDER_REVIEW]: 'قيد المراجعة',
  [RequestStatus.REPLIED]: 'تم الرد',
  [RequestStatus.CLOSED]: 'مغلق',
};

/**
 * Request Status Names (English)
 */
export const REQUEST_STATUS_NAMES_EN: Record<RequestStatus, string> = {
  [RequestStatus.RECEIVED]: 'Received',
  [RequestStatus.UNDER_REVIEW]: 'Under Review',
  [RequestStatus.REPLIED]: 'Replied',
  [RequestStatus.CLOSED]: 'Closed',
};

/**
 * Request Status Descriptions (Arabic)
 */
export const REQUEST_STATUS_DESCRIPTIONS_AR: Record<RequestStatus, string> = {
  [RequestStatus.RECEIVED]: 'تم استلام الطلب بنجاح',
  [RequestStatus.UNDER_REVIEW]: 'الطلب قيد المراجعة من قبل الجهة المختصة',
  [RequestStatus.REPLIED]: 'تم الرد على الطلب من قبل الجهة المختصة',
  [RequestStatus.CLOSED]: 'تم إغلاق الطلب وإشعارك بالقرار النهائي',
};

/**
 * Request Status Descriptions (English)
 */
export const REQUEST_STATUS_DESCRIPTIONS_EN: Record<RequestStatus, string> = {
  [RequestStatus.RECEIVED]: 'Request has been successfully received',
  [RequestStatus.UNDER_REVIEW]: 'Request is under review by the responsible department',
  [RequestStatus.REPLIED]: 'Request has been replied to by the responsible department',
  [RequestStatus.CLOSED]: 'Request has been closed and you have been notified of the final decision',
};

/**
 * Helper function to check if a value is a valid request status
 */
export const isValidRequestStatus = (statusId: number): statusId is RequestStatus => {
  return Object.values(RequestStatus).includes(statusId as RequestStatus);
};

/**
 * Helper function to get status name by ID
 */
export const getRequestStatusName = (statusId: number, language: 'ar' | 'en' = 'ar'): string => {
  if (!isValidRequestStatus(statusId)) {
    return language === 'ar' ? 'غير معروف' : 'Unknown';
  }
  return language === 'ar' ? REQUEST_STATUS_NAMES_AR[statusId] : REQUEST_STATUS_NAMES_EN[statusId];
};

/**
 * Helper function to get status description by ID
 */
export const getRequestStatusDescription = (statusId: number, language: 'ar' | 'en' = 'ar'): string => {
  if (!isValidRequestStatus(statusId)) {
    return language === 'ar' ? 'حالة غير معروفة' : 'Unknown status';
  }
  return language === 'ar' ? REQUEST_STATUS_DESCRIPTIONS_AR[statusId] : REQUEST_STATUS_DESCRIPTIONS_EN[statusId];
};

/**
 * All available request statuses as an array
 */
export const ALL_REQUEST_STATUSES = Object.values(RequestStatus).filter(
  (value): value is RequestStatus => typeof value === 'number'
);

/**
 * Helper function to get status color for badges
 */
export const getRequestStatusColor = (statusId: number): string => {
  switch (statusId) {
    case RequestStatus.RECEIVED:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case RequestStatus.UNDER_REVIEW:
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case RequestStatus.REPLIED:
      return 'bg-green-100 text-green-800 border-green-200';
    case RequestStatus.CLOSED:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};