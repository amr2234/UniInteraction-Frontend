import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  useUsers,
  useDeleteUser,
  useToggleUserStatus,
} from "../hooks/useUsers";
import type { UserManagementDto } from "../types/user.types";
import { useDepartmentsLookup } from "@/features/lookups/hooks/useLookups";
import { UserRole, ROLE_TRANSLATION_KEYS } from "@/core/constants/roles";
import { useI18n } from "@/i18n";
import { formatDateEnglish } from "@/core/utils/dateUtils";

export const useUserManagement = () => {
  const navigate = useNavigate();
  const { language } = useI18n();

  const [filters, setFilters] = useState({
    searchTerm: "",
    statusFilter: "all",
    departmentFilter: "all",
    roleFilter: "all",
    pageNumber: 1,
    pageSize: 10,
  });

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserManagementDto | null>(
    null
  );

  const { data: departmentsData } = useDepartmentsLookup();
  const departments = useMemo(() => departmentsData || [], [departmentsData]);

  const departmentMap = useMemo(() => {
    const map = new Map<
      number,
      { id: number; nameAr: string; nameEn?: string }
    >();
    departments.forEach((dept) => {
      map.set(dept.id, dept);
    });
    return map;
  }, [departments]);

  const queryFilters = useMemo(
    () => ({
      searchTerm: filters.searchTerm || undefined,
      roleId: filters.roleFilter !== "all" ? parseInt(filters.roleFilter) : undefined,
      isActive: filters.statusFilter === "all" ? undefined : filters.statusFilter === "active",
      departmentId:
        filters.departmentFilter !== "all" ? parseInt(filters.departmentFilter) : undefined,
      pageNumber: filters.pageNumber,
      pageSize: filters.pageSize,
    }),
    [filters]
  );

  const { data, isLoading, error } = useUsers(queryFilters);
  const deleteUserMutation = useDeleteUser();
  const toggleStatusMutation = useToggleUserStatus();

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

  const handleRoleFilterChange = useCallback((value: string) => {
    handleFilterChange("roleFilter", value);
  }, [handleFilterChange]);

  const handlePageChange = useCallback((newPage: number) => {
    handleFilterChange("pageNumber", newPage);
  }, [handleFilterChange]);

  const handleAddUser = useCallback(() => {
    navigate("/admin/users/new");
  }, [navigate]);

  const handleEditUser = useCallback((userId: number) => {
    navigate(`/admin/users/edit/${userId}`);
  }, [navigate]);

  const handleToggleActive = useCallback(async (user: UserManagementDto) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: user.id,
        isActive: !user.isActive,
      });
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  }, [toggleStatusMutation]);

  const handleDeleteClick = (user: UserManagementDto) => {
    // Blur the active element to prevent aria-hidden focus trap warning
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedUser) return;

    try {
      await deleteUserMutation.mutateAsync(selectedUser.id);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  }, [selectedUser, deleteUserMutation]);

  const handleDeleteCancel = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  }, []);

  const getUserFullName = useCallback((user: UserManagementDto): string => {
    return language === "ar" ? user.nameAr : user.nameEn || user.nameAr;
  }, [language]);

  const getDepartmentName = useCallback((
    departmentId: string | number | undefined
  ): string => {
    if (!departmentId) return "-";

    const deptId =
      typeof departmentId === "string" ? parseInt(departmentId) : departmentId;
    const department = departmentMap.get(deptId);

    if (!department) {
      return departments.length === 0 ? `Loading...` : `-`;
    }

    return language === "ar"
      ? department.nameAr
      : department.nameEn || department.nameAr;
  }, [departmentMap, departments.length, language]);

  return {
    users: data?.items || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    currentPage: filters.pageNumber,
    isLoading,
    error,

    searchTerm: filters.searchTerm,
    statusFilter: filters.statusFilter,
    departmentFilter: filters.departmentFilter,
    roleFilter: filters.roleFilter,
    departments,

    isDeleteDialogOpen,
    selectedUser,
    isDeleting: deleteUserMutation.isPending,
    isToggling: toggleStatusMutation.isPending,

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
    formatDate: formatDateEnglish,
    getDepartmentName,
    getUserFullName,

    UserRole,
    ROLE_TRANSLATION_KEYS,
  };
};
