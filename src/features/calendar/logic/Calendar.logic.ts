/**
 * Calendar Logic
 * Contains all state management, API calls, and event handlers for the FullCalendar component
 */

import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { EventClickArg } from "@fullcalendar/core";
import { useI18n } from "@/i18n";
import apiClient from "@/core/lib/apiClient";
import {
  CalendarEvent,
  CalendarView,
  VisitRequest,
  VisitStatus,
  VisitsApiResponse,
} from "../types/Calendar.types";

/**
 * Get color based on visit status
 */
export const getStatusColor = (statusId: VisitStatus) => {
  switch (statusId) {
    case VisitStatus.PENDING:
      return {
        backgroundColor: "#EABB4E",
        borderColor: "#D4A944",
        textColor: "#FFFFFF",
      };
    case VisitStatus.APPROVED:
      return {
        backgroundColor: "#6CAEBD",
        borderColor: "#5E9CAA",
        textColor: "#FFFFFF",
      };
    case VisitStatus.COMPLETED:
      return {
        backgroundColor: "#115740",
        borderColor: "#0D4533",
        textColor: "#FFFFFF",
      };
    case VisitStatus.REJECTED:
      return {
        backgroundColor: "#DC2626",
        borderColor: "#B91C1C",
        textColor: "#FFFFFF",
      };
    default:
      return {
        backgroundColor: "#6B7280",
        borderColor: "#4B5563",
        textColor: "#FFFFFF",
      };
  }
};

/**
 * Transform visit request to calendar event
 */
export const transformVisitToEvent = (
  visit: VisitRequest,
  language: "ar" | "en"
): CalendarEvent => {
  const colors = getStatusColor(visit.statusId);
  const name = language === "ar" ? visit.nameAr : visit.nameEn;
  const leadership = language === "ar" ? visit.leadershipNameAr : visit.leadershipNameEn;
  
  return {
    id: String(visit.id),
    title: `${name} - ${leadership}`,
    start: new Date(visit.visitDateTime),
    end: new Date(visit.visitEndDateTime),
    ...colors,
    extendedProps: {
      visitRequest: visit,
      statusId: visit.statusId,
    },
  };
};

/**
 * Dummy visit requests for testing
 */
const DUMMY_VISIT_REQUESTS: VisitRequest[] = [
  {
    id: 1,
    requestNumber: "REQ-2025-001",
    requestId: 101,
    nameAr: "سارة أحمد العتيبي",
    nameEn: "Sarah Ahmed Al-Otaibi",
    email: "sarah.alotaibi@university.edu.sa",
    phone: "+966501234567",
    visitDateTime: new Date(2025, 11, 5, 10, 0).toISOString(), // Dec 5, 2025, 10:00 AM
    visitEndDateTime: new Date(2025, 11, 5, 11, 0).toISOString(),
    leadershipNameAr: "عميد شؤون الطلاب",
    leadershipNameEn: "Dean of Student Affairs",
    reason: "مناقشة موضوع التخرج والخطة الدراسية",
    location: "مبنى الإدارة - الدور الثالث - مكتب 301",
    statusId: VisitStatus.APPROVED,
    notes: "يرجى إحضار الوثائق المطلوبة",
  },
  {
    id: 2,
    requestNumber: "REQ-2025-002",
    requestId: 102,
    nameAr: "عبدالله خالد الشمري",
    nameEn: "Abdullah Khaled Al-Shammari",
    email: "abdullah.shammari@university.edu.sa",
    phone: "+966502345678",
    visitDateTime: new Date(2025, 11, 8, 14, 0).toISOString(), // Dec 8, 2025
    visitEndDateTime: new Date(2025, 11, 8, 15, 0).toISOString(),
    leadershipNameAr: "وكيل الكلية للشؤون الأكاديمية",
    leadershipNameEn: "Vice Dean for Academic Affairs",
    reason: "استفسار عن برنامج التبادل الطلابي",
    location: "مبنى الإدارة - الدور الثاني - مكتب 205",
    statusId: VisitStatus.PENDING,
  },
  {
    id: 3,
    requestNumber: "REQ-2025-003",
    requestId: 103,
    nameAr: "نورة سعد القحطاني",
    nameEn: "Noura Saad Al-Qahtani",
    email: "noura.qahtani@university.edu.sa",
    phone: "+966503456789",
    visitDateTime: new Date(2025, 11, 10, 9, 0).toISOString(), // Dec 10, 2025
    visitEndDateTime: new Date(2025, 11, 10, 10, 0).toISOString(),
    leadershipNameAr: "رئيس القسم الأكاديمي",
    leadershipNameEn: "Head of Academic Department",
    reason: "مناقشة خطة البحث والإشراف الأكاديمي",
    location: "مبنى الكليات - الدور الأول - مكتب 105",
    statusId: VisitStatus.APPROVED,
    notes: "موعد مؤكد",
  },
  {
    id: 4,
    requestNumber: "REQ-2025-004",
    requestId: 104,
    nameAr: "محمد عبدالرحمن السهلي",
    nameEn: "Mohammed Abdulrahman Al-Sahli",
    email: "mohammed.sahli@university.edu.sa",
    phone: "+966504567890",
    visitDateTime: new Date(2025, 11, 12, 11, 0).toISOString(), // Dec 12, 2025
    visitEndDateTime: new Date(2025, 11, 12, 12, 0).toISOString(),
    leadershipNameAr: "عميد الكلية",
    leadershipNameEn: "Dean of the College",
    reason: "طلب توصية للدراسات العليا",
    location: "مبنى الإدارة - الدور الثالث - مكتب 310",
    statusId: VisitStatus.COMPLETED,
    notes: "تم إنجاز الموعد بنجاح",
  },
  {
    id: 5,
    requestNumber: "REQ-2025-005",
    requestId: 105,
    nameAr: "فاطمة محمد الدوسري",
    nameEn: "Fatimah Mohammed Al-Dosari",
    email: "fatimah.dosari@university.edu.sa",
    phone: "+966505678901",
    visitDateTime: new Date(2025, 11, 15, 13, 0).toISOString(), // Dec 15, 2025
    visitEndDateTime: new Date(2025, 11, 15, 14, 0).toISOString(),
    leadershipNameAr: "وكيل الجامعة للشؤون التعليمية",
    leadershipNameEn: "Vice President for Educational Affairs",
    reason: "استشارة أكاديمية حول المسار الوظيفي",
    location: "مبنى الرئاسة - الدور الرابع - مكتب 401",
    statusId: VisitStatus.REJECTED,
    notes: "تم الرفض بسبب تعارض المواعيد",
  },
  {
    id: 6,
    requestNumber: "REQ-2025-006",
    requestId: 106,
    nameAr: "أحمد علي المطيري",
    nameEn: "Ahmed Ali Al-Mutairi",
    email: "ahmed.mutairi@university.edu.sa",
    phone: "+966506789012",
    visitDateTime: new Date(2025, 11, 18, 10, 30).toISOString(), // Dec 18, 2025
    visitEndDateTime: new Date(2025, 11, 18, 11, 30).toISOString(),
    leadershipNameAr: "مدير شؤون الطلاب",
    leadershipNameEn: "Director of Student Affairs",
    reason: "مناقشة خطة التطوع والأنشطة الطلابية",
    location: "مبنى الأنشطة - الدور الأول - مكتب 102",
    statusId: VisitStatus.APPROVED,
  },
  {
    id: 7,
    requestNumber: "REQ-2025-007",
    requestId: 107,
    nameAr: "ليلى حسن الغامدي",
    nameEn: "Layla Hassan Al-Ghamdi",
    email: "layla.ghamdi@university.edu.sa",
    phone: "+966507890123",
    visitDateTime: new Date(2025, 11, 20, 9, 0).toISOString(), // Dec 20, 2025
    visitEndDateTime: new Date(2025, 11, 20, 10, 0).toISOString(),
    leadershipNameAr: "رئيس قسم البحث العلمي",
    leadershipNameEn: "Head of Research Department",
    reason: "مناقشة مشروع بحثي مشترك",
    location: "مبنى البحث العلمي - الدور الثاني - مكتب 208",
    statusId: VisitStatus.PENDING,
  },
];

