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

interface SuggestionFormData {
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

export const useSubmitSuggestion = () => {
  const navigate = useNavigate();
  const { formData, errors, setFormData, setErrors } = useForm<SuggestionFormData>({
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
    requiredRule<SuggestionFormData>('nameAr', formData.nameAr, "الاسم بالعربية مطلوب"),
    requiredRule<SuggestionFormData>('email', formData.email, "البريد الإلكتروني مطلوب"),
    emailRule<SuggestionFormData>('email', formData.email, "البريد الإلكتروني غير صحيح"),
    requiredRule<SuggestionFormData>('mobile', formData.mobile, "رقم الجوال مطلوب"),
    phoneRule<SuggestionFormData>('mobile', formData.mobile, "رقم الجوال غير صحيح"),
    requiredRule<SuggestionFormData>('titleAr', formData.titleAr, "عنوان الاقتراح مطلوب"),
    requiredRule<SuggestionFormData>('subjectAr', formData.subjectAr, "موضوع الاقتراح مطلوب"),
  ];

  const handleInputChange = (field: keyof SuggestionFormData, value: string) => {
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
      console.log("Submitting suggestion:", formData, files);
      navigate("/dashboard/track");
    } catch (error) {
      console.error("Failed to submit suggestion:", error);
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
