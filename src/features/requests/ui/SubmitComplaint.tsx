import React from "react";
import { AlertCircle } from "lucide-react";
import { PageLayout } from "../../../shared/layouts/PageLayout";
import { FormHeader } from "../../../shared/components/FormHeader";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Mail, Phone, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { FileUploadSection } from "../../../shared/components/FileUploadSection";
import { FormActions } from "../../../shared/components/FormActions";
import { COMPLAINT_MAIN_CATEGORIES, COMPLAINT_SUB_CATEGORIES, SERVICES } from "../../../core/constants/formOptions";
import { useSubmitComplaint } from "./SubmitComplaint.logic";
import { useI18n } from "@/i18n";

export const SubmitComplaint: React.FC = () => {
  const { t } = useI18n();
  const {
    formData,
    errors,
    files,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    removeFile,
    handleSubmit,
    handleCancel
  } = useSubmitComplaint();

  return (
    <PageLayout>
      <FormHeader
        icon={<AlertCircle className="w-6 h-6 text-white" />}
        title={t("requests.submitComplaint")}
        description={t("requests.complaintDescription")}
        iconBgGradient="bg-gradient-to-br from-[#875E9E] to-[#6CAEBD]"
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
          <h3 className="text-[#6CAEBD] mb-6">{t("form.personalInfo")}</h3>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="nameAr" className="text-[#2B2B2B]">
                  {t("form.nameAr")} <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-2">
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
                  <Input
                    id="nameAr"
                    value={formData.nameAr}
                    onChange={(e) => handleInputChange("nameAr", e.target.value)}
                    placeholder={t("auth.fullNameArPlaceholder")}
                    className="pr-10 rounded-xl bg-gray-50"
                    disabled
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="nameEn" className="text-[#2B2B2B]">
                  {t("form.nameEn")}
                </Label>
                <div className="relative mt-2">
                  <User className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) => handleInputChange("nameEn", e.target.value)}
                    placeholder="Enter name in English"
                    className="pr-10 rounded-xl bg-gray-50"
                    dir="ltr"
                    disabled
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="email" className="text-[#2B2B2B]">
                  {t("form.email")} <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-2">
                  <Mail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="example@email.com"
                    className="pr-10 rounded-xl bg-gray-50"
                    dir="ltr"
                    disabled
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="mobile" className="text-[#2B2B2B]">
                  {t("form.mobile")} <span className="text-red-500">*</span>
                </Label>
                <div className="relative mt-2">
                  <Phone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6F6F6F] w-5 h-5" />
                  <Input
                    id="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={(e) => handleInputChange("mobile", e.target.value)}
                    placeholder="05xxxxxxxx"
                    className="pr-10 rounded-xl bg-gray-50"
                    dir="ltr"
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
          <h3 className="text-[#6CAEBD] mb-6">{t("requests.complaintDetails")}</h3>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="titleAr" className="text-[#2B2B2B]">
                  {t("requests.complaintTitle")} ({t("form.nameAr").split(" ")[0]}) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="titleAr"
                  value={formData.titleAr}
                  onChange={(e) => handleInputChange("titleAr", e.target.value)}
                  placeholder={t("requests.enterTitlePlaceholder").replace("{type}", t("requests.complaintTitle").toLowerCase())}
                  className={`mt-2 rounded-xl ${errors.titleAr ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.titleAr && (
                  <p className="text-red-500 text-sm mt-1">{errors.titleAr}</p>
                )}
              </div>

              <div>
                <Label htmlFor="titleEn" className="text-[#2B2B2B]">
                  {t("requests.complaintTitle")} ({t("form.nameEn").split(" ")[0]})
                </Label>
                <Input
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={(e) => handleInputChange("titleEn", e.target.value)}
                  placeholder="Enter Complaint Title"
                  className="mt-2 rounded-xl"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="subjectAr" className="text-[#2B2B2B]">
                {t("requests.complaintSubject")} ({t("form.nameAr").split(" ")[0]}) <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="subjectAr"
                value={formData.subjectAr}
                onChange={(e) => handleInputChange("subjectAr", e.target.value)}
                rows={4}
                placeholder={t("requests.explainInDetail").replace("{type}", t("requests.submitComplaint").toLowerCase())}
                className={`mt-2 rounded-xl resize-none ${errors.subjectAr ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.subjectAr && (
                <p className="text-red-500 text-sm mt-1">{errors.subjectAr}</p>
              )}
            </div>

            <div>
              <Label htmlFor="subjectEn" className="text-[#2B2B2B]">
                {t("requests.complaintSubject")} ({t("form.nameEn").split(" ")[0]})
              </Label>
              <Textarea
                id="subjectEn"
                value={formData.subjectEn}
                onChange={(e) => handleInputChange("subjectEn", e.target.value)}
                rows={4}
                placeholder="Describe your complaint in detail"
                className="mt-2 rounded-xl resize-none"
                dir="ltr"
              />
            </div>

            <div>
              <Label htmlFor="mainCategoryId" className="text-[#2B2B2B]">
                {t("form.category")}
              </Label>
              <Select value={formData.mainCategoryId} onValueChange={(value: string) => handleInputChange("mainCategoryId", value)}>
                <SelectTrigger id="mainCategoryId" className="mt-2 rounded-xl">
                  <SelectValue placeholder={t("requests.selectCategoryPlaceholder").replace("{type}", t("form.category"))} />
                </SelectTrigger>
                <SelectContent>
                  {COMPLAINT_MAIN_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="noteAr" className="text-[#2B2B2B]">
                  {t("form.noteAr")}
                </Label>
                <Textarea
                  id="noteAr"
                  value={formData.noteAr}
                  onChange={(e) => handleInputChange("noteAr", e.target.value)}
                  rows={3}
                  placeholder={t("requests.noteOrClarification")}
                  className="mt-2 rounded-xl resize-none"
                />
              </div>

              <div>
                <Label htmlFor="noteEn" className="text-[#2B2B2B]">
                  {t("form.noteEn")}
                </Label>
                <Textarea
                  id="noteEn"
                  value={formData.noteEn}
                  onChange={(e) => handleInputChange("noteEn", e.target.value)}
                  rows={3}
                  placeholder="Add any notes or clarifications"
                  className="mt-2 rounded-xl resize-none"
                  dir="ltr"
                />
              </div>
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
            <strong>{t("common.strong")}</strong> {t("requests.complaintNote")}
          </p>
        </Card>

        <FormActions
          submitLabel={isSubmitting ? t("common.loading") : t("requests.sendComplaint")}
          onCancel={handleCancel}
          submitGradient="bg-gradient-to-br from-[#875E9E] to-[#6CAEBD]"
        />
      </form>
    </PageLayout>
  );
};
