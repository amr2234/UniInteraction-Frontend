import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { useUserRole, useHasPermission } from "@/core/hooks";
import { PERMISSIONS } from "@/core/constants/permissions";
import {
  RequestStatus,
  getRequestStatusName,
} from "@/core/constants/requestStatuses";
import { RequestType } from "@/core/constants/requestTypes";
import { VisitStatus, getVisitStatusName, getVisitStatusColor } from "@/core/constants/visitStatuses";
import { useRequestDetails } from "@/features/requests/hooks/useRequests";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { lookupsApi } from "@/features/lookups/api/lookups.api";
import { requestsApi } from "@/features/requests/api/requests.api";
import { visitsApi } from "@/features/visits/api/visits.api";
import {
  UserRequestDetailsDto,
  RequestTimelineItem,
  RequestMessage,
} from "@/features/requests/types";
import { RequestAttachment, CreateRequestPayload } from "@/core/types/api";
import { queryKeys } from "@/core/lib/queryKeys";
import {
  ReactivateFormData,
  ReactivateFormErrors,
  validateReactivateField,
  validateReactivateForm,
} from "./RequestDetails.validation";

export const useRequestDetailsLogic = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { t } = useI18n();
  const [newMessage, setNewMessage] = useState("");
  const [statusNote, setStatusNote] = useState("");
  const [visitDateTime, setVisitDateTime] = useState("");
  const [responseText, setResponseText] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [isRatingDialogOpen, setIsRatingDialogOpen] = useState(false);
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<
    number | null
  >(null);
  const [selectedLeadershipId, setSelectedLeadershipId] = useState<
    number | null
  >(null);
  const [isRelatedRequestDialogOpen, setIsRelatedRequestDialogOpen] = useState(false);
  const [isConvertToComplaintDialogOpen, setIsConvertToComplaintDialogOpen] = useState(false);
  const [isLinkComplaintDialogOpen, setIsLinkComplaintDialogOpen] = useState(false);
  const [isReactivateDialogOpen, setIsReactivateDialogOpen] = useState(false);
  const [convertDepartmentId, setConvertDepartmentId] = useState<number | null>(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState<number | null>(null);
  const [wantsToRemoveLink, setWantsToRemoveLink] = useState(false);
  const [reactivateTitleAr, setReactivateTitleAr] = useState("");
  const [reactivateTitleEn, setReactivateTitleEn] = useState("");
  const [reactivateSubjectAr, setReactivateSubjectAr] = useState("");
  const [reactivateSubjectEn, setReactivateSubjectEn] = useState("");
  const [reactivateErrors, setReactivateErrors] = useState<ReactivateFormErrors>({});
  const {
    isAdmin,
    isEmployee,
    isUser,
    isSuperAdmin,
    roleIds: userRoleIds,
  } = useUserRole();

  const canAssignRequests = useHasPermission(PERMISSIONS.REQUESTS_ASSIGN);

  const {
    data: request,
    isLoading: isLoadingRequest,
    error: requestError,
  } = useRequestDetails(id || "");

  const requestAttachmentsData = request?.attachments || [];

  const { data: departmentsData } = useQuery({
    queryKey: ["departments", "lookup"],
    queryFn: lookupsApi.getDepartments,
  });

  const { data: leadershipsData } = useQuery({
    queryKey: ["leaderships", "lookup"],
    queryFn: lookupsApi.getUniversityLeaderships,
  });

  // Fetch related request if exists (for both visit-related requests and linked complaints)
  const { data: relatedRequest } = useRequestDetails(
    request?.relatedRequestId ? request.relatedRequestId.toString() : ""
  );

  const departments = departmentsData || [];
  const leaderships = leadershipsData || [];

  // Fetch user's complaint requests for linking to visit
  const { data: userComplaints } = useQuery({
    queryKey: ["user-complaints", request?.userId],
    queryFn: async () => {
      if (!request?.userId) return [];
      const response = await requestsApi.getUserRequests({
        userId: request.userId,
        requestTypeId: RequestType.COMPLAINT,
        enablePagination: false,
      },);
      return Array.isArray(response) ? response : (response as any)?.items || [];
    },
    enabled: !!request?.userId && request?.requestTypeId === RequestType.VISIT,
  });

  // Initialize selectedDepartmentId only once when request loads
  useEffect(() => {
    if (request?.assignedDepartmentId && selectedDepartmentId === null) {
      setSelectedDepartmentId(request.assignedDepartmentId);
    }
  }, [request?.assignedDepartmentId, selectedDepartmentId]);

  // Initialize selectedLeadershipId only once when request loads
  useEffect(() => {
    if (request?.universityLeadershipId && selectedLeadershipId === null) {
      setSelectedLeadershipId(request.universityLeadershipId);
    }
  }, [request?.universityLeadershipId, selectedLeadershipId]);

  const updateStatusMutation = useMutation({
    mutationFn: ({
      requestId,
      newStatus,
      changeNoteAr,
      changeNoteEn,
    }: {
      requestId: string;
      newStatus: number;
      changeNoteAr?: string;
      changeNoteEn?: string;
    }) => {
      return requestsApi.updateRequestStatus(requestId, {
        requestId: parseInt(requestId, 10),
        newStatus,
        changeNoteAr,
        changeNoteEn,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.requests.detail(id!),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      toast.success(t("requests.statusUpdatedSuccessfully"));
    },
    onError: () => {
      toast.error(t("requests.statusUpdateFailed"));
    },
  });

const scheduleOrUpdateVisitMutation = useMutation({
  mutationFn: async ({
    requestId,
    visitDate,
    leadershipId,
    visitId,
    newStatus
  }: {
    requestId: number;
    visitDate: string;
    leadershipId: number;
    visitId?: number;
    newStatus: number;
  }) => {
    
    if (visitId) {
      // First update the visit details
      const updateResult = await visitsApi.updateVisit({ requestId, visitDate, leadershipId, visitId });
      
      // Then update status if provided
      if(newStatus) {
        return visitsApi.updateVisitStatus(visitId, {
          visitId,
          newStatus : newStatus,
        });
      }
      
      // Return the update result if no status change
      return updateResult;
    }
  
    return visitsApi.scheduleVisit({ requestId, visitDate, leadershipId });
  },

  onSuccess: (_data, variables) => {
    queryClient.invalidateQueries({ queryKey: queryKeys.requests.detail(id!) });
    queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });

    toast.success(
      variables.visitId
        ? t("requests.visitUpdatedSuccessfully")
        : t("requests.visitScheduledSuccessfully")
    );

    setVisitDateTime("");

    if (id) {
      updateStatusMutation.mutate({
        requestId: id,
        newStatus: RequestStatus.REPLIED,
      });
    }
  },

  onError: (error) => {
    console.log(error);
    toast.error(t("requests.visitSchedulingFailed"));
  },
});



  const submitResolutionMutation = useMutation({
    mutationFn: ({ requestId, payload }: { requestId: string; payload: any }) =>
      requestsApi.submitResolution(requestId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.requests.detail(id!),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      toast.success(t("requests.responseSentSuccessfully"));
      setResponseText("");
      setAttachments([]);

      if (id) {
        updateStatusMutation.mutate({
          requestId: id,
          newStatus: RequestStatus.REPLIED,
        });
      }
    },
    onError: () => {
      toast.error(t("requests.responseSubmissionFailed"));
    },
  });

  const submitRatingMutation = useMutation({
    mutationFn: ({ requestId, payload }: { requestId: string; payload: any }) =>
      requestsApi.submitRating(requestId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.requests.detail(id!),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      toast.success(t("requests.ratingSubmittedSuccessfully"));
      setRating(0);
      setFeedback("");
      setIsRatingDialogOpen(false);

      if (id) {
        updateStatusMutation.mutate({
          requestId: id,
          newStatus: RequestStatus.CLOSED,
        });
      }
    },
    onError: () => {
      toast.error(t("requests.ratingSubmissionFailed"));
    },
  });

  const acceptVisitMutation = useMutation({
    mutationFn: ({ visitId }: { visitId: number }) =>
      visitsApi.updateVisitStatus(visitId, {
        visitId,
        newStatus: VisitStatus.ACCEPTED,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.requests.detail(id!),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });

      setIsRatingDialogOpen(true);
      toast.success(t("requests.visitAcceptedSuccessfully"));
    },
    onError: () => {
      toast.error(t("requests.visitAcceptanceFailed"));
    },
  });


  // Request Reschedule Mutation - For users to request a visit reschedule
  const requestRescheduleMutation = useMutation({
    mutationFn: ({ visitId }: { visitId: number }) =>
      visitsApi.updateVisitStatus(visitId, {
        visitId,
        newStatus: VisitStatus.RESCHEDULED,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.requests.detail(id!),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      toast.success(t("requests.visitRescheduledSuccess") || "Visit rescheduled successfully");
    },
    onError: () => {
      toast.error(t("requests.visitDeclineError"));
    },
  });

  // Complete Visit Mutation
  const completeVisitMutation = useMutation({
    mutationFn: ({ requestId, visitId }: { requestId: number; visitId?: number }) =>
      requestsApi.updateRequestStatus(requestId.toString(), {
        requestId,
        newStatus: RequestStatus.CLOSED,
        visitId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.requests.detail(id!),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      toast.success(t("requests.visitCompletedSuccess") || "Visit completed successfully");
    },
    onError: () => {
      toast.error(t("requests.visitCompleteFailed") || "Failed to complete visit");
    },
  });

  const assignDepartmentMutation = useMutation({
    mutationFn: ({
      requestId,
      departmentId,
    }: {
      requestId: number;
      departmentId: number;
    }) => {
      return requestsApi.assignDepartment(requestId, departmentId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.requests.detail(id!),
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });

      toast.success(t("requests.departmentAssignedSuccessfully"));

      if (
        id &&
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
    },
    onError: () => {
      toast.error(t("requests.departmentAssignmentFailed"));
    },
  });

  const deleteRequestMutation = useMutation({
    mutationFn: (requestId: number) => {
      return requestsApi.deleteRequest(requestId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.requests.list(),
      });

      toast.success(
        t("requests.deleteSuccess") || "Request deleted successfully"
      );

      navigate("/dashboard/track");
    },
    onError: () => {
      toast.error(t("requests.deleteFailed") || "Failed to delete request");
    },
  });

  const assignToMeMutation = useMutation({
    mutationFn: (requestId: number) => {
      return requestsApi.assignToMe(requestId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.requests.detail(id!),
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });

      toast.success(
        t("requests.assignedToMeSuccessfully") ||
          "Request assigned to you successfully"
      );
    },
    onError: () => {
      toast.error(t("requests.assignToMeFailed") || "Failed to assign request");
    },
  });

  const convertToComplaintMutation = useMutation({
    mutationFn: async (payload: { complaintData: any; departmentId: number; visitRequestId: string }) => {
      // First, create the complaint
      const newComplaint = await requestsApi.createRequest(payload.complaintData);
      console.log("Created complaint:", newComplaint);
      
      // Store the new complaint ID
      const newComplaintId = newComplaint.id;
      console.log("New complaint ID:", newComplaintId);
      
      // Then assign it to the department
      await requestsApi.assignDepartment(
        newComplaintId,
        payload.departmentId
      );
      
      // Mark the old visit request as redirected and close it
      // Set relatedRequestId to link the visit to the new complaint
      await requestsApi.updateRequestStatus(payload.visitRequestId, {
        requestId: parseInt(payload.visitRequestId, 10),
        newStatus: RequestStatus.CLOSED,
        redirectToNewRequest: true,
        relatedRequestId: newComplaintId,
      });
      
      console.log("Returning ID:", newComplaintId);
      return { id: newComplaintId };
    },
    onSuccess: async (result) => {
      console.log("onSuccess result:", result);
      await queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      toast.success(
        t("requests.convertedToComplaintSuccess") ||
          "Visit successfully converted to complaint"
      );
      
      // Navigate to the new complaint
      console.log("Navigating to:", `/dashboard/request/${result.id}`);
      navigate(`/dashboard/request/${result.id}`);
    },
    onError: (error) => {
      console.error("Failed to convert visit to complaint:", error);
      toast.error(
        t("requests.convertToComplaintFailed") ||
          "Failed to convert visit to complaint"
      );
    },
  });

  const linkComplaintMutation = useMutation({
    mutationFn: async (complaintId: number | null) => {
      if (!id) throw new Error("Visit ID is required");
      return requestsApi.assignRelatedRequest(id, complaintId);
    },
    onSuccess: async (data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.requests.detail(id!),
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      
      // Show different message based on whether we're linking or removing
      if (variables === null) {
        toast.success(
          t("requests.complaintUnlinkedSuccessfully") ||
            "Complaint unlinked from visit successfully"
        );
      } else {
        toast.success(
          t("requests.complaintLinkedSuccessfully") ||
            "Complaint linked to visit successfully"
        );
      }
      
      setIsLinkComplaintDialogOpen(false);
      setSelectedComplaintId(null);
      setWantsToRemoveLink(false);
    },
    onError: (error) => {
      console.error("Failed to link complaint to visit:", error);
      toast.error(
        t("requests.complaintLinkFailed") ||
          "Failed to link complaint to visit"
      );
    },
  });

  const reactivateRequestMutation = useMutation({
    mutationFn: async (payload: CreateRequestPayload) => {
      const newRequest = await requestsApi.createRequest(payload);
      
      // Close the old request
      await requestsApi.updateRequestStatus(id!, {
        requestId: parseInt(id!, 10),
        newStatus: RequestStatus.CLOSED,
        relatedRequestId: newRequest.id,
      });
      
      return newRequest;
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      toast.success(
        t("requests.requestReactivatedSuccess") ||
          "Request reactivated successfully"
      );
      
      // Navigate to the new request
      navigate(`/dashboard/request/${result.id}`);
    },
    onError: (error) => {
      console.error("Failed to reactivate request:", error);
      toast.error(
        t("requests.requestReactivateFailed") ||
          "Failed to reactivate request"
      );
    },
  });

  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (!request || isLoadingRequest) {
    return {
      isLoading: isLoadingRequest,
      error: requestError,
      request: null,
      requestAttachments: requestAttachmentsData || [],
      relatedRequest: null,
      selectedDepartmentId: null,
      selectedLeadershipId: null,
      newMessage: "",
      statusNote: "",
      visitDateTime: "",
      responseText: "",
      attachments: [],
      rating: 0,
      feedback: "",
      isRatingDialogOpen: false,
      isAssignDialogOpen: false,
      isDeleteDialogOpen: false,
      isRelatedRequestDialogOpen: false,
      isConvertToComplaintDialogOpen: false,
      isLinkComplaintDialogOpen: false,
      isReactivateDialogOpen: false,
      convertDepartmentId: null,
      selectedComplaintId: null,
      wantsToRemoveLink: false,
      reactivateTitleAr: "",
      reactivateTitleEn: "",
      reactivateSubjectAr: "",
      reactivateSubjectEn: "",
      reactivateErrors: {},
      userComplaints: [],
      departments,
      leaderships: [],
      RequestStatus,
      RequestType,
      VisitStatus,
      isAdmin,
      isEmployee,
      isUser,
      isSuperAdmin,
      canEditRequest: () => false,
      canAssignRequests,
      setNewMessage,
      setStatusNote,
      setVisitDateTime,
      setResponseText,
      setAttachments,
      setRating,
      setFeedback,
      setIsRatingDialogOpen,
      setIsAssignDialogOpen,
      setIsDeleteDialogOpen,
      setIsRelatedRequestDialogOpen,
      setIsConvertToComplaintDialogOpen,
      setIsLinkComplaintDialogOpen,
      setIsReactivateDialogOpen,
      setConvertDepartmentId,
      setSelectedComplaintId,
      setWantsToRemoveLink,
      setReactivateTitleAr,
      setReactivateTitleEn,
      setReactivateSubjectAr,
      setReactivateSubjectEn,
      setReactivateErrors,
      setSelectedDepartmentId,
      setSelectedLeadershipId,
      handleStatusChange: () => {},
      handleSubmitResponse: () => {},
      handleSubmitFeedback: () => {},
      handleOpenRatingDialog: () => {},
      handleRatingSubmit: () => {},
      handleAcceptVisit: () => {},
      handleDeclineVisit: () => {},
      handleFileChange: () => {},
      handleSendMessage: () => {},
      handleAssignDepartment: () => {},
      handleAssignLeadership: () => {},
      handleThankYou: () => {},
      handleDownloadAttachment: async () => {},
      handleDeleteRequest: () => {},
      confirmDeleteRequest: () => {},
      cancelDeleteRequest: () => {},
      handleAssignToMe: () => {},
      confirmAssignToMe: () => {},
      cancelAssignToMe: () => {},
      handleConvertToComplaint: () => {},
      handleLinkComplaint: () => {},
      handleReactivateRequest: () => {},
      handleReactivateFieldChange: () => {},
      scheduleOrUpdateVisitMutation: { mutate: () => {}, isPending: false } as any,
      requestRescheduleMutation: { mutate: () => {}, isPending: false } as any,
      completeVisitMutation: { mutate: () => {}, isPending: false } as any,
      getDepartmentName: () => "",
      getLeadershipName: () => "",
      getLeadershipPosition: () => "",
      getVisitStatusName,
      getVisitStatusColor,
      navigate,
    };
  }
  const handleStatusChange = (newStatus: number) => {
    if (id) {
      if (request?.requestStatusId === newStatus) {
        toast.info(
          t("requests.statusAlreadySet") ||
            "Status is already set to this value"
        );
        return;
      }

      updateStatusMutation.mutate({ requestId: id, newStatus: newStatus });
    }
  };

  const handleSubmitResponse = () => {
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
    }
  };

  const handleSubmitFeedback = () => {
    if (rating > 0 && id) {
      submitRatingMutation.mutate({
        requestId: id,
        payload: {
          rating,
          feedbackAr: feedback,
          feedbackEn: feedback,
        },
      });
    }
  };

  const handleOpenRatingDialog = () => {
    setIsRatingDialogOpen(true);
  };

  const handleRatingSubmit = (newRating: number, newFeedback: string) => {
    if (id) {
      submitRatingMutation.mutate({
        requestId: id,
        payload: {
          rating: newRating,
          feedbackAr: newFeedback,
          feedbackEn: newFeedback,
        },
      });
    }
  };

  const handleAcceptVisit = () => {
    if (id && request?.visitId) {
      acceptVisitMutation.mutate({ visitId: request.visitId });
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
    if (isSuperAdmin) return true;

    if (isEmployee && request.requestStatusId === RequestStatus.RECEIVED)
      return true;

    return false;
  };

  const handleAssignDepartment = (departmentId: number) => {
    if (id) {
      assignDepartmentMutation.mutate({
        requestId: parseInt(id, 10),
        departmentId,
      });
    }
  };

  const handleAssignLeadership = (leadershipId: number) => {
    if (id) {
      setSelectedLeadershipId(leadershipId);
      toast.success(
        t("requests.leadershipAssignedSuccessfully") ||
          "Leadership assigned successfully"
      );
    }
  };

  const getDepartmentName = (
    departmentId?: number,
    language: "ar" | "en" = "ar"
  ): string => {
    if (!departmentId) return "";
    const department = departments.find((dept) => dept.id === departmentId);
    if (!department) return "";
    return language === "ar"
      ? department.nameAr
      : department.nameEn || department.nameAr;
  };

  const getLeadershipName = (
    leadershipId?: number,
    language: "ar" | "en" = "ar"
  ): string => {
    if (!leadershipId) return "";
    const leadership = leaderships.find((lead) => lead.id === leadershipId);
    if (!leadership) return "";
    return language === "ar"
      ? leadership.nameAr
      : leadership.nameEn || leadership.nameAr;
  };

  const getLeadershipPosition = (
    leadershipId?: number,
    language: "ar" | "en" = "ar"
  ): string => {
    if (!leadershipId) return "";
    const leadership = leaderships.find((lead) => lead.id === leadershipId);
    if (!leadership) return "";
    return language === "ar"
      ? leadership.positionTitleAr
      : leadership.positionTitleEn || leadership.positionTitleAr;
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

    // Create complaint payload from visit request
    const complaintData = {
      userId: request.userId,
      email: request.email,
      mobile: request.mobile,
      titleAr: request.titleAr,
      titleEn: request.titleEn,
      subjectAr: request.subjectAr,
      subjectEn: request.subjectEn,
      requestTypeId: 2, // Complaint type
      mainCategoryId: null, // Set to null when converting from visit
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
    // If user wants to remove link, send null; otherwise send selectedComplaintId
    const complaintIdToSend = wantsToRemoveLink ? null : selectedComplaintId;
    linkComplaintMutation.mutate(complaintIdToSend);
  };

  // Handle field change with live validation
  const handleReactivateFieldChange = (field: keyof ReactivateFormData, value: string) => {
    // Update the field value
    if (field === "titleAr") setReactivateTitleAr(value);
    else if (field === "titleEn") setReactivateTitleEn(value);
    else if (field === "subjectAr") setReactivateSubjectAr(value);
    else if (field === "subjectEn") setReactivateSubjectEn(value);

    // Validate and update errors
    const error = validateReactivateField(field, value, t);
    setReactivateErrors((prev) => ({
      ...prev,
      [field]: error,
    }));
  };

  const handleReactivateRequest = () => {
    if (!request) return;

    // Validate using imported validation function
    const errors = validateReactivateForm(
      {
        titleAr: reactivateTitleAr,
        titleEn: reactivateTitleEn,
        subjectAr: reactivateSubjectAr,
        subjectEn: reactivateSubjectEn,
      },
      t
    );

    // If there are errors, set them and return
    if (Object.keys(errors).length > 0) {
      setReactivateErrors(errors);
      toast.error(t("validation.pleaseFixErrors"));
      return;
    }

    // Clear errors
    setReactivateErrors({});

    // Create new request payload
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

    reactivateRequestMutation.mutate(newRequestPayload);
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
      console.error("Download error:", error);
      toast.error(t("requests.downloadFailed") || "Download failed");
    }
  };

  return {
    newMessage,
    statusNote,
    visitDateTime,
    responseText,
    attachments,
    rating,
    feedback,
    isRatingDialogOpen,
    isAssignDialogOpen,
    isDeleteDialogOpen,
    isRelatedRequestDialogOpen,
    isConvertToComplaintDialogOpen,
    isLinkComplaintDialogOpen,
    isReactivateDialogOpen,
    convertDepartmentId,
    selectedComplaintId,
    wantsToRemoveLink,
    reactivateTitleAr,
    reactivateTitleEn,
    reactivateSubjectAr,
    reactivateSubjectEn,
    reactivateErrors,
    userComplaints: userComplaints || [],
    request,
    requestAttachments: requestAttachmentsData || [],
    relatedRequest,
    selectedDepartmentId,
    selectedLeadershipId,
    departments,
    leaderships,

    RequestStatus,
    RequestType,
    VisitStatus,

    isAdmin,
    isEmployee,
    isUser,
    isSuperAdmin,
    canEditRequest,
    canAssignRequests,

    setNewMessage,
    setStatusNote,
    setVisitDateTime,
    setResponseText,
    setAttachments,
    setRating,
    setFeedback,
    setIsRatingDialogOpen,
    setIsAssignDialogOpen,
    setIsDeleteDialogOpen,
    setIsRelatedRequestDialogOpen,
    setIsConvertToComplaintDialogOpen,
    setIsLinkComplaintDialogOpen,
    setIsReactivateDialogOpen,
    setConvertDepartmentId,
    setSelectedComplaintId,
    setWantsToRemoveLink,
    setReactivateTitleAr,
    setReactivateTitleEn,
    setReactivateSubjectAr,
    setReactivateSubjectEn,
    setReactivateErrors,
    setSelectedDepartmentId,
    setSelectedLeadershipId,
    handleStatusChange,
    handleSubmitResponse,
    handleSubmitFeedback,
    handleOpenRatingDialog,
    handleRatingSubmit,
    handleAcceptVisit,
    handleDeclineVisit,
    handleFileChange,
    handleSendMessage,
    handleAssignDepartment,
    handleAssignLeadership,
    handleThankYou,
    handleDownloadAttachment,
    handleDeleteRequest,
    confirmDeleteRequest,
    cancelDeleteRequest,
    handleAssignToMe,
    confirmAssignToMe,
    cancelAssignToMe,
    handleConvertToComplaint,
    handleLinkComplaint,
    handleReactivateRequest,
    handleReactivateFieldChange,
    scheduleOrUpdateVisitMutation,
    requestRescheduleMutation,
    completeVisitMutation,
    getDepartmentName,
    getLeadershipName,
    getLeadershipPosition,
    getVisitStatusName,
    getVisitStatusColor,
    navigate,
  };
};
