import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useI18n } from "@/i18n";
import { createMainCategoryFormSchema } from "./MainCategoryForm.schema";
import { MainCategoryFormData, UseMainCategoryFormReturn } from "./MainCategoryForm.types";
import { toast } from "sonner";
import { useCreateMainCategory, useUpdateMainCategory } from "../hooks/useCategories";
import { categoriesApi } from "../api/categories.api";

export const useMainCategoryForm = (): UseMainCategoryFormReturn => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const { t } = useI18n();

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [currentFormData, setCurrentFormData] = useState<MainCategoryFormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // React Query mutations
  const createMutation = useCreateMainCategory();
  const updateMutation = useUpdateMainCategory();

  const validationSchema = useMemo(() => createMainCategoryFormSchema(t), [t]);

  const {
    control,
    handleSubmit: rhfHandleSubmit,
    formState,
    setValue,
    watch,
    reset,
  } = useForm<MainCategoryFormData>({
    resolver: zodResolver(validationSchema),
    mode: "onChange",
    defaultValues: {
      nameAr: "",
      nameEn: "",
      descriptionAr: "",
      descriptionEn: "",
      isActive: true,
    },
  });

  const { isDirty } = formState;

  useEffect(() => {
    if (isEditMode) {
      fetchCategory();
    }
  }, [id, isEditMode]);

  const fetchCategory = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const category = await categoriesApi.getMainCategoryById(Number(id));
      reset({
        nameAr: category.nameAr,
        nameEn: category.nameEn || "",
        descriptionAr: category.descriptionAr || "",
        descriptionEn: category.descriptionEn || "",
        isActive: category.isActive,
      });
    } catch (error) {
      toast.error(t("categories.loadError"));
      navigate("/admin/main-categories");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = useCallback(async (data: MainCategoryFormData) => {
    setCurrentFormData(data);
    setIsConfirmDialogOpen(true);
  }, []);

  const handleConfirmSubmit = useCallback(async () => {
    if (!currentFormData) return;

    setIsConfirmDialogOpen(false);

    try {
      if (isEditMode && id) {
        await updateMutation.mutateAsync({
          id: Number(id),
          payload: {
            nameAr: currentFormData.nameAr,
            nameEn: currentFormData.nameEn,
            descriptionAr: currentFormData.descriptionAr,
            descriptionEn: currentFormData.descriptionEn,
            isActive: currentFormData.isActive,
          },
        });
      } else {
        await createMutation.mutateAsync({
          nameAr: currentFormData.nameAr,
          nameEn: currentFormData.nameEn,
          descriptionAr: currentFormData.descriptionAr,
          descriptionEn: currentFormData.descriptionEn,
        });
      }

      navigate("/admin/main-categories");
    } catch (error: any) {
      // Error toast is handled by the mutation hooks
      console.error("Error submitting form:", error);
    }
  }, [currentFormData, isEditMode, id, navigate, createMutation, updateMutation]);

  const handleCancel = useCallback(() => {
    navigate("/admin/main-categories");
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
