import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useI18n } from "@/i18n";
import { CalendarDays, Clock, User, MapPin } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { ar, enUS } from "date-fns/locale";

// Mock data for visit requests
const mockVisitRequests = [
  {
    id: 1,
    requestNumber: "REQ-2025-00126",
    nameAr: "سارة محمد العتيبي",
    nameEn: "Sarah Mohammed Al-Otaibi",
    visitDateTime: new Date(2025, 0, 15, 10, 0), // Jan 15, 2025, 10:00 AM
    visitEndDateTime: new Date(2025, 0, 15, 11, 0),
    leadershipNameAr: "عميد شؤون الطلاب",
    leadershipNameEn: "Dean of Student Affairs",
    reason: "مناقشة موضوع التخرج",
    location: "مبنى الإدارة - الدور الثالث - مكتب 301",
    statusId: 1,
  },
  {
    id: 2,
    requestNumber: "REQ-2025-00127",
    nameAr: "عبدالله خالد الشمري",
    nameEn: "Abdullah Khaled Al-Shammari",
    visitDateTime: new Date(2025, 0, 15, 14, 0),
    visitEndDateTime: new Date(2025, 0, 15, 15, 0),
    leadershipNameAr: "وكيل الكلية",
    leadershipNameEn: "Vice Dean",
    reason: "استفسار عن برنامج التبادل الطلابي",
    location: "مبنى الإدارة - الدور الثاني - مكتب 205",
    statusId: 2,
  },
  {
    id: 3,
    requestNumber: "REQ-2025-00128",
    nameAr: "نورة سعد القحطاني",
    nameEn: "Noura Saad Al-Qahtani",
    visitDateTime: new Date(2025, 0, 18, 9, 0),
    visitEndDateTime: new Date(2025, 0, 18, 10, 0),
    leadershipNameAr: "رئيس القسم الأكاديمي",
    leadershipNameEn: "Head of Academic Department",
    reason: "مناقشة خطة البحث",
    location: "مبنى الكليات - الدور الأول - مكتب 105",
    statusId: 1,
  },
  {
    id: 4,
    requestNumber: "REQ-2025-00129",
    nameAr: "محمد عبدالرحمن السهلي",
    nameEn: "Mohammed Abdulrahman Al-Sahli",
    visitDateTime: new Date(2025, 0, 20, 11, 0),
    visitEndDateTime: new Date(2025, 0, 20, 12, 0),
    leadershipNameAr: "عميد الكلية",
    leadershipNameEn: "Dean of the College",
    reason: "طلب توصية للدراسات العليا",
    location: "مبنى الإدارة - الدور الثالث - مكتب 310",
    statusId: 1,
  },
];

export function VisitCalendar() {
  const { t, language } = useI18n();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const locale = language === "ar" ? ar : enUS;

  // Get visits for selected date
  const visitsOnSelectedDate = mockVisitRequests.filter((visit) =>
    isSameDay(visit.visitDateTime, selectedDate)
  );

  // Get all dates that have visits
  const datesWithVisits = mockVisitRequests.map((visit) => visit.visitDateTime);

  const getStatusColor = (statusId: number) => {
    switch (statusId) {
      case 1:
        return "bg-[#EABB4E]";
      case 2:
        return "bg-[#6CAEBD]";
      case 3:
        return "bg-[#115740]";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusText = (statusId: number) => {
    switch (statusId) {
      case 1:
        return language === "ar" ? "قيد الانتظار" : "Pending";
      case 2:
        return language === "ar" ? "مؤكد" : "Confirmed";
      case 3:
        return language === "ar" ? "مكتمل" : "Completed";
      default:
        return language === "ar" ? "غير معروف" : "Unknown";
    }
  };

  return (
    <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EABB4E] to-[#6CAEBD] flex items-center justify-center">
          <CalendarDays className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-[#EABB4E] text-xl font-bold">
            {t("dashboard.visitCalendar")}
          </h2>
          <p className="text-xs text-[#6F6F6F]">
            {t("dashboard.visitCalendarDesc")}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            locale={locale}
            className="rounded-lg border shadow-sm"
            modifiers={{
              hasVisit: datesWithVisits,
            }}
            modifiersClassNames={{
              hasVisit: "bg-[#EABB4E]/20 text-[#EABB4E] font-bold",
            }}
          />
        </div>

        {/* Visit List for Selected Date */}
        <div>
          <h3 className="text-[#2B2B2B] font-semibold mb-4">
            {format(selectedDate, language === "ar" ? "d MMMM yyyy" : "MMMM d, yyyy", { locale })}
          </h3>

          {visitsOnSelectedDate.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDays className="w-16 h-16 text-[#6F6F6F]/30 mx-auto mb-4" />
              <p className="text-[#6F6F6F]">{t("dashboard.noVisitsOnThisDay")}</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {visitsOnSelectedDate.map((visit) => (
                <Card
                  key={visit.id}
                  className="p-4 rounded-lg border-0 shadow-sm bg-gradient-to-br from-gray-50 to-gray-100/50 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-semibold text-[#2B2B2B] bg-white px-2 py-1 rounded">
                          #{visit.requestNumber}
                        </span>
                        <span
                          className={`text-xs text-white px-2 py-0.5 rounded ${getStatusColor(
                            visit.statusId
                          )}`}
                        >
                          {getStatusText(visit.statusId)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-[#2B2B2B] mb-1">
                        <User className="w-4 h-4 text-[#6CAEBD]" />
                        <span className="font-medium">
                          {language === "ar" ? visit.nameAr : visit.nameEn}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-[#6F6F6F]">
                      <Clock className="w-3.5 h-3.5 text-[#EABB4E]" />
                      <span>
                        {format(visit.visitDateTime, "h:mm a", { locale })} -{" "}
                        {format(visit.visitEndDateTime, "h:mm a", { locale })}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-[#6F6F6F]">
                      <User className="w-3.5 h-3.5 text-[#875E9E] mt-0.5" />
                      <span>
                        {language === "ar" ? visit.leadershipNameAr : visit.leadershipNameEn}
                      </span>
                    </div>
                    <div className="flex items-start gap-2 text-[#6F6F6F]">
                      <MapPin className="w-3.5 h-3.5 text-[#115740] mt-0.5" />
                      <span>{visit.location}</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-[#6F6F6F] italic">{visit.reason}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
