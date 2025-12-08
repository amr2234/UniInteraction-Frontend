import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@/i18n";
import { createDepartmentFormSchema } from "./DepartmentForm.schema";
import { DepartmentFormData, UseDepartmentFormReturn } from "./DepartmentForm.types";
import {
  useDepartmentById,
  useCreateDepartment,
  useUpdateDepartment,
} from "../hooks/useDepartments";
import {
  CreateDepartmentDto,
  UpdateDepartmentDto,
} from "../api/departments.api";
import { toast } from "sonner";

export const useDepartmentForm = (): UseDepartmentFormReturn => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { t } = useI18n();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<DepartmentFormData | null>(null);

  const validationSchema = useMemo(() => createDepartmentFormSchema(t), [t]);

  const {
    control,
    handleSubmit: rhfHandleSubmit,
    formState,
    setValue,
    watch,
    reset,
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      nameAr: "",
      nameEn: "",
      code: "",
      descriptionAr: "",
      descriptionEn: "",
      isActive: true,
    },
  });

  const { isDirty } = formState;

  const { data: departmentData, isLoading: isFetchingDepartment } = useDepartmentById(
    parseInt(id || "0")
  );
  const createDepartmentMutation = useCreateDepartment();
  const updateDepartmentMutation = useUpdateDepartment();

  const isLoading = isFetchingDepartment || createDepartmentMutation.isPending || updateDepartmentMutation.isPending;

  useEffect(() => {
    if (departmentData && isEditMode) {
      reset({
        nameAr: departmentData.nameAr,
        nameEn: departmentData.nameEn || "",
        code: departmentData.code || "",
        descriptionAr: departmentData.descriptionAr || "",
        descriptionEn: departmentData.descriptionEn || "",
        isActive: departmentData.isActive,
      });
    }
  }, [departmentData, isEditMode, reset]);

  const onSubmit = useCallback(async (data: DepartmentFormData) => {
    setCurrentFormData(data);
    setIsConfirmDialogOpen(true);
  }, []);

  const handleConfirmSubmit = useCallback(async () => {
    if (!currentFormData) return;

    setIsConfirmDialogOpen(false);

    try {
      if (isEditMode) {
        const payload: UpdateDepartmentDto = {
          nameAr: currentFormData.nameAr,
          nameEn: currentFormData.nameEn || undefined,
          code: currentFormData.code || undefined,
          descriptionAr: currentFormData.descriptionAr || undefined,
          descriptionEn: currentFormData.descriptionEn || undefined,
          isActive: currentFormData.isActive,
        };
        await updateDepartmentMutation.mutateAsync({ id: parseInt(id!), payload });
        toast.success(t("departments.updateSuccess"));
      } else {
        const payload: CreateDepartmentDto = {
          nameAr: currentFormData.nameAr,
          nameEn: currentFormData.nameEn || undefined,
          code: currentFormData.code || undefined,
          descriptionAr: currentFormData.descriptionAr || undefined,
          descriptionEn: currentFormData.descriptionEn || undefined,
        };
        await createDepartmentMutation.mutateAsync(payload);
        toast.success(t("departments.createSuccess"));
      }

      navigate("/admin/departments");
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message || error?.message || "";

      let errorMessage;
      if (
        backendMessage.toLowerCase().includes("code") &&
        (backendMessage.toLowerCase().includes("already exists") ||
          backendMessage.toLowerCase().includes("already in use") ||
          backendMessage.toLowerCase().includes("موجود"))
      ) {
        errorMessage = t("departments.codeAlreadyExists");
      } else if (backendMessage) {
        errorMessage = backendMessage;
      } else {
        errorMessage = isEditMode ? t("departments.updateError") : t("departments.createError");
      }

      toast.error(errorMessage);
    }
  }, [currentFormData, isEditMode, id, createDepartmentMutation, updateDepartmentMutation, navigate, t]);

  const handleCancel = useCallback(() => {
    navigate("/admin/departments");
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
  };
};
