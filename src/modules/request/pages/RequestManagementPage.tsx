import React, { useEffect, useMemo, useState } from "react";
import { formatDate } from "shared/utils/date-utils";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import DelegationForm, {
  CreateDelegationRequest,
} from "../components/DelegationForm";
import Pagination from "../components/Pagination";
import ConfirmationApprove from "../components/ConfirmationApprove";
import ConfirmationReject from "../components/ConfirmationReject";
import { mockRequestApi } from "services/api/request.api";
import {
  Request,
  RequestStatus,
  RequestType,
  requestTypeOptions,
  requestStatusOptions,
} from "../types/request.types";
import EmptyState from "../components/EmptyState";
import ErrorState from "../components/ErrorState";

// --- Component: SearchAndFilter ---
export type Filters = {
  name?: string;
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
        <label className="text-xl text-gray-600 mb-1">Tìm nhân viên</label>
        <div className="relative">
          <input
            value={filters.name ?? ""}
            onChange={(e) => onChange({ ...filters, name: e.target.value })}
            placeholder="Tìm kiếm theo tên"
            className="h-9 px-4 pl-10 bg-gray-100 rounded-lg text-sm w-48"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 21l-4.35-4.35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="11"
                cy="11"
                r="6"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </div>
      </div>
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
              name: "",
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
        {request.employeeName}
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
  const [allRequests, setAllRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    name: "",
    dateFrom: "",
    dateTo: "",
    requestType: "",
    status: "",
  });
  const [page, setPage] = useState(1);
  const pageSize = 6; // rows per page to match design

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(false);
      try {
        const res = await mockRequestApi.getRequests({
          page: 1,
          pageSize: 200,
        });
        if (res.success) {
          setAllRequests(res.data.content);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Failed to fetch requests:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const filtered = useMemo(() => {
    return allRequests.filter((r) => {
      if (
        filters.name &&
        !(r.employeeName ?? "")
          .toLowerCase()
          .includes(filters.name!.toLowerCase())
      )
        return false;
      // date range filter (inclusive)
      const d = (r.createdAt || "").slice(0, 10);
      if (filters.dateFrom) {
        if (d < filters.dateFrom) return false;
      }
      if (filters.dateTo) {
        if (d > filters.dateTo) return false;
      }
      if (filters.requestType) {
        if (r.requestType !== (filters.requestType as any)) return false;
      }
      if (filters.status) {
        if (r.status !== (filters.status as any)) return false;
      }
      return true;
    });
  }, [allRequests, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  const pageItems = useMemo(
    () => filtered.slice((page - 1) * pageSize, page * pageSize),
    [filtered, page]
  );

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

  const pendingCount = allRequests.filter(
    (r) => r.status === RequestStatus.PENDING
  ).length;

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
    if (!selectedRequestId) return;
    try {
      const res = await mockRequestApi.approveRequest(selectedRequestId);
      if (res && res.success) {
        setAllRequests((prev) =>
          prev.map((r) => (r.requestId === selectedRequestId ? res.data : r))
        );
        window.dispatchEvent(
          new CustomEvent("request-updated", { detail: res.data })
        );
      }
    } catch (err) {
      console.error("Approve failed", err);
    } finally {
      setShowApproveModal(false);
      setSelectedRequestId(null);
    }
  };

  const doReject = async (reason: string) => {
    if (!selectedRequestId) return;
    try {
      const res = await mockRequestApi.rejectRequest(
        selectedRequestId,
        reason || ""
      );
      if (res && res.success) {
        setAllRequests((prev) =>
          prev.map((r) => (r.requestId === selectedRequestId ? res.data : r))
        );
        window.dispatchEvent(
          new CustomEvent("request-updated", { detail: res.data })
        );
      }
    } catch (err) {
      console.error("Reject failed", err);
    } finally {
      setShowRejectModal(false);
      setSelectedRequestId(null);
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
            <h2 className="text-lg font-bold text-gray-900">Quản lý Yêu cầu</h2>
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
          <div className="px-6 py-6 flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-gray-900">
              Danh sách Yêu cầu
            </h1>
          </div>

          <div className="px-6">
            <SearchAndFilter
              filters={filters}
              onChange={(f) => {
                setFilters(f);
                setPage(1);
              }}
              onClear={() => {
                setFilters({
                  name: "",
                  dateFrom: "",
                  dateTo: "",
                  requestType: "",
                  status: "",
                });
                setPage(1);
              }}
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
          ) : filtered.length === 0 ? (
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
                      {pageItems.map((r) => (
                        <RequestRow
                          key={r.requestId}
                          request={r}
                          onApprove={handleApprove}
                          onReject={handleReject}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="px-6">
                <Pagination />
              </div>
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
