import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useUsers, useDeleteUser, useToggleUserStatus, UserManagementDto } from "@/features/users";

// User Roles Enum
export enum UserRole {
  Admin = 1,
  Employee = 2,
  Visitor = 3,
}

// Role Labels for translations
export const RoleLabels: Record<UserRole, string> = {
  [UserRole.Admin]: "users.roles.admin",
  [UserRole.Employee]: "users.roles.employee",
  [UserRole.Visitor]: "users.roles.visitor",
};

// Available departments
export const departments = [
  "تقنية المعلومات",
  "الموارد البشرية",
  "الشؤون الأكاديمية",
  "شؤون الطلاب",
  "المالية",
];

export const useUserManagement = () => {
  const navigate = useNavigate();
  
  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  
  // Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserManagementDto | null>(null);

  // Build filters object for API
  const filters = useMemo(() => ({
    searchTerm: searchTerm || undefined,
    roleId: roleFilter !== "all" ? parseInt(roleFilter) : undefined,
    isActive: statusFilter === "all" ? undefined : statusFilter === "active",
    department: departmentFilter !== "all" ? departmentFilter : undefined,
    pageNumber,
    pageSize,
  }), [searchTerm, roleFilter, statusFilter, departmentFilter, pageNumber, pageSize]);

  // API hooks
  const { data, isLoading, error, refetch } = useUsers(filters);
  const deleteUserMutation = useDeleteUser();
  const toggleStatusMutation = useToggleUserStatus();

  // Reset to page 1 when filters change
  useEffect(() => {
    setPageNumber(1);
  }, [searchTerm, statusFilter, departmentFilter, roleFilter]);

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
      await toggleStatusMutation.mutateAsync(user.id);
      // Refetch to get updated data
      refetch();
    } catch (error) {
      // Error is handled by the hook
    }
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
      // Refetch to get updated data
      refetch();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
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
    users: data?.items || [],
    totalCount: data?.totalCount || 0,
    totalPages: data?.totalPages || 0,
    currentPage: pageNumber,
    isLoading,
    error,
    
    // Filters
    searchTerm,
    statusFilter,
    departmentFilter,
    roleFilter,
    departments,
    
    // Delete dialog
    isDeleteDialogOpen,
    selectedUser,
    isDeleting: deleteUserMutation.isPending,
    isToggling: toggleStatusMutation.isPending,
    
    // Handlers
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
    
    // Constants
    UserRole,
    RoleLabels,
  };
};
