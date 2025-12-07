import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, Activity, Gift } from 'lucide-react';

interface QuickActionsProps {
  hasCheckedInToday?: boolean;
  checkInTime?: string;
  onCheckIn?: () => void;
  onCheckOut?: () => void;
  isCheckingIn?: boolean;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  hasCheckedInToday = false,
  checkInTime,
  onCheckIn,
  onCheckOut,
  isCheckingIn = false,
}) => {
  const navigate = useNavigate();

  const handleCheckInOut = () => {
    if (hasCheckedInToday) {
      onCheckOut?.();
    } else {
      onCheckIn?.();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Check-in/Check-out */}
        <button
          onClick={handleCheckInOut}
          disabled={isCheckingIn}
          className={`p-4 border-2 rounded-lg transition duration-200 text-left ${
            hasCheckedInToday
              ? 'border-orange-500 bg-orange-50 hover:bg-orange-100'
              : 'border-green-500 bg-green-50 hover:bg-green-100'
          } ${isCheckingIn ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <div className="flex items-center mb-2">
            <Clock className={`w-5 h-5 mr-2 ${hasCheckedInToday ? 'text-orange-600' : 'text-green-600'}`} />
            <div className="font-medium text-gray-900">
              {hasCheckedInToday ? 'Check-out' : 'Check-in'}
            </div>
          </div>
          <div className="text-sm text-gray-600">
            {hasCheckedInToday
              ? `Đã check-in lúc ${checkInTime}`
              : 'Ghi nhận giờ làm việc'}
          </div>
        </button>

        {/* Create Leave Request */}
        <button
          onClick={() => navigate('/requests/leave/create')}
          className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition duration-200 text-left"
        >
          <div className="flex items-center mb-2">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            <div className="font-medium text-gray-900">Tạo yêu cầu nghỉ phép</div>
          </div>
          <div className="text-sm text-gray-600">Gửi yêu cầu nghỉ phép cho quản lý</div>
        </button>

        {/* Register Activity */}
        <button
          onClick={() => navigate('/activities')}
          className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition duration-200 text-left"
        >
          <div className="flex items-center mb-2">
            <Activity className="w-5 h-5 mr-2 text-blue-600" />
            <div className="font-medium text-gray-900">Đăng ký hoạt động</div>
          </div>
          <div className="text-sm text-gray-600">Tham gia các hoạt động của công ty</div>
        </button>

        {/* Redeem Rewards */}
        <button
          onClick={() => navigate('/rewards/redeem')}
          className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition duration-200 text-left"
        >
          <div className="flex items-center mb-2">
            <Gift className="w-5 h-5 mr-2 text-blue-600" />
            <div className="font-medium text-gray-900">Đổi điểm thưởng</div>
          </div>
          <div className="text-sm text-gray-600">Quy đổi điểm thành phần quà</div>
        </button>
      </div>
    </div>
  );
};

export default QuickActions;
