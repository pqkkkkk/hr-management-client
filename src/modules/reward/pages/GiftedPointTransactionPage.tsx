import React, { useCallback, useMemo } from "react";
import { Calendar, ChevronDown, Search } from "lucide-react";
import { useApi } from "contexts/ApiContext";
import { useQuery } from "shared/hooks/use-query";
import { useFetchList } from "shared/hooks/use-fetch-list";
import {
  buildRecentMonthKeysUtc,
  formatMonthKeyUtc,
  formatMonthLabel,
  getNextMonthResetLabelUtc,
} from "shared/utils/date-utils";
import { initials } from "shared/utils/initial-utils";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import {
  GiftedPointEmployeeStat,
  GiftedPointFilter,
  PointTransaction,
} from "modules/reward/types/reward.types";
import { useGiftedPointStats } from "../hooks/useGiftedPointStats";

const BudgetSummaryCard: React.FC<{
  remaining: number;
  used: number;
  total: number;
  resetLabel: string;
}> = ({ remaining, used, total, resetLabel }) => {
  const nf = useMemo(() => new Intl.NumberFormat("vi-VN"), []);
  const pct = total > 0 ? Math.min(100, Math.max(0, (used / total) * 100)) : 0;

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

          <div className="mt-4">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-2 bg-blue-600 rounded-full"
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
              <div>đã dùng: {nf.format(Math.max(0, used))} pts</div>
              <div>Tổng: {nf.format(Math.max(0, total))} pts</div>
            </div>

            <div className="mt-2 text-xs text-gray-500 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-gray-200 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              </div>
              Reset vào {resetLabel}
            </div>
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
            placeholder="Tìm kiếm nhân viên..."
            className="w-full h-10 pl-9 pr-3 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

const EmployeeRow: React.FC<{ row: GiftedPointEmployeeStat }> = ({ row }) => {
  const nf = useMemo(() => new Intl.NumberFormat("vi-VN"), []);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-4 px-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
            {initials(row.employeeName)}
          </div>
          <div className="text-sm font-semibold text-gray-900">
            {row.employeeName}
          </div>
        </div>
      </td>
      <td className="py-4 px-5 text-right">
        <div className="text-sm font-semibold text-gray-900">
          {nf.format(row.totalPoints)}
        </div>
        <div className="text-xs text-gray-500">
          {row.giftCount} lần nhận thưởng
        </div>
      </td>
    </tr>
  );
};

const EmployeesTable: React.FC<{ rows: GiftedPointEmployeeStat[] }> = ({
  rows,
}) => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 text-left text-xs text-gray-600 font-semibold uppercase tracking-wide">
            <th className="py-3 px-5">TÊN NHÂN VIÊN</th>
            <th className="py-3 px-5 text-right">TỔNG SỐ ĐIỂM ĐÃ NHẬN</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <EmployeeRow key={r.employeeId} row={r} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const GiftedPointTransactionPage: React.FC = () => {
  const { rewardApi } = useApi();

  const now = useMemo(() => new Date(), []);
  const nowMonth = useMemo(() => formatMonthKeyUtc(now), [now]);
  const months = useMemo(() => buildRecentMonthKeysUtc(now, 13), [now]);

  const PAGE_SIZE = 6;
  const BUDGET_TOTAL = 20000;

  const { query, updateQuery } = useQuery<GiftedPointFilter>({
    month: nowMonth,
    keyword: "",
    currentPage: 1,
    pageSize: PAGE_SIZE,
    sortDirection: "DESC",
  });

  // Fetch GIFT transactions from API
  const fetchGiftedStats = useMemo(
    () => rewardApi.getGiftedPointStats.bind(rewardApi),
    [rewardApi]
  );

  const {
    data: transactions,
    page: pageData,
    isFetching: loading,
    error,
  } = useFetchList<GiftedPointFilter, PointTransaction>(
    fetchGiftedStats,
    query
  );

  // Process transactions into stats using custom hook
  const {
    stats: rows,
    totalElements,
    totalPages,
  } = useGiftedPointStats({
    transactions: transactions || [],
    keyword: query.keyword,
    currentPage: query.currentPage,
    pageSize: query.pageSize,
    sortDirection: query.sortDirection,
  });

  // Fetch all transactions for budget summary
  const summaryQuery = useMemo<GiftedPointFilter>(
    () => ({
      month: query.month,
      currentPage: 1,
      pageSize: 10000,
    }),
    [query.month]
  );

  const { data: allTransactions } = useFetchList<
    GiftedPointFilter,
    PointTransaction
  >(fetchGiftedStats, summaryQuery);

  // Process all transactions for budget calculation
  const { stats: allStats } = useGiftedPointStats({
    transactions: allTransactions || [],
    keyword: "",
    currentPage: 1,
    pageSize: 10000,
    sortDirection: "DESC",
  });

  // Calculate budget from all stats
  const usedBudget = useMemo(() => {
    return allStats.reduce((sum, s) => sum + (s.totalPoints || 0), 0);
  }, [allStats]);

  const remainingBudget = useMemo(() => {
    return Math.max(0, BUDGET_TOTAL - usedBudget);
  }, [BUDGET_TOTAL, usedBudget]);

  const handleFiltersChange = useCallback(
    (next: FiltersValue) => {
      updateQuery({
        currentPage: 1,
        month: next.month,
        keyword: next.keyword,
      });
    },
    [updateQuery]
  );

  const handlePageChange = useCallback(
    (p: number) => {
      updateQuery({ currentPage: p });
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
          Xem chi tiết phân bổ ngân sách thưởng cho các thành viên trong tháng.
        </p>
      </div>

      <div className="space-y-5">
        <BudgetSummaryCard
          remaining={remainingBudget}
          used={usedBudget}
          total={BUDGET_TOTAL}
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
        ) : rows.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <EmptyState />
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <EmployeesTable rows={rows} />
            <Pagination
              page={query.currentPage || 1}
              total={totalElements}
              limit={query.pageSize || PAGE_SIZE}
              setPage={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GiftedPointTransactionPage;
