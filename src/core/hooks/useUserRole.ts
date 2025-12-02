import { useMemo } from 'react';
import { useUserRoleIds } from './usePermissions';
import { UserRole } from '@/core/constants/roles';

/**
 * Custom hook to check user roles
 * Returns boolean flags for each role type
 */
export function useUserRole() {
  const userRoleIds = useUserRoleIds();

  const roleChecks = useMemo(() => {
    const isSuperAdmin = userRoleIds.includes(UserRole.SUPER_ADMIN);
    const isAdmin = userRoleIds.includes(UserRole.ADMIN);
    const isEmployee = userRoleIds.includes(UserRole.EMPLOYEE);
    const isUser = userRoleIds.includes(UserRole.USER);

    return {
      isSuperAdmin,
      isAdmin,
      isEmployee,
      isUser,
      // Helper to check if user has any admin-level access
      hasAdminAccess: isSuperAdmin || isAdmin,
      // Helper to check if user has staff-level access
      hasStaffAccess: isSuperAdmin || isAdmin || isEmployee,
      // Get all role IDs
      roleIds: userRoleIds,
    };
  }, [userRoleIds]);

  return roleChecks;
}
