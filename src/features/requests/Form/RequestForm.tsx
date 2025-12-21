import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { ArrowRight, AlertTriangle, Upload, X, Check, ChevronsUpDown, CheckCircle, Info } from "lucide-react";
import { useRequestForm } from "./RequestForm.logic";
import { useI18n } from "@/i18n";
import { REQUEST_TYPES, RequestTypeId } from "./RequestForm.types";
import { cn } from "@/shared/ui/utils";

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  error,
  hint,
  children,
}) => (
  <div>
    <Label className="text-[#2B2B2B]">
      {label}
      {required && <span className="text-red-500"> *</span>}
      {hint && <span className="text-orange-500 text-sm"> {hint}</span>}
    </Label>
    {children}
    {error && (
      <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        {error}
      </p>
    )}
  </div>
);

interface PageHeaderProps {
  requestType: RequestTypeId;
  onBack: () => void;
  t: (key: string) => string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ requestType, onBack, t }) => {
  const titles = {
    [REQUEST_TYPES.INQUIRY]: {
      title: t("requests.submitInquiry"),
      desc: t("requests.inquiryDescription"),
    },
    [REQUEST_TYPES.COMPLAINT]: {
      title: t("requests.submitComplaintOrSuggestion"),
      desc: t("requests.complaintOrSuggestionDescription"),
    },
    [REQUEST_TYPES.VISIT]: {
      title: t("requests.bookVisit"),
      desc: t("requests.visitDescription"),
    },
  };

  const { title, desc } = titles[requestType];

  return (
    <div className="mb-8">
      <Button variant="ghost" onClick={onBack} className="mb-4 gap-2">
        <ArrowRight className="w-5 h-5" />
        {t("common.back")}
      </Button>
      <h1 className="text-[#2B2B2B] mb-2">{title}</h1>
      <p className="text-[#6F6F6F]">{desc}</p>
    </div>
  );
};

interface RequestFormProps {
  requestTypeId: RequestTypeId;
}

