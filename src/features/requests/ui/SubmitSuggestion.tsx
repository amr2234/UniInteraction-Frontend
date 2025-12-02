import React from "react";
import { Lightbulb, Mail, Phone, User } from "lucide-react";
import { PageLayout } from "../../../shared/layouts/PageLayout";
import { FormHeader } from "../../../shared/components/FormHeader";
import { FileUploadSection } from "../../../shared/components/FileUploadSection";
import { FormActions } from "../../../shared/components/FormActions";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { SUGGESTION_MAIN_CATEGORIES, SUGGESTION_SUB_CATEGORIES } from "../../../core/constants/formOptions";
import { useSubmitSuggestion } from "./SubmitSuggestion.logic";
import { useI18n } from "@/i18n";

const SUGGESTION_SERVICES = [
  { value: "service1", label: "البوابة الإلكترونية" },
  { value: "service2", label: "نظام التسجيل" },
  { value: "service3", label: "خدمات المكتبة" },
  { value: "service4", label: "خدمات النقل" },
];

export const SubmitSuggestion: React.FC = () => {
  const { t } = useI18n();
  const {
    formData,
    errors,
    files,
    handleInputChange,
    handleFileChange,
    removeFile,
    handleSubmit,
    handleCancel
  } = useSubmitSuggestion();

  return (
    <PageLayout>
      <FormHeader
        icon={<Lightbulb className="w-6 h-6 text-white" />}
        title={t("requests.submitSuggestion")}
        description={t("requests.suggestionDescription")}
        iconBgGradient="bg-gradient-to-br from-[#EABB4E] to-[#875E9E]"
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
                    className={`pr-10 rounded-xl ${errors.nameAr ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                </div>
                {errors.nameAr && (
                  <p className="text-red-500 text-sm mt-1">{errors.nameAr}</p>
                )}
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
                    className="pr-10 rounded-xl"
                    dir="ltr"
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
                    className={`pr-10 rounded-xl ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                    dir="ltr"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
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
                    className={`pr-10 rounded-xl ${errors.mobile ? 'border-red-500 focus:ring-red-500' : ''}`}
                    dir="ltr"
                  />
                </div>
                {errors.mobile && (
                  <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
                )}
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
          <h3 className="text-[#6CAEBD] mb-6">{t("requests.suggestionDetails")}</h3>
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="titleAr" className="text-[#2B2B2B]">
                  {t("requests.suggestionTitle")} ({t("form.nameAr").split(" ")[0]}) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="titleAr"
                  value={formData.titleAr}
                  onChange={(e) => handleInputChange("titleAr", e.target.value)}
                  placeholder={t("requests.enterTitlePlaceholder").replace("{type}", t("requests.suggestionTitle").toLowerCase())}
                  className={`mt-2 rounded-xl ${errors.titleAr ? 'border-red-500 focus:ring-red-500' : ''}`}
                />
                {errors.titleAr && (
                  <p className="text-red-500 text-sm mt-1">{errors.titleAr}</p>
                )}
              </div>

              <div>
                <Label htmlFor="titleEn" className="text-[#2B2B2B]">
                  {t("requests.suggestionTitle")} ({t("form.nameEn").split(" ")[0]})
                </Label>
                <Input
                  id="titleEn"
                  value={formData.titleEn}
                  onChange={(e) => handleInputChange("titleEn", e.target.value)}
                  placeholder="Enter Suggestion Title"
                  className="mt-2 rounded-xl"
                  dir="ltr"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="subjectAr" className="text-[#2B2B2B]">
                {t("requests.suggestionSubject")} ({t("form.nameAr").split(" ")[0]}) <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="subjectAr"
                value={formData.subjectAr}
                onChange={(e) => handleInputChange("subjectAr", e.target.value)}
                rows={4}
                placeholder={t("requests.explainInDetail").replace("{type}", t("requests.submitSuggestion").toLowerCase())}
                className={`mt-2 rounded-xl resize-none ${errors.subjectAr ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.subjectAr && (
                <p className="text-red-500 text-sm mt-1">{errors.subjectAr}</p>
              )}
            </div>

            <div>
              <Label htmlFor="subjectEn" className="text-[#2B2B2B]">
                {t("requests.suggestionSubject")} ({t("form.nameEn").split(" ")[0]})
              </Label>
              <Textarea
                id="subjectEn"
                value={formData.subjectEn}
                onChange={(e) => handleInputChange("subjectEn", e.target.value)}
                rows={4}
                placeholder="Describe your suggestion in detail"
                className="mt-2 rounded-xl resize-none"
                dir="ltr"
              />
            </div>

            <div>
              <Label htmlFor="additionalDetailsAr" className="text-[#2B2B2B]">
                {t("form.additionalDetailsAr")}
              </Label>
              <Textarea
                id="additionalDetailsAr"
                value={formData.additionalDetailsAr}
                onChange={(e) => handleInputChange("additionalDetailsAr", e.target.value)}
                rows={3}
                placeholder={t("requests.addAdditionalDetails")}
                className="mt-2 rounded-xl resize-none"
              />
            </div>

            <div>
              <Label htmlFor="additionalDetailsEn" className="text-[#2B2B2B]">
                {t("form.additionalDetailsEn")}
              </Label>
              <Textarea
                id="additionalDetailsEn"
                value={formData.additionalDetailsEn}
                onChange={(e) => handleInputChange("additionalDetailsEn", e.target.value)}
                rows={3}
                placeholder="Add any additional details"
                className="mt-2 rounded-xl resize-none"
                dir="ltr"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
          <h3 className="text-[#6CAEBD] mb-6">{t("form.categoryInfo")}</h3>
          <div className="space-y-6">
            <div>
              <Label htmlFor="mainCategoryId" className="text-[#2B2B2B]">
                {t("form.category")}
              </Label>
              <Select value={formData.mainCategoryId} onValueChange={(value: string) => handleInputChange("mainCategoryId", value)}>
                <SelectTrigger id="mainCategoryId" className="mt-2 rounded-xl">
                  <SelectValue placeholder={t("requests.selectCategoryPlaceholder").replace("{type}", t("form.category"))} />
                </SelectTrigger>
                <SelectContent>
                  {SUGGESTION_MAIN_CATEGORIES.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <FileUploadSection
          files={files}
          onFileChange={handleFileChange}
          onRemoveFile={removeFile}
          borderColor="border-[#EABB4E]/30"
          iconColor="text-[#EABB4E]"
          bgColor="bg-[#EABB4E]/10"
          description={t("requests.uploadFiles")}
        />

        <Card className="p-4 rounded-xl border-0 shadow-soft bg-[#6CAEBD]/10">
          <p className="text-sm text-[#2B2B2B]">
            <strong>{t("common.thankYou")}</strong> {t("requests.suggestionNote")}
          </p>
        </Card>

        <FormActions
          submitLabel={t("requests.sendSuggestion")}
          onCancel={handleCancel}
          submitGradient="bg-gradient-to-br from-[#EABB4E] to-[#875E9E]"
        />
      </form>
    </PageLayout>
  );
};
