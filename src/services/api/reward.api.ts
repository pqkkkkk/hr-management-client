import { ApiResponse, Page } from "shared/types";
import {
  GiftPointsRequest,
  TransactionFilter,
  PointTransaction,
  TransactionType,
  RewardProgram,
  RewardProgramFilter,
  RewardItem,
  RewardProgramDetail,
  UserWallet,
  ExchangeRewardRequest,
  DistributePointsResponse,
} from "modules/reward/types/reward.types";
import { RewardProgramFormData, RewardProgramResponse } from "modules/reward/types/rewardForm";
import {
  mockRewardPrograms,
  mockRewardItems,
  mockRewardPolicies,
  mockTransactions,
  mockUserWallets,
} from "shared/data/reward.data";
import { dotnetApiClient } from "./api.client";

// ========== API INTERFACE ==========

export interface RewardApi {
  // Transactions
  getPointTransactions(filter?: TransactionFilter): Promise<ApiResponse<Page<PointTransaction>>>;
  giftPoints(payload: GiftPointsRequest): Promise<ApiResponse<Array<PointTransaction>>>;
  getMyGiftTransactions(filter?: TransactionFilter): Promise<ApiResponse<Page<PointTransaction>>>;

  // Programs
  getRewardPrograms(filter?: RewardProgramFilter): Promise<ApiResponse<Page<RewardProgram>>>;
  getRewardProgramById(id: string): Promise<ApiResponse<RewardProgramDetail>>;
  getActiveRewardProgram(): Promise<ApiResponse<RewardProgramDetail>>;
  createRewardProgram(request: RewardProgramFormData): Promise<RewardProgramResponse>;

  // Wallet
  getWallet(userId: string, programId: string): Promise<ApiResponse<UserWallet>>;
  getWalletsByProgram(programId: string, pageNumber?: number, pageSize?: number): Promise<Page<UserWallet>>;

  // Exchange
  exchangeReward(request: ExchangeRewardRequest): Promise<ApiResponse<PointTransaction>>;

  // Admin - Point Distribution
  distributePoints(programId: string, startDate: string, endDate: string): Promise<DistributePointsResponse>;

  // Admin - Update Program
  updateRewardProgram(id: string, request: RewardProgramFormData): Promise<ApiResponse<RewardProgramDetail>>;
}

// ========== MOCK API IMPLEMENTATION ==========

export class MockRewardApi implements RewardApi {
  // GET /api/v1/rewards/transactions
  async getPointTransactions(filter?: TransactionFilter): Promise<ApiResponse<Page<PointTransaction>>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const page: Page<PointTransaction> = {
          content: mockTransactions,
          totalElements: mockTransactions.length,
          totalPages: 1,
          size: filter?.PageSize || 10,
          number: filter?.PageNumber || 1,
          first: true,
          last: true,
          numberOfElements: mockTransactions.length,
          empty: mockTransactions.length === 0,
          pageable: {
            pageNumber: filter?.PageNumber || 1,
            pageSize: filter?.PageSize || 10,
            offset: 0,
            paged: true,
            unpaged: false,
            sort: { sorted: false, unsorted: true, empty: true },
          },
          sort: { sorted: false, unsorted: true, empty: true },
        };

