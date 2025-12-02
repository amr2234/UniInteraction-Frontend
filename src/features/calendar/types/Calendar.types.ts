/**
 * Calendar Types and Interfaces
 * Defines all types used in the FullCalendar component
 */

import { EventInput } from "@fullcalendar/core";

/**
 * Visit status enumeration
 */
export enum VisitStatus {
  PENDING = 1,
  APPROVED = 2,
  COMPLETED = 3,
  REJECTED = 4,
}

/**
 * Calendar view types supported by FullCalendar
 */
export type CalendarView = "dayGridMonth" | "timeGridWeek" | "timeGridDay" | "listWeek";

/**
 * Visit request interface from API
 */
export interface VisitRequest {
  id: number | string;
  requestId: number; // The actual request ID to link to request details page
  requestNumber: string;
  nameAr: string;
  nameEn: string;
  visitDateTime: string | Date;
  visitEndDateTime: string | Date;
  leadershipNameAr: string;
  leadershipNameEn: string;
  reason: string;
  location: string;
  statusId: VisitStatus;
  email?: string;
  phone?: string;
  notes?: string;
}

/**
 * FullCalendar event interface (extends EventInput)
 */
export interface CalendarEvent extends EventInput {
  id: string;
  title: string;
  start: string | Date;
  end: string | Date;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    visitRequest: VisitRequest;
    statusId: VisitStatus;
  };
}

/**
 * Props for the FullCalendar component
 */
export interface FullCalendarProps {
  /** Array of visit events to display */
  events?: CalendarEvent[];
  /** Initial view mode */
  initialView?: CalendarView;
  /** Callback when an event is clicked */
  onEventClick?: (event: VisitRequest) => void;
  /** Callback when an empty date is clicked */
  onDateClick?: (date: Date) => void;
  /** Callback when events need to be refetched */
  onRefetch?: () => void;
  /** Loading state */
  isLoading?: boolean;
  /** Custom height */
  height?: string | number;
}

/**
 * API Response for fetching visits
 */
export interface VisitsApiResponse {
  success: boolean;
  data: VisitRequest[];
  message?: string;
}

/**
 * Side panel props
 */
export interface VisitDetailsPanelProps {
  isOpen: boolean;
  visit: VisitRequest | null;
  onClose: () => void;
  language: "ar" | "en";
}

/**
 * Add visit modal props
 */
export interface AddVisitModalProps {
  isOpen: boolean;
  selectedDate: Date | null;
  onClose: () => void;
  onSubmit: (visitData: Partial<VisitRequest>) => void;
  language: "ar" | "en";
}
