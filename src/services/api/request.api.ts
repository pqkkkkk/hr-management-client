import { ApiResponse, Page } from "shared/types";
import {
  Request,
  CreateLeaveRequestDTO,
  CreateWfhRequestDTO,
  RequestFilter,
  RemainingLeaveDays,
  RequestType,
  RequestStatus,
  LeaveType,
  ShiftType,
  CreateCheckOutRequestDTO
} from "modules/request/types/request.types";

export interface RequestApi {
  getRequests(filter?: RequestFilter): Promise<ApiResponse<Page<Request>>>;
  getRequestById(requestId: string): Promise<ApiResponse<Request>>;
  createLeaveRequest(
    data: CreateLeaveRequestDTO
  ): Promise<ApiResponse<Request>>;
  createWfhRequest(data: CreateWfhRequestDTO): Promise<ApiResponse<Request>>;
  createCheckOutRequest(
    data: CreateCheckOutRequestDTO
  ): Promise<ApiResponse<Request>>;
  cancelRequest(requestId: string): Promise<ApiResponse<null>>;
  approveRequest(requestId: string): Promise<ApiResponse<Request>>;
  rejectRequest(
    requestId: string,
    reason: string
  ): Promise<ApiResponse<Request>>;
  getRemainingLeaveDays(): Promise<ApiResponse<RemainingLeaveDays>>;
}

export class MockRequestApi implements RequestApi {
  private mockRequests: Request[] = [
    {
      requestId: "REQ001",
      requestType: RequestType.LEAVE,
      status: RequestStatus.APPROVED,
      title: "Nghỉ phép gia đình",
      userReason: "Kỳ nghỉ gia đình",
      attachmentUrl: "https://example.com/attachment1.pdf",
      employeeId: "NV001",
      employeeName: "Nguyễn Văn A",
      approverId: "NV002",
      approverName: "Trần Thị B",
      processedAt: "2023-10-27T10:30:00Z",
      createdAt: "2023-10-26T08:00:00Z",
      updatedAt: "2023-10-27T10:30:00Z",
      additionalLeaveInfo: {
        leaveType: LeaveType.ANNUAL,
        totalDays: 3,
        leaveDates: [
          { date: "2023-11-01", shift: ShiftType.FULL_DAY },
          { date: "2023-11-02", shift: ShiftType.FULL_DAY },
          { date: "2023-11-03", shift: ShiftType.FULL_DAY },
        ],
      },
    },
    {
      requestId: "REQ002",
      requestType: RequestType.LEAVE,
      status: RequestStatus.PENDING,
      title: "Nghỉ khám bệnh",
      userReason: "Hẹn khám bác sĩ",
      attachmentUrl: "https://example.com/attachment2.pdf",
      employeeId: "NV001",
      employeeName: "Nguyễn Văn A",
      createdAt: "2023-10-24T09:00:00Z",
      updatedAt: "2023-10-24T09:00:00Z",
      additionalLeaveInfo: {
        leaveType: LeaveType.SICK,
        totalDays: 1,
        leaveDates: [{ date: "2023-10-30", shift: ShiftType.FULL_DAY }],
      },
    },
    {
      requestId: "REQ003",
      requestType: RequestType.LEAVE,
      status: RequestStatus.REJECTED,
      title: "Nghỉ việc cá nhân",
      userReason: "Việc cá nhân",
      rejectReason: "Yêu cầu được gửi quá gần ngày nghỉ.",
      attachmentUrl: "https://example.com/attachment3.pdf",
      employeeId: "NV001",
      employeeName: "Nguyễn Văn A",
      approverId: "NV002",
      approverName: "Trần Thị B",
      processedAt: "2023-10-21T14:00:00Z",
      createdAt: "2023-10-20T10:00:00Z",
      updatedAt: "2023-10-21T14:00:00Z",
      additionalLeaveInfo: {
        leaveType: LeaveType.UNPAID,
        totalDays: 2,
        leaveDates: [
          { date: "2023-10-25", shift: ShiftType.FULL_DAY },
          { date: "2023-10-26", shift: ShiftType.FULL_DAY },
        ],
      },
    },
    {
      requestId: "REQ004",
      requestType: RequestType.WFH,
      status: RequestStatus.APPROVED,
      title: "Làm việc từ xa",
      userReason: "Làm việc từ nhà để hoàn thành dự án",
      attachmentUrl: "https://example.com/attachment4.pdf",
      employeeId: "NV001",
      employeeName: "Nguyễn Văn A",
      approverId: "NV002",
      approverName: "Trần Thị B",
      processedAt: "2023-10-18T11:00:00Z",
      createdAt: "2023-10-17T08:00:00Z",
      updatedAt: "2023-10-18T11:00:00Z",
      additionalWfhInfo: {
        wfhCommitment: true,
        workLocation: "Nhà riêng, quận 7, TP.HCM",
        totalDays: 2,
        wfhDates: [
          { date: "2023-10-23", shift: ShiftType.FULL_DAY },
          { date: "2023-10-24", shift: ShiftType.FULL_DAY },
        ],
      },
    },
  ];