        resolve({
          data: page,
          success: true,
          statusCode: 200,
          message: "Transactions retrieved successfully",
        });
      }, 500);
    });
  }

  // POST /api/v1/rewards/transactions/gift
  async giftPoints(payload: GiftPointsRequest): Promise<ApiResponse<Array<PointTransaction>>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: mockTransactions,
          success: true,
          statusCode: 200,
          message: "Gift points successful",
        });
      }, 500);
    });
  }

  // GET GIFT transactions sent by current user (mocked - filters by TransactionType.GIFT)
  async getMyGiftTransactions(filter?: TransactionFilter): Promise<ApiResponse<Page<PointTransaction>>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Filter only GIFT transactions
        const giftTransactions = mockTransactions.filter(t => t.type === TransactionType.GIFT);

        // Apply pagination
        const pageNumber = filter?.PageNumber || 1;
        const pageSize = filter?.PageSize || 10;
        const startIndex = (pageNumber - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginated = giftTransactions.slice(startIndex, endIndex);

        const page: Page<PointTransaction> = {
          content: paginated,
          totalElements: giftTransactions.length,
          totalPages: Math.ceil(giftTransactions.length / pageSize) || 1,
          size: pageSize,
          number: pageNumber,
          first: pageNumber === 1,
          last: endIndex >= giftTransactions.length,
          numberOfElements: paginated.length,
          empty: paginated.length === 0,
          pageable: {
            pageNumber: pageNumber,
            pageSize: pageSize,
            offset: startIndex,
            paged: true,
            unpaged: false,
            sort: { sorted: false, unsorted: true, empty: true },
          },
          sort: { sorted: false, unsorted: true, empty: true },
        };

        resolve({
          data: page,
          success: true,
          statusCode: 200,
          message: "Gift transactions retrieved successfully",
        });
      }, 500);
    });
  }

  // GET /api/v1/rewards/programs
  async getRewardPrograms(filter?: RewardProgramFilter): Promise<ApiResponse<Page<RewardProgram>>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const page: Page<RewardProgram> = {
          content: mockRewardPrograms,
          totalElements: mockRewardPrograms.length,
          totalPages: 1,
          size: filter?.pageSize || 10,
          number: filter?.currentPage || 1,
          first: true,
          last: true,
          numberOfElements: mockRewardPrograms.length,
          empty: mockRewardPrograms.length === 0,
          pageable: {
            pageNumber: filter?.currentPage || 1,
            pageSize: filter?.pageSize || 10,
            offset: 0,
            paged: true,
            unpaged: false,
            sort: { sorted: false, unsorted: true, empty: true },
          },
          sort: { sorted: false, unsorted: true, empty: true },
        };

        resolve({
          data: page,
          success: true,
          statusCode: 200,
          message: "Reward programs retrieved successfully",
        });
      }, 500);
    });
  }

  // GET /api/v1/rewards/programs/:id
  async getRewardProgramById(id: string): Promise<ApiResponse<RewardProgramDetail>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const program = mockRewardPrograms.find(p => p.rewardProgramId === id) || mockRewardPrograms[0];
        const programDetail: RewardProgramDetail = {
          ...program,
          items: mockRewardItems,
          policies: mockRewardPolicies,
        };

        resolve({
          data: programDetail,
          success: true,
          statusCode: 200,
          message: "Reward program retrieved successfully",
        });
      }, 300);
    });
  }

  // GET active reward program (mock - returns first ACTIVE program)
  async getActiveRewardProgram(): Promise<ApiResponse<RewardProgramDetail>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const activeProgram = mockRewardPrograms.find(p => p.status === "ACTIVE") || mockRewardPrograms[0];

        const programDetail: RewardProgramDetail = {
          ...activeProgram,
          items: mockRewardItems,
          policies: mockRewardPolicies,
        };

        resolve({
          data: programDetail,
          success: true,
          statusCode: 200,
          message: "Active reward program retrieved successfully",
        });
      }, 300);
    });
  }

  // POST /api/v1/rewards/programs
  async createRewardProgram(request: RewardProgramFormData): Promise<RewardProgramResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          ...request,
          success: true,
        });
      }, 500);
    });
  }

  // GET /api/v1/rewards/wallets/user/:userId/program/:programId
  async exchangeReward(request: ExchangeRewardRequest): Promise<ApiResponse<PointTransaction>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Calculate total points
        const totalPoints = request.items.reduce((sum, item) => {
          // In real implementation, we'd look up the item's requiredPoints
          return sum + (item.quantity * 100); // Mock: 100 points per item
        }, 0);

        const response: PointTransaction = {
          pointTransactionId: `TXN${Date.now()}`,
          type: TransactionType.EXCHANGE,
          amount: totalPoints,
          sourceWalletId: `wallet-${request.userWalletId}`,
          destinationWalletId: '',
          createdAt: new Date().toISOString(),
          items: request.items.map(item => ({
            rewardItemId: item.rewardItemId,
            rewardItemName: 'Mock Item',
            quantity: item.quantity,
            totalPoints: item.quantity * 100,
          })),
        };

        resolve({
          data: response,
          success: true,
          statusCode: 201,
          message: "Exchange successful",
        });
      }, 500);
    });
  }

  async getWallet(userId: string, programId: string): Promise<ApiResponse<UserWallet>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const wallet = mockUserWallets.find(w => w.userId === userId && w.programId === programId);
        resolve({
          data: wallet,
          success: true,
          statusCode: 200,
          message: "Wallet retrieved successfully",
        });
      }, 300);
    });
  }

  async getWalletsByProgram(programId: string, pageNumber = 1, pageSize = 20): Promise<Page<UserWallet>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const wallets = mockUserWallets.filter(w => w.programId === programId);
        const startIndex = (pageNumber - 1) * pageSize;
        const paginated = wallets.slice(startIndex, startIndex + pageSize);

        resolve({
          content: paginated,
          totalElements: wallets.length,
          totalPages: Math.ceil(wallets.length / pageSize) || 1,
          size: pageSize,
          number: pageNumber - 1,
          first: pageNumber === 1,
          last: startIndex + pageSize >= wallets.length,
          numberOfElements: paginated.length,
          empty: paginated.length === 0,
          pageable: {
            pageNumber: pageNumber - 1,
            pageSize,
            offset: startIndex,
            paged: true,
            unpaged: false,
            sort: { sorted: false, unsorted: true, empty: true },
          },
          sort: { sorted: false, unsorted: true, empty: true },
        });
      }, 300);
    });
  }

  async distributePoints(programId: string, startDate: string, endDate: string): Promise<DistributePointsResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          totalUsersProcessed: 5,
          totalPointsDistributed: 150,
          totalTransactionsCreated: 8,
          userSummaries: [
            { userId: "user1", userName: "Nguyen Van A", pointsEarned: 30, pointsByPolicy: { NOT_LATE: 20, OVERTIME: 10 } },
            { userId: "user2", userName: "Tran Thi B", pointsEarned: 45, pointsByPolicy: { NOT_LATE: 25, FULL_ATTENDANCE: 20 } },
          ],
        });
      }, 1000);
    });
  }

  async updateRewardProgram(id: string, request: RewardProgramFormData): Promise<ApiResponse<RewardProgramDetail>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: {
            ...request,
            rewardProgramId: id,
            status: 'ACTIVE',
            items: request.items.map(i => ({ ...i, rewardItemId: i.rewardItemId || 'mock-id', programId: id })),
            policies: request.policies.map(p => ({ ...p, policyId: p.policyId || 'mock-id', programId: id, calculationPeriod: 'MONTHLY', isActive: true }))
          },
          success: true,
          statusCode: 200,
          message: "Updated successfully",
        });
      }, 500);
    });
  }
}

