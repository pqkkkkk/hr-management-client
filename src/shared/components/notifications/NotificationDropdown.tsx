import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Notification, NotificationReferenceType } from 'shared/types/notification.types';
import NotificationItem from './NotificationItem';

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  isOpen: boolean;
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

/**
 * Component dropdown hiển thị danh sách thông báo
 */
const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  unreadCount,
  isOpen,
  onClose,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleNotificationClick = (notification: Notification) => {
    navigateToReference(notification.referenceType, notification.referenceId);
    onClose();
  };

  const navigateToReference = (referenceType: NotificationReferenceType, referenceId: string) => {
    switch (referenceType) {
      case 'REQUEST':
        navigate(`/requests/${referenceId}`);
        break;
      case 'REWARD':
        // TODO: Implement reward detail page route
        navigate(`/rewards/${referenceId}`);
        break;
      case 'ACTIVITY':
        // TODO: Implement activity detail page route
        navigate(`/activities/${referenceId}`);
        break;
      default:
        navigate('/dashboard');
    }
  };

  return (
    <>
      {/* Backdrop để đóng dropdown khi click bên ngoài */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose}
      />

      {/* Dropdown content */}
      <div className="absolute right-0 mt-2 w-96 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 min-w-[320px] max-w-[calc(100vw-2rem)]">
        {/* Header */}
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-gray-900 whitespace-nowrap">
              Thông báo
              {unreadCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold text-white bg-blue-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMarkAllAsRead();
                }}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium whitespace-nowrap flex-shrink-0"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
        </div>

        {/* Notifications list */}
        <div className="max-h-[28rem] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-5xl mb-3">🔔</div>
              <p className="text-gray-500 font-medium">Không có thông báo mới</p>
              <p className="text-sm text-gray-400 mt-1">
                Bạn sẽ nhận được thông báo khi có cập nhật
              </p>
            </div>
          ) : (
            <div>
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.notificationId}
                  notification={notification}
                  onClick={() => handleNotificationClick(notification)}
                  onMarkAsRead={onMarkAsRead}
                  onClose={onClose}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer - View All (optional) */}
        {notifications.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <button
              onClick={() => {
                navigate('/notifications');
                onClose();
              }}
              className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Xem tất cả thông báo
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationDropdown;
