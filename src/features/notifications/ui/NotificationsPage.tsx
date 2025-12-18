import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck } from "lucide-react";
import { useNotificationsLogic } from "./NotificationsPage.logic";
import { NotificationCard } from "./NotificationCard";
import { NotificationFilters } from "./NotificationFilters";

export function NotificationsPage() {
  const {
    filteredNotifications,
    activeFilter,
    isLoading,
    unreadCount,
    requestsCount,
    notifications,
    language,
    setActiveFilter,
    handleMarkAllAsRead,
    handleNotificationClick,
    getTimeAgo,
    getNotificationIcon,
    getNotificationTypeLabel,
    t,
  } = useNotificationsLogic();

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-[#2B2B2B] mb-2">
                {t('notifications.title')}
              </h1>
              <p className="text-[#6F6F6F]">
                {unreadCount > 0
                  ? t('notifications.unreadCount').replace('{count}', unreadCount.toString())
                  : t('notifications.allRead')}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={handleMarkAllAsRead}
                className="gap-2 rounded-xl"
              >
                <CheckCheck className="w-4 h-4" />
                {t('notifications.markAllRead')}
              </Button>
            )}
          </div>

          {/* Filters */}
          <NotificationFilters
            activeFilter={activeFilter}
            totalCount={notifications.length}
            unreadCount={unreadCount}
            requestsCount={requestsCount}
            onFilterChange={setActiveFilter}
            t={t}
          />
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {isLoading ? (
            <Card className="p-12 text-center rounded-xl border-0 shadow-soft bg-white">
              <p className="text-[#6F6F6F]">{t('common.loading')}</p>
            </Card>
          ) : filteredNotifications.length === 0 ? (
            <Card className="p-12 text-center rounded-xl border-0 shadow-soft bg-white">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-600 mb-2">{t('notifications.noNotifications')}</h3>
              <p className="text-gray-500 text-sm">
                {activeFilter === "unread"
                  ? t('notifications.allRead')
                  : t('notifications.noNotificationsFound')}
              </p>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={notification}
                language={language}
                onClick={handleNotificationClick}
                getTimeAgo={getTimeAgo}
                getNotificationIcon={getNotificationIcon}
                getNotificationTypeLabel={getNotificationTypeLabel}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
