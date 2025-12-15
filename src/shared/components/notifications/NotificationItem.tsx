import React from 'react';
import { X } from 'lucide-react';
import { Notification, NotificationType } from 'shared/types/notification.types';

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
  onMarkAsRead: (id: string) => void;
  onClose?: () => void;
}

/**
 * Component hiển thị một notification item
 */
const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onClick,
  onMarkAsRead,
  onClose
}) => {
  const handleClick = () => {
    if (!notification.isRead) {
      onMarkAsRead(notification.notificationId);
    }
    onClick();
    if (onClose) {
      onClose();
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    onMarkAsRead(notification.notificationId);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'REQUEST_APPROVED':
        return '✅';
      case 'REQUEST_REJECTED':
        return '❌';
      case 'REQUEST_CREATED':
        return '📋';
      case 'REQUEST_EXPIRED':
        return '⏰';
      default:
        return '📢';
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case 'REQUEST_APPROVED':
        return 'text-green-600';
      case 'REQUEST_REJECTED':
        return 'text-red-600';
      case 'REQUEST_CREATED':
        return 'text-blue-600';
      case 'REQUEST_EXPIRED':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      onClick={handleClick}
      className={`
        px-4 py-3 border-b border-gray-100 cursor-pointer 
        hover:bg-gray-50 transition-colors duration-150
        ${!notification.isRead ? 'bg-blue-50' : 'bg-white'}
      `}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div className={`text-2xl ${getNotificationColor(notification.type)}`}>
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className={`font-semibold text-sm ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
              {notification.title}
            </h4>
            {!notification.isRead && (
              <span className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0 mt-1"></span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">
              {formatDate(notification.createdAt)}
            </span>
            
            {!notification.isRead && (
              <button
                onClick={handleMarkAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Đánh dấu đã đọc
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
