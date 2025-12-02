import React from "react";
import { Calendar, Mail, Phone, User } from "lucide-react";
import { PageLayout } from "../../../shared/layouts/PageLayout";
import { FormHeader } from "../../../shared/components/FormHeader";
import { FileUploadSection } from "../../../shared/components/FileUploadSection";
import { FormActions } from "../../../shared/components/FormActions";
import { Card } from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Textarea } from "../../../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select";
import { LEADERSHIP_OPTIONS } from "../../../core/constants/formOptions";
import { useBookVisit } from "./BookVisit.logic";
import { useI18n } from "@/i18n";

export const BookVisit: React.FC = () => {
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
  } = useBookVisit();

  return (
    <PageLayout>
      <FormHeader
        icon={<Calendar className="w-6 h-6 text-white" />}
        title={t("requests.bookVisit")}
        description={t("requests.bookVisitDescription")}
        iconBgGradient="bg-gradient-to-br from-[#EABB4E] to-[#6CAEBD]"
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
          <h3 className="text-[#6CAEBD] mb-6">{t("requests.visitDetails")}</h3>
          <div className="space-y-6">
            <div>
              <Label htmlFor="leadershipId" className="text-[#2B2B2B]">
                {t("requests.selectLeadership")} <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.leadershipId} onValueChange={(value: string) => handleInputChange("leadershipId", value)}>
                <SelectTrigger id="leadershipId" className="mt-2 rounded-xl">
                  <SelectValue placeholder={t("requests.selectLeadershipPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  {LEADERSHIP_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.leadershipId && (
                <p className="text-red-500 text-sm mt-1">{errors.leadershipId}</p>
              )}
            </div>

            <div>
              <Label htmlFor="visitReasonAr" className="text-[#2B2B2B]">
                {t("requests.visitReason")} ({t("form.nameAr").split(" ")[0]}) <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="visitReasonAr"
                value={formData.visitReasonAr}
                onChange={(e) => handleInputChange("visitReasonAr", e.target.value)}
                rows={4}
                placeholder={t("requests.stateReasonInDetail")}
                className={`mt-2 rounded-xl resize-none ${errors.visitReasonAr ? 'border-red-500 focus:ring-red-500' : ''}`}
              />
              {errors.visitReasonAr && (
                <p className="text-red-500 text-sm mt-1">{errors.visitReasonAr}</p>
              )}
            </div>

            <div>
              <Label htmlFor="visitReasonEn" className="text-[#2B2B2B]">
                {t("requests.visitReason")} ({t("form.nameEn").split(" ")[0]})
              </Label>
              <Textarea
                id="visitReasonEn"
                value={formData.visitReasonEn}
                onChange={(e) => handleInputChange("visitReasonEn", e.target.value)}
                rows={4}
                placeholder="State the reason for the visit in detail"
                className="mt-2 rounded-xl resize-none"
                dir="ltr"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
          <h3 className="text-[#6CAEBD] mb-6">{t("requests.relatedToPrevious")}</h3>
          <div className="space-y-6">
            <div>
              <Label className="text-[#2B2B2B] mb-3 block">
                {t("requests.isRelatedToPreviousQuestion")}
              </Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="relatedToPrevious"
                    value="yes"
                    checked={formData.isRelatedToPrevious}
                    onChange={() => handleInputChange("isRelatedToPrevious", true)}
                    className="w-4 h-4 text-[#6CAEBD] focus:ring-[#6CAEBD]"
                  />
                  <span className="text-[#2B2B2B]">{t("requests.yes")}</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="relatedToPrevious"
                    value="no"
                    checked={!formData.isRelatedToPrevious}
                    onChange={() => handleInputChange("isRelatedToPrevious", false)}
                    className="w-4 h-4 text-[#6CAEBD] focus:ring-[#6CAEBD]"
                  />
                  <span className="text-[#2B2B2B]">{t("requests.no")}</span>
                </label>
              </div>
            </div>

            {formData.isRelatedToPrevious && (
              <div>
                <Label htmlFor="relatedRequestNumber" className="text-[#2B2B2B]">
                  {t("requests.previousRequestNumber")}
                </Label>
                <Input
                  id="relatedRequestNumber"
                  value={formData.relatedRequestNumber}
                  onChange={(e) => handleInputChange("relatedRequestNumber", e.target.value)}
                  placeholder={t("requests.previousRequestNumberPlaceholder")}
                  className="mt-2 rounded-xl"
                  dir="ltr"
                />
                <p className="text-xs text-[#6F6F6F] mt-2">
                  {t("requests.previousRequestExample")}
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
            <strong>{t("common.strong")}</strong> {t("requests.visitNote")}
          </p>
        </Card>

        <FormActions
          submitLabel={t("requests.sendVisitRequest")}
          onCancel={handleCancel}
          submitGradient="bg-gradient-to-br from-[#EABB4E] to-[#6CAEBD]"
        />
      </form>
    </PageLayout>
  );
};
