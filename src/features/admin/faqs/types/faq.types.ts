// ============================================
// FAQ Types and Filters
// ============================================

export interface FaqFilters {
  searchTerm?: string;
  isActive?: boolean;
  categoryId?: number;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
