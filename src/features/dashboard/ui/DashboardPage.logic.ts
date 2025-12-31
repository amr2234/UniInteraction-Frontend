import { useMemo } from "react";
import { useI18n } from "@/i18n";
import { useUserRole } from "@/core/hooks";
import { useUserRequests, useRequestCountsByStatus } from "@/features/requests/hooks/useRequests";
import { authApi } from "@/features/auth/api/auth.api";
import { RequestStatus } from "@/core/constants/requestStatuses";
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

  // Get recent requests that need action (All non-closed requests) - limit to 2
  const recentRequestsNeedingAction = useMemo(
    () =>
      requestsArray
        .filter((r: any) => r.requestStatusId !== RequestStatus.CLOSED && r.requestStatusId !== RequestStatus.REPLIED)
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

  // Line chart data - Requests over time
  const requestsData = useMemo(
    () => [
      { name: t("dashboard.months.january"), طلبات: 65, مكتمل: 45, قيدالمراجعة: 20 },
      { name: t("dashboard.months.february"), طلبات: 78, مكتمل: 62, قيدالمراجعة: 16 },
      { name: t("dashboard.months.march"), طلبات: 90, مكتمل: 75, قيدالمراجعة: 15 },
      { name: t("dashboard.months.april"), طلبات: 81, مكتمل: 70, قيدالمراجعة: 11 },
      { name: t("dashboard.months.may"), طلبات: 95, مكتمل: 82, قيدالمراجعة: 13 },
      { name: t("dashboard.months.june"), طلبات: 112, مكتمل: 98, قيدالمراجعة: 14 },
    ],
    [t]
  );

  // Bar chart data - Request types
  const requestTypesData = useMemo(
    () => [
      { name: t("requests.types.complaints"), count: 145, fill: "#875E9E" },
      { name: t("requests.types.inquiries"), count: 198, fill: "#6CAEBD" },
      { name: t("requests.types.visits"), count: 45, fill: "#EABB4E" },
    ],
    [t]
  );

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
    services,
    adminServices,
    
    // Functions
    getUserDisplayName,
    t,
  };
};
