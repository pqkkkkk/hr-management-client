import { ApiResponse, Page } from "shared/types";
import {
  GiftPointsRequest,
  GiftPointsResponse,
  GiftedPointEmployeeStat,
  GiftedPointFilter,
  TransactionFilter,
  PointTransaction,
  TransactionType,
} from "modules/reward/types/reward.types";
import apiClient from "./api.client";
import { RewardProgramFormData,RewardProgramResponse } from "modules/reward/types/rewardForm";
import {
  formatMonthKeyFromIsoUtc,
  formatMonthKeyUtc,
} from "shared/utils/date-utils";

export interface RewardApi {
  getPointTransactions(
    filter?: TransactionFilter
  ): Promise<ApiResponse<Page<PointTransaction>>>;

  giftPoints(
    payload: GiftPointsRequest
  ): Promise<ApiResponse<GiftPointsResponse>>;

  getGiftedPointStats(
    filter?: GiftedPointFilter
  ): Promise<ApiResponse<Page<GiftedPointEmployeeStat>>>;
}

export class MockRewardApi implements RewardApi {
  private employees: Array<{ id: string; name: string; email: string }> = [
    { id: "e-1", name: "Nguyễn Văn An", email: "an.nguyen@company.com" },
    { id: "e-2", name: "Trần Thị Bình", email: "binh.tran@company.com" },
    { id: "e-3", name: "Lê Hoàng Cường", email: "cuong.le@company.com" },
    { id: "e-4", name: "Phạm Minh Đăng", email: "dang.pham@company.com" },
    { id: "e-5", name: "Hoàng Thị Em", email: "em.hoang@company.com" },
  ];

  private rewardPrograms: Array<RewardProgramFormData> = [];

  private mockTransactions: PointTransaction[] = [
    {
      pointTransactionId: "g-12001",
      type: 1,
      amount: 500,
      sourceWalletId: "wallet1",
      destinationWalletId: "wallet-employee-e-1",
      createdAt: "2025-12-20T08:30:00.000Z",
      items: [],
    },
    {
      pointTransactionId: "g-12002",
      type: 1,
      amount: 300,
      sourceWalletId: "wallet1",
      destinationWalletId: "wallet-employee-e-2",
      createdAt: "2025-12-18T10:15:00.000Z",
      items: [],
    },
    {
      pointTransactionId: "g-12003",
      type: 1,
      amount: 200,
      sourceWalletId: "wallet1",
      destinationWalletId: "wallet-employee-e-3",
      createdAt: "2025-12-15T14:45:00.000Z",
      items: [],
    },
    {
      pointTransactionId: "g-12004",
      type: 1,
      amount: 150,
      sourceWalletId: "wallet1",
      destinationWalletId: "wallet-employee-e-4",
      createdAt: "2025-12-12T09:00:00.000Z",
      items: [],
    },
    {
      pointTransactionId: "8923",
      type: 0,
      amount: 500,
      sourceWalletId: "wallet1",
      destinationWalletId: "wallet2",
      createdAt: "2025-12-22T09:10:05.120Z",
      items: [],
    },
    {
      pointTransactionId: "8810",
      type: 1,
      amount: 200,
      sourceWalletId: "wallet1",
      destinationWalletId: "wallet-store",
      createdAt: "2025-12-18T14:49:18.943Z",
      items: [
        {
          rewardItemId: "activity-1",
          rewardItemName: "Hoạt động",
          quantity: 1,
          totalPoints: 200,
        },
      ],
    },
    {
      pointTransactionId: "8755",
      type: 0,
      amount: 1000,
      sourceWalletId: "wallet1",
      destinationWalletId: "wallet2",
      createdAt: "2025-12-24T14:49:18.943Z",
      items: [],
    },
    {
      pointTransactionId: "8100",
      type: 0,
      amount: 50,
      sourceWalletId: "wallet1",
      destinationWalletId: "wallet2",
      createdAt: "2025-12-04T16:05:10.500Z",
      items: [],
    },
    {
      pointTransactionId: "8099",
      type: 1,
      amount: 50,
      sourceWalletId: "wallet1",
      destinationWalletId: "wallet-store",
      createdAt: "2025-12-02T11:20:00.777Z",
      items: [
        {
          rewardItemId: "store-1",
          rewardItemName: "Cửa hàng",
          quantity: 1,
          totalPoints: 50,
        },
      ],
    },
    {
      pointTransactionId: "8098",
      type: 0,
      amount: 150,
      sourceWalletId: "wallet1",
      destinationWalletId: "wallet2",
      createdAt: "2025-11-29T10:12:30.250Z",
      items: [],
    },
    {
      pointTransactionId: "8097",
      type: 0,
      amount: 75,
      sourceWalletId: "wallet1",
      destinationWalletId: "wallet2",
      createdAt: "2025-11-26T18:03:59.001Z",
      items: [],
    },
    {
      pointTransactionId: "8096",
      type: 1,
      amount: 120,
      sourceWalletId: "wallet1",
      destinationWalletId: "wallet-store",
      createdAt: "2025-11-25T13:00:00.999Z",
      items: [
        {
          rewardItemId: "activity-2",
          rewardItemName: "Hoạt động",
          quantity: 1,
          totalPoints: 120,
        },
      ],
    },
  ];

