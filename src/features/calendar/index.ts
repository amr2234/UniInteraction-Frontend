/**
 * Calendar Module Exports
 * Central export point for all calendar-related components and utilities
 */

// Main Component
export { FullCalendarComponent } from "./components/FullCalendarComponent";

// Sub-components
export { VisitDetailsPanel } from "./components/VisitDetailsPanel";
export { AddVisitModal } from "./components/AddVisitModal";

// Logic and Hooks
export { useCalendarLogic, getStatusColor, getStatusText, transformVisitToEvent } from "./logic/Calendar.logic";

// Types
export type {
  CalendarEvent,
  CalendarView,
  VisitRequest,
  FullCalendarProps,
  VisitsApiResponse,
  VisitDetailsPanelProps,
  AddVisitModalProps,
} from "./types/Calendar.types";

export { VisitStatus } from "./types/Calendar.types";
