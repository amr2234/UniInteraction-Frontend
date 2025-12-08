// ============================================
// Category Types & Filters
// ============================================

/**
 * Main Category Filters
 * Query parameters for filtering main categories
 */
export interface MainCategoryFilters {
  searchTerm?: string;
  isActive?: boolean;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Sub Category Filters
 * Query parameters for filtering subcategories
 */
export interface SubCategoryFilters {
  searchTerm?: string;
  isActive?: boolean;
  mainCategoryId?: number;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
