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
import { Plus, Search, Edit, Trash2 } from "lucide-react";
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
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[#2B2B2B] mb-2">إدارة الأقسام</h1>
          <p className="text-[#6F6F6F]">إدارة أقسام الجامعة</p>
        </div>

        {/* Filters and Actions */}
        <div className="bg-white p-6 rounded-xl shadow-soft mb-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
              <Input
                placeholder="ابحث عن قسم..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pr-10 rounded-xl"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-full md:w-48 rounded-xl">
                <SelectValue placeholder="حالة القسم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الأقسام</SelectItem>
                <SelectItem value="active">نشط</SelectItem>
                <SelectItem value="inactive">غير نشط</SelectItem>
              </SelectContent>
            </Select>

            {/* Add Button */}
            <Button
              onClick={handleAddDepartment}
              className="bg-[#6CAEBD] hover:bg-[#6CAEBD]/90 rounded-xl gap-2"
            >
              <Plus className="w-5 h-5" />
              إضافة قسم
            </Button>
          </div>

          {/* Results Summary */}
          <div className="text-sm text-[#6F6F6F]">
            عرض {departments.length} من أصل {totalCount} قسم
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#F8F9FA]">
                <TableHead className="text-right">#</TableHead>
                <TableHead className="text-right">اسم القسم (عربي)</TableHead>
                <TableHead className="text-right">اسم القسم (إنجليزي)</TableHead>
                <TableHead className="text-right">الكود</TableHead>
                <TableHead className="text-right">الحالة</TableHead>
                <TableHead className="text-right">تاريخ الإنشاء</TableHead>
                <TableHead className="text-right">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-[#6F6F6F]">
                    لا توجد بيانات
                  </TableCell>
                </TableRow>
              ) : (
                departments.map((department, index) => (
                  <TableRow key={department.id} className="hover:bg-[#F8F9FA]/50">
                    <TableCell className="font-medium">
                      {(currentPage - 1) * 10 + index + 1}
                    </TableCell>
                    <TableCell className="font-medium text-[#2B2B2B]">
                      {department.nameAr}
                    </TableCell>
                    <TableCell className="text-[#6F6F6F]" dir="ltr">
                      {department.nameEn || "-"}
                    </TableCell>
                    <TableCell className="text-[#6F6F6F]">
                      {department.code || "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={department.isActive}
                          onCheckedChange={() => handleToggleActive(department)}
                          disabled={isToggling}
                        />
                        <Badge
                          variant={department.isActive ? "default" : "secondary"}
                          className={
                            department.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        >
                          {department.isActive ? "نشط" : "غير نشط"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="text-[#6F6F6F]">
                      {formatDate(department.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDepartment(department.id)}
                          className="hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(department)}
                          className="hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                onClick={() => handlePageChange(page)}
                className={
                  currentPage === page
                    ? "bg-[#6CAEBD] hover:bg-[#6CAEBD]/90"
                    : ""
                }
              >
                {page}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={handleDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>تأكيد الحذف</AlertDialogTitle>
            <AlertDialogDescription>
              هل أنت متأكد من حذف القسم{" "}
              <span className="font-semibold text-[#2B2B2B]">
                "{selectedDepartment?.nameAr}"
              </span>
              ؟ لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>إلغاء</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? "جاري الحذف..." : "حذف"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
