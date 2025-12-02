import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { ArrowRight, Save, X, Calendar, Clock, ChevronRight, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useEditRequestLogic } from "./EditRequest.logic";
import { useI18n } from "@/i18n";

export function EditRequestPage() {
  const { t } = useI18n();
  const {
    // State
    isLoading,
    isConfirmDialogOpen,
    formData,
    formErrors,
    requestTypes,
    requestCategories,
    mainCategories,
    subCategories,
    services,
    leadership,
    filteredSubCategories,
    filteredServices,
    
    // Role checks
    isAdmin,
    isEmployee,
    isUser,
    isVisitRequest,
    canEditRequest,
    
    // Handlers
    setIsLoading,
    setIsConfirmDialogOpen,
    setFormData,
    setFormErrors,
    handleInputChange,
    handleSubmit,
    getStatusBadge,
    navigate
  } = useEditRequestLogic();

  if (isLoading && !formData) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <p className="text-[#6F6F6F]">{t("requests.loading")}</p>
      </div>
    );
  }

  if (!formData) {
    return null;
  }

  // If user doesn't have permission to edit, show access denied message
  if (!canEditRequest) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center p-4">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-[#2B2B2B] mb-2">{t("requests.accessDenied")}</h2>
          <p className="text-[#6F6F6F] mb-6">
            {t("requests.noPermissionToEdit")}
          </p>
          <Button 
            onClick={() => navigate(-1)}
            className="bg-[#115740] hover:bg-[#0d4230] text-white"
          >
            {t("requests.backToPrevious")}
          </Button>
        </Card>
      </div>
    );
  }

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
            {t("navigation.requests")}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <Link
            to={`/dashboard/request/${formData.requestNumber}`}
            className="hover:text-[#6CAEBD] transition"
          >
            {formData.requestNumber}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#2B2B2B] font-medium">{t("common.edit")}</span>
        </nav>

        {/* Summary Card */}
        <Card className="p-6 mb-6 rounded-xl border-0 shadow-soft bg-white">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="text-[#6F6F6F] text-sm mb-1 block">{t("requests.requestNumber")}</Label>
              <p className="text-[#2B2B2B] font-semibold text-lg">
                {formData.requestNumber}
              </p>
            </div>
            <div>
              <Label className="text-[#6F6F6F] text-sm mb-1 block">{t("requests.submissionDate")}</Label>
              <p className="text-[#2B2B2B] font-medium">
                {new Date(formData.createdAt).toLocaleDateString("ar-SA")}
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
                {t("requests.userInfo")}
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label className="text-[#2B2B2B]">{t("requests.name")}</Label>
                  <Input
                    value={formData.nameAr}
                    disabled
                    className="rounded-xl mt-2 bg-gray-50"
                  />
                </div>
                <div>
                  <Label className="text-[#2B2B2B]">{t("requests.email")}</Label>
                  <Input
                    value={formData.email}
                    disabled
                    className="rounded-xl mt-2 bg-gray-50"
                    dir="ltr"
                  />
                </div>
                <div>
                  <Label className="text-[#2B2B2B]">{t("requests.mobile")}</Label>
                  <Input
                    value={formData.mobile}
                    disabled
                    className="rounded-xl mt-2 bg-gray-50"
                    dir="ltr"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-[#2B2B2B] mb-4">
                {t("requests.requestInfo")}
              </h3>

              {/* Request Type - Read Only */}
              <div className="mb-4">
                <div>
                  <Label htmlFor="requestTypeId" className="text-[#2B2B2B]">
                    {t("requests.requestType")} <span className="text-red-500">{t("requests.required")}</span>
                  </Label>
                  <Input
                    value={requestTypes.find(type => type.id === formData.requestTypeId)?.nameAr || ""}
                    disabled
                    className="rounded-xl mt-2 bg-gray-50"
                  />
                </div>
              </div>

              {/* Title */}
              <div className="mb-4">
                <Label htmlFor="titleAr" className="text-[#2B2B2B]">
                  {t("requests.requestTitle")} <span className="text-red-500">{t("requests.required")}</span>
                </Label>
                <Input
                  id="titleAr"
                  value={formData.titleAr || ""}
                  onChange={(e) => handleInputChange("titleAr", e.target.value)}
                  placeholder={t("requests.enterRequestTitle")}
                  className={`rounded-xl mt-2 ${
                    formErrors.titleAr ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                />
                {formErrors.titleAr && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.titleAr}</p>
                )}
              </div>

              {/* Subject */}
              <div className="mb-4">
                <Label htmlFor="subjectAr" className="text-[#2B2B2B]">
                  {t("requests.subject")} <span className="text-red-500">{t("requests.required")}</span>
                </Label>
                <Textarea
                  id="subjectAr"
                  value={formData.subjectAr || ""}
                  onChange={(e) => handleInputChange("subjectAr", e.target.value)}
                  placeholder={t("requests.explainRequestInDetail")}
                  rows={4}
                  className={`rounded-xl mt-2 resize-none ${
                    formErrors.subjectAr ? "border-red-500 focus:ring-red-500" : ""
                  }`}
                />
                {formErrors.subjectAr && (
                  <p className="text-red-500 text-sm mt-1">{formErrors.subjectAr}</p>
                )}
              </div>

              {/* Additional Details */}
              <div className="mb-4">
                <Label htmlFor="additionalDetailsAr" className="text-[#2B2B2B]">
                  {t("requests.additionalDetails")}
                </Label>
                <Textarea
                  id="additionalDetailsAr"
                  value={formData.additionalDetailsAr || ""}
                  onChange={(e) => handleInputChange("additionalDetailsAr", e.target.value)}
                  placeholder={t("requests.additionalDetailsPlaceholder")}
                  rows={3}
                  className="rounded-xl mt-2 resize-none"
                />
              </div>

              {/* Visit-specific fields */}
              {isVisitRequest && (
                <>
                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold text-[#2B2B2B] mb-4">
                      {t("requests.visitDetails")}
                    </h3>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label htmlFor="universityLeadershipId" className="text-[#2B2B2B]">
                          {t("requests.universityLeader")} <span className="text-red-500">{t("requests.required")}</span>
                        </Label>
                        <Select
                          value={formData.universityLeadershipId?.toString() || ""}
                          onValueChange={(value: string) => {
                            handleInputChange("universityLeadershipId", parseInt(value));
                            if (formErrors.universityLeadershipId)
                              setFormErrors({ ...formErrors, universityLeadershipId: "" });
                          }}
                        >
                          <SelectTrigger
                            className={`rounded-xl mt-2 ${
                              formErrors.universityLeadershipId ? "border-red-500" : ""
                            }`}
                          >
                            <SelectValue placeholder={t("requests.selectLeader")} />
                          </SelectTrigger>
                          <SelectContent>
                            {leadership.map((leader) => (
                              <SelectItem key={leader.id} value={leader.id.toString()}>
                                <div>
                                  <div>{leader.nameAr}</div>
                                  <div className="text-xs text-gray-500">{leader.positionAr}</div>
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
                      
                      <div>
                        <Label htmlFor="visitReasonAr" className="text-[#2B2B2B]">
                          {t("requests.visitReason")} <span className="text-red-500">{t("requests.required")}</span>
                        </Label>
                        <Input
                          id="visitReasonAr"
                          value={formData.visitReasonAr || ""}
                          onChange={(e) => handleInputChange("visitReasonAr", e.target.value)}
                          placeholder={t("requests.enterVisitReason")}
                          className={`rounded-xl mt-2 ${
                            formErrors.visitReasonAr ? "border-red-500 focus:ring-red-500" : ""
                          }`}
                        />
                        {formErrors.visitReasonAr && (
                          <p className="text-red-500 text-sm mt-1">{formErrors.visitReasonAr}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Category Hierarchy */}
              {formData.requestCategoryId && !isVisitRequest && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-[#2B2B2B] mb-4">
                    {t("requests.detailedClassification")}
                  </h3>
                  
                  <div>
                    <Label htmlFor="mainCategoryId" className="text-[#2B2B2B]">
                      {t("requests.mainCategory")}
                    </Label>
                    <Select
                      value={formData.mainCategoryId?.toString() || ""}
                      onValueChange={(value: string) => {
                        handleInputChange("mainCategoryId", parseInt(value));
                      }}
                    >
                      <SelectTrigger className="rounded-xl mt-2">
                        <SelectValue placeholder={t("requests.selectMainCategory")} />
                      </SelectTrigger>
                      <SelectContent>
                        {mainCategories.map((category) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.nameAr}
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
                  onClick={() => navigate(-1)}
                  className="border-[#115740] text-[#115740] hover:bg-[#115740] hover:text-white rounded-xl"
                >
                  {t("requests.cancel")}
                </Button>
                <Button
                  type="submit"
                  className="bg-[#115740] hover:bg-[#0d4230] text-white rounded-xl flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {t("requests.saveChanges")}
                </Button>
              </div>
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
            <AlertDialogCancel>{t("requests.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                setIsLoading(true);
                try {
                  // Simulate API call
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  setIsConfirmDialogOpen(false);
                  toast.success(t("requests.changesSavedSuccessfully"));
                  navigate(`/dashboard/request/${formData?.requestNumber}`);
                } catch (error) {
                  toast.error(t("requests.errorOccurred"));
                } finally {
                  setIsLoading(false);
                }
              }}
              className="bg-[#115740] hover:bg-[#0d4230]"
            >
              {t("requests.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}