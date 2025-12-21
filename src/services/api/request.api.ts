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
  TimesheetResponse,
  CreateCheckOutRequestDTO,
  CreateCheckInRequestDTO,
  CreateTimesheetUpdateRequestDTO,
} from "modules/request/types/request.types";
import apiClient from "./api.client";

export interface RequestApi {
  getMyRequests(filter?: RequestFilter): Promise<ApiResponse<Page<Request>>>;
  getTeamRequests(filter?: RequestFilter): Promise<ApiResponse<Page<Request>>>;
  getRequestById(requestId: string): Promise<ApiResponse<Request>>;
  createLeaveRequest(
    data: CreateLeaveRequestDTO
  ): Promise<ApiResponse<Request>>;
  createWfhRequest(data: CreateWfhRequestDTO): Promise<ApiResponse<Request>>;
  createCheckOutRequest(
    data: CreateCheckOutRequestDTO
  ): Promise<ApiResponse<Request>>;
  createCheckInRequest(
    data: CreateCheckInRequestDTO
  ): Promise<ApiResponse<Request>>;
  approveRequest(requestId: string, approverId: string): Promise<ApiResponse<Request>>;
  rejectRequest(
    requestId: string,
    rejecterId: string,
    rejectReason: string
  ): Promise<ApiResponse<Request>>;
  delegateRequest(
    requestId: string,
    newProcessorId: string
  ): Promise<ApiResponse<Request>>;
  getRemainingLeaveDays(): Promise<ApiResponse<RemainingLeaveDays>>;

  // Timesheet
  getTimesheet(
    employeeId: string,
    yearMonth: string
  ): Promise<ApiResponse<TimesheetResponse>>;
  
  createTimesheetUpdateRequest(
    data: CreateTimesheetUpdateRequestDTO
  ): Promise<ApiResponse<any>>;
}

