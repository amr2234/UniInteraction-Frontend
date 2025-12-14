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
} from "lucide-react";
import { useRequestDetailsLogic } from "./RequestDetails.logic";
import { useI18n } from "@/i18n";
import { StatusStepper } from "./StatusStepper";
import { RatingDialog } from "./RatingDialog";
import { getRequestStatusColor, getRequestStatusName } from "@/core/constants/requestStatuses";
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
    request,
    requestAttachments,
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
    getDepartmentName,
    getLeadershipName,
    navigate
  } = useRequestDetailsLogic();

  // If still loading or no request, show loading state
  if (!request) {
    return <div>Loading...</div>;
  }

  // Filter attachments by type
  const requestFormAttachments = requestAttachments?.filter(
    (att) => att.attachmentTypeId === ATTACHMENT_TYPES.REQUEST
  ) || [];
  
  const resolutionAttachments = requestAttachments?.filter(
    (att) => att.attachmentTypeId === ATTACHMENT_TYPES.RESOLUTION
  ) || [];

  // Dynamically generate status steps based on current request status
  const currentStatusId = request.requestStatusId;
  const statusSteps = [
    {
      label: t("requests.requestStatuses.received"),
      status: currentStatusId >= RequestStatus.RECEIVED ? "completed" as const : "pending" as const,
      statusText: currentStatusId >= RequestStatus.RECEIVED ? t("requests.statuses.completed") : t("requests.statuses.pending"),
    },
    {
      label: t("requests.requestStatuses.underReview"),
      status: currentStatusId === RequestStatus.UNDER_REVIEW ? "in-progress" as const : currentStatusId > RequestStatus.UNDER_REVIEW ? "completed" as const : "pending" as const,
      statusText: currentStatusId === RequestStatus.UNDER_REVIEW ? t("requests.statuses.inProgress") : currentStatusId > RequestStatus.UNDER_REVIEW ? t("requests.statuses.completed") : t("requests.statuses.pending"),
    },
    {
      label: t("requests.requestStatuses.replied"),
      status: currentStatusId === RequestStatus.REPLIED ? "in-progress" as const : currentStatusId > RequestStatus.REPLIED ? "completed" as const : "pending" as const,
      statusText: currentStatusId === RequestStatus.REPLIED ? t("requests.statuses.inProgress") : currentStatusId > RequestStatus.REPLIED ? t("requests.statuses.completed") : t("requests.statuses.pending"),
    },
    {
      label: t("requests.requestStatuses.closed"),
      status: currentStatusId === RequestStatus.CLOSED ? "completed" as const : "pending" as const,
      statusText: currentStatusId === RequestStatus.CLOSED ? t("requests.statuses.completed") : t("requests.statuses.pending"),
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          {/* Back Button & Edit Button Row */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => navigate("/dashboard/track")}
              className="flex items-center gap-2 text-gray-600 hover:text-[#115740] transition-colors"
            >
              <ArrowRight className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
              <span className="font-medium">{t("requests.backToRequestsList")}</span>
            </button>
            {canEditRequest() && (
              <Button
                variant="outline"
                className="gap-2 border-[#115740] text-[#115740] hover:bg-[#115740] hover:text-white"
                onClick={() => navigate(`/dashboard/request/${request.id}/edit`)}
              >
                <Edit className="w-4 h-4" />
                {t("requests.updateRequest")}
              </Button>
            )}
          </div>

          {/* Title, Status, Type, Request Number, and Status Change Dropdown */}
          <div className="space-y-4">
            {/* Request Title */}
            <h1 className="text-3xl font-bold text-[#115740]">
              {isRTL ? request.titleAr : (request.titleEn || request.titleAr)}
            </h1>
            
            {/* Request Metadata: Status, Type, Request Number, Status Dropdown, and Department Assignment */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Status Badge */}
              <Badge 
                variant="outline" 
                className={`px-3 py-1 font-medium ${getRequestStatusColor(request.requestStatusId)}`}
              >
                {getRequestStatusName(request.requestStatusId, isRTL ? 'ar' : 'en')}
              </Badge>
              
              {/* Request Type Badge */}
              <Badge variant="outline" className="px-3 py-1 bg-purple-100 text-purple-800 border-purple-200">
                {getRequestTypeName(request.requestTypeId, isRTL ? 'ar' : 'en')}
              </Badge>
              
              {/* Request Number */}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileText className="w-4 h-4" />
                <span className="font-mono font-medium">{request.requestNumber}</span>
              </div>
              
              {/* Spacer to push controls to the end */}
              <div className="flex-1"></div>
              
              {/* Admin Department Assignment - For non-visit requests */}
              {(canAssignRequests || isSuperAdmin) && request.requestTypeId !== RequestType.VISIT && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{t("requests.track.assignDepartment")}:</span>
                  <Select
                    value={selectedDepartmentId !== null ? selectedDepartmentId.toString() : ""}
                    onValueChange={(value: string) => setSelectedDepartmentId(value ? parseInt(value, 10) : null)}
                  >
                    <SelectTrigger className="w-[180px] h-9">
                      <SelectValue placeholder={t("requests.track.selectDepartment")} />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>
                          {isRTL ? dept.nameAr : (dept.nameEn || dept.nameAr)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={() => {
                      if (selectedDepartmentId) {
                        handleAssignDepartment(selectedDepartmentId);
                      }
                    }}
                    disabled={!selectedDepartmentId}
                    size="sm"
                    className="bg-[#115740] hover:bg-[#0d4230] text-white h-9"
                  >
                    {t("requests.track.assign")}
                  </Button>
                </div>
              )}
              
              {/* Admin/Employee Status Change Dropdown - At the end of row */}
              {(isAdmin || isEmployee || isSuperAdmin) && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{t("requests.changeRequestStatus")}:</span>
                  <Select
                    value={request.requestStatusId.toString()}
                    onValueChange={(value: string) => {
                      handleStatusChange(parseInt(value));
                    }}
                  >
                    <SelectTrigger className="w-[180px] h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">{t("requests.requestStatuses.received")}</SelectItem>
                      <SelectItem value="2">{t("requests.requestStatuses.underReview")}</SelectItem>
                      <SelectItem value="3">{t("requests.requestStatuses.replied")}</SelectItem>
                      <SelectItem value="4">{t("requests.requestStatuses.closed")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              
              {/* Leadership Assignment for Visit Requests */}
              {(isAdmin || isEmployee || isSuperAdmin) && request.requestTypeId === RequestType.VISIT && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{t("requests.assignLeadership")}:</span>
                  <Select
                    value={selectedLeadershipId !== null ? selectedLeadershipId.toString() : ""}
                    onValueChange={(value: string) => {
                      const leadershipId = value ? parseInt(value, 10) : null;
                      setSelectedLeadershipId(leadershipId);
                      if (leadershipId) {
                        handleAssignLeadership(leadershipId);
                      }
                    }}
                  >
                    <SelectTrigger className="w-[200px] h-9">
                      <SelectValue placeholder={t("requests.selectLeadership")} />
                    </SelectTrigger>
                    <SelectContent>
                      {leaderships.map((leadership) => (
                        <SelectItem key={leadership.id} value={leadership.id.toString()}>
                          {isRTL ? leadership.nameAr : (leadership.nameEn || leadership.nameAr)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </div>

      <StatusStepper steps={statusSteps} />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-[#115740] mb-4">{t("requests.requestDetails")}</h3>
              <div className="space-y-4">
                {/* For Visit Requests - Show Leadership Name */}
                {request.requestTypeId === RequestType.VISIT && request.universityLeadershipName && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">{t("requests.leadershipToVisit")}</p>
                    <p className="text-gray-700 leading-relaxed font-medium">
                      {request.universityLeadershipName}
                    </p>
                  </div>
                )}
                
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">{t("requests.description")}</p>
                  <p className="text-gray-700 leading-relaxed">
                    {isRTL 
                      ? request.subjectAr 
                      : (request.subjectEn || request.subjectAr)
                    }
                  </p>
                </div>
                
                {/* Additional Details if available */}
                {(request.additionalDetailsAr || request.additionalDetailsEn) && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-2">{t("requests.additionalDetails")}</p>
                    <p className="text-gray-700 leading-relaxed">
                      {isRTL 
                        ? request.additionalDetailsAr 
                        : (request.additionalDetailsEn || request.additionalDetailsAr)
                      }
                    </p>
                  </div>
                )}
                {/* Attachments section - Only show REQUEST type attachments (AttachmentTypeId = 1) */}
                {requestFormAttachments && requestFormAttachments.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-3">{t("requests.attachments")}</p>
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
                              <p className="text-sm font-medium text-gray-900">{attachment.fileName}</p>
                              <p className="text-xs text-gray-500">{attachment.fileSize ? `${(attachment.fileSize / 1024).toFixed(2)} KB` : ''}</p>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="hover:bg-[#115740] hover:text-white"
                            onClick={() => handleDownloadAttachment(attachment)}
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
            
            {/* Employee Response Section - Add Reply/Visit Schedule */}
            {/* For Visit Type: Show when employee/admin AND status is UnderReview AND has leadership assigned */}
            {/* For Inquiry/Complaint: Show when has department AND status is UnderReview */}
            {(isEmployee || isAdmin || isSuperAdmin) && (
              (request.requestTypeId === RequestType.VISIT && request.requestStatusId === RequestStatus.UNDER_REVIEW && request.universityLeadershipId) ||
              ((request.requestTypeId === RequestType.INQUIRY || request.requestTypeId === RequestType.COMPLAINT) && request.assignedDepartmentId && request.requestStatusId === RequestStatus.UNDER_REVIEW)
            ) && (
              <Card className="p-6 bg-white border-gray-200">
                <h4 className="text-lg font-semibold text-[#115740] mb-4 flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  {request.requestTypeId === RequestType.VISIT ? t("requests.scheduleVisit") : t("requests.addResponse")}
                </h4>
                <div className="space-y-4">
                  {request.requestTypeId === RequestType.VISIT ? (
                    // Visit scheduling form - Only date/time
                    <div>
                      <Label htmlFor="visitDateTime" className="text-sm font-medium text-gray-700 mb-2 block">
                        {t("requests.visitDateTime")}
                      </Label>
                      <Input
                        id="visitDateTime"
                        type="datetime-local"
                        value={visitDateTime}
                        onChange={(e) => setVisitDateTime(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  ) : (
                    // Response text for complaints/inquiries
                    <>
                      <div>
                        <Label htmlFor="responseText" className="text-sm font-medium text-gray-700 mb-2 block">
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
                        <Label htmlFor="attachments" className="text-sm font-medium text-gray-700 mb-2 block">
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
                    disabled={request.requestTypeId === RequestType.VISIT ? !visitDateTime : !responseText.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {t("requests.send")}
                  </Button>
                </div>
              </Card>
            )}
            
            {/* Employee Response Section - Show when status is REPLIED or CLOSED */}
            {isUser && (request.requestStatusId === RequestStatus.REPLIED || request.requestStatusId === RequestStatus.CLOSED) && (
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-sm">
                <h3 className="text-xl font-semibold text-[#115740] mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  {request.requestTypeId === RequestType.VISIT ? t("requests.visitInfo") : t("requests.responseToRequest")}
                </h3>
                
                {/* For Visit Requests - Show Visit Schedule using available fields */}
                {request.requestTypeId === RequestType.VISIT && request.visitStartAt && (
                  <div className="space-y-4">
                    {/* Cool Visit Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-md border-2 border-green-300">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#115740] to-green-700 rounded-xl flex items-center justify-center">
                          <CalendarIcon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{t("requests.visitScheduled")}</p>
                          <p className="text-sm text-gray-600">{t("requests.visitDetailsBelow")}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <Calendar className="w-5 h-5 text-[#115740] mt-1" />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{t("requests.visitDate")}</p>
                            <p className="text-base font-semibold text-gray-900">
                              {new Date(request.visitStartAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <Clock className="w-5 h-5 text-[#115740] mt-1" />
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{t("requests.visitTime")}</p>
                            <p className="text-base font-semibold text-gray-900">
                              {new Date(request.visitStartAt).toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                              {request.visitEndAt && ` - ${new Date(request.visitEndAt).toLocaleTimeString(isRTL ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}`}
                            </p>
                          </div>
                        </div>
                        
                        {request.resolutionDetailsAr && (
                          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <Building2 className="w-5 h-5 text-[#115740] mt-1" />
                            <div className="flex-1">
                              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{t("requests.visitLocation")}</p>
                              <p className="text-base font-semibold text-gray-900">
                                {isRTL ? request.resolutionDetailsAr : (request.resolutionDetailsEn || request.resolutionDetailsAr)}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {request.resolvedBy && (
                          <div className="pt-3 border-t border-gray-200">
                            <p className="text-xs text-gray-500">
                              <span className="font-medium">{t("requests.scheduledBy")}:</span> {request.resolvedBy}
                            </p>
                            {request.resolvedAt && (
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(request.resolvedAt).toLocaleString(isRTL ? 'ar-SA' : 'en-US')}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Accept/Decline Buttons for Visit - Only show when REPLIED */}
                    {request.requestStatusId === RequestStatus.REPLIED && (
                      <div className="grid grid-cols-2 gap-3">
                        <Button 
                          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-md"
                          onClick={handleAcceptVisit}
                        >
                          <CheckCircle className="w-5 h-5 mr-2" />
                          {t("requests.acceptVisit")}
                        </Button>
                        <Button 
                          variant="outline"
                          className="w-full border-2 border-red-600 text-red-600 hover:bg-red-50 font-medium"
                          onClick={handleDeclineVisit}
                        >
                          {t("requests.declineVisit")}
                        </Button>
                      </div>
                    )}
                    
                    {/* Message for declined visit */}
                    {!!request?.needDateReschedule && (
                      <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                          {t("requests.visitDeclinedMessage")}
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* For Inquiry/Complaint - Show Employee Response using resolutionDetails */}
                {(request.requestTypeId === RequestType.INQUIRY || request.requestTypeId === RequestType.COMPLAINT) && request.resolutionDetailsAr && (
                  <div className="space-y-4">
                    <div className="bg-white p-6 rounded-xl border-2 border-green-200 shadow-md">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-[#115740] to-green-700 rounded-xl flex items-center justify-center">
                          <MessageSquare className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-lg font-semibold text-gray-900">{t("requests.employeeResponse")}</p>
                          <p className="text-sm text-gray-600">{t("requests.responseFromDepartment")}</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-4 rounded-lg mb-4">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                          {isRTL ? request.resolutionDetailsAr : (request.resolutionDetailsEn || request.resolutionDetailsAr)}
                        </p>
                      </div>
                      
                      {/* Only show RESOLUTION type attachments (AttachmentTypeId = 2) */}
                      {resolutionAttachments && resolutionAttachments.length > 0 && (
                        <div className="border-t pt-4">
                          <p className="text-sm font-medium text-gray-700 mb-3">{t("requests.responseAttachments")}</p>
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
                                      {attachment.fileSize ? `${(attachment.fileSize / 1024).toFixed(2)} KB` : ''}
                                    </p>
                                  </div>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  className="hover:bg-[#115740] hover:text-white"
                                  onClick={() => handleDownloadAttachment(attachment)}
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
                          <p className="text-xs text-gray-500">{t("requests.respondedBy")}: {request.resolvedBy}</p>
                          {request.resolvedAt && (
                            <p className="text-xs text-gray-500">
                              {new Date(request.resolvedAt).toLocaleString(isRTL ? 'ar-SA' : 'en-US')}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            )}

            
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Request Info */}
            <Card className="p-6">
              <h4 className="text-[#115740] mb-4">{t("requests.requestInfo")}</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">{t("requests.submissionDate")}</p>
                    <p className="text-gray-900">
                      {new Date(request.createdAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                    </p>
                  </div>
                </div>
                
                {/* For Visit Requests (Type 3) - Show Leadership and Visit Date */}
                {request.requestTypeId === RequestType.VISIT && (
                  <>
                    {/* Leadership Name - Always show */}
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="text-gray-500">{t("requests.leadershipToVisit")}</p>
                        <p className="text-gray-900">
                          {request.universityLeadershipId
                            ? getLeadershipName(request.universityLeadershipId, isRTL ? 'ar' : 'en') || t("requests.notAssigned")
                            : t("requests.notAssigned")}
                        </p>
                      </div>
                    </div>
                    
                    {/* Visit Date - Show if scheduled or Not Assigned */}
                    <div className="flex items-center gap-3 text-sm">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <div className="flex-1">
                        <p className="text-gray-500">{t("requests.visitDate")}</p>
                        <p className="text-gray-900">
                          {request.visitStartAt 
                            ? new Date(request.visitStartAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')
                            : t("requests.notAssigned")}
                        </p>
                        {/* Show rescheduling notice if needed */}
                        {request.needDateReschedule && (
                          <p className="text-xs text-orange-600 mt-1 font-medium flex items-center gap-1">
                            <span>⚠️</span>
                            <span>{t("requests.needsRescheduling")}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                )}
                
                {/* For Non-Visit Requests (Type 1, 2) - Show Department */}
                {(request.requestTypeId === RequestType.INQUIRY || request.requestTypeId === RequestType.COMPLAINT) && (
                  <div className="flex items-center gap-3 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">{t("requests.responsibleDepartment")}</p>
                      <p className="text-gray-900">
                        {request.assignedDepartmentId 
                          ? getDepartmentName(request.assignedDepartmentId, isRTL ? 'ar' : 'en') || t("requests.notAssigned")
                          : t("requests.notAssigned")
                        }
                      </p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">{t("requests.processingTime")}</p>
                    <p className="text-gray-900">3-5 {t("requests.workDays")}</p>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* User Response Actions - Show when status is REPLIED */}
            {isUser && request.requestStatusId === RequestStatus.REPLIED && (
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <HelpCircle className="w-5 h-5 text-[#115740]" />
                    <h4 className="text-[#115740] font-semibold">{t("requests.satisfiedWithResponse")}</h4>
                  </div>
                  <div className="space-y-3">
                    <Button 
                      variant="outline"
                      className="w-full border-2 border-orange-600 text-orange-600 hover:bg-orange-50"
                      onClick={() => {
                        navigate(`/dashboard/request/new?type=${request.requestTypeId}&relatedTo=${request.id}`);
                      }}
                    >
                      <span className="text-sm">{t("requests.reactivateRequest")}</span>
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

            {/* User Feedback Section - Show when status is CLOSED */}
            {isUser && request.requestStatusId === RequestStatus.CLOSED && (
              <Card className="p-6">
                <h4 className="text-[#115740] font-semibold mb-4">{t("requests.requestEvaluation")}</h4>
                <div className="space-y-4">
                  {/* Reactivate Request Button */}
                  <Button 
                    variant="outline"
                    className="w-full border-2 border-orange-600 text-orange-600 hover:bg-orange-50"
                    onClick={() => {
                      navigate(`/dashboard/request/new?type=${request.requestTypeId}&relatedTo=${request.id}`);
                    }}
                  >
                    <span className="text-sm">{t("requests.reactivateRequest")}</span>
                  </Button>
                  
                  <div>
                    <Label className="text-sm text-gray-700 mb-2 block">
                      {t("requests.rating")}
                    </Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-6 h-6 cursor-pointer ${
                            star <= rating 
                              ? "text-yellow-500 fill-current" 
                              : "text-gray-300"
                          }`}
                          onClick={() => setRating(star)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="feedback" className="text-sm text-gray-700 mb-2 block">
                      {t("requests.comment")}
                    </Label>
                    <Textarea
                      id="feedback"
                      placeholder={t("requests.shareYourExperience")}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      rows={3}
                      className="resize-none"
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSubmitFeedback}
                    className="w-full bg-[#115740] hover:bg-[#0d4230] text-white"
                    disabled={rating === 0}
                  >
                    {t("requests.submitRating")}
                  </Button>
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
        onSubmit={handleRatingSubmit}
      />
    </div>
  );
}
