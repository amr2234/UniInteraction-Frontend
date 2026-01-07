import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import {
  useMainCategoriesAdmin,
  useDeleteMainCategory,
  useToggleMainCategoryStatus,
} from "@/features/admin/categories/hooks/useCategories";
import type { MainCategoryDto } from "@/core/types/api";

export const useMainCategoryManagement = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  // Filters state
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);

  // Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MainCategoryDto | null>(null);

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
  const { data, isLoading, error, refetch } = useMainCategoriesAdmin(filters);
  const deleteMainCategoryMutation = useDeleteMainCategory();
  const toggleStatusMutation = useToggleMainCategoryStatus();

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

  const handleAddCategory = () => {
    navigate("/admin/main-categories/new");
  };

  const handleEditCategory = (categoryId: number) => {
    navigate(`/admin/main-categories/edit/${categoryId}`);
  };

  const handleToggleActive = async (category: MainCategoryDto) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: category.id,
        isActive: !category.isActive,
      });
      refetch();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDeleteClick = (category: MainCategoryDto) => {
    // Blur the active element to prevent aria-hidden focus trap warning
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedCategory) return;

    try {
      await deleteMainCategoryMutation.mutateAsync(selectedCategory.id);
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
      refetch();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setSelectedCategory(null);
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
    categories: data?.items || [],
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
    selectedCategory,
    isDeleting: deleteMainCategoryMutation.isPending,
    isToggling: toggleStatusMutation.isPending,

    // Handlers
    handleSearchChange,
    handleStatusFilterChange,
    handlePageChange,
    handleAddCategory,
    handleEditCategory,
    handleToggleActive,
    handleDeleteClick,
    handleDeleteConfirm,
    handleDeleteCancel,
    formatDate,
  };
};
