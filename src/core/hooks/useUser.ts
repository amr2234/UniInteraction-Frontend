import { useMemo } from 'react';
import { getCurrentUser, getUserPermissions, getUserRoleIds } from '@/core/lib/authUtils';

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


export const useIsAuthenticated = (): boolean => {
  return useMemo(() => {
    const user = getCurrentUser();
    return !!user;
  }, []);
};


export const useHasAdminAccess = (): boolean => {
  return useMemo(() => {
    const permissions = getUserPermissions();
    return permissions.some(p =>
      ['USERS_VIEW', 'ROLES_VIEW', 'CATEGORIES_VIEW'].includes(p)
    );
  }, []);
};


export const useHasSuperAdminAccess = (): boolean => {
  return useMemo(() => {
    const roleIds = getUserRoleIds();
    const permissions = getUserPermissions();
    return roleIds.includes(1) || permissions.includes('ROLES_MANAGE_PERMISSIONS');
  }, []);
};



interface UserInfo {
  userId: string;
  username: string;
  email: string;
  name: string;
  roleIds: number[];
  permissions: string[];
  isAuthenticated: boolean;
}
