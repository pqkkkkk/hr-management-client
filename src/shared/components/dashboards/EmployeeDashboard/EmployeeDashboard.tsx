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

// Dashboard stats interface
interface DashboardStats {
  remainingLeaveDays: number;
  totalLeaveDays: number;
  rewardPoints: number;
  pendingRequests: number;
  ongoingActivities: number;
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
    remainingLeaveDays: 0,
    totalLeaveDays: 15,
    rewardPoints: 0,
    pendingRequests: 0,
    ongoingActivities: 0,
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

  // Fetch reward points
  const fetchRewardPoints = useCallback(async () => {
    if (!user?.userId) return 0;
    
    try {
      // First get active reward program
      const programResponse = await rewardApi.getActiveRewardProgram();

      console.log('Active Reward Program Response:', programResponse);
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

  // Fetch pending requests count
  const fetchPendingRequestsCount = useCallback(async () => {
    if (!user?.userId) return 0;
    
    try {
      const response = await requestApi.getMyRequests({
        employeeId: user.userId,
        status: RequestStatus.PENDING,
        pageSize: 1,
        currentPage: 1,
      });
      if (response.success && response.data) {
        return response.data.totalElements || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error fetching pending requests:', error);
      return 0;
    }
  }, [user?.userId, requestApi]);

  // Fetch ongoing activities count
  const fetchOngoingActivitiesCount = useCallback(async () => {
    if (!user?.userId) return 0;
    
    try {
      const response = await activityApi.getMyActivities(user.userId, {
        status: ActivityStatus.IN_PROGRESS,
        pageSize: 1,
        pageNumber: 1,
      });
      
      if (response.success && response.data) {
        return response.data.totalElements || 0;
      }
      return 0;
    } catch (error) {
      console.error('Error fetching ongoing activities:', error);
      return 0;
    }
  }, [user?.userId, activityApi]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.userId) return;

      setLoading(prev => ({ ...prev, stats: true }));
      setErrors(prev => ({ ...prev, stats: null }));

      try {
        // Fetch all stats in parallel
        const [rewardPoints, pendingRequests, ongoingActivities] = await Promise.all([
          fetchRewardPoints(),
          fetchPendingRequestsCount(),
          fetchOngoingActivitiesCount(),
        ]);

        setStats({
          remainingLeaveDays: user.remainingAnnualLeaveDays || 0,
          totalLeaveDays: 15, // This could also come from user context or API
          rewardPoints,
          pendingRequests,
          ongoingActivities,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setErrors(prev => ({ ...prev, stats: 'Không thể tải thông tin thống kê' }));
      } finally {
        setLoading(prev => ({ ...prev, stats: false }));
      }
    };

    fetchStats();
  }, [user, fetchRewardPoints, fetchPendingRequestsCount, fetchOngoingActivitiesCount]);

  // Fetch recent requests (5 items)
  useEffect(() => {
    const fetchRecentRequests = async () => {
      if (!user?.userId) return;

      setLoading(prev => ({ ...prev, requests: true }));
      setErrors(prev => ({ ...prev, requests: null }));

      try {
        const response = await requestApi.getMyRequests({
          employeeId: user.userId,
          pageSize: 5,
          currentPage: 1,
          sortBy: 'createdAt',
          sortDirection: 'DESC',
        });
        if (response.success && response.data?.content) {
          console.log('Recent Requests Response:', response);
          setRecentRequests(response.data.content);
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

  // Fetch upcoming activities (5 items)
  useEffect(() => {
    const fetchUpcomingActivities = async () => {
      if (!user?.userId) return;

      setLoading(prev => ({ ...prev, activities: true }));
      setErrors(prev => ({ ...prev, activities: null }));

      try {
        // Fetch both ongoing and upcoming activities
        const [ongoingResponse, upcomingResponse] = await Promise.all([
          activityApi.getMyActivities(user.userId, {
            status: ActivityStatus.IN_PROGRESS,
            pageSize: 5,
            pageNumber: 1,
          }),
          activityApi.getMyActivities(user.userId, {
            status: ActivityStatus.OPEN,
            pageSize: 5,
            pageNumber: 1,
          }),
        ]);

        const ongoing = ongoingResponse.success ? ongoingResponse.data?.content || [] : [];
        const upcoming = upcomingResponse.success ? upcomingResponse.data?.content || [] : [];
        
        // Combine and take first 5
        const combined = [...ongoing, ...upcoming].slice(0, 5);
        setUpcomingActivities(combined);
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
  console.log("hdhdhhd", recentRequests);
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
