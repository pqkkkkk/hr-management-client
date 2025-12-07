import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import EmployeeStatsCards from './components/EmployeeStatsCards';
import QuickActions from './components/QuickActions';
import RecentRequests from './components/RecentRequests';
import UpcomingActivities from './components/UpcomingActivities';
import { RequestStatus, RequestType } from 'modules/request/types/request.types';
import { ActivityStatus } from 'shared/types/common.types';
import { toast } from 'react-toastify';

// Mock data interfaces
interface DashboardStats {
  remainingLeaveDays: number;
  totalLeaveDays: number;
  rewardPoints: number;
  pendingRequests: number;
  ongoingActivities: number;
}

interface Request {
  requestId: string;
  type: RequestType;
  status: RequestStatus;
  createdAt: string;
  submittedDate?: string;
}

interface Activity {
  activityId: string;
  name: string;
  status: ActivityStatus;
  startDate: string;
  endDate: string;
  progress?: number;
}

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Stats state
  const [stats, setStats] = useState<DashboardStats>({
    remainingLeaveDays: 12,
    totalLeaveDays: 15,
    rewardPoints: 250,
    pendingRequests: 2,
    ongoingActivities: 3,
  });

  // Check-in/out state
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string>('');
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  // Recent requests state
  const [recentRequests, setRecentRequests] = useState<Request[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  // Upcoming activities state
  const [upcomingActivities, setUpcomingActivities] = useState<Activity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // TODO: Replace with actual API calls when backend is ready
        // Simulate API call with setTimeout
        setTimeout(() => {
          // Mock recent requests
          setRecentRequests([
            {
              requestId: '1',
              type: RequestType.LEAVE,
              status: RequestStatus.PENDING,
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              requestId: '2',
              type: RequestType.TIMESHEET,
              status: RequestStatus.APPROVED,
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              submittedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              requestId: '3',
              type: RequestType.WFH,
              status: RequestStatus.PENDING,
              createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              submittedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              requestId: '4',
              type: RequestType.LEAVE,
              status: RequestStatus.REJECTED,
              createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
              submittedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              requestId: '5',
              type: RequestType.CHECK_IN,
              status: RequestStatus.APPROVED,
              createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              submittedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            },
          ]);
          setIsLoadingRequests(false);

          // Mock upcoming activities
          setUpcomingActivities([
            {
              activityId: '1',
              name: 'Chạy bộ Marathon 2025',
              status: 'ONGOING' as ActivityStatus,
              startDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
              progress: 35,
            },
            {
              activityId: '2',
              name: 'Giải Cầu lông nội bộ',
              status: 'UPCOMING' as ActivityStatus,
              startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
              endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              activityId: '3',
              name: 'Team Building Q4',
              status: 'UPCOMING' as ActivityStatus,
              startDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
              endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              activityId: '4',
              name: 'Yoga buổi sáng',
              status: 'ONGOING' as ActivityStatus,
              startDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
              progress: 60,
            },
            {
              activityId: '5',
              name: 'Học tiếng Anh online',
              status: 'ONGOING' as ActivityStatus,
              startDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
              endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
              progress: 25,
            },
          ]);
          setIsLoadingActivities(false);

          // Mock check-in status
          const now = new Date();
          const isWorkingHours = now.getHours() >= 8 && now.getHours() < 18;
          if (isWorkingHours) {
            const shouldBeCheckedIn = Math.random() > 0.5;
            setHasCheckedInToday(shouldBeCheckedIn);
            if (shouldBeCheckedIn) {
              setCheckInTime('08:30');
            }
          }
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoadingRequests(false);
        setIsLoadingActivities(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleCheckIn = async () => {
    setIsCheckingIn(true);
    try {
      // TODO: Call actual API
      // await checkInApi.checkIn();
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const now = new Date();
      const timeString = now.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      setHasCheckedInToday(true);
      setCheckInTime(timeString);
      setStats(prev => ({ ...prev, pendingRequests: prev.pendingRequests + 1 }));
      
      toast.success(`Check-in thành công lúc ${timeString}!`);
    } catch (error) {
      console.error('Error checking in:', error);
      toast.error('Có lỗi xảy ra khi check-in. Vui lòng thử lại.');
    } finally {
      setIsCheckingIn(false);
    }
  };

  const handleCheckOut = async () => {
    setIsCheckingIn(true);
    try {
      // TODO: Call actual API
      // await checkInApi.checkOut();
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const now = new Date();
      const timeString = now.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      toast.success(`Check-out thành công lúc ${timeString}!`);
    } catch (error) {
      console.error('Error checking out:', error);
      toast.error('Có lỗi xảy ra khi check-out. Vui lòng thử lại.');
    } finally {
      setIsCheckingIn(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Chào mừng trở lại, {user?.fullName}!</p>
      </div>

      {/* Stats Cards */}
      <EmployeeStatsCards
        remainingLeaveDays={stats.remainingLeaveDays}
        totalLeaveDays={stats.totalLeaveDays}
        rewardPoints={stats.rewardPoints}
        pendingRequests={stats.pendingRequests}
        ongoingActivities={stats.ongoingActivities}
        onLeaveCardClick={() => navigate('/requests/create/leave')}
        onRewardCardClick={() => navigate('/rewards')}
        onRequestCardClick={() => navigate('/requests')}
        onActivityCardClick={() => navigate('/activities')}
      />

      {/* Quick Actions */}
      <QuickActions
        hasCheckedInToday={hasCheckedInToday}
        checkInTime={checkInTime}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        isCheckingIn={isCheckingIn}
      />

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentRequests 
          requests={recentRequests} 
          isLoading={isLoadingRequests}
        />
        <UpcomingActivities 
          activities={upcomingActivities} 
          isLoading={isLoadingActivities}
        />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
