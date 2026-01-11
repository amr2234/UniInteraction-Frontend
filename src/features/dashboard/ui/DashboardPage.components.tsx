import React, { memo } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Types
interface StatCard {
  title: string;
  value: string;
  icon: LucideIcon;
  color: string;
  trend: string;
}

interface ServiceCard {
  icon: LucideIcon;
  title: string;
  description: string;
  link: string;
  gradient: string;
}

// Memoized Statistics Card
export const StatisticsCard = memo(({ stat }: { stat: StatCard }) => {
  const Icon = stat.icon;
  
  return (
    <Card className="p-6 bg-white border-0 shadow-soft hover:shadow-soft-lg transition-all hover:-translate-y-1 rounded-xl">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${stat.color}`}>
          <Icon className="w-7 h-7" />
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-[#6F6F6F] text-sm font-medium">{stat.title}</p>
        <h3 className="text-3xl font-bold text-[#2B2B2B]">{stat.value}</h3>
        <p className="text-xs text-[#6F6F6F]">{stat.trend}</p>
      </div>
    </Card>
  );
});

StatisticsCard.displayName = "StatisticsCard";

// Memoized Line Chart Component
export const RequestsLineChart = memo(({ 
  data, 
  isLoading, 
  t 
}: { 
  data: any[]; 
  isLoading: boolean; 
  t: (key: string) => string;
}) => {
  if (isLoading) {
    return (
      <Card className="p-6 bg-white border-0 shadow-soft rounded-xl">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-0 shadow-soft rounded-xl">
      <h3 className="text-lg font-semibold text-[#2B2B2B] mb-6">
        {t("dashboard.requestsOverTime")}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey={t("dashboard.chartLabels.requests")}
            stroke="#6CAEBD"
            strokeWidth={2}
            dot={{ fill: "#6CAEBD" }}
          />
          <Line
            type="monotone"
            dataKey={t("dashboard.chartLabels.completed")}
            stroke="#115740"
            strokeWidth={2}
            dot={{ fill: "#115740" }}
          />
          <Line
            type="monotone"
            dataKey={t("dashboard.chartLabels.underReview")}
            stroke="#EABB4E"
            strokeWidth={2}
            dot={{ fill: "#EABB4E" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
});

RequestsLineChart.displayName = "RequestsLineChart";

// Memoized Bar Chart Component
export const RequestTypesBarChart = memo(({ 
  data, 
  isLoading, 
  t 
}: { 
  data: any[]; 
  isLoading: boolean; 
  t: (key: string) => string;
}) => {
  if (isLoading) {
    return (
      <Card className="p-6 bg-white border-0 shadow-soft rounded-xl">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="h-64 bg-gray-100 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white border-0 shadow-soft rounded-xl">
      <h3 className="text-lg font-semibold text-[#2B2B2B] mb-6">
        {t("dashboard.requestsByType")}
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis dataKey="name" stroke="#6B7280" />
          <YAxis stroke="#6B7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Bar dataKey="count" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
});

RequestTypesBarChart.displayName = "RequestTypesBarChart";

// Memoized Service Card
export const DashboardServiceCard = memo(({ service }: { service: ServiceCard }) => {
  const Icon = service.icon;
  
  return (
    <Link to={service.link}>
      <Card className="p-6 hover:shadow-soft-lg transition-all hover:-translate-y-1 cursor-pointer group h-full rounded-xl border-0 shadow-soft bg-white">
        <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${service.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
          <Icon className="w-8 h-8 text-white" />
        </div>
        <h4 className="text-[#2B2B2B] mb-2 text-lg font-bold">{service.title}</h4>
        <p className="text-[#6F6F6F] text-sm">{service.description}</p>
      </Card>
    </Link>
  );
});

DashboardServiceCard.displayName = "DashboardServiceCard";

// Memoized Request Card (for recent requests)
export const RecentRequestCard = memo(({ 
  request, 
  getRequestTypeName, 
  getStatusName, 
  getTimeAgo,
  t 
}: { 
  request: any;
  getRequestTypeName: (typeId: number) => string;
  getStatusName: (statusId: number) => string;
  getTimeAgo: (date: string) => string;
  t: (key: string) => string;
}) => {
  return (
    <Card className="p-4 hover:shadow-md transition-all border-l-4 border-l-[#6CAEBD] bg-white rounded-xl shadow-soft">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <h4 className="font-semibold text-[#2B2B2B] text-sm mb-1">
            {request.titleAr || request.titleEn}
          </h4>
          <p className="text-xs text-[#6F6F6F]">
            {getRequestTypeName(request.requestTypeId)} • {getTimeAgo(request.createdAt)}
          </p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${
          request.requestStatusId === 2 
            ? "bg-blue-100 text-blue-700"
            : "bg-yellow-100 text-yellow-700"
        }`}>
          {getStatusName(request.requestStatusId)}
        </span>
      </div>
      <p className="text-xs text-[#6F6F6F] line-clamp-2">
        {request.subjectAr || request.subjectEn}
      </p>
    </Card>
  );
});

RecentRequestCard.displayName = "RecentRequestCard";
