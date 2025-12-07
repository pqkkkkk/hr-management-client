import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, User, CheckCircle, XCircle, FileText } from 'lucide-react';
import { RequestStatus, RequestType } from 'modules/request/types/request.types';

interface PendingRequest {
  requestId: string;
  employeeName: string;
  employeeAvatar?: string;
  type: RequestType;
  status: RequestStatus;
  submittedDate: string;
  createdAt: string;
}

interface PendingRequestsTableProps {
  requests: PendingRequest[];
  isLoading?: boolean;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
  isApproving?: boolean;
  isRejecting?: boolean;
}

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

const getRequestTypeColor = (type: RequestType) => {
  const colors = {
    [RequestType.LEAVE]: 'text-purple-600 bg-purple-100',
    [RequestType.CHECK_IN]: 'text-green-600 bg-green-100',
    [RequestType.CHECK_OUT]: 'text-orange-600 bg-orange-100',
    [RequestType.TIMESHEET]: 'text-blue-600 bg-blue-100',
    [RequestType.WFH]: 'text-indigo-600 bg-indigo-100',
  };
  return colors[type] || 'text-gray-600 bg-gray-100';
};

const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} ngày trước`;
  } else if (diffHours > 0) {
    return `${diffHours} giờ trước`;
  } else {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes} phút trước`;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
};

const PendingRequestsTable: React.FC<PendingRequestsTableProps> = ({ 
  requests, 
  isLoading = false,
  onApprove,
  onReject,
  isApproving = false,
  isRejecting = false,
}) => {
  const navigate = useNavigate();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (e: React.MouseEvent, requestId: string) => {
    e.stopPropagation();
    setProcessingId(requestId);
    await onApprove?.(requestId);
    setProcessingId(null);
  };

  const handleReject = async (e: React.MouseEvent, requestId: string) => {
    e.stopPropagation();
    setProcessingId(requestId);
    await onReject?.(requestId);
    setProcessingId(null);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Yêu cầu chờ phê duyệt</h3>
        </div>
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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Yêu cầu chờ phê duyệt</h3>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            0 yêu cầu
          </span>
        </div>
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="text-gray-500">Không có yêu cầu chờ duyệt</p>
          <p className="text-sm text-gray-400 mt-1">Tất cả yêu cầu đã được xử lý</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Yêu cầu chờ phê duyệt</h3>
        <div className="flex items-center space-x-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            {requests.length} yêu cầu
          </span>
          <button
            onClick={() => navigate('/requests/manage')}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Xem tất cả
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nhân viên
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loại yêu cầu
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ngày gửi
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời gian chờ
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <tr 
                key={request.requestId}
                onClick={() => navigate(`/requests/${request.requestId}`)}
                className="hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-8 w-8">
                      {request.employeeAvatar ? (
                        <img 
                          className="h-8 w-8 rounded-full" 
                          src={request.employeeAvatar} 
                          alt={request.employeeName} 
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {request.employeeName}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRequestTypeColor(request.type)}`}>
                    {getRequestTypeText(request.type)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(request.submittedDate)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {getTimeAgo(request.submittedDate)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={(e) => handleApprove(e, request.requestId)}
                      disabled={isApproving || isRejecting || processingId === request.requestId}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Duyệt
                    </button>
                    <button
                      onClick={(e) => handleReject(e, request.requestId)}
                      disabled={isApproving || isRejecting || processingId === request.requestId}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Từ chối
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PendingRequestsTable;
