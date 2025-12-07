import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity as ActivityIcon, Calendar } from 'lucide-react';
import { ActivityStatus } from 'shared/types/common.types';

interface Activity {
  activityId: string;
  name: string;
  status: ActivityStatus;
  startDate: string;
  endDate: string;
  progress?: number;
}

interface UpcomingActivitiesProps {
  activities: Activity[];
  isLoading?: boolean;
}

const getStatusBadge = (status: ActivityStatus) => {
  const badges = {
    'UPCOMING': 'bg-blue-100 text-blue-800',
    'ONGOING': 'bg-green-100 text-green-800',
    'COMPLETED': 'bg-gray-100 text-gray-800',
  };
  return badges[status] || 'bg-gray-100 text-gray-800';
};

const getStatusText = (status: ActivityStatus) => {
  const texts = {
    UPCOMING: 'Sắp diễn ra',
    ONGOING: 'Đang diễn ra',
    COMPLETED: 'Đã kết thúc',
  };
  return texts[status] || status;
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });
};

const UpcomingActivities: React.FC<UpcomingActivitiesProps> = ({ activities, isLoading = false }) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động sắp tới</h3>
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động sắp tới</h3>
        <div className="text-center py-8">
          <ActivityIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Chưa đăng ký hoạt động nào</p>
          <button
            onClick={() => navigate('/activities')}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Xem các hoạt động
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Hoạt động sắp tới</h3>
        <button
          onClick={() => navigate('/activities')}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Xem tất cả
        </button>
      </div>
      
      <div className="space-y-3">
        {activities.map((activity) => (
          <div
            key={activity.activityId}
            onClick={() => navigate(`/activities/${activity.activityId}`)}
            className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <ActivityIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.name}
                </p>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${getStatusBadge(activity.status)}`}>
                {getStatusText(activity.status)}
              </span>
            </div>
            
            <div className="flex items-center text-xs text-gray-500 mb-2">
              <Calendar className="w-3 h-3 mr-1" />
              <span>
                {formatDate(activity.startDate)} - {formatDate(activity.endDate)}
              </span>
            </div>

            {activity.status === 'ONGOING' && activity.progress !== undefined && (
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>Tiến độ</span>
                  <span>{activity.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${activity.progress}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingActivities;
