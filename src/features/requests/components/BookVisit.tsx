import React, { useState } from "react";
import { Calendar } from "lucide-react";
import { PageLayout } from "../../../shared/layouts/PageLayout";
import { FormHeader } from "../../../shared/components/FormHeader";
import { PersonalInfoSection } from "../../../shared/components/PersonalInfoSection";
import { FileUploadSection } from "../../../shared/components/FileUploadSection";
import { FormActions } from "../../../shared/components/FormActions";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { useFileUpload } from "../../../core/hooks/useFileUpload";
import { useFormSubmit } from "../../../core/hooks/useFormSubmit";
import { LEADERSHIP_OPTIONS } from "../../../core/constants/formOptions";

export const BookVisit: React.FC = () => {
  const [isRelatedToPrevious, setIsRelatedToPrevious] = useState(false);
  const { files, handleFileChange, removeFile } = useFileUpload();
  const { handleSubmit, handleCancel } = useFormSubmit("/dashboard/track");

  return (
    <PageLayout>
      <FormHeader
        icon={<Calendar className="w-6 h-6 text-white" />}
        title="حجز زيارة للقيادات"
        description="احجز موعداً لمقابلة القيادات الجامعية"
        iconBgGradient="bg-gradient-to-br from-[#EABB4E] to-[#6CAEBD]"
      />

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <PersonalInfoSection />

        <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
          <h3 className="text-[#6CAEBD] mb-6">تفاصيل الزيارة</h3>
          <div className="space-y-6">
            <div>
              <Label htmlFor="leadershipId" className="text-[#2B2B2B]">
                اختر القيادة الجامعية <span className="text-red-500">*</span>
              </Label>
              <Select required>
                <SelectTrigger id="leadershipId" className="mt-2 rounded-xl">
                  <SelectValue placeholder="اختر القيادة المراد زيارتها" />
                </SelectTrigger>
                <SelectContent>
                  {LEADERSHIP_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="visitReasonAr" className="text-[#2B2B2B]">
                سبب الزيارة (عربي) <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="visitReasonAr"
                required
                rows={4}
                placeholder="اذكر سبب الزيارة بالتفصيل"
                className="mt-2 rounded-xl resize-none"
              />
            </div>

            <div>
              <Label htmlFor="visitReasonEn" className="text-[#2B2B2B]">
                سبب الزيارة (إنجليزي)
              </Label>
              <Textarea
                id="visitReasonEn"
                rows={4}
                placeholder="State the reason for the visit in detail"
                className="mt-2 rounded-xl resize-none"
                dir="ltr"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="visitStartDate" className="text-[#2B2B2B]">
                  تاريخ ووقت بداية الزيارة <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="visitStartDate"
                  type="datetime-local"
                  required
                  className="mt-2 rounded-xl"
                  dir="ltr"
                />
              </div>

              <div>
                <Label htmlFor="visitEndDate" className="text-[#2B2B2B]">
                  تاريخ ووقت نهاية الزيارة <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="visitEndDate"
                  type="datetime-local"
                  required
                  className="mt-2 rounded-xl"
                  dir="ltr"
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
          <h3 className="text-[#6CAEBD] mb-6">ارتباط بطلب سابق</h3>
          <div className="space-y-6">
            <div>
              <Label className="text-[#2B2B2B] mb-3 block">
                هل هذه الزيارة مرتبطة بطلب سابق؟
              </Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="relatedToPrevious"
                    value="yes"
                    onChange={() => setIsRelatedToPrevious(true)}
                    className="w-4 h-4 text-[#6CAEBD] focus:ring-[#6CAEBD]"
                  />
                  <span className="text-[#2B2B2B]">نعم</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="relatedToPrevious"
                    value="no"
                    defaultChecked
                    onChange={() => setIsRelatedToPrevious(false)}
                    className="w-4 h-4 text-[#6CAEBD] focus:ring-[#6CAEBD]"
                  />
                  <span className="text-[#2B2B2B]">لا</span>
                </label>
              </div>
            </div>

            {isRelatedToPrevious && (
              <div>
                <Label htmlFor="relatedRequestNumber" className="text-[#2B2B2B]">
                  رقم الطلب السابق
                </Label>
                <Input
                  id="relatedRequestNumber"
                  placeholder="أدخل رقم الطلب السابق"
                  className="mt-2 rounded-xl"
                  dir="ltr"
                />
                <p className="text-xs text-[#6F6F6F] mt-2">
                  مثال: REQ-2025-00123
                </p>
              </div>
            )}
          </div>
        </Card>

        <FileUploadSection
          files={files}
          onFileChange={handleFileChange}
          onRemoveFile={removeFile}
          borderColor="border-[#EABB4E]/30"
          iconColor="text-[#EABB4E]"
          bgColor="bg-[#EABB4E]/10"
        />

        <Card className="p-4 rounded-xl border-0 shadow-soft bg-[#6CAEBD]/10">
          <p className="text-sm text-[#2B2B2B]">
            <strong>ملاحظة مهمة:</strong> سيتم مراجعة طلب الزيارة والتواصل معك خلال 48 ساعة لتأكيد الموعد. يُرجى التأكد من توفر الوقت المحدد قبل إرسال الطلب.
          </p>
        </Card>

        <FormActions
          submitLabel="إرسال طلب الزيارة"
          onCancel={handleCancel}
          submitGradient="bg-gradient-to-br from-[#EABB4E] to-[#6CAEBD]"
        />
      </form>
    </PageLayout>
  );
};
