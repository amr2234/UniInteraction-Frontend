/**
 * FullCalendar Component
 * A comprehensive calendar component using FullCalendar with support for:
 * - Arabic/English (RTL/LTR)
 * - Month/Week/Day views
 * - Event highlighting
 * - Event click → redirect to request details page
 * - View-only (no adding visits from calendar)
 * - Status-based color coding
 */

import { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  List,
  Clock,
} from "lucide-react";
import { useCalendarLogic } from "../logic/Calendar.logic";
import { CalendarView } from "../types/Calendar.types";
import "./calendar-custom.css";

/**
 * Main FullCalendar Component
 * 
 * Usage Example:
 * ```tsx
 * import { FullCalendarComponent } from "@/features/calendar/components/FullCalendarComponent";
 * 
 * function MyPage() {
 *   return <FullCalendarComponent />;
 * }
 * ```
 * 
 * Or with custom props:
 * ```tsx
 * <FullCalendarComponent
 *   events={customEvents}
 *   initialView="timeGridWeek"
 *   onEventClick={(visit) => console.log(visit)}
 * />
 * ```
 */
export function FullCalendarComponent() {
  const calendarRef = useRef<FullCalendar>(null);
  
  const {
    events,
    isLoading,
    currentView,
    language,
    handleEventClick,
    handleViewChange,
    fetchVisits,
  } = useCalendarLogic();

  // RTL support
  const isRTL = language === "ar";
  const direction = isRTL ? "rtl" : "ltr";

  /**
   * Navigate to previous period
   */
  const handlePrevious = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.prev();
  };

  /**
   * Navigate to next period
   */
  const handleNext = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.next();
  };

  /**
   * Navigate to today
   */
  const handleToday = () => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.today();
  };

  /**
   * Change calendar view
   */
  const changeView = (view: CalendarView) => {
    const calendarApi = calendarRef.current?.getApi();
    calendarApi?.changeView(view);
    handleViewChange(view);
  };

  // Localized button texts
  const buttonText = isRTL
    ? {
        today: "اليوم",
        month: "شهر",
        week: "أسبوع",
        day: "يوم",
        list: "قائمة",
      }
    : {
        today: "Today",
        month: "Month",
        week: "Week",
        day: "Day",
        list: "List",
      };

  return (
    <>
      <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
        {/* Custom Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EABB4E] to-[#6CAEBD] flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-[#EABB4E] text-xl font-bold">
                {isRTL ? "تقويم الزيارات" : "Visit Calendar"}
              </h2>
              <p className="text-xs text-[#6F6F6F]">
                {isRTL
                  ? "عرض جميع زيارات القيادات المجدولة"
                  : "View all scheduled leadership visits"}
              </p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              className="rounded-lg"
            >
              {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleToday}
              className="rounded-lg"
            >
              {buttonText.today}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              className="rounded-lg"
            >
              {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Button
            variant={currentView === "dayGridMonth" ? "default" : "outline"}
            size="sm"
            onClick={() => changeView("dayGridMonth")}
            className="rounded-lg"
          >
            <CalendarDays className="w-4 h-4 mr-2" />
            {buttonText.month}
          </Button>

          <Button
            variant={currentView === "timeGridWeek" ? "default" : "outline"}
            size="sm"
            onClick={() => changeView("timeGridWeek")}
            className="rounded-lg"
          >
            <CalendarDays className="w-4 h-4 mr-2" />
            {buttonText.week}
          </Button>

          <Button
            variant={currentView === "timeGridDay" ? "default" : "outline"}
            size="sm"
            onClick={() => changeView("timeGridDay")}
            className="rounded-lg"
          >
            <Clock className="w-4 h-4 mr-2" />
            {buttonText.day}
          </Button>

          <Button
            variant={currentView === "listWeek" ? "default" : "outline"}
            size="sm"
            onClick={() => changeView("listWeek")}
            className="rounded-lg"
          >
            <List className="w-4 h-4 mr-2" />
            {buttonText.list}
          </Button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-96 w-full" />
          </div>
        ) : (
          /* FullCalendar */
          <div dir={direction} className="calendar-container">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
              initialView={currentView}
              events={events}
              eventClick={handleEventClick}
              headerToolbar={false} // We use custom header
              locale={isRTL ? "ar" : "en"}
              direction={direction}
              height="auto"
              eventDisplay="block"
              displayEventTime={true}
              displayEventEnd={true}
              eventTimeFormat={{
                hour: "2-digit",
                minute: "2-digit",
                meridiem: "short",
              }}
              slotLabelFormat={{
                hour: "2-digit",
                minute: "2-digit",
                meridiem: "short",
              }}
              dayMaxEvents={3}
              moreLinkText={isRTL ? "المزيد" : "more"}
              noEventsText={isRTL ? "لا توجد زيارات" : "No visits scheduled"}
              allDayText={isRTL ? "طوال اليوم" : "All day"}
              buttonText={buttonText}
              weekends={true}
              editable={false}
              selectable={false}
              selectMirror={false}
              dayHeaderFormat={{ weekday: "short" }}
              nowIndicator={true}
            />
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-[#6F6F6F] font-medium mb-3">
            {isRTL ? "الحالات:" : "Status Legend:"}
          </p>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#EABB4E]"></div>
              <span className="text-xs text-[#6F6F6F]">
                {isRTL ? "قيد الانتظار" : "Pending"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#6CAEBD]"></div>
              <span className="text-xs text-[#6F6F6F]">
                {isRTL ? "مؤكد" : "Approved"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#115740]"></div>
              <span className="text-xs text-[#6F6F6F]">
                {isRTL ? "مكتمل" : "Completed"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#DC2626]"></div>
              <span className="text-xs text-[#6F6F6F]">
                {isRTL ? "مرفوض" : "Rejected"}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </>
  );
}
