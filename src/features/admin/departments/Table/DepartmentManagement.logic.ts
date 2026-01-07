import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  useDepartments,
  useDeleteDepartment,
  useToggleDepartmentStatus,
} from "../hooks/useDepartments";
import type { DepartmentDto } from "../types/department.types";
import { formatDateArabic } from "@/core/utils/dateUtils";

export const useDepartmentManagement = () => {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    searchTerm: "",
    statusFilter: "all",
    pageNumber: 1,
    pageSize: 10,
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentDto | null>(null);

  const queryFilters = useMemo(
    () => ({
      searchTerm: filters.searchTerm || undefined,
      isActive: filters.statusFilter === "all" ? undefined : filters.statusFilter === "active",
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize,
    }),
    [filters]
  );

  // API hooks
  const { data, isLoading, error } = useDepartments(queryFilters);
  const deleteDepartmentMutation = useDeleteDepartment();
  const toggleStatusMutation = useToggleDepartmentStatus();

  // Handlers
  const handleFilterChange = useCallback((field: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      ...(field !== "pageNumber" && { pageNumber: 1 }),
    }));
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    handleFilterChange("searchTerm", value);
  }, [handleFilterChange]);

  const handleStatusFilterChange = useCallback((value: string) => {
    handleFilterChange("statusFilter", value);
  }, [handleFilterChange]);

  const handlePageChange = useCallback((newPage: number) => {
    handleFilterChange("pageNumber", newPage);
  }, [handleFilterChange]);

  const handleAddDepartment = useCallback(() => {
    navigate("/admin/departments/new");
  }, [navigate]);

  const handleEditDepartment = useCallback((departmentId: number) => {
    navigate(`/admin/departments/edit/${departmentId}`);
  }, [navigate]);

  const handleToggleActive = useCallback(async (department: DepartmentDto) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: department.id,
        isActive: !department.isActive,
      });
    } catch (error) {
      // Error is handled by the hook
    }
  }, [toggleStatusMutation]);

  const handleDeleteClick = useCallback((department: DepartmentDto) => {
    // Blur the active element to prevent aria-hidden focus trap warning
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setSelectedDepartment(department);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedDepartment) return;

    try {
      await deleteDepartmentMutation.mutateAsync(selectedDepartment.id);
      setIsDeleteDialogOpen(false);
      setSelectedDepartment(null);
    } catch (error) {
      // Error is handled by the hook
    }
  }, [selectedDepartment, deleteDepartmentMutation]);

  const handleDeleteCancel = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedDepartment(null);
  }, []);

  return {
    // Data
    departments: data?.items || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    currentPage: filters.pageNumber,
    isLoading,
    error,

    // Filters
    searchTerm: filters.searchTerm,
    statusFilter: filters.statusFilter,

    // Delete dialog
    isDeleteDialogOpen,
    selectedDepartment,
    isDeleting: deleteDepartmentMutation.isPending,
    isToggling: toggleStatusMutation.isPending,

    // Handlers
    handleSearchChange,
    handleStatusFilterChange,
    handlePageChange,
    handleAddDepartment,
    handleEditDepartment,
    handleToggleActive,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    formatDate: formatDateArabic,
  };
};
