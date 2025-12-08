// ============================================
// Leadership Types & Filters
// ============================================

/**
 * Leadership Filters
 * Query parameters for filtering leadership members
 */
export interface LeadershipFilters {
  searchTerm?: string;
  isActive?: boolean;
  departmentId?: number;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}
