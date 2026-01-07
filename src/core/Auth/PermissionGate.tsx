import { ReactNode } from 'react';
import { useHasPermission, useHasAnyPermission, useHasAllPermissions } from '@/core/hooks/usePermissions';
import { PermissionCode } from '@/core/constants/permissions';
import { PermissionGateProps } from './PermissionGateProps';



export const PermissionGate = ({
  children,
  permission,
  anyPermission,
  allPermissions,
  fallback = null,
}: PermissionGateProps) => {
  const hasSinglePermission = useHasPermission(permission!);
  const hasAny = useHasAnyPermission(anyPermission || []);
  const hasAll = useHasAllPermissions(allPermissions || []);


  let hasAccess = false;

  if (permission) {
    hasAccess = hasSinglePermission;
  } else if (anyPermission && anyPermission.length > 0) {
    hasAccess = hasAny;
  } else if (allPermissions && allPermissions.length > 0) {
    hasAccess = hasAll;
  } else {

    hasAccess = true;
  }

  if (!hasAccess) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

interface ConditionalRenderProps {
  children: (hasPermission: boolean) => ReactNode;
  permission: PermissionCode;
}


export const ConditionalRender = ({ children, permission }: ConditionalRenderProps) => {
  const hasPermission = useHasPermission(permission);
  return <>{children(hasPermission)}</>;
};
