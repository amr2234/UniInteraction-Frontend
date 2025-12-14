import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { useUser } from "@/core/hooks/useUser";
  import { RequestStatus } from "@/core/constants/requestStatuses";
import { createRequestFormSchema } from "./RequestForm.schema";
import {
  RequestFormData,
  UseRequestFormReturn,
  REQUEST_TYPES,
  RequestTypeId,
} from "./RequestForm.types";
import { requestsApi } from "../api/requests.api";
import type { CreateRequestPayload } from "@/core/types/api";

// TODO: Replace with actual API calls when available
import { useMainCategories, useLeadershipLookup } from "@/features/lookups/hooks/useLookups";
import { getCurrentUser } from "@/core/lib/authUtils";

export const useRequestForm = (requestTypeId: RequestTypeId): UseRequestFormReturn => {
  const navigate = useNavigate();
  const { t, language } = useI18n();
  
  const userProfile = (() => {
    try {
      const profile = localStorage.getItem('userProfile');
      return profile ? JSON.parse(profile) : null;
    } catch {
      return null;
    }
  })();

  const [files, setFiles] = useState<File[]>([]);

  const { data: mainCategoriesData, isLoading: isLoadingCategories, error: categoriesError } = useMainCategories();
  const { data: leadershipData, isLoading: isLoadingLeadership, error: leadershipError } = useLeadershipLookup();

  // Debug: Log API call status
  useEffect(() => {
    console.log('📊 Categories API Status:', { 
      isLoading: isLoadingCategories, 
      hasData: !!mainCategoriesData, 
      dataLength: mainCategoriesData?.length,
      error: categoriesError 
    });
  }, [isLoadingCategories, mainCategoriesData, categoriesError]);

  useEffect(() => {
    console.log('👥 Leadership API Status:', { 
      isLoading: isLoadingLeadership, 
      hasData: !!leadershipData, 
      dataLength: leadershipData?.length,
      error: leadershipError 
    });
  }, [isLoadingLeadership, leadershipData, leadershipError]);

  const validationSchema = useMemo(() => createRequestFormSchema(t), [t]);

  const {
    control,
    handleSubmit: rhfHandleSubmit,
    formState,
    setValue,
    watch,
    reset,
    trigger,
  } = useForm<RequestFormData>({
    resolver: zodResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      nameAr: userProfile?.name || "",
      nameEn: "",
      email: userProfile?.email || "",
      mobile: "",
      requestTypeId,
      titleAr: "",
      titleEn: "",
      subjectAr: "",
      subjectEn: "",
      additionalDetailsAr: "",
      additionalDetailsEn: "",
      mainCategoryId: "",
      subCategoryId: "",
      serviceId: "",
      visitReasonAr: "",
      visitReasonEn: "",
      visitStartAt: "",
      visitEndAt: "",
      universityLeadershipId: "",
    },
  });

  const { errors, isSubmitting, isDirty } = formState;

  useEffect(() => {
    const userName = userProfile?.nameAr ||  "";
    const userEmail = userProfile?.email ||  "";
    const userMobile = userProfile?.mobile || "";
    
    setValue("nameAr", userName);
    setValue("nameEn", userProfile?.nameEn || "");
    setValue("email", userEmail);
    setValue("mobile", userMobile);
  }, [ userProfile, setValue]);

  // Transform categories data
  const mainCategories = useMemo(
    () =>
      Array.isArray(mainCategoriesData)
        ? mainCategoriesData.map((cat) => ({
            id: cat.id,
            nameAr: cat.nameAr,
            nameEn: cat.nameEn,
          }))
        : [],
    [mainCategoriesData]
  );

  // Transform leadership data
  const leadershipOptions = useMemo(
    () =>
      Array.isArray(leadershipData)
        ? leadershipData.map((leader) => ({
            id: leader.id,
            nameAr: leader.nameAr,
            nameEn: leader.nameEn,
            positionTitleAr: leader.positionTitleAr,
            positionTitleEn: leader.positionTitleEn,
          }))
        : [],
    [leadershipData]
  );

  // File handling
  const handleFileChange = useCallback((newFiles: FileList | null) => {
    if (newFiles) {
      setFiles((prev) => [...prev, ...Array.from(newFiles)]);
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Form submission
  const onSubmit = useCallback(
    async (data: RequestFormData) => {
      try {
        const payload: CreateRequestPayload = {
          userId: userProfile?.id,
          nameAr: data.nameAr,
          nameEn: data.nameEn,
          email: data.email,
          mobile: data.mobile,
          titleAr: data.titleAr,
          titleEn: data.titleEn,
          subjectAr: data.subjectAr,
          subjectEn: data.subjectEn,
          additionalDetailsAr: data.additionalDetailsAr,
          additionalDetailsEn: data.additionalDetailsEn,
          requestTypeId: data.requestTypeId,
          requestStatusId: RequestStatus.RECEIVED, // Set initial status to "Received" (1)
        };

        // Add type-specific fields
        if (requestTypeId === REQUEST_TYPES.VISIT) {
          payload.visitReasonAr = data.visitReasonAr;
          payload.visitReasonEn = data.visitReasonEn;
          payload.visitStartAt = data.visitStartAt;
          payload.visitEndAt = data.visitEndAt;
          payload.universityLeadershipId = data.universityLeadershipId
            ? parseInt(data.universityLeadershipId)
            : undefined;
        } else {
          // For Complaint, Inquiry, Suggestion
          payload.mainCategoryId = data.mainCategoryId
            ? parseInt(data.mainCategoryId)
            : undefined;
          payload.subCategoryId = data.subCategoryId
            ? parseInt(data.subCategoryId)
            : undefined;
          payload.serviceId = data.serviceId ? parseInt(data.serviceId) : undefined;
        }

        // Submit request
        const createdRequest = await requestsApi.createRequest(payload);

        // Upload files if any
        if (files.length > 0) {
          await requestsApi.uploadRequestAttachments(createdRequest.id, files);
        }

        // Show success message
        toast.success(t("requests.submitSuccess"));

        // Navigate to request details or track requests
        navigate(`dashboard/requests/${createdRequest.id}`);
      } catch (error: any) {
        const errorMessage =
          error?.response?.data?.message ||
          error?.message ||
          t("requests.submitError");
        toast.error(errorMessage);
      }
    },
    [requestTypeId, files, navigate, t]
  );

  const handleCancel = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  return {
    control,
    handleSubmit: rhfHandleSubmit(onSubmit),
    formState: {
      errors,
      isSubmitting,
      isDirty,
    },
    watch,
    setValue,
    reset,
    trigger,

    requestType: requestTypeId,
    isLoading: isLoadingCategories || isLoadingLeadership,

    files,
    handleFileChange,
    removeFile,

    handleCancel,

    mainCategories,
    subCategories: [], // TODO: Implement sub-categories based on selected main category
    services: [], // TODO: Implement services based on selected category
    leadershipOptions,

    isLoadingCategories,
    isLoadingSubCategories: false, // TODO: Implement when sub-categories API is available
  };
};
