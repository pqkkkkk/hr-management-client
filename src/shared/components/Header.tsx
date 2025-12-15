import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import { useNotifications } from 'contexts/NotificationContext';
import { NotificationBell } from 'shared/components/notifications';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const {
    notifications,
    unreadCount,
    connectionStatus,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-2xl font-bold hover:text-blue-100 transition">
              HR Management
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <div className="flex items-center gap-4">
                {/* Notification Bell */}
                <NotificationBell
                  notifications={notifications}
                  unreadCount={unreadCount}
                  connectionStatus={connectionStatus}
                  onMarkAsRead={markAsRead}
                  onMarkAllAsRead={markAllAsRead}
                />

                {/* User Info & Logout */}
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex flex-col items-end">
                    <span className="font-medium">{user.fullName}</span>
                    <span className="text-sm text-blue-100">({user.role})</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition duration-200"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
