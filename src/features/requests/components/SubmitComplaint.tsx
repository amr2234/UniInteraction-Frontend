import React from "react";
import { AlertCircle } from "lucide-react";
import { PageLayout } from "../../../shared/layouts/PageLayout";
import { FormHeader } from "../../../shared/components/FormHeader";
import { PersonalInfoSection } from "../../../shared/components/PersonalInfoSection";
import { RequestDetailsSection } from "../../../shared/components/RequestDetailsSection";
import { CategorySection } from "../../../shared/components/CategorySection";
import { FileUploadSection } from "../../../shared/components/FileUploadSection";
import { FormActions } from "../../../shared/components/FormActions";
import { Card } from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { useFileUpload } from "../../../core/hooks/useFileUpload";
import { useFormSubmit } from "../../../core/hooks/useFormSubmit";
import { COMPLAINT_MAIN_CATEGORIES, COMPLAINT_SUB_CATEGORIES, SERVICES } from "../../../core/constants/formOptions";

export const SubmitComplaint: React.FC = () => {
  const { files, handleFileChange, removeFile } = useFileUpload();
  const { handleSubmit, handleCancel } = useFormSubmit("/dashboard/track");

  return (
    <PageLayout>
      <FormHeader
        icon={<AlertCircle className="w-6 h-6 text-white" />}
        title="تقديم شكوى"
        description="نحن نستمع لملاحظاتك وشكاواك بسرية تامة"
        iconBgGradient="bg-gradient-to-br from-[#875E9E] to-[#6CAEBD]"
      />

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <PersonalInfoSection />

        <RequestDetailsSection
          requestType="شكوى"
          titlePlaceholderAr="أدخل عنوان الشكوى"
          subjectPlaceholderAr="اشرح شكواك بالتفصيل"
        />

        <CategorySection
          mainCategories={COMPLAINT_MAIN_CATEGORIES}
          subCategories={COMPLAINT_SUB_CATEGORIES}
          services={SERVICES}
        />

        <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
          <h3 className="text-[#6CAEBD] mb-6">ملاحظات إضافية</h3>
          <div className="space-y-6">
            <div>
              <Label htmlFor="noteAr" className="text-[#2B2B2B]">
                ملاحظة (عربي)
              </Label>
              <Textarea
                id="noteAr"
                rows={3}
                placeholder="أضف أي ملاحظات أو توضيحات"
                className="mt-2 rounded-xl resize-none"
              />
            </div>

            <div>
              <Label htmlFor="noteEn" className="text-[#2B2B2B]">
                ملاحظة (إنجليزي)
              </Label>
              <Textarea
                id="noteEn"
                rows={3}
                placeholder="Add any notes or clarifications"
                className="mt-2 rounded-xl resize-none"
                dir="ltr"
              />
            </div>
          </div>
        </Card>

        <FileUploadSection
          files={files}
          onFileChange={handleFileChange}
          onRemoveFile={removeFile}
          borderColor="border-[#875E9E]/30"
          iconColor="text-[#875E9E]"
          bgColor="bg-[#875E9E]/10"
        />

        <Card className="p-4 rounded-xl border-0 shadow-soft bg-[#EABB4E]/10">
          <p className="text-sm text-[#2B2B2B]">
            <strong>ملاحظة:</strong> جميع الشكاوى تُعالج بسرية تامة ولن يتم الإفصاح عن معلوماتك الشخصية إلا في حدود معالجة الشكوى.
          </p>
        </Card>

        <FormActions
          submitLabel="إرسال الشكوى"
          onCancel={handleCancel}
          submitGradient="bg-gradient-to-br from-[#875E9E] to-[#6CAEBD]"
        />
      </form>
    </PageLayout>
  );
};
