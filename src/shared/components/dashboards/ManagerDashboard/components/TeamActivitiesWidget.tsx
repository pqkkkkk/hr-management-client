import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity as ActivityIcon, Users } from 'lucide-react';
import { Activity, ActivityStatus } from 'modules/activity/types/activity.types';

interface TeamActivitiesWidgetProps {
  activities: Activity[];
  isLoading?: boolean;
}

const getStatusBadge = (status: ActivityStatus) => {
  const badges: Record<ActivityStatus, string> = {
    [ActivityStatus.DRAFT]: 'bg-gray-100 text-gray-800',
    [ActivityStatus.OPEN]: 'bg-blue-100 text-blue-800',
    [ActivityStatus.IN_PROGRESS]: 'bg-green-100 text-green-800',
    [ActivityStatus.CLOSED]: 'bg-orange-100 text-orange-800',
    [ActivityStatus.COMPLETED]: 'bg-gray-100 text-gray-800',
  };
  return badges[status] || 'bg-gray-100 text-gray-800';
};

const getStatusText = (status: ActivityStatus) => {
  const texts: Record<ActivityStatus, string> = {
    [ActivityStatus.DRAFT]: 'Nháp',
    [ActivityStatus.OPEN]: 'Sắp diễn ra',
    [ActivityStatus.IN_PROGRESS]: 'Đang diễn ra',
    [ActivityStatus.CLOSED]: 'Đã đóng',
    [ActivityStatus.COMPLETED]: 'Đã kết thúc',
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

const TeamActivitiesWidget: React.FC<TeamActivitiesWidgetProps> = ({
  activities,
  isLoading = false
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động đang diễn ra</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Hoạt động đang diễn ra</h3>
        </div>
        <div className="text-center py-8">
          <ActivityIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Chưa có hoạt động nào diễn ra</p>
          <button
            onClick={() => navigate('/activities/overview')}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Xem tất cả hoạt động
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Hoạt động đang diễn ra</h3>
        <button
          onClick={() => navigate('/activities/overview')}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Xem tổng kết hoạt động
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((activity) => (
          <div
            key={activity.activityId}
            onClick={() => navigate(`/activities/${activity.activityId}`)}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <ActivityIcon className="w-4 h-4 text-gray-500 flex-shrink-0" />
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {activity.name}
                  </h4>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Users className="w-3 h-3" />
                  <span>{activity.participantsCount || 0} người tham gia</span>
                </div>
              </div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${getStatusBadge(activity.status)}`}>
                {getStatusText(activity.status)}
              </span>
            </div>

            {/* Date range */}
            <div className="text-xs text-gray-500">
              {formatDate(activity.startDate)} - {formatDate(activity.endDate)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TeamActivitiesWidget;