export class MockRequestApi implements RequestApi {
  getTeamRequests(filter?: RequestFilter): Promise<ApiResponse<Page<Request>>> {
    throw new Error("Method not implemented.");
  }
  private mockRequests: Request[] = [
    {
      requestId: "REQ001",
      requestType: RequestType.LEAVE,
      status: RequestStatus.APPROVED,
      title: "Nghỉ phép gia đình",
      userReason: "Kỳ nghỉ gia đình",
      attachmentUrl: "https://example.com/attachment1.pdf",
      employeeId: "NV001",
      employeeFullName: "Nguyễn Văn A",
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
      employeeFullName: "Nguyễn Văn A",
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
      employeeFullName: "Nguyễn Văn A",
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
      employeeFullName: "Nguyễn Văn A",
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

  async getMyRequests(
    filter?: RequestFilter
  ): Promise<ApiResponse<Page<Request>>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filteredRequests = [...this.mockRequests];

        // Apply filters
        if (filter?.type) {
          filteredRequests = filteredRequests.filter(
            (req) => req.requestType === filter.type
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
        const sortDirection = filter?.sortDirection || "DESC";
        filteredRequests.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return sortDirection === "ASC" ? dateA - dateB : dateB - dateA;
        });

        // Pagination
        const currentPage = filter?.currentPage || 1;
        const pageSize = filter?.pageSize || 10;
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedRequests = filteredRequests.slice(startIndex, endIndex);

        resolve({
          data: {
            content: paginatedRequests,
            totalElements: filteredRequests.length,
            totalPages: Math.ceil(filteredRequests.length / pageSize),
            number: currentPage,
            size: pageSize,
            pageable: {
              pageNumber: currentPage,
              pageSize: pageSize,
              sort: { sorted: false, unsorted: true, empty: true },
              offset: startIndex,
              paged: true,
              unpaged: false,
            },
            first: currentPage === 1,
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
        // Calculate total days from leaveDates
        const totalDays = data.leaveDates.reduce((sum, date) => {
          return sum + (date.shiftType === ShiftType.FULL_DAY ? 1 : 0.5);
        }, 0);

        const newRequest: Request = {
          requestId: `REQ${String(this.mockRequests.length + 1).padStart(
            3,
            "0"
          )}`,
          requestType: RequestType.LEAVE,
          status: RequestStatus.PENDING,
          title: data.title,
          userReason: data.userReason,
          employeeId: data.employeeId,
          employeeFullName: "Nguyễn Văn A",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          additionalLeaveInfo: {
            leaveType: data.leaveType,
            totalDays,
            leaveDates: data.leaveDates.map((d) => ({
              date: d.date,
              shift: d.shiftType,
            })),
          },
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
          employeeFullName: "Nguyễn Văn A",
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
          employeeFullName: "Nguyễn Văn A",
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

  async createCheckInRequest(
    data: CreateCheckInRequestDTO
  ): Promise<ApiResponse<Request>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRequest: Request = {
          requestId: `REQ${String(this.mockRequests.length + 1).padStart(
            3,
            "0"
          )}`,
          requestType: RequestType.CHECK_IN,
          status: RequestStatus.PENDING,
          title: data.title || "Yêu cầu chấm công vào",
          userReason: data.userReason,
          employeeId: data.employeeId,
          employeeFullName: "Nguyễn Văn A",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          additionalCheckInInfo: {
            desiredCheckInTime: data.desiredCheckInTime,
            currentCheckInTime: new Date().toISOString(),
          },
        };

        this.mockRequests.unshift(newRequest);

        resolve({
          data: newRequest,
          success: true,
          statusCode: 201,
          message: "Check-in request created successfully",
        });
      }, 800);
    });
  }

  async approveRequest(requestId: string, approverId: string): Promise<ApiResponse<Request>> {
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
        req.approverId = approverId;
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
    rejecterId: string,
    rejectReason: string
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
        req.rejectReason = rejectReason;
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

  async delegateRequest(
    requestId: string,
    newProcessorId: string
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
        req.processorId = newProcessorId;
        req.processorName = "Người xử lý được ủy quyền";
        req.status = RequestStatus.PROCESSING;
        req.updatedAt = new Date().toISOString();
        resolve({
          data: req,
          success: true,
          statusCode: 200,
          message: "Request delegated successfully",
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

  // Mock timesheet data
  async getTimesheet(
    employeeId: string,
    yearMonth: string
  ): Promise<ApiResponse<TimesheetResponse>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const data: TimesheetResponse = {
          employeeId: employeeId,
          employeeName: "Nguyễn Văn A",
          yearMonth: yearMonth,
          timesheets: [
            {
              dailyTsId: "TS001",
              date: `${yearMonth}-01`,
              morningStatus: "PRESENT",
              afternoonStatus: "PRESENT",
              morningWfh: false,
              afternoonWfh: false,
              totalWorkCredit: 1.0,
              checkInTime: `${yearMonth}-01T08:25:00Z`,
              checkOutTime: `${yearMonth}-01T18:40:00Z`,
              lateMinutes: 0,
              earlyLeaveMinutes: 0,
              overtimeMinutes: 70,
              isFinalized: false,
              employeeId,
              employeeName: "Nguyễn Văn A",
            },
            {
              dailyTsId: "TS002",
              date: `${yearMonth}-02`,
              morningStatus: "PRESENT",
              afternoonStatus: "LEAVE",
              morningWfh: false,
              afternoonWfh: false,
              totalWorkCredit: 0.5,
              checkInTime: `${yearMonth}-02T09:15:00Z`,
              checkOutTime: `${yearMonth}-02T17:30:00Z`,
              lateMinutes: 45,
              earlyLeaveMinutes: 0,
              overtimeMinutes: 0,
              isFinalized: false,
              employeeId,
              employeeName: "Nguyễn Văn A",
            },
            {
              dailyTsId: "TS003",
              date: `${yearMonth}-03`,
              morningStatus: "PRESENT",
              afternoonStatus: "PRESENT",
              morningWfh: true,
              afternoonWfh: true,
              totalWorkCredit: 1.0,
              checkInTime: `${yearMonth}-03T08:30:00Z`,
              checkOutTime: `${yearMonth}-03T17:30:00Z`,
              lateMinutes: 20,
              earlyLeaveMinutes: 0,
              overtimeMinutes: 0,
              isFinalized: true,
              employeeId,
              employeeName: "Nguyễn Văn A",
            },
            {
              dailyTsId: "TS004",
              date: `${yearMonth}-04`,
              morningStatus: "PRESENT",
              afternoonStatus: "ABSENT",
              morningWfh: true,
              afternoonWfh: false,
              totalWorkCredit: 1.0,
              checkInTime: `${yearMonth}-03T08:30:00Z`,
              checkOutTime: `${yearMonth}-03T17:30:00Z`,
              lateMinutes: 20,
              earlyLeaveMinutes: 0,
              overtimeMinutes: 0,
              isFinalized: true,
              employeeId,
              employeeName: "Nguyễn Văn A",
            },
          ],
          summary: {
            totalDays: 31,
            morningPresentCount: 20,
            afternoonPresentCount: 21,
            lateDaysCount: 4,
            totalLateMinutes: 110,
            totalOvertimeMinutes: 70,
            totalWorkCredit: 21.5,
          },
        };

        resolve({
          data,
          success: true,
          statusCode: 200,
          message: "Timesheet retrieved successfully",
        });
      }, 500);
    });
  }

