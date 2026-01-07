import { useMemo } from "react";
import { useI18n } from "@/i18n";
import { useUserRole } from "@/core/hooks";
import { 
  useUserRequests, 
  useRequestCountsByStatus,
  useMonthlyStatistics,
  useRequestTypesDistribution,
} from "@/features/requests/hooks/useRequests";
import { authApi } from "@/features/auth/api/auth.api";
import { RequestStatus } from "@/core/constants/requestStatuses";
import { RequestType } from "@/core/constants/requestTypes";
import {
  AlertCircle,
  HelpCircle,
  Calendar,
  FileSearch,
  User,
  Clock,
  CheckCircle2,
  FileText,
  Users,
  Layers,
  Settings,
  MessageCircleQuestion,
  Award,
  ScrollText,
  Building2,
} from "lucide-react";

export const useDashboardPage = () => {
  const { t, language } = useI18n();
  const { isAdmin, isSuperAdmin, isEmployee, isUser } = useUserRole();
  const userProfile = authApi.getUserProfile();

  // Fetch request counts by status from API
  const { data: statusCounts = [] } = useRequestCountsByStatus();

  // Fetch monthly statistics for line chart
  const { data: monthlyStats = [], isLoading: isLoadingMonthly } = useMonthlyStatistics(6);

  // Fetch request types distribution for bar chart
  const { data: typesDistribution = [], isLoading: isLoadingTypes } = useRequestTypesDistribution();

  // Fetch all requests for recent activity
  const { data: allRequests = [] } = useUserRequests({}, false);

  // Ensure allRequests is always an array
  // Handle both paginated response {items: []} and direct array []
  const requestsArray = Array.isArray(allRequests) 
    ? allRequests 
    : (allRequests as any)?.items || [];

  // Calculate request counts from API response
  const requestCounts = useMemo(
    () => {
      const counts = {
        pending: statusCounts.find((s) => s.statusId === RequestStatus.RECEIVED)?.count || 0,
        inProgress: statusCounts.find((s) => s.statusId === RequestStatus.UNDER_REVIEW)?.count || 0,
        replied: statusCounts.find((s) => s.statusId === RequestStatus.REPLIED)?.count || 0,
        closed: statusCounts.find((s) => s.statusId === RequestStatus.CLOSED)?.count || 0,
        total: statusCounts.reduce((sum, s) => sum + s.count, 0),
      };
      
      return counts;
    },
    [statusCounts]
  );

  // Get recent requests that need action (Pending or In Progress) - limit to 2
  const recentRequestsNeedingAction = useMemo(
    () =>
      requestsArray
        .filter((r: any) => r.requestStatusId === RequestStatus.RECEIVED || r.requestStatusId === RequestStatus.UNDER_REVIEW)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 2),
    [requestsArray]
  );

  // Get user display name based on language
  const getUserDisplayName = () => {
    if (!userProfile) return "";
    return language === "ar" ? userProfile.nameAr : userProfile.nameEn || userProfile.nameAr;
  };

  // Statistics cards
  const stats = useMemo(
    () => [
      {
        title: t("dashboard.statistics.myOpenRequests"),
        value: String(requestCounts.pending + requestCounts.inProgress),
        icon: FileText,
        color: "bg-[#6CAEBD]/10 text-[#6CAEBD]",
        trend: `${requestCounts.pending} ${t("requests.statuses.pending")}, ${requestCounts.inProgress} ${t("requests.statuses.inProgress")}`,
      },
      {
        title: t("dashboard.statistics.closedRequests"),
        value: String(requestCounts.replied + requestCounts.closed),
        icon: CheckCircle2,
        color: "bg-[#875E9E]/10 text-[#875E9E]",
        trend: t("requests.statuses.completed"),
      },
      {
        title: t("dashboard.statistics.underReview"),
        value: String(requestCounts.inProgress),
        icon: Clock,
        color: "bg-[#EABB4E]/10 text-[#EABB4E]",
        trend: t("requests.statuses.inProgress"),
      },
    ],
    [t, requestCounts]
  );

  // Line chart data - Requests over time (from API)
  const requestsData = useMemo(() => {
    if (!monthlyStats || monthlyStats.length === 0) {
      // Fallback to mock data if API not available
      return [
        { name: t("dashboard.months.january"), [t("dashboard.chartLabels.requests")]: 65, [t("dashboard.chartLabels.completed")]: 45, [t("dashboard.chartLabels.underReview")]: 20 },
        { name: t("dashboard.months.february"), [t("dashboard.chartLabels.requests")]: 78, [t("dashboard.chartLabels.completed")]: 62, [t("dashboard.chartLabels.underReview")]: 16 },
        { name: t("dashboard.months.march"), [t("dashboard.chartLabels.requests")]: 90, [t("dashboard.chartLabels.completed")]: 75, [t("dashboard.chartLabels.underReview")]: 15 },
        { name: t("dashboard.months.april"), [t("dashboard.chartLabels.requests")]: 81, [t("dashboard.chartLabels.completed")]: 70, [t("dashboard.chartLabels.underReview")]: 11 },
        { name: t("dashboard.months.may"), [t("dashboard.chartLabels.requests")]: 95, [t("dashboard.chartLabels.completed")]: 82, [t("dashboard.chartLabels.underReview")]: 13 },
        { name: t("dashboard.months.june"), [t("dashboard.chartLabels.requests")]: 112, [t("dashboard.chartLabels.completed")]: 98, [t("dashboard.chartLabels.underReview")]: 14 },
      ];
    }

    // Map API data to chart format
    return monthlyStats.map((stat) => ({
      name: stat.month,
      [t("dashboard.chartLabels.requests")]: stat.totalRequests,
      [t("dashboard.chartLabels.completed")]: stat.completedRequests,
      [t("dashboard.chartLabels.underReview")]: stat.underReviewRequests,
    }));
  }, [monthlyStats, t]);

  // Bar chart data - Request types (from API)
  const requestTypesData = useMemo(() => {
    if (!typesDistribution || typesDistribution.length === 0) {
      // Fallback to mock data if API not available
      return [
        { name: t("requests.types.complaints"), count: 145, fill: "#875E9E" },
        { name: t("requests.types.inquiries"), count: 198, fill: "#6CAEBD" },
        { name: t("requests.types.visits"), count: 45, fill: "#EABB4E" },
      ];
    }

    // Map API data to chart format with colors based on request type
    return typesDistribution.map((item) => {
      const typeName = language === "ar" ? item.requestTypeNameAr : item.requestTypeNameEn;
      
      // Assign colors based on request type ID
      let fill = "#6CAEBD"; // Default color
      if (item.requestTypeId === RequestType.COMPLAINT) {
        fill = "#875E9E"; // Purple for complaints
      } else if (item.requestTypeId === RequestType.INQUIRY) {
        fill = "#6CAEBD"; // Blue for inquiries  
      } else if (item.requestTypeId === RequestType.VISIT) {
        fill = "#EABB4E"; // Yellow for visits
      }

      return {
        name: typeName,
        count: item.count,
        fill,
      };
    });
  }, [typesDistribution, language, t]);

  // User services
  const services = useMemo(
    () => [
      {
        icon: AlertCircle,
        title: t("requests.submitComplaintOrSuggestion"),
        description: t("requests.submitComplaintOrSuggestionDesc"),
        link: "/dashboard/complaint",
        color: "from-[#875E9E] to-[#6CAEBD]",
        bgColor: "bg-purple-50",
      },
      {
        icon: HelpCircle,
        title: t("requests.submitInquiry"),
        description: t("requests.submitInquiryDesc"),
        link: "/dashboard/inquiry",
        color: "from-[#6CAEBD] to-[#875E9E]",
        bgColor: "bg-blue-50",
      },
      {
        icon: Calendar,
        title: t("requests.bookVisit"),
        description: t("requests.bookVisitDesc"),
        link: "/dashboard/book-visit",
        color: "from-[#EABB4E] to-[#6CAEBD]",
        bgColor: "bg-yellow-50",
      },
      {
        icon: FileSearch,
        title: t("requests.trackRequests"),
        description: t("requests.trackRequestsDesc"),
        link: "/dashboard/track",
        color: "from-[#6CAEBD] to-[#EABB4E]",
        bgColor: "bg-cyan-50",
      },
      {
        icon: User,
        title: t("form.profileManagement"),
        description: t("form.profileManagementDesc"),
        link: "/dashboard/profile",
        color: "from-[#875E9E] to-[#EABB4E]",
        bgColor: "bg-indigo-50",
      },
    ],
    [t]
  );

  // Admin services
  const adminServices = useMemo(
    () => [
      {
        icon: Users,
        title: t("dashboard.admin.userManagement"),
        description: t("dashboard.admin.userManagementDesc"),
        link: "/admin/users",
        color: "from-[#6CAEBD] to-[#115740]",
      },
      {
        icon: Layers,
        title: t("dashboard.admin.mainCategories"),
        description: t("dashboard.admin.mainCategoriesDesc"),
        link: "/admin/main-categories",
        color: "from-[#875E9E] to-[#6CAEBD]",
      },
      {
        icon: Building2,
        title: t("dashboard.admin.departmentManagement"),
        description: t("dashboard.admin.departmentManagementDesc"),
        link: "/admin/departments",
        color: "from-[#EABB4E] to-[#115740]",
      },
      {
        icon: MessageCircleQuestion,
        title: t("dashboard.admin.faqManagement"),
        description: t("dashboard.admin.faqManagementDesc"),
        link: "/admin/faqs",
        color: "from-[#6CAEBD] to-[#EABB4E]",
      },
      {
        icon: Award,
        title: t("dashboard.admin.leadershipManagement"),
        description: t("dashboard.admin.leadershipManagementDesc"),
        link: "/admin/leadership",
        color: "from-[#875E9E] to-[#115740]",
      },
      {
        icon: Calendar,
        title: t("dashboard.admin.visitCalendar"),
        description: t("dashboard.admin.visitCalendarDesc"),
        link: "/admin/calendar",
        color: "from-[#EABB4E] to-[#6CAEBD]",
        showForSuperAdmin: true,
      },
      {
        icon: Settings,
        title: t("dashboard.admin.systemSettings"),
        description: t("dashboard.admin.systemSettingsDesc"),
        link: "/admin/settings",
        color: "from-[#6CAEBD] to-[#875E9E]",
        showForSuperAdmin: true,
      },
      {
        icon: ScrollText,
        title: t("dashboard.admin.systemLogs"),
        description: t("dashboard.admin.systemLogsDesc"),
        link: "/admin/logs",
        color: "from-[#115740] to-[#EABB4E]",
        showForSuperAdmin: true,
      },
    ],
    [t]
  );

  return {
    // State
    language,
    isAdmin,
    isSuperAdmin,
    isEmployee,
    isUser,
    userProfile,
    requestsArray,
    requestCounts,
    recentRequestsNeedingAction,
    
    // Data
    stats,
    requestsData,
    requestTypesData,
    isLoadingMonthly,
    isLoadingTypes,
    services,
    adminServices,
    
    // Functions
    getUserDisplayName,
    t,
  };
};
