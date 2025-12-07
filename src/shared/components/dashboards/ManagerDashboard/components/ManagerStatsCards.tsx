import React from 'react';
import { Bell, Users, Calendar, Gift } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  subText?: string;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  onClick?: () => void;
  hasAlert?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  subText, 
  icon, 
  bgColor, 
  iconColor, 
  onClick,
  hasAlert = false 
}) => {
  return (
    <div 
      className={`bg-white rounded-lg shadow p-6 ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subText && (
            <p className="text-xs text-gray-500 mt-1">{subText}</p>
          )}
        </div>
        <div className={`${bgColor} p-3 rounded-full relative`}>
          <div className={iconColor}>
            {icon}
          </div>
          {hasAlert && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          )}
        </div>
      </div>
    </div>
  );
};

interface ManagerStatsCardsProps {
  pendingRequests: number;
  teamMembers: number;
  activeTeamMembers: number;
  onLeaveToday: number;
  giftedPointsThisMonth: number;
  budgetRemaining?: number;
  onPendingRequestsClick?: () => void;
  onTeamMembersClick?: () => void;
  onLeaveClick?: () => void;
  onGiftedPointsClick?: () => void;
}

const ManagerStatsCards: React.FC<ManagerStatsCardsProps> = ({
  pendingRequests,
  teamMembers,
  activeTeamMembers,
  onLeaveToday,
  giftedPointsThisMonth,
  budgetRemaining,
  onPendingRequestsClick,
  onTeamMembersClick,
  onLeaveClick,
  onGiftedPointsClick,
}) => {
  const leavePercentage = teamMembers > 0 ? Math.round((onLeaveToday / teamMembers) * 100) : 0;
  const hasHighLeaveRate = leavePercentage > 20;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatsCard
        title="Yêu cầu chờ duyệt"
        value={pendingRequests}
        icon={<Bell className="w-6 h-6" />}
        bgColor={pendingRequests > 5 ? "bg-red-100" : "bg-blue-100"}
        iconColor={pendingRequests > 5 ? "text-red-600" : "text-blue-600"}
        onClick={onPendingRequestsClick}
        hasAlert={pendingRequests > 5}
      />
      
      <StatsCard
        title="Nhân viên trong team"
        value={teamMembers}
        subText={`${activeTeamMembers} đang hoạt động`}
        icon={<Users className="w-6 h-6" />}
        bgColor="bg-green-100"
        iconColor="text-green-600"
        onClick={onTeamMembersClick}
      />
      
      <StatsCard
        title="Nhân viên nghỉ hôm nay"
        value={onLeaveToday}
        subText={`${leavePercentage}% team`}
        icon={<Calendar className="w-6 h-6" />}
        bgColor={hasHighLeaveRate ? "bg-orange-100" : "bg-purple-100"}
        iconColor={hasHighLeaveRate ? "text-orange-600" : "text-purple-600"}
        onClick={onLeaveClick}
        hasAlert={hasHighLeaveRate}
      />
      
      <StatsCard
        title="Điểm đã tặng (tháng này)"
        value={giftedPointsThisMonth}
        subText={budgetRemaining ? `Còn lại: ${budgetRemaining}` : undefined}
        icon={<Gift className="w-6 h-6" />}
        bgColor="bg-yellow-100"
        iconColor="text-yellow-600"
        onClick={onGiftedPointsClick}
      />
    </div>
  );
};

export default ManagerStatsCards;
