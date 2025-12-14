import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  FileSearch,
  Search,
  ArrowRight,
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTrackRequests, REQUEST_TYPES } from "./TrackRequests.logic";

export function TrackRequestsPage() {
  const {
    searchQuery,
    filterStatus,
    filterType,
    filterDepartment,
    filterLeadership,
    filterAssignment,
    startDate,
    endDate,
    filteredRequests,
    stats,
    departments,
    leadership,
    currentPage,
    totalPages,
    totalCount,
    isLoadingRequests,
    canAssignRequests,
    isRTL,
    t,
    getRequestTypeName,
    getStatusColor,
    getStatusName,
    handleSearchChange,
    handleStatusChange,
    handleTypeChange,
    handleDepartmentChange,
    handleLeadershipChange,
    handleAssignmentChange,
    handleStartDateChange,
    handleEndDateChange,
    handlePageChange,
    handleBackToDashboard,
    handleViewRequest,
    handleAssignDepartment,
    handleResetFilters,
    handleResetDates,
  } = useTrackRequests();

  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToDashboard}
            className="flex items-center gap-2 text-gray-600 hover:text-[#115740] mb-4"
          >
            <ArrowRight className={`w-5 h-5 ${isRTL ? '' : 'rotate-180'}`} />
            <span>{t("requests.track.backToDashboard")}</span>
          </button>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <FileSearch className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-[#115740]">{t("requests.track.title")}</h1>
              <p className="text-gray-600">{t("requests.track.subtitle")}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900">{t("requests.track.filters")}</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetFilters}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              {t("requests.track.resetFilters")}
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Search */}
            <div className="md:col-span-2 lg:col-span-1">
              <div className="relative">
                <Search
                  className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5`}
                />
                <Input
                  type="text"
                  placeholder={t("requests.track.searchPlaceholder")}
                  className={isRTL ? "pr-10" : "pl-10"}
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <Select value={filterStatus} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("requests.track.filterByStatus")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("requests.track.allStatuses")}</SelectItem>
                  <SelectItem value="new">{t("requests.track.new")}</SelectItem>
                  <SelectItem value="review">{t("requests.track.underReview")}</SelectItem>
                  <SelectItem value="processing">{t("requests.track.processing")}</SelectItem>
                  <SelectItem value="closed">{t("requests.track.closed")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type Filter */}
            <div>
              <Select value={filterType} onValueChange={handleTypeChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("requests.track.filterByType")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("requests.track.allTypes")}</SelectItem>
                  <SelectItem value={REQUEST_TYPES.COMPLAINT.toString()}>
                    {getRequestTypeName(REQUEST_TYPES.COMPLAINT)}
                  </SelectItem>
                  <SelectItem value={REQUEST_TYPES.INQUIRY.toString()}>
                    {getRequestTypeName(REQUEST_TYPES.INQUIRY)}
                  </SelectItem>
                  <SelectItem value={REQUEST_TYPES.VISIT.toString()}>
                    {getRequestTypeName(REQUEST_TYPES.VISIT)}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Department Filter */}
            <div>
              <Select value={filterDepartment} onValueChange={handleDepartmentChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("requests.track.filterByDepartment")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("requests.track.allDepartments")}</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {isRTL ? dept.nameAr : (dept.nameEn || dept.nameAr)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Leadership Filter */}
            <div>
              <Select value={filterLeadership} onValueChange={handleLeadershipChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("requests.track.filterByLeadership")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("requests.track.allLeadership")}</SelectItem>
                  {leadership.map((leader) => (
                    <SelectItem key={leader.id} value={leader.id.toString()}>
                      {isRTL ? leader.nameAr : (leader.nameEn || leader.nameAr)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Start Date Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {t("requests.track.startDate")}
              </label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="w-full"
              />
            </div>

            {/* End Date Filter */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">
                {t("requests.track.endDate")}
              </label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="w-full"
                min={startDate}
              />
            </div>

            {/* Reset Dates Button */}
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={handleResetDates}
                className="w-full gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                {t("requests.track.resetDates")}
              </Button>
            </div>

            {/* Assignment Filter - Admin Only */}
            {canAssignRequests && (
              <div>
                <Select value={filterAssignment} onValueChange={handleAssignmentChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("requests.track.filterByAssignment")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("requests.track.allAssignments")}</SelectItem>
                    <SelectItem value="assigned">{t("requests.track.assignedOnly")}</SelectItem>
                    <SelectItem value="unassigned">{t("requests.track.unassignedOnly")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </Card>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {[
            { label: t("requests.track.total"), value: stats.total, color: "bg-gray-100 text-gray-700" },
            { label: t("requests.track.new"), value: stats.new, color: "bg-purple-100 text-purple-700" },
            { label: t("requests.track.underReview"), value: stats.underReview, color: "bg-orange-100 text-orange-700" },
            { label: t("requests.track.closed"), value: stats.closed, color: "bg-green-100 text-green-700" },
          ].map((stat, index) => (
            <Card key={index} className={`p-4 ${stat.color}`}>
              <p className="text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </Card>
          ))}
        </div>

        {/* Requests List */}
        {isLoadingRequests ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600">{t("common.loading")}</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => {
              const isVisitRequest = request.requestTypeId === REQUEST_TYPES.VISIT;

              return (
                <Card key={request.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(request.requestStatusId)}`}>
                          {getStatusName(request.requestStatusId)}
                        </span>
                        <span className="text-sm text-gray-500">{getRequestTypeName(request.requestTypeId)}</span>
                        <span className="text-sm text-gray-400">•</span>
                        <span className="text-sm text-gray-500">{request.requestNumber}</span>
                      </div>
                      <h4 className="text-gray-900 mb-2">
                        {isRTL ? request.titleAr : (request.titleEn || request.titleAr)}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(request.createdAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}</span>
                        </div>
                        
                        {/* Visit Request - Show Leadership and Visit Date */}
                        {isVisitRequest && (
                          <>
                            {request.universityLeadershipName ? (
                              <div className="flex items-center gap-1">
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  {t("requests.track.assignedTo")}: {request.universityLeadershipName}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {t("requests.track.noLeadershipAssigned")}
                                </span>
                              </div>
                            )}
                            {request.visitStartAt ? (
                              <div className="flex items-center gap-1">
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                  {t("requests.track.visitDate")}: {new Date(request.visitStartAt).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US')}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {t("requests.track.noDateAssigned")}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                        
                        {/* Other Request Types - Show Category and Department */}
                        {!isVisitRequest && (
                          <>
                            {request.mainCategoryName && (
                              <div className="flex items-center gap-1">
                                <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                  {request.mainCategoryName}
                                </span>
                              </div>
                            )}
                            {request.departmentName ? (
                              <div className="flex items-center gap-1">
                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                  {t("requests.track.assignedToDept")}: {request.departmentName}
                                </span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1">
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {t("requests.track.notAssignedToDept")}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link to={`/dashboard/request/${request.id}`}>
                        <Button variant="outline" size="sm" className="gap-2">
                          <Eye className="w-4 h-4" />
                          <span>{t("common.viewDetails")}</span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!isLoadingRequests && totalPages > 1 && (
          <Card className="p-4 mt-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {t("common.showing")} {(currentPage - 1) * 10 + 1} - {Math.min(currentPage * 10, totalCount)} {t("common.of")} {totalCount}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t("common.previous")}
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                        className="w-10"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  {t("common.next")}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        )}

        {!isLoadingRequests && filteredRequests.length === 0 && (
          <Card className="p-12 text-center">
            <FileSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-gray-600 mb-2">{t("requests.track.noRequests")}</h3>
            <p className="text-gray-500 text-sm">{t("requests.track.noRequestsMessage")}</p>
          </Card>
        )}
      </div>
    </div>
  );
}
