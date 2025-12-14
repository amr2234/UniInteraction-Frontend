import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/i18n";
import { useUserPermissions, useUserRole } from "@/core/hooks";
import { useUserRequests, useUpdateRequestStatus } from "@/features/requests/hooks/useRequests";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  HelpCircle,
  Lightbulb,
  Calendar,
  FileSearch,
  User,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileText,
  Users,
  Layers,
  FolderTree,
  Settings,
  MessageCircleQuestion,
  Award,
  ScrollText,
  Building2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import logoImage from "@/assets/feafe15647caf57cbb0488bb53100be4d28ef084.png";

export function DashboardPage() {
  const { t } = useI18n();
  const userPermissions = useUserPermissions();
  const { isAdmin, isSuperAdmin, isEmployee, isUser } = useUserRole();
  const [selectedStatus, setSelectedStatus] = useState<Record<number, number>>({});
  
  // Fetch all requests for employees
  const { data: allRequests = [] } = useUserRequests({});
  const updateStatus = useUpdateRequestStatus();
  
  // Ensure allRequests is always an array
  const requestsArray = Array.isArray(allRequests) ? allRequests : [];
  
  // Dummy data for employees when no real data is available
  const dummyRequests = [
    {
      id: 1,
      requestNumber: 'REQ-2025-00123',
      nameAr: 'محمد أحمد السعيد',
      email: 'mohammed@example.com',
      mobile: '0501234567',
      titleAr: 'استفسار عن مواعيد التسجيل للفصل الدراسي القادم',
      titleEn: 'Inquiry about registration dates for next semester',
      subjectAr: 'أرغب في معرفة المواعيد المحددة لتسجيل المقررات للفصل الدراسي القادم وهل هناك أي متطلبات خاصة؟',
      subjectEn: 'I would like to know the specific dates for course registration for the next semester',
      requestStatusId: 1,
      statusName: 'قيد الانتظار',
      requestTypeId: 2,
      requestTypeName: 'استفسار',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      requestNumber: 'REQ-2025-00124',
      nameAr: 'فاطمة علي المطيري',
      email: 'fatima@example.com',
      mobile: '0559876543',
      titleAr: 'شكوى بخصوص تأخر الرد على الطلب السابق',
      titleEn: 'Complaint regarding delayed response to previous request',
      subjectAr: 'تقدمت بطلب قبل أسبوعين ولم أتلق أي رد حتى الآن. أرجو النظر في الأمر بشكل عاجل.',
      subjectEn: 'I submitted a request two weeks ago and have not received any response yet',
      requestStatusId: 2,
      statusName: 'قيد التنفيذ',
      requestTypeId: 1,
      requestTypeName: 'شكوى',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      requestNumber: 'REQ-2025-00125',
      nameAr: 'أحمد خالد العلي',
      email: 'ahmed@example.com',
      mobile: '0561234567',
      titleAr: 'حجز موعد لمقابلة عميد الكلية',
      titleEn: 'Booking an appointment with the Dean of the College',
      subjectAr: 'أرغب في حجز موعد لمقابلة عميد الكلية لمناقشة موضوع مهم يتعلق بالدراسة.',
      subjectEn: 'I would like to book an appointment with the Dean of the College to discuss an important matter regarding my studies.',
      requestStatusId: 1,
      statusName: 'قيد الانتظار',
      requestTypeId: 4,
      requestTypeName: 'زيارة',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  
  // Use dummy data for employees if no real requests
  const requestsToShow = isEmployee && requestsArray.length === 0 ? dummyRequests : requestsArray;
  
  // Calculate request counts by status for employees
  const requestCounts = {
    pending: requestsToShow.filter(r => r.requestStatusId === 1).length,
    inProgress: requestsToShow.filter(r => r.requestStatusId === 2).length,
    completed: requestsToShow.filter(r => r.requestStatusId === 3).length,
    rejected: requestsToShow.filter(r => r.requestStatusId === 4).length,
    total: requestsToShow.length,
  };
  
  // Get recent requests that need action (Pending or In Progress) - limit to 2
  const recentRequestsNeedingAction = requestsToShow
    .filter(r => r.requestStatusId === 1 || r.requestStatusId === 2)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 2);
  
  const handleStatusChange = (requestId: number, newStatusId: string) => {
    const statusId = parseInt(newStatusId, 10);
    setSelectedStatus(prev => ({ ...prev, [requestId]: statusId }));
    
    updateStatus.mutate({
      id: requestId,
      payload: { requestStatusId: statusId }
    });
  };
  
  const stats = [
    {
      title: t("dashboard.statistics.myOpenRequests"),
      value: "8",
      icon: FileText,
      color: "bg-[#6CAEBD]/10 text-[#6CAEBD]",
      trend: `+2 ${t("dashboard.statistics.thisWeek")}`,
    },
    {
      title: t("dashboard.statistics.closedRequests"),
      value: "24",
      icon: CheckCircle2,
      color: "bg-[#875E9E]/10 text-[#875E9E]",
      trend: `6 ${t("dashboard.statistics.thisMonth")}`,
    },
    {
      title: t("dashboard.statistics.underReview"),
      value: "5",
      icon: Clock,
      color: "bg-[#EABB4E]/10 text-[#EABB4E]",
      trend: t("dashboard.statistics.average3Days"),
    },
  ];

  // Line chart data - Requests over time
  const requestsData = [
    { name: t("dashboard.months.january"), طلبات: 65, مكتمل: 45, قيدالمراجعة: 20 },
    { name: t("dashboard.months.february"), طلبات: 78, مكتمل: 62, قيدالمراجعة: 16 },
    { name: t("dashboard.months.march"), طلبات: 90, مكتمل: 75, قيدالمراجعة: 15 },
    { name: t("dashboard.months.april"), طلبات: 81, مكتمل: 70, قيدالمراجعة: 11 },
    { name: t("dashboard.months.may"), طلبات: 95, مكتمل: 82, قيدالمراجعة: 13 },
    { name: t("dashboard.months.june"), طلبات: 112, مكتمل: 98, قيدالمراجعة: 14 },
  ];

  // Bar chart data - Request types
  const requestTypesData = [
    { name: t("requests.types.complaints"), count: 145, fill: "#875E9E" },
    { name: t("requests.types.inquiries"), count: 198, fill: "#6CAEBD" },
    { name: t("requests.types.visits"), count: 45, fill: "#EABB4E" },
  ];

  const services = [
    {
      icon: AlertCircle,
      title: t("requests.submitComplaintOrSuggestion"),
      description: t("requests.submitComplaintOrSuggestionDesc"),
      link: "/dashboard/complaint",
      color: "from-[#875E9E] to-[#6CAEBD]",
      bgColor: "bg-purple-50",
    },
    {
      icon: HelpCircle,
      title: t("requests.submitInquiry"),
      description: t("requests.submitInquiryDesc"),
      link: "/dashboard/inquiry",
      color: "from-[#6CAEBD] to-[#875E9E]",
      bgColor: "bg-blue-50",
    },
    {
      icon: Calendar,
      title: t("requests.bookVisit"),
      description: t("requests.bookVisitDesc"),
      link: "/dashboard/book-visit",
      color: "from-[#EABB4E] to-[#6CAEBD]",
      bgColor: "bg-yellow-50",
    },
    {
      icon: FileSearch,
      title: t("requests.trackRequests"),
      description: t("requests.trackRequestsDesc"),
      link: "/dashboard/track",
      color: "from-[#6CAEBD] to-[#EABB4E]",
      bgColor: "bg-cyan-50",
    },
    {
      icon: User,
      title: t("form.profileManagement"),
      description: t("form.profileManagementDesc"),
      link: "/dashboard/profile",
      color: "from-[#875E9E] to-[#EABB4E]",
      bgColor: "bg-indigo-50",
    },
  ];

  const adminServices = [
    {
      icon: Users,
      title: t("dashboard.admin.userManagement"),
      description: t("dashboard.admin.userManagementDesc"),
      link: "/admin/users",
      color: "from-[#6CAEBD] to-[#115740]",
    },
    {
      icon: Layers,
      title: t("dashboard.admin.mainCategories"),
      description: t("dashboard.admin.mainCategoriesDesc"),
      link: "/admin/main-categories",
      color: "from-[#875E9E] to-[#6CAEBD]",
    },
    {
      icon: Building2,
      title: "إدارة الأقسام",
      description: "إدارة أقسام الجامعة",
      link: "/admin/departments",
      color: "from-[#EABB4E] to-[#115740]",
    },
    {
      icon: MessageCircleQuestion,
      title: t("dashboard.admin.faqManagement"),
      description: t("dashboard.admin.faqManagementDesc"),
      link: "/admin/faqs",
      color: "from-[#6CAEBD] to-[#EABB4E]",
    },
    {
      icon: Award,
      title: t("dashboard.admin.leadershipManagement"),
      description: t("dashboard.admin.leadershipManagementDesc"),
      link: "/admin/leadership",
      color: "from-[#875E9E] to-[#115740]",
    },
    {
      icon: Calendar,
      title: t("dashboard.admin.visitCalendar"),
      description: t("dashboard.admin.visitCalendarDesc"),
      link: "/admin/calendar",
      color: "from-[#EABB4E] to-[#6CAEBD]",
      showForSuperAdmin: true,
    },
    {
      icon: Settings,
      title: t("dashboard.admin.systemSettings"),
      description: t("dashboard.admin.systemSettingsDesc"),
      link: "/admin/settings",
      color: "from-[#6CAEBD] to-[#875E9E]",
      showForSuperAdmin: true,
    },
    {
      icon: ScrollText,
      title: t("dashboard.admin.systemLogs"),
      description: t("dashboard.admin.systemLogsDesc"),
      link: "/admin/logs",
      color: "from-[#115740] to-[#EABB4E]",
      showForSuperAdmin: true,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-[#2B2B2B] mb-2">{t("dashboard.greeting")}</h1>
            <p className="text-[#6F6F6F]">{t("dashboard.activitySummary")}</p>
          </div>
        </div>

        {/* Employee Request Management Section - Only for Employee */}
        {isEmployee && (
          <>
            {/* Quick Action Buttons */}
            <div className="mb-8">
              <div className="grid md:grid-cols-2 gap-6">
                <Link to="/dashboard/track">
                  <Card className="p-6 hover:shadow-soft-lg transition-all hover:-translate-y-1 cursor-pointer group h-full rounded-xl border-0 shadow-soft bg-white">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#6CAEBD] to-[#EABB4E] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <FileSearch className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-[#2B2B2B] mb-2 text-lg font-bold">{t("requests.trackRequests")}</h4>
                    <p className="text-[#6F6F6F] text-sm">{t("requests.trackRequestsDesc")}</p>
                  </Card>
                </Link>

                <Link to="/admin/calendar">
                  <Card className="p-6 hover:shadow-soft-lg transition-all hover:-translate-y-1 cursor-pointer group h-full rounded-xl border-0 shadow-soft bg-white">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#EABB4E] to-[#6CAEBD] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Calendar className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-[#2B2B2B] mb-2 text-lg font-bold">{t("dashboard.visitCalendar")}</h4>
                    <p className="text-[#6F6F6F] text-sm">{t("dashboard.visitCalendarDesc")}</p>
                  </Card>
                </Link>
              </div>
            </div>

            {/* Request Status Counters - Compact & Animated */}
            <div className="mb-8">
              <h2 className="text-[#6CAEBD] mb-6 text-2xl font-bold">{t("dashboard.requestOverview")}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 hover:shadow-soft-lg transition-all hover:-translate-y-1 rounded-xl border-0 shadow-soft bg-gradient-to-br from-[#FFEFC1] to-[#FFF9E6] group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#EABB4E] to-[#D4A43D] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-2.5 h-2.5 bg-[#EABB4E] rounded-full animate-pulse"></div>
                  </div>
                  <h3 className="text-3xl font-bold text-[#EABB4E] mb-1">{requestCounts.pending}</h3>
                  <p className="text-[#6F6F6F] text-sm font-medium">{t("dashboard.employee.pendingRequests")}</p>
                </Card>
                
                <Card className="p-6 hover:shadow-soft-lg transition-all hover:-translate-y-1 rounded-xl border-0 shadow-soft bg-gradient-to-br from-[#D4EBEF] to-[#E8F4F6] group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#6CAEBD] to-[#5A9AAA] flex items-center justify-center group-hover:scale-110 transition-transform group-hover:rotate-12 shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex gap-0.5">
                      <div className="w-1 h-4 bg-[#6CAEBD] rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                      <div className="w-1 h-5 bg-[#6CAEBD] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-1 h-6 bg-[#6CAEBD] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold text-[#6CAEBD] mb-1">{requestCounts.inProgress}</h3>
                  <p className="text-[#6F6F6F] text-sm font-medium">{t("dashboard.employee.inProgressRequests")}</p>
                </Card>
                
                <Card className="p-6 hover:shadow-soft-lg transition-all hover:-translate-y-1 rounded-xl border-0 shadow-soft bg-gradient-to-br from-[#D5E8E0] to-[#E6F2ED] group cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[#115740] to-[#0D4030] flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                      <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-2.5 h-2.5 bg-[#115740] rounded-full"></div>
                  </div>
                  <h3 className="text-3xl font-bold text-[#115740] mb-1">{requestCounts.completed}</h3>
                  <p className="text-[#6F6F6F] text-sm font-medium">{t("dashboard.employee.completedRequests")}</p>
                </Card>
              </div>
            </div>

            {/* Recent Requests Needing Action - Creative Design */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#875E9E] to-[#6CAEBD] flex items-center justify-center">
                    <FileSearch className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-[#875E9E] text-xl mb-0">{t("dashboard.employee.requestsNeedingAction")}</h2>
                    <p className="text-xs text-[#6F6F6F]">{recentRequestsNeedingAction.length} {t("dashboard.employee.activeRequests")}</p>
                  </div>
                </div>
                <Link to="/dashboard/track">
                  <Button variant="outline" className="rounded-lg border-[#875E9E] text-[#875E9E] hover:bg-[#875E9E] hover:text-white transition-all hover:shadow-lg">
                    {t("dashboard.viewAll")}
                  </Button>
                </Link>
              </div>
              
              {recentRequestsNeedingAction.length === 0 ? (
                <Card className="p-8 rounded-xl border-0 shadow-soft bg-gradient-to-br from-green-50 to-green-100/50 text-center">
                  <div className="inline-flex w-16 h-16 rounded-full bg-gradient-to-br from-[#115740] to-[#0D4030] items-center justify-center mb-4 mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-[#115740] font-semibold mb-2">{t("dashboard.employee.allCaughtUp")}</h3>
                  <p className="text-[#6F6F6F] text-sm">{t("dashboard.employee.noRequestsNeedingAction")}</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {recentRequestsNeedingAction.map((request, index) => (
                    <Card 
                      key={request.id} 
                      className="p-4 rounded-xl border-0 shadow-soft bg-white hover:shadow-soft-lg transition-all hover:-translate-y-1"
                      style={{ 
                        animation: `fadeIn 0.5s ease-out ${index * 0.1}s backwards`
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className="px-3 py-1 rounded-lg text-sm font-semibold text-[#2B2B2B] bg-gradient-to-r from-gray-100 to-gray-200">
                              #{request.requestNumber}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${
                              request.requestStatusId === 1 
                                ? 'bg-[#EABB4E] text-white' 
                                : 'bg-[#6CAEBD] text-white'
                            }`}>
                              {request.statusName}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#875E9E]/20 text-[#875E9E]">
                              {request.requestTypeName}
                            </span>
                          </div>
                          <h4 className="text-[#2B2B2B] font-semibold mb-1.5 text-base">{request.titleAr}</h4>
                          <p className="text-[#6F6F6F] text-sm mb-2 line-clamp-1">{request.subjectAr}</p>
                          <div className="flex items-center gap-3 text-xs text-[#6F6F6F]">
                            <div className="flex items-center gap-1.5">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6CAEBD] to-[#875E9E] flex items-center justify-center">
                                <User className="w-3 h-3 text-white" />
                              </div>
                              <span>{request.nameAr}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{new Date(request.createdAt).toLocaleDateString('ar-SA')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 min-w-[180px]">
                          <Select
                            value={selectedStatus[request.id]?.toString() || request.requestStatusId.toString()}
                            onValueChange={(value: string) => handleStatusChange(request.id, value)}
                          >
                            <SelectTrigger className="rounded-lg h-9 text-sm border-[#6CAEBD]/30 hover:border-[#6CAEBD] transition-colors">
                              <SelectValue placeholder={t("dashboard.employee.changeStatus")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-[#EABB4E]"></div>
                                  {t("requests.statuses.pending")}
                                </div>
                              </SelectItem>
                              <SelectItem value="2">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-[#6CAEBD]"></div>
                                  {t("requests.statuses.inProgress")}
                                </div>
                              </SelectItem>
                              <SelectItem value="3">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-[#115740]"></div>
                                  {t("requests.statuses.completed")}
                                </div>
                              </SelectItem>
                              <SelectItem value="4">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                  {t("requests.statuses.rejected")}
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Link to={`/dashboard/request/${request.id}`}>
                            <Button size="sm" variant="outline" className="w-full rounded-lg border-[#6CAEBD] text-[#6CAEBD] hover:bg-[#6CAEBD] hover:text-white transition-all h-9">
                              <FileSearch className="w-3.5 h-3.5 mr-1.5" />
                              <span className="text-xs">{t("dashboard.employee.viewDetails")}</span>
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* Statistics - Show for Admin and SuperAdmin */}
        {(isAdmin || isSuperAdmin) && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 hover:shadow-soft-lg transition-shadow rounded-xl border-0 shadow-soft bg-white">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <TrendingUp className="w-5 h-5 text-[#EABB4E]" />
                </div>
                <h3 className="text-[#2B2B2B] mb-1">{stat.value}</h3>
                <p className="text-[#6F6F6F] text-sm mb-2">{stat.title}</p>
                <p className="text-xs text-[#6F6F6F]">{stat.trend}</p>
              </Card>
            ))}
          </div>
        )}

        {/* Available Services - Show for Regular Users only */}
        {isUser && (
          <div className="mb-8">
            <h2 className="text-[#6CAEBD] mb-6">{t("dashboard.availableServices")}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => (
                <Link key={index} to={service.link}>
                  <Card className="p-6 hover:shadow-soft-lg transition-all hover:-translate-y-1 cursor-pointer group h-full rounded-xl border-0 shadow-soft bg-white">
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    <h4 className="text-[#2B2B2B] mb-2">{service.title}</h4>
                    <p className="text-[#6F6F6F] text-sm">{service.description}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Admin Services Section - Show for Admin and SuperAdmin */}
        {(isAdmin || isSuperAdmin) && (
          <div className="mb-8">
            <h2 className="text-[#115740] mb-6">{t("dashboard.adminPanel")}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Track Requests - Special card for admins */}
              <Link to="/dashboard/track">
                <Card className="p-6 hover:shadow-soft-lg transition-all hover:-translate-y-1 cursor-pointer group h-full rounded-xl border-0 shadow-soft bg-white">
                  <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#6CAEBD] to-[#EABB4E] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <FileSearch className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-[#2B2B2B] mb-2">{t("requests.trackRequests")}</h4>
                  <p className="text-[#6F6F6F] text-sm">{t("requests.trackRequestsDesc")}</p>
                </Card>
              </Link>

              {/* Admin Services from adminServices array */}
              {adminServices
                .filter(service => !service.showForSuperAdmin || isSuperAdmin)
                .map((service, index) => (
                  <Link key={index} to={service.link}>
                    <Card className="p-6 hover:shadow-soft-lg transition-all hover:-translate-y-1 cursor-pointer group h-full rounded-xl border-0 shadow-soft bg-white">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        <service.icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-[#2B2B2B] mb-2">{service.title}</h4>
                      <p className="text-[#6F6F6F] text-sm">{service.description}</p>
                    </Card>
                  </Link>
                ))
              }
            </div>
          </div>
        )}

        {/* Charts/Reports Section - Show for Admin and SuperAdmin */}
        {(isAdmin || isSuperAdmin) && (
          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {/* Requests Over Time - Line Chart */}
            <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
              <h3 className="text-[#2B2B2B] mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#6CAEBD]" />
                {t("dashboard.requestsOverTime")}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={requestsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#6F6F6F" />
                  <YAxis stroke="#6F6F6F" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="طلبات"
                    stroke="#6CAEBD"
                    strokeWidth={3}
                    dot={{ fill: "#6CAEBD", r: 5 }}
                    activeDot={{ r: 7 }}
                    animationDuration={1500}
                  />
                  <Line
                    type="monotone"
                    dataKey="مكتمل"
                    stroke="#115740"
                    strokeWidth={3}
                    dot={{ fill: "#115740", r: 5 }}
                    animationDuration={1500}
                    animationBegin={300}
                  />
                  <Line
                    type="monotone"
                    dataKey="قيدالمراجعة"
                    stroke="#EABB4E"
                    strokeWidth={3}
                    dot={{ fill: "#EABB4E", r: 5 }}
                    animationDuration={1500}
                    animationBegin={600}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Request Types - Bar Chart */}
            <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
              <h3 className="text-[#2B2B2B] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#875E9E]" />
                {t("dashboard.requestTypesDistribution")}
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={requestTypesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" stroke="#6F6F6F" />
                  <YAxis stroke="#6F6F6F" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    radius={[8, 8, 0, 0]}
                    animationDuration={1200}
                    animationBegin={200}
                  >
                    {requestTypesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        )}

        {/* Recent Activities - Show for Regular Users only */}
        {isUser && (
        <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
          <h3 className="text-[#6CAEBD] mb-4">{t("dashboard.recentActivities")}</h3>
          <div className="space-y-4">
            {[
              { type: t("requests.types.inquiry"), title: t("requests.types.inquiry") + " عن مواعيد التسجيل", status: t("requests.statuses.replied"), date: t("requests.timeAgo.daysAgo").replace("{count}", "3"), color: "bg-[#875E9E]/10 text-[#875E9E]" },
              { type: t("requests.types.complaint"), title: t("requests.types.complaint") + " في نظام البوابة الإلكترونية", status: t("requests.statuses.processing"), date: t("requests.timeAgo.daysAgo").replace("{count}", "5"), color: "bg-[#EABB4E]/10 text-[#EABB4E]" },
              { type: t("requests.types.visit"), title: "موعد مع عميد شؤون الطلاب", status: t("requests.statuses.confirmed"), date: t("requests.timeAgo.weekAgo"), color: "bg-[#6CAEBD]/10 text-[#6CAEBD]" },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-[#F4F4F4] rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-2 h-2 bg-[#6CAEBD] rounded-full"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm text-[#6F6F6F]">{activity.type}</span>
                      <span className="text-gray-300">•</span>
                      <span className="text-sm text-[#6F6F6F]">{activity.date}</span>
                    </div>
                    <p className="text-[#2B2B2B]">{activity.title}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-xl text-xs ${activity.color}`}>
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
          <Link to="/dashboard/track">
            <button className="w-full mt-4 text-[#6CAEBD] hover:text-[#875E9E] text-sm transition">
              {t("dashboard.viewAllRequests")}
            </button>
          </Link>
        </Card>
        )}
      </div>
    </div>
  );
}