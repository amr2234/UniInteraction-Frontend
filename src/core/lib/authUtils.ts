import { jwtDecode } from 'jwt-decode';

// ============================================
// JWT Token & Auth Utils
// ============================================

interface DecodedToken {
  userId: string; // User ID
  username: string;
  email: string;
  name: string;
  roleId: string | string[]; // Role IDs (can be multiple)
  permissions?: string[]; // Permission codes
  exp: number; // Expiration timestamp
  iat: number; // Issued at timestamp
  [key: string]: any; // Allow additional claims
}

/**
 * Decode JWT token and extract user info with permissions
 */
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
};

/**
 * Get current user's permissions from localStorage (fetched from API after login)
 */
export const getUserPermissions = (): string[] => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo);
      return parsed.permissions || [];
    } catch (error) {
      console.error('Failed to parse userInfo:', error);
    }
  }
  
  // Fallback to token permissions if userInfo is not available
  const token = localStorage.getItem('authToken');
  if (!token) return [];

  const decoded = decodeToken(token);
  return decoded?.permissions || [];
};

/**
 * Get current user's role IDs from localStorage (more reliable than token)
 */
export const getUserRoleIds = (): number[] => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    try {
      const parsed = JSON.parse(userInfo);
      return parsed.roleIds || [];
    } catch (error) {
      console.error('Failed to parse userInfo:', error);
    }
  }
  
  // Fallback to token roleIds if userInfo is not available
  const token = localStorage.getItem('authToken');
  if (!token) return [];

  const decoded = decodeToken(token);
  if (decoded?.roleId) {
    // Handle both single roleId and array of roleIds
    if (Array.isArray(decoded.roleId)) {
      return decoded.roleId.map(id => parseInt(id, 10));
    } else {
      return [parseInt(decoded.roleId, 10)];
    }
  }
  return [];
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};

/**
 * Get token expiration time
 */
export const getTokenExpiration = (token: string): Date | null => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return null;

  return new Date(decoded.exp * 1000);
};

/**
 * Check if user has a specific permission
 */
export const hasPermission = (permissionCode: string): boolean => {
  const permissions = getUserPermissions();
  return permissions.includes(permissionCode);
};

/**
 * Check if user has any of the specified permissions
 */
export const hasAnyPermission = (permissionCodes: string[]): boolean => {
  const permissions = getUserPermissions();
  return permissionCodes.some((code) => permissions.includes(code));
};

/**
 * Check if user has all of the specified permissions
 */
export const hasAllPermissions = (permissionCodes: string[]): boolean => {
  const permissions = getUserPermissions();
  return permissionCodes.every((code) => permissions.includes(code));
};

/**
 * Check if user has a specific role
 */
export const hasRole = (roleName: string): boolean => {
  // Since we now only have role IDs, we can't check by role name directly
  // This function is kept for backward compatibility but will always return false
  return false;
};

/**
 * Check if user has any of the specified roles
 */
export const hasAnyRole = (roleNames: string[]): boolean => {
  // Since we now only have role IDs, we can't check by role name directly
  // This function is kept for backward compatibility but will always return false
  return false;
};

/**
 * Check if user has a specific role ID
 */
export const hasRoleId = (roleId: number): boolean => {
  const roleIds = getUserRoleIds();
  return roleIds.includes(roleId);
};

/**
 * Check if user has any of the specified role IDs
 */
export const hasAnyRoleId = (roleIds: number[]): boolean => {
  const userRoleIds = getUserRoleIds();
  return roleIds.some((id) => userRoleIds.includes(id));
};

/**
 * Get current user info from token
 */
export const getCurrentUser = (): DecodedToken | null => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  return decodeToken(token);
};