/**
 * Custom hook for calendar logic
 */
export const useCalendarLogic = () => {
  const { language } = useI18n();
  const navigate = useNavigate();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState<CalendarView>("dayGridMonth");

  /**
   * Fetch visits from API
   */
  const fetchVisits = useCallback(async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API endpoint when available
      // const response = await apiClient.get<VisitsApiResponse>("/api/visits");
      
      // For now, use dummy data
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      
      const calendarEvents = DUMMY_VISIT_REQUESTS.map((visit: VisitRequest) =>
        transformVisitToEvent(visit, language)
      );
      setEvents(calendarEvents);
      
      // When API is ready, use this:
      // if (response.data.success && response.data.data) {
      //   const calendarEvents = response.data.data.map((visit: VisitRequest) =>
      //     transformVisitToEvent(visit, language)
      //   );
      //   setEvents(calendarEvents);
      // }
    } catch (error) {
      console.error("Error fetching visits:", error);
    } finally {
      setIsLoading(false);
    }
  }, [language]);

  /**
   * Load visits on mount
   */
  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  /**
   * Handle event click - redirect to request details page
   */
  const handleEventClick = useCallback((clickInfo: EventClickArg) => {
    const visit = clickInfo.event.extendedProps.visitRequest as VisitRequest;
    // Redirect to request details page
    navigate(`/dashboard/requests/${visit.requestId}`);
  }, [navigate]);

  /**
   * Handle view change
   */
  const handleViewChange = useCallback((view: CalendarView) => {
    setCurrentView(view);
  }, []);

  return {
    // State
    events,
    isLoading,
    currentView,
    language,

    // Handlers
    handleEventClick,
    handleViewChange,
    fetchVisits,
  };
};

/**
 * Get status text based on language
 */
export const getStatusText = (statusId: VisitStatus, language: "ar" | "en"): string => {
  const statusTexts = {
    [VisitStatus.PENDING]: { ar: "قيد الانتظار", en: "Pending" },
    [VisitStatus.APPROVED]: { ar: "مؤكد", en: "Approved" },
    [VisitStatus.COMPLETED]: { ar: "مكتمل", en: "Completed" },
    [VisitStatus.REJECTED]: { ar: "مرفوض", en: "Rejected" },
  };

  return statusTexts[statusId]?.[language] || "Unknown";
};
