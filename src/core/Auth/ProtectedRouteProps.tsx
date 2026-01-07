import { ReactNode } from 'react';
import { PermissionCode } from '../constants/permissions';

export interface ProtectedRouteProps {
  children: ReactNode;
  permission?: PermissionCode;
  anyPermission?: PermissionCode[];
  roleId?: number;
  anyRoleId?: number[];
  redirectTo?: string;
  showAccessDenied?: boolean;
}

