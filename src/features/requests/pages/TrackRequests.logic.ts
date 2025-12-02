import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useI18n } from "@/i18n";
import { useHasPermission, useUserPermissions } from "@/core/hooks/usePermissions";
import { PERMISSIONS } from "@/core/constants/permissions";

// Mock request type - replace with actual API types
export interface Request {
  id: string;
  typeId: number; // 1: complaint, 2: inquiry, 3: suggestion, 4: visit
  titleAr: string;
  titleEn: string;
  statusId: number; // Using RequestStatus enum values
  date: string;
  messages: number;
  departmentAr: string;
  departmentEn: string;
  assignedToId?: number;
  assignedToName?: string;
}

export const REQUEST_TYPES = {
  COMPLAINT: 1,
  INQUIRY: 2,
  SUGGESTION: 3,
  VISIT: 4,
} as const;

export const REQUEST_TYPE_NAMES_AR = {
  [REQUEST_TYPES.COMPLAINT]: "شكوى",
  [REQUEST_TYPES.INQUIRY]: "استفسار",
  [REQUEST_TYPES.SUGGESTION]: "مقترح",
  [REQUEST_TYPES.VISIT]: "حجز زيارة",
} as const;

export const REQUEST_TYPE_NAMES_EN = {
  [REQUEST_TYPES.COMPLAINT]: "Complaint",
  [REQUEST_TYPES.INQUIRY]: "Inquiry",
  [REQUEST_TYPES.SUGGESTION]: "Suggestion",
  [REQUEST_TYPES.VISIT]: "Visit Booking",
} as const;

// Mock employees - replace with actual API
export interface Employee {
  id: number;
  nameAr: string;
  nameEn: string;
}

const MOCK_EMPLOYEES: Employee[] = [
  { id: 1, nameAr: "أحمد محمد", nameEn: "Ahmed Mohammed" },
  { id: 2, nameAr: "فاطمة علي", nameEn: "Fatima Ali" },
  { id: 3, nameAr: "محمد خالد", nameEn: "Mohammed Khaled" },
  { id: 4, nameAr: "نورة عبدالله", nameEn: "Noura Abdullah" },
];

// Mock requests - replace with actual API call
const MOCK_REQUESTS: Request[] = [
  {
    id: "SG-2025-001234",
    typeId: REQUEST_TYPES.SUGGESTION,
    titleAr: "تطوير خدمات المكتبة الرقمية",
    titleEn: "Develop Digital Library Services",
    statusId: 2, // Under Review
    date: "2025-01-14",
    messages: 2,
    departmentAr: "تقنية المعلومات",
    departmentEn: "Information Technology",
  },
  {
    id: "CM-2025-001233",
    typeId: REQUEST_TYPES.COMPLAINT,
    titleAr: "مشكلة في نظام البوابة الإلكترونية",
    titleEn: "Issue with Electronic Portal System",
    statusId: 2, // Processing (mapped to under review)
    date: "2025-01-11",
    messages: 5,
    departmentAr: "الدعم الفني",
    departmentEn: "Technical Support",
    assignedToId: 1,
    assignedToName: "أحمد محمد",
  },
  {
    id: "IQ-2025-001232",
    typeId: REQUEST_TYPES.INQUIRY,
    titleAr: "استفسار عن مواعيد التسجيل",
    titleEn: "Inquiry about Registration Dates",
    statusId: 4, // Closed
    date: "2025-01-13",
    messages: 3,
    departmentAr: "القبول والتسجيل",
    departmentEn: "Admission and Registration",
  },
  {
    id: "VS-2025-001231",
    typeId: REQUEST_TYPES.VISIT,
    titleAr: "موعد مع عميد شؤون الطلاب",
    titleEn: "Appointment with Dean of Student Affairs",
    statusId: 4, // Confirmed (mapped to closed)
    date: "2025-01-20",
    messages: 1,
    departmentAr: "شؤون الطلاب",
    departmentEn: "Student Affairs",
    assignedToId: 2,
    assignedToName: "فاطمة علي",
  },
  {
    id: "SG-2025-001230",
    typeId: REQUEST_TYPES.SUGGESTION,
    titleAr: "تحسين مواقف السيارات",
    titleEn: "Improve Parking Facilities",
    statusId: 1, // New
    date: "2025-01-15",
    messages: 0,
    departmentAr: "الخدمات العامة",
    departmentEn: "General Services",
  },
  {
    id: "CM-2025-001229",
    typeId: REQUEST_TYPES.COMPLAINT,
    titleAr: "تأخر في صرف المكافآت",
    titleEn: "Delay in Disbursing Rewards",
    statusId: 2, // Under Review
    date: "2025-01-10",
    messages: 4,
    departmentAr: "الشؤون المالية",
    departmentEn: "Financial Affairs",
  },
];

