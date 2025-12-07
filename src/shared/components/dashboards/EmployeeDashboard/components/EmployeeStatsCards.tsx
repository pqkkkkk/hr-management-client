import React from 'react';
import { Calendar, Star, Clock, Activity } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  onClick?: () => void;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, bgColor, iconColor, onClick }) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow p-6 ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`${bgColor} p-3 rounded-full`}>
          <div className={iconColor}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};

interface EmployeeStatsCardsProps {
  remainingLeaveDays: number;
  totalLeaveDays: number;
  rewardPoints: number;
  pendingRequests: number;
  ongoingActivities: number;
  onLeaveCardClick?: () => void;
  onRewardCardClick?: () => void;
  onRequestCardClick?: () => void;
  onActivityCardClick?: () => void;
}

const EmployeeStatsCards: React.FC<EmployeeStatsCardsProps> = ({
  remainingLeaveDays,
  totalLeaveDays,
  rewardPoints,
  pendingRequests,
  ongoingActivities,
  onLeaveCardClick,
  onRewardCardClick,
  onRequestCardClick,
  onActivityCardClick,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Ngày nghỉ còn lại"
        value={`${remainingLeaveDays} / ${totalLeaveDays}`}
        icon={<Calendar className="w-6 h-6" />}
        bgColor="bg-purple-100"
        iconColor="text-purple-600"
        onClick={onLeaveCardClick}
      />
      
      <StatsCard
        title="Điểm thưởng"
        value={rewardPoints}
        icon={<Star className="w-6 h-6" />}
        bgColor="bg-yellow-100"
        iconColor="text-yellow-600"
        onClick={onRewardCardClick}
      />
      
      <StatsCard
        title="Yêu cầu chờ duyệt"
        value={pendingRequests}
        icon={<Clock className="w-6 h-6" />}
        bgColor="bg-blue-100"
        iconColor="text-blue-600"
        onClick={onRequestCardClick}
      />
      
      <StatsCard
        title="Hoạt động đang tham gia"
        value={ongoingActivities}
        icon={<Activity className="w-6 h-6" />}
        bgColor="bg-green-100"
        iconColor="text-green-600"
        onClick={onActivityCardClick}
      />
    </div>
  );
};

export default EmployeeStatsCards;
