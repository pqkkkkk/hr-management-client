import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, FileText, Calendar } from 'lucide-react';
import { RequestStatus, RequestType, Request } from 'modules/request/types/request.types';

interface RecentRequestsProps {
  requests: Request[];
  isLoading?: boolean;
}

const getStatusBadge = (status: RequestStatus) => {
  const badges = {
    [RequestStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [RequestStatus.APPROVED]: 'bg-green-100 text-green-800',
    [RequestStatus.REJECTED]: 'bg-red-100 text-red-800',
    [RequestStatus.CANCELLED]: 'bg-gray-100 text-gray-800',
    [RequestStatus.PROCESSING]: 'bg-blue-100 text-blue-800',
  };
  return badges[status] || 'bg-gray-100 text-gray-800';
};

const getStatusText = (status: RequestStatus) => {
  const texts = {
    [RequestStatus.PENDING]: 'Chờ duyệt',
    [RequestStatus.APPROVED]: 'Đã duyệt',
    [RequestStatus.REJECTED]: 'Từ chối',
    [RequestStatus.CANCELLED]: 'Đã hủy',
    [RequestStatus.PROCESSING]: 'Đang xử lý',
  };
  return texts[status] || status;
};

const getRequestTypeText = (type: RequestType) => {
  const texts = {
    [RequestType.LEAVE]: 'Nghỉ phép',
    [RequestType.CHECK_IN]: 'Check-in',
    [RequestType.CHECK_OUT]: 'Check-out',
    [RequestType.TIMESHEET]: 'Cập nhật chấm công',
    [RequestType.WFH]: 'Làm việc tại nhà',
  };
  return texts[type] || type;
};

const getRequestIcon = (type: RequestType) => {
  const icons = {
    [RequestType.LEAVE]: <Calendar className="w-4 h-4" />,
    [RequestType.CHECK_IN]: <Clock className="w-4 h-4" />,
    [RequestType.CHECK_OUT]: <Clock className="w-4 h-4" />,
    [RequestType.TIMESHEET]: <FileText className="w-4 h-4" />,
    [RequestType.WFH]: <FileText className="w-4 h-4" />,
  };
  return icons[type] || <FileText className="w-4 h-4" />;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
};

const RecentRequests: React.FC<RecentRequestsProps> = ({ requests, isLoading = false }) => {
  const navigate = useNavigate();
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Yêu cầu gần đây</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Yêu cầu gần đây</h3>
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Chưa có yêu cầu nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Yêu cầu gần đây</h3>
        <button
          onClick={() => navigate('/requests')}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Xem tất cả
        </button>
      </div>
      
      <div className="space-y-3">
        {requests.map((request) => (
          <div
            key={request.requestId}
            onClick={() => navigate(`/requests/${request.requestId}`)}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-3 flex-1">
              <div className="text-gray-500">
                {getRequestIcon(request.requestType)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {getRequestTypeText(request.requestType)}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(request.createdAt)}
                </p>
              </div>
            </div>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(request.status)}`}>
              {getStatusText(request.status)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentRequests;
