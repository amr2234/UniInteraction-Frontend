import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useUserNotifications, useMarkNotificationAsRead } from "@/features/notifications/hooks/useNotifications";
import { useUser } from "@/core/hooks/useUser";
import { useI18n } from "@/i18n";
import { NotificationDto } from "@/core/types/api";

export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { t, language } = useI18n();
  const { userId } = useUser();
  const userIdNumber = userId ? parseInt(userId, 10) : 0;
  const { data: notifications = [], isLoading } = useUserNotifications(userIdNumber);
  const markAsReadMutation = useMarkNotificationAsRead();



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
  const recentNotifications = notifications.slice(0, 4);

  const getTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('notifications.justNow');
    if (diffMins < 60) return t('notifications.minutesAgo').replace('{count}', diffMins.toString());
    if (diffHours < 24) return t('notifications.hoursAgo').replace('{count}', diffHours.toString());
    return t('notifications.daysAgo').replace('{count}', diffDays.toString());
  };

  const handleMarkAsRead = async (notificationId: number) => {
    await markAsReadMutation.mutateAsync(notificationId);
  };

  const handleNotificationClick = async (notification: NotificationDto) => {

    if (!notification.isRead) {
      await handleMarkAsRead(notification.id);
    }

    // Navigate to request details
    const requestId = notification.relatedEntityId || notification.userRequestId;

    if (requestId) {
      setIsOpen(false);
      navigate(`/dashboard/request/${requestId}`);
    }
  };

  const getTitle = (notification: NotificationDto) => {
    return language === 'ar' ? notification.titleAr : (notification.titleEn || notification.titleAr);
  };

  const getBody = (notification: NotificationDto) => {
    return language === 'ar' ? notification.messageAr : (notification.messageEn || notification.messageAr);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      { }
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

      { }
      {isOpen && (
        <div className="absolute rtl:right-0 ltr:left-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-lg border border-gray-200 z-50">
          { }
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-[#2B2B2B]">{t("notifications.title")}</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          { }
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-gray-500">
                <p>{t("common.loading")}</p>
              </div>
            ) : recentNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>{t("notifications.noNotifications")}</p>
              </div>
            ) : (
              recentNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b hover:bg-gray-50 transition cursor-pointer ${!notification.isRead ? "bg-blue-50/50" : ""
                    }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-3">
                    {!notification.isRead && (
                      <div className="w-2 h-2 rounded-full bg-[#6CAEBD] mt-2 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#2B2B2B] mb-1">
                        {getTitle(notification)}
                      </p>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {getBody(notification)}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{getTimeAgo(notification.createdAt)}</span>
                        {(notification.userRequestId || notification.relatedEntityId) && (
                          <>
                            <span>•</span>
                            <Badge
                              variant="outline"
                              className="text-xs border-[#6CAEBD] text-[#6CAEBD]"
                            >
                              {t("notifications.request")} #{notification.userRequestId || notification.relatedEntityId}
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

          { }
          {notifications.length > 0 && (
            <div className="p-3 border-t bg-gray-50">
              <Link
                to="/dashboard/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center text-[#6CAEBD] hover:text-[#6CAEBD]/80 font-medium text-sm"
              >
                {t("notifications.viewAll")}
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
