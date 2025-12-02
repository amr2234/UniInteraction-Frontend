// ============================================
// Role Constants - RBAC System
// ============================================

/**
 * System Roles Enum
 * Maps role IDs to their semantic names
 */
export enum UserRole {
  SUPER_ADMIN = 1,
  ADMIN = 2,
  EMPLOYEE = 3,
  USER = 4,
}

/**
 * Role Translation Keys
 * Use with i18n: t(ROLE_TRANSLATION_KEYS[roleId])
 */
export const ROLE_TRANSLATION_KEYS: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'users.roles.superAdmin',
  [UserRole.ADMIN]: 'users.roles.admin',
  [UserRole.EMPLOYEE]: 'users.roles.employee',
  [UserRole.USER]: 'users.roles.visitor',
};

/**
 * Role Descriptions (Arabic)
 */
export const ROLE_DESCRIPTIONS_AR: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'صلاحيات كاملة لجميع أجزاء النظام بما في ذلك الإعدادات والسجلات',
  [UserRole.ADMIN]: 'صلاحيات كاملة لإدارة النظام',
  [UserRole.EMPLOYEE]: 'إدارة ومتابعة الطلبات',
  [UserRole.USER]: 'تقديم الطلبات والاستفسارات',
};

/**
 * Role Descriptions (English)
 */
export const ROLE_DESCRIPTIONS_EN: Record<UserRole, string> = {
  [UserRole.SUPER_ADMIN]: 'Full system access including settings and logs',
  [UserRole.ADMIN]: 'Full system administration access',
  [UserRole.EMPLOYEE]: 'Request management and tracking',
  [UserRole.USER]: 'Submit requests and inquiries',
};

/**
 * Helper function to check if a value is a valid role
 */
export const isValidRole = (roleId: number): roleId is UserRole => {
  return Object.values(UserRole).includes(roleId as UserRole);
};

/**
 * Helper function to get role translation key by ID
 */
export const getRoleTranslationKey = (roleId: number): string => {
  if (!isValidRole(roleId)) {
    return 'users.roles.unknown';
  }
  return ROLE_TRANSLATION_KEYS[roleId];
};

/**
 * Helper function to get role description by ID
 */
export const getRoleDescription = (roleId: number, language: 'ar' | 'en' = 'ar'): string => {
  if (!isValidRole(roleId)) {
    return language === 'ar' ? 'دور غير معروف' : 'Unknown role';
  }
  return language === 'ar' ? ROLE_DESCRIPTIONS_AR[roleId] : ROLE_DESCRIPTIONS_EN[roleId];
};

/**
 * All available roles as an array
 */
export const ALL_ROLES = Object.values(UserRole).filter(
  (value): value is UserRole => typeof value === 'number'
);
