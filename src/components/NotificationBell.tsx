import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Bell, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Mock data
  const mockNotifications: NotificationDto[] = [
    {
      id: 1,
      userId: 1,
      titleAr: "تحديث حالة الطلب",
      titleEn: "Request Status Update",
      messageAr: "تم تحديث حالة طلبك رقم SG-2025-001234 إلى 'قيد المعالجة'",
      messageEn: "Your request SG-2025-001234 status updated to 'Processing'",
      notificationType: "request_update",
      requestId: 1,
      isRead: false,
      createdAt: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
    },
    {
      id: 2,
      userId: 1,
      titleAr: "رد جديد على طلبك",
      titleEn: "New Reply on Your Request",
      messageAr: "تم إضافة رد جديد من فريق الدعم على طلبك",
      messageEn: "New reply from support team on your request",
      notificationType: "new_reply",
      requestId: 2,
      isRead: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(), // 2 hours ago
    },
    {
      id: 3,
      userId: 1,
      titleAr: "تم قبول مقترحك",
      titleEn: "Your Suggestion Accepted",
      messageAr: "تم قبول مقترحك وسيتم العمل على تنفيذه قريباً",
      messageEn: "Your suggestion has been accepted and will be implemented soon",
      notificationType: "suggestion_accepted",
      requestId: 3,
      isRead: true,
      createdAt: new Date(Date.now() - 24 * 60 * 60000).toISOString(), // 1 day ago
    },
    {
      id: 4,
      userId: 1,
      titleAr: "إشعار عام",
      titleEn: "General Notification",
      messageAr: "تحديثات جديدة على النظام متاحة الآن",
      messageEn: "New system updates are now available",
      notificationType: "system",
      isRead: true,
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60000).toISOString(), // 3 days ago
    },
  ];

  useEffect(() => {
    // TODO: Fetch notifications from API
    setNotifications(mockNotifications);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const recentNotifications = notifications.slice(0, 5);

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

  const handleMarkAsRead = async (notificationId: number) => {
    // TODO: API call to mark as read
    setNotifications(
      notifications.map((n) =>
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#6F6F6F] hover:text-[#6CAEBD] transition"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 rtl:right-1 ltr:left-1 h-5 w-5 flex items-center justify-center bg-[#EABB4E] text-white text-[11px] font-bold rounded-full border-2 border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute rtl:right-0 ltr:left-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-[#2B2B2B]">الإشعارات</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>لا توجد إشعارات</p>
              </div>
            ) : (
              recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 transition cursor-pointer ${
                    !notification.isRead ? "bg-blue-50/50" : ""
                  }`}
                  onClick={() => {
                    handleMarkAsRead(notification.id);
                    if (notification.requestId) {
                      window.location.href = `/dashboard/request/SG-2025-00${notification.requestId.toString().padStart(4, "0")}`;
                    }
                  }}
                >
                  <div className="flex items-start gap-3">
                    {!notification.isRead && (
                      <div className="w-2 h-2 rounded-full bg-[#6CAEBD] mt-2 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#2B2B2B] mb-1">
                        {notification.titleAr}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-1 mb-2">
                        {notification.messageAr}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{getTimeAgo(notification.createdAt)}</span>
                        {notification.requestId && (
                          <>
                            <span>•</span>
                            <Badge
                              variant="outline"
                              className="text-xs border-[#6CAEBD] text-[#6CAEBD]"
                            >
                              طلب: SG-2025-00{notification.requestId.toString().padStart(4, "0")}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-3 border-t bg-gray-50">
              <Link
                to="/dashboard/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center text-[#6CAEBD] hover:text-[#6CAEBD]/80 font-medium text-sm"
              >
                عرض كل الإشعارات
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