  async createTimesheetUpdateRequest(
    data: CreateTimesheetUpdateRequestDTO
  ): Promise<ApiResponse<any>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRequest: CreateTimesheetUpdateRequestDTO = {
          title: data.title,
          userReason: data.userReason,
          employeeId: data.employeeId,
          targetDate: data.targetDate,
          desiredCheckInTime: data.desiredCheckInTime,
          desiredCheckOutTime: data.desiredCheckOutTime,
          desiredMorningStatus: data.desiredMorningStatus,
          desiredAfternoonStatus: data.desiredAfternoonStatus,
        };


        resolve({
          data: newRequest,
          success: true,
          statusCode: 201,
          message: "Timesheet update request created successfully",
        });
      }, 800);
    });
  }
}

// REST API Implementation
export class RestRequestApi implements RequestApi {
  async getTimesheet(employeeId: string, yearMonth: string): Promise<ApiResponse<TimesheetResponse>> {
    return apiClient.get<ApiResponse<TimesheetResponse>>(
      `/timesheets/employee/${employeeId}/monthly`,
      { params: { yearMonth } }
    );
  }

  async getMyRequests(
    filter?: RequestFilter
  ): Promise<ApiResponse<Page<Request>>> {
    return apiClient.get(`/requests/my-requests`, { params: filter });
  }

  async getTeamRequests(
    filter?: RequestFilter
  ): Promise<ApiResponse<Page<Request>>> {
    return apiClient.get(`/requests/team-requests`, { params: filter });
  }

  async getRequestById(requestId: string): Promise<ApiResponse<Request>> {
    return apiClient.get(`/requests/${requestId}`);
  }

  async createLeaveRequest(
    data: CreateLeaveRequestDTO
  ): Promise<ApiResponse<Request>> {
    return apiClient.post(`/requests/leave`, data);
  }

  async createWfhRequest(
    data: CreateWfhRequestDTO
  ): Promise<ApiResponse<Request>> {
    return apiClient.post(`/requests/wfh`, data);
  }

  async createCheckOutRequest(
    data: CreateCheckOutRequestDTO
  ): Promise<ApiResponse<Request>> {
    return apiClient.post(`/requests/check-out`, data);
  }

  async createCheckInRequest(
    data: CreateCheckInRequestDTO
  ): Promise<ApiResponse<Request>> {
    return apiClient.post(`/requests/check-in`, data);
  }

  async approveRequest(requestId: string, approverId: string): Promise<ApiResponse<Request>> {
    return apiClient.patch(`/requests/${requestId}/approve`, { approverId });
  }

  async rejectRequest(
    requestId: string,
    rejecterId: string,
    rejectReason: string
  ): Promise<ApiResponse<Request>> {
    return apiClient.patch(`/requests/${requestId}/reject`, { rejecterId, rejectReason });
  }

  async delegateRequest(
    requestId: string,
    newProcessorId: string
  ): Promise<ApiResponse<Request>> {
    return apiClient.patch(`/requests/${requestId}/delegate`, { newProcessorId });
  }

  async getRemainingLeaveDays(): Promise<ApiResponse<RemainingLeaveDays>> {
    throw new Error("Method not available in backend API.");
  }

  async createTimesheetUpdateRequest(
    data: CreateTimesheetUpdateRequestDTO
  ): Promise<ApiResponse<any>> {
    return apiClient.post(`/requests/timesheet`, data);
  }
}

// Export singleton instances
export const mockRequestApi = new MockRequestApi();
export const restRequestApi = new RestRequestApi();
