import { ApiResponse, Page } from "shared/types";
import {
  GiftPointsRequest,
  GiftPointsResponse,
  GiftedPointEmployeeStat,
  GiftedPointFilter,
  TransactionFilter,
  PointTransaction,
  TransactionType,
  ProgrameReward,
  RewardProgramFilter,
  RewardItem, RewardItemFilter,
  TransactionListResponse,
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

  getRewardPrograms(
    filter?: RewardProgramFilter
  ): Promise<ApiResponse<Page<ProgrameReward>>>;

  getRewardProgramById(
    id: string
  ): Promise<ApiResponse<RewardItem[]>>;
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
      type: TransactionType.GIFT,
      amount: 500,
      sourceWalletId: "wallet1",
      destinationWalletId: "wallet-employee-e-1",
      createdAt: "2025-12-20T08:30:00.000Z",
      items: [],
    },
    {
      pointTransactionId: "g-12002",
      type: TransactionType.GIFT,
      amount: 300,
      sourceWalletId: "wallet1",
      destinationWalletId: "wallet-employee-e-2",
      createdAt: "2025-12-18T10:15:00.000Z",
      items: [],
    },
    {
      pointTransactionId: "g-12003",
      type: TransactionType.GIFT,
      amount: 200,
      sourceWalletId: "wallet1",
      destinationWalletId: "wallet-employee-e-3",
      createdAt: "2025-12-15T14:45:00.000Z",
      items: [],
    },
    {
      pointTransactionId: "g-12004",
      type: TransactionType.GIFT,
      amount: 150,
      sourceWalletId: "wallet1",
      destinationWalletId: "wallet-employee-e-4",
      createdAt: "2025-12-12T09:00:00.000Z",
      items: [],
    },
    {
      pointTransactionId: "8923",
      type: TransactionType.POLICY_REWARD,
      amount: 500,
      sourceWalletId: "wallet1",
      destinationWalletId: "wallet2",
      createdAt: "2025-12-22T09:10:05.120Z",
      items: [],
    },
    {
      pointTransactionId: "8810",
      type: TransactionType.EXCHANGE,
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
      type: TransactionType.POLICY_REWARD,
      amount: 1000,
      sourceWalletId: "wallet1",
      destinationWalletId: "wallet2",
      createdAt: "2025-12-24T14:49:18.943Z",
      items: [],
    },
    {
      pointTransactionId: "8100",
      type: TransactionType.POLICY_REWARD,
      amount: 50,
      sourceWalletId: "wallet1",
      destinationWalletId: "wallet2",
      createdAt: "2025-12-04T16:05:10.500Z",
      items: [],
    },
    {
      pointTransactionId: "8099",
      type: TransactionType.EXCHANGE,
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
      type: TransactionType.POLICY_REWARD,
      amount: 150,
      sourceWalletId: "wallet1",
      destinationWalletId: "wallet2",
      createdAt: "2025-11-29T10:12:30.250Z",
      items: [],
    },
    {
      pointTransactionId: "8097",
      type: TransactionType.POLICY_REWARD,
      amount: 75,
      sourceWalletId: "wallet1",
      destinationWalletId: "wallet2",
      createdAt: "2025-11-26T18:03:59.001Z",
      items: [],
    },
    {
      pointTransactionId: "8096",
      type: TransactionType.EXCHANGE,
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
            type: TransactionType.GIFT,
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
  ): Promise<ApiResponse<Page<PointTransaction>>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const now = new Date();
        const defaultMonth = formatMonthKeyUtc(now);
        const month = filter?.month || defaultMonth;

        // Filter GIFT transactions by month
        const giftedTx = this.mockTransactions.filter((t) => {
          if (t.type !== TransactionType.GIFT) return false;
          if (!t.destinationWalletId?.startsWith("wallet-employee-"))
            return false;
          return formatMonthKeyFromIsoUtc(t.createdAt) === month;
        });

        // Return transactions in Page format
        const page: Page<PointTransaction> = {
          content: giftedTx,
          totalElements: giftedTx.length,
          totalPages: 1,
          size: giftedTx.length,
          number: 1,
          first: true,
          last: true,
          numberOfElements: giftedTx.length,
          empty: giftedTx.length === 0,
          pageable: {
            pageNumber: 1,
            pageSize: giftedTx.length,
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
          message: "Mock gift transactions fetched successfully",
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

        // Filter by date range (datetime format)
        if (filter?.FromDate && filter?.ToDate) {
          filtered = filtered.filter((t) => {
            const txDate = new Date(t.createdAt);
            const fromDate = new Date(filter.FromDate!);
            const toDate = new Date(filter.ToDate!);
            return txDate >= fromDate && txDate <= toDate;
          });
        }

        // Filter by type
        if (filter?.TransactionType) {
          filtered = filtered.filter((t) => t.type === filter.TransactionType);
        }

        // Sort by createdAt (DESC by default)
        filtered.sort((a, b) => {
          const ta = new Date(a.createdAt).getTime();
          const tb = new Date(b.createdAt).getTime();
          return tb - ta; // DESC
        });

        // Pagination
        const currentPage = filter?.PageNumber || 1;
        const pageSize = filter?.PageSize || 10;
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

  async getRewardPrograms(
    filter?: RewardProgramFilter
  ): Promise<ApiResponse<Page<ProgrameReward>>> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPrograms: ProgrameReward[] = [
          {
            rewardProgramId: "rp-1",
            name: "Chương trình tháng 12",
            description: "Chương trình thưởng cuối năm",
            startDate: "2025-12-01T00:00:00.000Z",
            endDate: "2025-12-31T23:59:59.999Z",
            status: "ACTIVE",
            defaultGivingBudget: 10000,
            bannerUrl: "https://example.com/banner1.jpg",
          },
          {
            rewardProgramId: "rp-2",
            name: "Chương trình quý 1/2026",
            description: "Chương trình khởi đầu năm mới",
            startDate: "2026-01-01T00:00:00.000Z",
            endDate: "2026-03-31T23:59:59.999Z",
            status: "PENDING",
            defaultGivingBudget: 15000,
            bannerUrl: "https://example.com/banner2.jpg",
          },
          {
            rewardProgramId: "rp-3",
            name: "Chương trình tháng 11",
            description: "Chương trình tháng 11",
            startDate: "2025-11-01T00:00:00.000Z",
            endDate: "2025-11-30T23:59:59.999Z",
            status: "INACTIVE",
            defaultGivingBudget: 8000,
            bannerUrl: "https://example.com/banner3.jpg",
          },
        ];

        let filtered = [...mockPrograms];

        // Filter by status
        if (filter?.status) {
          filtered = filtered.filter((p) => p.status === filter.status);
        }

        // Sort by startDate
        const sortDirection = filter?.sortDirection || "DESC";
        filtered.sort((a, b) => {
          const ta = new Date(a.startDate).getTime();
          const tb = new Date(b.startDate).getTime();
          return sortDirection === "ASC" ? ta - tb : tb - ta;
        });

        // Pagination
        const currentPage = filter?.currentPage || 1;
        const pageSize = filter?.pageSize || 10;
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginated = filtered.slice(startIndex, endIndex);

        const totalElements = filtered.length;
        const totalPages = Math.ceil(totalElements / pageSize) || 1;

        const page: Page<ProgrameReward> = {
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
          message: "Mock reward programs fetched successfully",
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

  async getRewardProgramById(
    id: string
  ): Promise<ApiResponse<RewardItem[]>> {
    return apiClient.get(`/rewards/programs/${id}`);
  }
}
export class RestRewardApi implements RewardApi {
  async getPointTransactions(
    filter?: TransactionFilter
  ): Promise<ApiResponse<Page<PointTransaction>>> {
    const response = await apiClient.get<ApiResponse<TransactionListResponse>>(
      `/rewards/transactions`,
      { params: filter }
    );

    // Map backend response format to Page<T> format
    const backendData = response.data;
    const page: Page<PointTransaction> = {
      content: backendData.items || [],
      totalElements: backendData.totalItems || 0,
      totalPages: backendData.totalPages || 1,
      size: backendData.pageSize || 10,
      number: backendData.page || 1,
      first: !backendData.hasPreviousPage,
      last: !backendData.hasNextPage,
      numberOfElements: backendData.items?.length || 0,
      empty: (backendData.items?.length || 0) === 0,
      pageable: {
        pageNumber: backendData.page || 1,
        pageSize: backendData.pageSize || 10,
        offset: ((backendData.page || 1) - 1) * (backendData.pageSize || 10),
        paged: true,
        unpaged: false,
        sort: { sorted: false, unsorted: true, empty: true },
      },
      sort: { sorted: false, unsorted: true, empty: true },
    };

    return {
      ...response,
      data: page,
    };
  }

  async giftPoints(
    payload: GiftPointsRequest
  ): Promise<ApiResponse<GiftPointsResponse>> {
    return apiClient.post(`/rewards/gift`, payload);
  }

  async getGiftedPointStats(
    filter?: GiftedPointFilter
  ): Promise<ApiResponse<Page<PointTransaction>>> {
    // chuyển đổi month YYYY-MM sang fromDate, toDate để khớp với param api
    const month = filter?.month;
    let fromDate: string | undefined;
    let toDate: string | undefined;

    if (month) {
      const [year, monthNum] = month.split("-");
      fromDate = `${year}-${monthNum}-01T00:00:00.000Z`;
      const lastDay = new Date(parseInt(year), parseInt(monthNum), 0).getDate();
      toDate = `${year}-${monthNum}-${String(lastDay).padStart(
        2,
        "0"
      )}T23:59:59.999Z`;
    }

    // tạo param filter chỉ lấy các giao dịch loại GIFT, set pageSize lớn để lấy đủ dữ liệu
    const transactionFilter: TransactionFilter = {
      TransactionType: TransactionType.GIFT,
      FromDate: fromDate,
      ToDate: toDate,
      PageNumber: 1,
      PageSize: 10000,
      sortBy: "createdAt",
      sortDirection: "desc",
    };

    const response = await apiClient.get<ApiResponse<TransactionListResponse>>(
      `/rewards/transactions`,
      { params: transactionFilter }
    );

    // Map backend response format to Page<T> format
    const backendData = response.data;
    const page: Page<PointTransaction> = {
      content: backendData.items || [],
      totalElements: backendData.totalItems || 0,
      totalPages: backendData.totalPages || 1,
      size: backendData.pageSize || 10,
      number: backendData.page || 1,
      first: !backendData.hasPreviousPage,
      last: !backendData.hasNextPage,
      numberOfElements: backendData.items?.length || 0,
      empty: (backendData.items?.length || 0) === 0,
      pageable: {
        pageNumber: backendData.page || 1,
        pageSize: backendData.pageSize || 10,
        offset: ((backendData.page || 1) - 1) * (backendData.pageSize || 10),
        paged: true,
        unpaged: false,
        sort: { sorted: false, unsorted: true, empty: true },
      },
      sort: { sorted: false, unsorted: true, empty: true },
    };

    return {
      ...response,
      data: page,
    };
  }

  async getRewardPrograms(
    filter?: RewardProgramFilter
  ): Promise<ApiResponse<Page<ProgrameReward>>> {
    return apiClient.get(`/rewards/programs`, { params: filter });
  }
  async getRewardProgramById(
    id: string
  ): Promise<ApiResponse<RewardItem[]>> {
    return apiClient.get(`/rewards/programs/${id}`);
  }

  async createRewardProgram(request: RewardProgramFormData): Promise<RewardProgramResponse> {
    return apiClient.post(`/rewards/programs`, request);
  }
}

export const mockRewardApi = new MockRewardApi();
export const restRewardApi = new RestRewardApi();
