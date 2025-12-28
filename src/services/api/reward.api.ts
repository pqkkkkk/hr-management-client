import { ApiResponse, Page } from "shared/types";
import {
  GiftPointsRequest,
  GiftPointsResponse,
  GiftedPointEmployeeStat,
  GiftedPointFilter,
  TransactionFilter,
  PointTransaction,
  TransactionType,
  TransactionListResponse,
} from "modules/reward/types/reward.types";
import apiClient from "./api.client";
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
  ): Promise<ApiResponse<Page<PointTransaction>>>;
}

export class MockRewardApi implements RewardApi {
  private employees: Array<{ id: string; name: string; email: string }> = [
    { id: "e-1", name: "Nguyễn Văn An", email: "an.nguyen@company.com" },
    { id: "e-2", name: "Trần Thị Bình", email: "binh.tran@company.com" },
    { id: "e-3", name: "Lê Hoàng Cường", email: "cuong.le@company.com" },
    { id: "e-4", name: "Phạm Minh Đăng", email: "dang.pham@company.com" },
    { id: "e-5", name: "Hoàng Thị Em", email: "em.hoang@company.com" },
  ];

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
}

export const mockRewardApi = new MockRewardApi();
export const restRewardApi = new RestRewardApi();