export const useTrackRequests = () => {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const isRTL = language === "ar";
  
  // Permission check - now reactive to localStorage changes
  const canAssignRequests = useHasPermission(PERMISSIONS.REQUESTS_ASSIGN);
  const allPermissions = useUserPermissions();
  
  // Debug: Check localStorage and hook state
  console.log('🔍 DEBUG - canAssignRequests:', canAssignRequests);
  console.log('🔍 DEBUG - allPermissions from hook:', allPermissions);
  console.log('🔍 DEBUG - localStorage userInfo:', localStorage.getItem('userInfo'));

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [filterAssignment, setFilterAssignment] = useState<string>("all"); // New assignment filter
  const [requests] = useState<Request[]>(MOCK_REQUESTS);

  // Get unique departments
  const departments = useMemo(() => {
    const deptSet = new Set(
      requests.map((req) => (isRTL ? req.departmentAr : req.departmentEn))
    );
    return Array.from(deptSet).sort();
  }, [requests, isRTL]);

  // Filter requests
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const title = isRTL ? req.titleAr : req.titleEn;
      const matchesSearch =
        !searchQuery ||
        req.id.toLowerCase().includes(searchLower) ||
        title.toLowerCase().includes(searchLower);

      // Status filter
      const matchesStatus =
        filterStatus === "all" ||
        (filterStatus === "new" && req.statusId === 1) ||
        (filterStatus === "review" && req.statusId === 2) ||
        (filterStatus === "processing" && req.statusId === 2) ||
        (filterStatus === "closed" && (req.statusId === 4 || req.statusId === 3));

      // Type filter
      const matchesType =
        filterType === "all" || req.typeId === parseInt(filterType);

      // Department filter
      const department = isRTL ? req.departmentAr : req.departmentEn;
      const matchesDepartment =
        filterDepartment === "all" || department === filterDepartment;

      // Assignment filter (admin only)
      const matchesAssignment =
        filterAssignment === "all" ||
        (filterAssignment === "assigned" && req.assignedToId !== undefined) ||
        (filterAssignment === "unassigned" && req.assignedToId === undefined);

      return matchesSearch && matchesStatus && matchesType && matchesDepartment && matchesAssignment;
    });
  }, [requests, searchQuery, filterStatus, filterType, filterDepartment, filterAssignment, isRTL]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: requests.length,
      new: requests.filter((r) => r.statusId === 1).length,
      underReview: requests.filter((r) => r.statusId === 2).length,
      closed: requests.filter((r) => r.statusId === 4 || r.statusId === 3).length,
    };
  }, [requests]);

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
  };

  const handleAssignmentChange = (value: string) => {
    setFilterAssignment(value);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleViewRequest = (requestId: string) => {
    navigate(`/dashboard/request/${requestId}`);
  };

  const handleAssignEmployee = (requestId: string, employeeId: number) => {
    console.log(`Assigning employee ${employeeId} to request ${requestId}`);
    // TODO: Implement actual API call
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
      case 1: // New
        return "bg-purple-100 text-purple-700";
      case 2: // Under Review
        return "bg-orange-100 text-orange-700";
      case 3: // Replied
        return "bg-blue-100 text-blue-700";
      case 4: // Closed
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Helper to get status name
  const getStatusName = (statusId: number) => {
    switch (statusId) {
      case 1:
        return t("requests.track.new");
      case 2:
        return t("requests.track.underReview");
      case 3:
        return t("requests.statuses.replied");
      case 4:
        return t("requests.track.closed");
      default:
        return "Unknown";
    }
  };

  return {
    // State
    searchQuery,
    filterStatus,
    filterType,
    filterDepartment,
    filterAssignment,
    filteredRequests,
    stats,
    departments,
    employees: MOCK_EMPLOYEES,
    
    // Permissions
    canAssignRequests,
    
    // Helpers
    isRTL,
    t,
    getRequestTypeName,
    getStatusColor,
    getStatusName,
    
    // Handlers
    handleSearchChange,
    handleStatusChange,
    handleTypeChange,
    handleDepartmentChange,
    handleAssignmentChange,
    handleBackToDashboard,
    handleViewRequest,
    handleAssignEmployee,
  };
};
