import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Badge } from "@/components/ui/badge";
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
import { Switch } from "@/components/ui/switch";
import { Plus, Search, Edit, Trash2, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useDepartmentManagement } from "./DepartmentManagement.logic";
import { useI18n } from "@/i18n";

export function DepartmentManagement() {
  const { t } = useI18n();
  const {
    departments,
    totalCount,
    totalPages,
    currentPage,
    isLoading,
    searchTerm,
    statusFilter,
    isDeleteDialogOpen,
    selectedDepartment,
    isDeleting,
    isToggling,
    handleSearchChange,
    handleStatusFilterChange,
    handlePageChange,
    handleAddDepartment,
    handleEditDepartment,
    handleToggleActive,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    formatDate,
  } = useDepartmentManagement();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <p className="text-[#6F6F6F]">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <h1 className="text-[#2B2B2B] mb-2">{t("departments.manageDepartments")}</h1>
            <p className="text-[#6F6F6F]">{t("departments.manageDepartmentsDesc")}</p>
          </div>
          <Button
            onClick={handleAddDepartment}
            className="bg-[#6CAEBD] hover:bg-[#6CAEBD]/90 gap-2 rounded-xl"
          >
            <Plus className="w-5 h-5" />
            {t("departments.addNewDepartment")}
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-soft mb-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
              <Input
                placeholder={t("departments.searchDepartments")}
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pr-10 rounded-xl"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={t("form.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("departments.allDepartments")}</SelectItem>
                <SelectItem value="active">{t("departments.active")}</SelectItem>
                <SelectItem value="inactive">{t("departments.inactive")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-center font-semibold text-gray-700 w-[80px]">#</TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[300px]">{t("departments.departmentName")} ({t("form.nameAr")})</TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[300px]">{t("departments.departmentName")} ({t("form.nameEn")})</TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[200px]">{t("form.status")}</TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[150px]">{t("departments.createdAt")}</TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[120px]">{t("users.actions")}</TableHead>
                </TableRow>
              </TableHeader>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                    {t("common.noData")}
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((department, index) => (
                  <TableRow key={department.id} className="hover:bg-gray-50">
                    <TableCell className="text-center font-medium">
                      {(currentPage - 1) * 10 + index + 1}
                    </TableCell>
                    <TableCell className="text-center overflow-hidden">
                      <p className="font-medium text-[#2B2B2B]" style={{ wordBreak: 'break-all', maxWidth: '18.75rem', marginLeft: 'auto', marginRight: 'auto' }}>{department.nameAr}</p>
                    </TableCell>
                    <TableCell className="text-center overflow-hidden" dir="ltr">
                      <p className="text-[#6F6F6F]" style={{ wordBreak: 'break-all', maxWidth: '18.75rem', marginLeft: 'auto', marginRight: 'auto' }}>{department.nameEn || "-"}</p>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Switch
                          checked={department.isActive}
                          onCheckedChange={() => handleToggleActive(department)}
                          disabled={isToggling}
                        />
                        <Badge
                          variant={department.isActive ? "default" : "secondary"}
                          className={
                            department.isActive
                              ? "bg-green-500 hover:bg-green-600 text-black"
                              : "bg-gray-400 hover:bg-gray-500 text-black"
                          }
                        >
                          {department.isActive ? t("departments.active") : t("departments.inactive")}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-[#6F6F6F]" dir="ltr">
                      {formatDate(department.createdAt)}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDepartment(department.id)}
                          className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(department)}
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
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={handleDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("departments.deleteDepartment")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("departments.deleteConfirm")}{" "}
              <span className="font-semibold text-[#2B2B2B]">
                "{selectedDepartment?.nameAr}"
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
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? t("common.deleting") : t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
