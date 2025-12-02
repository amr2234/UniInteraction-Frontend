/**
 * Visit Details Side Panel
 * Displays full visit details when an event is clicked
 */

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  User,
  Calendar,
  Clock,
  MapPin,
  Mail,
  Phone,
  FileText,
  Building,
} from "lucide-react";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { VisitDetailsPanelProps, VisitStatus } from "../types/Calendar.types";
import { getStatusText, getStatusColor } from "../logic/Calendar.logic";

export function VisitDetailsPanel({
  isOpen,
  visit,
  onClose,
  language,
}: VisitDetailsPanelProps) {
  if (!visit) return null;

  const isRTL = language === "ar";
  const locale = isRTL ? ar : enUS;
  const statusColor = getStatusColor(visit.statusId);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side={isRTL ? "left" : "right"} className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>{isRTL ? "تفاصيل الزيارة" : "Visit Details"}</span>
            <Badge style={{ backgroundColor: statusColor.backgroundColor }}>
              {getStatusText(visit.statusId, language)}
            </Badge>
          </SheetTitle>
          <SheetDescription>
            {isRTL ? `رقم الطلب: ${visit.requestNumber}` : `Request #${visit.requestNumber}`}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Visitor Information */}
          <div>
            <h3 className="text-sm font-semibold text-[#2B2B2B] mb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-[#6CAEBD]" />
              {isRTL ? "معلومات الزائر" : "Visitor Information"}
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <User className="w-4 h-4 text-[#6F6F6F] mt-0.5" />
                <div>
                  <p className="text-xs text-[#6F6F6F]">{isRTL ? "الاسم" : "Name"}</p>
                  <p className="text-sm font-medium text-[#2B2B2B]">
                    {isRTL ? visit.nameAr : visit.nameEn}
                  </p>
                </div>
              </div>

              {visit.email && (
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-[#6F6F6F] mt-0.5" />
                  <div>
                    <p className="text-xs text-[#6F6F6F]">{isRTL ? "البريد الإلكتروني" : "Email"}</p>
                    <p className="text-sm font-medium text-[#2B2B2B]">{visit.email}</p>
                  </div>
                </div>
              )}

              {visit.phone && (
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-[#6F6F6F] mt-0.5" />
                  <div>
                    <p className="text-xs text-[#6F6F6F]">{isRTL ? "الهاتف" : "Phone"}</p>
                    <p className="text-sm font-medium text-[#2B2B2B]">{visit.phone}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Visit Details */}
          <div>
            <h3 className="text-sm font-semibold text-[#2B2B2B] mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#EABB4E]" />
              {isRTL ? "تفاصيل الزيارة" : "Visit Details"}
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Calendar className="w-4 h-4 text-[#6F6F6F] mt-0.5" />
                <div>
                  <p className="text-xs text-[#6F6F6F]">{isRTL ? "التاريخ" : "Date"}</p>
                  <p className="text-sm font-medium text-[#2B2B2B]">
                    {format(new Date(visit.visitDateTime), "EEEE, MMMM d, yyyy", { locale })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#6F6F6F] mt-0.5" />
                <div>
                  <p className="text-xs text-[#6F6F6F]">{isRTL ? "الوقت" : "Time"}</p>
                  <p className="text-sm font-medium text-[#2B2B2B]">
                    {format(new Date(visit.visitDateTime), "h:mm a", { locale })} -{" "}
                    {format(new Date(visit.visitEndDateTime), "h:mm a", { locale })}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Building className="w-4 h-4 text-[#6F6F6F] mt-0.5" />
                <div>
                  <p className="text-xs text-[#6F6F6F]">{isRTL ? "الجهة المستقبلة" : "Leadership"}</p>
                  <p className="text-sm font-medium text-[#2B2B2B]">
                    {isRTL ? visit.leadershipNameAr : visit.leadershipNameEn}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#6F6F6F] mt-0.5" />
                <div>
                  <p className="text-xs text-[#6F6F6F]">{isRTL ? "الموقع" : "Location"}</p>
                  <p className="text-sm font-medium text-[#2B2B2B]">{visit.location}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Reason */}
          <div>
            <h3 className="text-sm font-semibold text-[#2B2B2B] mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#875E9E]" />
              {isRTL ? "سبب الزيارة" : "Reason for Visit"}
            </h3>
            <p className="text-sm text-[#6F6F6F] leading-relaxed">{visit.reason}</p>
          </div>

          {visit.notes && (
            <>
              <Separator />
              <div>
                <h3 className="text-sm font-semibold text-[#2B2B2B] mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#115740]" />
                  {isRTL ? "ملاحظات" : "Notes"}
                </h3>
                <p className="text-sm text-[#6F6F6F] leading-relaxed">{visit.notes}</p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
