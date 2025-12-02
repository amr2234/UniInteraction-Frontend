import { ReactNode } from 'react';
import { useHasPermission, useHasAnyPermission, useHasAllPermissions } from '@/core/hooks/usePermissions';
import { PermissionCode } from '@/core/constants/permissions';

// ============================================
// Permission-based UI Components
// ============================================

interface PermissionGateProps {
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
   * Require ALL of these permissions (AND logic)
   */
  allPermissions?: PermissionCode[];
  /**
   * Content to show when user doesn't have permission
   */
  fallback?: ReactNode;
}

/**
 * Component to conditionally render children based on user permissions
 * 
 * @example
 * // Single permission
 * <PermissionGate permission={PERMISSIONS.USERS_VIEW}>
 *   <UsersTable />
 * </PermissionGate>
 * 
 * @example
 * // Any of multiple permissions
 * <PermissionGate anyPermission={[PERMISSIONS.USERS_VIEW, PERMISSIONS.ROLES_VIEW]}>
 *   <AdminPanel />
 * </PermissionGate>
 * 
 * @example
 * // All permissions required
 * <PermissionGate allPermissions={[PERMISSIONS.USERS_EDIT, PERMISSIONS.USERS_DELETE]}>
 *   <DangerZone />
 * </PermissionGate>
 * 
 * @example
 * // With fallback
 * <PermissionGate 
 *   permission={PERMISSIONS.USERS_VIEW} 
 *   fallback={<div>ليس لديك صلاحية</div>}
 * >
 *   <UsersTable />
 * </PermissionGate>
 */
export const PermissionGate = ({
  children,
  permission,
  anyPermission,
  allPermissions,
  fallback = null,
}: PermissionGateProps) => {
  const hasSinglePermission = useHasPermission(permission!);
  const hasAny = useHasAnyPermission(anyPermission || []);
  const hasAll = useHasAllPermissions(allPermissions || []);

  // Determine if user has access
  let hasAccess = false;

  if (permission) {
    hasAccess = hasSinglePermission;
  } else if (anyPermission && anyPermission.length > 0) {
    hasAccess = hasAny;
  } else if (allPermissions && allPermissions.length > 0) {
    hasAccess = hasAll;
  } else {
    // No permission specified, allow access
    hasAccess = true;
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface ConditionalRenderProps {
  children: (hasPermission: boolean) => ReactNode;
  permission: PermissionCode;
}

/**
 * Render prop component for more complex permission-based rendering
 * 
 * @example
 * <ConditionalRender permission={PERMISSIONS.USERS_EDIT}>
 *   {(canEdit) => (
 *     <Button disabled={!canEdit}>
 *       {canEdit ? 'تعديل' : 'عرض فقط'}
 *     </Button>
 *   )}
 * </ConditionalRender>
 */
export const ConditionalRender = ({ children, permission }: ConditionalRenderProps) => {
  const hasPermission = useHasPermission(permission);
  return <>{children(hasPermission)}</>;
};
