import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@/i18n";
import { createLeadershipFormSchema } from "./LeadershipForm.schema";
import { LeadershipFormData, UseLeadershipFormReturn } from "./LeadershipForm.types";
import { toast } from "sonner";
import {
  useLeadershipById,
  useCreateLeadership,
  useUpdateLeadership,
} from "@/features/admin/leadership/hooks/useLeadership";
import { useDepartmentsLookup } from "@/features/lookups/hooks/useLookups";
import type {
  CreateLeadershipPayload,
  UpdateLeadershipPayload,
} from "@/core/types/api";

export const useLeadershipForm = (): UseLeadershipFormReturn => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { t } = useI18n();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<LeadershipFormData | null>(null);

  // API hooks
  const { data: leadershipData, isLoading: isFetchingLeadership } = useLeadershipById(
    parseInt(id || "0")
  );
  const createLeadershipMutation = useCreateLeadership();
  const updateLeadershipMutation = useUpdateLeadership();
  const { data: departments = [] } = useDepartmentsLookup();

  const isLoading = isFetchingLeadership || createLeadershipMutation.isPending || updateLeadershipMutation.isPending;

  const validationSchema = useMemo(() => createLeadershipFormSchema(t), [t]);

  const {
    control,
    handleSubmit: rhfHandleSubmit,
    formState,
    setValue,
    watch,
    reset,
  } = useForm<LeadershipFormData>({
    resolver: zodResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      fullNameAr: "",
      fullNameEn: "",
      positionTitleAr: "",
      positionTitleEn: "",
      departmentId: undefined,
      isActive: true,
    },
  });

  const { isDirty } = formState;

  useEffect(() => {
    if (leadershipData && isEditMode) {
      reset({
        fullNameAr: leadershipData.fullNameAr,
        fullNameEn: leadershipData.fullNameEn || "",
        positionTitleAr: leadershipData.positionTitleAr,
        positionTitleEn: leadershipData.positionTitleEn || "",
        departmentId: leadershipData.departmentId,
        isActive: leadershipData.isActive,
      });
    }
  }, [leadershipData, isEditMode, reset]);

  const onSubmit = useCallback(async (data: LeadershipFormData) => {
    setCurrentFormData(data);
    setIsConfirmDialogOpen(true);
  }, []);

  const handleConfirmSubmit = useCallback(async () => {
    if (!currentFormData) return;

    setIsConfirmDialogOpen(false);

    try {
      if (isEditMode) {
        const payload: UpdateLeadershipPayload = {
          fullNameAr: currentFormData.fullNameAr,
          fullNameEn: currentFormData.fullNameEn || undefined,
          positionTitleAr: currentFormData.positionTitleAr,
          positionTitleEn: currentFormData.positionTitleEn || undefined,
          departmentId: currentFormData.departmentId,
          isActive: currentFormData.isActive,
        };
        await updateLeadershipMutation.mutateAsync({ id: parseInt(id!), payload });
        toast.success(t("leadership.updateSuccess"));
      } else {
        const payload: CreateLeadershipPayload = {
          fullNameAr: currentFormData.fullNameAr,
          fullNameEn: currentFormData.fullNameEn || undefined,
          positionTitleAr: currentFormData.positionTitleAr,
          positionTitleEn: currentFormData.positionTitleEn || undefined,
          departmentId: currentFormData.departmentId,
        };
        await createLeadershipMutation.mutateAsync(payload);
        toast.success(t("leadership.createSuccess"));
      }

      navigate("/admin/leadership");
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message || error?.message || "";
      const errorMessage = backendMessage || (isEditMode ? t("leadership.updateError") : t("leadership.createError"));
      toast.error(errorMessage);
    }
  }, [currentFormData, isEditMode, id, createLeadershipMutation, updateLeadershipMutation, navigate, t]);

  const handleCancel = useCallback(() => {
    navigate("/admin/leadership");
  }, [navigate]);

  return {
    control,
    handleSubmit: rhfHandleSubmit(onSubmit),
    formState,
    setValue,
    watch,
    reset,

    isEditMode,
    isLoading,
    isDirty,

    handleCancel,
    handleConfirmSubmit,

    isConfirmDialogOpen,
    setIsConfirmDialogOpen,

    currentFormData,

    // Departments for dropdown
    departments,
  };
};
