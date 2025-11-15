import { UserRole, UserStatus } from './common.types';

export interface User {
  userId: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  position?: string;
  joinDate: Date | string;
  identityCardNumber?: string;
  phoneNumber?: string;
  dateOfBirth?: Date | string;
  address?: string;
  bankAccount?: string;
  bankName?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  departmentId?: string;
}
export interface Department {
  departmentId: string;
  departmentName: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignInResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  authenticated: boolean;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface RefreshTokenResponse{
    accessToken: string;
    refreshToken: string;
}

export interface UpdateProfileRequest {
  phoneNumber?: string;
  dateOfBirth?: Date | string;
  address?: string;
}
