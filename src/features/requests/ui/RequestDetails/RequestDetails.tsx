import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowRight,
  Calendar,
  Clock,
  User,
  MessageSquare,
  Send,
  Download,
  CheckCircle,
  Circle,
  Edit,
  HelpCircle,
  Star,
  FileText,
  Building2,
  Calendar as CalendarIcon,
  Trash2,
  UserPlus,
  Link2,
  Eye,
  ArrowRightLeft,
  RefreshCw,
  Save,
  Loader2,
} from "lucide-react";
import { useRequestDetailsLogic } from "./RequestDetails.logic";
import { useI18n } from "@/i18n";
import { StatusStepper } from "../StatusStepper";
import { RatingDialog } from "../RatingDialog";
import {
  getRequestStatusColor,
  getRequestStatusName,
} from "@/core/constants/requestStatuses";
import { getRequestTypeName } from "@/core/constants/requestTypes";
import { ATTACHMENT_TYPES } from "@/core/constants/attachmentTypes";

export function RequestDetailsPage() {
  const { t, language } = useI18n();
  const isRTL = language === "ar";
  const {
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
    userComplaints,
    request,
    requestAttachments,
    relatedRequest,
    selectedDepartmentId,
    selectedLeadershipId,
    departments,
    leaderships,

    // Constants
    RequestStatus,
    RequestType,
    VisitStatus,

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
    handleStatusChange,
    handleSubmitResponse,
    confirmSubmitResponse,
    handleSubmitFeedback,
    handleOpenRatingDialog,
    handleRatingSubmit,
    handleAcceptVisit,
    handleFileChange,
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
  } = useRequestDetailsLogic();

  // Debug: Track selectedDepartmentId changes
  useEffect(() => {
  }, [selectedDepartmentId]);

  // If still loading or no request, show loading state
  if (!request) {
    return <div>Loading...</div>;
  }

  // Filter attachments by type
  const requestFormAttachments =
    requestAttachments?.filter(
      (att) => att.attachmentTypeId === ATTACHMENT_TYPES.REQUEST
    ) || [];

  const resolutionAttachments =
    requestAttachments?.filter(
      (att) => att.attachmentTypeId === ATTACHMENT_TYPES.RESOLUTION
    ) || [];

  // Dynamically generate status steps based on current request status
  const currentStatusId = request.requestStatusId;
  const statusSteps = [
    {
      label: t("requests.requestStatuses.received"),
      status:
        currentStatusId >= RequestStatus.RECEIVED
          ? ("completed" as const)
          : ("pending" as const),
      statusText:
        currentStatusId >= RequestStatus.RECEIVED
          ? t("requests.statuses.completed")
          : t("requests.statuses.pending"),
    },
    {
      label: t("requests.requestStatuses.underReview"),
      status:
        currentStatusId === RequestStatus.UNDER_REVIEW
          ? ("in-progress" as const)
          : currentStatusId > RequestStatus.UNDER_REVIEW
          ? ("completed" as const)
          : ("pending" as const),
      statusText:
        currentStatusId === RequestStatus.UNDER_REVIEW
          ? t("requests.statuses.inProgress")
          : currentStatusId > RequestStatus.UNDER_REVIEW
          ? t("requests.statuses.completed")
          : t("requests.statuses.pending"),
    },
    {
      label: t("requests.requestStatuses.replied"),
      status:
        currentStatusId === RequestStatus.REPLIED
          ? ("in-progress" as const)
          : currentStatusId > RequestStatus.REPLIED
          ? ("completed" as const)
          : ("pending" as const),
      statusText:
        currentStatusId === RequestStatus.REPLIED
          ? t("requests.statuses.inProgress")
          : currentStatusId > RequestStatus.REPLIED
          ? t("requests.statuses.completed")
          : t("requests.statuses.pending"),
    },
    {
      label: t("requests.requestStatuses.closed"),
      status:
        currentStatusId === RequestStatus.CLOSED
          ? ("completed" as const)
          : ("pending" as const),
      statusText:
        currentStatusId === RequestStatus.CLOSED
          ? t("requests.statuses.completed")
          : t("requests.statuses.pending"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Back Button & Action Buttons Row */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/dashboard/track")}
              className="flex items-center gap-2 text-gray-600 hover:text-[#115740] transition-colors"
            >
              <ArrowRight className={`w-5 h-5 ${isRTL ? "rotate-180" : ""}`} />
              <span className="font-medium">
                {t("requests.backToRequestsList")}
              </span>
            </button>

            <div className="flex items-center gap-2">
              {/* Assign to Me Button - For Employees Only - Only show if not already assigned */}
              {isEmployee && !request.assignedToUserId && (
                <Button
                  variant="outline"
                  className="gap-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                  onClick={handleAssignToMe}
                >
                  <UserPlus className="w-4 h-4" />
                  {t("requests.assignToMe")}
                </Button>
              )}

              {/* Edit Button */}
              {canEditRequest?.() && (
                <Button
                  variant="outline"
                  className="gap-2 border-[#115740] text-[#115740] hover:bg-[#115740] hover:text-white"
                  onClick={() =>
                    navigate(`/dashboard/request/${request.id}/edit`)
                  }
                >
                  <Edit className="w-4 h-4" />
                  {t("requests.updateRequest")}
                </Button>
              )}

              {/* Delete Button - For Super Admin Only */}
              {isSuperAdmin && (
                <Button
                  variant="outline"
                  className="gap-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  onClick={handleDeleteRequest}
                >
                  <Trash2 className="w-4 h-4" />
                  {t("requests.deleteRequest")}
                </Button>
              )}

              {/* Convert to Complaint Button - For Visit Requests - Admin/Employee Only - Not Closed */}
              {(isAdmin || isEmployee || isSuperAdmin) &&
                request.requestTypeId === RequestType.VISIT &&
                request.requestStatusId !== RequestStatus.CLOSED && (
                  <Button
                    variant="outline"
                    className="gap-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white"
                    onClick={() => setIsConvertToComplaintDialogOpen(true)}
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                    {t("requests.convertToComplaint")}
                  </Button>
                )}

              {/* Link to Complaint Button - For Visit Requests - Admin/Employee Only */}
              {(isAdmin || isEmployee || isSuperAdmin) &&
                request.requestTypeId === RequestType.VISIT &&
                !request.redirectToNewRequest && (
                  <Button
                    variant="outline"
                    className="gap-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
                    onClick={() => setIsLinkComplaintDialogOpen(true)}
                  >
                    <Link2 className="w-4 h-4" />
                    {t("requests.linkComplaint")}
                  </Button>
                )}
            </div>
          </div>

          {/* Title, Status, Type, Request Number, and Status Change Dropdown */}
          <div className="space-y-4">
            {/* Request Title */}
            <h1 className="text-3xl font-bold text-[#115740]">
              {isRTL ? request.titleAr : request.titleEn || request.titleAr}
            </h1>

            {/* Request Metadata: Status, Type, Request Number, Status Dropdown, and Department Assignment */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Badge */}
              <Badge
                variant="outline"
                className={`px-3 py-1 font-medium ${getRequestStatusColor(
                  request.requestStatusId
                )}`}
              >
                {getRequestStatusName(
                  request.requestStatusId,
                  isRTL ? "ar" : "en"
                )}
              </Badge>

              {/* Request Type Badge */}
              <Badge
                variant="outline"
                className="px-3 py-1 bg-purple-100 text-purple-800 border-purple-200"
              >
                {getRequestTypeName(request.requestTypeId, isRTL ? "ar" : "en")}
              </Badge>

              {/* Request Number */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span className="font-mono font-medium">
                  {request.requestNumber}
                </span>
              </div>

              {/* Spacer to push controls to the end */}
              <div className="flex-1"></div>

              {/* Admin Department Assignment - For non-visit requests - ADMIN/SUPER ADMIN ONLY */}
              {(isAdmin || isSuperAdmin) &&
                !isEmployee &&
                request.requestTypeId !== RequestType.VISIT && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {t("requests.track.assignDepartment")}:
                    </span>
                    <Select
                      disabled={request.requestStatusId === RequestStatus.REPLIED || request.requestStatusId === RequestStatus.CLOSED}
                      value={
                        selectedDepartmentId !== null
                          ? selectedDepartmentId.toString()
                          : ""
                      }
                      onValueChange={(value: string) => {
                        const newDeptId = value ? parseInt(value, 10) : null;
                        setSelectedDepartmentId?.(newDeptId);
                      }}
                    >
                      <SelectTrigger className="w-[180px] h-9">
                        <SelectValue
                          placeholder={t("requests.track.selectDepartment")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>
                            {isRTL ? dept.nameAr : dept.nameEn || dept.nameAr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => {
                        if (selectedDepartmentId) {
                          handleAssignDepartment?.(selectedDepartmentId);
                        }
                      }}
                      disabled={!selectedDepartmentId || request.requestStatusId === RequestStatus.REPLIED || request.requestStatusId === RequestStatus.CLOSED}
                      size="sm"
                      className="bg-[#115740] hover:bg-[#0d4230] text-white h-9"
                    >
                      {t("requests.track.assign")}
                    </Button>
                  </div>
                )}

              {/* Admin/Super Admin Status Change Dropdown - ADMIN/SUPER ADMIN ONLY */}
              {(isAdmin || isSuperAdmin) && !isEmployee && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {t("requests.changeRequestStatus")}:
                  </span>
                  <Select
                    value={request.requestStatusId.toString()}
                    onValueChange={(value: string) => {
                      handleStatusChange?.(parseInt(value));
                    }}
                  >
                    <SelectTrigger className="w-[180px] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">
                        {t("requests.requestStatuses.received")}
                      </SelectItem>
                      <SelectItem value="2">
                        {t("requests.requestStatuses.underReview")}
                      </SelectItem>
                      <SelectItem value="3">
                        {t("requests.requestStatuses.replied")}
                      </SelectItem>
                      <SelectItem value="4">
                        {t("requests.requestStatuses.closed")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Leadership Assignment for Visit Requests */}
              {(isAdmin || isEmployee || isSuperAdmin) &&
                request.requestTypeId === RequestType.VISIT && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">
                      {t("requests.assignLeadership")}:
                    </span>
                    <Select
                      disabled={request.visitStatus === VisitStatus.ACCEPTED}
                      value={
                        selectedLeadershipId !== null
                          ? selectedLeadershipId.toString()
                          : ""
                      }
                      onValueChange={(value: string) => {
                        const leadershipId = value ? parseInt(value, 10) : null;
                        setSelectedLeadershipId?.(leadershipId);
                        if (leadershipId) {
                          handleAssignLeadership?.(leadershipId);
                        }
                      }}
                    >
                      <SelectTrigger className="w-[200px] h-9">
                        <SelectValue
                          placeholder={t("requests.selectLeadership")}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {leaderships.map((leadership) => (
                          <SelectItem
                            key={leadership.id}
                            value={leadership.id.toString()}
                          >
                            {isRTL
                              ? leadership.nameAr
                              : leadership.nameEn || leadership.nameAr}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* Redirected Visit Alert - Show when visit was converted to complaint - ABOVE Status Stepper */}
        {request.requestTypeId === RequestType.VISIT &&
          request.redirectToNewRequest &&
          request.relatedRequestId && (
            <div className="mb-6 bg-[#115740] rounded-lg shadow-md overflow-hidden">
              <div className="p-4 flex items-center gap-4">
                <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <ArrowRightLeft className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xl font-bold text-white mb-1">
                    {t("requests.visitRedirectedTitle")}
                  </h4>
                  <p className="text-white/90 text-sm">
                    {t("requests.visitRedirectedMessage")}
                  </p>
                </div>
                <Button
                  onClick={() =>
                    navigate(`/dashboard/request/${request.relatedRequestId}`)
                  }
                  className="bg-white text-[#115740] hover:bg-gray-100 shadow-md gap-2 font-semibold px-6"
                >
                  <Eye className="w-5 h-5" />
                  {t("requests.viewComplaint")}
                </Button>
              </div>
            </div>
          )}

        <StatusStepper steps={statusSteps} />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-[#115740] mb-4">
                {t("requests.requestDetails")}
              </h3>
              <div className="space-y-4">
                {/* For Visit Requests - Show Leadership Name */}
                {request.requestTypeId === RequestType.VISIT &&
                  request.universityLeadershipName && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">
                        {t("requests.leadershipToVisit")}
                      </p>
                      <p className="text-gray-700 leading-relaxed font-medium">
                        {request.universityLeadershipName}
                      </p>
                    </div>
                  )}

                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    {t("requests.description")}
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    {isRTL
                      ? request.subjectAr
                      : request.subjectEn || request.subjectAr}
                  </p>
                </div>

                {/* Additional Details if available */}
                {(request.additionalDetailsAr ||
                  request.additionalDetailsEn) && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">
                      {t("requests.additionalDetails")}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      {isRTL
                        ? request.additionalDetailsAr
                        : request.additionalDetailsEn ||
                          request.additionalDetailsAr}
                    </p>
                  </div>
                )}
                {/* Attachments section - Only show REQUEST type attachments (AttachmentTypeId = 1) */}
                {requestFormAttachments &&
                  requestFormAttachments.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-3">
                        {t("requests.attachments")}
                      </p>
                      <div className="space-y-2">
                        {requestFormAttachments.map((attachment) => (
                          <div
                            key={attachment.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-[#115740] rounded-lg flex items-center justify-center">
                                <Download className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {attachment.fileName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {attachment.fileSizeKb
                                    ? `${attachment.fileSizeKb} KB`
                                    : attachment.fileSize
                                    ? `${(attachment.fileSize / 1024).toFixed(
                                        2
                                      )} KB`
                                    : ""}
                                </p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="hover:bg-[#115740] hover:text-white"
                              onClick={() =>
                                handleDownloadAttachment?.(attachment)
                              }
                            >
                              <Download className="w-4 h-4 mr-2" />
                              {t("requests.download")}
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </Card>

            {/* Visit Schedule Information Card - Modern Redesigned */}
            {request.requestTypeId === RequestType.VISIT &&
              !request.redirectToNewRequest &&
              request.visitDate &&
              request.visitStatus && (
                <Card className="p-0 overflow-hidden border-0 shadow-2xl">
                  {/* Header Section */}
                  <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6">
                    {/* Decorative Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                          backgroundSize: "40px 40px",
                        }}
                      ></div>
                    </div>

                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-xl border-2 border-white/30">
                          <CalendarIcon className="w-8 h-8  drop-shadow-lg" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold  drop-shadow-md">
                            {t("requests.visitScheduleInfo")}
                          </h3>
                          <p className="text-sm text-white/80 mt-1">
                            {t("requests.visitDate")} & {t("common.status")}
                          </p>
                        </div>
                      </div>
                      {(isAdmin || isSuperAdmin || isEmployee) && (
                        <Badge
                          className={`${getVisitStatusColor(
                            request.visitStatus
                          )} px-4 py-2 text-base font-bold shadow-xl border-2 border-white/50`}
                        >
                          {getVisitStatusName(
                            request.visitStatus,
                            isRTL ? "ar" : "en"
                          )}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
                    <div className="space-y-6">
                      {/* Visit Date Card or Reschedule Message */}
                      {isUser && request.visitStatus === VisitStatus.RESCHEDULED ? (
                        // Show reschedule message when status is Rescheduled
                        <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200 rounded-xl p-6 text-center">
                          <div className="flex flex-col items-center justify-center gap-3">
                            <RefreshCw className="w-12 h-12 text-orange-600" />
                            <div>
                              <h3 className="text-lg font-bold text-orange-800 mb-1">
                                {t("requests.needsRescheduling")}
                              </h3>
                              <p className="text-orange-700">
                                {t("requests.visitDeclinedMessage")}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : isUser && request.visitStatus === VisitStatus.ACCEPTED ? (
                        // Show accepted/confirmed message for users when status is Accepted
                        <>
                          {/* Confirmation Hint for Accepted Visit */}
                          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                            <p className="text-sm text-blue-700">
                              {t("requests.visitWaitingMessage")}
                            </p>
                          </div>
                          
                          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-indigo-100 hover:shadow-xl transition-shadow">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                                <CalendarIcon className="w-6 h-6 text-white" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
                                  {t("requests.visitDate")}
                                </p>
                                <p className="text-xl font-bold text-gray-900">
                                  {new Date(request.visitDate).toLocaleString(
                                    isRTL ? "ar-SA" : "en-US",
                                    {
                                      dateStyle: "full",
                                      timeStyle: "short",
                                    }
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        // Show visit date when status is not Rescheduled
                        <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-indigo-100 hover:shadow-xl transition-shadow">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                              <CalendarIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2">
                                {t("requests.visitDate")}
                              </p>
                              {/* Show input for staff when Scheduled OR Rescheduled */}
                              {(isAdmin || isSuperAdmin || isEmployee) &&
                              (request.visitStatus === VisitStatus.SCHEDULED ||
                                request.visitStatus ===
                                  VisitStatus.RESCHEDULED) ? (
                                <Input
                                  type="datetime-local"
                                  value={
                                    visitDateTime ||
                                    new Date(request.visitDate)
                                      .toISOString()
                                      .slice(0, 16)
                                  }
                                  onChange={(e) =>
                                    setVisitDateTime(e.target.value)
                                  }
                                  min={new Date().toISOString().slice(0, 16)}
                                  className="text-base font-semibold border-2 border-indigo-200 focus:border-indigo-500 rounded-lg"
                                />
                              ) : (
                                <p className="text-xl font-bold text-gray-900">
                                  {new Date(request.visitDate).toLocaleString(
                                    isRTL ? "ar-SA" : "en-US",
                                    {
                                      dateStyle: "full",
                                      timeStyle: "short",
                                    }
                                  )}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* User Action Buttons - ONLY for Scheduled status */}
                      {isUser &&
                        request.visitStatus === VisitStatus.SCHEDULED && (
                          <div className="grid grid-cols-2 gap-4">
                            <Button
                              variant="outline"
                              className="h-14 border-3 border-orange-400 text-orange-600 hover:bg-orange-50 hover:border-orange-600 font-bold text-base rounded-xl shadow-md hover:shadow-lg transition-all"
                              onClick={() => {
                                if (request.visitId) {
                                  requestRescheduleMutation.mutate({ visitId: request.visitId });
                                }
                              }}
                            >
                              <RefreshCw className="w-5 h-5 mr-2" />
                              {t("requests.requestReschedule")}
                            </Button>
                            <Button
                              variant="outline"
                              className="h-14 border-3 border-orange-400 text-orange-600 hover:bg-orange-50 hover:border-orange-600 font-bold text-base rounded-xl shadow-md hover:shadow-lg transition-all"
                              onClick={() => {
                                handleAcceptVisit?.();
                              }}
                            >
                              <CheckCircle className="w-5 h-5 mr-2" />
                              {t("requests.acceptDate")}
                            </Button>
                          </div>
                        )}

                      {/* Staff Buttons - Reschedule & Complete */}
                      {(isEmployee || isAdmin || isSuperAdmin) && (
                        <div className="space-y-3">
                          {/* Reschedule Button - ONLY if status = Rescheduled */}
                          {request.visitStatus === VisitStatus.RESCHEDULED &&
                            visitDateTime && (
                              <Button
                                className="w-full h-14 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 hover:from-orange-700 hover:via-amber-700 hover:to-yellow-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                                onClick={() => {
                                  if (
                                    request.id &&
                                    visitDateTime &&
                                    request.universityLeadershipId
                                  ) {
                                    scheduleOrUpdateVisitMutation.mutate({
                                      requestId: request.id,
                                      visitDate: visitDateTime,
                                      leadershipId:
                                        request.universityLeadershipId,
                                      visitId: request.visitId,
                                      newStatus: VisitStatus.SCHEDULED,
                                    });
                                  }
                                }}
                              >
                                <CalendarIcon className="w-5 h-5 mr-2" />
                                {t("requests.rescheduleToNewDate")}
                              </Button>
                            )}

                          {/* Edit/Save Button - ONLY if status = Scheduled */}
                          {request.visitStatus === VisitStatus.SCHEDULED &&
                            visitDateTime &&
                            visitDateTime !==
                              new Date(request.visitDate)
                                .toISOString()
                                .slice(0, 16) && (
                              <Button
                                className="w-full h-14 bg-[#115740] hover:bg-[#0d4230] text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                                disabled={scheduleOrUpdateVisitMutation.isPending}
                                onClick={() => {
                                  if (
                                    request.id &&
                                    visitDateTime &&
                                    request.universityLeadershipId
                                  ) {
                                    scheduleOrUpdateVisitMutation.mutate({
                                      requestId: request.id,
                                      visitDate: visitDateTime,
                                      leadershipId:
                                      request.universityLeadershipId,
                                      visitId: request.visitId,
                                      newStatus: VisitStatus.SCHEDULED,
                                    });
                                  }
                                }}
                              >
                                {scheduleOrUpdateVisitMutation.isPending ? (
                                  <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    {t("common.saving")}
                                  </>
                                ) : (
                                  <>
                                    <Save className="w-5 h-5 mr-2" />
                                    {t("requests.saveVisitDate")}
                                  </>
                                )}
                              </Button>
                            )}

                          {/* Complete Visit Button - If date is today or past AND status is Accepted or Scheduled */}
                          {(request.visitStatus === VisitStatus.ACCEPTED ||
                            request.visitStatus === VisitStatus.SCHEDULED) &&
                            new Date(request.visitDate) <= new Date() && (
                              <Button
                                className="w-full h-14 bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 hover:from-teal-700 hover:via-cyan-700 hover:to-blue-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                                onClick={() => {
                                  if (request.id) {
                                    completeVisitMutation.mutate({
                                      requestId: request.id,
                                      visitId: request.visitId,
                                    });
                                  }
                                }}
                              >
                                <CheckCircle className="w-5 h-5 mr-2" />
                                {t("requests.completeVisit")}
                              </Button>
                            )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}

            {/* Employee Response Section - Add Reply/Visit Schedule */}
            {/* For Visit Type: Show when employee/admin AND status is UnderReview AND has leadership assigned */}
            {/* For Inquiry/Complaint: Show when has department AND status is UnderReview */}
            {(isEmployee || isAdmin || isSuperAdmin) &&
              ((request.requestTypeId === RequestType.VISIT &&
                request.requestStatusId === RequestStatus.UNDER_REVIEW &&
                request.universityLeadershipId) ||
                ((request.requestTypeId === RequestType.INQUIRY ||
                  request.requestTypeId === RequestType.COMPLAINT) &&
                  request.assignedDepartmentId &&
                  request.requestStatusId === RequestStatus.UNDER_REVIEW)) && (
                <Card className="p-6 bg-white border-gray-200">
                  <h4 className="text-lg font-semibold text-[#115740] mb-4 flex items-center gap-2">
                    <Send className="w-5 h-5" />
                    {request.requestTypeId === RequestType.VISIT
                      ? t("requests.scheduleVisit")
                      : t("requests.addResponse")}
                  </h4>
                  <div className="space-y-4">
                    {request.requestTypeId === RequestType.VISIT ? (
                      // Visit scheduling form - Only date/time
                      <div>
                        <Label
                          htmlFor="visitDateTime"
                          className="text-sm font-medium text-gray-700 mb-2 block"
                        >
                          {t("requests.visitDateTime")}
                        </Label>
                        <Input
                          id="visitDateTime"
                          type="datetime-local"
                          value={visitDateTime}
                          onChange={(e) => setVisitDateTime(e.target.value)}
                          min={new Date().toISOString().slice(0, 16)}
                          className="w-full"
                        />
                      </div>
                    ) : (
                      // Response text for complaints/inquiries
                      <>
                        <div>
                          <Label
                            htmlFor="responseText"
                            className="text-sm font-medium text-gray-700 mb-2 block"
                          >
                            {t("requests.responseText")}
                          </Label>
                          <Textarea
                            id="responseText"
                            placeholder={t("requests.writeResponseHere")}
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            rows={4}
                          />
                        </div>

                        <div>
                          <Label
                            htmlFor="attachments"
                            className="text-sm font-medium text-gray-700 mb-2 block"
                          >
                            {t("requests.attachments")}
                          </Label>
                          <Input
                            id="attachments"
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            className="w-full"
                          />
                          {attachments.length > 0 && (
                            <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                              {attachments.length} {t("requests.fileAttached")}
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    <Button
                      onClick={handleSubmitResponse}
                      className="w-full bg-[#115740] hover:bg-[#0d4230] text-white shadow-md"
                      disabled={
                        request.requestTypeId === RequestType.VISIT
                          ? !visitDateTime
                          : !responseText.trim()
                      }
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {t("requests.send")}
                    </Button>
                  </div>
                </Card>
              )}

            {/* Admin/Super Admin Edit Resolution Section - Show when status is REPLIED only */}
            {(isAdmin || isSuperAdmin) &&
              !isEmployee &&
              request.resolutionDetailsAr &&
              request.requestStatusId === RequestStatus.REPLIED && (
                <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-sm">
                  <h3 className="text-xl font-semibold text-[#115740] mb-4 flex items-center gap-2">
                    <Edit className="w-6 h-6 text-blue-600" />
                    {t("requests.editResponse")}
                  </h3>
            
                  <div className="space-y-4">
                    <div>
                      <Label
                        htmlFor="editResponseText"
                        className="text-sm font-medium text-gray-700 mb-2 block"
                      >
                        {t("requests.responseText")}
                      </Label>
                      <Textarea
                        id="editResponseText"
                        placeholder={t("requests.writeResponseHere")}
                        value={responseText || request.resolutionDetailsAr}
                        onChange={(e) => setResponseText(e.target.value)}
                        rows={6}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="editAttachments"
                        className="text-sm font-medium text-gray-700 mb-2 block"
                      >
                        {t("requests.attachments")}
                      </Label>
                      <Input
                        id="editAttachments"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="w-full"
                      />
                      {attachments.length > 0 && (
                        <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                          {attachments.length} {t("requests.fileAttached")}
                        </div>
                      )}
                    </div>

                    {/* Existing Attachments */}
                    {resolutionAttachments &&
                      resolutionAttachments.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-3">
                            {t("requests.currentAttachments")}
                          </p>
                          <div className="space-y-2">
                            {resolutionAttachments.map((attachment) => (
                              <div
                                key={attachment.id}
                                className="flex items-center justify-between p-3 bg-white rounded-xl border border-gray-200"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 bg-[#115740] rounded-lg flex items-center justify-center">
                                    <Download className="w-5 h-5 text-white" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">
                                      {attachment.fileName}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {attachment.fileSizeKb
                                        ? `${attachment.fileSizeKb} KB`
                                        : attachment.fileSize
                                        ? `${(
                                            attachment.fileSize / 1024
                                          ).toFixed(2)} KB`
                                        : ""}
                                    </p>
                                  </div>
                                </div>
          
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="hover:bg-[#115740] hover:text-white"
                                  onClick={() =>
                                    handleDownloadAttachment?.(attachment)
                                  }
                                >
                                  <Download className="w-4 h-4 mr-1" />
                                  {t("requests.download")}
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                    {/* Save Button */}
                    <Button
                      onClick={handleSubmitResponse}
                      className="w-full bg-[#115740] hover:bg-[#0d4230] text-white shadow-md"
                      disabled={!responseText.trim()}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {t("requests.saveChanges")}
                    </Button>

                    {request.resolvedBy && (
                      <div className="border-t pt-4 mt-4">
                        <p className="text-xs text-gray-500">
                          {t("requests.respondedBy")}: {request.resolvedBy}
                        </p>
                        {request.resolvedAt && (
                          <p className="text-xs text-gray-500">
                            {new Date(request.resolvedAt).toLocaleString(
                              isRTL ? "ar-SA" : "en-US"
                            )}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              )}

            {/* Employee/Read-Only Response Section - Show in REPLIED or CLOSED status for employees */}
            {isEmployee &&
              request.resolutionDetailsAr &&
              (request.requestStatusId === RequestStatus.REPLIED ||
                request.requestStatusId === RequestStatus.CLOSED) && (
                <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm" style={{ backgroundColor: "#f0f4f8" }}>
                  <h3 className="text-xl font-semibold text-[#115740] mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    {t("requests.responseToRequest")}
                  </h3>
            
                  <div className="space-y-4">
                    <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-md">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#115740] to-green-700 rounded-xl flex items-center justify-center">
                          <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {t("requests.employeeResponse")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {t("requests.responseFromDepartment")}
                          </p>
                        </div>
                      </div>
            
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {isRTL
                            ? request.resolutionDetailsAr
                            : request.resolutionDetailsEn ||
                              request.resolutionDetailsAr}
                        </p>
                      </div>

                      {resolutionAttachments &&
                        resolutionAttachments.length > 0 && (
                          <div className="border-t pt-4">
                            <p className="text-sm font-medium text-gray-700 mb-3">
                              {t("requests.responseAttachments")}
                            </p>
                            <div className="space-y-2">
                              {resolutionAttachments.map((attachment) => (
                                <div
                                  key={attachment.id}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#115740] rounded-lg flex items-center justify-center">
                                      <Download className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {attachment.fileName}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {attachment.fileSizeKb
                                          ? `${attachment.fileSizeKb} KB`
                                          : attachment.fileSize
                                          ? `${(
                                              attachment.fileSize / 1024
                                            ).toFixed(2)} KB`
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
            
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-[#115740] hover:text-white"
                                    onClick={() =>
                                      handleDownloadAttachment?.(attachment)
                                    }
                                  >
                                    <Download className="w-4 h-4 mr-1" />
                                    {t("requests.download")}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
            
                      {request.resolvedBy && (
                        <div className="border-t pt-4 mt-4">
                          <p className="text-xs text-gray-500">
                            {t("requests.respondedBy")}: {request.resolvedBy}
                          </p>
                          {request.resolvedAt && (
                            <p className="text-xs text-gray-500">
                              {new Date(request.resolvedAt).toLocaleString(
                                isRTL ? "ar-SA" : "en-US"
                              )}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}
            
            {/* Admin/Super Admin Read-Only Response Section - Show in CLOSED status */}
            {(isAdmin || isSuperAdmin) &&
              !isEmployee &&
              request.resolutionDetailsAr &&
              request.requestStatusId === RequestStatus.CLOSED && (
                <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm" style={{ backgroundColor: "#f0f4f8" }}>
                  <h3 className="text-xl font-semibold text-[#115740] mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    {t("requests.responseToRequest")}
                  </h3>
            
                  <div className="space-y-4">
                    <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-md">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#115740] to-green-700 rounded-xl flex items-center justify-center">
                          <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {t("requests.employeeResponse")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {t("requests.responseFromDepartment")}
                          </p>
                        </div>
                      </div>
            
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {isRTL
                            ? request.resolutionDetailsAr
                            : request.resolutionDetailsEn ||
                              request.resolutionDetailsAr}
                        </p>
                      </div>

                      {resolutionAttachments &&
                        resolutionAttachments.length > 0 && (
                          <div className="border-t pt-4">
                            <p className="text-sm font-medium text-gray-700 mb-3">
                              {t("requests.responseAttachments")}
                            </p>
                            <div className="space-y-2">
                              {resolutionAttachments.map((attachment) => (
                                <div
                                  key={attachment.id}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#115740] rounded-lg flex items-center justify-center">
                                      <Download className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {attachment.fileName}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {attachment.fileSizeKb
                                          ? `${attachment.fileSizeKb} KB`
                                          : attachment.fileSize
                                          ? `${(
                                              attachment.fileSize / 1024
                                            ).toFixed(2)} KB`
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
            
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-[#115740] hover:text-white"
                                    onClick={() =>
                                      handleDownloadAttachment?.(attachment)
                                    }
                                  >
                                    <Download className="w-4 h-4 mr-1" />
                                    {t("requests.download")}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                      {request.resolvedBy && (
                        <div className="border-t pt-4 mt-4">
                          <p className="text-xs text-gray-500">
                            {t("requests.respondedBy")}: {request.resolvedBy}
                          </p>
                          {request.resolvedAt && (
                            <p className="text-xs text-gray-500">
                              {new Date(request.resolvedAt).toLocaleString(
                                isRTL ? "ar-SA" : "en-US"
                              )}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}
                        
            {/* User Response Section - Show for users when resolution exists */}
            {isUser &&
              (request.resolutionDetailsAr || request.resolutionDetailsEn) && request.requestTypeId !== RequestType.VISIT && (
                <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm" style={{ backgroundColor: "#ffffff" }}>
                  <h3 className="text-xl font-semibold text-[#115740] mb-4 flex items-center gap-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    {t("requests.responseToRequest")}
                  </h3>
                        
                  <div className="space-y-4">
                    <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-md">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#115740] to-green-700 rounded-xl flex items-center justify-center">
                          <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {t("requests.employeeResponse")}
                          </p>
                          <p className="text-sm text-gray-600">
                            {t("requests.responseFromDepartment")}
                          </p>
                        </div>
                      </div>
                        
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {isRTL
                            ? request.resolutionDetailsAr
                            : request.resolutionDetailsEn ||
                              request.resolutionDetailsAr}
                        </p>
                      </div>
                        
                      {resolutionAttachments &&
                        resolutionAttachments.length > 0 && (
                          <div className="border-t pt-4">
                            <p className="text-sm font-medium text-gray-700 mb-3">
                              {t("requests.responseAttachments")}
                            </p>
                            <div className="space-y-2">
                              {resolutionAttachments.map((attachment) => (
                                <div
                                  key={attachment.id}
                                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#115740] rounded-lg flex items-center justify-center">
                                      <Download className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">
                                        {attachment.fileName}
                                      </p>
                                      <p className="text-xs text-gray-500">
                                        {attachment.fileSizeKb
                                          ? `${attachment.fileSizeKb} KB`
                                          : attachment.fileSize
                                          ? `${(
                                              attachment.fileSize / 1024
                                            ).toFixed(2)} KB`
                                          : ""}
                                      </p>
                                    </div>
                                  </div>
                        
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="hover:bg-[#115740] hover:text-white"
                                    onClick={() =>
                                      handleDownloadAttachment?.(attachment)
                                    }
                                  >
                                    <Download className="w-4 h-4 mr-1" />
                                    {t("requests.download")}
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
            
                      {request.resolvedBy && (
                        <div className="border-t pt-4 mt-4">
                          <p className="text-xs text-gray-500">
                            {t("requests.respondedBy")}: {request.resolvedBy}
                          </p>
                          {request.resolvedAt && (
                            <p className="text-xs text-gray-500">
                              {new Date(request.resolvedAt).toLocaleString(
                                isRTL ? "ar-SA" : "en-US"
                              )}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Request Info - Always show, but hide visit-specific info if redirected */}
            <Card className="p-6">
              <h4 className="text-[#115740] mb-4">
                {t("requests.requestInfo")}
              </h4>
                 {/* Related Request - Show if visit is related to previous request OR has linked complaint OR complaint converted from visit */}
                {((request.isVisitRelatedToPreviousRequest &&
                  request.relatedRequestId) ||
                  (request.requestTypeId === RequestType.VISIT &&
                    request.relatedRequestId &&
                    !request.redirectToNewRequest) ||
                  (request.requestTypeId === RequestType.COMPLAINT &&
                    request.relatedRequestId)) && (
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                          <Link2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-gray-700">
                            {t("requests.relatedRequest")}
                          </p>
                          <p className="text-xs text-gray-500">
                            {relatedRequest?.requestNumber ||
                              `#${request.relatedRequestId}`}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="gap-2 hover:bg-blue-100 text-blue-600"
                        onClick={() => setIsRelatedRequestDialogOpen(true)}
                      >
                        <Eye className="w-4 h-4" />
                        {t("requests.view")}
                      </Button>
                    </div>
                  </div>
                )}
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">
                      {t("requests.submissionDate")}
                    </p>
                    <p className="text-gray-900">
                      {new Date(request.createdAt).toLocaleDateString(
                        isRTL ? "ar-SA" : "en-US"
                      )}
                    </p>
                  </div>
                </div>

             

                {/* For Visit Requests (Type 3) - Show Leadership and Visit Date - Hide if redirected */}
                {request.requestTypeId === RequestType.VISIT &&
                  !request.redirectToNewRequest && (
                    <>
                      {/* Leadership Name - Always show */}
                      <div className="flex items-center gap-3 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="text-gray-500">
                            {t("requests.leadershipToVisit")}
                          </p>
                          <p className="text-gray-900 font-medium">
                            {request.universityLeadershipId
                              ? getLeadershipName(
                                  request.universityLeadershipId,
                                  isRTL ? "ar" : "en"
                                ) || t("requests.notAssigned")
                              : t("requests.notAssigned")}
                          </p>
                          {request.universityLeadershipId &&
                            getLeadershipPosition(
                              request.universityLeadershipId,
                              isRTL ? "ar" : "en"
                            ) && (
                              <p className="text-xs text-gray-500 mt-0.5">
                                {getLeadershipPosition(
                                  request.universityLeadershipId,
                                  isRTL ? "ar" : "en"
                                )}
                              </p>
                            )}
                        </div>
                      </div>

                      {/* Visit Date - Show if scheduled or Not Assigned */}
                      <div className="flex items-center gap-3 text-sm">
                        <CalendarIcon className="w-4 h-4 text-gray-400" />
                        <div className="flex-1">
                          <p className="text-gray-500">
                            {t("requests.visitDate")}
                          </p>
                          <p className="text-gray-900">
                            {request.visitDate
                              ? new Date(
                                  request.visitDate
                                ).toLocaleDateString(isRTL ? "ar-SA" : "en-US")
                              : t("requests.notAssigned")}
                          </p>
                          {/* Show rescheduling notice if needed */}
                          {request.visitStatus === VisitStatus.RESCHEDULED && (
                            <p className="text-xs text-red-600 mt-1 font-medium flex items-center gap-1">
                              <span>⚠️</span>
                              <span>{t("requests.needsRescheduling")}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                {/* For Non-Visit Requests (Type 1, 2) - Show Department and Main Category - Only for Admin/Employee/SuperAdmin */}
                {(request.requestTypeId === RequestType.INQUIRY ||
                  request.requestTypeId === RequestType.COMPLAINT) && (isAdmin || isEmployee || isSuperAdmin) && (
                  <>
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">
                          {t("requests.responsibleDepartment")}
                        </p>
                        <p className="text-gray-900">
                          {request.assignedDepartmentId
                            ? getDepartmentName(
                                request.assignedDepartmentId,
                                isRTL ? "ar" : "en"
                              ) || t("requests.notAssigned")
                            : t("requests.notAssigned")}
                        </p>
                      </div>
                    </div>

                    {/* Assigned User - Show for Inquiry and Complaint requests only, NOT for Visit requests */}
                    <div className="flex items-center gap-3 text-sm">
                      <UserPlus className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">
                          {t("requests.assignedUser")}
                        </p>
                        <p className="text-gray-900">
                          {request.assignedToUserId
                            ? isRTL
                              ? request.assignedToNameAr ||
                                t("requests.notAssigned")
                              : request.assignedToNameEn ||
                                request.assignedToNameAr ||
                                t("requests.notAssigned")
                            : t("requests.notAssigned")}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {/* Main Category - Show for everyone */}
                {(request.requestTypeId === RequestType.INQUIRY ||
                  request.requestTypeId === RequestType.COMPLAINT) &&
                  request.mainCategoryId && (
                    <div className="flex items-center gap-3 text-sm">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">
                          {t("form.mainCategory")}
                        </p>
                        <p className="text-gray-900">
                          {isRTL
                            ? request.mainCategoryNameAr ||
                              t("requests.notAssigned")
                            : request.mainCategoryNameEn ||
                              request.mainCategoryNameAr ||
                              t("requests.notAssigned")}
                        </p>
                      </div>
                    </div>
                  )}

                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">
                      {t("requests.processingTime")}
                    </p>
                    <p className="text-gray-900">
                      3-5 {t("requests.workDays")}
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* User Response Actions - Show when status is REPLIED - Hidden if visit was redirected to complaint */}
            {isUser &&
              request.requestStatusId === RequestStatus.REPLIED &&
              request.requestTypeId !== RequestType.VISIT && (
                <Card className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <HelpCircle className="w-5 h-5 text-[#115740]" />
                      <h4 className="text-[#115740] font-semibold">
                        {t("requests.satisfiedWithResponse")}
                      </h4>
                    </div>

                    <div className="space-y-3">
                      <Button
                        variant="outline"
                        className="w-full border-2 border-orange-600 text-orange-600 hover:bg-orange-50"
                        onClick={() => setIsReactivateDialogOpen(true)}
                      >
                        <span className="text-sm">
                          {t("requests.reactivateRequest")}
                        </span>
                      </Button>

                      <Button
                        className="w-full bg-[#115740] hover:bg-[#0d4230] text-white"
                        onClick={handleOpenRatingDialog}
                      >
                        <Star className="w-4 h-4 mr-2" />
                        {t("requests.thankYou")}
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
          </div>
        </div>
      </div>

      {/* Rating Dialog */}
      <RatingDialog
        open={isRatingDialogOpen}
        onOpenChange={setIsRatingDialogOpen}
        onSubmit={handleRatingSubmit || (() => {})}
      />

      {/* Delete Request Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">
              {t("requests.deleteRequest")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("requests.confirmDelete")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDeleteRequest}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteRequest}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Assign to Me Confirmation Dialog */}
      <AlertDialog
        open={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {t("requests.confirmAssignTitle")}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("requests.confirmAssignMessage")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelAssignToMe}>
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAssignToMe}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {t("common.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Related Request Details Dialog */}
      <AlertDialog
        open={isRelatedRequestDialogOpen}
        onOpenChange={setIsRelatedRequestDialogOpen}
      >
        <AlertDialogContent className="max-w-2xl" >
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-xl text-[#115740]">
              <Link2 className="w-6 h-6" />
              {t("requests.relatedRequestDetails")}
            </AlertDialogTitle>
          </AlertDialogHeader>

          {relatedRequest ? (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {/* Request Number and Status */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <span className="font-mono font-semibold text-gray-900">
                      {relatedRequest.requestNumber}
                    </span>
                  </div>
                  <Badge
                    className={getRequestStatusColor(
                      relatedRequest.requestStatusId
                    )}
                  >
                    {getRequestStatusName(
                      relatedRequest.requestStatusId,
                      isRTL ? "ar" : "en"
                    )}
                  </Badge>
                </div>
                <Badge
                  variant="outline"
                  className="bg-purple-100 text-purple-800 border-purple-200"
                >
                  {getRequestTypeName(
                    relatedRequest.requestTypeId,
                    isRTL ? "ar" : "en"
                  )}
                </Badge>
              </div>

              {/* Request Title */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-medium text-gray-500 mb-2">
                  {t("requests.title")}
                </p>
                <h3 className="text-lg font-semibold text-gray-900">
                  {isRTL
                    ? relatedRequest.titleAr
                    : relatedRequest.titleEn || relatedRequest.titleAr}
                </h3>
              </div>

              {/* Request Description */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <p className="text-sm font-medium text-gray-500 mb-2">
                  {t("requests.description")}
                </p>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {isRTL
                    ? relatedRequest.subjectAr
                    : relatedRequest.subjectEn || relatedRequest.subjectAr}
                </p>
              </div>

              {/* Submission Date */}
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="text-sm font-medium text-gray-500">
                    {t("requests.submissionDate")}
                  </p>
                </div>
                <p className="text-gray-900 mt-1">
                  {new Date(relatedRequest.createdAt).toLocaleString(
                    isRTL ? "ar-SA" : "en-US"
                  )}
                </p>
              </div>

              {/* Category Info if available */}
              {relatedRequest.mainCategoryId && (
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    {t("form.mainCategory")}
                  </p>
                  <p className="text-gray-900">
                    {isRTL
                      ? relatedRequest.mainCategoryNameAr ||
                        t("common.notAvailable")
                      : relatedRequest.mainCategoryNameEn ||
                        relatedRequest.mainCategoryNameAr ||
                        t("common.notAvailable")}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <p className="text-gray-500">{t("common.loading")}</p>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setIsRelatedRequestDialogOpen(false)}
            >
              {t("common.close")}
            </AlertDialogCancel>
            {relatedRequest && (
              <AlertDialogAction
                onClick={() => {
                  setIsRelatedRequestDialogOpen(false);
                  navigate(`/dashboard/request/${relatedRequest.id}`);
                }}
                className="bg-[#115740] hover:bg-[#0d4230]"
              >
                {t("requests.viewFullDetails")}
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Convert to Complaint Dialog */}
      <AlertDialog
        open={isConvertToComplaintDialogOpen}
        onOpenChange={setIsConvertToComplaintDialogOpen}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-orange-600">
              <ArrowRightLeft className="w-6 h-6" />
              {t("requests.convertToComplaint")}
            </AlertDialogTitle>
            <AlertDialogDescription className="space-y-4 pt-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800 font-medium">
                  {t("requests.convertToComplaintWarning")}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  {t("requests.selectDepartmentForComplaint")}
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  value={
                    convertDepartmentId !== null
                      ? convertDepartmentId.toString()
                      : ""
                  }
                  onValueChange={(value: string) =>
                    setConvertDepartmentId(value ? parseInt(value, 10) : null)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t("requests.track.selectDepartment")}
                    />
                  </SelectTrigger>
                  <SelectContent disablePortal position="popper" sideOffset={5}>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>
                        {isRTL ? dept.nameAr : dept.nameEn || dept.nameAr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsConvertToComplaintDialogOpen(false);
                setConvertDepartmentId(null);
              }}
            >
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConvertToComplaint}
              disabled={!convertDepartmentId}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {t("requests.confirmConvert")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Link Complaint to Visit Dialog */}
      <AlertDialog
        open={isLinkComplaintDialogOpen}
        onOpenChange={setIsLinkComplaintDialogOpen}
      >
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-blue-600">
              <Link2 className="w-6 h-6" />
              {t("requests.linkComplaintToVisit")}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-4 px-6 pb-4">
            {/* Current Related Complaint - Show if exists */}
            {request?.relatedRequestId && relatedRequest && (
              <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-semibold text-green-800">
                    {t("requests.currentLinkedComplaint")}
                  </p>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      setWantsToRemoveLink(true);
                      setSelectedComplaintId(null);
                    }}
                  >
                    {t("requests.removeLink")}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {relatedRequest.requestNumber}
                  </Badge>
                  <p className="text-sm text-gray-700 flex-1 truncate">
                    {isRTL
                      ? relatedRequest.titleAr
                      : relatedRequest.titleEn || relatedRequest.titleAr}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800 font-medium">
                {request?.relatedRequestId
                  ? t("requests.changeLinkedComplaint")
                  : t("requests.selectComplaintToLink")}
              </p>
            </div>

            {userComplaints && userComplaints.length > 0 ? (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  {t("requests.track.selectComplaint")}
                  {!request?.relatedRequestId && (
                    <span className="text-red-500 ml-1">*</span>
                  )}
                </Label>
                <Select
                  value={
                    selectedComplaintId !== null
                      ? selectedComplaintId.toString()
                      : ""
                  }
                  onValueChange={(value: string) => {
                    setSelectedComplaintId(value ? parseInt(value, 10) : null);
                    setWantsToRemoveLink(false); // Reset remove flag when selecting a complaint
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={t("requests.selectNewComplaint")}
                    />
                  </SelectTrigger>
                  <SelectContent disablePortal position="popper" sideOffset={5}>
                    {userComplaints
                      .filter(
                        (complaint: any) =>
                          complaint.id !== request?.relatedRequestId
                      )
                      .map((complaint: any) => (
                        <SelectItem
                          key={complaint.id}
                          value={complaint.id.toString()}
                        >
                          {complaint.requestNumber} -{" "}
                          {isRTL
                            ? complaint.titleAr
                            : complaint.titleEn || complaint.titleAr}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-600">
                  {t("requests.noComplaintsAvailable")}
                </p>
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsLinkComplaintDialogOpen(false);
                setSelectedComplaintId(null);
                setWantsToRemoveLink(false);
              }}
            >
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLinkComplaint}
              disabled={!wantsToRemoveLink && selectedComplaintId === null}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {wantsToRemoveLink
                ? t("requests.removeLink")
                : t("requests.linkComplaint")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reactivate Request Dialog */}
      <AlertDialog
        open={isReactivateDialogOpen}
        onOpenChange={setIsReactivateDialogOpen}
      >
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-orange-600">
              <RefreshCw className="w-6 h-6" />
              {t("requests.reactivateRequest")}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-4 px-6 pb-4">
            {/* Information hint */}
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <p className="text-sm text-blue-700">
                {t("requests.reactivateHint")}
              </p>
            </div>

            {/* Current Request Number - Disabled */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("requests.currentRequestNumber")}
              </Label>
              <Input
                value={request.requestNumber}
                disabled
                className="bg-gray-100"
              />
            </div>

            {/* Category - Disabled */}
            {request.mainCategoryId && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  {t("form.mainCategory")}
                </Label>
                <Input
                  value={
                    isRTL
                      ? request.mainCategoryNameAr || ""
                      : request.mainCategoryNameEn ||
                        request.mainCategoryNameAr ||
                        ""
                  }
                  disabled
                  className="bg-gray-100"
                />
              </div>
            )}

            {/* Title Arabic */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("form.titleAr")}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                value={reactivateTitleAr}
                onChange={(e) => handleReactivateFieldChange?.("titleAr", e.target.value)}
                placeholder={t("form.titleArPlaceholder")}
                dir="rtl"
                className={`text-right ${reactivateErrors.titleAr ? "border-red-500" : ""}`}
              />
              {reactivateErrors.titleAr && (
                <p className="text-red-500 text-sm">{reactivateErrors.titleAr}</p>
              )}
            </div>

            {/* Title English */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("form.titleEn")}
              </Label>
              <Input
                value={reactivateTitleEn}
                onChange={(e) => handleReactivateFieldChange?.("titleEn", e.target.value)}
                placeholder={t("form.titleEnPlaceholder")}
                dir="ltr"
                className={reactivateErrors.titleEn ? "border-red-500" : ""}
              />
              {reactivateErrors.titleEn && (
                <p className="text-red-500 text-sm">{reactivateErrors.titleEn}</p>
              )}
            </div>

            {/* Subject Arabic */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("form.subjectAr")}
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Textarea
                value={reactivateSubjectAr}
                onChange={(e) => handleReactivateFieldChange?.("subjectAr", e.target.value)}
                placeholder={t("form.subjectArPlaceholder")}
                dir="rtl"
                rows={4}
                className={`text-right resize-none ${reactivateErrors.subjectAr ? "border-red-500" : ""}`}
              />
              {reactivateErrors.subjectAr && (
                <p className="text-red-500 text-sm">{reactivateErrors.subjectAr}</p>
              )}
            </div>

            {/* Subject English */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                {t("form.subjectEn")}
              </Label>
              <Textarea
                value={reactivateSubjectEn}
                onChange={(e) => handleReactivateFieldChange?.("subjectEn", e.target.value)}
                placeholder={t("form.subjectEnPlaceholder")}
                dir="ltr"
                rows={4}
                className={`resize-none ${reactivateErrors.subjectEn ? "border-red-500" : ""}`}
              />
              {reactivateErrors.subjectEn && (
                <p className="text-red-500 text-sm">{reactivateErrors.subjectEn}</p>
              )}
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsReactivateDialogOpen(false);
                setReactivateTitleAr("");
                setReactivateTitleEn("");
                setReactivateSubjectAr("");
                setReactivateSubjectEn("");
                setReactivateErrors({});
              }}
            >
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReactivateRequest}
              disabled={!reactivateTitleAr.trim() || !reactivateSubjectAr.trim()}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {t("requests.createRequest")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Submit Response Confirmation Dialog - For Employees */}
      <AlertDialog
        open={isSubmitConfirmDialogOpen}
        onOpenChange={setIsSubmitConfirmDialogOpen}
      >
        <AlertDialogContent className="max-w-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2 text-orange-600">
              <Send className="w-6 h-6" />
              {t("requests.confirmSubmitResolution")}
            </AlertDialogTitle>
          </AlertDialogHeader>

          <div className="space-y-4 px-6 pb-4 max-h-[500px] overflow-y-auto">
            {/* Warning Message */}
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded">
              <p className="text-sm text-orange-800 font-medium">
                {t("requests.submitResolutionWarning")}
              </p>
              <p className="text-xs text-orange-700 mt-2">
                {t("requests.submitResolutionNote")}
              </p>
            </div>

            {/* Response Text Preview */}
            {responseText && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  {t("requests.responseText")}
                </Label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                    {responseText}
                  </p>
                </div>
              </div>
            )}

            {/* Visit Date Preview */}
            {visitDateTime && request.requestTypeId === RequestType.VISIT && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  {t("requests.visitDateTime")}
                </Label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 text-sm font-medium">
                    {new Date(visitDateTime).toLocaleString(
                      isRTL ? "ar-SA" : "en-US",
                      {
                        dateStyle: "full",
                        timeStyle: "short",
                      }
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Attachments Preview */}
            {attachments && attachments.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">
                  {t("requests.attachments")} ({attachments.length})
                </Label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="space-y-2">
                    {attachments.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setIsSubmitConfirmDialogOpen(false)}
            >
              {t("common.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmSubmitResponse}
              className="bg-[#115740] hover:bg-[#0d4230]"
            >
              {t("requests.confirmSubmit")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
