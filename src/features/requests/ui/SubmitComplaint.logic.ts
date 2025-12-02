import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "@/core/utils/formUtils";
import { useFileUpload } from "@/core/hooks/useFileUpload";
import { useUserProfile } from "@/features/auth/hooks/useAuth";
import { requestsApi } from "@/features/requests/api/requests.api";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { 
  validateForm as validateFormUtil, 
  validateField,
  requiredRule, 
  emailRule,
  phoneRule
} from "@/core/utils/validation";

interface ComplaintFormData {
  nameAr: string;
  nameEn: string;
  email: string;
  mobile: string;
  titleAr: string;
  titleEn: string;
  subjectAr: string;
  subjectEn: string;
  mainCategoryId: string;
  subCategoryId: string;
  serviceId: string;
  noteAr: string;
  noteEn: string;
}

export const useSubmitComplaint = () => {
  const navigate = useNavigate();
  const { t } = useI18n();
  const userProfile = useUserProfile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { formData, errors, setFormData, setErrors } = useForm<ComplaintFormData>({
    nameAr: "",
    nameEn: "",
    email: "",
    mobile: "",
    titleAr: "",
    titleEn: "",
    subjectAr: "",
    subjectEn: "",
    mainCategoryId: "",
    subCategoryId: "",
    serviceId: "",
    noteAr: "",
    noteEn: ""
  });

  // Load user profile data on mount
  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        nameAr: userProfile.nameAr || "",
        nameEn: userProfile.nameEn || "",
        email: userProfile.email || "",
        mobile: userProfile.mobile || "",
      }));
    }
  }, [userProfile]);

  const { files, handleFileChange, removeFile } = useFileUpload();

  const getValidationRules = () => [
    // Personal info is auto-filled from profile, no validation needed
    requiredRule<ComplaintFormData>('titleAr', formData.titleAr, "عنوان الشكوى مطلوب"),
    requiredRule<ComplaintFormData>('subjectAr', formData.subjectAr, "موضوع الشكوى مطلوب"),
  ];

  const handleInputChange = (field: keyof ComplaintFormData, value: string) => {
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
      toast.error(t('validation.pleaseFixErrors'));
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      // Prepare the request payload
      const payload = {
        userId: userProfile?.id || undefined,
        nameAr: formData.nameAr,
        nameEn: formData.nameEn || undefined,
        email: formData.email,
        mobile: formData.mobile,
        titleAr: formData.titleAr,
        titleEn: formData.titleEn || undefined,
        subjectAr: formData.subjectAr,
        subjectEn: formData.subjectEn || undefined,
        requestTypeId: 1, // 1 = Complaint (شكوى)
        mainCategoryId: formData.mainCategoryId ? parseInt(formData.mainCategoryId) : undefined,
        // Note fields are sent as additionalDetailsAr/En to match backend
        additionalDetailsAr: formData.noteAr || undefined,
        additionalDetailsEn: formData.noteEn || undefined,
      };

      // Create the request
      const createdRequest = await requestsApi.createRequest(payload);

      // Upload attachments if any
      if (files.length > 0) {
        try {
          await requestsApi.uploadRequestAttachments(createdRequest.id, files);
        } catch (uploadError) {
          console.error('Failed to upload attachments:', uploadError);
          toast.warning(t('requests.requestCreatedButAttachmentsFailed') || 'Request created but some attachments failed to upload');
        }
      }

      toast.success(t('requests.complaintSubmittedSuccess') || 'Complaint submitted successfully');
      navigate("/dashboard/track");
    } catch (error: any) {
      console.error("Failed to submit complaint:", error);
      toast.error(error?.message || t('requests.submitError') || 'Failed to submit complaint');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/dashboard");
  };

  return {
    formData,
    errors,
    files,
    isSubmitting,
    handleInputChange,
    handleFileChange,
    removeFile,
    handleSubmit,
    handleCancel
  };
};
