import React, { useCallback, useMemo, useState } from "react";
import { formatDate } from "shared/utils/date-utils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DelegationForm from "../components/DelegationForm";
import Pagination from "../components/Pagination";
import ConfirmationApprove from "../components/ConfirmationApprove";
import ConfirmationReject from "../components/ConfirmationReject";
import { useApi } from "contexts/ApiContext";
import { useAuth } from "contexts/AuthContext";
import {
  Request,
  RequestStatus,
  RequestType,
  requestTypeOptions,
  requestStatusOptions,
  CreateDelegationRequest,
  RequestFilter,
} from "../types/request.types";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";
import { useQuery } from "shared/hooks/use-query";
import { useFetchList } from "shared/hooks/use-fetch-list";

// --- Component: SearchAndFilter ---
export type Filters = {
  dateFrom?: string; // ISO yyyy-mm-dd
  dateTo?: string; // ISO yyyy-mm-dd
  requestType?: RequestType | "";
  status?: RequestStatus | "";
};

const SearchAndFilter: React.FC<{
  filters: Filters;
  onChange: (f: Filters) => void;
  onClear?: () => void;
}> = ({ filters, onChange, onClear }) => {
  return (
    <div className="px-6 py-3 border-t border-b border-gray-200 flex items-center gap-3 flex-nowrap overflow-x-auto bg-white">

      <div className="flex flex-col">
        <label className="text-xl text-gray-600 mb-1">Ngày gửi</label>
        <div className="flex items-center gap-2">
          <input
            type="date"
            value={filters.dateFrom ?? ""}
            onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
            className="h-9 px-3 bg-gray-100 rounded-lg text-sm"
          />
          <span className="text-sm text-gray-400">—</span>
          <input
            type="date"
            value={filters.dateTo ?? ""}
            onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
            className="h-9 px-3 bg-gray-100 rounded-lg text-sm"
          />
        </div>
      </div>
      <div className="flex flex-col">
        <label className="text-xl text-gray-600 mb-1">Loại yêu cầu</label>
        <div className="relative">
          <select
            value={filters.requestType ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                requestType: e.target.value as RequestType | "",
              })
            }
            className="h-9 px-4 pr-10 bg-gray-100 rounded-lg text-sm font-medium appearance-none"
          >
            <option value="">Tất cả</option>
            {requestTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
              <path
                d="M4 7L8 11L12 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <label className="text-xl text-gray-600 mb-1">Trạng thái</label>
        <div className="relative">
          <select
            value={filters.status ?? ""}
            onChange={(e) =>
              onChange({
                ...filters,
                status: e.target.value as RequestStatus | "",
              })
            }
            className="h-9 px-4 pr-10 bg-gray-100 rounded-lg text-sm font-medium appearance-none"
          >
            <option value="">Tất cả</option>
            {requestStatusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
              <path
                d="M4 7L8 11L12 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="ml-auto flex items-center">
        <button
          onClick={() => {
            onChange({
              dateFrom: "",
              dateTo: "",
              requestType: "",
              status: "",
            });
            if (onClear) onClear();
          }}
          className="h-9 px-3 flex items-center gap-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg"
          aria-label="Xóa bộ lọc"
        >
          <svg
            className="w-4 h-4 inline-block align-middle"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden
          >
            <path
              d="M12 4L4 12M4 4L12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span className="align-middle">Xóa bộ lọc</span>
        </button>
      </div>
    </div>
  );
};

// --- Component: RequestRow ---
type RequestRowProps = {
  request: Request;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelegate?: (requestId: string, data: CreateDelegationRequest) => void;
};

