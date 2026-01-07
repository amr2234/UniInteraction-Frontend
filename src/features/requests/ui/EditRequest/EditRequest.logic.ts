import { useState, useEffect, useMemo, useCallback } from "react";
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
import type { EditFormData, FormErrors } from "./EditRequest.types";

// Regex patterns for validation (same as request form)
const hasArabicRegex = /[\u0600-\u06FF]/;
const noEnglishRegex = /^[^a-zA-Z]*$/;
const hasEnglishRegex = /[a-zA-Z]/;
const noArabicRegex = /^[^\u0600-\u06FF]*$/;

export const useEditRequestLogic = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { t, language } = useI18n();
  const { isSuperAdmin, isAdmin, isEmployee, isUser } = useUserRole();
  const queryClient = useQueryClient();

  // Consolidated state for better performance
  const [state, setState] = useState({
    formData: {
      titleAr: "",
      subjectAr: "",
    } as EditFormData,
    formErrors: {} as FormErrors,
    isConfirmDialogOpen: false,
  });

  // Destructure state for easier access
  const { formData, formErrors, isConfirmDialogOpen } = state;

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

    // Only Super Admin and Admin can edit requests
    // Employees are not allowed to edit
    if (isSuperAdmin || isAdmin) return true;

    return false;
  }, [request, isSuperAdmin, isAdmin]);

  // Initialize form data when request is loaded
  useEffect(() => {
    if (request) {
      setState((prev) => ({
        ...prev,
        formData: {
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
        },
      }));
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

  // Handle input change - Memoized for performance
  const handleInputChange = useCallback((field: keyof EditFormData, value: any) => {
    setState((prev) => {
      const newFormData = { ...prev.formData, [field]: value };
      const newErrors = { ...prev.formErrors };
      
      // Clear error for this field
      if (newErrors[field]) {
        delete newErrors[field];
      }
      
      return {
        ...prev,
        formData: newFormData,
        formErrors: newErrors,
      };
    });
  }, []);

  // Validate form - Memoized validation logic
  const validateForm = useCallback((): boolean => {
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

    setState((prev) => ({ ...prev, formErrors: errors }));
    return Object.keys(errors).length === 0;
  }, [formData, isVisitRequest, t]);

  // Handle submit - Memoized
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t("validation.pleaseFixErrors"));
      return;
    }

    setState((prev) => ({ ...prev, isConfirmDialogOpen: true }));
  }, [validateForm, t]);

  // Confirm and save changes - Memoized
  const confirmSave = useCallback(async () => {
    setState((prev) => ({ ...prev, isConfirmDialogOpen: false }));
    updateRequestMutation.mutate(formData);
  }, [formData, updateRequestMutation]);

  // Cancel edit - Memoized
  const handleCancel = useCallback(() => {
    navigate(`/dashboard/request/${id}`);
  }, [navigate, id]);

  // Toggle dialog - Memoized
  const setIsConfirmDialogOpen = useCallback((value: boolean) => {
    setState((prev) => ({ ...prev, isConfirmDialogOpen: value }));
  }, []);

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
    isAdmin,
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
