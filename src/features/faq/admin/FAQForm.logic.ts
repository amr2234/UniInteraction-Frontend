import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "@/core/utils/formUtils";
import { 
  validateForm as validateFormUtil, 
  validateField,
  requiredRule,
  minLengthRule
} from "@/core/utils/validation";

interface FAQFormData {
  id?: number;
  questionAr: string;
  questionEn: string;
  answerAr: string;
  answerEn: string;
  order: number;
  isActive: boolean;
}

export const useFAQForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  const { formData, errors, setFormData, setErrors } = useForm<FAQFormData>({
    questionAr: "",
    questionEn: "",
    answerAr: "",
    answerEn: "",
    order: 1,
    isActive: true
  });

  useEffect(() => {
    if (isEditMode) {
      fetchFaq();
    }
  }, [id]);

  const fetchFaq = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockFaq = {
        id: parseInt(id!),
        questionAr: "كيف يمكنني تقديم اقتراح؟",
        questionEn: "How can I submit a suggestion?",
        answerAr: "يمكنك تقديم اقتراح من خلال الذهاب إلى قسم الاقتراحات وملء النموذج المطلوب.",
        answerEn: "You can submit a suggestion by going to the suggestions section and filling out the required form.",
        order: 1,
        isActive: true,
      };
      setFormData(mockFaq);
    } catch (error) {
      toast.error("فشل تحميل بيانات السؤال");
      navigate("/admin/faqs");
    } finally {
      setIsLoading(false);
    }
  };

  const getValidationRules = () => [
    requiredRule<FAQFormData>('questionAr', formData.questionAr, "السؤال بالعربية مطلوب"),
    requiredRule<FAQFormData>('answerAr', formData.answerAr, "الإجابة بالعربية مطلوبة"),
  ];

  const handleInputChange = (field: keyof FAQFormData, value: string | number | boolean) => {
    setFormData({ ...formData, [field]: value });
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
    
    if (typeof value === 'string' && field !== 'questionEn' && field !== 'answerEn') {
      const rules = getValidationRules();
      const fieldError = validateField(field, value, rules);
      
      if (fieldError) {
        setErrors(prev => ({ ...prev, [field]: fieldError }));
      }
    }
  };

  const validateFormFields = (): boolean => {
    const rules = getValidationRules();
    const newErrors = validateFormUtil(rules);
    
    if (!formData.order || formData.order < 1) {
      newErrors.order = "ترتيب العرض مطلوب ويجب أن يكون أكبر من صفر";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFormFields()) {
      return;
    }
    
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmSubmit = async () => {
    setIsLoading(true);
    setIsConfirmDialogOpen(false);

    try {
      if (!isEditMode) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast.success(`تم إضافة السؤال "${formData.questionAr}" بنجاح`, {
          duration: 4000,
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast.success(`تم تحديث السؤال "${formData.questionAr}" بنجاح`, {
          duration: 4000,
        });
      }

      navigate("/admin/faqs");
    } catch (error) {
      toast.error("حدث خطأ. يرجى المحاولة مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/faqs");
  };

  return {
    formData,
    errors,
    isLoading,
    isEditMode,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    handleInputChange,
    handleSubmit,
    handleConfirmSubmit,
    handleCancel
  };
};
