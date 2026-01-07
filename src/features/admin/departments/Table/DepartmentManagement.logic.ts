import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useDepartments,
  useDeleteDepartment,
  useToggleDepartmentStatus,
} from "../hooks/useDepartments";
import type { DepartmentDto } from "../types/department.types";

export const useDepartmentManagement = () => {
  const navigate = useNavigate();

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);

  // Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<DepartmentDto | null>(null);

  // Build filters object for API
  const filters = useMemo(
    () => ({
      searchTerm: searchTerm || undefined,
      isActive: statusFilter === "all" ? undefined : statusFilter === "active",
      pageNumber,
      pageSize,
    }),
    [searchTerm, statusFilter, pageNumber, pageSize]
  );

  // API hooks
  const { data, isLoading, error, refetch } = useDepartments(filters);
  const deleteDepartmentMutation = useDeleteDepartment();
  const toggleStatusMutation = useToggleDepartmentStatus();

  // Reset to page 1 when filters change
  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm, statusFilter]);

  // Handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  const handleAddDepartment = () => {
    navigate("/admin/departments/new");
  };

  const handleEditDepartment = (departmentId: number) => {
    navigate(`/admin/departments/edit/${departmentId}`);
  };

  const handleToggleActive = async (department: DepartmentDto) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: department.id,
        isActive: !department.isActive,
      });
      refetch();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDeleteClick = (department: DepartmentDto) => {
    // Blur the active element to prevent aria-hidden focus trap warning
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setSelectedDepartment(department);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDepartment) return;

    try {
      await deleteDepartmentMutation.mutateAsync(selectedDepartment.id);
      setIsDeleteDialogOpen(false);
      setSelectedDepartment(null);
      refetch();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedDepartment(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return {
    // Data
    departments: data?.items || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    currentPage: pageNumber,
    isLoading,
    error,

    // Filters
    searchTerm,
    statusFilter,

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
    formatDate,
  };
};
