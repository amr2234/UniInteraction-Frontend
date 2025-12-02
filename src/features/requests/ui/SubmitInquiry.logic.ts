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

interface InquiryFormData {
  nameAr: string;
  nameEn: string;
  email: string;
  mobile: string;
  titleAr: string;
  titleEn: string;
  subjectAr: string;
  subjectEn: string;
  additionalDetailsAr: string;
  additionalDetailsEn: string;
  mainCategoryId: string;
  subCategoryId: string;
  serviceId: string;
}

export const useSubmitInquiry = () => {
  const navigate = useNavigate();
  const { formData, errors, setFormData, setErrors } = useForm<InquiryFormData>({
    nameAr: "",
    nameEn: "",
    email: "",
    mobile: "",
    titleAr: "",
    titleEn: "",
    subjectAr: "",
    subjectEn: "",
    additionalDetailsAr: "",
    additionalDetailsEn: "",
    mainCategoryId: "",
    subCategoryId: "",
    serviceId: ""
  });

  const { files, handleFileChange, removeFile } = useFileUpload();

  const getValidationRules = () => [
    requiredRule<InquiryFormData>('nameAr', formData.nameAr, "الاسم بالعربية مطلوب"),
    requiredRule<InquiryFormData>('email', formData.email, "البريد الإلكتروني مطلوب"),
    emailRule<InquiryFormData>('email', formData.email, "البريد الإلكتروني غير صحيح"),
    requiredRule<InquiryFormData>('mobile', formData.mobile, "رقم الجوال مطلوب"),
    phoneRule<InquiryFormData>('mobile', formData.mobile, "رقم الجوال غير صحيح"),
    requiredRule<InquiryFormData>('titleAr', formData.titleAr, "عنوان الاستفسار مطلوب"),
    requiredRule<InquiryFormData>('subjectAr', formData.subjectAr, "موضوع الاستفسار مطلوب"),
  ];

  const handleInputChange = (field: keyof InquiryFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
    
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
    }
    
    const rules = getValidationRules();
    const fieldError = validateField(field, value, rules);
    
    if (fieldError) {
      setErrors(prev => ({ ...prev, [field]: fieldError }));
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
      console.log("Submitting inquiry:", formData, files);
      navigate("/dashboard/track");
    } catch (error) {
      console.error("Failed to submit inquiry:", error);
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
