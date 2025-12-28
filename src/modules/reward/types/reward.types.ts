// Define types for functions in reward module here
export interface Reward {}

// Enums
export enum TransactionType {
  RECEIVE_POINTS = "RECEIVE_POINTS",
  REDEEM_POINTS = "REDEEM_POINTS",
}

export const TransactionTypeOptions = [
  { value: TransactionType.RECEIVE_POINTS, label: "Nhận điểm" },
  { value: TransactionType.REDEEM_POINTS, label: "Đổi điểm" },
];

export interface TransactionFilter {
  type?: TransactionType;
  startDate?: string;
  endDate?: string;
  currentPage?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface RewardItemTransaction {
  rewardItemId: string;
  rewardItemName: string;
  quantity: number;
  totalPoints: number;
}

export interface PointTransaction {
  pointTransactionId: string;
  type: number;
  amount: number;
  sourceWalletId: string;
  destinationWalletId: string;
  createdAt: string;
  items: RewardItemTransaction[];
}

export interface GiftPointsRequest {
  employeeIds: string[];
  points: number;
  reason?: string;
}

export interface GiftPointsResponse {
  transactionId: string;
  totalPointsDeducted: number;
}

export interface GiftedPointEmployeeStat {
  employeeId: string;
  employeeName: string;
  employeeEmail: string;
  totalPoints: number;
  giftCount: number;
}

export interface GiftedPointFilter {
  /** YYYY-MM (UTC) */
  month?: string;
  keyword?: string;
  currentPage?: number;
  pageSize?: number;
  sortDirection?: "ASC" | "DESC";
}


export interface RewardItem {
  id: number;
  name: string;
  points: number;
  quantity: number;
}