const getStatusBadgeClass = (status: RequestStatus): string => {
  switch (status) {
    case RequestStatus.APPROVED:
      return "bg-emerald-50 text-green-800";
    case RequestStatus.PENDING:
      return "bg-amber-50 text-amber-700";
    case RequestStatus.REJECTED:
      return "bg-red-50 text-red-700";
    case RequestStatus.CANCELLED:
      return "bg-gray-100 text-gray-700";
    case RequestStatus.PROCESSING:
      return "bg-blue-50 text-blue-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusLabel = (status: RequestStatus) => {
  const opt = requestStatusOptions.find((o) => o.value === status);
  return opt?.label ?? status;
};

const getTypeLabel = (type: RequestType) => {
  const opt = requestTypeOptions.find((o) => o.value === type);
  return opt?.label ?? type;
};

const RequestRow: React.FC<RequestRowProps> = ({
  request,
  onApprove,
  onReject,
  onDelegate,
}) => {
  const navigate = useNavigate();
  const [isDelegateOpen, setIsDelegateOpen] = useState(false);

  const handleDelegateSubmit = (data: CreateDelegationRequest) => {
    if (onDelegate) {
      onDelegate(request.requestId, data);
    } else {
      toast.success("Ủy quyền thành công");
    }
    setIsDelegateOpen(false);
  };

  return (
    <tr className="border-b last:border-b-0">
      <td className="py-4 px-10 text-sm font-medium text-gray-800">
        {request.employeeFullName}
      </td>
      <td className="py-4 px-10 text-sm text-gray-600">
        {getTypeLabel(request.requestType)}
      </td>
      <td className="py-4 px-10 text-sm text-gray-600">
        {formatDate(request.createdAt)}
      </td>
      <td className="py-4 px-10">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusBadgeClass(
            request.status
          )}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
          {getStatusLabel(request.status)}
        </span>
      </td>
      <td className="py-4 px-10">
        <div className="flex items-center gap-1">
          {request.status === RequestStatus.PENDING ? (
            <>
              <button
                onClick={() => onApprove && onApprove(request.requestId)}
                className="w-8 h-8 flex items-center justify-center bg-green-500 hover:bg-green-600 text-white rounded"
                title="Phê duyệt"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                onClick={() => onReject && onReject(request.requestId)}
                className="w-8 h-8 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded"
                title="Từ chối"
              >
                <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M15 9L9 15M9 9l6 6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </>
          ) : null}
          <button
            onClick={() => {
              navigate(`/requests/manage/${request.requestId}`);
            }}
            className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-700 rounded"
            title="Xem chi tiết"
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <path
                d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="12"
                r="3"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
          </button>
          {request.status === RequestStatus.PENDING ? (
            <button
              onClick={() => setIsDelegateOpen(true)}
              className="w-8 h-8 flex items-center justify-center border border-gray-200 text-blue-600 rounded"
              title="Ủy quyền xử lý"
            >
              <svg
                className="w-4 h-4"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM4 20v-1c0-2.5 4-3.5 8-3.5s8 1 8 3.5V20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          ) : null}
        </div>
      </td>
      <DelegationForm
        isOpen={isDelegateOpen}
        onClose={() => setIsDelegateOpen(false)}
        onSubmit={handleDelegateSubmit}
      />
    </tr>
  );
};

