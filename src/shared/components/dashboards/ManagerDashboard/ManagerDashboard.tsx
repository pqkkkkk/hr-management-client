import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import { useApi } from 'contexts/ApiContext';
import ManagerStatsCards from './components/ManagerStatsCards';
import PendingRequestsTable from './components/PendingRequestsTable';
import TeamActivitiesWidget from './components/TeamActivitiesWidget';
import { RequestStatus, Request } from 'modules/request/types/request.types';
import { Activity, ActivityStatus } from 'modules/activity/types/activity.types';
import { UserWallet } from 'modules/reward/types/reward.types';

// Loading states interface
interface LoadingStates {
  requests: boolean;
  stats: boolean;
  activities: boolean;
}

// Error states interface
interface ErrorStates {
  requests: string | null;
  stats: string | null;
  activities: string | null;
}

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { requestApi, profileApi, rewardApi, activityApi } = useApi();
  const navigate = useNavigate();

  // Stats state
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [teamMembersCount, setTeamMembersCount] = useState(0);
  const [giftedPointsThisMonth, setGiftedPointsThisMonth] = useState(0);
  const [budgetRemaining, setBudgetRemaining] = useState(0);
  const [userWallet, setUserWallet] = useState<UserWallet | null>(null);

  // Pending requests state
  const [requests, setRequests] = useState<Request[]>([]);

  // Team activities state
  const [teamActivities, setTeamActivities] = useState<Activity[]>([]);

  // Loading states
  const [loading, setLoading] = useState<LoadingStates>({
    requests: true,
    stats: true,
    activities: true,
  });

  // Error states
  const [errors, setErrors] = useState<ErrorStates>({
    requests: null,
    stats: null,
    activities: null,
  });


  // Get current month date range for filtering gift transactions
  const getMonthDateRange = useCallback(() => {
    const now = new Date();
    const firstDay = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1));
    const lastDay = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999));
    return {
      fromDate: firstDay.toISOString(),
      toDate: lastDay.toISOString(),
    };
  }, []);

  // Fetch pending requests
  useEffect(() => {
    const fetchPendingRequests = async () => {
      if (!user?.userId) return;

      setLoading(prev => ({ ...prev, requests: true }));
      setErrors(prev => ({ ...prev, requests: null }));

      try {
        const response = await requestApi.getTeamRequests({
          approverId: user?.userId,
          status: RequestStatus.PENDING,
          pageSize: 5,
          currentPage: 1,
          sortBy: 'createdAt',
          sortDirection: 'DESC',
        });

        if (response.success && response.data) {
          setRequests(response.data.content || []);
          setPendingRequestsCount(response.data.totalElements || 0);
        }
      } catch (error) {
        console.error('Error fetching pending requests:', error);
        setErrors(prev => ({ ...prev, requests: 'Không thể tải danh sách yêu cầu' }));
      } finally {
        setLoading(prev => ({ ...prev, requests: false }));
      }
    };

    fetchPendingRequests();
  }, [user?.userId, requestApi]);

  // Fetch team members count
  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (!user?.userId || !user?.departmentId) return;

      setLoading(prev => ({ ...prev, stats: true }));
      setErrors(prev => ({ ...prev, stats: null }));

      try {
        const profilesResponse = await profileApi.getProfiles({
          pageSize: 100,
          currentPage: 1,
        });

        if (profilesResponse.success && profilesResponse.data) {
          const total = profilesResponse.data.totalElements || 0;
          setTeamMembersCount(total);
        }
      } catch (error) {
        console.error('Error fetching team members:', error);
        setErrors(prev => ({ ...prev, stats: 'Không thể tải thông tin thống kê' }));
      } finally {
        setLoading(prev => ({ ...prev, stats: false }));
      }
    };

    fetchTeamMembers();
  }, [user?.userId, user?.departmentId, profileApi]);

  // Fetch active reward program and user wallet
  useEffect(() => {
    const fetchWallet = async () => {
      if (!user?.userId) return;

      try {
        const activeRewardProgramResponse = await rewardApi.getActiveRewardProgram();

        if (activeRewardProgramResponse.success && activeRewardProgramResponse.data?.rewardProgramId) {
          const walletResponse = await rewardApi.getWallet(
            user.userId,
            activeRewardProgramResponse.data.rewardProgramId
          );
          if (walletResponse.success && walletResponse.data) {
            setUserWallet(walletResponse.data);
          }
        }
      } catch (error) {
        console.error('Error fetching wallet:', error);
      }
    };

    fetchWallet();
  }, [user?.userId, rewardApi]);

  // Fetch gift transactions when userWallet is loaded
  useEffect(() => {
    const fetchGiftTransactions = async () => {
      if (!userWallet?.userWalletId) return;

      try {
        const giftTransactionsResponse = await rewardApi.getMyGiftTransactions({
          SourceWalletId: userWallet.userWalletId,
          PageSize: 100,
        });

        // Calculate gifted points
        const totalGiftedPoint = giftTransactionsResponse.data?.content?.reduce((total, transaction) => {
          return total + transaction.amount;
        }, 0) || 0;
        setGiftedPointsThisMonth(totalGiftedPoint);

        // Calculate budget remaining
        const remaining = (userWallet.givingBudget || 0);
        setBudgetRemaining(remaining);
      } catch (error) {
        console.error('Error fetching gift transactions:', error);
      }
    };

    fetchGiftTransactions();
  }, [userWallet?.userWalletId, userWallet?.givingBudget, rewardApi]);

  // Fetch team activities
  useEffect(() => {
    const fetchActivities = async () => {
      if (!user?.userId) return;

      setLoading(prev => ({ ...prev, activities: true }));
      setErrors(prev => ({ ...prev, activities: null }));

      try {
        // Fetch ongoing activities
        const response = await activityApi.getActivities(user.userId, {
          status: ActivityStatus.IN_PROGRESS,
          pageSize: 5,
          pageNumber: 1,
        });

        if (response.success && response.data?.content) {
          setTeamActivities(response.data.content);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
        setErrors(prev => ({ ...prev, activities: 'Không thể tải danh sách hoạt động' }));
      } finally {
        setLoading(prev => ({ ...prev, activities: false }));
      }
    };

    fetchActivities();
  }, [user?.userId, activityApi]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Manager</h1>
        <p className="text-gray-600">Chào mừng trở lại, {user?.fullName}!</p>
      </div>

      {/* Stats Cards */}
      <ManagerStatsCards
        pendingRequests={pendingRequestsCount}
        teamMembers={teamMembersCount}
        giftedPointsThisMonth={giftedPointsThisMonth}
        budgetRemaining={budgetRemaining}
        onPendingRequestsClick={() => navigate('/requests/team-requests')}
        onTeamMembersClick={() => navigate('/profile/users')}
        onGiftedPointsClick={() => navigate('/rewards/gift')}
      />

      {/* Pending Requests Table */}
      <div className="mb-8">
        <PendingRequestsTable
          requests={requests}
          isLoading={loading.requests}
        />
      </div>

      {/* Team Activities Section - Full width */}
      <TeamActivitiesWidget
        activities={teamActivities}
        isLoading={loading.activities}
      />
    </div>
  );
};

export default ManagerDashboard;
