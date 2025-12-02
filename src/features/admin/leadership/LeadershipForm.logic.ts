import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useForm } from "@/core/utils/formUtils";
import { 
  validateForm as validateFormUtil, 
  validateField,
  requiredRule,
  emailRule
} from "@/core/utils/validation";

interface LeadershipFormData {
  id?: number;
  nameAr: string;
  nameEn: string;
  positionAr: string;
  positionEn: string;
  descriptionAr: string;
  descriptionEn: string;
  email: string;
  phone: string;
  imageUrl: string;
  displayOrder: number;
  isActive: boolean;
}

export const useLeadershipForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  const { formData, errors, setFormData, setErrors } = useForm<LeadershipFormData>({
    nameAr: "",
    nameEn: "",
    positionAr: "",
    positionEn: "",
    descriptionAr: "",
    descriptionEn: "",
    email: "",
    phone: "",
    imageUrl: "",
    displayOrder: 1,
    isActive: true
  });

  useEffect(() => {
    if (isEditMode) {
      fetchLeader();
    }
  }, [id]);

  const fetchLeader = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const mockLeader = {
        id: parseInt(id!),
        nameAr: "د. عبدالله محمد الغامدي",
        nameEn: "Dr. Abdullah Mohammed Al-Ghamdi",
        positionAr: "رئيس الجامعة",
        positionEn: "University President",
        descriptionAr: "يتمتع بخبرة واسعة في التعليم العالي وإدارة الجامعات",
        descriptionEn: "Has extensive experience in higher education and university management",
        email: "president@sru.edu.sa",
        phone: "+966 11 1234567",
        imageUrl: "https://via.placeholder.com/150",
        displayOrder: 1,
        isActive: true,
      };
      setFormData(mockLeader);
    } catch (error) {
      toast.error("فشل تحميل بيانات القيادة");
      navigate("/admin/leadership");
    } finally {
      setIsLoading(false);
    }
  };

  const getValidationRules = () => {
    const rules = [
      requiredRule<LeadershipFormData>('nameAr', formData.nameAr, "الاسم بالعربية مطلوب"),
      requiredRule<LeadershipFormData>('positionAr', formData.positionAr, "المسمى الوظيفي بالعربية مطلوب"),
    ];
    
    if (formData.email && formData.email.trim()) {
      rules.push(emailRule<LeadershipFormData>('email', formData.email, "البريد الإلكتروني غير صحيح"));
    }
    
    return rules;
  };

  const handleInputChange = (field: keyof LeadershipFormData, value: string | number | boolean) => {
    setFormData({ ...formData, [field]: value });
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
    
    if (typeof value === 'string' && field !== 'nameEn' && field !== 'positionEn' && field !== 'descriptionAr' && field !== 'descriptionEn' && field !== 'phone' && field !== 'imageUrl') {
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
    
    if (!formData.displayOrder || formData.displayOrder < 1) {
      newErrors.displayOrder = "ترتيب العرض مطلوب ويجب أن يكون أكبر من صفر";
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
        toast.success(`تم إضافة "${formData.nameAr}" بنجاح`, {
          duration: 4000,
        });
      } else {
        await new Promise((resolve) => setTimeout(resolve, 500));
        toast.success(`تم تحديث بيانات "${formData.nameAr}" بنجاح`, {
          duration: 4000,
        });
      }

      navigate("/admin/leadership");
    } catch (error) {
      toast.error("حدث خطأ. يرجى المحاولة مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/leadership");
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
