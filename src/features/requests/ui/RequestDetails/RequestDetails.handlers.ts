import { toast } from "sonner";
import { RequestStatus } from "@/core/constants/requestStatuses";
import { RequestType } from "@/core/constants/requestTypes";
import { VisitStatus } from "@/core/constants/visitStatuses";
import { CreateRequestPayload, RequestAttachment } from "@/core/types/api";
import { requestsApi } from "@/features/requests/api/requests.api";
import { authApi } from "@/features/auth/api/auth.api";
import {
  ReactivateFormData,
  ReactivateFormErrors,
  validateReactivateField,
  validateReactivateForm,
} from "./RequestDetails.validation";

interface CreateHandlersParams {
  id: string | undefined;
  request: any;
  isAdmin: boolean;
  isEmployee: boolean;
  isSuperAdmin: boolean;
  rating: number;
  feedback: string;
  responseText: string;
  attachments: File[];
  visitDateTime: string;
  selectedLeadershipId: number | null;
  newMessage: string;
  convertDepartmentId: number | null;
  selectedComplaintId: number | null;
  wantsToRemoveLink: boolean;
  reactivateTitleAr: string;
  reactivateTitleEn: string;
  reactivateSubjectAr: string;
  reactivateSubjectEn: string;
  setResponseText: (value: string) => void;
  setAttachments: (value: File[] | ((prev: File[]) => File[])) => void;
  setRating: (value: number) => void;
  setFeedback: (value: string) => void;
  setIsRatingDialogOpen: (value: boolean) => void;
  setNewMessage: (value: string) => void;
  setSelectedLeadershipId: (value: number | null) => void;
  setVisitDateTime: (value: string) => void;
  setIsDeleteDialogOpen: (value: boolean) => void;
  setIsAssignDialogOpen: (value: boolean) => void;
  setIsSubmitConfirmDialogOpen: (value: boolean) => void;
  setIsConvertToComplaintDialogOpen: (value: boolean) => void;
  setConvertDepartmentId: (value: number | null) => void;
  setIsLinkComplaintDialogOpen: (value: boolean) => void;
  setSelectedComplaintId: (value: number | null) => void;
  setWantsToRemoveLink: (value: boolean) => void;
  setIsReactivateDialogOpen: (value: boolean) => void;
  setReactivateTitleAr: (value: string) => void;
  setReactivateTitleEn: (value: string) => void;
  setReactivateSubjectAr: (value: string) => void;
  setReactivateSubjectEn: (value: string) => void;
  setReactivateErrors: React.Dispatch<React.SetStateAction<ReactivateFormErrors>>;
  updateStatusMutation: any;
  submitResolutionMutation: any;
  scheduleOrUpdateVisitMutation: any;
  submitRatingMutation: any;
  acceptVisitMutation: any;
  requestRescheduleMutation: any;
  deleteRequestMutation: any;
  assignDepartmentMutation: any;
  assignToMeMutation: any;
  convertToComplaintMutation: any;
  linkComplaintMutation: any;
  reactivateRequestMutation: any;
  t: (key: string) => string;
}

