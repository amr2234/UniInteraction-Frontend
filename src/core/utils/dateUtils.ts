/**
 * Date formatting utilities
 * Centralized date formatting functions to avoid code duplication
 */

/**
 * Format date for Arabic locale (Saudi Arabia)
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string in Arabic
 */
export const formatDateArabic = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString("ar-SA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

/**
 * Format date for English locale
 * @param dateString - ISO date string or Date object
 * @returns Formatted date string in English
 */
export const formatDateEnglish = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Format date based on language
 * @param dateString - ISO date string or Date object
 * @param language - Language code ('ar' or 'en')
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | Date, language: string = 'ar'): string => {
  return language === 'ar' ? formatDateArabic(dateString) : formatDateEnglish(dateString);
};

/**
 * Format date and time based on language
 * @param dateString - ISO date string or Date object
 * @param language - Language code ('ar' or 'en')
 * @returns Formatted date and time string
 */
export const formatDateTime = (dateString: string | Date, language: string = 'ar'): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return language === 'ar' 
    ? date.toLocaleString("ar-SA")
    : date.toLocaleString("en-US");
};

/**
 * Check if a date is in the past
 * @param dateString - ISO date string or Date object
 * @returns true if date is in the past
 */
export const isPastDate = (dateString: string | Date): boolean => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();
  return date < now;
};

/**
 * Get relative time description (e.g., "2 hours ago")
 * @param dateString - ISO date string or Date object
 * @param language - Language code ('ar' or 'en')
 * @returns Relative time string
 */
export const getRelativeTime = (dateString: string | Date, language: string = 'ar'): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (language === 'ar') {
    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    return formatDateArabic(date);
  } else {
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDateEnglish(date);
  }
};