  private toDateInputValue(iso: string) {
    try {
      const d = new Date(iso);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    } catch {
      return iso;
    }
  }

  async giftPoints(
    payload: GiftPointsRequest
  ): Promise<ApiResponse<GiftPointsResponse>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const employeeCount = payload.employeeIds?.length ?? 0;
        const points = Number(payload.points);
        const perEmployeePoints =
          Number.isFinite(points) && points > 0 ? Math.floor(points) : 0;
        const totalPointsDeducted = perEmployeePoints * employeeCount;

        const baseTxId = String(Date.now());
        const nowIso = new Date().toISOString();

        // Create one transaction per employee so gifted-history can group stats.
        (payload.employeeIds || []).forEach((employeeId, idx) => {
          this.mockTransactions.unshift({
            pointTransactionId: `${baseTxId}-${idx + 1}`,
            type: 1,
            amount: perEmployeePoints,
            sourceWalletId: "wallet1",
            destinationWalletId: `wallet-employee-${employeeId}`,
            createdAt: nowIso,
            items: [],
          });
        });

        const txId = `${baseTxId}-1`;

        resolve({
          data: { transactionId: txId, totalPointsDeducted },
          success: true,
          statusCode: 200,
          message: "Mock gift points success",
        });
      }, 900);
    });
  }

  async getGiftedPointStats(
    filter?: GiftedPointFilter
  ): Promise<ApiResponse<Page<GiftedPointEmployeeStat>>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date();
        const defaultMonth = formatMonthKeyUtc(now);
        const month = filter?.month || defaultMonth;

        const keyword = (filter?.keyword || "").trim().toLowerCase();

        const giftedTx = this.mockTransactions.filter((t) => {
          if (t.type !== 1) return false;
          if (!t.destinationWalletId?.startsWith("wallet-employee-"))
            return false;
          return formatMonthKeyFromIsoUtc(t.createdAt) === month;
        });

        const map = new Map<
          string,
          { totalPoints: number; giftCount: number }
        >();

        for (const tx of giftedTx) {
          const employeeId = tx.destinationWalletId.replace(
            "wallet-employee-",
            ""
          );
          const prev = map.get(employeeId) || { totalPoints: 0, giftCount: 0 };
          map.set(employeeId, {
            totalPoints: prev.totalPoints + (tx.amount || 0),
            giftCount: prev.giftCount + 1,
          });
        }

        let stats: GiftedPointEmployeeStat[] = Array.from(map.entries()).map(
          ([employeeId, v]) => {
            const emp = this.employees.find((e) => e.id === employeeId);
            return {
              employeeId,
              employeeName: emp?.name || `Nhân viên ${employeeId}`,
              employeeEmail: emp?.email || "-",
              totalPoints: v.totalPoints,
              giftCount: v.giftCount,
            };
          }
        );

        if (keyword) {
          stats = stats.filter((s) =>
            `${s.employeeName} ${s.employeeEmail}`
              .toLowerCase()
              .includes(keyword)
          );
        }

        const sortDirection = filter?.sortDirection || "DESC";
        stats.sort((a, b) => {
          const diff = a.totalPoints - b.totalPoints;
          return sortDirection === "ASC" ? diff : -diff;
        });

        const currentPage = filter?.currentPage || 1;
        const pageSize = filter?.pageSize || 10;
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginated = stats.slice(startIndex, endIndex);

        const totalElements = stats.length;
        const totalPages = Math.ceil(totalElements / pageSize) || 1;

        const page: Page<GiftedPointEmployeeStat> = {
          content: paginated,
          totalElements,
          totalPages,
          size: pageSize,
          number: currentPage,
          first: currentPage === 1,
          last: currentPage >= totalPages,
          numberOfElements: paginated.length,
          empty: paginated.length === 0,
          pageable: {
            pageNumber: currentPage,
            pageSize,
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
          message: "Mock gifted point stats fetched successfully",
        });
      }, 400);
    });
  }

  async getPointTransactions(
    filter?: TransactionFilter
  ): Promise<ApiResponse<Page<PointTransaction>>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...this.mockTransactions];

        // Filter by date range (YYYY-MM-DD)
        if (filter?.startDate && filter?.endDate) {
          filtered = filtered.filter((t) => {
            const d = this.toDateInputValue(t.createdAt);
            return d >= filter.startDate! && d <= filter.endDate!;
          });
        }

        // Filter by type
        if (filter?.type) {
          const numericType =
            filter.type === TransactionType.RECEIVE_POINTS
              ? 0
              : filter.type === TransactionType.REDEEM_POINTS
              ? 1
              : undefined;
          if (numericType !== undefined) {
            filtered = filtered.filter((t) => t.type === numericType);
          }
        }

        // Sort by createdAt
        const sortDirection = filter?.sortDirection || "DESC";
        filtered.sort((a, b) => {
          const ta = new Date(a.createdAt).getTime();
          const tb = new Date(b.createdAt).getTime();
          return sortDirection === "ASC" ? ta - tb : tb - ta;
        });

        // Pagination (1-based currentPage like request.api.ts)
        const currentPage = filter?.currentPage || 1;
        const pageSize = filter?.pageSize || 10;
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginated = filtered.slice(startIndex, endIndex);

        const totalElements = filtered.length;
        const totalPages = Math.ceil(totalElements / pageSize) || 1;

        const page: Page<PointTransaction> = {
          content: paginated,
          totalElements,
          totalPages,
          size: pageSize,
          number: currentPage,
          first: currentPage === 1,
          last: currentPage >= totalPages,
          numberOfElements: paginated.length,
          empty: paginated.length === 0,
          pageable: {
            pageNumber: currentPage,
            pageSize,
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
          message: "Mock point transactions fetched successfully",
        });
      }, 400);
    });
  }

  async createRewardProgram(request: RewardProgramFormData): Promise<RewardProgramResponse> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (!request.name || request.name.trim() === '') {
          reject(new Error('Tên đợt khen thưởng không được để trống'));
          return;
        }

        if (!request.startDate || !request.endDate) {
          reject(new Error('Ngày bắt đầu và kết thúc không được để trống'));
          return;
        }

        if (new Date(request.startDate) >= new Date(request.endDate)) {
          reject(new Error('Ngày kết thúc phải sau ngày bắt đầu'));
          return;
        }

        if (request.items.length === 0) {
          reject(new Error('Phải có ít nhất một phần thưởng'));
          return;
        }

        if (request.policies.length === 0) {
          reject(new Error('Phải có ít nhất một quy tắc'));
          return;
        }

        // Store the reward program
        this.rewardPrograms.push({
          ...request,
          name: request.name.trim(),
          description: request.description.trim(),
        });

        console.log('✅ Mock: Reward program created successfully!');
        console.log('📦 Saved program:', {
          name: request.name,
          startDate: request.startDate,
          endDate: request.endDate,
          itemCount: request.items.length,
          policyCount: request.policies.length,
          defaultGivingBudget: request.defaultGivingBudget,
        });
        console.log('📊 Total programs:', this.rewardPrograms.length);

        resolve({
          ...request,
          success: true,
        });
      }, 800);
    });
  }
}

export class RestRewardApi implements RewardApi {
  async getPointTransactions(
    filter?: TransactionFilter
  ): Promise<ApiResponse<Page<PointTransaction>>> {
    return apiClient.get(`/rewards/transactions`, { params: filter });
  }

  async giftPoints(
    payload: GiftPointsRequest
  ): Promise<ApiResponse<GiftPointsResponse>> {
    return apiClient.post(`/rewards/gift`, payload);
  }

  async getGiftedPointStats(
    filter?: GiftedPointFilter
  ): Promise<ApiResponse<Page<GiftedPointEmployeeStat>>> {
    return apiClient.get(`/rewards/gifted`, { params: filter });
  }

  async createRewardProgram(request: RewardProgramFormData): Promise<RewardProgramResponse> {
    return apiClient.post(`/rewards/programs`, request);
  }
}

export const mockRewardApi = new MockRewardApi();
export const restRewardApi = new RestRewardApi();
