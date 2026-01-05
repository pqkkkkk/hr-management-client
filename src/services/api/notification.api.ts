import { ApiResponse, Page } from 'shared/types';
import { Notification, NotificationFilter } from 'shared/types/notification.types';
import { springApiClient, SPRING_API_BASE_URL } from './api.client';

/**
 * Callbacks cho SSE events
 */
export interface SSECallbacks {
  onNotification: (notification: Notification) => void;
  onOpen?: () => void;
  onError?: (error: Event) => void;
}

/**
 * Interface định nghĩa các phương thức API cho notification
 */
export interface NotificationApi {
  getNotifications(filter?: NotificationFilter): Promise<ApiResponse<Page<Notification>>>;
  markAsRead(notificationId: string): Promise<ApiResponse<null>>;
  markAllAsRead(userId: string): Promise<ApiResponse<null>>;
  connectSSE?(userId: string, callbacks: SSECallbacks): EventSource;
  disconnectSSE?(): void;
}

/**
 * Mock implementation của NotificationApi
 * Sử dụng mock data và Promise để simulate API calls
 */
export class MockNotificationApi implements NotificationApi {
  private mockNotifications: Notification[] = [
    {
      notificationId: '1',
      title: 'Yêu cầu nghỉ phép được duyệt',
      message: 'Yêu cầu nghỉ phép của bạn từ ngày 15/12/2024 đến 20/12/2024 đã được phê duyệt',
      type: 'REQUEST_APPROVED',
      referenceType: 'REQUEST',
      referenceId: 'req-123',
      isRead: false,
      createdAt: new Date().toISOString(),
      recipientId: 'user-1'
    },
    {
      notificationId: '2',
      title: 'Yêu cầu check-out bị từ chối',
      message: 'Yêu cầu check-out của bạn đã bị từ chối. Lý do: Thời gian không hợp lệ',
      type: 'REQUEST_REJECTED',
      referenceType: 'REQUEST',
      referenceId: 'req-124',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      recipientId: 'user-1'
    },
    {
      notificationId: '3',
      title: 'Yêu cầu mới cần duyệt',
      message: 'Nhân viên Nguyễn Văn A đã tạo yêu cầu nghỉ phép. Vui lòng xem xét.',
      type: 'REQUEST_CREATED',
      referenceType: 'REQUEST',
      referenceId: 'req-125',
      isRead: true,
      createdAt: new Date(Date.now() - 7200000).toISOString(),
      recipientId: 'user-1'
    },
    {
      notificationId: '4',
      title: 'Yêu cầu hết hạn',
      message: 'Yêu cầu check-in của bạn đã hết hạn và bị từ chối tự động',
      type: 'REQUEST_EXPIRED',
      referenceType: 'REQUEST',
      referenceId: 'req-126',
      isRead: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      recipientId: 'user-1'
    },
    {
      notificationId: '5',
      title: 'Yêu cầu nghỉ phép được duyệt',
      message: 'Yêu cầu nghỉ phép của bạn từ ngày 20/12/2024 đến 25/12/2024 đã được phê duyệt',
      type: 'REQUEST_APPROVED',
      referenceType: 'REQUEST',
      referenceId: 'req-127',
      isRead: true,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      recipientId: 'user-1'
    }
  ];

  private eventSource: EventSource | null = null;

  getNotifications(filter?: NotificationFilter): Promise<ApiResponse<Page<Notification>>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filter notifications
        let filtered = [...this.mockNotifications];

        if (filter?.recipientId) {
          filtered = filtered.filter(n => n.recipientId === filter.recipientId);
        }

        if (filter?.isRead !== undefined) {
          filtered = filtered.filter(n => n.isRead === filter.isRead);
        }

        // Sort by createdAt desc (newest first)
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Pagination
        const page = filter?.currentPage || 0;
        const size = filter?.pageSize || 10;
        const start = page * size;
        const end = start + size;
        const paginatedContent = filtered.slice(start, end);

        const totalElements = filtered.length;
        const totalPages = Math.ceil(totalElements / size);

        const pageResponse: Page<Notification> = {
          content: paginatedContent,
          totalElements,
          totalPages,
          size,
          number: page,
          first: page === 0,
          last: page >= totalPages - 1,
          numberOfElements: paginatedContent.length,
          empty: paginatedContent.length === 0,
          pageable: {
            pageNumber: page,
            pageSize: size,
            offset: start,
            paged: true,
            unpaged: false,
            sort: {
              sorted: true,
              unsorted: false,
              empty: false
            }
          },
          sort: {
            sorted: true,
            unsorted: false,
            empty: false
          }
        };

