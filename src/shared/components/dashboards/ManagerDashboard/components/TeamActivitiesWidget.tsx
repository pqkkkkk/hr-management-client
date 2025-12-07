import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, Trophy, TrendingUp } from 'lucide-react';
import { ActivityStatus } from 'shared/types/common.types';

interface TopPerformer {
  employeeId: string;
  employeeName: string;
  employeeAvatar?: string;
  score: number;
  rank: number;
}

interface TeamActivity {
  activityId: string;
  name: string;
  status: ActivityStatus;
  participantsCount: number;
  totalTeamMembers: number;
  progress: number;
  topPerformers: TopPerformer[];
}

interface TeamActivitiesWidgetProps {
  activities: TeamActivity[];
  isLoading?: boolean;
}

const getStatusBadge = (status: ActivityStatus) => {
  const badges = {
    UPCOMING: 'bg-blue-100 text-blue-800',
    ONGOING: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-gray-100 text-gray-800',
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

const TeamActivitiesWidget: React.FC<TeamActivitiesWidgetProps> = ({ 
  activities, 
  isLoading = false 
}) => {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Hoạt động team</h3>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Hoạt động team</h3>
        </div>
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">Chưa có hoạt động nào</p>
          <button
            onClick={() => navigate('/activities')}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Tạo hoạt động mới
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Hoạt động team</h3>
        <button
          onClick={() => navigate('/activities/summary')}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          Xem chi tiết
        </button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => {
          const participationRate = (activity.participantsCount / activity.totalTeamMembers) * 100;
          
          return (
            <div
              key={activity.activityId}
              onClick={() => navigate(`/activities/${activity.activityId}`)}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <Activity className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {activity.name}
                    </h4>
                  </div>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Users className="w-3 h-3" />
                    <span>{activity.participantsCount} / {activity.totalTeamMembers} người tham gia</span>
                    <span className="text-gray-300">•</span>
                    <span>{participationRate.toFixed(0)}%</span>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ml-2 flex-shrink-0 ${getStatusBadge(activity.status)}`}>
                  {getStatusText(activity.status)}
                </span>
              </div>

              {/* Progress Bar */}
              {activity.status === 'ONGOING' && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                    <span>Tiến độ</span>
                    <span>{activity.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${activity.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Top Performers */}
              {activity.topPerformers.length > 0 && (
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center space-x-2 mb-2">
                    <Trophy className="w-4 h-4 text-yellow-500" />
                    <span className="text-xs font-medium text-gray-700">Top 3 xuất sắc</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {activity.topPerformers.slice(0, 3).map((performer, index) => (
                      <div key={performer.employeeId} className="flex items-center space-x-2">
                        <div className="relative">
                          {performer.employeeAvatar ? (
                            <img
                              src={performer.employeeAvatar}
                              alt={performer.employeeName}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-xs font-medium text-blue-600">
                                {performer.employeeName.charAt(0)}
                              </span>
                            </div>
                          )}
                          {index === 0 && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center border-2 border-white">
                              <span className="text-xs">🏆</span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-medium text-gray-900 truncate max-w-[80px]">
                            {performer.employeeName}
                          </span>
                          <div className="flex items-center space-x-1">
                            <TrendingUp className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-gray-500">{performer.score}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeamActivitiesWidget;
