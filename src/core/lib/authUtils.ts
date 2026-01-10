import { jwtDecode } from 'jwt-decode';





interface DecodedToken {
  userId: string; 
  username: string;
  email: string;
  name: string;
  roleId: string | string[]; 
  permissions?: string[]; 
  exp: number; 
  iat: number; 
  [key: string]: any; 
}


export const decodeToken = (token: string): DecodedToken | null => {
  try {
    return jwtDecode<DecodedToken>(token);
  } catch (error) {
    return null;
  }
};


export const getUserPermissions = (): string[] => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        return parsed.permissions || [];
      } catch (error) {
        // JSON parse error
      }
    }

    // Fallback to token
    const token = localStorage.getItem('authToken');
    if (!token) return [];

    const decoded = decodeToken(token);
    return decoded?.permissions || [];
  } catch (error) {
    console.warn('Failed to get user permissions from localStorage', error);
    return [];
  }
};


export const getUserRoleIds = (): number[] => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      try {
        const parsed = JSON.parse(userInfo);
        return parsed.roleIds || [];
      } catch (error) {
        // JSON parse error
      }
    }

    // Fallback to token
    const token = localStorage.getItem('authToken');
    if (!token) return [];

    const decoded = decodeToken(token);
    if (decoded?.roleId) {
      // Handle both array and single value
      if (Array.isArray(decoded.roleId)) {
        return decoded.roleId.map(id => parseInt(id, 10));
      } else {
        return [parseInt(decoded.roleId, 10)];
      }
    }
    return [];
  } catch (error) {
    console.warn('Failed to get user role IDs from localStorage', error);
    return [];
  }
};


export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;

  const currentTime = Date.now() / 1000;
  return decoded.exp < currentTime;
};


export const getTokenExpiration = (token: string): Date | null => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return null;

  return new Date(decoded.exp * 1000);
};


export const hasPermission = (permissionCode: string): boolean => {
  const permissions = getUserPermissions();
  return permissions.includes(permissionCode);
};


export const hasAnyPermission = (permissionCodes: string[]): boolean => {
  const permissions = getUserPermissions();
  return permissionCodes.some((code) => permissions.includes(code));
};


export const hasAllPermissions = (permissionCodes: string[]): boolean => {
  const permissions = getUserPermissions();
  return permissionCodes.every((code) => permissions.includes(code));
};






export const hasRoleId = (roleId: number): boolean => {
  const roleIds = getUserRoleIds();
  return roleIds.includes(roleId);
};


export const hasAnyRoleId = (roleIds: number[]): boolean => {
  const userRoleIds = getUserRoleIds();
  return roleIds.some((id) => userRoleIds.includes(id));
};


export const getCurrentUser = (): DecodedToken | null => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    return decodeToken(token);
  } catch (error) {
    console.warn('Failed to get current user from localStorage', error);
    return null;
  }
};
