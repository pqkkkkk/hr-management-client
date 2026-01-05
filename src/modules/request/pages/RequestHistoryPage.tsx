import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from 'shared/utils/date-utils';
import { useApi } from 'contexts/ApiContext';
import { useQuery } from 'shared/hooks/use-query';
import { useFetchList } from 'shared/hooks/use-fetch-list';
import EmptyState from '../components/EmptyState';
import ErrorState from '../components/ErrorState';
import Pagination from '../components/Pagination';
import {
  Request,
  RequestStatus,
  RequestType,
  requestStatusOptions,
  requestTypeOptions,
  RequestFilter,
} from '../types/request.types';
import { useAuth } from 'contexts/AuthContext';

// ==================== Types ====================
export type Filters = {
  dateFrom?: string;
  dateTo?: string;
  requestType?: RequestType | "";
  status?: RequestStatus | "";
};

// ==================== RequestStatusBadge Component ====================
interface RequestStatusBadgeProps {
  status: RequestStatus;
}

const RequestStatusBadge: React.FC<RequestStatusBadgeProps> = ({ status }) => {
  const getStatusBadgeClass = (status: RequestStatus): string => {
    switch (status) {
      case RequestStatus.APPROVED:
        return 'bg-emerald-50 text-green-800';
      case RequestStatus.PENDING:
        return 'bg-amber-50 text-amber-700';
      case RequestStatus.REJECTED:
        return 'bg-red-50 text-red-700';
      case RequestStatus.CANCELLED:
        return 'bg-gray-100 text-gray-700';
      case RequestStatus.PROCESSING:
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: RequestStatus): string => {
    const option = requestStatusOptions.find(opt => opt.value === status);
    return option?.label || status;
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusBadgeClass(status)}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
      {getStatusLabel(status)}
    </span>
  );
};

// ==================== FilterSection Component ====================
const FilterSection: React.FC<{
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
            className="h-9 px-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-400">—</span>
          <input
            type="date"
            value={filters.dateTo ?? ""}
            onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
            className="h-9 px-3 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="h-9 px-4 pr-10 bg-gray-100 rounded-lg text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="h-9 px-4 pr-10 bg-gray-100 rounded-lg text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
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

// ==================== RequestHistoryTable Component ====================
interface RequestHistoryTableProps {
  requests: Request[];
  onRowClick?: (requestId: string, requestType: RequestType) => void;
}

const RequestHistoryTable: React.FC<RequestHistoryTableProps> = ({ requests, onRowClick }) => {
  const getRequestTypeLabel = (type: RequestType): string => {
    const option = requestTypeOptions.find(opt => opt.value === type);
    return option?.label || type;
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Mã yêu cầu
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Loại yêu cầu
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Tiêu đề
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày tạo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày cập nhật
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr
              key={request.requestId}
              className="border-t border-gray-200 hover:bg-gray-50 cursor-pointer"
              onClick={() => onRowClick?.(request.requestId, request.requestType)}
            >
              <td className="px-6 py-4">
                <span className="text-sm font-medium text-gray-900">
                  {request.requestId}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-900">
                  {getRequestTypeLabel(request.requestType)}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-900">
                  {request.title}
                </span>
              </td>
              <td className="px-6 py-4">
                <RequestStatusBadge status={request.status} />
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-600">
                  {formatDate(request.createdAt)}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className="text-sm text-gray-600">
                  {formatDate(request.updatedAt)}
                </span>
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRowClick?.(request.requestId, request.requestType);
                  }}
                  className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-700 rounded hover:bg-gray-100"
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
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ==================== Main Component ====================
const RequestHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { requestApi } = useApi();
  const { user } = useAuth();
  const PAGE_SIZE = 5;

  // Sử dụng useQuery cho filter state
  const { query, updateQuery, resetQuery } = useQuery<RequestFilter>({
    currentPage: 1,
    pageSize: PAGE_SIZE,
    employeeId: user?.userId,
  });

  // Sử dụng useFetchList để fetch data với server-side filtering
  const fetchMyRequests = useMemo(
    () => requestApi.getMyRequests.bind(requestApi),
    [requestApi]
  );

  const {
    data: requests,
    page: pageData,
    isFetching: loading,
    error,
  } = useFetchList<RequestFilter, Request>(fetchMyRequests, query);

  // Handler cho filter changes
  const handleFilterChange = useCallback(
    (newFilters: Filters) => {
      updateQuery({
        currentPage: 1, // Reset về trang 1 khi filter thay đổi
        type: newFilters.requestType ? (newFilters.requestType as RequestType) : undefined,
        status: newFilters.status ? (newFilters.status as RequestStatus) : undefined,
        startDate: newFilters.dateFrom || undefined,
        endDate: newFilters.dateTo || undefined,
      });
    },
    [updateQuery]
  );

  // Handler cho page changes
  const handlePageChange = useCallback(
    (newPage: number) => {
      updateQuery({ currentPage: newPage });
    },
    [updateQuery]
  );

  // Handler cho clear filters
  const handleClearFilters = useCallback(() => {
    resetQuery();
  }, [resetQuery]);

  // Navigate to detail page
  const handleRowClick = useCallback(
    (requestId: string, requestType: RequestType) => {
      navigate(`/requests/${requestId}?requestType=${requestType}`);
    },
    [navigate]
  );

  return (
    <div className="min-h-screen bg-gray-50 py-5 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 rounded-t-xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
              <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="2" />
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h2 className="text-lg font-bold text-gray-900">Quản lý Yêu cầu</h2>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white">
          {/* Title and Create Button */}
          <div className="px-6 py-6 flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-gray-900">Lịch sử Yêu cầu</h1>
            <button
              onClick={() => navigate('/requests/create')}
              className="h-10 px-4 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 4V16M4 10H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Gửi Yêu cầu Mới
            </button>
          </div>

          {/* Filters */}
          <FilterSection
            filters={{
              dateFrom: query.startDate,
              dateTo: query.endDate,
              requestType: query.type,
              status: query.status,
            }}
            onChange={handleFilterChange}
            onClear={handleClearFilters}
          />

          {/* Table or States */}
          {loading ? (
            <div className="px-6 py-20 text-center">
              <div className="flex justify-center">
                <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            </div>
          ) : error ? (
            <ErrorState />
          ) : requests.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <RequestHistoryTable
                requests={requests}
                onRowClick={handleRowClick}
              />
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
    </div>
  );
};

export default RequestHistoryPage;
