import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useI18n } from "@/i18n";
import { useUserRole, useHasPermission } from "@/core/hooks";
import { PERMISSIONS } from "@/core/constants/permissions";
import { RequestStatus } from "@/core/constants/requestStatuses";
import { RequestType } from "@/core/constants/requestTypes";
import { VisitStatus, getVisitStatusName, getVisitStatusColor } from "@/core/constants/visitStatuses";
import { useRequestDetails } from "@/features/requests/hooks/useRequests";
import {
  useDepartmentsLookup,
  useLeadershipLookup,
} from "@/features/lookups/hooks/useLookups";
import { requestsApi } from "@/features/requests/api/requests.api";
import { ReactivateFormErrors } from "./RequestDetails.validation";
import { useRequestMutations } from "./RequestDetails.mutations";
import { createRequestHandlers } from "./RequestDetails.handlers";
import { createRequestHelpers } from "./RequestDetails.helpers";

export const useRequestDetailsLogic = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useI18n();
  
  // State management - Consolidated for better performance
  const [state, setState] = useState({
    newMessage: "",
    statusNote: "",
    visitDateTime: "",
    responseText: "",
    attachments: [] as File[],
    rating: 0,
    feedback: "",
    isRatingDialogOpen: false,
    selectedDepartmentId: null as number | null,
    selectedLeadershipId: null as number | null,
    isRelatedRequestDialogOpen: false,
    isConvertToComplaintDialogOpen: false,
    isLinkComplaintDialogOpen: false,
    isReactivateDialogOpen: false,
    convertDepartmentId: null as number | null,
    selectedComplaintId: null as number | null,
    wantsToRemoveLink: false,
    reactivateTitleAr: "",
    reactivateTitleEn: "",
    reactivateSubjectAr: "",
    reactivateSubjectEn: "",
    reactivateErrors: {} as ReactivateFormErrors,
    isSubmitConfirmDialogOpen: false,
    isAssignDialogOpen: false,
    isDeleteDialogOpen: false,
  });

  // Generic state updater for better performance
  const updateState = (updates: Partial<typeof state>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  // Individual setters for backward compatibility with handlers
  const setNewMessage = (value: string) => updateState({ newMessage: value });
  const setStatusNote = (value: string) => updateState({ statusNote: value });
  const setVisitDateTime = (value: string) => updateState({ visitDateTime: value });
  const setResponseText = (value: string) => updateState({ responseText: value });
  const setAttachments = (value: File[] | ((prev: File[]) => File[])) => {
    if (typeof value === 'function') {
      setState((prev) => ({ ...prev, attachments: value(prev.attachments) }));
    } else {
      updateState({ attachments: value });
    }
  };
  const setRating = (value: number) => updateState({ rating: value });
  const setFeedback = (value: string) => updateState({ feedback: value });
  const setIsRatingDialogOpen = (value: boolean) => updateState({ isRatingDialogOpen: value });
  const setSelectedDepartmentId = (value: number | null) => updateState({ selectedDepartmentId: value });
  const setSelectedLeadershipId = (value: number | null) => updateState({ selectedLeadershipId: value });
  const setIsRelatedRequestDialogOpen = (value: boolean) => updateState({ isRelatedRequestDialogOpen: value });
  const setIsConvertToComplaintDialogOpen = (value: boolean) => updateState({ isConvertToComplaintDialogOpen: value });
  const setIsLinkComplaintDialogOpen = (value: boolean) => updateState({ isLinkComplaintDialogOpen: value });
  const setIsReactivateDialogOpen = (value: boolean) => updateState({ isReactivateDialogOpen: value });
  const setConvertDepartmentId = (value: number | null) => updateState({ convertDepartmentId: value });
  const setSelectedComplaintId = (value: number | null) => updateState({ selectedComplaintId: value });
  const setWantsToRemoveLink = (value: boolean) => updateState({ wantsToRemoveLink: value });
  const setReactivateTitleAr = (value: string) => updateState({ reactivateTitleAr: value });
  const setReactivateTitleEn = (value: string) => updateState({ reactivateTitleEn: value });
  const setReactivateSubjectAr = (value: string) => updateState({ reactivateSubjectAr: value });
  const setReactivateSubjectEn = (value: string) => updateState({ reactivateSubjectEn: value });
  const setReactivateErrors = (value: ReactivateFormErrors | ((prev: ReactivateFormErrors) => ReactivateFormErrors)) => {
    if (typeof value === 'function') {
      setState((prev) => ({ ...prev, reactivateErrors: value(prev.reactivateErrors) }));
    } else {
      updateState({ reactivateErrors: value });
    }
  };
  const setIsSubmitConfirmDialogOpen = (value: boolean) => updateState({ isSubmitConfirmDialogOpen: value });
  const setIsAssignDialogOpen = (value: boolean) => updateState({ isAssignDialogOpen: value });
  const setIsDeleteDialogOpen = (value: boolean) => updateState({ isDeleteDialogOpen: value });

  // Destructure state for easier access
  const {
    newMessage,
    statusNote,
    visitDateTime,
    responseText,
    attachments,
    rating,
    feedback,
    isRatingDialogOpen,
    selectedDepartmentId,
    selectedLeadershipId,
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
    isSubmitConfirmDialogOpen,
    isAssignDialogOpen,
    isDeleteDialogOpen,
  } = state;

  // User permissions
  const {
    isAdmin,
    isEmployee,
    isUser,
    isSuperAdmin,
  } = useUserRole();

  const canAssignRequests = useHasPermission(PERMISSIONS.REQUESTS_ASSIGN);

  // Data fetching
  const {
    data: request,
    isLoading: isLoadingRequest,
    error: requestError,
  } = useRequestDetails(id || "");

  const requestAttachmentsData = request?.attachments || [];

  const { data: departmentsData } = useDepartmentsLookup();
  const { data: leadershipsData } = useLeadershipLookup();

  const { data: relatedRequest } = useRequestDetails(
    request?.relatedRequestId ? request.relatedRequestId.toString() : ""
  );

  const departments = departmentsData || [];
  const leaderships = leadershipsData || [];

  const { data: userComplaints } = useQuery({
    queryKey: ["user-complaints", request?.userId],
    queryFn: async () => {
      if (!request?.userId) return [];
      const response = await requestsApi.getUserRequests({
        userId: request.userId,
        requestTypeId: RequestType.COMPLAINT,
        enablePagination: false,
      });
      return Array.isArray(response) ? response : (response as any)?.items || [];
    },
    enabled: !!request?.userId && request?.requestTypeId === RequestType.VISIT,
  });

  // Effects
  useEffect(() => {
    if (request?.assignedDepartmentId && state.selectedDepartmentId === null) {
      updateState({ selectedDepartmentId: request.assignedDepartmentId });
    }
  }, [request?.assignedDepartmentId, state.selectedDepartmentId]);

  useEffect(() => {
    if (request?.universityLeadershipId && state.selectedLeadershipId === null) {
      updateState({ selectedLeadershipId: request.universityLeadershipId });
    }
  }, [request?.universityLeadershipId, state.selectedLeadershipId]);

  useEffect(() => {
    if (
      (isAdmin || isSuperAdmin) &&
      !isEmployee &&
      request?.resolutionDetailsAr &&
      request?.requestStatusId === RequestStatus.REPLIED &&
      !state.responseText
    ) {
      updateState({ responseText: request.resolutionDetailsAr });
    }
  }, [
    request?.resolutionDetailsAr,
    request?.requestStatusId,
    isAdmin,
    isSuperAdmin,
    isEmployee,
    state.responseText,
  ]);

  // Mutations
  const mutations = useRequestMutations(id, t);

  // Handlers
  const handlers = request ? createRequestHandlers({
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
    ...mutations,
    t,
  }) : null;

  // Helpers
  const helpers = createRequestHelpers(departments, leaderships);

  // Loading state
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
      isSubmitConfirmDialogOpen: false,
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
      setIsSubmitConfirmDialogOpen,
      handleStatusChange: () => {},
      handleSubmitResponse: () => {},
      confirmSubmitResponse: () => {},
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

  return {
    // State
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
    isSubmitConfirmDialogOpen,
    convertDepartmentId,
    selectedComplaintId,
    wantsToRemoveLink,
    reactivateTitleAr,
    reactivateTitleEn,
    reactivateSubjectAr,
    reactivateSubjectEn,
    reactivateErrors,
    
    // Data
    userComplaints: userComplaints || [],
    request,
    requestAttachments: requestAttachmentsData || [],
    relatedRequest,
    selectedDepartmentId,
    selectedLeadershipId,
    departments,
    leaderships,
    
    // Constants
    RequestStatus,
    RequestType,
    VisitStatus,
    
    // Permissions
    isAdmin,
    isEmployee,
    isUser,
    isSuperAdmin,
    canAssignRequests,
    
    // State setters
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
    setIsSubmitConfirmDialogOpen,
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
    
    // Handlers - Only spread if handlers exist
    ...(handlers || {}),
    
    // Mutations
    ...mutations,
    
    // Helpers
    ...helpers,
    
    // Utils
    getVisitStatusName,
    getVisitStatusColor,
    navigate,
  };
};
