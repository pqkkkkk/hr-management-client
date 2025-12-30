import React, { useCallback, useMemo } from "react";
import {
  PointTransaction,
  TransactionFilter,
  TransactionType,
} from "modules/reward/types/reward.types";
import { Calendar, ChevronDown, Coins, Gift, Plus, Award } from "lucide-react";
import Pagination from "../components/Pagination";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { useQuery } from "shared/hooks/use-query";
import { useFetchList } from "shared/hooks/use-fetch-list";
import { useApi } from "contexts/ApiContext";
import { formatDateTime } from "shared/utils/date-utils";

// Badge component
const Badge: React.FC<{
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}> = ({ children, className = "", icon }) => (
  <div
    className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${className}`}
  >
    {icon}
    {children}
  </div>
);

// SummaryCard component
const SummaryCard: React.FC<{ points: number }> = ({ points }) => {
  const nf = useMemo(() => new Intl.NumberFormat("vi-VN"), []);

  return (
    <div className="bg-white rounded-lg border border-gray-100 px-5 py-4 flex items-center gap-4 shadow-sm">
      <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center">
        <Coins className="w-5 h-5 text-yellow-500" />
      </div>
      <div>
        <div className="text-sm text-gray-500">Tổng điểm hiện tại</div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-bold text-gray-900">
            {nf.format(points)}
          </div>
          <div className="text-sm text-gray-500">điểm</div>
        </div>
      </div>
    </div>
  );
};

type FiltersValue = {
  startDate: string;
  endDate: string;
  type: "ALL" | TransactionType;
};

// FiltersBar component
const FiltersBar: React.FC<{
  value: FiltersValue;
  onChange: (next: FiltersValue) => void;
  onReset: () => void;
}> = ({ value, onChange, onReset }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-lg">
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <input
                type="date"
                value={value.startDate}
                onChange={(e) =>
                  onChange({ ...value, startDate: e.target.value })
                }
                className="text-sm text-gray-700 outline-none"
              />
              <div className="text-gray-400">—</div>
              <input
                type="date"
                value={value.endDate}
                onChange={(e) =>
                  onChange({ ...value, endDate: e.target.value })
                }
                className="text-sm text-gray-700 outline-none"
              />
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded px-3 py-2 min-w-[170px]">
                <div className="text-sm text-gray-700 flex-1">
                  {value.type === "ALL"
                    ? "Tất cả"
                    : value.type === TransactionType.GIFT
                    ? "Nhận điểm"
                    : value.type === TransactionType.POLICY_REWARD
                    ? "Thưởng chính sách"
                    : "Đổi quà"}
                </div>
                <div className="relative">
                  <select
                    value={value.type}
                    onChange={(e) =>
                      onChange({
                        ...value,
                        type: e.target.value as FiltersValue["type"],
                      })
                    }
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  >
                    <option value="ALL">Tất cả</option>
                    <option value={TransactionType.GIFT}>Nhận điểm</option>
                    <option value={TransactionType.POLICY_REWARD}>
                      Thưởng chính sách
                    </option>
                    <option value={TransactionType.EXCHANGE}>Đổi quà</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={onReset}
              className="text-sm text-red-500 hover:text-red-600 whitespace-nowrap"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// tạo ghi chú cho giao dịch
const buildNote = (tx: PointTransaction) => {
  if (tx.type === TransactionType.GIFT) return "Nhận điểm từ quản lý";
  if (tx.type === TransactionType.POLICY_REWARD)
    return "Thưởng điểm do chính sách";
  if (tx.type === TransactionType.EXCHANGE) {
    const firstItem = tx.items && tx.items.length > 0 ? tx.items[0] : undefined;
    if (!firstItem) return "Đổi quà";
    return `Đổi quà ${firstItem.rewardItemName.toLowerCase()}`;
  }
  return "Giao dịch điểm";
};

const isCreditTransaction = (tx: PointTransaction) =>
  tx.type === TransactionType.GIFT || tx.type === TransactionType.POLICY_REWARD;

// TransactionRow component
const TransactionRow: React.FC<{ tx: PointTransaction }> = ({ tx }) => {
  const created = useMemo(() => {
    return formatDateTime(tx.createdAt, { locale: "vi-VN" });
  }, [tx.createdAt]);

  const signedAmount = isCreditTransaction(tx) ? tx.amount : -tx.amount;
  const isPlus = signedAmount >= 0;
  const amountLabel = `${isPlus ? "+" : "-"}${Math.abs(signedAmount)}`;
  const note = buildNote(tx);

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50">
      <td className="py-4 px-5">
        <div className="text-sm font-semibold text-gray-900">
          {created.date}
        </div>
        <div className="text-xs text-gray-500">{created.time}</div>
      </td>
      <td className="py-4 px-5 text-sm text-gray-500">
        #TRX-{tx.pointTransactionId}
      </td>
      <td className="py-4 px-5">
        {tx.type === TransactionType.POLICY_REWARD ? (
          <Badge
            className="bg-blue-50 text-blue-600"
            icon={<Award className="w-3.5 h-3.5" />}
          >
            Thưởng chính sách
          </Badge>
        ) : tx.type === TransactionType.GIFT ? (
          <Badge
            className="bg-green-50 text-green-600"
            icon={<Plus className="w-3.5 h-3.5" />}
          >
            Nhận điểm
          </Badge>
        ) : (
          <Badge
            className="bg-red-50 text-red-600"
            icon={<Gift className="w-3.5 h-3.5" />}
          >
            Đổi quà
          </Badge>
        )}
      </td>
      <td className="py-4 px-5 text-sm text-gray-600">{note}</td>
      <td className="py-4 px-5 text-right text-sm font-semibold">
        <span className={isPlus ? "text-green-600" : "text-red-600"}>
          {amountLabel}
        </span>
      </td>
    </tr>
  );
};

// TransactionsTable component
const TransactionsTable: React.FC<{ rows: PointTransaction[] }> = ({
  rows,
}) => {
  return (
    <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-50 text-left text-xs text-gray-600 font-semibold uppercase tracking-wide">
            <th className="py-3 px-5">Ngày thực hiện</th>
            <th className="py-3 px-5">Mã GD</th>
            <th className="py-3 px-5">Loại giao dịch</th>
            <th className="py-3 px-5">Ghi chú</th>
            <th className="py-3 px-5 text-right">Biến động</th>
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

const toDateInputValue = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

// Main component
const TransactionHistoryPage: React.FC = () => {
  const { rewardApi } = useApi();
  const today = useMemo(() => new Date(), []);
  const defaultEnd = useMemo(() => toDateInputValue(today), [today]);
  const defaultStart = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() - 30);
    return toDateInputValue(d);
  }, [today]);

  const PAGE_SIZE = 5;

  const { query, updateQuery, resetQuery } = useQuery<TransactionFilter>({
    FromDate: `${defaultStart}T00:00:00.000Z`,
    ToDate: `${defaultEnd}T23:59:59.999Z`,
    PageNumber: 1,
    PageSize: PAGE_SIZE,
  });

  const fetchPointTransactions = useMemo(
    () => rewardApi.getPointTransactions.bind(rewardApi),
    [rewardApi]
  );

  const {
    data: transactions,
    page: pageData,
    isFetching: loading,
    error,
  } = useFetchList<TransactionFilter, PointTransaction>(
    fetchPointTransactions,
    query
  );

  const summaryQuery = useMemo<TransactionFilter>(
    () => ({ PageNumber: 1, PageSize: 1000 }),
    []
  );
  const { data: allTransactions } = useFetchList<
    TransactionFilter,
    PointTransaction
  >(fetchPointTransactions, summaryQuery);

  const currentPoints = useMemo(() => {
    return (allTransactions || []).reduce((sum, tx) => {
      const signed = isCreditTransaction(tx) ? tx.amount : -tx.amount;
      return sum + signed;
    }, 0);
  }, [allTransactions]);

  const handleFilterChange = useCallback(
    (next: FiltersValue) => {
      updateQuery({
        PageNumber: 1,
        FromDate: next.startDate
          ? `${next.startDate}T00:00:00.000Z`
          : undefined,
        ToDate: next.endDate ? `${next.endDate}T23:59:59.999Z` : undefined,
        TransactionType: next.type === "ALL" ? undefined : next.type,
      });
    },
    [updateQuery]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateQuery({ PageNumber: newPage });
    },
    [updateQuery]
  );

  const handleClearFilters = useCallback(() => {
    resetQuery();
  }, [resetQuery]);

  return (
    <div className="p-6">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">
            Lịch sử Giao dịch Điểm
          </h1>
          <p className="text-gray-500 mt-1">
            Theo dõi chi tiết quá trình tích lũy và sử dụng điểm thưởng của bạn.
          </p>
        </div>
        <SummaryCard points={currentPoints} />
      </div>

      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
        <FiltersBar
          value={{
            startDate: query.FromDate ? query.FromDate.split("T")[0] : "",
            endDate: query.ToDate ? query.ToDate.split("T")[0] : "",
            type: query.TransactionType ? query.TransactionType : "ALL",
          }}
          onChange={handleFilterChange}
          onReset={handleClearFilters}
        />

        {loading ? (
          <div className="px-6 py-20 text-center">
            <div className="flex justify-center">
              <svg
                className="animate-spin h-8 w-8 text-blue-600"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          </div>
        ) : error ? (
          <ErrorState />
        ) : transactions.length === 0 ? (
          <div className="min-h-[240px] flex items-center justify-center">
            <div className="w-full flex justify-center">
              <EmptyState />
            </div>
          </div>
        ) : (
          <div>
            <TransactionsTable rows={transactions} />
            <div className="border-t border-gray-100">
              <Pagination
                page={query.PageNumber || 1}
                total={pageData?.totalElements || 0}
                limit={PAGE_SIZE}
                setPage={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
