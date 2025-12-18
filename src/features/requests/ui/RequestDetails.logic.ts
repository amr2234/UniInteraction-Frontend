import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useI18n } from "@/i18n";
import { useUserRole, useHasPermission } from "@/core/hooks";
import { PERMISSIONS } from "@/core/constants/permissions";
import { RequestStatus, getRequestStatusName } from "@/core/constants/requestStatuses";
import { RequestType } from "@/core/constants/requestTypes";
import { VisitStatus } from "@/core/constants/visitStatuses";
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
import { RequestAttachment } from "@/core/types/api";
import { queryKeys } from "@/core/lib/queryKeys";

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
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<number | null>(null);
  const [selectedLeadershipId, setSelectedLeadershipId] = useState<number | null>(null);
  const { isAdmin, isEmployee, isUser, isSuperAdmin, roleIds: userRoleIds } = useUserRole();

  const canAssignRequests = useHasPermission(PERMISSIONS.REQUESTS_ASSIGN);
  
  // Fetch request details from API
  const { data: request, isLoading: isLoadingRequest, error: requestError } = useRequestDetails(id || '');
  
  // Use attachments from the request object instead of fetching separately
  const requestAttachmentsData = request?.attachments || [];
  
  // Fetch departments
  const { data: departmentsData } = useQuery({
    queryKey: ['departments', 'lookup'],
    queryFn: lookupsApi.getDepartments,
  });
  
  // Fetch university leaderships
  const { data: leadershipsData } = useQuery({
    queryKey: ['leaderships', 'lookup'],
    queryFn: lookupsApi.getUniversityLeaderships,
  });
  
  const departments = departmentsData || [];
  const leaderships = leadershipsData || [];
  
  // Initialize selectedDepartmentId with current assigned department
  useEffect(() => {
    if (request?.assignedDepartmentId) {
      setSelectedDepartmentId(request.assignedDepartmentId);
    }
  }, [request?.assignedDepartmentId]);
  
  // Initialize selectedLeadershipId with current assigned leadership
  useEffect(() => {
    if (request?.universityLeadershipId) {
      setSelectedLeadershipId(request.universityLeadershipId);
    }
  }, [request?.universityLeadershipId]);
  
  // Handle status change for employees/admins
  const updateStatusMutation = useMutation({
    mutationFn: ({ requestId, newStatusId, changeNoteAr, changeNoteEn }: { 
      requestId: string; 
      newStatusId: number;
      changeNoteAr?: string;
      changeNoteEn?: string;
    }) => {
      return requestsApi.updateRequestStatus(requestId, { 
        requestId: parseInt(requestId, 10),
        newStatusId,
        changeNoteAr,
        changeNoteEn,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.detail(id!) });
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      toast.success(t('requests.statusUpdatedSuccessfully'));
    },
    onError: () => {
      toast.error(t('requests.statusUpdateFailed'));
    },
  });

  // Schedule visit mutation (Employee schedules a visit date)
  const scheduleVisitMutation = useMutation({
    mutationFn: ({ requestId, visitDate, leadershipId }: { requestId: number; visitDate: string; leadershipId: number }) =>
      visitsApi.scheduleVisit({ requestId, visitDate, leadershipId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.detail(id!) });
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      toast.success(t('requests.visitScheduledSuccessfully'));
      setVisitDateTime("");
      
      // Update status to "Replied" after scheduling visit
      if (id) {
        updateStatusMutation.mutate({ requestId: id, newStatusId: RequestStatus.REPLIED });
      }
    },
    onError: () => {
      toast.error(t('requests.visitSchedulingFailed'));
    },
  });

  // Submit resolution mutation  
  const submitResolutionMutation = useMutation({
    mutationFn: ({ requestId, payload }: { requestId: string; payload: any }) =>
      requestsApi.submitResolution(requestId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.detail(id!) });
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      toast.success(t('requests.responseSentSuccessfully'));
      setResponseText("");
      setAttachments([]);
      
      // Update status to "Replied" after submitting resolution
      if (id) {
        updateStatusMutation.mutate({ requestId: id, newStatusId: RequestStatus.REPLIED });
      }
    },
    onError: () => {
      toast.error(t('requests.responseSubmissionFailed'));
    },
  });

  // Submit rating mutation
  const submitRatingMutation = useMutation({
    mutationFn: ({ requestId, payload }: { requestId: string; payload: any }) =>
      requestsApi.submitRating(requestId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.detail(id!) });
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      toast.success(t('requests.ratingSubmittedSuccessfully'));
      setRating(0);
      setFeedback("");
      setIsRatingDialogOpen(false);
      
      // Update status to "Closed" after submitting rating
      if (id) {
        updateStatusMutation.mutate({ requestId: id, newStatusId: RequestStatus.CLOSED });
      }
    },
    onError: () => {
      toast.error(t('requests.ratingSubmissionFailed'));
    },
  });

  // Accept visit mutation (User accepts the scheduled visit)
  const acceptVisitMutation = useMutation({
    mutationFn: ({ visitId }: { visitId: number }) =>
      visitsApi.updateVisitStatus(visitId, { visitId, status: VisitStatus.ACCEPTED }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.detail(id!) });
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      // Open rating dialog after accepting
      setIsRatingDialogOpen(true);
      toast.success(t('requests.visitAcceptedSuccessfully'));
    },
    onError: () => {
      toast.error(t('requests.visitAcceptanceFailed'));
    },
  });

  // Decline visit mutation (User requests to reschedule)
  const declineVisitMutation = useMutation({
    mutationFn: ({ visitId, newVisitDate }: { visitId: number; newVisitDate?: string }) =>
      visitsApi.updateVisitStatus(visitId, { visitId, status: VisitStatus.RESCHEDULED, newVisitDate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.detail(id!) });
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      toast.success(t('requests.visitDeclinedMessage'));
    },
    onError: () => {
      toast.error(t('requests.visitDeclineError'));
    },
  });



  // Assign department mutation
  const assignDepartmentMutation = useMutation({
    mutationFn: ({ requestId, departmentId }: { requestId: number; departmentId: number }) => {
      return requestsApi.assignDepartment(requestId, departmentId);
    },
    onSuccess: async () => {
      // Invalidate and refetch the request details
      await queryClient.invalidateQueries({ queryKey: queryKeys.requests.detail(id!) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      
      toast.success(t('requests.departmentAssignedSuccessfully'));
      
      // For Inquiry/Complaint (Type 1/2): Automatically update status from Received to UnderReview
      if (id && request && (request.requestTypeId === RequestType.INQUIRY || request.requestTypeId === RequestType.COMPLAINT)) {
        if (request.requestStatusId === RequestStatus.RECEIVED) {
          updateStatusMutation.mutate({ requestId: id, newStatusId: RequestStatus.UNDER_REVIEW });
        }
      }
    },
    onError: () => {
      toast.error(t('requests.departmentAssignmentFailed'));
    },
  });

  // Delete request mutation (Super Admin only)
  const deleteRequestMutation = useMutation({
    mutationFn: (requestId: number) => {
      return requestsApi.deleteRequest(requestId);
    },
    onSuccess: async () => {
      // Invalidate queries BEFORE navigation to refresh the table
      await queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.requests.list() });
      
      toast.success(t('requests.deleteSuccess') || 'Request deleted successfully');
      // Navigate back to requests list
      navigate('/dashboard/track');
    },
    onError: () => {
      toast.error(t('requests.deleteFailed') || 'Failed to delete request');
    },
  });

  // Assign to me mutation (Employee)
  const assignToMeMutation = useMutation({
    mutationFn: (requestId: number) => {
      return requestsApi.assignToMe(requestId);
    },
    onSuccess: async () => {
      // Invalidate and refetch the request details
      await queryClient.invalidateQueries({ queryKey: queryKeys.requests.detail(id!) });
      await queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      
      toast.success(t('requests.assignedToMeSuccessfully') || 'Request assigned to you successfully');
    },
    onError: () => {
      toast.error(t('requests.assignToMeFailed') || 'Failed to assign request');
    },
  });

  // State for assign confirmation dialog
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  
  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  // If no request or still loading, return early state (after all hooks)
  if (!request || isLoadingRequest) {
    return {
      isLoading: isLoadingRequest,
      error: requestError,
      request: null,
      requestAttachments: requestAttachmentsData || [],
      messages: [],
      departments,
      RequestStatus,
      RequestType,
      isAdmin,
      isEmployee,
      isUser,
      isSuperAdmin,
      canEditRequest: () => false,
      canAssignRequests,
      navigate,
    };
  }

  const handleStatusChange = (newStatusId: number) => {
    if (id) {
      // Prevent selecting the same status
      if (request?.requestStatusId === newStatusId) {
        toast.info(t('requests.statusAlreadySet') || 'Status is already set to this value');
        return;
      }
      
      updateStatusMutation.mutate({ requestId: id, newStatusId });
    }
  };

  
  // Handle employee response submission
  const handleSubmitResponse = () => {
    if (!id) return;

    if ((request.requestTypeId === RequestType.INQUIRY || request.requestTypeId === RequestType.COMPLAINT) && responseText.trim()) {
      // Handle complaint or inquiry response
      submitResolutionMutation.mutate({
        requestId: id,
        payload: {
          resolutionDetailsAr: responseText,
          resolutionDetailsEn: responseText,
          attachments,
        },
      });
    } else if (request.requestTypeId === RequestType.VISIT && visitDateTime && selectedLeadershipId) {
      // Handle visit scheduling using new visitsApi
      scheduleVisitMutation.mutate({
        requestId: parseInt(id, 10),
        visitDate: visitDateTime,
        leadershipId: selectedLeadershipId,
      });
    }
  };


  // Handle feedback submission for users
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


  // Handle accept visit - opens rating dialog
  const handleAcceptVisit = () => {
    if (id && request?.id) {
      // Use the visit ID (assuming it's stored in request.id for visit requests)
      acceptVisitMutation.mutate({ visitId: request.id });
    }
  };


  // Handle decline visit - updates visit status to Rescheduled
  const handleDeclineVisit = () => {
    if (id && request?.id) {
      declineVisitMutation.mutate({ 
        visitId: request.id,
        newVisitDate: undefined // User doesn't provide new date, employee will
      });
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setAttachments(prev => [...prev, ...files]);
    }
  };
  
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setNewMessage("");
    }
  };

  const canEditRequest = () => {
    // Super Admin can always edit
    if (isSuperAdmin) return true;
    
    // Employee can only edit RECEIVED status requests
    if (isEmployee && request.requestStatusId === RequestStatus.RECEIVED) return true;
    
    return false;
  };

  const handleAssignDepartment = (departmentId: number) => {
    if (id) {
      assignDepartmentMutation.mutate({ requestId: parseInt(id, 10), departmentId });
    }
  };
  
  const handleAssignLeadership = (leadershipId: number) => {
    if (id) {
      // Update the request with the selected leadership
      // This will be used when scheduling the visit
      setSelectedLeadershipId(leadershipId);
      toast.success(t('requests.leadershipAssignedSuccessfully') || 'Leadership assigned successfully');
    }
  };

  const getDepartmentName = (departmentId?: number, language: 'ar' | 'en' = 'ar'): string => {
    if (!departmentId) return '';
    const department = departments.find(dept => dept.id === departmentId);
    if (!department) return '';
    return language === 'ar' ? department.nameAr : (department.nameEn || department.nameAr);
  };
  
  const getLeadershipName = (leadershipId?: number, language: 'ar' | 'en' = 'ar'): string => {
    if (!leadershipId) return '';
    const leadership = leaderships.find(lead => lead.id === leadershipId);
    if (!leadership) return '';
    return language === 'ar' ? leadership.nameAr : (leadership.nameEn || leadership.nameAr);
  };
  
  const getLeadershipPosition = (leadershipId?: number, language: 'ar' | 'en' = 'ar'): string => {
    if (!leadershipId) return '';
    const leadership = leaderships.find(lead => lead.id === leadershipId);
    if (!leadership) return '';
    return language === 'ar' ? leadership.positionTitleAr : (leadership.positionTitleEn || leadership.positionTitleAr);
  };

  // Handle "Thank you" action - just close the rating dialog
  const handleThankYou = () => {
    setIsRatingDialogOpen(true);
  };

  // Handle delete request (Super Admin only)
  const handleDeleteRequest = () => {
    // Open confirmation dialog
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete request action
  const confirmDeleteRequest = () => {
    if (id) {
      deleteRequestMutation.mutate(parseInt(id, 10));
      setIsDeleteDialogOpen(false);
    }
  };

  // Cancel delete request action
  const cancelDeleteRequest = () => {
    setIsDeleteDialogOpen(false);
  };

  // Handle assign to me (Employee)
  const handleAssignToMe = () => {
    // Open confirmation dialog
    setIsAssignDialogOpen(true);
  };

  // Confirm assign to me action
  const confirmAssignToMe = () => {
    if (id) {
      assignToMeMutation.mutate(parseInt(id, 10));
      setIsAssignDialogOpen(false);
    }
  };

  // Cancel assign to me action
  const cancelAssignToMe = () => {
    setIsAssignDialogOpen(false);
  };

  // Handle file download
  const handleDownloadAttachment = async (attachment: RequestAttachment) => {
    try {
      // Backend returns filePath, need to construct full URL
      const fileUrl = attachment.fileUrl || (attachment.filePath ? `${window.location.origin}${attachment.filePath}` : null);
      
      if (fileUrl) {
        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = attachment.fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success(t('requests.downloadStarted') || 'Download started');
      } else {
        toast.error(t('requests.downloadFailed') || 'Download failed - No file path');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error(t('requests.downloadFailed') || 'Download failed');
    }
  };

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
    request,
    requestAttachments: requestAttachmentsData || [],
    selectedDepartmentId,
    selectedLeadershipId,
    departments,
    leaderships,
    
    // Constants
    RequestStatus,
    RequestType,
    
    // Role checks
    isAdmin,
    isEmployee,
    isUser,
    isSuperAdmin,
    canEditRequest,
    canAssignRequests,
    
    // Handlers
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
    getDepartmentName,
    getLeadershipName,
    getLeadershipPosition,
    navigate
  };
};