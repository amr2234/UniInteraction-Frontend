import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useUserRole, useHasPermission } from "@/core/hooks";
import { PERMISSIONS } from "@/core/constants/permissions";
import { RequestStatus } from "@/core/constants/requestStatuses";
import { useRequestDetails, useUpdateRequestStatus } from "@/features/requests/hooks/useRequests";
import {
  UserRequestDetailsDto,
  RequestTimelineItem,
  RequestMessage,
  RequestAttachment
} from "@/features/requests/types";

export const useRequestDetailsLogic = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [newMessage, setNewMessage] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [visitDateTime, setVisitDateTime] = useState("");
  const [visitLocation, setVisitLocation] = useState("");
  const [responseText, setResponseText] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const { isAdmin, isEmployee, isUser, roleIds: userRoleIds } = useUserRole();

  const canAssignRequests = useHasPermission(PERMISSIONS.REQUESTS_ASSIGN);
  
  // Debug: Log permission check
  console.log('🔍 RequestDetails DEBUG - canAssignRequests:', canAssignRequests);
  console.log('🔍 RequestDetails DEBUG - isAdmin:', isAdmin);
  console.log('🔍 RequestDetails DEBUG - User role IDs:', userRoleIds);
  
  // Mock employees for assignment
  const mockEmployees = [
    { id: 1, nameAr: "أحمد محمد", nameEn: "Ahmed Mohammed" },
    { id: 2, nameAr: "فاطمة علي", nameEn: "Fatima Ali" },
    { id: 3, nameAr: "محمد خالد", nameEn: "Mohammed Khaled" },
    { id: 4, nameAr: "نورة عبدالله", nameEn: "Noura Abdullah" },
  ];
  
  // Extended mock data for the request with UI-specific properties
  const requestMock = {
    id: id ? parseInt(id, 10) || 1 : 1,
    requestNumber: id || "SG-2025-001234",
    nameAr: "أحمد محمد السعيد",
    nameEn: "Ahmed Mohammed Alsaeed",
    email: "ahmed.alsaeed@example.com",
    mobile: "+966501234567",
    titleAr: "تطوير خدمات المكتبة الرقمية",
    titleEn: "Development of Digital Library Services",
    subjectAr: "أقترح تطوير خدمات المكتبة الرقمية من خلال إضافة ميزات جديدة تسهل على الطلاب الوصول إلى المراجع والكتب الإلكترونية. يتضمن المقترح إضافة نظام بحث متقدم، وتطبيق جوال للمكتبة، وخدمة إعارة إلكترونية محسنة.",
    subjectEn: "I propose to develop digital library services by adding new features that facilitate students' access to electronic references and books. The proposal includes adding an advanced search system, a mobile app for the library, and an enhanced electronic lending service.",
    additionalDetailsAr: "هذا المقترح سيساعد في تحسين تجربة الطالب بشكل كبير",
    additionalDetailsEn: "This proposal will greatly improve the student experience",
    requestTypeId: 4, // 1: Complaint, 2: Inquiry, 3: Suggestion, 4: Visit
    statusId: RequestStatus.RECEIVED, // Change to REPLIED to show response section
    status: "تم الرد",
    statusColor: "bg-blue-100 text-blue-700",
    type: "استفسار",
    date: "2025-01-14",
    department: "تقنية المعلومات",
    description: "أقترح تطوير خدمات المكتبة الرقمية من خلال إضافة ميزات جديدة تسهل على الطلاب الوصول إلى المراجع والكتب الإلكترونية. يتضمن المقترح إضافة نظام بحث متقدم، وتطبيق جوال للمكتبة، وخدمة إعارة إلكترونية محسنة.",
    attachments: [
      { name: "مقترح_المكتبة_الرقمية.pdf", size: "2.3 MB" },
    ],
    requestCategoryId: 1,
    mainCategoryId: 1,
    subCategoryId: 2,
    serviceId: 2,
    submittedChannel: "البوابة الإلكترونية",
    createdAt: "2025-01-14T10:30:00",
    // Employee response data
    employeeResponse: {
      responseText: "شكراً على استفساركم. بخصوص خدمات المكتبة الرقمية، نود إعلامكم بأنه يمكنكم الوصول إلى جميع المراجع والكتب الإلكترونية من خلال البوابة الإلكترونية. كما يمكنكم استخدام خدمة البحث المتقدم للعثور على المراجع المطلوبة. في حال واجهتم أي مشكلة، يرجى التواصل مع فريق الدعم الفني.",
      respondedBy: "محمد أحمد - قسم تقنية المعلومات",
      respondedAt: "2025-01-15 10:30 ص",
      responseAttachments: [
        { name: "دليل_استخدام_المكتبة.pdf", size: "1.5 MB" },
      ],
    },
    // Visit scheduling data (for visit requests)
    visitSchedule: {
      visitDate: "2025-01-20",
      visitTime: "10:00 ص",
      visitLocation: "مكتب العميد - الدور الثالث - المبنى الإداري",
      scheduledBy: "فاطمة علي - مكتب العميد",
      scheduledAt: "2025-01-15 02:00 م",
    },
  };

  // Timeline will be constructed in the UI component using i18n translations

  const messages: RequestMessage[] = [
    {
      sender: "فريق تقنية المعلومات",
      message: "شكراً لك على مقترحك القيم. نحن نقدر مشاركتك في تطوير خدماتنا الرقمية. سيتم دراسة المقترح من قبل الفريق المختص وسنعود إليك خلال 5 أيام عمل.",
      date: "2025-01-14 03:45 م",
      isAdmin: true,
    },
    {
      sender: "أنت",
      message: "شكراً لكم. هل يمكنني معرفة الإطار الزمني المتوقع للتنفيذ في حال تمت الموافقة؟",
      date: "2025-01-15 09:20 ص",
      isAdmin: false,
    },
  ];

  const requestAttachments: RequestAttachment[] = [
    { name: "مقترح_المكتبة_الرقمية.pdf", size: "2.3 MB" },
  ];

  // Handle status change for employees
  const handleStatusChange = (newStatusId: number) => {
    // In a real implementation, this would call the API
    // Here we would call useUpdateRequestStatus hook
    toast.success('تم تحديث حالة الطلب بنجاح');
  };
  
  // Handle employee response submission
  const handleSubmitResponse = () => {
    if ((requestMock.requestTypeId === 1 || requestMock.requestTypeId === 2) && responseText.trim()) {
      // Handle complaint or inquiry response
      toast.success('تم إرسال الرد بنجاح');
      setResponseText("");
    } else if (requestMock.requestTypeId === 4 && visitDateTime && visitLocation) {
      // Handle visit scheduling
      toast.success('تم تحديد موعد الزيارة بنجاح');
      setVisitDateTime("");
      setVisitLocation("");
    }
  };
  
  // Handle feedback submission for users
  const handleSubmitFeedback = () => {
    if (rating > 0 && feedback.trim()) {
      toast.success('تم إرسال التقييم بنجاح');
      setRating(0);
      setFeedback("");
    }
  };
  
  // Handle file attachment
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...files]);
    }
  };
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Handle sending message
      setNewMessage("");
    }
  };

  const canEditRequest = () => {
    return ((isAdmin) || 
      (isEmployee) || 
      (isUser && requestMock.statusId === RequestStatus.RECEIVED));
  };

  const handleAssignEmployee = (employeeId: number) => {
    // TODO: Implement API call to assign employee
    toast.success('تم تعيين الموظف بنجاح');
    setSelectedEmployeeId(null);
  };

  return {
    // State
    newMessage,
    statusNote,
    visitDateTime,
    visitLocation,
    responseText,
    attachments,
    rating,
    feedback,
    requestMock,
    messages,
    requestAttachments: requestMock.attachments,
    selectedEmployeeId,
    mockEmployees,
    
    // Constants
    RequestStatus,
    
    // Role checks
    isAdmin,
    isEmployee,
    isUser,
    canEditRequest,
    canAssignRequests,
    
    // Handlers
    setNewMessage,
    setStatusNote,
    setVisitDateTime,
    setVisitLocation,
    setResponseText,
    setAttachments,
    setRating,
    setFeedback,
    setSelectedEmployeeId,
    handleStatusChange,
    handleSubmitResponse,
    handleSubmitFeedback,
    handleFileChange,
    handleSendMessage,
    handleAssignEmployee,
    navigate
  };
};