export const createRequestHandlers = (params: CreateHandlersParams) => {
  const {
    id,
    request,
    isAdmin,
    isEmployee,
    isSuperAdmin,
    rating,
    feedback,
    responseText,
    attachments,
    visitDateTime,
    selectedLeadershipId,
    newMessage,
    convertDepartmentId,
    selectedComplaintId,
    wantsToRemoveLink,
    reactivateTitleAr,
    reactivateTitleEn,
    reactivateSubjectAr,
    reactivateSubjectEn,
    setResponseText,
    setAttachments,
    setRating,
    setFeedback,
    setIsRatingDialogOpen,
    setNewMessage,
    setSelectedLeadershipId,
    setVisitDateTime,
    setIsDeleteDialogOpen,
    setIsAssignDialogOpen,
    setIsSubmitConfirmDialogOpen,
    setIsConvertToComplaintDialogOpen,
    setConvertDepartmentId,
    setIsLinkComplaintDialogOpen,
    setSelectedComplaintId,
    setWantsToRemoveLink,
    setIsReactivateDialogOpen,
    setReactivateTitleAr,
    setReactivateTitleEn,
    setReactivateSubjectAr,
    setReactivateSubjectEn,
    setReactivateErrors,
    updateStatusMutation,
    submitResolutionMutation,
    scheduleOrUpdateVisitMutation,
    submitRatingMutation,
    acceptVisitMutation,
    requestRescheduleMutation,
    deleteRequestMutation,
    assignDepartmentMutation,
    assignToMeMutation,
    convertToComplaintMutation,
    linkComplaintMutation,
    reactivateRequestMutation,
    t,
  } = params;

  const handleStatusChange = (newStatus: number) => {
    if (id) {
      if (request?.requestStatusId === newStatus) {
        toast.info(
          t("requests.statusAlreadySet") 
        );
        return;
      }

      
      if (newStatus === RequestStatus.RECEIVED && request?.assignedDepartmentId) {
        assignDepartmentMutation.mutate(
          {
            requestId: parseInt(id, 10),
            departmentId: null, 
          },
          {
            onSuccess: () => {
              
              updateStatusMutation.mutate({ requestId: id, newStatus: newStatus });
            },
          }
        );
      } else {
        
        updateStatusMutation.mutate({ requestId: id, newStatus: newStatus });
      }
    }
  };

  const handleSubmitResponse = () => {
    if (isEmployee) {
      setIsSubmitConfirmDialogOpen(true);
      return;
    }
    confirmSubmitResponse();
  };

  const confirmSubmitResponse = () => {
    if (!id) return;

    if (
      (request.requestTypeId === RequestType.INQUIRY ||
        request.requestTypeId === RequestType.COMPLAINT) &&
      responseText.trim()
    ) {
      submitResolutionMutation.mutate({
        requestId: id,
        payload: {
          resolutionDetailsAr: responseText,
          resolutionDetailsEn: responseText,
          attachments,
        },
      });
      setResponseText("");
      setAttachments([]);
    } else if (
      request.requestTypeId === RequestType.VISIT &&
      visitDateTime &&
      selectedLeadershipId
    ) {
      scheduleOrUpdateVisitMutation.mutate({
        requestId: parseInt(id, 10),
        visitDate: visitDateTime,
        leadershipId: selectedLeadershipId,
        newStatus: VisitStatus.SCHEDULED,
      });
      setVisitDateTime("");
    }

    setIsSubmitConfirmDialogOpen(false);
  };

  const handleSubmitFeedback = () => {
    if (rating > 0 && id) {
      submitRatingMutation.mutate({
        userRequestId: parseInt(id, 10),
        rating,
        feedbackAr: feedback,
        feedbackEn: feedback,
      });
      setRating(0);
      setFeedback("");
    }
  };

  const handleOpenRatingDialog = () => {
    setIsRatingDialogOpen(true);
  };

  const handleRatingSubmit = (newRating: number, newFeedback: string) => {
    if (id && request) {
      const userProfile = authApi.getUserProfile();
      if (!userProfile) {
        toast.error("User not found");
        return;
      }

      submitRatingMutation.mutate({
        userRequestId: parseInt(id, 10),
        userId: userProfile.id,
        rating: newRating,
        feedbackAr: newFeedback,
        feedbackEn: newFeedback,
        ratedAt: new Date().toISOString(),
      });
    }
  };

  const handleAcceptVisit = () => {
    if (id && request?.visitId) {
      acceptVisitMutation.mutate({ visitId: request.visitId });
      setIsRatingDialogOpen(true);
    }
  };

  const handleDeclineVisit = () => {
    if (id && request?.visitId) {
      requestRescheduleMutation.mutate({ visitId: request.visitId });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAttachments((prev) => [...prev, ...files]);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setNewMessage("");
    }
  };

  const canEditRequest = () => {

    if (isSuperAdmin || isAdmin) return true;
    return false;
  };

  const handleAssignDepartment = (departmentId: number) => {
    if (id) {
      assignDepartmentMutation.mutate({
        requestId: parseInt(id, 10),
        departmentId,
      });

      if (
        request &&
        (request.requestTypeId === RequestType.INQUIRY ||
          request.requestTypeId === RequestType.COMPLAINT)
      ) {
        if (request.requestStatusId === RequestStatus.RECEIVED) {
          updateStatusMutation.mutate({
            requestId: id,
            newStatus: RequestStatus.UNDER_REVIEW,
          });
        }
      }
    }
  };

  const handleAssignLeadership = (leadershipId: number) => {
    if (id) {
      setSelectedLeadershipId(leadershipId);
      toast.success(
        t("requests.leadershipAssignedSuccessfully") || "Leadership assigned successfully"
      );
    }
  };

  const handleThankYou = () => {
    setIsRatingDialogOpen(true);
  };

  const handleDeleteRequest = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteRequest = () => {
    if (id) {
      deleteRequestMutation.mutate(parseInt(id, 10));
      setIsDeleteDialogOpen(false);
    }
  };

  const cancelDeleteRequest = () => {
    setIsDeleteDialogOpen(false);
  };

  const handleAssignToMe = () => {
    setIsAssignDialogOpen(true);
  };

  const confirmAssignToMe = () => {
    if (id) {
      assignToMeMutation.mutate(parseInt(id, 10));
      setIsAssignDialogOpen(false);
    }
  };

  const cancelAssignToMe = () => {
    setIsAssignDialogOpen(false);
  };

  const handleConvertToComplaint = () => {
    if (!request || !convertDepartmentId || !id) return;

    const complaintData = {
      userId: request.userId,
      email: request.email,
      mobile: request.mobile,
      titleAr: request.titleAr,
      titleEn: request.titleEn,
      subjectAr: request.subjectAr,
      subjectEn: request.subjectEn,
      requestTypeId: 2,
      mainCategoryId: null,
      isVisitRelatedToPreviousRequest: false,
      needDateReschedule: false,
    };

    convertToComplaintMutation.mutate({
      complaintData,
      departmentId: convertDepartmentId,
      visitRequestId: id,
    });

    setIsConvertToComplaintDialogOpen(false);
    setConvertDepartmentId(null);
  };

  const handleLinkComplaint = () => {
    const complaintIdToSend = wantsToRemoveLink ? null : selectedComplaintId;
    linkComplaintMutation.mutate(complaintIdToSend);
    setIsLinkComplaintDialogOpen(false);
    setSelectedComplaintId(null);
    setWantsToRemoveLink(false);
  };

  const handleReactivateFieldChange = (field: keyof ReactivateFormData, value: string) => {
    if (field === "titleAr") setReactivateTitleAr(value);
    else if (field === "titleEn") setReactivateTitleEn(value);
    else if (field === "subjectAr") setReactivateSubjectAr(value);
    else if (field === "subjectEn") setReactivateSubjectEn(value);

    const error = validateReactivateField(field, value, t);
    setReactivateErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleReactivateRequest = () => {
    if (!request) return;

    const errors = validateReactivateForm(
      {
        titleAr: reactivateTitleAr,
        titleEn: reactivateTitleEn,
        subjectAr: reactivateSubjectAr,
        subjectEn: reactivateSubjectEn,
      },
      t
    );

    if (Object.keys(errors).length > 0) {
      setReactivateErrors(errors);
      toast.error(t("validation.pleaseFixErrors"));
      return;
    }

    setReactivateErrors({});

    const newRequestPayload: CreateRequestPayload = {
      userId: request.userId,
      email: request.email,
      mobile: request.mobile,
      titleAr: reactivateTitleAr,
      titleEn: reactivateTitleEn || undefined,
      subjectAr: reactivateSubjectAr,
      subjectEn: reactivateSubjectEn || undefined,
      requestTypeId: request.requestTypeId,
      mainCategoryId: request.mainCategoryId,
      isVisitRelatedToPreviousRequest: true,
      relatedRequestId: request.id,
      needDateReschedule: false,
    };

    
    reactivateRequestMutation.mutate({
      requestPayload: newRequestPayload,
      assignedDepartmentId: request.assignedDepartmentId,
    });
    setIsReactivateDialogOpen(false);
  };

  const handleDownloadAttachment = async (attachment: RequestAttachment) => {
    try {
      const blob = await requestsApi.downloadAttachment(attachment.id);
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = attachment.fileName;
      link.style.display = "none";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);

      toast.success(t("requests.downloadStarted") || "Download started");
    } catch (error) {
      toast.error(t("requests.downloadFailed") || "Download failed");
    }
  };

  return {
    handleStatusChange,
    handleSubmitResponse,
    confirmSubmitResponse,
    handleSubmitFeedback,
    handleOpenRatingDialog,
    handleRatingSubmit,
    handleAcceptVisit,
    handleDeclineVisit,
    handleFileChange,
    handleSendMessage,
    canEditRequest,
    handleAssignDepartment,
    handleAssignLeadership,
    handleThankYou,
    handleDeleteRequest,
    confirmDeleteRequest,
    cancelDeleteRequest,
    handleAssignToMe,
    confirmAssignToMe,
    cancelAssignToMe,
    handleConvertToComplaint,
    handleLinkComplaint,
    handleReactivateFieldChange,
    handleReactivateRequest,
    handleDownloadAttachment,
  };
};
