/**
 * Visit Status Constants
 * These track the lifecycle of visit requests
 */

export const VisitStatus = {
  SCHEDULED: 1,    // Visit date has been assigned by employee
  ACCEPTED: 2,     // User has accepted the scheduled visit date
  RESCHEDULED: 3,  // User requested reschedule, waiting for new date
  COMPLETED: 4,    // Visit has been completed
} as const;

export type VisitStatusId = typeof VisitStatus[keyof typeof VisitStatus];

/**
 * Get the name of a visit status by its ID
 */
export const getVisitStatusName = (statusId: number, language: 'ar' | 'en' = 'ar'): string => {
  const names: Record<'ar' | 'en', Record<number, string>> = {
    ar: {
      [VisitStatus.SCHEDULED]: 'مجدولة',
      [VisitStatus.ACCEPTED]: 'مقبولة',
      [VisitStatus.RESCHEDULED]: 'تحتاج إعادة جدولة',
      [VisitStatus.COMPLETED]: 'مكتملة',
    },
    en: {
      [VisitStatus.SCHEDULED]: 'Scheduled',
      [VisitStatus.ACCEPTED]: 'Accepted',
      [VisitStatus.RESCHEDULED]: 'Needs Rescheduling',
      [VisitStatus.COMPLETED]: 'Completed',
    },
  };

  return names[language][statusId] || 'Unknown';
};

/**
 * Get the color for a visit status badge
 */
export const getVisitStatusColor = (statusId: number): string => {
  switch (statusId) {
    case VisitStatus.SCHEDULED:
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case VisitStatus.ACCEPTED:
      return 'bg-green-100 text-green-800 border-green-200';
    case VisitStatus.RESCHEDULED:
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case VisitStatus.COMPLETED:
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};
