import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Calendar, ArrowRightLeft, User } from "lucide-react";

// Types
interface Request {
  id: number;
  requestNumber: string;
  titleAr?: string;
  titleEn?: string;
  subjectAr?: string;
  subjectEn?: string;
  nameAr?: string;
  nameEn?: string;
  requestTypeId: number;
  requestStatusId: number;
  createdAt: string;
  departmentNameAr?: string;
  departmentNameEn?: string;
  assignedToNameAr?: string;
  assignedToNameEn?: string;
  assignedToUserId?: number;
  mainCategoryName?: string;
  departmentName?: string;
  universityLeadershipName?: string;
  visitDate?: string;
  visitStatus?: number;
  redirectToNewRequest?: boolean;
  relatedRequestId?: number;
}

// Memoized Request Card Component
export const RequestCard = memo(({
  request,
  isRTL,
  getRequestTypeName,
  getStatusColor,
  getStatusName,
  formatDate,
  canAssignRequests,
  handleViewRequest,
  handleAssignDepartment,
  t,
}: {
  request: Request;
  isRTL: boolean;
  getRequestTypeName: (typeId: number) => string;
  getStatusColor: (statusId: number) => string;
  getStatusName: (statusId: number) => string;
  formatDate: (date: string) => string;
  canAssignRequests: boolean;
  handleViewRequest: (id: number) => void;
  handleAssignDepartment: (request: Request) => void;
  t: (key: string) => string;
}) => {
  return (
    <Card className="p-6 hover:shadow-soft-lg transition-all border-0 shadow-soft bg-white rounded-xl">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-mono text-gray-500">
              #{request.requestNumber}
            </span>
            <Badge variant="outline" className="text-xs">
              {getRequestTypeName(request.requestTypeId)}
            </Badge>
          </div>
          <h3 className="font-semibold text-[#2B2B2B] mb-1">
            {isRTL
              ? request.titleAr || request.titleEn
              : request.titleEn || request.titleAr}
          </h3>
          <p className="text-sm text-[#6F6F6F] line-clamp-2">
            {isRTL
              ? request.subjectAr || request.subjectEn
              : request.subjectEn || request.subjectAr}
          </p>
        </div>
        <Badge className={getStatusColor(request.requestStatusId)}>
          {getStatusName(request.requestStatusId)}
        </Badge>
      </div>

      <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <User className="w-4 h-4" />
          <span>
            {isRTL
              ? request.nameAr || request.nameEn
              : request.nameEn || request.nameAr}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(request.createdAt)}</span>
        </div>
        {(request.departmentNameAr || request.departmentNameEn) && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-gray-500">{t("form.department")}:</span>
            <span>
              {isRTL
                ? request.departmentNameAr || request.departmentNameEn
                : request.departmentNameEn || request.departmentNameAr}
            </span>
          </div>
        )}
        {(request.assignedToNameAr || request.assignedToNameEn) && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="text-gray-500">{t("requests.track.assignedTo")}:</span>
            <span>
              {isRTL
                ? request.assignedToNameAr || request.assignedToNameEn
                : request.assignedToNameEn || request.assignedToNameAr}
            </span>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleViewRequest(request.id)}
          className="flex-1 gap-2"
        >
          <Eye className="w-4 h-4" />
          {t("requests.track.viewDetails")}
        </Button>
        {canAssignRequests && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAssignDepartment(request)}
            className="gap-2"
          >
            <ArrowRightLeft className="w-4 h-4" />
            {t("requests.track.assign")}
          </Button>
        )}
      </div>
    </Card>
  );
});

RequestCard.displayName = "RequestCard";

// Memoized Statistics Card
export const RequestStatsCard = memo(({
  stat,
  isRTL,
}: {
  stat: {
    title: string;
    value: number;
    color: string;
    icon: React.ComponentType<{ className?: string }>;
  };
  isRTL: boolean;
}) => {
  const Icon = stat.icon;
  
  return (
    <Card className="p-4 bg-white border-0 shadow-soft rounded-xl">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl ${stat.color} bg-opacity-10 flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${stat.color}`} />
        </div>
        <div>
          <p className="text-2xl font-bold text-[#2B2B2B]">{stat.value}</p>
          <p className="text-sm text-[#6F6F6F]">{stat.title}</p>
        </div>
      </div>
    </Card>
  );
});

RequestStatsCard.displayName = "RequestStatsCard";

// Memoized Empty State
export const EmptyRequestsState = memo(({ 
  t, 
  filterStatus 
}: { 
  t: (key: string) => string;
  filterStatus: string;
}) => {
  return (
    <Card className="p-12 text-center bg-white border-0 shadow-soft rounded-xl">
      <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <svg
          className="w-12 h-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-[#2B2B2B] mb-2">
        {t("requests.track.noRequests")}
      </h3>
      <p className="text-sm text-[#6F6F6F]">
        {filterStatus === "all"
          ? t("requests.track.noRequestsDesc")
          : t("requests.track.noRequestsWithFilters")}
      </p>
    </Card>
  );
});

EmptyRequestsState.displayName = "EmptyRequestsState";

// Memoized Loading Skeleton
export const RequestCardSkeleton = memo(() => {
  return (
    <Card className="p-6 bg-white border-0 shadow-soft rounded-xl">
      <div className="animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
        <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-9 bg-gray-200 rounded flex-1"></div>
          <div className="h-9 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </Card>
  );
});

RequestCardSkeleton.displayName = "RequestCardSkeleton";
