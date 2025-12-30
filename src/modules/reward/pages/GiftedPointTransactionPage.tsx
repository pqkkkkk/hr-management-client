import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Calendar, ChevronDown, Search } from "lucide-react";
import { useApi } from "contexts/ApiContext";
import { useAuth } from "contexts/AuthContext";
import { useQuery } from "shared/hooks/use-query";
import { useFetchList } from "shared/hooks/use-fetch-list";
import {
  buildRecentMonthKeysUtc,
  formatMonthKeyUtc,
  formatMonthLabel,
  getNextMonthResetLabelUtc,
  formatDateTime,
} from "shared/utils/date-utils";
import { initials } from "shared/utils/initial-utils";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import {
  PointTransaction,
  TransactionFilter,
  UserWallet,
} from "modules/reward/types/reward.types";

// Simplified BudgetSummaryCard - only shows remaining points per requirement
const BudgetSummaryCard: React.FC<{
  remaining: number;
  resetLabel: string;
}> = ({ remaining, resetLabel }) => {
  const nf = useMemo(() => new Intl.NumberFormat("vi-VN"), []);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-5 flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="text-xs font-semibold text-blue-700 flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-50 border border-blue-100 flex items-center justify-center">
              <div className="w-2 h-2 rounded bg-blue-600" />
            </div>
            SỐ ĐIỂM CÒN LẠI
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <div className="text-3xl font-bold text-gray-900">
              {nf.format(Math.max(0, remaining))}
            </div>
            <div className="text-sm text-gray-500">pts</div>
          </div>

          <div className="mt-4 text-xs text-gray-500 flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border border-gray-200 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
            </div>
            Reset vào {resetLabel}
          </div>
        </div>

        <div className="w-14 h-14 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
          <div className="w-7 h-7 rounded-md border-2 border-blue-200 bg-white" />
        </div>
      </div>
    </div>
  );
};

type FiltersValue = {
  month: string;
  keyword: string;
};

