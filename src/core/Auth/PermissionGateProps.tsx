import { ReactNode } from "react";
import { PermissionCode } from "../constants/permissions";

export interface PermissionGateProps {
  children: ReactNode;
  permission?: PermissionCode;
  anyPermission?: PermissionCode[];
  allPermissions?: PermissionCode[];
  fallback?: ReactNode;
}