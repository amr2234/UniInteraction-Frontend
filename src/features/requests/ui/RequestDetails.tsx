import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  UserPlus,
  Calendar as CalendarIcon,
} from "lucide-react";
import { useRequestDetailsLogic } from "./RequestDetails.logic";
import { useI18n } from "@/i18n";
import { StatusStepper } from "./StatusStepper";

export function RequestDetailsPage() {
  const { t, language } = useI18n();
  const isRTL = language === "ar";
  const {
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
    requestAttachments,
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
  } = useRequestDetailsLogic();


  // Dynamically generate status steps based on current request status
  const currentStatusId = requestMock.statusId;
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
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate("/dashboard/track")}
              className="flex items-center gap-2 text-gray-600 hover:text-[#115740]"
            >
              <ArrowRight className="w-5 h-5" />
              <span>{t("requests.backToRequestsList")}</span>
            </button>
            {canEditRequest() && (
              <Button
                variant="outline"
                className="gap-2 border-[#115740] text-[#115740] hover:bg-[#115740] hover:text-white"
                onClick={() => navigate(`/dashboard/request/${requestMock.id}/edit`)}
              >
                <Edit className="w-4 h-4" />
                {t("requests.updateRequest")}
              </Button>
            )}
          </div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-[#115740]">{requestMock.titleAr}</h1>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-sm ${requestMock.statusColor}`}>
                  {requestMock.status}
                </span>
                <span className="text-sm text-gray-500">{requestMock.type}</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-500">{requestMock.id || 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

      <StatusStepper steps={statusSteps} />

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Request Details */}
            <Card className="p-6">
              <h3 className="text-[#115740] mb-4">{t("requests.requestDetails")}</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">{t("requests.description")}</p>
                  <p className="text-gray-700">{requestMock.subjectAr}</p>
                </div>
                {requestAttachments.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">{t("requests.attachments")}</p>
                    {requestAttachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#115740] rounded-lg flex items-center justify-center">
                            <Download className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                            <p className="text-xs text-gray-500">{attachment.size}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          {t("requests.download")}
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Card>
            
            {/* Employee Response Section - Show when status is تم الرد (REPLIED) */}
            {isUser && requestMock.statusId === RequestStatus.REPLIED && (
              <Card className="p-6 bg-green-50 border-green-200">
                <h3 className="text-[#115740] mb-4">
                  {requestMock.requestTypeId === 4 ? 'معلومات الزيارة' : 'الرد على الطلب'}
                </h3>
                
                {/* For Visit Requests - Show Visit Schedule */}
                {requestMock.requestTypeId === 4 && requestMock.visitSchedule && (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl">
                      <div className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-[#115740] mt-1" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-1">تاريخ الزيارة</p>
                            <p className="text-gray-900 font-medium">{requestMock.visitSchedule.visitDate}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <Clock className="w-5 h-5 text-[#115740] mt-1" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-1">وقت الزيارة</p>
                            <p className="text-gray-900 font-medium">{requestMock.visitSchedule.visitTime}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <User className="w-5 h-5 text-[#115740] mt-1" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-500 mb-1">مكان الزيارة</p>
                            <p className="text-gray-900 font-medium">{requestMock.visitSchedule.visitLocation}</p>
                          </div>
                        </div>
                        
                        <div className="pt-3 border-t">
                          <p className="text-xs text-gray-500">تم الجدولة بواسطة: {requestMock.visitSchedule.scheduledBy}</p>
                          <p className="text-xs text-gray-500">{requestMock.visitSchedule.scheduledAt}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* For Inquiry/Complaint - Show Employee Response */}
                {(requestMock.requestTypeId === 1 || requestMock.requestTypeId === 2) && requestMock.employeeResponse && (
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl">
                      <p className="text-gray-700 whitespace-pre-wrap mb-4">{requestMock.employeeResponse.responseText}</p>
                      
                      {requestMock.employeeResponse.responseAttachments && requestMock.employeeResponse.responseAttachments.length > 0 && (
                        <div className="border-t pt-4">
                          <p className="text-sm text-gray-500 mb-2">مرفقات الرد</p>
                          {requestMock.employeeResponse.responseAttachments.map((attachment, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors mb-2"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-[#115740] rounded-lg flex items-center justify-center">
                                  <Download className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                                  <p className="text-xs text-gray-500">{attachment.size}</p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm">
                                تحميل
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      <div className="border-t pt-4 mt-4">
                        <p className="text-xs text-gray-500">تم الرد بواسطة: {requestMock.employeeResponse.respondedBy}</p>
                        <p className="text-xs text-gray-500">{requestMock.employeeResponse.respondedAt}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            )}
            
            {/* User Feedback Section - Show when status is تم الإغلاق (CLOSED) */}
            {isUser && requestMock.statusId === RequestStatus.CLOSED && (
              <Card className="p-6 bg-yellow-50 border-yellow-200">
                <h3 className="text-[#115740] mb-4">{t("requests.requestEvaluation")}</h3>
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm text-gray-700 mb-2 block">
                      {t("requests.rating")}
                    </Label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-8 h-8 cursor-pointer ${
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
                    />
                  </div>
                  
                  <Button 
                    onClick={handleSubmitFeedback}
                    className="bg-[#115740] hover:bg-[#0d4230] text-white"
                    disabled={rating === 0}
                  >
                    {t("requests.submitRating")}
                  </Button>
                </div>
              </Card>
            )}

            {/* Messages */}
            {/* <Card className="p-6">
              <h3 className="text-[#115740] mb-4 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                <span>الرسائل والتحديثات</span>
              </h3>
              <div className="space-y-4 mb-4">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl ${
                      msg.isAdmin
                        ? "bg-blue-50 border border-blue-100"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {msg.sender}
                      </span>
                      <span className="text-xs text-gray-500 mr-auto">{msg.date}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{msg.message}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Textarea
                  placeholder="اكتب رسالتك هنا..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={3}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  className="bg-[#115740] hover:bg-[#0d4230]"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </Card> */}
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
                    <p className="text-gray-900">{requestMock.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">{t("requests.responsibleDepartment")}</p>
                    <p className="text-gray-900">{requestMock.department}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-gray-500">{t("requests.processingTime")}</p>
                    <p className="text-gray-900">3-5 {t("requests.workDays")}</p>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Admin Employee Assignment Section */}
            {canAssignRequests && (
              <Card className="p-6 bg-blue-50 border-blue-200">
                <h4 className="text-[#115740] mb-4 flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  {t("requests.track.assignEmployee")}
                </h4>
                <div className="space-y-3">
                  <Select
                    value={selectedEmployeeId !== null ? selectedEmployeeId.toString() : ""}
                    onValueChange={(value: string) => setSelectedEmployeeId(value ? parseInt(value, 10) : null)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("requests.track.selectEmployee")} />
                    </SelectTrigger>
                    <SelectContent>
                      {mockEmployees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id.toString()}>
                          {isRTL ? emp.nameAr : emp.nameEn}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Button
                    onClick={() => {
                      if (selectedEmployeeId) {
                        handleAssignEmployee(selectedEmployeeId);
                      }
                    }}
                    disabled={!selectedEmployeeId}
                    className="w-full bg-[#115740] hover:bg-[#0d4230] text-white"
                  >
                    {t("requests.track.assign")}
                  </Button>
                </div>
              </Card>
            )}
            
            {/* Employee Status Change Dropdown */}
            {isEmployee && (
              <Card className="p-6">
                <h4 className="text-[#115740] mb-4">{t("requests.changeRequestStatus")}</h4>
                <div className="flex gap-2">
                  <select 
                    id="statusChange"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex-1"
                    onChange={(e) => handleStatusChange(parseInt(e.target.value))}
                    defaultValue=""
                  >
                    <option value="" disabled>{t("requests.selectOption")}</option>
                    <option value="1">{t("requests.requestStatuses.received")}</option>
                    <option value="2">{t("requests.requestStatuses.underReview")}</option>
                    <option value="3">{t("requests.requestStatuses.replied")}</option>
                    <option value="4">{t("requests.requestStatuses.closed")}</option>
                  </select>
                  <Button 
                    onClick={() => {
                      const selectElement = document.getElementById('statusChange') as HTMLSelectElement;
                      if (selectElement && selectElement.value) {
                        handleStatusChange(parseInt(selectElement.value));
                      }
                    }}
                    className="bg-[#115740] hover:bg-[#0d4230] text-white"
                  >
                    {t("requests.change")}
                  </Button>
                </div>
              </Card>
            )}
            
            {/* Employee Response Section */}
            {isEmployee && (
              <Card className="p-6">
                <h4 className="text-[#115740] mb-4">
                  {requestMock.requestTypeId === 4 ? t("requests.scheduleVisit") : t("requests.addResponse")}
                </h4>
                <div className="space-y-3">
                  {requestMock.requestTypeId === 4 ? (
                    // Visit scheduling form
                    <>
                      <div>
                        <Input
                          type="datetime-local"
                          value={visitDateTime}
                          onChange={(e) => setVisitDateTime(e.target.value)}
                          className="w-full text-sm"
                        />
                      </div>
                      <div>
                        <Input
                          placeholder={t("requests.visitLocation")}
                          value={visitLocation}
                          onChange={(e) => setVisitLocation(e.target.value)}
                          className="w-full text-sm"
                        />
                      </div>
                    </>
                  ) : (
                    // Response text for complaints/inquiries
                    <Textarea
                      placeholder={t("requests.writeResponseHere")}
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={3}
                      className="text-sm"
                    />
                  )}
                  
                  <div>
                    <Input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="w-full text-sm"
                    />
                    {attachments.length > 0 && (
                      <div className="mt-1 text-xs text-gray-600">
                        {attachments.length} {t("requests.fileAttached")}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    onClick={handleSubmitResponse}
                    className="bg-[#115740] hover:bg-[#0d4230] text-white text-sm h-8"
                  >
                    {t("requests.send")}
                  </Button>
                </div>
              </Card>
            )}

            {/* Support */}
            {/* <Card className="p-6 bg-blue-50 border-blue-200">
              <h4 className="text-[#115740] mb-2">هل تحتاج مساعدة؟</h4>
              <p className="text-sm text-gray-600 mb-4">
                تواصل مع فريق الدعم للحصول على المساعدة
              </p>
              <Link to="/support">
                <Button variant="outline" className="w-full gap-2">
                  <HelpCircle className="w-4 h-4" />
                  تواصل مع الدعم
                </Button>
              </Link>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
}
