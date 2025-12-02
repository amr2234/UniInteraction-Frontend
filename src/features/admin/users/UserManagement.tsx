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
import { Search, Plus, Edit, Trash2, UserCheck, UserX } from "lucide-react";
import { useI18n } from "@/i18n";
import { useUserManagement, UserRole, RoleLabels } from "./UserManagement.logic";

export function UserManagement() {
  const { t } = useI18n();
  const {
    users,
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
    handleAddUser,
    handleEditUser,
    handleToggleActive,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    formatDate,
  } = useUserManagement();

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                <SelectItem value="1">{t("users.roles.admin")}</SelectItem>
                <SelectItem value="2">{t("users.roles.employee")}</SelectItem>
                <SelectItem value="3">{t("users.roles.visitor")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={t("form.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("users.allStatuses")}</SelectItem>
                <SelectItem value="active">{t("users.active")}</SelectItem>
                <SelectItem value="inactive">{t("users.inactive")}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={handleDepartmentFilterChange}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={t("form.department")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("users.allDepartments")}</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Table */}
        <Card className="rounded-xl border-0 shadow-soft bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-right font-semibold text-gray-700">{t("form.fullName")}</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">{t("users.role")}</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">{t("form.email")}</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">{t("form.mobile")}</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">{t("form.nationalId")}</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">{t("form.studentId")}</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">{t("form.department")}</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">{t("form.status")}</TableHead>
                  <TableHead className="text-right font-semibold text-gray-700">{t("users.createdAt")}</TableHead>
                  <TableHead className="text-center font-semibold text-gray-700">{t("users.actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                      {t("common.loading")}
                    </TableCell>
                  </TableRow>
                ) : users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-gray-500">
                      {t("common.noData")}
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id} className="hover:bg-gray-50">
                      <TableCell className="text-right">
                        <div>
                          <p className="font-medium text-[#2B2B2B]">{user.nameAr}</p>
                          {user.nameEn && (
                            <p className="text-xs text-gray-500">{user.nameEn}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant="outline"
                          className={
                            user.roleId === UserRole.Admin
                              ? "border-red-500 text-red-700 bg-red-50"
                              : user.roleId === UserRole.Employee
                              ? "border-blue-500 text-blue-700 bg-blue-50"
                              : "border-purple-500 text-purple-700 bg-purple-50"
                          }
                        >
                          {RoleLabels[user.roleId as UserRole] ? t(RoleLabels[user.roleId as UserRole]) : t("users.roles.visitor")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{user.email}</TableCell>
                      <TableCell className="text-right" dir="ltr">{user.mobile || "-"}</TableCell>
                      <TableCell className="text-right" dir="ltr">{user.nationalId || "-"}</TableCell>
                      <TableCell className="text-right">{user.studentId || "-"}</TableCell>
                      <TableCell className="text-right">{user.departmentId || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={user.isActive ? "default" : "secondary"}
                          className={user.isActive ? "bg-green-500" : "bg-gray-400"}
                        >
                          {user.isActive ? t("users.active") : t("users.inactive")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">{formatDate(user.createdAt)}</TableCell>
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
                            className={user.isActive ? "text-orange-600 hover:text-orange-800 hover:bg-orange-50" : "text-green-600 hover:text-green-800 hover:bg-green-50"}
                          >
                            {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(user)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={handleDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("messages.confirmDelete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("users.deleteConfirm")} "{selectedUser?.nameAr}"؟ {t("messages.confirmDelete")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? t("common.deleting") : t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
