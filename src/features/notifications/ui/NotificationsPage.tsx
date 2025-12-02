import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, Filter } from "lucide-react";

interface NotificationDto {
  id: number;
  userId: number;
  titleAr: string;
  titleEn?: string;
  messageAr: string;
  messageEn?: string;
  notificationType: string;
  requestId?: number;
  isRead: boolean;
  createdAt: string;
}

type FilterType = "all" | "unread" | "requests";

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const mockNotifications: NotificationDto[] = [
    {
      id: 1,
      userId: 1,
      titleAr: "تحديث حالة الطلب",
      titleEn: "Request Status Update",
      messageAr: "تم تحديث حالة طلبك رقم SG-2025-001234 إلى 'قيد المعالجة'. يتم العمل على طلبك حالياً من قبل الفريق المختص.",
      messageEn: "Your request SG-2025-001234 status updated to 'Processing'",
      notificationType: "request_update",
      requestId: 1,
      isRead: false,
      createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    },
    {
      id: 2,
      userId: 1,
      titleAr: "رد جديد على طلبك",
      titleEn: "New Reply on Your Request",
      messageAr: "تم إضافة رد جديد من فريق الدعم على طلبك رقم SG-2025-001235. يرجى مراجعة الرد والتفاعل إذا لزم الأمر.",
      messageEn: "New reply from support team on your request",
      notificationType: "new_reply",
      requestId: 2,
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
    },
    {
      id: 3,
      userId: 1,
      titleAr: "تم قبول مقترحك",
      titleEn: "Your Suggestion Accepted",
      messageAr: "تم قبول مقترحك المتعلق بتطوير المكتبة الرقمية وسيتم العمل على تنفيذه خلال الفترة القادمة.",
      messageEn: "Your suggestion has been accepted",
      notificationType: "suggestion_accepted",
      requestId: 3,
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(),
    },
    {
      id: 4,
      userId: 1,
      titleAr: "تم إغلاق الطلب",
      titleEn: "Request Closed",
      messageAr: "تم إغلاق طلبك رقم SG-2025-001230 بنجاح. شكراً لتواصلك معنا.",
      messageEn: "Your request has been closed successfully",
      notificationType: "request_closed",
      requestId: 4,
      isRead: true,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60000).toISOString(),
    },
    {
      id: 5,
      userId: 1,
      titleAr: "إشعار عام",
      titleEn: "General Notification",
      messageAr: "تحديثات جديدة على النظام متاحة الآن. تتضمن التحديثات تحسينات على الأداء وإصلاحات للأخطاء.",
      messageEn: "New system updates are now available",
      notificationType: "system",
      isRead: false,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(),
    },
    {
      id: 6,
      userId: 1,
      titleAr: "موعد زيارة قادم",
      titleEn: "Upcoming Visit Appointment",
      messageAr: "لديك موعد زيارة مجدول غداً الساعة 10:00 صباحاً مع رئيس الجامعة.",
      messageEn: "You have a scheduled visit tomorrow at 10:00 AM",
      notificationType: "visit_reminder",
      requestId: 5,
      isRead: false,
      createdAt: new Date(Date.now() - 4 * 60 * 60000).toISOString(),
    },
  ];

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/notifications');
      // const data = await response.json();

      await new Promise((resolve) => setTimeout(resolve, 500));
      setNotifications(mockNotifications);
    } catch (error) {
      console.error("Failed to fetch notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const getFilteredNotifications = () => {
    switch (activeFilter) {
      case "unread":
        return notifications.filter((n) => !n.isRead);
      case "requests":
        return notifications.filter((n) => n.requestId);
      default:
        return notifications;
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    // TODO: API call to mark as read
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const handleMarkAllAsRead = async () => {
    // TODO: API call to mark all as read
    setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
  };

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "الآن";
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    return `منذ ${diffDays} يوم`;
  };

  const getNotificationIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      request_update: "🔄",
      new_reply: "💬",
      suggestion_accepted: "✅",
      request_closed: "✓",
      system: "🔔",
      visit_reminder: "📅",
    };
    return iconMap[type] || "🔔";
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-[#2B2B2B] mb-2">الإشعارات</h1>
              <p className="text-[#6F6F6F]">
                {unreadCount > 0
                  ? `لديك ${unreadCount} إشعار غير مقروء`
                  : "جميع الإشعارات مقروءة"}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                className="gap-2 rounded-xl"
              >
                <CheckCheck className="w-4 h-4" />
                تعليم الكل كمقروء
              </Button>
            )}
          </div>

          {/* Filters */}
          <Card className="p-4 rounded-xl border-0 shadow-soft bg-white">
            <div className="flex items-center gap-2 flex-wrap">
              <Filter className="w-5 h-5 text-[#6F6F6F]" />
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-4 py-2 rounded-xl transition ${
                  activeFilter === "all"
                    ? "bg-[#6CAEBD] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                الكل ({notifications.length})
              </button>
              <button
                onClick={() => setActiveFilter("unread")}
                className={`px-4 py-2 rounded-xl transition ${
                  activeFilter === "unread"
                    ? "bg-[#6CAEBD] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                غير مقروء ({unreadCount})
              </button>
              <button
                onClick={() => setActiveFilter("requests")}
                className={`px-4 py-2 rounded-xl transition ${
                  activeFilter === "requests"
                    ? "bg-[#6CAEBD] text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                الطلبات ({notifications.filter((n) => n.requestId).length})
              </button>
            </div>
          </Card>
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {isLoading ? (
            <Card className="p-12 text-center rounded-xl border-0 shadow-soft bg-white">
              <p className="text-[#6F6F6F]">جاري التحميل...</p>
            </Card>
          ) : filteredNotifications.length === 0 ? (
            <Card className="p-12 text-center rounded-xl border-0 shadow-soft bg-white">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-600 mb-2">لا توجد إشعارات</h3>
              <p className="text-gray-500 text-sm">
                {activeFilter === "unread"
                  ? "جميع الإشعارات مقروءة"
                  : "لم يتم العثور على إشعارات"}
              </p>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={`p-6 rounded-xl border-0 shadow-soft hover:shadow-md transition-all cursor-pointer ${
                  !notification.isRead
                    ? "bg-blue-50/50 border-l-4 border-l-[#6CAEBD]"
                    : "bg-white"
                }`}
                onClick={() => {
                  handleMarkAsRead(notification.id);
                  if (notification.requestId) {
                    window.location.href = `/dashboard/request/SG-2025-00${notification.requestId
                      .toString()
                      .padStart(4, "0")}`;
                  }
                }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-3xl flex-shrink-0">
                    {getNotificationIcon(notification.notificationType)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="font-semibold text-[#2B2B2B] text-lg">
                        {notification.titleAr}
                      </h3>
                      {!notification.isRead && (
                        <div className="w-2 h-2 rounded-full bg-[#6CAEBD] flex-shrink-0 mt-2" />
                      )}
                    </div>

                    <p className="text-[#6F6F6F] mb-3 leading-relaxed">
                      {notification.messageAr}
                    </p>

                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm text-gray-500">
                        {getTimeAgo(notification.createdAt)}
                      </span>

                      {notification.requestId && (
                        <>
                          <span className="text-gray-300">•</span>
                          <Badge
                            variant="outline"
                            className="border-[#6CAEBD] text-[#6CAEBD]"
                          >
                            طلب: SG-2025-00
                            {notification.requestId.toString().padStart(4, "0")}
                          </Badge>
                        </>
                      )}

                      <span className="text-gray-300">•</span>
                      <Badge variant="secondary" className="bg-gray-100">
                        {notification.notificationType === "request_update" && "تحديث طلب"}
                        {notification.notificationType === "new_reply" && "رد جديد"}
                        {notification.notificationType === "suggestion_accepted" &&
                          "قبول مقترح"}
                        {notification.notificationType === "request_closed" &&
                          "إغلاق طلب"}
                        {notification.notificationType === "system" && "نظام"}
                        {notification.notificationType === "visit_reminder" &&
                          "تذكير زيارة"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
