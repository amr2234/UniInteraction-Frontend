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
import { Switch } from "@/components/ui/switch";
import { Search, Plus, Edit, Trash2, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useLeadershipManagement } from "./LeadershipManagement.logic";
import { useI18n } from "@/i18n";

export function LeadershipManagement() {
  const { t } = useI18n();
  const {
    leadership,
    totalCount,
    totalPages,
    currentPage,
    isLoading,
    searchTerm,
    statusFilter,
    departmentFilter,
    departments,
    isDeleteDialogOpen,
    selectedLeader,
    isDeleting,
    isToggling,
    handleSearchChange,
    handleStatusFilterChange,
    handleDepartmentFilterChange,
    handlePageChange,
    handleAddLeader,
    handleEditLeader,
    handleToggleActive,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    formatDate,
    getDepartmentName,
  } = useLeadershipManagement();

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
            <h1 className="text-[#2B2B2B] mb-2">{t("leadership.manageLeadership")}</h1>
            <p className="text-[#6F6F6F]">{t("leadership.manageLeadershipDesc")}</p>
          </div>
          <Button
            onClick={handleAddLeader}
            className="bg-[#6CAEBD] hover:bg-[#6CAEBD]/90 gap-2 rounded-xl"
          >
            <Plus className="w-5 h-5" />
            {t("leadership.addNewLeader")}
          </Button>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6 rounded-xl border-0 shadow-soft bg-white">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
              <Input
                placeholder={t("leadership.searchLeadership")}
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
                <SelectItem value="all">{t("leadership.allLeadership")}</SelectItem>
                <SelectItem value="active">{t("leadership.active")}</SelectItem>
                <SelectItem value="inactive">{t("leadership.inactive")}</SelectItem>
              </SelectContent>
            </Select>

            {/* Department Filter */}
            <Select value={departmentFilter} onValueChange={handleDepartmentFilterChange}>
              <SelectTrigger className="rounded-xl">
                <SelectValue placeholder={t("form.department")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("leadership.allDepartments")}</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id.toString()}>
                    {dept.nameAr}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Table */}
        <Card className="rounded-xl border-0 shadow-soft bg-white overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full table-fixed">
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="text-center font-semibold text-gray-700 w-[50px]">#</TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[250px]">
                    {t("leadership.leaderName")}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[250px]">
                    {t("leadership.leaderPosition")}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[200px]">
                    {t("form.department")}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[150px]">
                    {t("form.status")}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[150px]">
                    {t("leadership.createdAt")}
                  </TableHead>
                  <TableHead className="text-center font-semibold text-gray-700 w-[120px]">
                    {t("users.actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadership.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      {t("common.noData")}
                    </TableCell>
                  </TableRow>
                ) : (
                  leadership.map((leader, index) => (
                    <TableRow key={leader.id} className="hover:bg-gray-50">
                      <TableCell className="text-center font-medium">
                        {(currentPage - 1) * 10 + index + 1}
                      </TableCell>
                      <TableCell className="text-center overflow-hidden">
                        <div>
                          <p className="font-medium text-[#2B2B2B]" style={{ wordBreak: 'break-all', maxWidth: '15.625rem', marginLeft: 'auto', marginRight: 'auto' }}>
                            {leader.nameAr}
                          </p>
                          {leader.nameEn && (
                            <p className="text-xs text-gray-500" dir="ltr" style={{ wordBreak: 'break-all', maxWidth: '15.625rem', marginLeft: 'auto', marginRight: 'auto' }}>
                              {leader.nameEn}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center overflow-hidden">
                        <div>
                          <p className="text-[#2B2B2B]" style={{ wordBreak: 'break-all', maxWidth: '15.625rem', marginLeft: 'auto', marginRight: 'auto' }}>{leader.positionTitleAr}</p>
                          {leader.positionTitleEn && (
                            <p className="text-xs text-gray-500" dir="ltr" style={{ wordBreak: 'break-all', maxWidth: '15.625rem', marginLeft: 'auto', marginRight: 'auto' }}>
                              {leader.positionTitleEn}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center overflow-hidden">
                        <p style={{ wordBreak: 'break-all', maxWidth: '12.5rem', marginLeft: 'auto', marginRight: 'auto' }}>{getDepartmentName(leader.departmentId)}</p>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Switch
                            checked={leader.isActive}
                            onCheckedChange={() => handleToggleActive(leader)}
                            disabled={isToggling}
                          />
                          <Badge
                            variant={leader.isActive ? "default" : "secondary"}
                            className={
                              leader.isActive
                                ? "bg-green-500 hover:bg-green-600 text-black"
                                : "bg-gray-400 hover:bg-gray-500 text-black"
                            }
                          >
                            {leader.isActive ? t("leadership.active") : t("leadership.inactive")}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-[#6F6F6F]" dir="ltr">
                        {formatDate(leader.createdAt)}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditLeader(leader.id)}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(leader)}
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
            <AlertDialogTitle>{t("messages.confirmDelete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("leadership.deleteConfirm")} "{selectedLeader?.nameAr}"؟
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
