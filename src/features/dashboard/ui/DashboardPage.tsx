import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RequestType } from "@/core/constants/requestTypes";
import { RequestStatus } from "@/core/constants/requestStatuses";
import { useCallback, memo } from "react";
import {
  TrendingUp,
  Clock,
  CheckCircle2,
  FileSearch,
  User,
  Calendar,
  FileText,
} from "lucide-react";
import { useDashboardPage } from "./DashboardPage.logic";
import {
  StatisticsCard,
  RequestsLineChart,
  RequestTypesBarChart,
  DashboardServiceCard,
  RecentRequestCard,
} from "./DashboardPage.components";

export const DashboardPage = memo(function DashboardPage() {
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
            {/* Quick Action Buttons */}
            <div className="mb-8">
              <h3 className="text-[#2B2B2B] text-xl font-bold mb-4">{t("dashboard.quickActions")}</h3>
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
                  <Button variant="outline" className="rounded-lg border-[#875E9E] text-[#875E9E] hover:bg-[#875E9E] hover:text-black transition-all hover:shadow-lg" style={{ backgroundColor: "#FFFFFF" }}>
                    {t("dashboard.viewAll")}
                  </Button>
                </Link>
              </div>
              
              {recentRequestsNeedingAction.length === 0 ? (
                <Card className="p-8 rounded-xl border-0 shadow-soft bg-gradient-to-br from-green-50 to-green-100/50 text-center" style={{ backgroundColor: "#FFFFFF" }}>
                  <div className="inline-flex w-16 h-16 rounded-full bg-gradient-to-br from-[#115740] to-[#0D4030] items-center justify-center mb-4 mx-auto">
                    <CheckCircle2 className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-[#115740] font-semibold mb-2">{t("dashboard.employee.allCaughtUp")}</h3>
                  <p className="text-[#6F6F6F] text-sm">{t("dashboard.employee.noRequestsNeedingAction")}</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {recentRequestsNeedingAction.map((request: any) => (
                    <RecentRequestCard
                      key={request.id}
                      request={request}
                      getRequestTypeName={getRequestTypeName}
                      getStatusName={getStatusName}
                      getTimeAgo={getTimeAgo}
                      t={t}
                    />
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
              <StatisticsCard key={index} stat={stat} />
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
            <RequestsLineChart
              data={requestsData}
              isLoading={isLoadingMonthly}
              t={t}
            />
            <RequestTypesBarChart
              data={requestTypesData}
              isLoading={isLoadingTypes}
              t={t}
            />
          </div>
        )}
      </div>
    </div>
  );
});