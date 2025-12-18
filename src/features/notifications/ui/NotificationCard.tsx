import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NotificationDto } from '@/core/types/api';

interface NotificationCardProps {
  notification: NotificationDto;
  language: 'ar' | 'en';
  onClick: (notification: NotificationDto) => void;
  getTimeAgo: (dateString: string, receivedAt?: string) => string;
  getNotificationIcon: (type: string) => string;
  getNotificationTypeLabel: (type: string) => string;
}

export function NotificationCard({
  notification,
  language,
  onClick,
  getTimeAgo,
  getNotificationIcon,
  getNotificationTypeLabel,
}: NotificationCardProps) {
  const title = language === 'ar' ? notification.titleAr : (notification.titleEn || notification.titleAr);
  const message = language === 'ar' 
    ? (notification.messageAr || notification.bodyAr) 
    : (notification.messageEn || notification.bodyEn || notification.messageAr);
  
  const senderName = language === 'ar' 
    ? (notification.senderNameAr || notification.senderName)
    : (notification.senderNameEn || notification.senderName);
  
  const departmentName = language === 'ar'
    ? (notification.departmentNameAr || notification.departmentName)
    : (notification.departmentNameEn || notification.departmentName);
  
  const requestTypeName = language === 'ar'
    ? notification.requestTypeNameAr
    : notification.requestTypeNameEn;

  return (
    <Card
      className={`p-6 rounded-xl border-0 shadow-soft hover:shadow-md transition-all cursor-pointer ${
        !notification.isRead
          ? 'bg-blue-50/50 border-l-4 border-l-[#6CAEBD]'
          : 'bg-white'
      }`}
      onClick={() => onClick(notification)}
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="text-3xl flex-shrink-0">
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h3 className="font-semibold text-[#2B2B2B] text-lg">
              {title}
            </h3>
            {!notification.isRead && (
              <div className="w-2 h-2 rounded-full bg-[#6CAEBD] flex-shrink-0 mt-2" />
            )}
          </div>

          <p className="text-[#6F6F6F] mb-3 leading-relaxed">
            {message}
          </p>

          {/* Sender and Department Info */}
          {(senderName || departmentName) && (
            <div className="flex items-center gap-2 mb-2 text-sm">
              {senderName && (
                <>
                  <span className="text-gray-600">
                    {language === 'ar' ? 'من:' : 'From:'}
                  </span>
                  <span className="font-medium text-[#6CAEBD]">{senderName}</span>
                </>
              )}
              {senderName && departmentName && (
                <span className="text-gray-300">•</span>
              )}
              {departmentName && (
                <>
                  <span className="text-gray-600">
                    {language === 'ar' ? 'القسم:' : 'Dept:'}
                  </span>
                  <span className="font-medium text-gray-700">{departmentName}</span>
                </>
              )}
            </div>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm text-gray-500">
              {getTimeAgo(notification.createdAt, notification.receivedAt)}
            </span>

            {notification.relatedEntityType === 'UserRequest' && (notification.relatedEntityId || notification.userRequestId) && (
              <>
                <span className="text-gray-300">•</span>
                <Badge
                  variant="outline"
                  className="border-[#6CAEBD] text-[#6CAEBD]"
                >
                  {notification.requestNumber 
                    ? `${language === 'ar' ? 'طلب' : 'Request'}: ${notification.requestNumber}`
                    : `${language === 'ar' ? 'طلب' : 'Request'}: #${notification.relatedEntityId || notification.userRequestId}`
                  }
                </Badge>
              </>
            )}

            {requestTypeName && (
              <>
                <span className="text-gray-300">•</span>
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  {requestTypeName}
                </Badge>
              </>
            )}

            <span className="text-gray-300">•</span>
            <Badge variant="secondary" className="bg-gray-100">
              {getNotificationTypeLabel(notification.type)}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
}