        resolve({
          data: pageResponse,
          message: 'Mock notifications fetched successfully',
          statusCode: 200,
          success: true,
        });
      }, 500);
    });
  }

  markAsRead(notificationId: string): Promise<ApiResponse<null>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const notification = this.mockNotifications.find(n => n.notificationId === notificationId);
        if (notification) {
          notification.isRead = true;
          resolve({
            data: null,
            message: 'Notification marked as read',
            statusCode: 200,
            success: true,
          });
        } else {
          resolve({
            data: null,
            message: 'Notification not found',
            statusCode: 404,
            success: false,
            error: {
              statusCode: 404,
              message: `No notification found with ID: ${notificationId}`
            }
          });
        }
      }, 300);
    });
  }

  markAllAsRead(userId: string): Promise<ApiResponse<null>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.mockNotifications.forEach(notification => {
          if (notification.recipientId === userId) {
            notification.isRead = true;
          }
        });

        resolve({
          data: null,
          message: 'All notifications marked as read',
          statusCode: 200,
          success: true,
        });
      }, 500);
    });
  }

  /**
   * Mock SSE connection - simulate real-time notifications
   * Trong mock, không thực sự tạo SSE connection
   */
  connectSSE(userId: string, callbacks: SSECallbacks): EventSource {
    console.log('[MockNotificationApi] SSE connection simulated for user:', userId);

    // Trigger onOpen callback immediately for mock
    if (callbacks.onOpen) {
      setTimeout(() => callbacks.onOpen!(), 100);
    }

    // Simulate receiving a new notification after 10 seconds
    setTimeout(() => {
      const mockNewNotification: Notification = {
        notificationId: `mock-${Date.now()}`,
        title: '🔔 Thông báo mới (Mock)',
        message: 'Đây là thông báo mô phỏng từ Mock API',
        type: 'REQUEST_CREATED',
        referenceType: 'REQUEST',
        referenceId: 'req-mock',
        isRead: false,
        createdAt: new Date().toISOString(),
        recipientId: userId
      };

      // Add to mock data
      this.mockNotifications.unshift(mockNewNotification);

      // Trigger callback
      callbacks.onNotification(mockNewNotification);
    }, 10000);

    // Return a fake EventSource object
    return {} as EventSource;
  }

  disconnectSSE(): void {
    console.log('[MockNotificationApi] SSE connection closed (mock)');
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

/**
 * REST implementation của NotificationApi
 * Sử dụng axios client để gọi API thực
 */
export class RestNotificationApi implements NotificationApi {
  private eventSource: EventSource | null = null;

  async getNotifications(filter?: NotificationFilter): Promise<ApiResponse<Page<Notification>>> {
    const response = await springApiClient.get<ApiResponse<Page<Notification>>>(
      '/notifications',
      { params: filter }
    );
    return response;
  }

  async markAsRead(notificationId: string): Promise<ApiResponse<null>> {
    const response = await springApiClient.patch<ApiResponse<null>>(
      `/notifications/read?notificationId=${notificationId}`
    );
    return response;
  }

  async markAllAsRead(userId: string): Promise<ApiResponse<null>> {
    const response = await springApiClient.patch<ApiResponse<null>>(
      `/notifications/mark-all-read?userId=${userId}`
    );
    return response;
  }

  /**
   * Kết nối đến SSE stream để nhận thông báo real-time
   */
  connectSSE(userId: string, callbacks: SSECallbacks): EventSource {
    // Đóng kết nối cũ nếu có
    if (this.eventSource) {
      this.eventSource.close();
    }

    // Tạo kết nối SSE mới
    const url = `${SPRING_API_BASE_URL}/notifications/stream?userId=${userId}`;
    console.log('[RestNotificationApi] Connecting to SSE:', url);

    // EventSource constructor không hỗ trợ withCredentials option trong TypeScript
    // Nhưng ta có thể cast để sử dụng
    this.eventSource = new EventSource(url, { withCredentials: false });

    console.log('[RestNotificationApi] EventSource created');
    console.log('[RestNotificationApi] Initial readyState:', this.eventSource.readyState);
    console.log('[RestNotificationApi] CONNECTING=0, OPEN=1, CLOSED=2');

    // Lắng nghe event 'notification'
    this.eventSource.addEventListener('notification', (event: MessageEvent) => {
      console.log('[RestNotificationApi] Received notification event:', event);
      try {
        const notification: Notification = JSON.parse(event.data);
        console.log('[RestNotificationApi] Parsed notification:', notification);
        callbacks.onNotification(notification);
      } catch (error) {
        console.error('[RestNotificationApi] Error parsing notification:', error);
      }
    });

    // Lắng nghe tất cả message events (bao gồm cả unnamed events)
    this.eventSource.onmessage = (event: MessageEvent) => {
      console.log('[RestNotificationApi] Received generic message:', event.data);
    };

    // Xử lý khi kết nối thành công
    this.eventSource.onopen = (event: Event) => {
      console.log('[RestNotificationApi] ✅ SSE connection OPENED');
      console.log('[RestNotificationApi] readyState after open:', this.eventSource?.readyState);
      console.log('[RestNotificationApi] onopen event:', event);
      if (callbacks.onOpen) {
        callbacks.onOpen();
      }
    };

    // Xử lý lỗi
    this.eventSource.onerror = (error: Event) => {
      console.error('[RestNotificationApi] ❌ SSE connection ERROR');
      console.error('[RestNotificationApi] readyState on error:', this.eventSource?.readyState);
      console.error('[RestNotificationApi] error event:', error);
      this.eventSource.close();

      // Check if connection was never established
      if (this.eventSource?.readyState === EventSource.CONNECTING) {
        console.error('[RestNotificationApi] Connection stuck in CONNECTING state');
        console.error('[RestNotificationApi] This usually means:');
        console.error('[RestNotificationApi] 1. CORS issue');
        console.error('[RestNotificationApi] 2. Server not sending initial data');
        console.error('[RestNotificationApi] 3. Wrong Content-Type from server');
      }

      if (callbacks.onError) {
        callbacks.onError(error);
      }
      // EventSource sẽ tự động reconnect
    };

    return this.eventSource;
  }

  /**
   * Ngắt kết nối SSE
   */
  disconnectSSE(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
      console.log('[RestNotificationApi] SSE connection closed');
    }
  }
}
