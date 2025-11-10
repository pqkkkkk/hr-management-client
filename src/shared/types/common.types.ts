// Common types used across the application

export type UserRole = 'EMPLOYEE' | 'MANAGER' | 'HR' | 'ADMIN';

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type RequestType = 
  | 'LEAVE' 
  | 'CHECK_IN' 
  | 'CHECK_OUT' 
  | 'TIMESHEET_UPDATE' 
  | 'WFH';

export type LeaveType = 
  | 'ANNUAL_LEAVE' 
  | 'SICK_LEAVE' 
  | 'UNPAID_LEAVE' 
  | 'EMERGENCY_LEAVE';

export type ActivityStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED';

export type EmployeeStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';

export type TransactionType = 
  | 'EARNED' 
  | 'GIFT_RECEIVED' 
  | 'GIFT_SENT' 
  | 'REWARD_REDEEMED' 
  | 'MONTHLY_ALLOWANCE';

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface FilterOptions {
  [key: string]: any;
}

export interface DateRange {
  startDate: Date | string;
  endDate: Date | string;
}
