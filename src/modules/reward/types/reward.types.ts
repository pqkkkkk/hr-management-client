// Enums
export enum TransactionType {
  GIFT = "GIFT",
  POLICY_REWARD = "POLICY_REWARD",
  EXCHANGE = "EXCHANGE",
}

export const TransactionTypeOptions = [
  { value: TransactionType.GIFT, label: "Nhận điểm" },
  { value: TransactionType.POLICY_REWARD, label: "Thưởng chính sách" },
  { value: TransactionType.EXCHANGE, label: "Đổi quà" },
];

export interface TransactionFilter {
  TransactionType?: TransactionType;
  FromDate?: string;
  ToDate?: string;
  PageNumber?: number;
  PageSize?: number;
  EmployeeId?: string;
  sortBy?: string;
  sortDirection?: string;
}

export interface RewardItemTransaction {
  rewardItemId: string;
  rewardItemName: string;
  quantity: number;
  totalPoints: number;
}

export interface PointTransaction {
  pointTransactionId: string;
  type: TransactionType;
  amount: number;
  sourceWalletId: string | null;
  sourceUsername?: string;
  destinationWalletId: string;
  destinationUsername?: string;
  createdAt: string;
  items: RewardItemTransaction[];
  rewardProgramId?: string;
  rewardProgramName?: string;
}

export interface GiftPointsRequest {
  programId: string;
  recipients: Array<{ points: number; userId: string }>;
  senderUserId: string;
}

export interface UserWallet {
  userWalletId: string;
  userId: string;
  programId: string;
  personalPoint: number;
  givingBudget: number;
  program?: RewardProgram;
}

export interface RewardPolicy {
  policyId: string;
  programId: string;
  policyType: string;
  calculationPeriod: string;
  unitValue: number;
  pointsPerUnit: number;
  isActive: boolean;
}

export interface RewardProgramDetail extends RewardProgram {
  items: RewardItem[];
  policies: RewardPolicy[];
}

export interface GiftedPointEmployeeStat {
  employeeId: string;
  employeeName: string;
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

export interface TransactionListResponse {
  items: PointTransaction[];
  totalItems: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}


export interface RewardProgram {
  rewardProgramId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  defaultGivingBudget: number;
  bannerUrl: string;
}

export interface RewardProgramFilter {
  status?: "ACTIVE" | "INACTIVE" | "PENDING";
  currentPage?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

export interface RewardItem {
  rewardItemId: string;
  programId: string;
  name: string;
  requiredPoints: number;
  quantity: number;
  imageUrl: string;
}

export interface RewardItemFilter {
  currentPage?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "ASC" | "DESC";
}

// Exchange Reward Types
export interface ExchangeRewardItem {
  rewardItemId: string;
  quantity: number;
}

export interface ExchangeRewardRequest {
  items: ExchangeRewardItem[];
  programId: string;
  userWalletId: string;
}

