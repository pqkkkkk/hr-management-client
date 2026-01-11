import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import { useApi } from 'contexts/ApiContext';
import EmployeeStatsCards from './components/EmployeeStatsCards';
import QuickActions from './components/QuickActions';
import RecentRequests from './components/RecentRequests';
import UpcomingActivities from './components/UpcomingActivities';
import { RequestStatus, RequestType } from 'modules/request/types/request.types';
import { toast } from 'react-toastify';
import { Request } from 'modules/request/types/request.types';
import { Activity, ActivityStatus } from 'modules/activity/types/activity.types';
import { RewardProgramDetail } from 'modules/reward/types/reward.types';

// Dashboard stats interface
interface DashboardStats {
  remainingLeaveDays: number;
  totalLeaveDays: number;
  rewardPoints: number;
  pendingRequests: number;
  registeredActivities: number;
}

// Loading states interface
interface LoadingStates {
  stats: boolean;
  requests: boolean;
  activities: boolean;
}

// Error states interface
interface ErrorStates {
  stats: string | null;
  requests: string | null;
  activities: string | null;
}

const EmployeeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { requestApi, rewardApi, activityApi } = useApi();
  const navigate = useNavigate();

  // Stats state
  const [stats, setStats] = useState<DashboardStats>({
    remainingLeaveDays: user?.remainingAnnualLeaveDays || 0,
    totalLeaveDays: user?.maxAnnualLeaveDays || 0,
    rewardPoints: 0,
    pendingRequests: 0,
    registeredActivities: 0,
  });

  // Loading states
  const [loading, setLoading] = useState<LoadingStates>({
    stats: true,
    requests: true,
    activities: true,
  });

  // Error states
  const [errors, setErrors] = useState<ErrorStates>({
    stats: null,
    requests: null,
    activities: null,
  });

  // Check-in/out state
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string>('');
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  // Recent requests state
  const [recentRequests, setRecentRequests] = useState<Request[]>([]);

  // Upcoming activities state
  const [upcomingActivities, setUpcomingActivities] = useState<Activity[]>([]);
  const [registeredActivities, setRegisteredActivities] = useState<Activity[]>([]);

  const [activeRewardProgram, setActiveRewardProgram] = useState<RewardProgramDetail | null>(null);

  // Fetch reward points
  const fetchRewardPoints = useCallback(async () => {
    if (!user?.userId) return 0;

    try {
      // First get active reward program
      const programResponse = await rewardApi.getActiveRewardProgram();
      setActiveRewardProgram(programResponse.data);

      if (programResponse.success && programResponse.data?.rewardProgramId) {
        // Then get wallet for the user
        const walletResponse = await rewardApi.getWallet(
          user.userId,
          programResponse.data.rewardProgramId
        );
        if (walletResponse.success && walletResponse.data) {
          return walletResponse.data.personalPoint || 0;
        }
      }
      return 0;
    } catch (error) {
      console.error('Error fetching reward points:', error);
      return 0;
    }
  }, [user?.userId, rewardApi]);

  // Fetch reward points and remaining leave days
  useEffect(() => {
    const fetchInitialStats = async () => {
      if (!user?.userId) return;

      setLoading(prev => ({ ...prev, stats: true }));
      setErrors(prev => ({ ...prev, stats: null }));

      try {
        const rewardPoints = await fetchRewardPoints();

        setStats(prev => ({
          ...prev,
          rewardPoints,
        }));
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setErrors(prev => ({ ...prev, stats: 'Không thể tải thông tin thống kê' }));
      } finally {
        setLoading(prev => ({ ...prev, stats: false }));
      }
    };

    fetchInitialStats();
  }, [user, fetchRewardPoints]);

  // Fetch recent requests (5 items) and pending count
  useEffect(() => {
    const fetchRecentRequests = async () => {
      if (!user?.userId) return;

      setLoading(prev => ({ ...prev, requests: true }));
      setErrors(prev => ({ ...prev, requests: null }));

      try {
        // Fetch pending requests (for count) and recent requests in parallel
        const [pendingResponse, recentResponse] = await Promise.all([
          requestApi.getMyRequests({
            employeeId: user.userId,
            status: RequestStatus.PENDING,
            pageSize: 5,
            currentPage: 1,
          }),
          requestApi.getMyRequests({
            employeeId: user.userId,
            pageSize: 5,
            currentPage: 1,
            sortBy: 'createdAt',
            sortDirection: 'DESC',
          }),
        ]);

        // Update pending requests count from the response
        if (pendingResponse.success && pendingResponse.data) {
          setStats(prev => ({
            ...prev,
            pendingRequests: pendingResponse.data?.totalElements || 0,
          }));
        }

        // Update recent requests list
        if (recentResponse.success && recentResponse.data?.content) {
          setRecentRequests(recentResponse.data.content);
        } else {
          setRecentRequests([]);
        }
      } catch (error) {
        console.error('Error fetching recent requests:', error);
        setErrors(prev => ({ ...prev, requests: 'Không thể tải danh sách yêu cầu' }));
        setRecentRequests([]);
      } finally {
        setLoading(prev => ({ ...prev, requests: false }));
      }
    };

    fetchRecentRequests();
  }, [user?.userId, requestApi]);

  // Fetch upcoming activities and registered activities
  useEffect(() => {
    const fetchUpcomingActivities = async () => {
      if (!user?.userId) return;

      setLoading(prev => ({ ...prev, activities: true }));
      setErrors(prev => ({ ...prev, activities: null }));

      try {
        const [ongoingActivityResponse, registeredActivityResponse] = await Promise.all([
          activityApi.getActivities(user.userId, {
            status: ActivityStatus.IN_PROGRESS,
            pageSize: 5,
            pageNumber: 1,
          }),
          activityApi.getMyActivities(user.userId, {
            pageSize: 5,
            pageNumber: 1,
          }),
        ]);

        if (ongoingActivityResponse.success && ongoingActivityResponse.data) {
          // Update ongoing activities count from the response
          setStats(prev => ({
            ...prev,
            ongoingActivities: ongoingActivityResponse.data?.totalElements || 0,
            registeredActivities: registeredActivityResponse.data?.totalElements || 0,
          }));
          setUpcomingActivities(ongoingActivityResponse.data.content || []);
        } else {
          setUpcomingActivities([]);
        }

        if (registeredActivityResponse.success && registeredActivityResponse.data) {
          setRegisteredActivities(registeredActivityResponse.data.content || []);
        } else {
          setRegisteredActivities([]);
        }
      } catch (error) {
        console.error('Error fetching upcoming activities:', error);
        setErrors(prev => ({ ...prev, activities: 'Không thể tải danh sách hoạt động' }));
        setUpcomingActivities([]);
      } finally {
        setLoading(prev => ({ ...prev, activities: false }));
      }
    };

    fetchUpcomingActivities();
  }, [user?.userId, activityApi]);

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
        registeredActivities={stats.registeredActivities}
        onLeaveCardClick={() => navigate('/requests/create')}
        onRewardCardClick={() => navigate(`/rewards/programs/${activeRewardProgram?.rewardProgramId}`)}
        onRequestCardClick={() => navigate('/requests/my-requests')}
        onActivityCardClick={() => navigate('/activities/me')}
      />

      {/* Quick Actions */}
      <QuickActions
        hasCheckedInToday={hasCheckedInToday}
        checkInTime={checkInTime}
        onCheckIn={handleCheckIn}
        onCheckOut={handleCheckOut}
        isCheckingIn={isCheckingIn}
        activeRewardProgramId={activeRewardProgram?.rewardProgramId}
      />

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentRequests
          requests={recentRequests}
          isLoading={loading.requests}
        />
        <UpcomingActivities
          activities={upcomingActivities}
          isLoading={loading.activities}
        />
      </div>
    </div>
  );
};

export default EmployeeDashboard;