  async getRequests(
    filter?: RequestFilter
  ): Promise<ApiResponse<Page<Request>>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredRequests = [...this.mockRequests];

        // Apply filters
        if (filter?.requestType) {
          filteredRequests = filteredRequests.filter(
            (req) => req.requestType === filter.requestType
          );
        }

        if (filter?.status) {
          filteredRequests = filteredRequests.filter(
            (req) => req.status === filter.status
          );
        }

        if (filter?.employeeId) {
          filteredRequests = filteredRequests.filter(
            (req) => req.employeeId === filter.employeeId
          );
        }

        // Sort
        const sortOrder = filter?.sortOrder || "DESC";
        filteredRequests.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return sortOrder === "ASC" ? dateA - dateB : dateB - dateA;
        });

        // Pagination
        const page = filter?.page || 1;
        const pageSize = filter?.pageSize || 10;
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

        resolve({
          data: {
            content: paginatedRequests,
            totalElements: filteredRequests.length,
            totalPages: Math.ceil(filteredRequests.length / pageSize),
            number: page,
            size: pageSize,
            pageable: {
              pageNumber: page,
              pageSize: pageSize,
              sort: { sorted: false, unsorted: true, empty: true },
              offset: startIndex,
              paged: true,
              unpaged: false,
            },
            first: page === 1,
            last: endIndex >= filteredRequests.length,
            numberOfElements: paginatedRequests.length,
            empty: paginatedRequests.length === 0,
            sort: { sorted: false, unsorted: true, empty: true },
          },
          success: true,
          statusCode: 200,
          message: "Requests retrieved successfully",
        });
      }, 500);
    });
  }

  async getRequestById(requestId: string): Promise<ApiResponse<Request>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const request = this.mockRequests.find(
          (req) => req.requestId === requestId
        );
        if (request) {
          resolve({
            data: request,
            success: true,
            statusCode: 200,
            message: "Request retrieved successfully",
          });
        } else {
          reject({
            success: false,
            statusCode: 404,
            message: "Request not found",
          });
        }
      }, 300);
    });
  }

  async createLeaveRequest(
    data: CreateLeaveRequestDTO
  ): Promise<ApiResponse<Request>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRequest: Request = {
          requestId: `REQ${String(this.mockRequests.length + 1).padStart(
            3,
            "0"
          )}`,
          requestType: data.requestType,
          status: RequestStatus.PENDING,
          title: data.title,
          userReason: data.userReason,
          employeeId: data.employeeId,
          employeeName: "Nguyễn Văn A",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          additionalLeaveInfo: data.additionalInfo,
        };

        this.mockRequests.unshift(newRequest);

        resolve({
          data: newRequest,
          success: true,
          statusCode: 201,
          message: "Leave request created successfully",
        });
      }, 800);
    });
  }

  async createWfhRequest(
    data: CreateWfhRequestDTO
  ): Promise<ApiResponse<Request>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const totalDays = data.wfhDates.reduce((sum, date) => {
          return sum + (date.shift === ShiftType.FULL_DAY ? 1 : 0.5);
        }, 0);

        const newRequest: Request = {
          requestId: `REQ${String(this.mockRequests.length + 1).padStart(
            3,
            "0"
          )}`,
          requestType: RequestType.WFH,
          status: RequestStatus.PENDING,
          title: data.title,
          userReason: data.userReason,
          employeeId: "NV001", // Current user ID
          employeeName: "Nguyễn Văn A",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          additionalWfhInfo: {
            wfhCommitment: data.wfhCommitment,
            workLocation: data.workLocation,
            totalDays,
            wfhDates: data.wfhDates,
          },
        };

        this.mockRequests.unshift(newRequest);

        resolve({
          data: newRequest,
          success: true,
          statusCode: 201,
          message: "WFH request created successfully",
        });
      }, 800);
    });
  }

  async createCheckOutRequest(
    data: CreateCheckOutRequestDTO
  ): Promise<ApiResponse<Request>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if there's a check-in request for the same date
        const checkOutDate = new Date(data.desiredCheckOutTime).toISOString().split('T')[0];
        const hasCheckIn = this.mockRequests.some((req) => {
          const reqDate = req.createdAt.split('T')[0];
          return (
            req.requestType === RequestType.CHECK_IN &&
            reqDate === checkOutDate &&
            (req.status === RequestStatus.APPROVED || req.status === RequestStatus.PENDING)
          );
        });

        if (!hasCheckIn) {
          reject({
            success: false,
            statusCode: 400,
            message: "Phải có yêu cầu check-in đã được chấp thuận hoặc đang chờ trong cùng ngày",
          });
          return;
        }

        // Check for duplicate check-out
        const hasDuplicateCheckOut = this.mockRequests.some((req) => {
          const reqDate = req.createdAt.split('T')[0];
          return (
            req.requestType === RequestType.CHECK_OUT &&
            reqDate === checkOutDate &&
            req.status !== RequestStatus.CANCELLED &&
            req.status !== RequestStatus.REJECTED
          );
        });

        if (hasDuplicateCheckOut) {
          reject({
            success: false,
            statusCode: 400,
            message: "Đã tồn tại yêu cầu check-out cho ngày này",
          });
          return;
        }

        const newRequest: Request = {
          requestId: `REQ${String(this.mockRequests.length + 1).padStart(
            3,
            "0"
          )}`,
          requestType: RequestType.CHECK_OUT,
          status: RequestStatus.PENDING,
          title: data.title,
          userReason: data.userReason,
          attachmentUrl: data.attachmentUrl,
          employeeId: "NV001", 
          employeeName: "Nguyễn Văn A",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          additionalCheckOutInfo: {
            desiredCheckOutTime: data.desiredCheckOutTime,
            currentCheckOutTime: new Date().toISOString(),
          },
        };

        this.mockRequests.unshift(newRequest);

        resolve({
          data: newRequest,
          success: true,
          statusCode: 201,
          message: "Check-out request created successfully",
        });
      }, 800);
    });
  }

  async cancelRequest(requestId: string): Promise<ApiResponse<null>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const requestIndex = this.mockRequests.findIndex(
          (req) => req.requestId === requestId
        );

        if (requestIndex === -1) {
          reject({
            success: false,
            statusCode: 404,
            message: "Request not found",
          });
          return;
        }

        const request = this.mockRequests[requestIndex];
        if (request.status !== RequestStatus.PENDING) {
          reject({
            success: false,
            statusCode: 400,
            message: "Only pending requests can be cancelled",
          });
          return;
        }

        request.status = RequestStatus.CANCELLED;
        request.updatedAt = new Date().toISOString();

        resolve({
          data: null,
          success: true,
          statusCode: 200,
          message: "Request cancelled successfully",
        });
      }, 500);
    });
  }

  async approveRequest(requestId: string): Promise<ApiResponse<Request>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = this.mockRequests.findIndex(
          (r) => r.requestId === requestId
        );
        if (idx === -1) {
          reject({
            success: false,
            statusCode: 404,
            message: "Request not found",
          });
          return;
        }
        const req = this.mockRequests[idx];
        req.status = RequestStatus.APPROVED;
        req.processedAt = new Date().toISOString();
        req.approverName = "Bạn";
        req.updatedAt = new Date().toISOString();
        resolve({
          data: req,
          success: true,
          statusCode: 200,
          message: "Request approved",
        });
      }, 400);
    });
  }

  async rejectRequest(
    requestId: string,
    reason: string
  ): Promise<ApiResponse<Request>> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const idx = this.mockRequests.findIndex(
          (r) => r.requestId === requestId
        );
        if (idx === -1) {
          reject({
            success: false,
            statusCode: 404,
            message: "Request not found",
          });
          return;
        }
        const req = this.mockRequests[idx];
        req.status = RequestStatus.REJECTED;
        req.rejectReason = reason;
        req.processedAt = new Date().toISOString();
        req.approverName = "Bạn";
        req.updatedAt = new Date().toISOString();
        resolve({
          data: req,
          success: true,
          statusCode: 200,
          message: "Request rejected",
        });
      }, 400);
    });
  }

  async getRemainingLeaveDays(): Promise<ApiResponse<RemainingLeaveDays>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Mock data for remaining leave days
        const data: RemainingLeaveDays = {
          totalAnnualLeave: 12,
          usedAnnualLeave: 3.5,
          remainingAnnualLeave: 8.5,
        };

        resolve({
          data,
          success: true,
          statusCode: 200,
          message: "Remaining leave days retrieved successfully",
        });
      }, 300);
    });
  }
}