// --- Main Page Component ---
const RequestManagementPage: React.FC = () => {
  const { requestApi } = useApi();
  const { user } = useAuth();
  const PAGE_SIZE = 6;

  const { query, updateQuery, resetQuery } = useQuery<RequestFilter>({
    currentPage: 1,
    pageSize: PAGE_SIZE,
    approverId: user?.userId,
  });

  const fetchTeamRequests = useMemo(
    () => requestApi.getTeamRequests.bind(requestApi),
    [requestApi]
  );

  const {
    data: requests,
    page: pageData,
    isFetching: loading,
    error,
    refetch,
  } = useFetchList<RequestFilter, Request>(fetchTeamRequests, query);

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const pendingCount = requests.filter(
    (r) => r.status === RequestStatus.PENDING
  ).length;

  const handleFilterChange = useCallback(
    (newFilters: Filters) => {
      updateQuery({
        currentPage: 1,
        type: newFilters.requestType ? (newFilters.requestType as RequestType) : undefined,
        status: newFilters.status ? (newFilters.status as RequestStatus) : undefined,
        startDate: newFilters.dateFrom || undefined,
        endDate: newFilters.dateTo || undefined,
      });
    },
    [updateQuery]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      updateQuery({ currentPage: newPage });
    },
    [updateQuery]
  );

  const handleClearFilters = useCallback(() => {
    resetQuery();
  }, [resetQuery]);

  const badgeBgClass =
    pendingCount === 0
      ? "bg-green-50 text-green-700"
      : "bg-red-50 text-red-700";
  const badgeDotClass = pendingCount === 0 ? "bg-green-400" : "bg-red-400";

  const handleApprove = (id: string) => {
    setSelectedRequestId(id);
    setShowApproveModal(true);
  };

  const handleReject = (id: string) => {
    setSelectedRequestId(id);
    setShowRejectModal(true);
  };

  const doApprove = async () => {
    if (!selectedRequestId || !user) return;
    try {
      const res = await requestApi.approveRequest(selectedRequestId, user.userId);
      if (res && res.success) {
        // Refetch data from server to get updated list
        await refetch();
        toast.success("Phê duyệt thành công");
      }
    } catch (err) {
      console.error("Approve failed", err);
      toast.error("Phê duyệt thất bại");
    } finally {
      setShowApproveModal(false);
      setSelectedRequestId(null);
    }
  };

  const doReject = async (reason: string) => {
    if (!selectedRequestId || !user) return;
    try {
      const res = await requestApi.rejectRequest(
        selectedRequestId,
        user.userId,
        reason || ""
      );
      if (res && res.success) {
        // Refetch data from server to get updated list
        await refetch();
        toast.success("Từ chối thành công");
      }
    } catch (err) {
      console.error("Reject failed", err);
      toast.error("Từ chối thất bại");
    } finally {
      setShowRejectModal(false);
      setSelectedRequestId(null);
    }
  };

  const doDelegate = async (requestId: string, data: CreateDelegationRequest) => {
    if (!user) return;
    try {
      const res = await requestApi.delegateRequest(requestId, data.delegateToId);
      if (res && res.success) {
        toast.success("Ủy quyền thành công");
        await refetch();
      } else {
        toast.error(res?.message || "Ủy quyền thất bại");
      }
    } catch (err: any) {
      console.error("Delegate failed", err);
      toast.error(err?.message || "Ủy quyền thất bại");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-5 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 rounded-t-xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="2"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="3"
                y1="9"
                x2="21"
                y2="9"
                stroke="currentColor"
                strokeWidth="2"
              />
              <line
                x1="8"
                y1="2"
                x2="8"
                y2="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <line
                x1="16"
                y1="2"
                x2="16"
                y2="6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <h2 className="text-lg font-bold text-gray-900">Quản lý Yêu cầu Team</h2>
          </div>
          <div
            className={`inline-flex items-center gap-2 ${badgeBgClass} px-3 py-1 rounded-full text-sm`}
          >
            <span
              className={`w-2 h-2 ${badgeDotClass} rounded-full inline-block`}
            />
            {pendingCount} yêu cầu chưa xử lý
          </div>
        </div>

        {/* Main card */}
        <div className="bg-white">

          <div className="px-6">
            <SearchAndFilter
              filters={{
                dateFrom: query.startDate,
                dateTo: query.endDate,
                requestType: query.type,
                status: query.status,
              }}
              onChange={handleFilterChange}
              onClear={handleClearFilters}
            />
          </div>

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
          ) : requests.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="mt-6 overflow-x-auto px-6">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left px-6 py-3 text-sm text-gray-600">
                          TÊN NHÂN VIÊN
                        </th>
                        <th className="text-left px-6 py-3 text-sm text-gray-600">
                          LOẠI YÊU CẦU
                        </th>
                        <th className="text-left px-6 py-3 text-sm text-gray-600">
                          NGÀY GỬI
                        </th>
                        <th className="text-left px-6 py-3 text-sm text-gray-600">
                          TRẠNG THÁI
                        </th>
                        <th className="text-left px-6 py-3 text-sm text-gray-600">
                          HÀNH ĐỘNG
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {requests.map((r) => (
                        <RequestRow
                          key={r.requestId}
                          request={r}
                          onApprove={handleApprove}
                          onReject={handleReject}
                          onDelegate={doDelegate}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {pageData && (
                <div className="px-6">
                  <Pagination
                    page={query.currentPage || 1}
                    total={pageData.totalElements}
                    limit={PAGE_SIZE}
                    setPage={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ConfirmationApprove
        open={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={doApprove}
      />
      <ConfirmationReject
        open={showRejectModal}
        onClose={() => setShowRejectModal(false)}
        onConfirm={(reason: string) => doReject(reason)}
      />
    </div>
  );
};

export default RequestManagementPage;
