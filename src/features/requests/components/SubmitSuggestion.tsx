import React from "react";
import { Lightbulb } from "lucide-react";
import { PageLayout } from "../../../shared/layouts/PageLayout";
import { FormHeader } from "../../../shared/components/FormHeader";
import { PersonalInfoSection } from "../../../shared/components/PersonalInfoSection";
import { RequestDetailsSection } from "../../../shared/components/RequestDetailsSection";
import { CategorySection } from "../../../shared/components/CategorySection";
import { FileUploadSection } from "../../../shared/components/FileUploadSection";
import { FormActions } from "../../../shared/components/FormActions";
import { Card } from "../../../components/ui/card";
import { useFileUpload } from "../../../core/hooks/useFileUpload";
import { useFormSubmit } from "../../../core/hooks/useFormSubmit";
import { SUGGESTION_MAIN_CATEGORIES, SUGGESTION_SUB_CATEGORIES } from "../../../core/constants/formOptions";

const SUGGESTION_SERVICES = [
  { value: "service1", label: "البوابة الإلكترونية" },
  { value: "service2", label: "نظام التسجيل" },
  { value: "service3", label: "خدمات المكتبة" },
  { value: "service4", label: "خدمات النقل" },
];

export const SubmitSuggestion: React.FC = () => {
  const { files, handleFileChange, removeFile } = useFileUpload();
  const { handleSubmit, handleCancel } = useFormSubmit("/dashboard/track");

  return (
    <PageLayout>
      <FormHeader
        icon={<Lightbulb className="w-6 h-6 text-white" />}
        title="تقديم اقتراح"
        description="شاركنا أفكارك ومقترحاتك لتطوير الجامعة"
        iconBgGradient="bg-gradient-to-br from-[#EABB4E] to-[#875E9E]"
      />

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <PersonalInfoSection />

        <RequestDetailsSection
          requestType="اقتراح"
          titlePlaceholderAr="أدخل عنوان الاقتراح"
          subjectPlaceholderAr="اشرح اقتراحك بالتفصيل"
          detailsPlaceholder="أضف أي تفاصيل إضافية مثل الفوائد المتوقعة أو خطوات التنفيذ"
        />

        <CategorySection
          mainCategories={SUGGESTION_MAIN_CATEGORIES}
          subCategories={SUGGESTION_SUB_CATEGORIES}
          services={SUGGESTION_SERVICES}
          requestCategoryLabel="تصنيف الاقتراح"
          mainCategoryLabel="الفئة الرئيسية"
        />

        <FileUploadSection
          files={files}
          onFileChange={handleFileChange}
          onRemoveFile={removeFile}
          borderColor="border-[#EABB4E]/30"
          iconColor="text-[#EABB4E]"
          bgColor="bg-[#EABB4E]/10"
          description="رفع الملفات (إن وجدت) - يمكنك إرفاق مستندات، صور، أو رسومات توضيحية لدعم اقتراحك"
        />

        <Card className="p-4 rounded-xl border-0 shadow-soft bg-[#6CAEBD]/10">
          <p className="text-sm text-[#2B2B2B]">
            <strong>شكراً لمشاركتك!</strong> نقدّر اقتراحاتك ونعمل على دراستها وتنفيذ ما يتناسب منها مع خططنا التطويرية. اقتراحاتك تساهم في تحسين تجربتك وتجربة الآخرين.
          </p>
        </Card>

        <FormActions
          submitLabel="إرسال الاقتراح"
          onCancel={handleCancel}
          submitGradient="bg-gradient-to-br from-[#EABB4E] to-[#875E9E]"
        />
      </form>
    </PageLayout>
  );
};
