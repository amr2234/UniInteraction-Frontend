import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import {
  useLeadership,
  useDeleteLeadership,
  useToggleLeadershipStatus,
} from "@/features/admin/leadership/hooks/useLeadership";
import { useDepartmentsLookup } from "@/features/lookups/hooks/useLookups";
import type { UniversityLeadershipDto } from "@/core/types/api";

export const useLeadershipManagement = () => {
  const navigate = useNavigate();
  const { t, language } = useI18n();

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);

  // Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState<UniversityLeadershipDto | null>(null);

  // Build filters object for API
  const filters = useMemo(
    () => ({
      searchTerm: searchTerm || undefined,
      isActive: statusFilter === "all" ? undefined : statusFilter === "active",
      departmentId: departmentFilter === "all" ? undefined : Number(departmentFilter),
      pageNumber,
      pageSize,
    }),
    [searchTerm, statusFilter, departmentFilter, pageNumber, pageSize]
  );

  // API hooks
  const { data, isLoading, error, refetch } = useLeadership(filters);
  const deleteLeadershipMutation = useDeleteLeadership();
  const toggleStatusMutation = useToggleLeadershipStatus();
  const { data: departments = [] } = useDepartmentsLookup();

  // Reset to page 1 when filters change
  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm, statusFilter, departmentFilter]);

  // Handlers
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleDepartmentFilterChange = (value: string) => {
    setDepartmentFilter(value);
  };

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  const handleAddLeader = () => {
    navigate("/admin/leadership/new");
  };

  const handleEditLeader = (leaderId: number) => {
    navigate(`/admin/leadership/edit/${leaderId}`);
  };

  const handleToggleActive = async (leader: UniversityLeadershipDto) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: leader.id,
        isActive: !leader.isActive,
      });
      refetch();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDeleteClick = (leader: UniversityLeadershipDto) => {
    // Blur the active element to prevent aria-hidden focus trap warning
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setSelectedLeader(leader);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedLeader) return;

    try {
      await deleteLeadershipMutation.mutateAsync(selectedLeader.id);
      setIsDeleteDialogOpen(false);
      setSelectedLeader(null);
      refetch();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedLeader(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getDepartmentName = (departmentId?: number) => {
    if (!departmentId) return "-";
    const department = departments.find((dept) => dept.id === departmentId);
    if (!department) return "-";
    return language === "ar" ? department.nameAr : (department.nameEn || department.nameAr);
  };

  return {
    // Data
    leadership: data?.items || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    currentPage: pageNumber,
    isLoading,
    error,

    // Filters
    searchTerm,
    statusFilter,
    departmentFilter,
    departments,

    // Delete dialog
    isDeleteDialogOpen,
    selectedLeader,
    isDeleting: deleteLeadershipMutation.isPending,
    isToggling: toggleStatusMutation.isPending,

    // Handlers
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
  };
};
