import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { requestsApi } from "@/features/requests/api/requests.api";
import { visitsApi } from "@/features/visits/api/visits.api";
import { queryKeys } from "@/core/lib/queryKeys";
import { RequestStatus } from "@/core/constants/requestStatuses";
import { RequestType } from "@/core/constants/requestTypes";
import { VisitStatus } from "@/core/constants/visitStatuses";
import { CreateRequestPayload } from "@/core/types/api";

export const useRequestMutations = (id: string | undefined, t: (key: string) => string, request?: any) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
        const updateResult = await visitsApi.updateVisit({ requestId, visitDate, leadershipId, visitId });

        if (newStatus) {
          return visitsApi.updateVisitStatus(visitId, {
            visitId,
            newStatus: newStatus,
          });
        }

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

      if (id) {
        updateStatusMutation.mutate({
          requestId: id,
          newStatus: RequestStatus.REPLIED,
        });
      }
    },
    onError: () => {
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
    mutationFn: (payload: { userRequestId: number; rating: number; feedbackAr: string; feedbackEn: string; userId?: number; ratedAt?: string }) =>
      requestsApi.submitRatingNew(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.requests.detail(id!),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      toast.success(t("requests.ratingSubmittedSuccessfully"));

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
      toast.success(t("requests.visitAcceptedSuccessfully"));
    },
    onError: () => {
      toast.error(t("requests.visitAcceptanceFailed"));
    },
  });

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
      departmentId: number | null;
    }) => {
      return requestsApi.assignDepartment(requestId, departmentId);
    },
    onSuccess: async () => {
      toast.success(t("requests.departmentAssignedSuccessfully"));

      // Debug: Log all relevant values
      console.log('Department assigned - checking if status update needed:', {
        id: id,
        hasRequest: !!request,
        requestTypeId: request?.requestTypeId,
        requestStatusId: request?.requestStatusId,
        isInquiry: request?.requestTypeId === RequestType.INQUIRY,
        isComplaint: request?.requestTypeId === RequestType.COMPLAINT,
        isReceived: request?.requestStatusId === RequestStatus.RECEIVED,
        INQUIRY_CONSTANT: RequestType.INQUIRY,
        COMPLAINT_CONSTANT: RequestType.COMPLAINT,
        RECEIVED_CONSTANT: RequestStatus.RECEIVED,
      });

      // Auto-update status to UNDER_REVIEW for INQUIRY/COMPLAINT if currently RECEIVED
      if (
        id &&
        request &&
        (request.requestTypeId === RequestType.INQUIRY ||
          request.requestTypeId === RequestType.COMPLAINT) &&
        request.requestStatusId === RequestStatus.RECEIVED
      ) {
        try {
          console.log('✅ Condition met! Updating request status to UNDER_REVIEW...');
          
          await requestsApi.updateRequestStatus(id, {
            requestId: parseInt(id, 10),
            newStatus: RequestStatus.UNDER_REVIEW,
          });
          
          console.log('✅ Status updated successfully to UNDER_REVIEW');
        } catch (error) {
          console.error('❌ Failed to update request status:', error);
          toast.error(t("requests.statusUpdateFailed") || "Failed to update status");
        }
      } else {
        console.log('❌ Condition NOT met - status will NOT be updated');
      }

      // Invalidate queries after status update
      await queryClient.invalidateQueries({
        queryKey: queryKeys.requests.detail(id!),
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
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
      toast.success(t("requests.deleteSuccess") || "Request deleted successfully");
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
        t("requests.assignedToMeSuccessfully") || "Request assigned to you successfully"
      );
    },
    onError: () => {
      toast.error(t("requests.assignToMeFailed") || "Failed to assign request");
    },
  });

  const convertToComplaintMutation = useMutation({
    mutationFn: async (payload: { complaintData: any; departmentId: number; visitRequestId: string }) => {
      const newComplaint = await requestsApi.createRequest(payload.complaintData);
      const newComplaintId = newComplaint.id;

      await requestsApi.assignDepartment(newComplaintId, payload.departmentId);

      // Update status to UNDER_REVIEW since department is already assigned
      await requestsApi.updateRequestStatus(newComplaintId.toString(), {
        requestId: newComplaintId,
        newStatus: RequestStatus.UNDER_REVIEW,
      });

      await requestsApi.updateRequestStatus(payload.visitRequestId, {
        requestId: parseInt(payload.visitRequestId, 10),
        newStatus: RequestStatus.CLOSED,
        redirectToNewRequest: true,
        relatedRequestId: newComplaintId,
      });

      return { id: newComplaintId };
    },
    onSuccess: async (result) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
      toast.success(
        t("requests.convertedToComplaintSuccess") || "Visit successfully converted to complaint"
      );
      navigate(`/dashboard/request/${result.id}`);
    },
    onError: () => {
      toast.error(
        t("requests.convertToComplaintFailed") || "Failed to convert visit to complaint"
      );
    },
  });

  const linkComplaintMutation = useMutation({
    mutationFn: async (complaintId: number | null) => {
      if (!id) throw new Error("Visit ID is required");
      return requestsApi.assignRelatedRequest(id, complaintId);
    },
    onSuccess: async (_data, variables) => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.requests.detail(id!),
      });
      await queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });

      if (variables === null) {
        toast.success(
          t("requests.complaintUnlinkedSuccessfully") || "Complaint unlinked from visit successfully"
        );
      } else {
        toast.success(
          t("requests.complaintLinkedSuccessfully") || "Complaint linked to visit successfully"
        );
      }
    },
    onError: () => {
      toast.error(
        t("requests.complaintLinkFailed") || "Failed to link complaint to visit"
      );
    },
  });

  const reactivateRequestMutation = useMutation({
    mutationFn: async (payload: { requestPayload: CreateRequestPayload; assignedDepartmentId?: number | null }) => {
      const newRequest = await requestsApi.createRequest(payload.requestPayload);
        
      // Set the new reactivated request status to UNDER_REVIEW
      await requestsApi.updateRequestStatus(newRequest.id, {
        requestId: newRequest.id,
        newStatus: RequestStatus.UNDER_REVIEW,
      });
        
      if (payload.assignedDepartmentId) {
        await requestsApi.assignDepartment(newRequest.id, payload.assignedDepartmentId);
      }
        
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
        t("requests.requestReactivatedSuccess") || "Request reactivated successfully"
      );
      navigate(`/dashboard/request/${result.id}`);
    },
    onError: () => {
      toast.error(
        t("requests.requestReactivateFailed") || "Failed to reactivate request"
      );
    },
  });

  return {
    updateStatusMutation,
    scheduleOrUpdateVisitMutation,
    submitResolutionMutation,
    submitRatingMutation,
    acceptVisitMutation,
    requestRescheduleMutation,
    completeVisitMutation,
    assignDepartmentMutation,
    deleteRequestMutation,
    assignToMeMutation,
    convertToComplaintMutation,
    linkComplaintMutation,
    reactivateRequestMutation,
  };
};
