import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import {
  useMainCategoriesAdmin,
  useDeleteMainCategory,
  useToggleMainCategoryStatus,
} from "@/features/admin/categories/hooks/useCategories";
import type { MainCategoryDto } from "@/core/types/api";
import { formatDateArabic } from "@/core/utils/dateUtils";

export const useMainCategoryManagement = () => {
  const navigate = useNavigate();
  const { t } = useI18n();

  const [filters, setFilters] = useState({
    searchTerm: "",
    statusFilter: "all",
    pageNumber: 1,
    pageSize: 10,
  });

  // Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<MainCategoryDto | null>(null);

  // Build filters object for API
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
  const { data, isLoading, error } = useMainCategoriesAdmin(queryFilters);
  const deleteMainCategoryMutation = useDeleteMainCategory();
  const toggleStatusMutation = useToggleMainCategoryStatus();

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

  const handleAddCategory = useCallback(() => {
    navigate("/admin/main-categories/new");
  }, [navigate]);

  const handleEditCategory = useCallback((categoryId: number) => {
    navigate(`/admin/main-categories/edit/${categoryId}`);
  }, [navigate]);

  const handleToggleActive = useCallback(async (category: MainCategoryDto) => {
    try {
      await toggleStatusMutation.mutateAsync({
        id: category.id,
        isActive: !category.isActive,
      });
    } catch (error) {
      // Error is handled by the hook
    }
  }, [toggleStatusMutation]);

  const handleDeleteClick = useCallback((category: MainCategoryDto) => {
    // Blur the active element to prevent aria-hidden focus trap warning
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    setSelectedCategory(category);
    setIsDeleteDialogOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!selectedCategory) return;

    try {
      await deleteMainCategoryMutation.mutateAsync(selectedCategory.id);
      setIsDeleteDialogOpen(false);
      setSelectedCategory(null);
    } catch (error) {
      // Error is handled by the hook
    }
  }, [selectedCategory, deleteMainCategoryMutation]);

  const handleDeleteCancel = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedCategory(null);
  }, []);

  return {
    // Data
    categories: data?.items || [],
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
    formatDate: formatDateArabic,
  };
};