const FiltersBar: React.FC<{
  value: FiltersValue;
  months: string[];
  nowMonth: string;
  onChange: (next: FiltersValue) => void;
}> = ({ value, months, nowMonth, onChange }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="p-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 min-w-[140px]">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div className="text-sm text-gray-700 flex-1">
              {formatMonthLabel(value.month, nowMonth)}
            </div>
            <div className="relative">
              <select
                value={value.month}
                onChange={(e) => onChange({ ...value, month: e.target.value })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              >
                {months.map((m) => (
                  <option key={m} value={m}>
                    {formatMonthLabel(m, nowMonth)}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="relative flex-1 max-w-[360px]">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            value={value.keyword}
            onChange={(e) => onChange({ ...value, keyword: e.target.value })}
            placeholder="Tìm kiếm..."
            className="w-full h-10 pl-9 pr-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

// Transaction row component - displays a single gift transaction
const TransactionRow: React.FC<{ tx: PointTransaction }> = ({ tx }) => {
  const nf = useMemo(() => new Intl.NumberFormat("vi-VN"), []);
  const dateInfo = useMemo(() => formatDateTime(tx.createdAt, { locale: "vi-VN" }), [tx.createdAt]);

  // Extract recipient info from destinationWalletId (mock format: wallet-employee-{id})
  const recipientId = tx.destinationWalletId?.replace("wallet-employee-", "") || "N/A";

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-4 px-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
            {initials(recipientId)}
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900">
              {recipientId}
            </div>
            <div className="text-xs text-gray-500">
              #{tx.pointTransactionId}
            </div>
          </div>
        </div>
      </td>
      <td className="py-4 px-5">
        <div className="text-sm text-gray-700">{dateInfo.date}</div>
        <div className="text-xs text-gray-500">{dateInfo.time}</div>
      </td>
      <td className="py-4 px-5 text-right">
        <div className="text-sm font-semibold text-green-600">
          {nf.format(tx.amount)}
        </div>
        <div className="text-xs text-gray-500">điểm</div>
      </td>
    </tr>
  );
};

const TransactionsTable: React.FC<{ rows: PointTransaction[] }> = ({ rows }) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 text-left text-xs text-gray-600 font-semibold uppercase tracking-wide">
            <th className="py-3 px-5">NGƯỜI NHẬN</th>
            <th className="py-3 px-5">THỜI GIAN</th>
            <th className="py-3 px-5 text-right">ĐIỂM ĐÃ TẶNG</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((tx) => (
            <TransactionRow key={tx.pointTransactionId} tx={tx} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const GiftedPointTransactionPage: React.FC = () => {
  const { rewardApi } = useApi();
  const { user } = useAuth();

  const [wallet, setWallet] = useState<UserWallet | null>(null);

  const now = useMemo(() => new Date(), []);
  const nowMonth = useMemo(() => formatMonthKeyUtc(now), [now]);
  const months = useMemo(() => buildRecentMonthKeysUtc(now, 13), [now]);

  const PAGE_SIZE = 6;

  // Fetch wallet to get remaining giving budget
  useEffect(() => {
    const fetchWallet = async () => {
      if (!user?.userId) return;

      console.log("User", user);
      try {
        const programResponse = await rewardApi.getActiveRewardProgram();
        if (programResponse.success && programResponse.data) {
          const walletResponse = await rewardApi.getWallet(
            user.userId,
            programResponse.data.rewardProgramId
          );
          if (walletResponse.success) {
            console.log("Wallet:", walletResponse.data);
            setWallet(walletResponse.data);
          }
        }
      } catch (error) {
        console.error("Error fetching wallet:", error);
      }
    };
    fetchWallet();
  }, [rewardApi, user?.userId]);

  // Remaining budget from wallet API
  const remainingBudget = wallet?.givingBudget || 0;

  // Build date filter from month
  const buildDateFilter = useCallback((month: string) => {
    const [year, monthNum] = month.split("-");
    const fromDate = `${year}-${monthNum}-01T00:00:00.000Z`;
    const lastDay = new Date(parseInt(year), parseInt(monthNum), 0).getDate();
    const toDate = `${year}-${monthNum}-${String(lastDay).padStart(2, "0")}T23:59:59.999Z`;
    return { FromDate: fromDate, ToDate: toDate };
  }, []);

  const { query, updateQuery } = useQuery<TransactionFilter & { month?: string; keyword?: string }>({
    month: nowMonth,
    keyword: "",
    PageNumber: 1,
    PageSize: PAGE_SIZE,
    ...buildDateFilter(nowMonth),
  });

  // Fetch GIFT transactions using new API method
  const fetchGiftTransactions = useMemo(
    () => rewardApi.getMyGiftTransactions.bind(rewardApi),
    [rewardApi]
  );

  const {
    data: transactions,
    page: pageData,
    isFetching: loading,
    error,
  } = useFetchList<TransactionFilter, PointTransaction>(
    fetchGiftTransactions,
    query
  );

  const handleFiltersChange = useCallback(
    (next: FiltersValue) => {
      updateQuery({
        PageNumber: 1,
        month: next.month,
        keyword: next.keyword,
        ...buildDateFilter(next.month),
      });
    },
    [updateQuery, buildDateFilter]
  );

  const handlePageChange = useCallback(
    (p: number) => {
      updateQuery({ PageNumber: p });
    },
    [updateQuery]
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Thống kê điểm đã tặng cho đội
        </h1>
        <p className="text-gray-500 mt-1">
          Xem chi tiết các giao dịch tặng điểm cho nhân viên trong tháng.
        </p>
      </div>

      <div className="space-y-5">
        <BudgetSummaryCard
          remaining={remainingBudget}
          resetLabel={getNextMonthResetLabelUtc(query.month || nowMonth, {
            locale: "vi-VN",
          })}
        />

        <FiltersBar
          value={{
            month: query.month || nowMonth,
            keyword: query.keyword || "",
          }}
          months={months}
          nowMonth={nowMonth}
          onChange={handleFiltersChange}
        />

        {error ? (
          <ErrorState />
        ) : loading ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm px-6 py-16 flex items-center justify-center">
            <div className="text-sm text-gray-500">Đang tải...</div>
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <EmptyState />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <TransactionsTable rows={transactions} />
            <Pagination
              page={query.PageNumber || 1}
              total={pageData?.totalElements || 0}
              limit={query.PageSize || PAGE_SIZE}
              setPage={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftedPointTransactionPage;
