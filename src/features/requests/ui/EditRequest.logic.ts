import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { useUserRole } from "@/core/hooks";
import { useRequestDetails } from "@/features/requests/hooks/useRequests";
import { useMainCategories, useLeadershipLookup } from "@/features/lookups/hooks/useLookups";
import { RequestStatus } from "@/core/constants/requestStatuses";
import { RequestType } from "@/core/constants/requestTypes";
import { queryKeys } from "@/core/lib/queryKeys";
import { apiRequest } from "@/core/lib/apiClient";
import type { UserRequestDto } from "@/core/types/api";

// Regex patterns for validation (same as request form)
const hasArabicRegex = /[\u0600-\u06FF]/;
const noEnglishRegex = /^[^a-zA-Z]*$/;
const hasEnglishRegex = /[a-zA-Z]/;
const noArabicRegex = /^[^\u0600-\u06FF]*$/;

interface EditFormData {
  titleAr: string;
  titleEn?: string;
  subjectAr: string;
  subjectEn?: string;
  additionalDetailsAr?: string;
  additionalDetailsEn?: string;
  mainCategoryId?: number;
  subCategoryId?: number;
  serviceId?: number;
  visitReasonAr?: string;
  visitReasonEn?: string;
  universityLeadershipId?: number;
}

interface FormErrors {
  [key: string]: string;
}

export const useEditRequestLogic = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t, language } = useI18n();
  const { isSuperAdmin, isEmployee, isUser } = useUserRole();
  const queryClient = useQueryClient();

  // State
  const [formData, setFormData] = useState<EditFormData>({
    titleAr: "",
    subjectAr: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  // Fetch request details
  const { data: request, isLoading: isLoadingRequest } = useRequestDetails(id || "");

  // Fetch lookups
  const { data: mainCategories = [] } = useMainCategories();
  const { data: leadership = [] } = useLeadershipLookup();

  // Determine request type
  const isInquiryRequest = request?.requestTypeId === RequestType.INQUIRY;
  const isComplaintRequest = request?.requestTypeId === RequestType.COMPLAINT;
  const isVisitRequest = request?.requestTypeId === RequestType.VISIT;

  // Check if user can edit the request
  const canEditRequest = useMemo(() => {
    if (!request) return false;

    // Super Admin can always edit
    if (isSuperAdmin) return true;

    // Employee can only edit RECEIVED status requests
    if (isEmployee && request.requestStatusId === RequestStatus.RECEIVED) return true;

    return false;
  }, [request, isSuperAdmin, isEmployee]);

  // Initialize form data when request is loaded
  useEffect(() => {
    if (request) {
      setFormData({
        titleAr: request.titleAr || "",
        titleEn: request.titleEn,
        subjectAr: request.subjectAr || "",
        subjectEn: request.subjectEn,
        additionalDetailsAr: request.additionalDetailsAr,
        additionalDetailsEn: request.additionalDetailsEn,
        mainCategoryId: request.mainCategoryId,
        subCategoryId: request.subCategoryId,
        serviceId: request.serviceId,
        visitReasonAr: request.visitReasonAr,
        visitReasonEn: request.visitReasonEn,
        universityLeadershipId: request.universityLeadershipId,
      });
    }
  }, [request]);

  // Update mutation
  const updateRequestMutation = useMutation({
    mutationFn: async (data: EditFormData) => {
      return apiRequest.put<UserRequestDto>(`/requests/${id}`, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.requests.detail(id!) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      toast.success(t("requests.changesSavedSuccessfully"));
      navigate(`/dashboard/request/${id}`);
    },
    onError: (error: any) => {
      toast.error(t("requests.errorOccurred"), {
        description: error.message,
      });
    },
  });

  // Handle input change
  const handleInputChange = (field: keyof EditFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Title Arabic validation
    if (!formData.titleAr?.trim()) {
      errors.titleAr = t("validation.titleRequired");
    } else if (formData.titleAr.length > 100) {
      errors.titleAr = t("validation.maxLength").replace("{max}", "100");
    } else if (!hasArabicRegex.test(formData.titleAr)) {
      errors.titleAr = t("validation.arabicRequired");
    } else if (!noEnglishRegex.test(formData.titleAr)) {
      errors.titleAr = t("validation.noEnglishAllowed");
    }

    // Title English validation (optional but has max length)
    if (formData.titleEn && formData.titleEn.length > 100) {
      errors.titleEn = t("validation.maxLength").replace("{max}", "100");
    }

    // Subject Arabic validation
    if (!formData.subjectAr?.trim()) {
      errors.subjectAr = t("validation.subjectRequired");
    } else if (!hasArabicRegex.test(formData.subjectAr)) {
      errors.subjectAr = t("validation.arabicRequired");
    } else if (!noEnglishRegex.test(formData.subjectAr)) {
      errors.subjectAr = t("validation.noEnglishAllowed");
    }

    // Additional Details Arabic validation (optional but must be Arabic only if provided)
    if (formData.additionalDetailsAr && formData.additionalDetailsAr.trim() !== "") {
      if (!hasArabicRegex.test(formData.additionalDetailsAr)) {
        errors.additionalDetailsAr = t("validation.arabicRequired");
      } else if (!noEnglishRegex.test(formData.additionalDetailsAr)) {
        errors.additionalDetailsAr = t("validation.noEnglishAllowed");
      }
    }

    // Visit-specific validations
    if (isVisitRequest) {
      if (!formData.universityLeadershipId) {
        errors.universityLeadershipId = t("validation.leaderRequired");
      }
      
      // Visit Reason Arabic validation
      if (!formData.visitReasonAr?.trim()) {
        errors.visitReasonAr = t("validation.visitReasonRequired");
      } else if (!hasArabicRegex.test(formData.visitReasonAr)) {
        errors.visitReasonAr = t("validation.arabicRequired");
      } else if (!noEnglishRegex.test(formData.visitReasonAr)) {
        errors.visitReasonAr = t("validation.noEnglishAllowed");
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("validation.pleaseFixErrors"));
      return;
    }

    setIsConfirmDialogOpen(true);
  };

  // Confirm and save changes
  const confirmSave = async () => {
    setIsConfirmDialogOpen(false);
    updateRequestMutation.mutate(formData);
  };

  // Cancel edit
  const handleCancel = () => {
    navigate(`/dashboard/request/${id}`);
  };

  return {
    // State
    request,
    formData,
    formErrors,
    isLoading: isLoadingRequest,
    isSubmitting: updateRequestMutation.isPending,
    isConfirmDialogOpen,

    // Lookups
    mainCategories,
    leadership,

    // Flags
    isInquiryRequest,
    isComplaintRequest,
    isVisitRequest,
    canEditRequest,
    isSuperAdmin,
    isEmployee,

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
  };
};
