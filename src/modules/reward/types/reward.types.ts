import { TransactionType, DateRange } from 'shared/types';

export interface PointBalance {
  employeeId: string;
  totalPoints: number;
  expiringPoints: ExpiringPoint[];
  monthlyAllowance: number;
  lastUpdated: Date | string;
}

export interface ExpiringPoint {
  points: number;
  expiryDate: Date | string;
  source: string;
}

export interface PointTransaction {
  id: string;
  employeeId: string;
  type: TransactionType;
  points: number;
  description: string;
  fromEmployeeId?: string;
  fromEmployeeName?: string;
  toEmployeeId?: string;
  toEmployeeName?: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  createdAt: Date | string;
  processedAt?: Date | string;
}

export interface RewardItem {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  imageUrl?: string;
  category: string;
  isAvailable: boolean;
}

export interface RedemptionRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  points: number;
  equivalentValue: number;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';
  requestedAt: Date | string;
  processedAt?: Date | string;
  notes?: string;
}

export interface CreateRedemptionRequestDto {
  points: number;
  notes?: string;
}

export interface GiftPointsRequest {
  recipientIds: string[];
  points: number;
  message: string;
}

export interface PointConversionRule {
  minimumPoints: number;
  conversionRate: number; // points to VND
  maxTransactionsPerMonth: number;
  pointsExpiryMonths: number;
}

export interface TeamPointsSummary {
  managerId: string;
  teamMembers: TeamMemberPoints[];
  totalGifted: number;
  period: DateRange;
}

export interface TeamMemberPoints {
  employeeId: string;
  employeeName: string;
  position: string;
  totalPointsReceived: number;
}

export interface TransactionFilterOptions {
  type?: TransactionType;
  dateRange?: DateRange;
  employeeId?: string;
}
