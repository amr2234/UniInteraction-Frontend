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

// ============================================
// Permission Checking Hooks (JWT-based)
// ============================================

// Custom hook to subscribe to localStorage changes
const useLocalStorageSubscription = () => {
  return useSyncExternalStore(
    (callback) => {
      window.addEventListener('storage', callback);
      // Also listen for custom event when localStorage is updated in same tab
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

/**
 * Hook to check if current user has a specific permission
 * Reads directly from JWT token in localStorage
 * @param permissionCode - The permission code to check
 * @returns boolean indicating if user has permission
 */
export const useHasPermission = (permissionCode: PermissionCode): boolean => {
  // Subscribe to localStorage changes
  const userInfo = useLocalStorageSubscription();
  
  // Re-compute when localStorage changes
  return useMemo(() => {
    const result = hasPermission(permissionCode);
    return result;
  }, [permissionCode, userInfo]);
};

/**
 * Hook to check if current user has ANY of the specified permissions
 * @param permissionCodes - Array of permission codes
 * @returns boolean indicating if user has at least one permission
 */
export const useHasAnyPermission = (permissionCodes: PermissionCode[]): boolean => {
  return useMemo(() => {
    return hasAnyPermission(permissionCodes);
  }, [permissionCodes]);
};

/**
 * Hook to check if current user has ALL of the specified permissions
 * @param permissionCodes - Array of permission codes
 * @returns boolean indicating if user has all permissions
 */
export const useHasAllPermissions = (permissionCodes: PermissionCode[]): boolean => {
  return useMemo(() => {
    return hasAllPermissions(permissionCodes);
  }, [permissionCodes]);
};

/**
 * Hook to check if current user has a specific role
 * @param roleName - The role name to check
 * @returns boolean indicating if user has role
 */
export const useHasRole = (roleName: string): boolean => {
  return useMemo(() => {
    // Since we now only have role IDs, we can't check by role name directly
    return false;
  }, [roleName]);
};

/**
 * Hook to get all current user's permissions from JWT
 * @returns Array of permission codes
 */
export const useUserPermissions = (): string[] => {
  // Subscribe to localStorage changes
  const userInfo = useLocalStorageSubscription();
  
  return useMemo(() => {
    return getUserPermissions();
  }, [userInfo]);
};

/**
 * Hook to get all current user's roles from JWT
 * @returns Array of role names
 */
export const useUserRoles = (): string[] => {
  return useMemo(() => {
    // Since we now only have role IDs, we can't return role names
    return [];
  }, []);
};

/**
 * Hook to check if user is admin (has USERS_VIEW or ROLES_VIEW permission)
 * @returns boolean indicating if user is admin
 */
export const useIsAdmin = (): boolean => {
  return useHasAnyPermission(['USERS_VIEW', 'ROLES_VIEW'] as PermissionCode[]);
};

/**
 * Hook to check if user is super admin (has ROLES_MANAGE_PERMISSIONS permission)
 * @returns boolean indicating if user is super admin
 */
export const useIsSuperAdmin = (): boolean => {
  return useHasPermission('ROLES_MANAGE_PERMISSIONS' as PermissionCode);
};

/**
 * Hook to check if current user has a specific role ID
 * @param roleId - The role ID to check
 * @returns boolean indicating if user has role ID
 */
export const useHasRoleId = (roleId: number): boolean => {
  return useMemo(() => {
    return hasRoleId(roleId);
  }, [roleId]);
};

/**
 * Hook to get all current user's role IDs from JWT
 * @returns Array of role IDs
 */
export const useUserRoleIds = (): number[] => {
  return useMemo(() => {
    return getUserRoleIds();
  }, []);
};
