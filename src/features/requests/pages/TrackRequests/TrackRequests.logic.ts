import { useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n";
import { useHasPermission } from "@/core/hooks/usePermissions";
import { useUserRole } from "@/core/hooks/useUserRole";
import { PERMISSIONS } from "@/core/constants/permissions";
import { RequestStatus, getRequestStatusName } from "@/core/constants/requestStatuses";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { requestsApi } from "@/features/requests/api/requests.api";
import {
  useDepartmentsLookup,
  useLeadershipLookup,
} from "@/features/lookups/hooks/useLookups";
import { apiRequest } from "@/core/lib/apiClient";
import { toast } from "sonner";
import type { UserRequestDto, PaginatedResponse } from "@/core/types/api";
import type { Department } from "./TrackRequests.types";

export const REQUEST_TYPES = {
  INQUIRY: 1,
  COMPLAINT: 2,  // Handles both complaints and suggestions
  VISIT: 3,
} as const;

export const REQUEST_TYPE_NAMES_AR = {
  [REQUEST_TYPES.INQUIRY]: "استفسار",
  [REQUEST_TYPES.COMPLAINT]: "شكوى أو مقترح",
  [REQUEST_TYPES.VISIT]: "حجز زيارة",
} as const;

export const REQUEST_TYPE_NAMES_EN = {
  [REQUEST_TYPES.INQUIRY]: "Inquiry",
  [REQUEST_TYPES.COMPLAINT]: "Complaint or Suggestion",
  [REQUEST_TYPES.VISIT]: "Visit Booking",
} as const;



export const useTrackRequests = () => {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const isRTL = language === "ar";
  const queryClient = useQueryClient();
  
  // Role and permission checks
  const canAssignRequests = useHasPermission(PERMISSIONS.REQUESTS_ASSIGN);
  const { isAdmin, isEmployee, isSuperAdmin, isUser } = useUserRole();

  // State
  const [filters, setFilters] = useState({
    searchQuery: "",
    filterStatus: "all",
    filterType: "all",
    filterDepartment: "all",
    filterLeadership: "all",
    filterDepartmentAssignment: "all",
    filterUserAssignment: "all",
    startDate: "",
    endDate: "",
    currentPage: 1,
    pageSize: 10,
  });

  // Fetch requests with pagination
  const { data: requestsData, isLoading: isLoadingRequests } = useQuery<PaginatedResponse<UserRequestDto> | UserRequestDto[]>({
    queryKey: ['requests', 'paginated', filters.currentPage, filters.pageSize, filters.searchQuery, filters.filterStatus, filters.filterType, filters.filterDepartment, filters.filterLeadership, filters.startDate, filters.endDate],
    queryFn: async () => {
      const apiFilters: any = {
        pageNumber: filters.currentPage,
        pageSize: filters.pageSize,
      };
      if (filters.searchQuery) apiFilters.searchTerm = filters.searchQuery;
      if (filters.filterStatus !== 'all') {
        const statusMap: Record<string, RequestStatus> = {
          new: RequestStatus.RECEIVED,
          review: RequestStatus.UNDER_REVIEW,
          processing: RequestStatus.UNDER_REVIEW,
          closed: RequestStatus.CLOSED,
        };
        apiFilters.requestStatusId = statusMap[filters.filterStatus];
      }
      if (filters.filterType !== 'all') apiFilters.requestTypeId = parseInt(filters.filterType);
      if (filters.filterDepartment !== 'all') apiFilters.departmentId = parseInt(filters.filterDepartment);
      if (filters.filterLeadership !== 'all') apiFilters.universityLeadershipId = parseInt(filters.filterLeadership);
      if (filters.startDate) apiFilters.startDate = filters.startDate;
      if (filters.endDate) apiFilters.endDate = filters.endDate;
      
      // Use getUserRequests with enablePagination=true (single unified API)
      return requestsApi.getUserRequests({ ...apiFilters, enablePagination: true });
    },
  });

  // Fetch departments and leadership
  const { data: departmentsData } = useDepartmentsLookup();
  const { data: leadershipData } = useLeadershipLookup();

  // Handle both paginated and non-paginated responses
  const requests = Array.isArray(requestsData) 
    ? requestsData 
    : requestsData?.items || [];
  const totalPages = Array.isArray(requestsData) 
    ? 1 
    : requestsData?.totalPages || 1;
  const totalCount = Array.isArray(requestsData) 
    ? requests.length 
    : requestsData?.totalCount || 0;
  const departments: Department[] = departmentsData || [];
  const leadership = leadershipData || [];

  // Enrich requests with leadership names and department names if missing
  const enrichedRequests = useMemo(() => {
    return requests.map((request: any) => {
      let enrichedRequest = { ...request };
      
      // If request has universityLeadershipId but no universityLeadershipName, find it
      if (request.universityLeadershipId && !request.universityLeadershipName && leadership.length > 0) {
        const leadershipInfo = leadership.find(l => l.id === request.universityLeadershipId);
        if (leadershipInfo) {
          enrichedRequest.universityLeadershipName = isRTL 
            ? leadershipInfo.nameAr 
            : (leadershipInfo.nameEn || leadershipInfo.nameAr);
        }
      }
      
      // If request has assignedDepartmentId, enrich with department name
      if (request.assignedDepartmentId && departments.length > 0) {
        const departmentInfo = departments.find(d => d.id === request.assignedDepartmentId);
        if (departmentInfo) {
          enrichedRequest.departmentName = isRTL 
            ? departmentInfo.nameAr 
            : (departmentInfo.nameEn || departmentInfo.nameAr);
        }
      }
      
      return enrichedRequest;
    });
  }, [requests, leadership, departments, isRTL]);

  // Assign department mutation
  const assignDepartmentMutation = useMutation({
    mutationFn: async ({ requestId, departmentId }: { requestId: number; departmentId: number }) => {
      return apiRequest.put(`/requests/${requestId}/assign-department`, { departmentId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests', 'paginated'] });
      toast.success(t("requests.track.assignmentSuccess"));
    },
    onError: () => {
      toast.error(t("requests.track.assignmentError"));
    },
  });

  // Filter requests locally for department and user assignment filters
  const filteredRequests = useMemo(() => {
    return enrichedRequests.filter((req: any) => {
      // Department assignment filter
      const hasDepartmentAssignment = req.assignedDepartmentId !== undefined && req.assignedDepartmentId !== null;
      const matchesDepartmentAssignment =
        filters.filterDepartmentAssignment === "all" ||
        (filters.filterDepartmentAssignment === "assigned" && hasDepartmentAssignment) ||
        (filters.filterDepartmentAssignment === "unassigned" && !hasDepartmentAssignment);

      // User assignment filter
      const hasUserAssignment = req.assignedToUserId !== undefined && req.assignedToUserId !== null;
      const matchesUserAssignment =
        filters.filterUserAssignment === "all" ||
        (filters.filterUserAssignment === "assigned" && hasUserAssignment) ||
        (filters.filterUserAssignment === "unassigned" && !hasUserAssignment);

      return matchesDepartmentAssignment && matchesUserAssignment;
    });
  }, [enrichedRequests, filters.filterDepartmentAssignment, filters.filterUserAssignment]);

  // Statistics from API
  const stats = useMemo(() => {
    return {
      total: totalCount,
      new: enrichedRequests.filter((r: any) => r.requestStatusId === RequestStatus.RECEIVED).length,
      underReview: enrichedRequests.filter((r: any) => r.requestStatusId === RequestStatus.UNDER_REVIEW).length,
      closed: enrichedRequests.filter((r: any) => r.requestStatusId === RequestStatus.CLOSED || r.requestStatusId === RequestStatus.REPLIED).length,
    };
  }, [enrichedRequests, totalCount]);

  // Handlers
  const handleFilterChange = useCallback((field: string, value: string | number) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
      ...(field !== "currentPage" && { currentPage: 1 }),
    }));
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    handleFilterChange("searchQuery", value);
  }, [handleFilterChange]);

  const handleStatusChange = useCallback((value: string) => {
    handleFilterChange("filterStatus", value);
  }, [handleFilterChange]);

  const handleTypeChange = useCallback((value: string) => {
    handleFilterChange("filterType", value);
  }, [handleFilterChange]);

  const handleDepartmentChange = useCallback((value: string) => {
    handleFilterChange("filterDepartment", value);
  }, [handleFilterChange]);

  const handleLeadershipChange = useCallback((value: string) => {
    handleFilterChange("filterLeadership", value);
  }, [handleFilterChange]);

  const handleDepartmentAssignmentChange = useCallback((value: string) => {
    handleFilterChange("filterDepartmentAssignment", value);
  }, [handleFilterChange]);

  const handleUserAssignmentChange = useCallback((value: string) => {
    handleFilterChange("filterUserAssignment", value);
  }, [handleFilterChange]);

  const handleStartDateChange = useCallback((value: string) => {
    handleFilterChange("startDate", value);
  }, [handleFilterChange]);

  const handleEndDateChange = useCallback((value: string) => {
    handleFilterChange("endDate", value);
  }, [handleFilterChange]);

  const handlePageChange = useCallback((page: number) => {
    handleFilterChange("currentPage", page);
  }, [handleFilterChange]);

  const handleBackToDashboard = useCallback(() => {
    navigate("/dashboard");
  }, [navigate]);

  const handleViewRequest = useCallback((requestId: number) => {
    navigate(`/dashboard/request/${requestId}`);
  }, [navigate]);

  const handleAssignDepartment = useCallback((requestId: number, departmentId: number) => {
    assignDepartmentMutation.mutate({ requestId, departmentId });
  }, [assignDepartmentMutation]);

  const handleResetFilters = useCallback(() => {
    setFilters({
      searchQuery: "",
      filterStatus: "all",
      filterType: "all",
      filterDepartment: "all",
      filterLeadership: "all",
      filterDepartmentAssignment: "all",
      filterUserAssignment: "all",
      startDate: "",
      endDate: "",
      currentPage: 1,
      pageSize: 10,
    });
  }, []);

  const handleResetDates = useCallback(() => {
    setFilters((prev) => ({
      ...prev,
      startDate: "",
      endDate: "",
      currentPage: 1,
    }));
  }, []);

  // Helper to get request type name
  const getRequestTypeName = (typeId: number) => {
    return isRTL
      ? REQUEST_TYPE_NAMES_AR[typeId as keyof typeof REQUEST_TYPE_NAMES_AR]
      : REQUEST_TYPE_NAMES_EN[typeId as keyof typeof REQUEST_TYPE_NAMES_EN];
  };

  // Helper to get status color
  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case RequestStatus.RECEIVED:
        return "bg-purple-100 text-purple-700";
      case RequestStatus.UNDER_REVIEW:
        return "bg-orange-100 text-orange-700";
      case RequestStatus.REPLIED:
        return "bg-blue-100 text-blue-700";
      case RequestStatus.CLOSED:
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Helper to get status name
  const getStatusNameHelper = (statusId: number) => {
    return getRequestStatusName(statusId, isRTL ? 'ar' : 'en');
  };

  return {
    // State
    searchQuery: filters.searchQuery,
    filterStatus: filters.filterStatus,
    filterType: filters.filterType,
    filterDepartment: filters.filterDepartment,
    filterLeadership: filters.filterLeadership,
    filterDepartmentAssignment: filters.filterDepartmentAssignment,
    filterUserAssignment: filters.filterUserAssignment,
    startDate: filters.startDate,
    endDate: filters.endDate,
    filteredRequests,
    stats,
    departments,
    leadership,
    currentPage: filters.currentPage,
    totalPages,
    totalCount,
    isLoadingRequests,
    
    // Permissions
    canAssignRequests,
    
    // Roles
    isAdmin,
    isEmployee,
    isSuperAdmin,
    isUser,
    
    // Helpers
    isRTL,
    t,
    getRequestTypeName,
    getStatusColor,
    getStatusName: getStatusNameHelper,
    
    // Handlers
    handleSearchChange,
    handleStatusChange,
    handleTypeChange,
    handleDepartmentChange,
    handleLeadershipChange,
    handleDepartmentAssignmentChange,
    handleUserAssignmentChange,
    handleStartDateChange,
    handleEndDateChange,
    handlePageChange,
    handleBackToDashboard,
    handleViewRequest,
    handleAssignDepartment,
    handleResetFilters,
    handleResetDates,
  };
};
