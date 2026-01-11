import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useI18n } from "@/i18n";
import { useUserManagement } from "./UserManagement.logic";
import { UserRole } from "@/core/constants/roles";
import { UserTableRow, UserTableRowSkeleton, UserTableEmptyRow } from "./UserManagement.components";

export function UserManagement() {
  const { t, language } = useI18n();
  const {
    users,
    totalCount,
    totalPages,
    currentPage,
    isLoading,
    searchTerm,
    statusFilter,
    departmentFilter,
    roleFilter,
    departments,
    isDeleteDialogOpen,
    selectedUser,
    isDeleting,
    isToggling,
    handleSearchChange,
    handleStatusFilterChange,
    handleDepartmentFilterChange,
    handleRoleFilterChange,
    handlePageChange,
    handleAddUser,
    handleEditUser,
    handleToggleActive,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    formatDate,
    getDepartmentName,
    getUserFullName,
    ROLE_TRANSLATION_KEYS,
  } = useUserManagement();

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="max-w-[95%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Dashboard Button */}
        <Button
          variant="ghost"
          onClick={() => window.location.href = '/dashboard'}
          className="mb-4 gap-2"
        >
          <ArrowRight className="w-5 h-5" />
          {t("navigation.goToDashboard")}
        </Button>

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-[#2B2B2B] mb-2">{t("users.manageUsers")}</h1>
            <p className="text-[#6F6F6F]">{t("users.manageUsersDesc")}</p>
          </div>
          <Button
            onClick={handleAddUser}
            className="bg-[#6CAEBD] hover:bg-[#6CAEBD]/90 gap-2 rounded-xl"
          >
            <Plus className="w-5 h-5" />
            {t("users.addNewUser")}
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6 rounded-xl border-0 shadow-soft bg-white">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
              <Input
                placeholder={t("users.searchUsers")}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pr-10 rounded-xl"
              />
            </div>

            <Select value={roleFilter} onValueChange={handleRoleFilterChange}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={t("users.role")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("users.allRoles")}</SelectItem>
                <SelectItem value="2">{t("users.roles.admin")}</SelectItem>
                <SelectItem value="3">{t("users.roles.employee")}</SelectItem>
                <SelectItem value="4">{t("users.roles.visitor")}</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={statusFilter}
              onValueChange={handleStatusFilterChange}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={t("form.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("users.allStatuses")}</SelectItem>
                <SelectItem value="active">{t("users.active")}</SelectItem>
                <SelectItem value="inactive">{t("users.inactive")}</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={departmentFilter}
              onValueChange={handleDepartmentFilterChange}
            >
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={t("form.department")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("users.allDepartments")}</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {language === "ar"
                      ? dept.nameAr
                      : dept.nameEn || dept.nameAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Users Table */}
        <Card className="rounded-xl border-0 shadow-soft bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-center font-semibold text-gray-700 w-[200px]">
                    {t("form.fullName")}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[120px]">
                    {t("users.role")}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[200px]">
                    {t("form.email")}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[120px]">
                    {t("users.emailVerified")}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[130px]">
                    {t("form.mobile")}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[130px]">
                    {t("form.nationalId")}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[130px]">
                    {t("form.studentId")}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[180px]">
                    {t("form.department")}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[120px]">
                    {t("form.status")}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[130px]">
                    {t("users.createdAt")}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[120px]">
                    {t("users.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <UserTableRowSkeleton key={i} />
                  ))
                ) : users.length === 0 ? (
                  <UserTableEmptyRow t={t} colSpan={11} />
                ) : (
                  users.map((user) => (
                    <UserTableRow
                      key={user.id}
                      user={user}
                      language={language}
                      t={t}
                      getUserFullName={getUserFullName}
                      getDepartmentName={getDepartmentName}
                      formatDate={formatDate}
                      ROLE_TRANSLATION_KEYS={ROLE_TRANSLATION_KEYS}
                      handleEditUser={handleEditUser}
                      handleToggleActive={handleToggleActive}
                      handleDeleteClick={handleDeleteClick}
                      isToggling={isToggling}
                      UserRole={UserRole}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-600">
                {t("common.showing")} {(currentPage - 1) * 10 + 1} -{" "}
                {Math.min(currentPage * 10, totalCount)} {t("common.of")}{" "}
                {totalCount}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-xl"
                >
                  <ChevronRight className="w-4 h-4" />
                  {t("common.previous")}
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`rounded-xl min-w-[40px] ${
                          currentPage === page
                            ? "bg-[#6CAEBD] hover:bg-[#6CAEBD]/90 text-white"
                            : ""
                        }`}
                      >
                        {page}
                      </Button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-xl"
                >
                  {t("common.next")}
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={handleDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("users.deleteUser")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("users.deleteConfirm")}{" "}
              <span className="font-semibold text-[#2B2B2B]">
                " {selectedUser ? getUserFullName(selectedUser) : ""} "
              </span>
              ؟
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? t("common.loading") : t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
