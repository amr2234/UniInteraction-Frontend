import React, { memo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { Edit, Trash2, UserCheck, UserX, CheckCircle, XCircle } from "lucide-react";

// Types
interface User {
  id: number;
  nameAr: string;
  nameEn?: string;
  email: string;
  emailConfirmed: boolean;
  mobile?: string;
  nationalId?: string;
  studentId?: string;
  universityId?: string;
  roleId: number;
  departmentId?: number | string;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

// Memoized User Table Row
export const UserTableRow = memo(({
  user,
  language,
  t,
  getUserFullName,
  getDepartmentName,
  formatDate,
  ROLE_TRANSLATION_KEYS,
  handleEditUser,
  handleToggleActive,
  handleDeleteClick,
  isToggling,
  UserRole,
}: {
  user: User;
  language: string;
  t: (key: string) => string;
  getUserFullName: (user: User) => string;
  getDepartmentName: (departmentId: number | string) => string;
  formatDate: (date: string) => string;
  ROLE_TRANSLATION_KEYS: Record<number, string>;
  handleEditUser: (userId: number) => void;
  handleToggleActive: (user: User) => void;
  handleDeleteClick: (user: User) => void;
  isToggling: boolean;
  UserRole: any;
}) => {
  return (
    <TableRow className="hover:bg-gray-50">
      {/* Name */}
      <TableCell className="text-center overflow-hidden">
        <div>
          <p className="font-medium text-[#2B2B2B]" style={{ wordBreak: 'break-all', maxWidth: '12.5rem', marginLeft: 'auto', marginRight: 'auto' }}>
            {getUserFullName(user)}
          </p>
          {language === "en" && user.nameAr && user.nameEn && (
            <p className="text-xs text-gray-500" style={{ wordBreak: 'break-all', maxWidth: '12.5rem', marginLeft: 'auto', marginRight: 'auto' }}>
              {user.nameAr}
            </p>
          )}
          {language === "ar" && user.nameEn && (
            <p className="text-xs text-gray-500" dir="ltr" style={{ wordBreak: 'break-all', maxWidth: '12.5rem', marginLeft: 'auto', marginRight: 'auto' }}>
              {user.nameEn}
            </p>
          )}
        </div>
      </TableCell>

      {/* Role */}
      <TableCell className="text-center overflow-hidden">
        <Badge
          variant="outline"
          className={
            user.roleId === UserRole.ADMIN
              ? "border-red-500 text-red-700 bg-red-50"
              : user.roleId === UserRole.EMPLOYEE
              ? "border-blue-500 text-blue-700 bg-blue-50"
              : "border-purple-500 text-purple-700 bg-purple-50"
          }
        >
          {ROLE_TRANSLATION_KEYS[user.roleId]
            ? t(ROLE_TRANSLATION_KEYS[user.roleId])
            : t("users.roles.unknown")}
        </Badge>
      </TableCell>

      {/* Email */}
      <TableCell className="text-center overflow-hidden">
        <p style={{ wordBreak: 'break-all', maxWidth: '12.5rem', marginLeft: 'auto', marginRight: 'auto' }}>{user.email}</p>
      </TableCell>

      {/* Email Verified */}
      <TableCell className="text-center overflow-hidden">
        {user.emailConfirmed ? (
          <div className="flex items-center justify-center gap-1 text-green-600">
            <CheckCircle className="w-4 h-4" />
            <span className="text-xs">{t("users.verified")}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-1 text-gray-400">
            <XCircle className="w-4 h-4" />
            <span className="text-xs">{t("users.notVerified")}</span>
          </div>
        )}
      </TableCell>

      {/* Mobile */}
      <TableCell className="text-center overflow-hidden" dir="ltr">
        <p style={{ wordBreak: 'break-all', maxWidth: '8.125rem', marginLeft: 'auto', marginRight: 'auto' }}>{user.mobile || "-"}</p>
      </TableCell>

      {/* National ID */}
      <TableCell className="text-center overflow-hidden" dir="ltr">
        <p style={{ wordBreak: 'break-all', maxWidth: '8.125rem', marginLeft: 'auto', marginRight: 'auto' }}>{user.nationalId || "-"}</p>
      </TableCell>

      {/* Student ID */}
      <TableCell className="text-center overflow-hidden">
        <p style={{ wordBreak: 'break-all', maxWidth: '8.125rem', marginLeft: 'auto', marginRight: 'auto' }}>{user.studentId || "-"}</p>
      </TableCell>

      {/* Department */}
      <TableCell className="text-center overflow-hidden">
        <p style={{ wordBreak: 'break-all', maxWidth: '11.25rem', marginLeft: 'auto', marginRight: 'auto' }}>{user.departmentId ? getDepartmentName(user.departmentId) : "-"}</p>
      </TableCell>

      {/* Status */}
      <TableCell className="text-center overflow-hidden">
        <Badge
          variant={user.isActive ? "default" : "secondary"}
          className={
            user.isActive
              ? "bg-green-500 hover:bg-green-600 text-black"
              : "bg-gray-400 hover:bg-gray-500 text-black"
          }
        >
          {user.isActive ? t("users.active") : t("users.inactive")}
        </Badge>
      </TableCell>

      {/* Created Date */}
      <TableCell className="text-center overflow-hidden" dir="ltr">
        {formatDate(user.createdAt)}
      </TableCell>

      {/* Actions */}
      <TableCell className="text-center">
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditUser(user.id)}
            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleToggleActive(user)}
            disabled={isToggling}
            className={
              user.isActive
                ? "text-green-600 hover:text-green-800 hover:bg-green-50"
                : "text-orange-600 hover:text-orange-800 hover:bg-orange-50"
            }
          >
            {user.isActive ? (
              <UserCheck className="w-4 h-4" />
            ) : (
              <UserX className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDeleteClick(user)}
            disabled={user.roleId === UserRole.SUPER_ADMIN}
            className="text-red-600 hover:text-red-800 hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
            title={user.roleId === UserRole.SUPER_ADMIN ? t("users.cannotDeleteSuperAdmin") : t("common.delete")}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
});

UserTableRow.displayName = "UserTableRow";

// Memoized Loading Skeleton Row
export const UserTableRowSkeleton = memo(() => {
  return (
    <TableRow>
      {[...Array(11)].map((_, i) => (
        <TableCell key={i} className="text-center">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mx-auto w-20"></div>
          </div>
        </TableCell>
      ))}
    </TableRow>
  );
});

UserTableRowSkeleton.displayName = "UserTableRowSkeleton";

// Memoized Empty State Row
export const UserTableEmptyRow = memo(({ 
  t, 
  colSpan 
}: { 
  t: (key: string) => string;
  colSpan: number;
}) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="text-center py-12">
        <div className="flex flex-col items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">{t("users.noUsersFound")}</p>
          <p className="text-sm text-gray-500">{t("users.tryAdjustingFilters")}</p>
        </div>
      </TableCell>
    </TableRow>
  );
});

UserTableEmptyRow.displayName = "UserTableEmptyRow";
