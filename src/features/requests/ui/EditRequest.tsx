import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Save, X, ChevronRight, AlertCircle, Loader2 } from "lucide-react";
import { useEditRequestLogic } from "./EditRequest.logic";
import { getRequestTypeName } from "@/core/constants/requestTypes";

export function EditRequestPage() {
  const {
    // State
    request,
    formData,
    formErrors,
    isLoading,
    isSubmitting,
    isConfirmDialogOpen,

    // Lookups
    mainCategories,
    leadership,

    // Flags
    isInquiryRequest,
    isComplaintRequest,
    isVisitRequest,
    canEditRequest,

    // Handlers
    handleInputChange,
    handleSubmit,
    confirmSave,
    handleCancel,
    setIsConfirmDialogOpen,

    // Utils
    t,
    language,
    navigate,
  } = useEditRequestLogic();

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-[#6CAEBD]" />
          <p className="text-[#6F6F6F]">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  // Request not found
  if (!request) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#2B2B2B] mb-2">
            {t("requests.requestNotFound")}
          </h2>
          <p className="text-[#6F6F6F] mb-6">{t("requests.requestNotFoundDesc")}</p>
          <Button onClick={() => navigate("/dashboard/track")} className="bg-[#115740] hover:bg-[#0d4230]">
            {t("requests.backToRequests")}
          </Button>
        </Card>
      </div>
    );
  }

  // Access denied
  if (!canEditRequest) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-[#2B2B2B] mb-2">
            {t("requests.accessDenied")}
          </h2>
          <p className="text-[#6F6F6F] mb-6">{t("requests.noPermissionToEdit")}</p>
          <Button onClick={() => navigate(-1)} className="bg-[#115740] hover:bg-[#0d4230]">
            {t("common.goBack")}
          </Button>
        </Card>
      </div>
    );
  }

  const isRTL = language === "ar";

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-sm text-[#6F6F6F]">
          <Link to="/dashboard" className="hover:text-[#6CAEBD] transition">
            {t("navigation.dashboard")}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to="/dashboard/track" className="hover:text-[#6CAEBD] transition">
            {t("requests.myRequests")}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link to={`/dashboard/request/${request.id}`} className="hover:text-[#6CAEBD] transition">
            {request.requestNumber}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#2B2B2B] font-medium">{t("common.edit")}</span>
        </nav>

        {/* Summary Card */}
        <Card className="p-6 mb-6 rounded-xl border-0 shadow-soft bg-white">
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <Label className="text-[#6F6F6F] text-sm mb-1 block">
                {t("requests.requestNumber")}
              </Label>
              <p className="text-[#2B2B2B] font-semibold text-lg">{request.requestNumber}</p>
            </div>
            <div>
              <Label className="text-[#6F6F6F] text-sm mb-1 block">
                {t("requests.requestType")}
              </Label>
              <div className="mt-1">
                <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
                  request.requestTypeId === 1 ? 'bg-blue-100 text-blue-800' :
                  request.requestTypeId === 2 ? 'bg-purple-100 text-purple-800' :
                  request.requestTypeId === 3 ? 'bg-amber-100 text-amber-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {getRequestTypeName(request.requestTypeId, isRTL ? 'ar' : 'en')}
                </span>
              </div>
            </div>
            <div>
              <Label className="text-[#6F6F6F] text-sm mb-1 block">
                {t("requests.submissionDate")}
              </Label>
              <p className="text-[#2B2B2B] font-medium">
                {new Date(request.createdAt).toLocaleDateString(isRTL ? "ar-SA" : "en-US")}
              </p>
            </div>
          </div>
        </Card>

        {/* Edit Form */}
        <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
          <h2 className="text-xl font-bold text-[#2B2B2B] mb-6">{t("requests.editRequest")}</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Info (Read-only) */}
            <div>
              <h3 className="text-lg font-semibold text-[#2B2B2B] mb-4">
                {t("requests.requestCreationInfo")}
              </h3>
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label className="text-[#2B2B2B]">{t("form.fullNameAr")}</Label>
                  <Input
                    value={request.nameAr || ""}
                    disabled
                    className="rounded-xl mt-2 bg-gray-50"
                  />
                </div>
                <div>
                  <Label className="text-[#2B2B2B]">{t("form.fullNameEn")}</Label>
                  <Input
                    value={request.nameEn || ""}
                    disabled
                    className="rounded-xl mt-2 bg-gray-50"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[#2B2B2B]">{t("form.email")}</Label>
                  <Input
                    value={request.email}
                    disabled
                    className="rounded-xl mt-2 bg-gray-50"
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label className="text-[#2B2B2B]">{t("form.mobile")}</Label>
                  <Input
                    value={request.mobile}
                    disabled
                    className="rounded-xl mt-2 bg-gray-50"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* Request Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-[#2B2B2B] mb-4">
                {t("requests.requestInfo")}
              </h3>

              {/* Title */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="titleAr" className="text-[#2B2B2B]">
                    {t("form.titleAr")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="titleAr"
                    value={formData.titleAr}
                    onChange={(e) => handleInputChange("titleAr", e.target.value)}
                    placeholder={t("form.titlePlaceholder")}
                    maxLength={100}
                    className={`rounded-xl mt-2 ${formErrors.titleAr ? "border-red-500" : ""}`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    {formErrors.titleAr ? (
                      <p className="text-red-500 text-sm">{formErrors.titleAr}</p>
                    ) : (
                      <span></span>
                    )}
                    <span className="text-xs text-gray-400">
                      {formData.titleAr.length}/100
                    </span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="titleEn" className="text-[#2B2B2B]">
                    {t("form.titleEn")}
                  </Label>
                  <Input
                    id="titleEn"
                    value={formData.titleEn || ""}
                    onChange={(e) => handleInputChange("titleEn", e.target.value)}
                    placeholder={t("form.titlePlaceholder")}
                    maxLength={100}
                    className={`rounded-xl mt-2 ${formErrors.titleEn ? "border-red-500" : ""}`}
                    dir="ltr"
                  />
                  <div className="flex justify-between items-center mt-1">
                    {formErrors.titleEn ? (
                      <p className="text-red-500 text-sm">{formErrors.titleEn}</p>
                    ) : (
                      <span></span>
                    )}
                    <span className="text-xs text-gray-400">
                      {(formData.titleEn || "").length}/100
                    </span>
                  </div>
                </div>
              </div>

              {/* Subject */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="subjectAr" className="text-[#2B2B2B]">
                    {t("form.subjectAr")} <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="subjectAr"
                    value={formData.subjectAr}
                    onChange={(e) => handleInputChange("subjectAr", e.target.value)}
                    placeholder={t("form.subjectPlaceholder")}
                    rows={4}
                    className={`rounded-xl mt-2 resize-none ${
                      formErrors.subjectAr ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.subjectAr && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.subjectAr}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="subjectEn" className="text-[#2B2B2B]">
                    {t("form.subjectEn")}
                  </Label>
                  <Textarea
                    id="subjectEn"
                    value={formData.subjectEn || ""}
                    onChange={(e) => handleInputChange("subjectEn", e.target.value)}
                    placeholder={t("form.subjectPlaceholder")}
                    rows={4}
                    className="rounded-xl mt-2 resize-none"
                    dir="ltr"
                  />
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <Label htmlFor="additionalDetailsAr" className="text-[#2B2B2B]">
                    {t("form.additionalDetailsAr")}
                  </Label>
                  <Textarea
                    id="additionalDetailsAr"
                    value={formData.additionalDetailsAr || ""}
                    onChange={(e) => handleInputChange("additionalDetailsAr", e.target.value)}
                    placeholder={t("form.additionalDetailsPlaceholder")}
                    rows={3}
                    className={`rounded-xl mt-2 resize-none ${
                      formErrors.additionalDetailsAr ? "border-red-500" : ""
                    }`}
                  />
                  {formErrors.additionalDetailsAr && (
                    <p className="text-red-500 text-sm mt-1">{formErrors.additionalDetailsAr}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="additionalDetailsEn" className="text-[#2B2B2B]">
                    {t("form.additionalDetailsEn")}
                  </Label>
                  <Textarea
                    id="additionalDetailsEn"
                    value={formData.additionalDetailsEn || ""}
                    onChange={(e) => handleInputChange("additionalDetailsEn", e.target.value)}
                    placeholder={t("form.additionalDetailsPlaceholder")}
                    rows={3}
                    className="rounded-xl mt-2 resize-none"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            {/* Visit-specific fields */}
            {isVisitRequest && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-[#2B2B2B] mb-4">
                  {t("requests.visitDetails")}
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* University Leadership */}
                  <div>
                    <Label htmlFor="universityLeadershipId" className="text-[#2B2B2B]">
                      {t("form.selectLeadership")} <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.universityLeadershipId?.toString() || ""}
                      onValueChange={(value) => handleInputChange("universityLeadershipId", parseInt(value))}
                    >
                      <SelectTrigger
                        className={`rounded-xl mt-2 ${
                          formErrors.universityLeadershipId ? "border-red-500" : ""
                        }`}
                      >
                        <SelectValue placeholder={t("form.selectLeadership")} />
                      </SelectTrigger>
                      <SelectContent>
                        {leadership.map((leader) => (
                          <SelectItem key={leader.id} value={leader.id.toString()}>
                            <div>
                              <div className="font-medium">
                                {isRTL ? leader.nameAr : (leader.nameEn || leader.nameAr)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {isRTL ? leader.positionTitleAr : (leader.positionTitleEn || leader.positionTitleAr)}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.universityLeadershipId && (
                      <p className="text-red-500 text-sm mt-1">
                        {formErrors.universityLeadershipId}
                      </p>
                    )}
                  </div>

                  {/* Visit Reason Arabic */}
                  <div>
                    <Label htmlFor="visitReasonAr" className="text-[#2B2B2B]">
                      {t("form.visitReason")} ({t("common.arabic")}) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="visitReasonAr"
                      value={formData.visitReasonAr || ""}
                      onChange={(e) => handleInputChange("visitReasonAr", e.target.value)}
                      placeholder={t("form.visitReasonPlaceholder")}
                      className={`rounded-xl mt-2 ${
                        formErrors.visitReasonAr ? "border-red-500" : ""
                      }`}
                    />
                    {formErrors.visitReasonAr && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.visitReasonAr}</p>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-1 gap-4 mt-4">
                  {/* Visit Reason English */}
                  <div>
                    <Label htmlFor="visitReasonEn" className="text-[#2B2B2B]">
                      {t("form.visitReason")} ({t("common.english")})
                    </Label>
                    <Input
                      id="visitReasonEn"
                      value={formData.visitReasonEn || ""}
                      onChange={(e) => handleInputChange("visitReasonEn", e.target.value)}
                      placeholder={t("form.visitReasonPlaceholder")}
                      className="rounded-xl mt-2"
                      dir="ltr"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Category fields for Inquiry and Complaint */}
            {(isInquiryRequest || isComplaintRequest) && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-[#2B2B2B] mb-4">
                  {t("form.classification")}
                </h3>

                {/* Main Category */}
                <div>
                  <Label htmlFor="mainCategoryId" className="text-[#2B2B2B]">
                    {t("form.mainCategory")}
                  </Label>
                  <Select
                    value={formData.mainCategoryId?.toString() || ""}
                    onValueChange={(value) => handleInputChange("mainCategoryId", parseInt(value))}
                  >
                    <SelectTrigger className="rounded-xl mt-2">
                      <SelectValue placeholder={t("form.selectMainCategory")} />
                    </SelectTrigger>
                    <SelectContent>
                      {mainCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {isRTL ? category.nameAr : (category.nameEn || category.nameAr)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
              >
                <X className="w-4 h-4 mr-2" />
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#115740] hover:bg-[#0d4230] text-white rounded-xl flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t("common.saving")}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {t("common.saveChanges")}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("requests.confirmSave")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("requests.confirmSaveMessage")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSave}
              disabled={isSubmitting}
              className="bg-[#115740] hover:bg-[#0d4230]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  {t("common.saving")}
                </>
              ) : (
                t("common.confirm")
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
