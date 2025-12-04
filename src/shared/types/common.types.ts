// Common types used across the application
export type ApiType = 'REST' | 'MOCK';

export type UserRole = 'EMPLOYEE' | 'MANAGER' | 'HR' | 'ADMIN';

export type ActivityStatus = 'UPCOMING' | 'ONGOING' | 'COMPLETED';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'ON_LEAVE';

export interface Pageable {
  pageNumber: number;
  pageSize: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  offset: number;
  paged: boolean;
  unpaged: boolean;
}
export interface Page<T> {
  content: T[];
  pageable: Pageable;
  last: boolean;
  totalElements: number;
  totalPages: number;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

export interface ApiResponse<T> {
    data: T;
    statusCode: number;
    message?: string;
    success: boolean;
    error?: ApiError;
}
export interface ApiError {
    statusCode: number;
    message: string;
}

export interface DateRange {
  startDate: Date | string;
  endDate: Date | string;
}
