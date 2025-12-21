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
import { useUserRequests } from "../hooks/useRequests";

import {
  useMainCategories,
  useLeadershipLookup,
} from "@/features/lookups/hooks/useLookups";
import { getCurrentUser } from "@/core/lib/authUtils";

export const useRequestForm = (
  requestTypeId: RequestTypeId
): UseRequestFormReturn => {
  const navigate = useNavigate();
  const { t, language } = useI18n();

  const userProfile = (() => {
    try {
      const profile = localStorage.getItem("userProfile");
      return profile ? JSON.parse(profile) : null;
    } catch {
      return null;
    }
  })();

  const [files, setFiles] = useState<File[]>([]);

  const {
    data: mainCategoriesData,
    isLoading: isLoadingCategories,
    error: categoriesError,
  } = useMainCategories();
  const {
    data: leadershipData,
    isLoading: isLoadingLeadership,
    error: leadershipError,
  } = useLeadershipLookup();

  useEffect(() => {
    console.log("📊 Categories API Status:", {
      isLoading: isLoadingCategories,
      hasData: !!mainCategoriesData,
      dataLength: mainCategoriesData?.length,
      error: categoriesError,
    });
  }, [isLoadingCategories, mainCategoriesData, categoriesError]);

  useEffect(() => {
    console.log("👥 Leadership API Status:", {
      isLoading: isLoadingLeadership,
      hasData: !!leadershipData,
      dataLength: leadershipData?.length,
      error: leadershipError,
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
      requestTypeId: requestTypeId,
      titleAr: "",
      titleEn: "",
      subjectAr: "",
      subjectEn: "",
      mainCategoryId: "",
      subCategoryId: "",
      serviceId: "",
      universityLeadershipId: "",
      hasRelatedComplaint: undefined,
      relatedRequestId: "",
    },
  });

  const { errors, isSubmitting, isDirty } = formState;

  // Watch hasRelatedComplaint to conditionally fetch requests (AFTER useForm)
  const hasRelatedComplaint = watch("hasRelatedComplaint");

  // Fetch user's previous complaint/inquiry requests (for linking visits)
  // Only fetch when user clicks "Yes" (hasRelatedComplaint === true)
  const isVisitForm = requestTypeId === REQUEST_TYPES.VISIT;
  
  const { data: userRequestsResponse, isLoading: isLoadingUserRequests, error: userRequestsError } = useUserRequests(
    isVisitForm && userProfile?.id && hasRelatedComplaint === true
      ? {
          userId: userProfile.id,
          requestTypeId: REQUEST_TYPES.COMPLAINT, // Type 2 = Complaint/Inquiry
        }
      : undefined,
    false // enablePagination=false to get all user's complaints without pagination
  );
  
  // Extract items from paginated response
  const userRequests = useMemo(() => {
    if (!userRequestsResponse) return [];
    // Backend returns paginated format {items: [], pageNumber, totalCount, ...}
    return (userRequestsResponse as any).items || [];
  }, [userRequestsResponse]);

  useEffect(() => {
    const userName = userProfile?.nameAr || "";
    const userEmail = userProfile?.email || "";
    const userMobile = userProfile?.mobile || "";

    setValue("nameAr", userName);
    setValue("nameEn", userProfile?.nameEn || "");
    setValue("email", userEmail);
    setValue("mobile", userMobile);
  }, [userProfile, setValue]);

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

  const handleFileChange = useCallback((newFiles: FileList | null) => {
    if (newFiles) {
      setFiles((prev) => [...prev, ...Array.from(newFiles)]);
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const onSubmit = useCallback(
    async (data: RequestFormData) => {
      try {
        console.log("📝 Submitting Request Form Data:", data);

        // Build base payload
        const payload: CreateRequestPayload = {
          userId: userProfile?.id,
          email: data.email,
          mobile: data.mobile,
          titleAr: data.titleAr,
          titleEn: data.titleEn || undefined,
          subjectAr: data.subjectAr,
          subjectEn: data.subjectEn || undefined,
          requestTypeId: Number(requestTypeId),
          isVisitRelatedToPreviousRequest: false,
          needDateReschedule: false,
        };
        
        if (requestTypeId === REQUEST_TYPES.VISIT) {
          if (data.universityLeadershipId) {
            payload.universityLeadershipId = parseInt(data.universityLeadershipId);
          }
          
          if (data.hasRelatedComplaint === true && data.relatedRequestId) {
            payload.relatedRequestId = parseInt(data.relatedRequestId);
            payload.isVisitRelatedToPreviousRequest = true;
          }
        } else {
          if (data.mainCategoryId) {
            payload.mainCategoryId = parseInt(data.mainCategoryId);
          }
          if (data.subCategoryId) {
            payload.subCategoryId = parseInt(data.subCategoryId);
          }
        }

        // Remove undefined fields to prevent null values in backend
        const cleanPayload = Object.fromEntries(
          Object.entries(payload).filter(([_, value]) => value !== undefined)
        ) as CreateRequestPayload;

        console.log("🧹 Cleaned API Payload:", cleanPayload);
        console.log("📎 Attached Files:", files);

        const createdRequest = await requestsApi.createRequest(cleanPayload, files);

        console.log("✅ Request Created Successfully:", createdRequest);

        toast.success(t("requests.submitSuccess"));

        navigate(`/dashboard/request/${createdRequest.id}`);
      } catch (error: any) {
        console.error("❌ Request Submission Error:", error);
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
    subCategories: [],
    services: [],
    leadershipOptions,
    userRequests,

    isLoadingCategories,
    isLoadingSubCategories: false,
  };
};
