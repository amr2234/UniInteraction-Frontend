// ============================================
// Centralized exports for all API hooks
// ============================================

// Authentication
export * from '@/features/auth/hooks/useAuth';

// User Information & Permissions
export * from './useUser';
export * from './usePermissions';
export * from './useUserRole';

// Constants (for convenience)
export { PERMISSIONS } from '@/core/constants/permissions';
export { UserRole } from '@/core/constants/roles';

// Requests
export * from '@/features/requests/hooks/useRequests';

// Lookups
export * from '@/features/lookups/hooks/useLookups';

// Notifications
export * from '@/features/notifications/hooks/useNotifications';

// FAQs (Admin)
export * from '@/features/admin/faqs/hooks/useFaqs';

// Leadership
export * from '@/features/admin/leadership/hooks/useLeadership';

// Users (Admin)
export * from '@/features/admin/users/hooks/useUsers';

// Categories (Admin)
export * from '@/features/admin/categories/hooks/useCategories';