// REST API Implementation
export class RestRequestApi implements RequestApi {
  private baseUrl = "http://localhost:3001/v1/requests";

  async getRequests(
    filter?: RequestFilter
  ): Promise<ApiResponse<Page<Request>>> {
    const { default: apiClient } = await import("./api.client");
    const params = new URLSearchParams();

    if (filter?.page) params.append("page", String(filter.page - 1));
    if (filter?.pageSize) params.append("size", String(filter.pageSize));
    if (filter?.requestType) params.append("requestType", filter.requestType);
    if (filter?.status) params.append("status", filter.status);
    if (filter?.employeeId) params.append("employeeId", filter.employeeId);
    if (filter?.startDate) params.append("startDate", filter.startDate);
    if (filter?.endDate) params.append("endDate", filter.endDate);
    if (filter?.sortBy) params.append("sortBy", filter.sortBy);
    if (filter?.sortOrder) params.append("sortOrder", filter.sortOrder);

    return apiClient.get(`${this.baseUrl}?${params.toString()}`);
  }

  async getRequestById(requestId: string): Promise<ApiResponse<Request>> {
    const { default: apiClient } = await import("./api.client");
    return apiClient.get(`${this.baseUrl}/${requestId}`);
  }

  async createLeaveRequest(
    data: CreateLeaveRequestDTO
  ): Promise<ApiResponse<Request>> {
    const { default: apiClient } = await import("./api.client");
    return apiClient.post(`${this.baseUrl}/leave`, data);
  }

