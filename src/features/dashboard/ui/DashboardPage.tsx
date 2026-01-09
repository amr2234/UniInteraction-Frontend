import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RequestType } from "@/core/constants/requestTypes";
import { RequestStatus } from "@/core/constants/requestStatuses";
import { useCallback } from "react";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  FileSearch,
  User,
  Calendar,
  FileText,
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
import { useDashboardPage } from "./DashboardPage.logic";

export function DashboardPage() {
  const {
    language,
    isAdmin,
    isSuperAdmin,
    isEmployee,
    isUser,
    requestCounts,
    recentRequestsNeedingAction,
    stats,
    requestsData,
    requestTypesData,
    isLoadingMonthly,
    isLoadingTypes,
    services,
    adminServices,
    getUserDisplayName,
    t,
  } = useDashboardPage();

  // Memoize helper functions to prevent recreation on every render
  const getRequestTypeName = useCallback((typeId: number) => {
    switch (typeId) {
      case RequestType.COMPLAINT:
        return t("requests.types.complaint");
      case RequestType.INQUIRY:
        return t("requests.types.inquiry");
      case RequestType.VISIT:
        return t("requests.types.visit");
      default:
        return t("requests.types.other");
    }
  }, [t]);

  const getStatusName = useCallback((statusId: number) => {
    switch (statusId) {
      case RequestStatus.RECEIVED:
        return t("requests.statuses.pending");
      case RequestStatus.UNDER_REVIEW:
        return t("requests.statuses.inProgress");
      case RequestStatus.REPLIED:
        return t("requests.statuses.replied");
      case RequestStatus.CLOSED:
        return t("requests.statuses.closed");
      default:
        return t("requests.statuses.unknown");
    }
  }, [t]);

  const getTimeAgo = useCallback((date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInDays = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return t("requests.timeAgo.today");
    if (diffInDays === 1) return t("requests.timeAgo.yesterday");
    if (diffInDays < 7) return t("requests.timeAgo.daysAgo").replace("{count}", String(diffInDays));
    if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return weeks === 1 ? t("requests.timeAgo.weekAgo") : t("requests.timeAgo.weeksAgo").replace("{count}", String(weeks));
    }
    const months = Math.floor(diffInDays / 30);
    return months === 1 ? t("requests.timeAgo.monthAgo") : t("requests.timeAgo.monthsAgo").replace("{count}", String(months));
  }, [t]);

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-[#2B2B2B] mb-2">
              {t("dashboard.greeting")} {getUserDisplayName()}
            </h1>
            <p className="text-[#6F6F6F]">{t("dashboard.activitySummary")}</p>
          </div>
        </div>

        {/* Employee Request Management Section - Only for Employee */}
        {isEmployee && (
          <>
            {/* Request Overview - Redesigned and Moved to Top */}
            <div className="mb-8">
              <div className="bg-gradient-to-br from-[#6CAEBD] via-[#5A9FB0] to-[#875E9E] rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#EABB4E]/20 rounded-full blur-2xl"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <FileSearch className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-white text-2xl sm:text-3xl font-bold">{t("dashboard.requestOverview")}</h2>
                      <p className="text-white/90 text-sm">{t("dashboard.requestOverviewSubtitle")}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 sm:gap-6">
                    {/* Pending Requests */}
                    <div className="group bg-white/15 backdrop-blur-md hover:bg-white/25 rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#EABB4E] to-[#D4A43D] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                          <Clock className="w-7 h-7 text-white" />
                        </div>
                        <div className="w-3 h-3 bg-[#EABB4E] rounded-full animate-pulse"></div>
                      </div>
                      <h3 className="text-white text-4xl sm:text-5xl font-bold mb-2 drop-shadow-lg">{requestCounts.pending}</h3>
                      <p className="text-white/95 text-base font-semibold">{t("dashboard.employee.pendingRequests")}</p>
                    </div>
                    
                    {/* In Progress Requests */}
                    <div className="group bg-white/15 backdrop-blur-md hover:bg-white/25 rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-white/30 to-white/20 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                          <TrendingUp className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex gap-1">
                          <div className="w-1 h-4 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
                          <div className="w-1 h-5 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-1 h-6 bg-white/80 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                      <h3 className="text-white text-4xl sm:text-5xl font-bold mb-2 drop-shadow-lg">{requestCounts.inProgress}</h3>
                      <p className="text-white/95 text-base font-semibold">{t("dashboard.employee.inProgressRequests")}</p>
                    </div>
                    
                    {/* Completed Requests */}
                    <div className="group bg-white/15 backdrop-blur-md hover:bg-white/25 rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 cursor-pointer">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#115740] to-[#0D4030] flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all">
                          <CheckCircle2 className="w-7 h-7 text-white" />
                        </div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <h3 className="text-white text-4xl sm:text-5xl font-bold mb-2 drop-shadow-lg">{requestCounts.replied + requestCounts.closed}</h3>
                      <p className="text-white/95 text-base font-semibold">{t("dashboard.employee.completedRequests")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="mb-8">
              <h3 className="text-[#2B2B2B] text-xl font-bold mb-4">إجراءات سريعة</h3>
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
                  {recentRequestsNeedingAction.map((request: any, index: any) => (
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
                              request.requestStatusId === RequestStatus.RECEIVED 
                                ? 'bg-[#EABB4E] text-white' 
                                : 'bg-[#6CAEBD] text-white'
                            }`}>
                              {request.requestStatusId === RequestStatus.RECEIVED ? t("requests.statuses.pending") : t("requests.statuses.inProgress")}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#875E9E]/20 text-[#875E9E]">
                              {request.requestTypeId === RequestType.COMPLAINT ? t("requests.types.complaint") : 
                               request.requestTypeId === RequestType.INQUIRY ? t("requests.types.inquiry") : 
                               request.requestTypeId === RequestType.VISIT ? t("requests.types.visit") : 
                               t("requests.types.other")}
                            </span>
                          </div>
                          <h4 className="text-[#2B2B2B] font-semibold mb-1.5 text-base">
                            {language === 'ar' ? request.titleAr : (request.titleEn || request.titleAr)}
                          </h4>
                          <p className="text-[#6F6F6F] text-sm mb-2 line-clamp-1">
                            {language === 'ar' ? request.subjectAr : (request.subjectEn || request.subjectAr)}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-[#6F6F6F]">
                            <div className="flex items-center gap-1.5">
                              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#6CAEBD] to-[#875E9E] flex items-center justify-center">
                                <User className="w-3 h-3 text-white" />
                              </div>
                              <span>{language === 'ar' ? request.nameAr : (request.nameEn || request.nameAr)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              <span>{new Date(request.createdAt).toLocaleDateString('ar-SA')}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center">
                          <Link to={`/dashboard/request/${request.id}`}>
                            <Button size="sm" className="rounded-lg bg-[#6CAEBD] text-white hover:bg-[#6CAEBD]/90 transition-all h-10 px-6">
                              <FileSearch className="w-4 h-4 mr-2" />
                              <span>{t("dashboard.employee.viewDetails")}</span>
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
              {isLoadingMonthly ? (
                <div className="flex items-center justify-center h-[300px]">
                  <p className="text-gray-500">{t("common.loading")}</p>
                </div>
              ) : (
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
                      dataKey={t("dashboard.chartLabels.requests")}
                      stroke="#6CAEBD"
                      strokeWidth={3}
                      dot={{ fill: "#6CAEBD", r: 5 }}
                      activeDot={{ r: 7 }}
                      animationDuration={1500}
                    />
                    <Line
                      type="monotone"
                      dataKey={t("dashboard.chartLabels.completed")}
                      stroke="#115740"
                      strokeWidth={3}
                      dot={{ fill: "#115740", r: 5 }}
                      animationDuration={1500}
                      animationBegin={300}
                    />
                    <Line
                      type="monotone"
                      dataKey={t("dashboard.chartLabels.underReview")}
                      stroke="#EABB4E"
                      strokeWidth={3}
                      dot={{ fill: "#EABB4E", r: 5 }}
                      animationDuration={1500}
                      animationBegin={600}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </Card>

            {/* Request Types - Bar Chart */}
            <Card className="p-6 rounded-xl border-0 shadow-soft bg-white">
              <h3 className="text-[#2B2B2B] mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#875E9E]" />
                {t("dashboard.requestTypesDistribution")}
              </h3>
              {isLoadingTypes ? (
                <div className="flex items-center justify-center h-[300px]">
                  <p className="text-gray-500">{t("common.loading")}</p>
                </div>
              ) : (
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
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}