// ============================================
// Permission Constants - RBAC System
// ============================================

// All 32 Permission Codes
export const PERMISSIONS = {
  // Users (5)
  USERS_VIEW: 'USERS_VIEW',
  USERS_CREATE: 'USERS_CREATE',
  USERS_EDIT: 'USERS_EDIT',
  USERS_DELETE: 'USERS_DELETE',
  USERS_MANAGE_ROLES: 'USERS_MANAGE_ROLES',

  // Roles (5)
  ROLES_VIEW: 'ROLES_VIEW',
  ROLES_CREATE: 'ROLES_CREATE',
  ROLES_EDIT: 'ROLES_EDIT',
  ROLES_DELETE: 'ROLES_DELETE',
  ROLES_MANAGE_PERMISSIONS: 'ROLES_MANAGE_PERMISSIONS',

  // Requests (7)
  REQUESTS_VIEW_ALL: 'REQUESTS_VIEW_ALL',
  REQUESTS_VIEW_OWN: 'REQUESTS_VIEW_OWN',
  REQUESTS_CREATE: 'REQUESTS_CREATE',
  REQUESTS_EDIT: 'REQUESTS_EDIT',
  REQUESTS_DELETE: 'REQUESTS_DELETE',
  REQUESTS_CHANGE_STATUS: 'REQUESTS_CHANGE_STATUS',
  REQUESTS_ASSIGN: 'REQUESTS_ASSIGN',

  // Categories (4)
  CATEGORIES_VIEW: 'CATEGORIES_VIEW',
  CATEGORIES_CREATE: 'CATEGORIES_CREATE',
  CATEGORIES_EDIT: 'CATEGORIES_EDIT',
  CATEGORIES_DELETE: 'CATEGORIES_DELETE',

  // FAQs (4)
  FAQS_VIEW: 'FAQS_VIEW',
  FAQS_CREATE: 'FAQS_CREATE',
  FAQS_EDIT: 'FAQS_EDIT',
  FAQS_DELETE: 'FAQS_DELETE',

  // Notifications (2)
  NOTIFICATIONS_VIEW: 'NOTIFICATIONS_VIEW',
  NOTIFICATIONS_SEND: 'NOTIFICATIONS_SEND',

  // Reports (2)
  REPORTS_VIEW: 'REPORTS_VIEW',
  REPORTS_EXPORT: 'REPORTS_EXPORT',

  // Settings (2)
  SETTINGS_VIEW: 'SETTINGS_VIEW',
  SETTINGS_MANAGE: 'SETTINGS_MANAGE',

  // Logs (3)
  LOGS_VIEW: 'LOGS_VIEW',
  LOGS_EXPORT: 'LOGS_EXPORT',
  LOGS_DELETE: 'LOGS_DELETE',
  LOGS_MANAGE: 'LOGS_MANAGE',
  
} as const;

// Type for permission codes
export type PermissionCode = typeof PERMISSIONS[keyof typeof PERMISSIONS];

// Permission groups for easier management
export const PERMISSION_GROUPS = {
  USERS: [
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_EDIT,
    PERMISSIONS.USERS_DELETE,
    PERMISSIONS.USERS_MANAGE_ROLES,
  ],
  ROLES: [
    PERMISSIONS.ROLES_VIEW,
    PERMISSIONS.ROLES_CREATE,
    PERMISSIONS.ROLES_EDIT,
    PERMISSIONS.ROLES_DELETE,
    PERMISSIONS.ROLES_MANAGE_PERMISSIONS,
  ],
  REQUESTS: [
    PERMISSIONS.REQUESTS_VIEW_ALL,
    PERMISSIONS.REQUESTS_VIEW_OWN,
    PERMISSIONS.REQUESTS_CREATE,
    PERMISSIONS.REQUESTS_EDIT,
    PERMISSIONS.REQUESTS_DELETE,
    PERMISSIONS.REQUESTS_CHANGE_STATUS,
    PERMISSIONS.REQUESTS_ASSIGN,
  ],
  CATEGORIES: [
    PERMISSIONS.CATEGORIES_VIEW,
    PERMISSIONS.CATEGORIES_CREATE,
    PERMISSIONS.CATEGORIES_EDIT,
    PERMISSIONS.CATEGORIES_DELETE,
  ],
  FAQS: [
    PERMISSIONS.FAQS_VIEW,
    PERMISSIONS.FAQS_CREATE,
    PERMISSIONS.FAQS_EDIT,
    PERMISSIONS.FAQS_DELETE,
  ],
  NOTIFICATIONS: [
    PERMISSIONS.NOTIFICATIONS_VIEW,
    PERMISSIONS.NOTIFICATIONS_SEND,
  ],
  REPORTS: [
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
  ],
  SETTINGS: [
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.SETTINGS_MANAGE,
  ],
  LOGS: [
    PERMISSIONS.LOGS_VIEW,
    PERMISSIONS.LOGS_EXPORT,
    PERMISSIONS.LOGS_DELETE,
    PERMISSIONS.LOGS_MANAGE,
  ],
} as const;

