import { useState, useMemo, useCallback } from "react";
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
import { formatDateArabic } from "@/core/utils/dateUtils";

export const useLeadershipManagement = () => {
  const navigate = useNavigate();
  const { t, language } = useI18n();

  const [filters, setFilters] = useState({
    searchTerm: "",
    statusFilter: "all",
    departmentFilter: "all",
    pageNumber: 1,
    pageSize: 10,
  });

  
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState<UniversityLeadershipDto | null>(null);

  
  const queryFilters = useMemo(
    () => ({
      searchTerm: filters.searchTerm || undefined,
      isActive: filters.statusFilter === "all" ? undefined : filters.statusFilter === "active",
      departmentId: filters.departmentFilter === "all" ? undefined : Number(filters.departmentFilter),
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize,
    }),
    [filters]
  );

  
  const { data, isLoading, error } = useLeadership(queryFilters);
  const deleteLeadershipMutation = useDeleteLeadership();
  const toggleStatusMutation = useToggleLeadershipStatus();
  const { data: departments = [] } = useDepartmentsLookup();

  
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

  const handleDepartmentFilterChange = useCallback((value: string) => {
    handleFilterChange("departmentFilter", value);
  }, [handleFilterChange]);

  const handlePageChange = useCallback((newPage: number) => {
    handleFilterChange("pageNumber", newPage);
  }, [handleFilterChange]);

  const handleAddLeader = useCallback(() => {
    navigate("/admin/leadership/new");
  }, [navigate]);

  const handleEditLeader = useCallback((leaderId: number) => {
    navigate(`/admin/leadership/edit/${leaderId}`);
  }, [navigate]);

  const handleToggleActive = useCallback(async (leader: UniversityLeadershipDto) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: leader.id,
        isActive: !leader.isActive,
      });
    } catch (error) {
      
    }
  }, [toggleStatusMutation]);

  const handleDeleteClick = useCallback((leader: UniversityLeadershipDto) => {
    // Blur the active element to prevent aria-hidden focus trap warning
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setSelectedLeader(leader);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedLeader) return;

    try {
      await deleteLeadershipMutation.mutateAsync(selectedLeader.id);
      setIsDeleteDialogOpen(false);
      setSelectedLeader(null);
    } catch (error) {
      
    }
  }, [selectedLeader, deleteLeadershipMutation]);

  const handleDeleteCancel = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedLeader(null);
  }, []);

  const getDepartmentName = useCallback((departmentId?: number) => {
    if (!departmentId) return "-";
    const department = departments.find((dept) => dept.id === departmentId);
    if (!department) return "-";
    return language === "ar" ? department.nameAr : (department.nameEn || department.nameAr);
  }, [departments, language]);

  return {
    
    leadership: data?.items || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    currentPage: filters.pageNumber,
    isLoading,
    error,

    
    searchTerm: filters.searchTerm,
    statusFilter: filters.statusFilter,
    departmentFilter: filters.departmentFilter,
    departments,

    
    isDeleteDialogOpen,
    selectedLeader,
    isDeleting: deleteLeadershipMutation.isPending,
    isToggling: toggleStatusMutation.isPending,

    
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
    formatDate: formatDateArabic,
    getDepartmentName,
  };
};
