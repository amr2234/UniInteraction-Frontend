import { FullCalendarComponent } from "../components/FullCalendarComponent";

export function CalendarPage() {
  return (
    <div className="min-h-screen bg-[#F4F4F4] p-6">
      <div className="max-w-7xl mx-auto">
        <FullCalendarComponent />
      </div>
    </div>
  );
}
