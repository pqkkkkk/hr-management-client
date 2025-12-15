/**
 * Notification Types
 * Định nghĩa các types cho notification system
 */

/**
 * Loại thông báo theo mục đích
 */
export type NotificationType = 
  | 'REQUEST_APPROVED'  // Yêu cầu được phê duyệt
  | 'REQUEST_REJECTED'  // Yêu cầu bị từ chối
  | 'REQUEST_CREATED'   // Có yêu cầu mới (cho manager/HR)
  | 'REQUEST_EXPIRED';  // Yêu cầu hết hạn

/**
 * Loại đối tượng được tham chiếu
 */
export type NotificationReferenceType = 
  | 'REQUEST'   // Thông báo liên quan đến request
  | 'REWARD'    // Thông báo liên quan đến reward
  | 'ACTIVITY'; // Thông báo liên quan đến activity

/**
 * Notification object từ server
 */
export interface Notification {
  notificationId: string;
  title: string;
  message: string;
  type: NotificationType;
  referenceType: NotificationReferenceType;
  referenceId: string;
  isRead: boolean;
  createdAt: string;
  recipientId: string;
}

/**
 * Query parameters cho SSE connection
 */
export interface NotificationStreamQuery {
  userId: string;
}

/**
 * Connection status cho SSE
 */
export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface NotificationFilter {
    currentPage?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: string;
    recipientId?: string;
    isRead?: boolean;
}
