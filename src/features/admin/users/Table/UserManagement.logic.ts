import { useState, useEffect, useMemo } from "react";
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

export const useUserManagement = () => {
  const navigate = useNavigate();
  const { language } = useI18n();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);

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

  const filters = useMemo(
    () => ({
      searchTerm: searchTerm || undefined,
      roleId: roleFilter !== "all" ? parseInt(roleFilter) : undefined,
      isActive: statusFilter === "all" ? undefined : statusFilter === "active",
      departmentId:
        departmentFilter !== "all" ? parseInt(departmentFilter) : undefined,
      pageNumber,
      pageSize,
    }),
    [
      searchTerm,
      roleFilter,
      statusFilter,
      departmentFilter,
      pageNumber,
      pageSize,
    ]
  );

  const { data, isLoading, error, refetch } = useUsers(filters);
  const deleteUserMutation = useDeleteUser();
  const toggleStatusMutation = useToggleUserStatus();

  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm, statusFilter, departmentFilter, roleFilter]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value);
  };

  const handleDepartmentFilterChange = (value: string) => {
    setDepartmentFilter(value);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
  };

  const handlePageChange = (newPage: number) => {
    setPageNumber(newPage);
  };

  const handleAddUser = () => {
    navigate("/admin/users/new");
  };

  const handleEditUser = (userId: number) => {
    navigate(`/admin/users/edit/${userId}`);
  };

  const handleToggleActive = async (user: UserManagementDto) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: user.id,
        isActive: !user.isActive,
      });

      refetch();
    } catch (error) {}
  };

  const handleDeleteClick = (user: UserManagementDto) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedUser) return;

    try {
      await deleteUserMutation.mutateAsync(selectedUser.id);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);

      refetch();
    } catch (error) {}
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getDepartmentName = (
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
  };

  const getUserFullName = (user: UserManagementDto): string => {
    return language === "ar" ? user.nameAr : user.nameEn || user.nameAr;
  };

  return {
    users: data?.items || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    currentPage: pageNumber,
    isLoading,
    error,

    searchTerm,
    statusFilter,
    departmentFilter,
    roleFilter,
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
    formatDate,
    getDepartmentName,
    getUserFullName,

    UserRole,
    ROLE_TRANSLATION_KEYS,
  };
};