  async createWfhRequest(
    data: CreateWfhRequestDTO
  ): Promise<ApiResponse<Request>> {
    const { default: apiClient } = await import("./api.client");
    return apiClient.post(`${this.baseUrl}/wfh`, data);
  }

  async createCheckOutRequest(
    data: CreateCheckOutRequestDTO
  ): Promise<ApiResponse<Request>> {
    const { default: apiClient } = await import("./api.client");
    return apiClient.post(`${this.baseUrl}/check-out`, data);
  }

  async cancelRequest(requestId: string): Promise<ApiResponse<null>> {
    const { default: apiClient } = await import("./api.client");
    return apiClient.patch(`${this.baseUrl}/${requestId}/cancel`);
  }

  async approveRequest(requestId: string): Promise<ApiResponse<Request>> {
    const { default: apiClient } = await import("./api.client");
    return apiClient.patch(`${this.baseUrl}/${requestId}/approve`);
  }

  async rejectRequest(
    requestId: string,
    reason: string
  ): Promise<ApiResponse<Request>> {
    const { default: apiClient } = await import("./api.client");
    return apiClient.patch(`${this.baseUrl}/${requestId}/reject`, { reason });
  }

  async getRemainingLeaveDays(): Promise<ApiResponse<RemainingLeaveDays>> {
    const { default: apiClient } = await import("./api.client");
    return apiClient.get(`${this.baseUrl}/remaining-leave-days`);
  }
}

// Export singleton instances
export const mockRequestApi = new MockRequestApi();
export const restRequestApi = new RestRequestApi();
