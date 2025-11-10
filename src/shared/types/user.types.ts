import { UserRole, EmployeeStatus } from './common.types';

export interface User {
  id: string;
  employeeCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: EmployeeStatus;
  avatar?: string;
  department?: string;
  position?: string;
  managerId?: string;
  managerName?: string;
  joinDate: Date | string;
  phoneNumber?: string;
  dateOfBirth?: Date | string;
  address?: string;
  idCard?: string;
  taxCode?: string;
  bankAccount?: string;
  bankName?: string;
  remainingLeave?: number;
  totalPoints?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export interface UpdateProfileRequest {
  phoneNumber?: string;
  dateOfBirth?: Date | string;
  address?: string;
}
