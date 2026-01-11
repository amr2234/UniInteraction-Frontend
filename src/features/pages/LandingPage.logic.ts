import { useMemo } from "react";
import { useI18n } from "@/i18n";
import { authApi } from "@/features/auth/api/auth.api";
import { useUserRole } from "@/core/hooks";
import { useFaqs } from "@/features/admin/faqs/hooks/useFaqs";
import {
  HelpCircle,
  AlertCircle,
  Calendar,
  Shield,
  Zap,
  Users,
  GraduationCap,
  Briefcase,
  UserCircle,
} from "lucide-react";

export const useLandingPage = () => {
  const { t, language } = useI18n();
  const isLoggedIn = authApi.isAuthenticated();
  const { isAdmin, isEmployee, isUser } = useUserRole();

  const { data: faqsData, isLoading: isFaqsLoading } = useFaqs({
    isActive: true,
    pageNumber: 1,
    pageSize: 3,
    sortBy: 'order',
    sortOrder: 'asc',
  });

  // Map FAQs from paginated response - Memoized
  const faqs = useMemo(() => {
    return faqsData?.items
      ?.map((faq) => ({
        question: language === "ar" ? faq.questionAr : faq.questionEn || faq.questionAr,
        answer: language === "ar" ? faq.answerAr : faq.answerEn || faq.answerAr,
      })) || [];
  }, [faqsData?.items, language]);

  // Main services configuration - Memoized
  const mainServices = useMemo(() => [
    {
      icon: HelpCircle,
      title: t("landing.services.inquiry"),
      description: t("landing.services.inquiryDesc"),
      link: "/dashboard/inquiry",
      gradient: "from-[#6CAEBD] to-[#6CAEBD]/70",
      color: "text-[#6CAEBD]",
      bgColor: "bg-[#6CAEBD]/10",
    },
    {
      icon: AlertCircle,
      title: t("landing.services.complaintSuggestion"),
      description: t("landing.services.complaintSuggestionDesc"),
      link: "/dashboard/complaint",
      gradient: "from-[#875E9E] to-[#EABB4E]",
      color: "text-[#875E9E]",
      bgColor: "bg-gradient-to-br from-[#875E9E]/10 to-[#EABB4E]/10",
    },
    {
      icon: Calendar,
      title: t("landing.services.bookAppointment"),
      description: t("landing.services.bookAppointmentDesc"),
      link: "/dashboard/book-visit",
      gradient: "from-[#6CAEBD] to-[#875E9E]",
      color: "text-[#6CAEBD]",
      bgColor: "bg-gradient-to-br from-[#6CAEBD]/10 to-[#875E9E]/10",
    },
  ], [t]);

  // Features configuration - Memoized
  const features = useMemo(() => [
    {
      icon: Shield,
      title: t("landing.features.security"),
      description: t("landing.features.securityDesc"),
      color: "text-[#6CAEBD]",
      bgColor: "bg-[#6CAEBD]/10",
    },
    {
      icon: Zap,
      title: t("landing.features.fastResponse"),
      description: t("landing.features.fastResponseDesc"),
      color: "text-[#875E9E]",
      bgColor: "bg-[#875E9E]/10",
    },
    {
      icon: Users,
      title: t("landing.features.support"),
      description: t("landing.features.supportDesc"),
      color: "text-[#6CAEBD]",
      bgColor: "bg-[#6CAEBD]/10",
    },
  ], [t]);

  // Statistics configuration - Memoized
  const stats = useMemo(() => [
    { number: "+15,000", label: t("landing.stats.students") },
    { number: "+50,000", label: t("landing.stats.completedRequests") },
    { number: "98%", label: t("landing.stats.satisfaction") },
  ], [t]);

  // User types configuration - Memoized
  const userTypes = useMemo(() => [
    {
      icon: GraduationCap,
      title: t("landing.userTypes.students"),
      description: t("landing.userTypes.studentsDesc"),
      color: "text-[#6CAEBD]",
    },
    {
      icon: Briefcase,
      title: t("landing.userTypes.staff"),
      description: t("landing.userTypes.staffDesc"),
      color: "text-[#875E9E]",
    },
    {
      icon: UserCircle,
      title: t("landing.userTypes.visitors"),
      description: t("landing.userTypes.visitorsDesc"),
      color: "text-[#EABB4E]",
    },
  ], [t]);

  return {
    t,
    language,
    isLoggedIn,
    isAdmin,
    isEmployee,
    isUser,
    mainServices,
    features,
    stats,
    userTypes,
    faqs,
    isFaqsLoading,
  };
};
