// Enums
export enum RequestType {
  CHECK_IN = "CHECK_IN",
  CHECK_OUT = "CHECK_OUT",
  TIMESHEET = "TIMESHEET",
  LEAVE = "LEAVE",
  WFH = "WFH",
}

export enum RequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
  PROCESSING = "PROCESSING",
}

export enum LeaveType {
  ANNUAL = "ANNUAL",
  SICK = "SICK",
  UNPAID = "UNPAID",
  MATERNITY = "MATERNITY",
  PATERNITY = "PATERNITY",
  BEREAVEMENT = "BEREAVEMENT",
  MARRIAGE = "MARRIAGE",
  OTHER = "OTHER",
}

export enum ShiftType {
  FULL_DAY = "FULL_DAY",
  MORNING = "MORNING",
  AFTERNOON = "AFTERNOON",
}

// Date types
export interface LeaveDate {
  leaveDateId?: string;
  date: string; // ISO date string
  shift: ShiftType;
}

export interface WfhDate {
  wfhDateId?: string;
  date: string; // ISO date string
  shift: ShiftType;
}

// Additional info types
export interface AdditionalLeaveInfo {
  requestId?: string;
  leaveType: LeaveType;
  totalDays: number;
  leaveDates: LeaveDate[];
}

export interface AdditionalWfhInfo {
  requestId?: string;
  wfhCommitment: boolean;
  workLocation?: string;
  totalDays: number;
  wfhDates: WfhDate[];
}

export interface AdditionalCheckInInfo {
  requestId?: string;
  desiredCheckInTime: string; // ISO datetime string
  currentCheckInTime: string; // ISO datetime string
}

export interface AdditionalCheckOutInfo {
  requestId?: string;
  desiredCheckOutTime: string; // ISO datetime string
  currentCheckOutTime: string; // ISO datetime string
}

export interface AdditionalTimesheetInfo {
  requestId?: string;
  desiredCheckInTime: string; // ISO datetime string
  currentCheckInTime: string; // ISO datetime string
  desiredCheckOutTime: string; // ISO datetime string
  currentCheckOutTime: string; // ISO datetime string
  targetDate: string; // ISO date string
}

// Main Request entity
export interface Request {
  requestId: string;
  requestType: RequestType;
  status: RequestStatus;
  title: string;
  userReason?: string;
  rejectReason?: string;
  attachmentUrl?: string;
  employeeId: string;
  employeeFullName?: string; // For display purposes
  approverId?: string;
  approverName?: string;
  processorId?: string;
  processorName?: string;
  processedAt?: string; // ISO datetime string
  createdAt: string; // ISO datetime string
  updatedAt: string; // ISO datetime string

  // Additional info (only one will be populated based on requestType)
  additionalLeaveInfo?: AdditionalLeaveInfo;
  additionalWfhInfo?: AdditionalWfhInfo;
  additionalCheckInInfo?: AdditionalCheckInInfo;
  additionalCheckOutInfo?: AdditionalCheckOutInfo;
  additionalTimesheetInfo?: AdditionalTimesheetInfo;
}

// Create request DTOs
// Matches CreateLeaveRequestRequest from API
export interface LeaveDateRequest {
  date: string; // ISO date string (YYYY-MM-DD)
  shiftType: ShiftType;
}

export interface CreateLeaveRequestDTO {
  title: string;
  userReason: string;
  attachmentUrl?: string;
  employeeId: string;
  leaveType: LeaveType;
  leaveDates: LeaveDateRequest[];
}

export interface CreateWfhRequestDTO {
  title: string;
  userReason?: string;
  wfhCommitment: boolean;
  workLocation?: string;
  wfhDates: WfhDate[];
}

export interface RejectLeaveRequestDTO {
  reason: string;
}

export interface CreateCheckOutRequestDTO {
  title?: string;
  userReason?: string;
  employeeId: string;
  desiredCheckOutTime: string;
  attachmentUrl?: string;
}

export interface CreateCheckInRequestDTO {
  title?: string;
  userReason?: string;
  employeeId: string;
  desiredCheckInTime: string; // ISO datetime string
}

export type CreateDelegationRequest = {
  delegateToId: string;
};


export interface RequestFilter {
  employeeId?: string;
  approverId?: string;
  processorId?: string;
  departmentId?: string;
  status?: RequestStatus;
  type?: RequestType;
  startDate?: string;
  endDate?: string;
  currentPage?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface RemainingLeaveDays {
  totalAnnualLeave: number;
  usedAnnualLeave: number;
  remainingAnnualLeave: number;
}

// Options for selects
export const leaveTypeOptions = [
  { value: LeaveType.ANNUAL, label: "Nghỉ phép năm" },
  { value: LeaveType.SICK, label: "Nghỉ ốm" },
  { value: LeaveType.UNPAID, label: "Nghỉ không lương" },
  { value: LeaveType.MATERNITY, label: "Nghỉ thai sản" },
  { value: LeaveType.PATERNITY, label: "Nghỉ chăm con" },
  { value: LeaveType.BEREAVEMENT, label: "Nghỉ tang" },
  { value: LeaveType.MARRIAGE, label: "Nghỉ cưới" },
  { value: LeaveType.OTHER, label: "Khác" },
];

export const requestStatusOptions = [
  { value: RequestStatus.PENDING, label: "Chờ duyệt" },
  { value: RequestStatus.APPROVED, label: "Đã duyệt" },
  { value: RequestStatus.REJECTED, label: "Từ chối" },
  { value: RequestStatus.CANCELLED, label: "Đã hủy" },
  { value: RequestStatus.PROCESSING, label: "Đang xử lý" },
];

export const requestTypeOptions = [
  { value: RequestType.LEAVE, label: "Nghỉ phép" },
  { value: RequestType.WFH, label: "Làm việc từ xa" },
  { value: RequestType.CHECK_IN, label: "Chấm công vào" },
  { value: RequestType.CHECK_OUT, label: "Chấm công ra" },
  { value: RequestType.TIMESHEET, label: "Chỉnh sửa chấm công" },
];

export const shiftTypeOptions = [
  { value: ShiftType.FULL_DAY, label: "Cả ngày" },
  { value: ShiftType.MORNING, label: "Buổi sáng" },
  { value: ShiftType.AFTERNOON, label: "Buổi chiều" },
];

// Timesheet related types
export interface TimesheetDailyEntry {
  dailyTsId: string;
  date: string;
  morningStatus: string;
  afternoonStatus: string;
  morningWfh: boolean;
  afternoonWfh: boolean;
  totalWorkCredit: number;
  checkInTime?: string;
  checkOutTime?: string;
  lateMinutes?: number;
  earlyLeaveMinutes?: number;
  overtimeMinutes?: number;
  isFinalized?: boolean;
  employeeId?: string;
  employeeName?: string;
}

export interface TimesheetSummary {
  totalDays: number;
  morningPresentCount: number;
  afternoonPresentCount: number;
  lateDaysCount: number;
  totalLateMinutes: number;
  totalOvertimeMinutes: number;
  totalWorkCredit: number;
}

export interface TimesheetResponse {
  employeeId: string;
  employeeName: string;
  yearMonth: string; // YYYY-MM
  timesheets: TimesheetDailyEntry[];
  summary: TimesheetSummary;
}

export interface CreateTimesheetUpdateRequestDTO {
  title: string;
  userReason: string;
  employeeId: string;
  targetDate: string;
  desiredCheckInTime?: string;
  desiredCheckOutTime?: string;
  desiredMorningStatus?: string;
  desiredAfternoonStatus?: string;
}
