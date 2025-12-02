import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "@/core/utils/formUtils";
import { useFileUpload } from "@/core/hooks/useFileUpload";
import { 
  validateForm as validateFormUtil, 
  validateField,
  requiredRule, 
  emailRule,
  phoneRule
} from "@/core/utils/validation";

interface BookVisitFormData {
  nameAr: string;
  nameEn: string;
  email: string;
  mobile: string;
  leadershipId: string;
  visitReasonAr: string;
  visitReasonEn: string;
  visitStartAt: string;
  visitEndAt: string;
  isRelatedToPrevious: boolean;
  relatedRequestNumber: string;
}

export const useBookVisit = () => {
  const navigate = useNavigate();
  const { formData, errors, setFormData, setErrors } = useForm<BookVisitFormData>({
    nameAr: "",
    nameEn: "",
    email: "",
    mobile: "",
    leadershipId: "",
    visitReasonAr: "",
    visitReasonEn: "",
    visitStartAt: "",
    visitEndAt: "",
    isRelatedToPrevious: false,
    relatedRequestNumber: ""
  });

  const { files, handleFileChange, removeFile } = useFileUpload();

  const getValidationRules = () => [
    requiredRule<BookVisitFormData>('nameAr', formData.nameAr, "الاسم بالعربية مطلوب"),
    requiredRule<BookVisitFormData>('email', formData.email, "البريد الإلكتروني مطلوب"),
    emailRule<BookVisitFormData>('email', formData.email, "البريد الإلكتروني غير صحيح"),
    requiredRule<BookVisitFormData>('mobile', formData.mobile, "رقم الجوال مطلوب"),
    phoneRule<BookVisitFormData>('mobile', formData.mobile, "رقم الجوال غير صحيح"),
    requiredRule<BookVisitFormData>('leadershipId', formData.leadershipId, "اختر القيادة الجامعية"),
    requiredRule<BookVisitFormData>('visitReasonAr', formData.visitReasonAr, "سبب الزيارة مطلوب"),
    requiredRule<BookVisitFormData>('visitStartAt', formData.visitStartAt, "تاريخ بداية الزيارة مطلوب"),
    requiredRule<BookVisitFormData>('visitEndAt', formData.visitEndAt, "تاريخ نهاية الزيارة مطلوب"),
  ];

  const handleInputChange = (field: keyof BookVisitFormData, value: string | boolean) => {
    setFormData({ ...formData, [field]: value });
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
    
    if (typeof value === 'string') {
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateFormFields()) {
      return;
    }

    try {
      console.log("Booking visit:", formData, files);
      navigate("/dashboard/track");
    } catch (error) {
      console.error("Failed to book visit:", error);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return {
    formData,
    errors,
    files,
    handleInputChange,
    handleFileChange,
    removeFile,
    handleSubmit,
    handleCancel
  };
};
