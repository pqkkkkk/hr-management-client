import { useMemo } from "react";
import {
  PointTransaction,
  GiftedPointEmployeeStat,
} from "../types/reward.types";

interface UseGiftedPointStatsProps {
  transactions: PointTransaction[];
  keyword?: string;
  currentPage?: number;
  pageSize?: number;
  sortDirection?: "ASC" | "DESC";
}

interface UseGiftedPointStatsResult {
  stats: GiftedPointEmployeeStat[];
  totalElements: number;
  totalPages: number;
}

// Custom hook để xử lý business logic: group, filter, sort, paginate transactions
// thành gifted point statistics
// Do dùng chung api GET /api/rewards/transactions chỉ trả về transactions
// nên cần xử lý thêm ở client để lấy được thống kê điểm tặng theo nhân viên

export const useGiftedPointStats = ({
  transactions,
  keyword = "",
  currentPage = 1,
  pageSize = 10,
  sortDirection = "DESC",
}: UseGiftedPointStatsProps): UseGiftedPointStatsResult => {
  return useMemo(() => {
    // Group transactions by destinationWalletId
    const walletStatsMap = new Map<
      string,
      { totalPoints: number; giftCount: number }
    >();

    for (const tx of transactions) {
      if (!tx.destinationWalletId) continue;

      const walletId = tx.destinationWalletId;
      const current = walletStatsMap.get(walletId) || {
        totalPoints: 0,
        giftCount: 0,
      };

      walletStatsMap.set(walletId, {
        totalPoints: current.totalPoints + (tx.amount || 0),
        giftCount: current.giftCount + 1,
      });
    }

    // Convert to stats array
    let stats: GiftedPointEmployeeStat[] = Array.from(
      walletStatsMap.entries()
    ).map(([walletId, { totalPoints, giftCount }]) => ({
      employeeId: walletId,
      employeeName: `Ví ${walletId}`,
      employeeEmail: "",
      totalPoints,
      giftCount,
    }));

    // Filter by keyword
    const normalizedKeyword = keyword.trim().toLowerCase();
    if (normalizedKeyword) {
      stats = stats.filter((s) =>
        `${s.employeeName} ${s.employeeId}`
          .toLowerCase()
          .includes(normalizedKeyword)
      );
    }

    // Sort by totalPoints
    stats.sort((a, b) => {
      const diff = a.totalPoints - b.totalPoints;
      return sortDirection === "ASC" ? diff : -diff;
    });

    // Calculate pagination
    const totalElements = stats.length;
    const totalPages = Math.ceil(totalElements / pageSize) || 1;
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginated = stats.slice(startIndex, endIndex);

    return {
      stats: paginated,
      totalElements,
      totalPages,
    };
  }, [transactions, keyword, currentPage, pageSize, sortDirection]);
};
