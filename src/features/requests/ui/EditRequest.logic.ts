import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useUserRole } from "@/core/hooks";
import { RequestStatus, REQUEST_STATUS_NAMES_AR } from "@/core/constants/requestStatuses";
import { Badge } from "@/components/ui/badge";
import {
  UserRequestDetailsDto,
  RequestType,
  RequestCategory,
  MainCategory,
  SubCategory,
  Service,
  UniversityLeadership
} from "@/features/requests/types";

export const useEditRequestLogic = () => {
  const navigate = useNavigate();
  const { requestNumber } = useParams();
  const { isAdmin, isEmployee, isUser } = useUserRole();

  const [isLoading, setIsLoading] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [formData, setFormData] = useState<UserRequestDetailsDto | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Lookup data
  const [requestTypes] = useState<RequestType[]>([
    { id: 1, nameAr: "استفسار" },
    { id: 2, nameAr: "شكوى" },
    { id: 3, nameAr: "مقترح" },
    { id: 4, nameAr: "حجز زيارة" },
  ]);

  const [requestCategories] = useState<RequestCategory[]>([
    { id: 1, nameAr: "أكاديمي" },
    { id: 2, nameAr: "إداري" },
    { id: 3, nameAr: "مالي" },
    { id: 4, nameAr: "تقني" },
  ]);

  const [mainCategories] = useState<MainCategory[]>([
    { id: 1, nameAr: "الشؤون الأكاديمية" },
    { id: 2, nameAr: "شؤون الطلاب" },
  ]);

  const [subCategories] = useState<SubCategory[]>([
    { id: 1, nameAr: "القبول والتسجيل", mainCategoryId: 1 },
    { id: 2, nameAr: "الامتحانات", mainCategoryId: 1 },
    { id: 3, nameAr: "الأنشطة الطلابية", mainCategoryId: 2 },
  ]);

  const [services] = useState<Service[]>([
    { id: 1, nameAr: "طلب إفادة تخرج", subCategoryId: 1 },
    { id: 2, nameAr: "طلب كشف درجات", subCategoryId: 2 },
  ]);

  const [leadership] = useState<UniversityLeadership[]>([
    { id: 1, nameAr: "د. عبدالله محمد الغامدي", positionAr: "رئيس الجامعة" },
    { id: 2, nameAr: "د. فاطمة أحمد العمري", positionAr: "وكيلة الجامعة للشؤون الأكاديمية" },
  ]);

  const [filteredSubCategories, setFilteredSubCategories] = useState<SubCategory[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);

  // Mock data
  const mockRequestData: UserRequestDetailsDto = {
    id: 1,
    requestNumber: requestNumber || "SG-2025-001234",
    nameAr: "أحمد محمد السعيد",
    nameEn: "Ahmed Mohammed Alsaeed",
    email: "ahmed.alsaeed@example.com",
    mobile: "+966501234567",
    titleAr: "استفسار عن كشف الدرجات",
    titleEn: "Inquiry about transcript",
    subjectAr: "أرغب في الحصول على كشف درجات معتمد",
    subjectEn: "I would like to get an official transcript",
    additionalDetailsAr: "أحتاج الكشف للتقديم على وظيفة",
    additionalDetailsEn: "I need it for job application",
    requestTypeId: 1,
    statusId: RequestStatus.RECEIVED,
    requestCategoryId: 1,
    mainCategoryId: 1,
    subCategoryId: 2,
    serviceId: 2,
    universityLeadershipId: 1,
    submittedChannel: "البوابة الإلكترونية",
    createdAt: "2025-01-15T10:30:00",
  };

  useEffect(() => {
    fetchRequestData();
  }, [requestNumber]);

  useEffect(() => {
    if (formData?.mainCategoryId) {
      const filtered = subCategories.filter(
        (sub) => sub.mainCategoryId === formData.mainCategoryId
      );
      setFilteredSubCategories(filtered);
    } else {
      setFilteredSubCategories([]);
    }
  }, [formData?.mainCategoryId, subCategories]);

  useEffect(() => {
    if (formData?.subCategoryId) {
      const filtered = services.filter(
        (service) => service.subCategoryId === formData.subCategoryId
      );
      setFilteredServices(filtered);
    } else {
      setFilteredServices([]);
    }
  }, [formData?.subCategoryId, services]);

  const fetchRequestData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFormData(mockRequestData);
    } catch (error) {
      toast.error("حدث خطأ أثناء تحميل بيانات الطلب");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof UserRequestDetailsDto, value: any) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
      
      // Clear error for this field if it exists
      if (formErrors[field]) {
        setFormErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[field];
          return newErrors;
        });
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    
    if (!formData) return false;
    
    if (!formData.titleAr?.trim()) {
      errors.titleAr = "عنوان الطلب مطلوب";
    }
    
    if (!formData.subjectAr?.trim()) {
      errors.subjectAr = "موضوع الطلب مطلوب";
    }
    
    if (!formData.requestTypeId) {
      errors.requestTypeId = "نوع الطلب مطلوب";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // toast.success("تم حفظ التعديلات بنجاح");
      navigate(`/dashboard/request/${formData?.requestNumber}`);
    } catch (error) {
      // toast.error("حدث خطأ. يرجى المحاولة مرة أخرى");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (statusId: number) => {
    // Map request status IDs to badge styles
    const statusStyles: Record<number, { className: string }> = {
      [RequestStatus.RECEIVED]: { className: "bg-blue-500" },
      [RequestStatus.UNDER_REVIEW]: { className: "bg-yellow-500" },
      [RequestStatus.REPLIED]: { className: "bg-green-500" },
      [RequestStatus.CLOSED]: { className: "bg-gray-500" },
    };

    const style = statusStyles[statusId] || { className: "bg-gray-400" };
    const label = REQUEST_STATUS_NAMES_AR[statusId as RequestStatus] || "غير معروف";
    return { className: style.className, label };
  };

  const isVisitRequest = formData?.requestTypeId === 4;

  // Check if user can edit the request based on role and status
  const canEditRequest = isAdmin || isEmployee || (isUser && formData?.statusId === RequestStatus.RECEIVED);

  return {
    // State
    isLoading,
    isConfirmDialogOpen,
    formData,
    formErrors,
    requestTypes,
    requestCategories,
    mainCategories,
    subCategories,
    services,
    leadership,
    filteredSubCategories,
    filteredServices,
    
    // Role checks
    isAdmin,
    isEmployee,
    isUser,
    isVisitRequest,
    canEditRequest,
    
    // Utilities
    toast,
    
    // Handlers
    setIsLoading,
    setIsConfirmDialogOpen,
    setFormData,
    setFormErrors,
    handleInputChange,
    handleSubmit,
    getStatusBadge,
    navigate
  };
};