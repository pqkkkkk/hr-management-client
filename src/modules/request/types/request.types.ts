import { RequestStatus, RequestType, LeaveType, DateRange } from 'shared/types';

export interface BaseRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  type: RequestType;
  status: RequestStatus;
  reason?: string;
  rejectionReason?: string;
  managerId?: string;
  managerName?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  processedAt?: Date | string;
}

export interface LeaveRequest extends BaseRequest {
  type: 'LEAVE';
  leaveType: LeaveType;
  startDate: Date | string;
  endDate: Date | string;
  numberOfDays: number;
  isEmergency?: boolean;
}

export interface CheckInRequest extends BaseRequest {
  type: 'CHECK_IN';
  checkInTime: Date | string;
  isLate: boolean;
  lateReason?: string;
}

export interface CheckOutRequest extends BaseRequest {
  type: 'CHECK_OUT';
  checkOutTime: Date | string;
  isEarly: boolean;
  earlyReason?: string;
}

export interface TimesheetUpdateRequest extends BaseRequest {
  type: 'TIMESHEET_UPDATE';
  workDate: Date | string;
  originalCheckIn?: Date | string;
  originalCheckOut?: Date | string;
  newCheckIn: Date | string;
  newCheckOut: Date | string;
}

export interface WFHRequest extends BaseRequest {
  type: 'WFH';
  startDate: Date | string;
  endDate: Date | string;
  workLocation: string;
  commitment: boolean;
  numberOfDays: number;
}

export type Request = 
  | LeaveRequest 
  | CheckInRequest 
  | CheckOutRequest 
  | TimesheetUpdateRequest 
  | WFHRequest;

export interface CreateLeaveRequestDto {
  leaveType: LeaveType;
  startDate: Date | string;
  endDate: Date | string;
  reason: string;
  isEmergency?: boolean;
}

export interface CreateCheckInRequestDto {
  checkInTime: Date | string;
  lateReason?: string;
}

export interface CreateCheckOutRequestDto {
  checkOutTime: Date | string;
  earlyReason?: string;
}

export interface CreateTimesheetUpdateRequestDto {
  workDate: Date | string;
  newCheckIn: Date | string;
  newCheckOut: Date | string;
  reason: string;
}

export interface CreateWFHRequestDto {
  startDate: Date | string;
  endDate: Date | string;
  workLocation: string;
  reason: string;
  commitment: boolean;
}

export interface ProcessRequestDto {
  status: 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
}

export interface RequestFilterOptions {
  type?: RequestType;
  status?: RequestStatus;
  employeeId?: string;
  dateRange?: DateRange;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: Date | string;
  checkIn?: Date | string;
  checkOut?: Date | string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EARLY' | 'LEAVE' | 'WFH';
  workingHours?: number;
}
