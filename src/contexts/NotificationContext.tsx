import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useApi } from './ApiContext';
import { Notification, ConnectionStatus, NotificationFilter } from 'shared/types/notification.types';
import { useFetchList } from 'shared/hooks/use-fetch-list';
import { useQuery } from 'shared/hooks/use-query';
import { toast } from 'react-toastify';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  connectionStatus: ConnectionStatus;
  isFetching: boolean;
  error: string | null;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refetch: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const { notificationApi } = useApi();
  
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  // Query state cho notifications
  const { query, updateQuery } = useQuery<NotificationFilter>({
    recipientId: user?.userId || '',
    currentPage: 0,
    pageSize: 20, // Lấy 20 thông báo gần nhất
  });

  // Sử dụng useFetchList để fetch notifications
  const {
    data: notifications,
    isFetching,
    error,
    refetch,
  } = useFetchList(
    (q: NotificationFilter) => notificationApi.getNotifications(q),
    query
  );

  // Update query khi user thay đổi
  useEffect(() => {
    if (user?.userId) {
      updateQuery({ recipientId: user.userId });
    }
  }, [user?.userId, updateQuery]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Sử dụng ref để lưu refetch function, tránh re-render khi refetch thay đổi
  const refetchRef = React.useRef(refetch);
  
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const handleNewNotification = useCallback((notification: Notification) => {
    console.log('[NotificationContext] New notification received:', notification);
    
    // Show toast notification
    toast.info(notification.title, {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });

    // Refetch để update danh sách
    refetchRef.current();
  }, []); // Empty dependency - callback không bao giờ thay đổi

  // SSE Connection Management
  useEffect(() => {
    if (!user?.userId || !notificationApi.connectSSE) {
      return;
    }

    console.log('[NotificationContext] Setting up SSE connection for user:', user.userId);
    setConnectionStatus('connecting');
    
    let source: EventSource | null = null;
    let connectionTimeout: NodeJS.Timeout | null = null;
    
    try {
      source = notificationApi.connectSSE(user.userId, {
        onNotification: handleNewNotification,
        onOpen: () => {
          console.log('[NotificationContext] SSE connection opened');
          setConnectionStatus('connected');
          // Clear timeout khi connected thành công
          if (connectionTimeout) {
            clearTimeout(connectionTimeout);
          }
        },
        onError: (error) => {
          console.error('[NotificationContext] SSE connection error:', error);
          setConnectionStatus('error');
          
          // EventSource tự động reconnect, set lại status
          if (source instanceof EventSource) {
            setTimeout(() => {
              if (source.readyState === EventSource.CONNECTING) {
                setConnectionStatus('connecting');
              }
            }, 1000);
          }
        }
      });
      
      setEventSource(source);

      // Set timeout 10s cho connection
      connectionTimeout = setTimeout(() => {
        if (source && source.readyState === EventSource.CONNECTING) {
          console.warn('[NotificationContext] SSE connection timeout - still connecting after 10s');
          // Không set error, để EventSource tự retry
        }
      }, 10000);
    } catch (error) {
      console.error('[NotificationContext] Error establishing SSE connection:', error);
      setConnectionStatus('error');
    }

    // Cleanup: Đóng kết nối SSE khi component unmount hoặc user logout
    return () => {
      console.log('[NotificationContext] Cleanup - closing SSE connection');
      
      // Clear timeout nếu có
      if (connectionTimeout) {
        clearTimeout(connectionTimeout);
      }
      
      // Close SSE connection
      if (source && source instanceof EventSource) {
        source.close();
      }
      if (notificationApi.disconnectSSE) {
        notificationApi.disconnectSSE();
      }
      setConnectionStatus('disconnected');
    };
  }, [user?.userId, notificationApi, handleNewNotification]);

  
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await notificationApi.markAsRead(notificationId);
      
      if (response.success) {
        // Refetch để update danh sách
        refetch();
      }
    } catch (error) {
      console.error('[NotificationContext] Error marking notification as read:', error);
      toast.error('Không thể đánh dấu đã đọc. Vui lòng thử lại.');
    }
  }, [notificationApi, refetch]);

  
  const markAllAsRead = useCallback(async () => {
    if (!user?.userId) return;

    try {
      const response = await notificationApi.markAllAsRead(user.userId);
      
      if (response.success) {
        // Refetch để update danh sách
        refetch();
        toast.success('Đã đánh dấu tất cả thông báo là đã đọc');
      }
    } catch (error) {
      console.error('[NotificationContext] Error marking all notifications as read:', error);
      toast.error('Không thể đánh dấu tất cả đã đọc. Vui lòng thử lại.');
    }
  }, [user?.userId, notificationApi, refetch]);

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    connectionStatus,
    isFetching,
    error,
    markAsRead,
    markAllAsRead,
    refetch,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};


export const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (context === undefined) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  
  return context;
};
