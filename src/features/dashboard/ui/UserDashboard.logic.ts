import { useMemo } from "react";
import { useI18n } from "@/i18n";
import { useUserRequests, useRequestCountsByStatus } from "@/features/requests/hooks/useRequests";
import { authApi } from "@/features/auth/api/auth.api";
import { RequestStatus } from "@/core/constants/requestStatuses";
import {
  HelpCircle,
  AlertCircle,
  Lightbulb,
  Calendar,
  FileSearch,
  User,
  Clock,
  CheckCircle2,
} from "lucide-react";

export const useUserDashboard = () => {
  const { t, language } = useI18n();
  const userProfile = authApi.getUserProfile();

  // Fetch request counts by status from API
  const { data: statusCounts = [] } = useRequestCountsByStatus();

  // Fetch only 2 recent requests for activity section - optimized for users
  const { data: allRequests = [] } = useUserRequests(
    { 
      pageNumber: 1, 
      pageSize: 2 
    },
    true // Enable pagination for better performance
  );

  // Ensure allRequests is always an array
  // Handle both paginated response {items: []} and direct array []
  const requestsArray = Array.isArray(allRequests)
    ? allRequests
    : (allRequests as any)?.items || [];

  // Calculate request counts from API response
  const requestCounts = useMemo(
    () => {
      const pending = statusCounts.find((s) => s.statusId === RequestStatus.RECEIVED)?.count || 0;
      const inProgress = statusCounts.find((s) => s.statusId === RequestStatus.UNDER_REVIEW)?.count || 0;
      const replied = statusCounts.find((s) => s.statusId === RequestStatus.REPLIED)?.count || 0;
      const closed = statusCounts.find((s) => s.statusId === RequestStatus.CLOSED)?.count || 0;

      return {
        active: pending + inProgress,
        completed: replied + closed,
      };
    },
    [statusCounts]
  );

  // Get user display name based on language
  const getUserDisplayName = () => {
    if (!userProfile) return "";
    return language === "ar" ? userProfile.nameAr : userProfile.nameEn || userProfile.nameAr;
  };

  // Quick stats for hero section
  const quickStats = useMemo(
    () => [
      {
        label: t("dashboard.user.quickStats.youHave"),
        value: String(requestCounts.active),
        description: t("dashboard.user.quickStats.activeRequests"),
        icon: Clock,
        gradient: "from-[#6CAEBD] to-[#875E9E]",
      },
      {
        label: t("dashboard.user.quickStats.completed"),
        value: String(requestCounts.completed),
        description: t("dashboard.user.quickStats.requestsThisMonth"),
        icon: CheckCircle2,
        gradient: "from-[#875E9E] to-[#EABB4E]",
      },
    ],
    [t, requestCounts]
  );

  // Main services
  const mainServices = useMemo(
    () => [
      {
        icon: HelpCircle,
        title: t("dashboard.user.services.inquiry.title"),
        description: t("dashboard.user.services.inquiry.description"),
        link: "/dashboard/inquiry",
        gradient: "from-[#6CAEBD] to-[#6CAEBD]/80",
        iconBg: "bg-[#6CAEBD]/10",
        iconColor: "text-[#6CAEBD]",
      },
      {
        icon: AlertCircle,
        title: t("dashboard.user.services.complaint.title"),
        description: t("dashboard.user.services.complaint.description"),
        link: "/dashboard/complaint",
        gradient: "from-[#875E9E] to-[#875E9E]/80",
        iconBg: "bg-[#875E9E]/10",
        iconColor: "text-[#875E9E]",
      },
      {
        icon: Lightbulb,
        title: t("dashboard.user.services.suggestion.title"),
        description: t("dashboard.user.services.suggestion.description"),
        link: "/dashboard/suggestion",
        gradient: "from-[#EABB4E] to-[#EABB4E]/80",
        iconBg: "bg-[#EABB4E]/10",
        iconColor: "text-[#EABB4E]",
      },
      {
        icon: Calendar,
        title: t("dashboard.user.services.bookVisit.title"),
        description: t("dashboard.user.services.bookVisit.description"),
        link: "/dashboard/book-visit",
        gradient: "from-[#6CAEBD] to-[#875E9E]",
        iconBg: "bg-gradient-to-br from-[#6CAEBD]/10 to-[#875E9E]/10",
        iconColor: "text-[#6CAEBD]",
      },
    ],
    [t]
  );

  // Quick links
  const quickLinks = useMemo(
    () => [
      {
        icon: FileSearch,
        title: t("dashboard.user.quickLinks.trackRequests"),
        link: "/dashboard/track",
      },
      {
        icon: User,
        title: t("dashboard.user.quickLinks.profile"),
        link: "/dashboard/profile",
      },
    ],
    [t]
  );

  // Recent activity - get last 2 activities
  const recentActivity = useMemo(
    () => {
      const getStatusInfo = (statusId: number) => {
        switch (statusId) {
          case RequestStatus.REPLIED:
          case RequestStatus.CLOSED:
            return {
              status: t("requests.statuses.replied"),
              icon: CheckCircle2,
              color: "text-green-600",
              bgColor: "bg-green-50",
            };
          case RequestStatus.UNDER_REVIEW:
            return {
              status: t("requests.statuses.inProgress"),
              icon: Clock,
              color: "text-[#EABB4E]",
              bgColor: "bg-[#EABB4E]/10",
            };
          default:
            return {
              status: t("requests.statuses.pending"),
              icon: Clock,
              color: "text-[#6CAEBD]",
              bgColor: "bg-[#6CAEBD]/10",
            };
        }
      };

      const getTimeAgo = (date: string) => {
        const now = new Date();
        const past = new Date(date);
        const diffInDays = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60 * 24));

        if (diffInDays === 0) return t("requests.timeAgo.today");
        if (diffInDays === 1) return t("requests.timeAgo.yesterday");
        if (diffInDays < 7)
          return t("requests.timeAgo.daysAgo").replace("{count}", String(diffInDays));
        if (diffInDays < 30) {
          const weeks = Math.floor(diffInDays / 7);
          return weeks === 1
            ? t("requests.timeAgo.weekAgo")
            : t("requests.timeAgo.weeksAgo").replace("{count}", String(weeks));
        }
        const months = Math.floor(diffInDays / 30);
        return months === 1
          ? t("requests.timeAgo.monthAgo")
          : t("requests.timeAgo.monthsAgo").replace("{count}", String(months));
      };

      return requestsArray
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 2)
        .map((request: any) => {
          const statusInfo = getStatusInfo(request.requestStatusId);
          const title = language === "ar" ? request.titleAr : request.titleEn || request.titleAr;

          return {
            id: request.id,
            title,
            status: statusInfo.status,
            date: getTimeAgo(request.createdAt),
            icon: statusInfo.icon,
            color: statusInfo.color,
            bgColor: statusInfo.bgColor,
          };
        });
    },
    [requestsArray, language, t]
  );

  return {
    // State
    language,
    userProfile,
    
    // Data
    quickStats,
    mainServices,
    quickLinks,
    recentActivity,
    
    // Functions
    getUserDisplayName,
    t,
  };
};