// ========== REST API IMPLEMENTATION ==========

export class RestRewardApi implements RewardApi {
  async getPointTransactions(filter?: TransactionFilter): Promise<ApiResponse<Page<PointTransaction>>> {
    const response = await dotnetApiClient.get<ApiResponse<Page<PointTransaction>>>(
      `/rewards/transactions`,
      { params: filter }
    );

    return response;


  }

  async giftPoints(payload: GiftPointsRequest): Promise<ApiResponse<Array<PointTransaction>>> {
    return dotnetApiClient.post(`/rewards/transactions/gift`, payload);
  }

  // GET GIFT transactions sent by current user
  async getMyGiftTransactions(filter?: TransactionFilter): Promise<ApiResponse<Page<PointTransaction>>> {
    // Use transaction filter with GIFT type
    const giftFilter: TransactionFilter = {
      ...filter,
      TransactionType: TransactionType.GIFT,
    };

    const response = await dotnetApiClient.get<ApiResponse<Page<PointTransaction>>>(
      `/rewards/transactions`,
      { params: giftFilter }
    );

    return response;
  }

  async getRewardPrograms(filter?: RewardProgramFilter): Promise<ApiResponse<Page<RewardProgram>>> {
    return dotnetApiClient.get(`/rewards/programs`, { params: filter });
  }

  async getRewardProgramById(id: string): Promise<ApiResponse<RewardProgramDetail>> {
    return dotnetApiClient.get(`/rewards/programs/${id}`);
  }

  async getActiveRewardProgram(): Promise<ApiResponse<RewardProgramDetail>> {
    return dotnetApiClient.get<ApiResponse<RewardProgramDetail>>(`/rewards/programs/active`);
  }

  async createRewardProgram(request: RewardProgramFormData): Promise<RewardProgramResponse> {
    return dotnetApiClient.post(`/rewards/programs`, request);
  }

  async getWallet(userId: string, programId: string): Promise<ApiResponse<UserWallet>> {
    return dotnetApiClient.get(`/rewards/wallets/user/${userId}/program/${programId}`);
  }

  async exchangeReward(request: ExchangeRewardRequest): Promise<ApiResponse<PointTransaction>> {
    return dotnetApiClient.post(`/rewards/transactions/exchange`, request);
  }

  async getWalletsByProgram(programId: string, pageNumber = 1, pageSize = 20): Promise<Page<UserWallet>> {
    return dotnetApiClient.get(`/rewards/wallets/program/${programId}`, {
      params: { pageNumber, pageSize }
    });
  }

  async distributePoints(programId: string, startDate: string, endDate: string): Promise<DistributePointsResponse> {
    return dotnetApiClient.post(`/rewards/programs/${programId}/distribute-points`, {
      startDate,
      endDate
    });
  }

  async updateRewardProgram(id: string, request: RewardProgramFormData): Promise<ApiResponse<RewardProgramDetail>> {
    return dotnetApiClient.put(`/rewards/programs/${id}`, request);
  }
}