// Permission descriptions (Arabic)
export const PERMISSION_DESCRIPTIONS_AR = {
  // Users
  USERS_VIEW: 'عرض المستخدمين',
  USERS_CREATE: 'إنشاء مستخدم جديد',
  USERS_EDIT: 'تعديل بيانات المستخدمين',
  USERS_DELETE: 'حذف المستخدمين',
  USERS_MANAGE_ROLES: 'إدارة أدوار المستخدمين',

  // Roles
  ROLES_VIEW: 'عرض الأدوار',
  ROLES_CREATE: 'إنشاء دور جديد',
  ROLES_EDIT: 'تعديل الأدوار',
  ROLES_DELETE: 'حذف الأدوار',
  ROLES_MANAGE_PERMISSIONS: 'إدارة صلاحيات الأدوار',

  // Requests
  REQUESTS_VIEW_ALL: 'عرض جميع الطلبات',
  REQUESTS_VIEW_OWN: 'عرض الطلبات الخاصة',
  REQUESTS_CREATE: 'إنشاء طلب جديد',
  REQUESTS_EDIT: 'تعديل الطلبات',
  REQUESTS_DELETE: 'حذف الطلبات',
  REQUESTS_CHANGE_STATUS: 'تغيير حالة الطلب',
  REQUESTS_ASSIGN: 'تعيين الطلبات',

  // Categories
  CATEGORIES_VIEW: 'عرض التصنيفات',
  CATEGORIES_CREATE: 'إنشاء تصنيف جديد',
  CATEGORIES_EDIT: 'تعديل التصنيفات',
  CATEGORIES_DELETE: 'حذف التصنيفات',

  // FAQs
  FAQS_VIEW: 'عرض الأسئلة الشائعة',
  FAQS_CREATE: 'إنشاء سؤال شائع جديد',
  FAQS_EDIT: 'تعديل الأسئلة الشائعة',
  FAQS_DELETE: 'حذف الأسئلة الشائعة',

  // Notifications
  NOTIFICATIONS_VIEW: 'عرض الإشعارات',
  NOTIFICATIONS_SEND: 'إرسال الإشعارات',

  // Reports
  REPORTS_VIEW: 'عرض التقارير',
  REPORTS_EXPORT: 'تصدير التقارير',

  // Settings
  SETTINGS_VIEW: 'عرض الإعدادات',
  SETTINGS_MANAGE: 'إدارة الإعدادات',

  // Logs
  LOGS_VIEW: 'عرض السجلات',
  LOGS_EXPORT: 'تصدير السجلات',
  LOGS_DELETE: 'حذف السجلات',
  LOGS_MANAGE: 'إدارة السجلات',
} as const;

// Permission descriptions (English)
export const PERMISSION_DESCRIPTIONS_EN = {
  // Users
  USERS_VIEW: 'View Users',
  USERS_CREATE: 'Create User',
  USERS_EDIT: 'Edit Users',
  USERS_DELETE: 'Delete Users',
  USERS_MANAGE_ROLES: 'Manage User Roles',

  // Roles
  ROLES_VIEW: 'View Roles',
  ROLES_CREATE: 'Create Role',
  ROLES_EDIT: 'Edit Roles',
  ROLES_DELETE: 'Delete Roles',
  ROLES_MANAGE_PERMISSIONS: 'Manage Role Permissions',

  // Requests
  REQUESTS_VIEW_ALL: 'View All Requests',
  REQUESTS_VIEW_OWN: 'View Own Requests',
  REQUESTS_CREATE: 'Create Request',
  REQUESTS_EDIT: 'Edit Requests',
  REQUESTS_DELETE: 'Delete Requests',
  REQUESTS_CHANGE_STATUS: 'Change Request Status',
  REQUESTS_ASSIGN: 'Assign Requests',

  // Categories
  CATEGORIES_VIEW: 'View Categories',
  CATEGORIES_CREATE: 'Create Category',
  CATEGORIES_EDIT: 'Edit Categories',
  CATEGORIES_DELETE: 'Delete Categories',

  // FAQs
  FAQS_VIEW: 'View FAQs',
  FAQS_CREATE: 'Create FAQ',
  FAQS_EDIT: 'Edit FAQs',
  FAQS_DELETE: 'Delete FAQs',

  // Notifications
  NOTIFICATIONS_VIEW: 'View Notifications',
  NOTIFICATIONS_SEND: 'Send Notifications',

  // Reports
  REPORTS_VIEW: 'View Reports',
  REPORTS_EXPORT: 'Export Reports',

  // Settings
  SETTINGS_VIEW: 'View Settings',
  SETTINGS_MANAGE: 'Manage Settings',

  // Logs
  LOGS_VIEW: 'View Logs',
  LOGS_EXPORT: 'Export Logs',
  LOGS_DELETE: 'Delete Logs',
  LOGS_MANAGE: 'Manage Logs',

} as const;

// Common role presets
export const ROLE_PRESETS = {
  SUPER_ADMIN: Object.values(PERMISSIONS), // All permissions
  
  ADMIN: [
    ...PERMISSION_GROUPS.USERS,
    ...PERMISSION_GROUPS.REQUESTS,
    ...PERMISSION_GROUPS.CATEGORIES,
    ...PERMISSION_GROUPS.FAQS,
    PERMISSIONS.NOTIFICATIONS_VIEW,
    PERMISSIONS.NOTIFICATIONS_SEND,
    PERMISSIONS.REPORTS_VIEW,
    PERMISSIONS.REPORTS_EXPORT,
    PERMISSIONS.SETTINGS_VIEW,
  ],
  
  STAFF: [
    PERMISSIONS.REQUESTS_VIEW_ALL,
    PERMISSIONS.REQUESTS_EDIT,
    PERMISSIONS.REQUESTS_CHANGE_STATUS,
    PERMISSIONS.REQUESTS_ASSIGN,
    PERMISSIONS.CATEGORIES_VIEW,
    PERMISSIONS.FAQS_VIEW,
    PERMISSIONS.NOTIFICATIONS_VIEW,
    PERMISSIONS.REPORTS_VIEW,
  ],
  
  USER: [
    PERMISSIONS.REQUESTS_VIEW_OWN,
    PERMISSIONS.REQUESTS_CREATE,
    PERMISSIONS.FAQS_VIEW,
    PERMISSIONS.NOTIFICATIONS_VIEW,
  ],
} as const;
