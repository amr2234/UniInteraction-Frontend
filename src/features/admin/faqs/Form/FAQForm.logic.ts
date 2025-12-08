import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createFAQFormSchema, type FAQFormSchema } from "./FAQForm.schema";
import { useCreateFaq, useUpdateFaq, useFaqById } from "../hooks/useFaqs";
import { useI18n } from "@/i18n";
import type { CreateFaqPayload, UpdateFaqPayload } from "@/core/types/api";

export const useFAQForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useI18n();
  const isEditMode = !!id;
  const faqId = id ? parseInt(id) : 0;
  
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  // Create form with Zod validation
  const {
    control,
    handleSubmit: handleFormSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<FAQFormSchema>({
    resolver: zodResolver(createFAQFormSchema(t)),
    mode: "onChange", // Enable live validation
    defaultValues: {
      questionAr: "",
      questionEn: "",
      answerAr: "",
      answerEn: "",
      order: 1,
      isActive: true,
    },
  });

  // Fetch FAQ data if in edit mode
  const { data: faqData, isLoading: isFetchingFaq } = useFaqById(faqId);
  const createFaqMutation = useCreateFaq();
  const updateFaqMutation = useUpdateFaq();

  useEffect(() => {
    if (isEditMode && faqData) {
      reset({
        questionAr: faqData.questionAr,
        questionEn: faqData.questionEn || "",
        answerAr: faqData.answerAr,
        answerEn: faqData.answerEn || "",
        order: faqData.order,
        isActive: faqData.isActive,
      });
    }
  }, [faqData, isEditMode, reset]);

  const handleSubmit = handleFormSubmit(() => {
    setIsConfirmDialogOpen(true);
  });

  const handleConfirmSubmit = async () => {
    setIsConfirmDialogOpen(false);
    const formData = watch();

    try {
      if (!isEditMode) {
        // Create new FAQ
        const payload: CreateFaqPayload = {
          questionAr: formData.questionAr,
          questionEn: formData.questionEn || undefined,
          answerAr: formData.answerAr,
          answerEn: formData.answerEn || undefined,
          order: formData.order,
        };
        await createFaqMutation.mutateAsync(payload);
      } else {
        // Update existing FAQ
        const payload: UpdateFaqPayload = {
          questionAr: formData.questionAr,
          questionEn: formData.questionEn || undefined,
          answerAr: formData.answerAr,
          answerEn: formData.answerEn || undefined,
          order: formData.order,
          isActive: formData.isActive,
        };
        await updateFaqMutation.mutateAsync({ id: faqId, payload });
      }

      navigate("/admin/faqs");
    } catch (error) {
      // Error handled by hooks
    }
  };

  const handleCancel = () => {
    navigate("/admin/faqs");
  };

  return {
    control,
    formState: { errors, isSubmitting },
    isLoading: isFetchingFaq || createFaqMutation.isPending || updateFaqMutation.isPending,
    isEditMode,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    handleSubmit,
    handleConfirmSubmit,
    handleCancel,
    formData: watch(),
  };
};
