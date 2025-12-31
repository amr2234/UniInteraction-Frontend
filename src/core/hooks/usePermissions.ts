import { useMemo, useSyncExternalStore } from 'react';
import { PermissionCode } from '@/core/constants/permissions';
import {
  getUserPermissions,
  getUserRoleIds,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  hasRoleId,
} from '@/core/lib/authUtils';


const useLocalStorageSubscription = () => {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('storage', callback);
      
      window.addEventListener('localStorageUpdate', callback);
      return () => {
        window.removeEventListener('storage', callback);
        window.removeEventListener('localStorageUpdate', callback);
      };
    },
    () => localStorage.getItem('userInfo'),
    () => localStorage.getItem('userInfo')
  );
};


export const useHasPermission = (permissionCode: PermissionCode): boolean => {
  
  const userInfo = useLocalStorageSubscription();

  
  return useMemo(() => {
    const result = hasPermission(permissionCode);
    return result;
  }, [permissionCode, userInfo]);
};


export const useHasAnyPermission = (permissionCodes: PermissionCode[]): boolean => {
  return useMemo(() => {
    return hasAnyPermission(permissionCodes);
  }, [permissionCodes]);
};


export const useHasAllPermissions = (permissionCodes: PermissionCode[]): boolean => {
  return useMemo(() => {
    return hasAllPermissions(permissionCodes);
  }, [permissionCodes]);
};


export const useHasRole = (roleName: string): boolean => {
  return useMemo(() => {
    
    return false;
  }, [roleName]);
};


export const useUserPermissions = (): string[] => {
  
  const userInfo = useLocalStorageSubscription();

  return useMemo(() => {
    return getUserPermissions();
  }, [userInfo]);
};


export const useUserRoles = (): string[] => {
  return useMemo(() => {
    
    return [];
  }, []);
};


export const useIsAdmin = (): boolean => {
  return useHasAnyPermission(['USERS_VIEW', 'ROLES_VIEW'] as PermissionCode[]);
};


export const useIsSuperAdmin = (): boolean => {
  return useHasPermission('ROLES_MANAGE_PERMISSIONS' as PermissionCode);
};


export const useHasRoleId = (roleId: number): boolean => {
  return useMemo(() => {
    return hasRoleId(roleId);
  }, [roleId]);
};


export const useUserRoleIds = (): number[] => {
  return useMemo(() => {
    return getUserRoleIds();
  }, []);
};