export function RequestForm({ requestTypeId }: RequestFormProps) {
  const { t, language } = useI18n();
  const {
    control,
    handleSubmit,
    formState,
    requestType,
    isLoading,
    files,
    handleFileChange,
    removeFile,
    handleCancel,
    mainCategories,
    leadershipOptions,
    userRequests,
    trigger,
  } = useRequestForm(requestTypeId);

  const { errors, isSubmitting } = formState;

  // Check if form is valid (no errors and all required fields are filled)
  const hasErrors = Object.keys(errors).length > 0;

  const isVisit = requestType === REQUEST_TYPES.VISIT;
  const hasCategories = (requestType === REQUEST_TYPES.COMPLAINT || 
                        requestType === REQUEST_TYPES.INQUIRY);

  // State for searchable dropdowns
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [leadershipOpen, setLeadershipOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Handle form submission with confirmation
  const onSubmitClick = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form first
    const isFormValid = await trigger();
    
    if (!isFormValid) {
      // Find the first error field and scroll to it
      const firstErrorField = Object.keys(errors)[0];
      if (firstErrorField) {
        const element = document.getElementsByName(firstErrorField)[0];
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.focus();
        }
      }
      return; // Don't show dialog if form is invalid
    }
    
    // Form is valid, show confirmation dialog
    setShowConfirmDialog(true);
  };

  const handleConfirmSubmit = async () => {
    // Close dialog and submit form
    setShowConfirmDialog(false);
    handleSubmit();
  };

  const handleCancelDialog = () => {
    // Close dialog without submitting
    setShowConfirmDialog(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <p className="text-[#6F6F6F]">{t("common.loading")}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-8">
        <PageHeader requestType={requestType} onBack={handleCancel} t={t} />

        <form onSubmit={onSubmitClick} className="space-y-6">
          {/* Personal Information Card */}
          <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
            <h3 className="text-[#6CAEBD] mb-6">{t("form.personalInfo")}</h3>
            
            {/* Information Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  {t("requests.personalInfoNote")}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Controller
                  name="nameAr"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      label={t("form.nameAr")}
                      required
                      error={errors.nameAr?.message}
                    >
                      <Input
                        {...field}
                        className={`rounded-xl mt-2 bg-gray-50 ${
                          errors.nameAr ? "border-red-500" : ""
                        }`}
                        disabled
                      />
                    </FormField>
                  )}
                />

                <Controller
                  name="nameEn"
                  control={control}
                  render={({ field }) => (
                    <FormField label={t("form.nameEn")}>
                      <Input
                        {...field}
                        className="rounded-xl mt-2 bg-gray-50"
                        dir="ltr"
                        disabled
                      />
                    </FormField>
                  )}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      label={t("form.email")}
                      required
                      error={errors.email?.message}
                    >
                      <Input
                        {...field}
                        type="email"
                        className={`rounded-xl mt-2 bg-gray-50 ${
                          errors.email ? "border-red-500" : ""
                        }`}
                        dir="ltr"
                        disabled
                      />
                    </FormField>
                  )}
                />

                <Controller
                  name="mobile"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      label={t("form.mobile")}
                      required
                      error={errors.mobile?.message}
                    >
                      <Input
                        {...field}
                        type="tel"
                        placeholder="05xxxxxxxx"
                        className={`rounded-xl mt-2 bg-gray-50 ${
                          errors.mobile ? "border-red-500" : ""
                        }`}
                        dir="ltr"
                        disabled
                      />
                    </FormField>
                  )}
                />
              </div>
            </div>
          </Card>

          {/* Request Details Card */}
          <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
            <h3 className="text-[#6CAEBD] mb-6">{t("requests.requestDetails")}</h3>
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Controller
                  name="titleAr"
                  control={control}
                  render={({ field }) => (
                    <FormField
                      label={t(isVisit ? "requests.visitTitleAr" : requestType === 1 ? "requests.inquiryTitleAr" : "requests.complaintTitleAr")}
                      required
                      error={errors.titleAr?.message}
                    >
                      <Input
                        {...field}
                        placeholder={t("requests.enterTitle")}
                        className={`rounded-xl mt-2 ${
                          errors.titleAr ? "border-red-500" : ""
                        }`}
                      />
                    </FormField>
                  )}
                />

                <Controller
                  name="titleEn"
                  control={control}
                  render={({ field }) => (
                    <FormField label={t(isVisit ? "requests.visitTitleEn" : requestType === 1 ? "requests.inquiryTitleEn" : "requests.complaintTitleEn")}>
                      <Input
                        {...field}
                        placeholder={t("requests.enterTitleEn")}
                        className="rounded-xl mt-2"
                        dir="ltr"
                      />
                    </FormField>
                  )}
                />
              </div>

              <Controller
                name="subjectAr"
                control={control}
                render={({ field }) => (
                  <FormField
                    label={t(isVisit ? "requests.visitReasonAr" : requestType === 1 ? "requests.inquirySubjectAr" : "requests.complaintSubjectAr")}
                    required
                    error={errors.subjectAr?.message}
                  >
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder={t("requests.describeRequest")}
                      className={`rounded-xl mt-2 resize-none ${
                        errors.subjectAr ? "border-red-500" : ""
                      }`}
                    />
                  </FormField>
                )}
              />

              <Controller
                name="subjectEn"
                control={control}
                render={({ field }) => (
                  <FormField label={t(isVisit ? "requests.visitReasonEn" : requestType === 1 ? "requests.inquirySubjectEn" : "requests.complaintSubjectEn")}>
                    <Textarea
                      {...field}
                      rows={4}
                      placeholder={t("requests.describeRequestEn")}
                      className="rounded-xl mt-2 resize-none"
                      dir="ltr"
                    />
                  </FormField>
                )}
              />

              {/* Category Dropdown - For Non-Visit Requests */}
              {hasCategories && (
                <Controller
                  name="mainCategoryId"
                  control={control}
                  render={({ field }) => (
                    <FormField label={t("form.mainCategory")}>
                      <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={categoryOpen}
                            className="w-full rounded-xl mt-2 justify-between"
                          >
                            {field.value
                              ? mainCategories.find((cat) => cat.id.toString() === field.value)?.
                                [language === "ar" ? "nameAr" : "nameEn"] || 
                                mainCategories.find((cat) => cat.id.toString() === field.value)?.nameAr
                              : t("form.selectCategory")}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder={t("common.search")} />
                            <CommandEmpty>{t("common.noData")}</CommandEmpty>
                            <CommandGroup className="max-h-[200px] overflow-auto">
                              {mainCategories.map((category) => (
                                <CommandItem
                                  key={category.id}
                                  value={category.nameAr}
                                  onSelect={() => {
                                    field.onChange(category.id.toString());
                                    setCategoryOpen(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      field.value === category.id.toString()
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {language === "ar" ? category.nameAr : category.nameEn || category.nameAr}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormField>
                  )}
                />
              )}

              {/* Visit-specific fields */}
              {isVisit && (
                <>
                  {/* Previous Complaint Link Section */}
                  <Card className="p-4 bg-blue-50 border-blue-200">
                    <h4 className="text-sm font-semibold text-[#115740] mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4" />
                      {t("requests.relatedToPrevious")}
                    </h4>
                    
                    <Controller
                      name="hasRelatedComplaint"
                      control={control}
                      render={({ field }) => (
                        <div className="space-y-3">
                          <Label className="text-sm text-gray-700">
                            {t("requests.isRelatedToPreviousQuestion")}
                          </Label>
                          <div className="flex gap-4">
                            <button
                              type="button"
                              onClick={() => field.onChange(true)}
                              className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                                field.value === true
                                  ? 'border-[#6CAEBD] bg-[#6CAEBD] text-white'
                                  : 'border-gray-300 bg-white text-gray-700 hover:border-[#6CAEBD]'
                              }`}
                            >
                              {t("requests.yes")}
                            </button>
                            <button
                              type="button"
                              onClick={() => field.onChange(false)}
                              className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                                field.value === false
                                  ? 'border-[#6CAEBD] bg-[#6CAEBD] text-white'
                                  : 'border-gray-300 bg-white text-gray-700 hover:border-[#6CAEBD]'
                              }`}
                            >
                              {t("requests.no")}
                            </button>
                          </div>
                        </div>
                      )}
                    />
                    
                    {/* Warning when NO is selected */}
                    <Controller
                      name="hasRelatedComplaint"
                      control={control}
                      render={({ field }) => (
                        field.value === false && (
                          <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                            <div className="flex items-start gap-2">
                              <AlertTriangle  className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                              <p className="text-sm text-orange-800">
                                {t("requests.visitWithoutComplaintWarning")}
                              </p>
                            </div>
                          </div>
                        )
                      )}
                    />
                    
                    {/* Previous Request Dropdown - Show when YES */}
                    <Controller
                      name="hasRelatedComplaint"
                      control={control}
                      render={({ field: hasComplaintField }) => (
                        hasComplaintField.value === true && (
                          <Controller
                            name="relatedRequestId"
                            control={control}
                            render={({ field: requestField }) => (
                              <div className="mt-3">
                                <Label className="text-sm text-gray-700 mb-2 block">
                                  {t("requests.selectPreviousRequest")}
                                  <span className="text-red-500"> *</span>
                                </Label>
                                <Popover open={requestOpen} onOpenChange={setRequestOpen}>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      role="combobox"
                                      aria-expanded={requestOpen}
                                      className={`w-full rounded-xl justify-between ${
                                        errors.relatedRequestId ? "border-red-500" : ""
                                      }`}
                                    >
                                      {requestField.value
                                        ? userRequests.find((req) => req.id.toString() === requestField.value)?.titleAr || 
                                          userRequests.find((req) => req.id.toString() === requestField.value)?.requestNumber
                                        : t("requests.selectPreviousRequestPlaceholder")}
                                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-full p-0">
                                    <Command>
                                      <CommandInput placeholder={t("common.search")} />
                                      <CommandEmpty>
                                        {userRequests.length === 0 
                                          ? t("common.noData") + " - No previous complaints found"
                                          : t("common.noData")}
                                      </CommandEmpty>
                                      <CommandGroup className="max-h-[200px] overflow-auto">
                                        {userRequests && userRequests.length > 0 ? (
                                          userRequests.map((request) => (
                                            <CommandItem
                                              key={request.id}
                                              value={`${request.requestNumber} ${request.titleAr}`}
                                              onSelect={() => {
                                                requestField.onChange(request.id.toString());
                                                setRequestOpen(false);
                                              }}
                                            >
                                              <Check
                                                className={cn(
                                                  "mr-2 h-4 w-4",
                                                  requestField.value === request.id.toString()
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                                )}
                                              />
                                              <div className="flex-1">
                                                <p className="font-medium">{language === "ar" ? request.titleAr : (request.titleEn || request.titleAr)}</p>
                                                <p className="text-xs text-gray-500">{request.requestNumber}</p>
                                              </div>
                                            </CommandItem>
                                          ))
                                        ) : (
                                          <div className="p-4 text-sm text-gray-500 text-center">
                                            No previous complaints found
                                          </div>
                                        )}
                                      </CommandGroup>
                                    </Command>
                                  </PopoverContent>
                                </Popover>
                                {errors.relatedRequestId && (
                                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" />
                                    {errors.relatedRequestId.message}
                                  </p>
                                )}
                              </div>
                            )}
                          />
                        )
                      )}
                    />
                  </Card>
                  
                  {/* Searchable Leadership Dropdown */}
                  <Controller
                    name="universityLeadershipId"
                    control={control}
                    render={({ field }) => (
                      <FormField
                        label={t("requests.selectLeader")}
                        required
                        error={errors.universityLeadershipId?.message}
                      >
                        <Popover open={leadershipOpen} onOpenChange={setLeadershipOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={leadershipOpen}
                              className={`w-full rounded-xl mt-2 justify-between ${
                                errors.universityLeadershipId ? "border-red-500" : ""
                              }`}
                            >
                              {field.value
                                ? leadershipOptions.find((leader) => leader.id.toString() === field.value)?.
                                  [language === "ar" ? "nameAr" : "nameEn"] || 
                                  leadershipOptions.find((leader) => leader.id.toString() === field.value)?.nameAr
                                : t("requests.chooseLeader")}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-full p-0">
                            <Command>
                              <CommandInput placeholder={t("common.search")} />
                              <CommandEmpty>{t("common.noData")}</CommandEmpty>
                              <CommandGroup className="max-h-[200px] overflow-auto">
                                {leadershipOptions.map((leader) => (
                                  <CommandItem
                                    key={leader.id}
                                    value={leader.nameAr}
                                    onSelect={() => {
                                      field.onChange(leader.id.toString());
                                      setLeadershipOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === leader.id.toString()
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {language === "ar"
                                      ? `${leader.nameAr} - ${leader.positionTitleAr}`
                                      : `${leader.nameEn || leader.nameAr} - ${leader.positionTitleEn || leader.positionTitleAr}`
                                    }
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </FormField>
                    )}
                  />
                  
                  {/* Visit Date Note */}
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-amber-800">
                        {t("requests.visitDateNote")}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* File Upload Section */}
          <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
            <h3 className="text-[#6CAEBD] mb-6">{t("requests.attachments")}</h3>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-[#6CAEBD]/30 rounded-xl p-6 text-center hover:border-[#6CAEBD]/50 transition-colors">
                {/* File input - Accepts: PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG, GIF */}
                <input
                  type="file"
                  multiple
                  onChange={(e) => handleFileChange(e.target.files)}
                  className="hidden"
                  id="file-upload"
                  accept=".jpg,.jpeg,.png,.gif,.pdf,.doc,.docx,.xls,.xlsx"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-[#6CAEBD]" />
                  <p className="text-xs text-[#2B2B2B]">{t("requests.uploadFiles")}</p>
                  <p className="text-[10px] text-[#6F6F6F] text-center px-2">
                    {language === "ar" 
                      ? "الملفات المقبولة: PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG, GIF"
                      : "Accepted files: PDF, DOC, DOCX, XLS, XLSX, JPG, JPEG, PNG, GIF"
                    }
                  </p>
                </label>
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-sm text-[#2B2B2B] truncate flex-1">
                        {file.name}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="rounded-xl"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#6CAEBD] hover:bg-[#6CAEBD]/90 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? t("common.submitting") : t("requests.submitRequest")}
            </Button>
          </div>
        </form>

        {/* Confirmation AlertDialog */}
        <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
              </div>
              <AlertDialogTitle>
                {t("requests.confirmSubmission")}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {t("requests.confirmSubmissionMessage")}
              </AlertDialogDescription>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mx-6 mb-4">
                <p className="text-sm text-blue-800">
                  {isVisit ? t("requests.visitProcessingNote") : t("requests.processingNote")}
                </p>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancelDialog}>
                {t("common.cancel")}
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? t("common.submitting") : t("common.confirm")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
