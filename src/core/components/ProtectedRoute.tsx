import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useHasPermission, useHasAnyPermission, useHasRoleId } from '@/core/hooks/usePermissions';
import { PermissionCode } from '@/core/constants/permissions';
import { authApi } from '@/features/auth/api/auth.api';
import { useI18n } from '@/i18n';

// ============================================
// Protected Route Components
// ============================================

interface ProtectedRouteProps {
  children: ReactNode;
  /**
   * Single permission required
   */
  permission?: PermissionCode;
  /**
   * Require ANY of these permissions (OR logic)
   */
  anyPermission?: PermissionCode[];
  /**
   * Require specific role ID
   */
  roleId?: number;
  /**
   * Require ANY of these role IDs
   */
  anyRoleId?: number[];
  /**
   * Redirect path when access is denied
   */
  redirectTo?: string;
  /**
   * Show "Access Denied" page instead of redirecting
   */
  showAccessDenied?: boolean;
}

/**
 * Protected Route Component - Protects routes based on permissions or roles
 * 
 * @example
 * // Protect by permission
 * <ProtectedRoute permission="USERS_VIEW">
 *   <UserManagement />
 * </ProtectedRoute>
 * 
 * @example
 * // Protect by any permission
 * <ProtectedRoute anyPermission={["USERS_VIEW", "ROLES_VIEW"]}>
 *   <AdminPanel />
 * </ProtectedRoute>
 * 
 * @example
 * // Protect by role ID
 * <ProtectedRoute roleId={1}>
 *   <SuperAdminPanel />
 * </ProtectedRoute>
 * 
 * @example
 * // Protect by any role ID
 * <ProtectedRoute anyRoleId={[1, 2]}>
 *   <AdminPanel />
 * </ProtectedRoute>
 */
export const ProtectedRoute = ({
  children,
  permission,
  anyPermission,
  roleId,
  anyRoleId,
  redirectTo = '/dashboard',
  showAccessDenied = false,
}: ProtectedRouteProps) => {
  // Check if user is authenticated
  const isAuthenticated = authApi.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check permissions/roles
  const hasSinglePermission = useHasPermission(permission!);
  const hasAny = useHasAnyPermission(anyPermission || []);
  const hasSingleRole = useHasRoleId(roleId!);
  
  // Check if user has any of the specified role IDs
  let hasAnyRole = false;
  if (anyRoleId && anyRoleId.length > 0) {
    const userRoleIds = authApi.getUserInfo()?.roleIds || [];
    hasAnyRole = anyRoleId.some((id) => userRoleIds.includes(id));
  }

  // Determine if user has access
  let hasAccess = false;

  if (permission) {
    hasAccess = hasSinglePermission;
  } else if (anyPermission && anyPermission.length > 0) {
    hasAccess = hasAny;
  } else if (roleId !== undefined) {
    hasAccess = hasSingleRole;
  } else if (anyRoleId && anyRoleId.length > 0) {
    hasAccess = hasAnyRole;
  } else {
    // No permission/role specified, allow access if authenticated
    hasAccess = true;
  }

  if (!hasAccess) {
    if (showAccessDenied) {
      return <AccessDeniedPage />;
    }
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

/**
 * Access Denied Page Component
 */
const AccessDeniedPage = () => {
  const { t } = useI18n();
  
  return (
    <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-8">
        <div className="bg-white rounded-xl shadow-soft p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#2B2B2B] mb-2">
            {t("auth.accessDenied")}
          </h2>
          <p className="text-[#6F6F6F] mb-6">
            {t("auth.noPermissionAccess")}
          </p>
          <div className="space-y-3">
            <a
              href="/dashboard"
              className="block w-full px-4 py-2 bg-[#6CAEBD] text-white rounded-lg hover:bg-[#5a9aaa] transition"
            >
              {t("navigation.goToDashboard")}
            </a>
            <a
              href="/"
              className="block w-full px-4 py-2 bg-gray-100 text-[#6F6F6F] rounded-lg hover:bg-gray-200 transition"
            >
              {t("navigation.goToHome")}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

interface AuthenticatedRouteProps {
  children: ReactNode;
  redirectTo?: string;
}

/**
 * Simple authenticated route - only checks if user is logged in
 */
export const AuthenticatedRoute = ({
  children,
  redirectTo = '/login',
}: AuthenticatedRouteProps) => {
  const isAuthenticated = authApi.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};
