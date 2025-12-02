import React from "react";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";

interface RequestDetailsSectionProps {
  requestType: "شكوى" | "استفسار" | "اقتراح";
  titlePlaceholderAr: string;
  subjectPlaceholderAr: string;
  detailsPlaceholder?: string;
}

export const RequestDetailsSection: React.FC<RequestDetailsSectionProps> = ({
  requestType,
  titlePlaceholderAr,
  subjectPlaceholderAr,
  detailsPlaceholder,
}) => {
  return (
    <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
      <h3 className="text-[#6CAEBD] mb-6">تفاصيل {requestType}</h3>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="titleAr" className="text-[#2B2B2B]">
              عنوان {requestType} (عربي) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="titleAr"
              required
              placeholder={titlePlaceholderAr}
              className="mt-2 rounded-xl"
            />
          </div>

          <div>
            <Label htmlFor="titleEn" className="text-[#2B2B2B]">
              عنوان {requestType} (إنجليزي)
            </Label>
            <Input
              id="titleEn"
              placeholder={`Enter ${requestType === "شكوى" ? "Complaint" : requestType === "استفسار" ? "Inquiry" : "Suggestion"} Title`}
              className="mt-2 rounded-xl"
              dir="ltr"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="subjectAr" className="text-[#2B2B2B]">
            موضوع {requestType} (عربي) <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="subjectAr"
            required
            rows={4}
            placeholder={subjectPlaceholderAr}
            className="mt-2 rounded-xl resize-none"
          />
        </div>

        <div>
          <Label htmlFor="subjectEn" className="text-[#2B2B2B]">
            موضوع {requestType} (إنجليزي)
          </Label>
          <Textarea
            id="subjectEn"
            rows={4}
            placeholder={`Describe your ${requestType === "شكوى" ? "complaint" : requestType === "استفسار" ? "inquiry" : "suggestion"} in detail`}
            className="mt-2 rounded-xl resize-none"
            dir="ltr"
          />
        </div>

        <div>
          <Label htmlFor="detailsAr" className="text-[#2B2B2B]">
            تفاصيل إضافية (عربي)
          </Label>
          <Textarea
            id="detailsAr"
            rows={3}
            placeholder={detailsPlaceholder || "أضف أي تفاصيل إضافية"}
            className="mt-2 rounded-xl resize-none"
          />
        </div>

        <div>
          <Label htmlFor="detailsEn" className="text-[#2B2B2B]">
            تفاصيل إضافية (إنجليزي)
          </Label>
          <Textarea
            id="detailsEn"
            rows={3}
            placeholder="Add any additional details"
            className="mt-2 rounded-xl resize-none"
            dir="ltr"
          />
        </div>
      </div>
    </Card>
  );
};
