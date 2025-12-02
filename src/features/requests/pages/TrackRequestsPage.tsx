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
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTrackRequests, REQUEST_TYPES } from "./TrackRequests.logic";
import { useState } from "react";

export function TrackRequestsPage() {
  const {
    searchQuery,
    filterStatus,
    filterType,
    filterDepartment,
    filterAssignment,
    filteredRequests,
    stats,
    departments,
    employees,
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
    handleAssignmentChange,
    handleBackToDashboard,
    handleViewRequest,
    handleAssignEmployee,
  } = useTrackRequests();

  // State to track employee selection for each request
  const [employeeSelections, setEmployeeSelections] = useState<Record<string, number | null>>({});

  const handleEmployeeSelect = (requestId: string, employeeId: string) => {
    const empId = employeeId ? parseInt(employeeId, 10) : null;
    setEmployeeSelections(prev => ({
      ...prev,
      [requestId]: empId
    }));
    
    if (empId) {
      handleAssignEmployee(requestId, empId);
      // Clear selection after assignment
      setTimeout(() => {
        setEmployeeSelections(prev => ({
          ...prev,
          [requestId]: null
        }));
      }, 1000);
    }
  };

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
          <div className={`grid gap-4 ${canAssignRequests ? 'md:grid-cols-6' : 'md:grid-cols-5'}`}>
            {/* Search */}
            <div className="md:col-span-2">
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
                  <SelectItem value={REQUEST_TYPES.SUGGESTION.toString()}>
                    {getRequestTypeName(REQUEST_TYPES.SUGGESTION)}
                  </SelectItem>
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
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        <div className="space-y-4">
          {filteredRequests.map((request) => (
            <Card key={request.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(request.statusId)}`}>
                      {getStatusName(request.statusId)}
                    </span>
                    <span className="text-sm text-gray-500">{getRequestTypeName(request.typeId)}</span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-500">{request.id}</span>
                  </div>
                  <h4 className="text-gray-900 mb-2">
                    {isRTL ? request.titleAr : request.titleEn}
                  </h4>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{request.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span>{isRTL ? request.departmentAr : request.departmentEn}</span>
                    </div>
                    {request.assignedToName && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                          {t("requests.track.assignedTo")}: {request.assignedToName}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {canAssignRequests && (
                    <Select
                      value={employeeSelections[request.id] !== null && employeeSelections[request.id] !== undefined ? employeeSelections[request.id]!.toString() : ""}
                      onValueChange={(value: string) => handleEmployeeSelect(request.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder={t("requests.track.assignEmployee")} />
                      </SelectTrigger>
                      <SelectContent>
                        {employees.map((emp) => (
                          <SelectItem key={emp.id} value={emp.id.toString()}>
                            {isRTL ? emp.nameAr : emp.nameEn}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <Link to={`/dashboard/request/${request.id}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="w-4 h-4" />
                      <span>{t("common.viewDetails")}</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredRequests.length === 0 && (
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
