import { useMemo } from 'react';
import { useUserRoleIds } from './usePermissions';
import { UserRole } from '@/core/constants/roles';


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
      
      hasAdminAccess: isSuperAdmin || isAdmin,
      
      hasStaffAccess: isSuperAdmin || isAdmin || isEmployee,
      
      roleIds: userRoleIds,
    };
  }, [userRoleIds]);

  return roleChecks;
}
