import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Request, 
  RequestStatus,
  RequestType,
  requestStatusOptions,
  requestTypeOptions,
} from '../types/request.types';
import { mockRequestApi } from 'services/api/request.api';

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
const FilterSection: React.FC = () => {
  return (
    <div className="px-6 py-3 border-t border-b border-gray-200 flex items-center gap-3 flex-wrap">
      <div className="relative">
        <select
          className="h-9 px-4 pr-10 bg-gray-100 rounded-lg text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Loại yêu cầu</option>
          {requestTypeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path d="M4 7L8 11L12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <div className="relative">
        <select
          className="h-9 px-4 pr-10 bg-gray-100 rounded-lg text-sm font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Trạng thái</option>
          {requestStatusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
            <path d="M4 7L8 11L12 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      <button className="h-9 px-3 flex items-center gap-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg">
        <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
          <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Xóa bộ lọc
      </button>
    </div>
  );
};

// ==================== RequestHistoryTable Component ====================
interface RequestHistoryTableProps {
  requests: Request[];
}

const RequestHistoryTable: React.FC<RequestHistoryTableProps> = ({ requests }) => {
  const getRequestTypeLabel = (type: RequestType): string => {
    const option = requestTypeOptions.find(opt => opt.value === type);
    return option?.label || type;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
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
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.requestId} className="border-t border-gray-200 hover:bg-gray-50">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ==================== EmptyState Component ====================
const EmptyState: React.FC = () => {
  return (
    <div className="px-6 py-20">
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <rect x="6" y="8" width="20" height="20" rx="2" stroke="currentColor" strokeWidth="2"/>
            <line x1="6" y1="13" x2="26" y2="13" stroke="currentColor" strokeWidth="2"/>
            <line x1="11" y1="6" x2="11" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <line x1="21" y1="6" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Chưa có yêu cầu nào
        </h3>
        <p className="text-sm text-gray-500">
          Bạn chưa tạo yêu cầu nào. Hãy bắt đầu tạo yêu cầu mới.
        </p>
      </div>
    </div>
  );
};

// ==================== ErrorState Component ====================
const ErrorState: React.FC = () => {
  return (
    <div className="px-6 py-20">
      <div className="flex flex-col items-center justify-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
            <circle cx="16" cy="16" r="12" stroke="#DC2626" strokeWidth="2"/>
            <line x1="16" y1="10" x2="16" y2="18" stroke="#DC2626" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="16" cy="22" r="1" fill="#DC2626"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Không thể tải dữ liệu
        </h3>
        <p className="text-sm text-gray-500">
          Đã xảy ra lỗi khi tải danh sách yêu cầu. Vui lòng thử lại sau.
        </p>
      </div>
    </div>
  );
};

// ==================== PaginationSection Component ====================
const PaginationSection: React.FC = () => {
  return (
    <div className="px-4 py-4 border-t border-gray-200 rounded-b-xl flex items-center justify-center">
      <div className="flex items-center gap-1">
        <button className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
            <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-md text-sm font-normal bg-blue-600 text-white font-bold">
          1
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-md text-sm font-normal text-gray-900 hover:bg-gray-100">
          2
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-md text-sm font-normal text-gray-900 hover:bg-gray-100">
          3
        </button>
        <span className="w-9 h-9 flex items-center justify-center text-sm text-gray-900">
          ...
        </span>
        <button className="w-9 h-9 flex items-center justify-center rounded-md text-sm font-normal text-gray-900 hover:bg-gray-100">
          10
        </button>
        <button className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
          <svg width="20" height="24" viewBox="0 0 20 24" fill="none">
            <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

// ==================== Main Component ====================
const RequestHistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoading(true);
      setError(false);
      try {
        const response = await mockRequestApi.getRequests({
          page: 1,
          pageSize: 100,
        });
        if (response.success) {
          setRequests(response.data.content);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Failed to fetch requests:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-5 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 rounded-t-xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
              <line x1="3" y1="9" x2="21" y2="9" stroke="currentColor" strokeWidth="2"/>
              <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
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
                <path d="M10 4V16M4 10H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Gửi Yêu cầu Mới
            </button>
          </div>

          {/* Filters */}
          <FilterSection />

          {/* Table or States */}
          {loading ? (
            <div className="px-6 py-20 text-center">
              <div className="flex justify-center">
                <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
              </div>
            </div>
          ) : error ? (
            <ErrorState />
          ) : requests.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <RequestHistoryTable requests={requests} />
              <PaginationSection />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestHistoryPage;
