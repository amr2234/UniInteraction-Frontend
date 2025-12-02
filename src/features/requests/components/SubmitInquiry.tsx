import React from "react";
import { HelpCircle } from "lucide-react";
import { PageLayout } from "../../../shared/layouts/PageLayout";
import { FormHeader } from "../../../shared/components/FormHeader";
import { PersonalInfoSection } from "../../../shared/components/PersonalInfoSection";
import { RequestDetailsSection } from "../../../shared/components/RequestDetailsSection";
import { CategorySection } from "../../../shared/components/CategorySection";
import { FileUploadSection } from "../../../shared/components/FileUploadSection";
import { FormActions } from "../../../shared/components/FormActions";
import { useFileUpload } from "../../../core/hooks/useFileUpload";
import { useFormSubmit } from "../../../core/hooks/useFormSubmit";
import { INQUIRY_MAIN_CATEGORIES, INQUIRY_SUB_CATEGORIES } from "../../../core/constants/formOptions";

const INQUIRY_SERVICES = [
  { value: "service1", label: "استعلام عن طلب التسجيل" },
  { value: "service2", label: "تحديث البيانات الشخصية" },
  { value: "service3", label: "طلب إفادة" },
  { value: "service4", label: "استعلام عن الجدول الدراسي" },
];

export const SubmitInquiry: React.FC = () => {
  const { files, handleFileChange, removeFile } = useFileUpload();
  const { handleSubmit, handleCancel } = useFormSubmit("/dashboard/track");

  return (
    <PageLayout>
      <FormHeader
        icon={<HelpCircle className="w-6 h-6 text-white" />}
        title="تقديم استفسار"
        description="اطرح استفساراتك وسنجيب عليها بأسرع وقت"
        iconBgGradient="gradient-primary"
      />

      <form onSubmit={(e) => handleSubmit(e)} className="space-y-6">
        <PersonalInfoSection />

        <RequestDetailsSection
          requestType="استفسار"
          titlePlaceholderAr="أدخل عنوان الاستفسار"
          subjectPlaceholderAr="اشرح استفسارك بالتفصيل"
        />

        <CategorySection
          mainCategories={INQUIRY_MAIN_CATEGORIES}
          subCategories={INQUIRY_SUB_CATEGORIES}
          services={INQUIRY_SERVICES}
        />

        <FileUploadSection
          files={files}
          onFileChange={handleFileChange}
          onRemoveFile={removeFile}
        />

        <FormActions
          submitLabel="إرسال الاستفسار"
          onCancel={handleCancel}
          submitGradient="gradient-primary"
        />
      </form>
    </PageLayout>
  );
};
