/**
 * Calendar Logic
 * Contains all state management, API calls, and event handlers for the FullCalendar component
 */

import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { EventClickArg } from "@fullcalendar/core";
import { useI18n } from "@/i18n";
import { toast } from "sonner";
import { visitsApi } from "@/features/visits/api/visits.api";
import { VisitDto } from "@/core/types/api";
import { VisitStatus, getVisitStatusName } from "@/core/constants/visitStatuses";
import {
  CalendarEvent,
  CalendarView,
  VisitRequest,
  VisitsApiResponse,
} from "../types/Calendar.types";

/**
 * Get color based on visit status
 * Uses the actual VisitStatus constants from core
 */
export const getStatusColor = (statusId: number) => {
  switch (statusId) {
    case VisitStatus.SCHEDULED: // 1
      return {
        backgroundColor: "#6CAEBD", // Blue for scheduled
        borderColor: "#5E9CAA",
        textColor: "#FFFFFF",
      };
    case VisitStatus.ACCEPTED: // 2
      return {
        backgroundColor: "#115740", // Green for accepted
        borderColor: "#0D4533",
        textColor: "#FFFFFF",
      };
    case VisitStatus.RESCHEDULED: // 3
      return {
        backgroundColor: "#EABB4E", // Yellow/Orange for needs rescheduling
        borderColor: "#D4A944",
        textColor: "#FFFFFF",
      };
    case VisitStatus.COMPLETED: // 4
      return {
        backgroundColor: "#875E9E", // Purple for completed
        borderColor: "#6D4B7F",
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
  const statusText = getVisitStatusName(visit.statusId, language);
  
  return {
    id: String(visit.id),
    title: `${name} - ${leadership} (${statusText})`,
    start: new Date(visit.visitDateTime),
    end: new Date(visit.visitEndDateTime),
    ...colors,
    extendedProps: {
      visitRequest: visit,
      statusId: visit.statusId,
    },
  };
};


export const useCalendarLogic = () => {
  const { language } = useI18n();
  const navigate = useNavigate();
  
  // State - Consolidated for better performance
  const [state, setState] = useState({
    events: [] as CalendarEvent[],
    isLoading: false,
    currentView: "dayGridMonth" as CalendarView,
  });

  // Generic state updater
  const updateState = (updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  // Individual setters for backward compatibility
  const setEvents = (value: CalendarEvent[]) => updateState({ events: value });
  const setIsLoading = (value: boolean) => updateState({ isLoading: value });
  const setCurrentView = (value: CalendarView) => updateState({ currentView: value });

  // Destructure state for easier access
  const { events, isLoading, currentView } = state;

  /**
   * Fetch visits from API
   */
  const fetchVisits = useCallback(async (leadershipId?: number) => {
    setIsLoading(true);
    try {
      // Fetch visits from the API
      const visitsData = await visitsApi.getAllVisits(leadershipId);
      
      // Transform VisitDto to calendar events
      const calendarEvents = visitsData.map((visit: VisitDto) => {
        const colors = getStatusColor(visit.status);
        const statusText = getVisitStatusName(visit.status, language as "ar" | "en");
        
        return {
          id: String(visit.id),
          title: `${visit.requestNumber || `Visit ${visit.id}`} - ${visit.leadershipNameAr || visit.leadershipName || ''} (${statusText})`,
          start: new Date(visit.visitDate),
          end: new Date(visit.visitDate), // Single date visit
          backgroundColor: colors.backgroundColor,
          borderColor: colors.borderColor,
          textColor: colors.textColor,
          extendedProps: {
            visitRequest: visit as any, // Cast for compatibility
            statusId: visit.status,
          },
        };
      });
      
      setEvents(calendarEvents);
    } catch (error) {
      toast.error("Failed to load visits");
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
    navigate(`/dashboard/request/${visit.requestId}`);
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
 * Removed - using getVisitStatusName from core constants instead
 */
