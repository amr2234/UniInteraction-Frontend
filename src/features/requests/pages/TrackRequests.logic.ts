import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n";
import { useHasPermission } from "@/core/hooks/usePermissions";
import { PERMISSIONS } from "@/core/constants/permissions";
import { RequestStatus, getRequestStatusName } from "@/core/constants/requestStatuses";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { requestsApi } from "@/features/requests/api/requests.api";
import { lookupsApi } from "@/features/lookups/api/lookups.api";
import { apiRequest } from "@/core/lib/apiClient";
import { toast } from "sonner";
import type { UserRequestDto } from "@/core/types/api";



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

// Department type
export interface Department {
  id: number;
  nameAr: string;
  nameEn?: string;
  code?: string;
}



export const useTrackRequests = () => {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const isRTL = language === "ar";
  const queryClient = useQueryClient();
  
  // Permission check
  const canAssignRequests = useHasPermission(PERMISSIONS.REQUESTS_ASSIGN);

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterLeadership, setFilterLeadership] = useState<string>("all");
  const [filterDepartmentAssignment, setFilterDepartmentAssignment] = useState<string>("all");
  const [filterUserAssignment, setFilterUserAssignment] = useState<string>("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Fetch requests with pagination
  const { data: requestsData, isLoading: isLoadingRequests } = useQuery({
    queryKey: ['requests', 'paginated', currentPage, pageSize, searchQuery, filterStatus, filterType, filterDepartment, filterLeadership, startDate, endDate],
    queryFn: async () => {
      const filters: any = {};
      if (searchQuery) filters.searchTerm = searchQuery;
      if (filterStatus !== 'all') {
        const statusMap: Record<string, RequestStatus> = {
          new: RequestStatus.RECEIVED,
          review: RequestStatus.UNDER_REVIEW,
          processing: RequestStatus.UNDER_REVIEW,
          closed: RequestStatus.CLOSED,
        };
        filters.requestStatusId = statusMap[filterStatus];
      }
      if (filterType !== 'all') filters.requestTypeId = parseInt(filterType);
      if (filterDepartment !== 'all') filters.departmentId = parseInt(filterDepartment);
      if (filterLeadership !== 'all') filters.universityLeadershipId = parseInt(filterLeadership);
      if (startDate) filters.startDate = startDate;
      if (endDate) filters.endDate = endDate;
      
      return requestsApi.getUserRequestsPaginated(filters, currentPage, pageSize);
    },
  });

  // Fetch departments
  const { data: departmentsData } = useQuery({
    queryKey: ['departments', 'lookup'],
    queryFn: lookupsApi.getDepartments,
  });

  // Fetch leadership
  const { data: leadershipData } = useQuery({
    queryKey: ['leadership', 'lookup'],
    queryFn: lookupsApi.getUniversityLeaderships,
  });

  const requests = requestsData?.items || [];
  const totalPages = requestsData?.totalPages || 1;
  const totalCount = requestsData?.totalCount || 0;
  const departments: Department[] = departmentsData || [];
  const leadership = leadershipData || [];

  // Enrich requests with leadership names and department names if missing
  const enrichedRequests = useMemo(() => {
    return requests.map((request) => {
      let enrichedRequest = { ...request };
      
      // If request has universityLeadershipId but no universityLeadershipName, find it
      if (request.universityLeadershipId && !request.universityLeadershipName && leadership.length > 0) {
        const leadershipInfo = leadership.find(l => l.id === request.universityLeadershipId);
        if (leadershipInfo) {
          enrichedRequest.universityLeadershipName = isRTL 
            ? leadershipInfo.fullNameAr 
            : (leadershipInfo.fullNameEn || leadershipInfo.fullNameAr);
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
    return enrichedRequests.filter((req) => {
      // Department assignment filter
      const hasDepartmentAssignment = req.assignedDepartmentId !== undefined && req.assignedDepartmentId !== null;
      const matchesDepartmentAssignment =
        filterDepartmentAssignment === "all" ||
        (filterDepartmentAssignment === "assigned" && hasDepartmentAssignment) ||
        (filterDepartmentAssignment === "unassigned" && !hasDepartmentAssignment);

      // User assignment filter
      const hasUserAssignment = req.assignedToUserId !== undefined && req.assignedToUserId !== null;
      const matchesUserAssignment =
        filterUserAssignment === "all" ||
        (filterUserAssignment === "assigned" && hasUserAssignment) ||
        (filterUserAssignment === "unassigned" && !hasUserAssignment);

      return matchesDepartmentAssignment && matchesUserAssignment;
    });
  }, [enrichedRequests, filterDepartmentAssignment, filterUserAssignment]);

  // Statistics from API
  const stats = useMemo(() => {
    return {
      total: totalCount,
      new: enrichedRequests.filter((r) => r.requestStatusId === RequestStatus.RECEIVED).length,
      underReview: enrichedRequests.filter((r) => r.requestStatusId === RequestStatus.UNDER_REVIEW).length,
      closed: enrichedRequests.filter((r) => r.requestStatusId === RequestStatus.CLOSED || r.requestStatusId === RequestStatus.REPLIED).length,
    };
  }, [enrichedRequests, totalCount]);

  // Handlers
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleStatusChange = (value: string) => {
    setFilterStatus(value);
  };

  const handleTypeChange = (value: string) => {
    setFilterType(value);
  };

  const handleDepartmentChange = (value: string) => {
    setFilterDepartment(value);
    setCurrentPage(1);
  };

  const handleLeadershipChange = (value: string) => {
    setFilterLeadership(value);
    setCurrentPage(1);
  };

  const handleDepartmentAssignmentChange = (value: string) => {
    setFilterDepartmentAssignment(value);
  };

  const handleUserAssignmentChange = (value: string) => {
    setFilterUserAssignment(value);
  };

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    setCurrentPage(1);
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleViewRequest = (requestId: number) => {
    navigate(`/dashboard/request/${requestId}`);
  };

  const handleAssignDepartment = (requestId: number, departmentId: number) => {
    assignDepartmentMutation.mutate({ requestId, departmentId });
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setFilterStatus("all");
    setFilterType("all");
    setFilterDepartment("all");
    setFilterLeadership("all");
    setFilterDepartmentAssignment("all");
    setFilterUserAssignment("all");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  const handleResetDates = () => {
    setStartDate("");
    setEndDate("");
  };

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
    searchQuery,
    filterStatus,
    filterType,
    filterDepartment,
    filterLeadership,
    filterDepartmentAssignment,
    filterUserAssignment,
    startDate,
    endDate,
    filteredRequests,
    stats,
    departments,
    leadership,
    currentPage,
    totalPages,
    totalCount,
    isLoadingRequests,
    
    // Permissions
    canAssignRequests,
    
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
