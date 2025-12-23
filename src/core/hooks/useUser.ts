import { useMemo } from 'react';
import { getCurrentUser, getUserPermissions, getUserRoleIds } from '@/core/lib/authUtils';

// ============================================
// User Information Hook
// ============================================

interface UserInfo {
  userId: string;
  username: string;
  email: string;
  name: string;
  roleIds: number[];
  permissions: string[];
  isAuthenticated: boolean;
}


export const useUser = (): UserInfo => {
  return useMemo(() => {
    const currentUser = getCurrentUser();
    const permissions = getUserPermissions();
    const roleIds = getUserRoleIds();

    if (!currentUser) {
      return {
        userId: '',
        username: '',
        email: '',
        name: '',
        roleIds: [],
        permissions: [],
        isAuthenticated: false,
      };
    }

    return {
      userId: currentUser.userId || '',
      username: currentUser.username || '',
      email: currentUser.email || '',
      name: currentUser.name || '',
      roleIds,
      permissions,
      isAuthenticated: true,
    };
  }, []);
};

/**
 * Hook to check if user is authenticated
 */
export const useIsAuthenticated = (): boolean => {
  return useMemo(() => {
    const user = getCurrentUser();
    return !!user;
  }, []);
};

/**
 * Hook to check if user has admin access (has admin permissions)
 */
export const useHasAdminAccess = (): boolean => {
  return useMemo(() => {
    const permissions = getUserPermissions();
    return permissions.some(p => 
      ['USERS_VIEW', 'ROLES_VIEW', 'CATEGORIES_VIEW'].includes(p)
    );
  }, []);
};

/**
 * Hook to check if user has super admin access (role ID = 1 or has ROLES_MANAGE_PERMISSIONS)
 */
export const useHasSuperAdminAccess = (): boolean => {
  return useMemo(() => {
    const roleIds = getUserRoleIds();
    const permissions = getUserPermissions();
    return roleIds.includes(1) || permissions.includes('ROLES_MANAGE_PERMISSIONS');
  }, []);
};
