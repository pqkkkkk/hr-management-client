import React, { useState } from 'react';
import { Bell, BellOff } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import { Notification, ConnectionStatus } from 'shared/types/notification.types';

interface NotificationBellProps {
  notifications: Notification[];
  unreadCount: number;
  connectionStatus: ConnectionStatus;
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

/**
 * Component icon chuông thông báo với badge count
 */
const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications,
  unreadCount,
  connectionStatus,
  onMarkAsRead,
  onMarkAllAsRead
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-500';
      case 'connecting':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };

  const getConnectionStatusTooltip = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'Đã kết nối';
      case 'connecting':
        return 'Đang kết nối...';
      case 'error':
        return 'Lỗi kết nối';
      default:
        return 'Chưa kết nối';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors duration-200"
        title={getConnectionStatusTooltip()}
      >
        {/* Bell Icon */}
        {connectionStatus === 'error' ? (
          <BellOff size={24} className="text-white" />
        ) : (
          <Bell size={24} className="text-white" />
        )}

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full min-w-[20px]">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}

        {/* Connection Status Indicator */}
        <span 
          className={`absolute bottom-0 right-0 w-3 h-3 ${getConnectionStatusColor()} rounded-full border-2 border-blue-600`}
          title={getConnectionStatusTooltip()}
        >
          {connectionStatus === 'connecting' && (
            <span className="absolute inset-0 animate-ping w-3 h-3 bg-yellow-400 rounded-full opacity-75"></span>
          )}
        </span>
      </button>

      {/* Dropdown */}
      <NotificationDropdown
        notifications={notifications}
        unreadCount={unreadCount}
        isOpen={isDropdownOpen}
        onClose={() => setIsDropdownOpen(false)}
        onMarkAsRead={onMarkAsRead}
        onMarkAllAsRead={onMarkAllAsRead}
      />
    </div>
  );
};

export default NotificationBell;
