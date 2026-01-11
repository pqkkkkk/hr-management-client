import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import { useApi } from 'contexts/ApiContext';
import ManagerStatsCards from './components/ManagerStatsCards';
import PendingRequestsTable from './components/PendingRequestsTable';
import TeamActivitiesWidget from './components/TeamActivitiesWidget';
import { Request, RequestStatus, RequestType } from 'modules/request/types/request.types';
import { Activity, ActivityStatus as ActivityStatusEnum } from 'modules/activity/types/activity.types';
import { ActivityStatus } from 'shared/types/common.types';

// Pending request interface for table display
interface PendingRequest {
  requestId: string;
  employeeName: string;
  employeeAvatar?: string;
  type: RequestType;
  status: RequestStatus;
  submittedDate: string;
  createdAt: string;
}

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

const ManagerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { requestApi, profileApi, rewardApi, activityApi } = useApi();
  const navigate = useNavigate();

  // Stats state
  const [pendingRequests, setPendingRequests] = useState(0);
  const [teamMembers, setTeamMembers] = useState(0);
  const [activeTeamMembers, setActiveTeamMembers] = useState(0);
  const [onLeaveToday, setOnLeaveToday] = useState(0);
  const [giftedPointsThisMonth, setGiftedPointsThisMonth] = useState(0);
  const [budgetRemaining] = useState(0);

  // Pending requests state
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  // Team activities state
  const [teamActivities, setTeamActivities] = useState<TeamActivity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Helper function to calculate progress based on dates
  const calculateProgress = (startDate: string, endDate: string): number => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();
    
    if (now <= start) return 0;
    if (now >= end) return 100;
    
    return Math.round(((now - start) / (end - start)) * 100);
  };

  // Helper function to map Activity status to TeamActivity status
  const mapActivityStatus = (status: ActivityStatusEnum): ActivityStatus => {
    switch (status) {
      case ActivityStatusEnum.OPEN:
      case ActivityStatusEnum.IN_PROGRESS:
        return 'ONGOING';
      case ActivityStatusEnum.DRAFT:
        return 'UPCOMING';
      case ActivityStatusEnum.CLOSED:
      case ActivityStatusEnum.COMPLETED:
        return 'COMPLETED';
      default:
        return 'UPCOMING';
    }
  };

  // Fetch team pending requests
  const fetchTeamRequests = useCallback(async () => {
    if (!user?.userId) return;
    
    try {
      setIsLoadingRequests(true);
      const response = await requestApi.getTeamRequests({ 
        status: RequestStatus.PENDING,
        approverId: user.userId,
      });
      if (response.success && response.data) {
        const pendingRequestsList: PendingRequest[] = response.data.content.map((req: Request) => ({
          requestId: req.requestId,
          employeeName: req.employeeFullName || 'Unknown',
          type: req.requestType,
          status: req.status,
          submittedDate: req.createdAt,
          createdAt: req.createdAt,
        }));
        setRequests(pendingRequestsList);
        setPendingRequests(response.data.totalElements);
      }
    } catch (err) {
      console.error('Error fetching team requests:', err);
      setError('Không thể tải danh sách yêu cầu');
    } finally {
      setIsLoadingRequests(false);
    }
  }, [requestApi, user?.userId]);

  // Fetch team members count
  const fetchTeamMembers = useCallback(async () => {
    try {
      const response = await profileApi.getProfiles({ 
        departmentId: user?.departmentId,
        pageSize: 100 
      });
      if (response.success && response.data) {
        const members = response.data.content;
        setTeamMembers(response.data.totalElements);
        // Count active members (assuming status field exists)
        const activeCount = members.filter((m: any) => m.status === 'ACTIVE').length;
        setActiveTeamMembers(activeCount || response.data.totalElements);
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  }, [profileApi, user?.departmentId]);

  // Fetch gifted points this month
  const fetchGiftedPoints = useCallback(async () => {
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const lastDay = new Date(year, now.getMonth() + 1, 0).getDate();
      
      const fromDate = `${year}-${month}-01T00:00:00.000Z`;
      const toDate = `${year}-${month}-${String(lastDay).padStart(2, '0')}T23:59:59.999Z`;
      
      const response = await rewardApi.getMyGiftTransactions({
        FromDate: fromDate,
        ToDate: toDate,
        PageSize: 100,
      });
      
      if (response.success && response.data) {
        const totalGifted = response.data.content.reduce((sum: number, transaction: any) => {
          return sum + (transaction.amount || 0);
        }, 0);
        setGiftedPointsThisMonth(totalGifted);
      }
    } catch (err) {
      console.error('Error fetching gifted points:', err);
    }
  }, [rewardApi]);

  // Fetch team activities
  const fetchTeamActivities = useCallback(async () => {
    try {
      setIsLoadingActivities(true);
      const response = await activityApi.getActivities(undefined, {
        pageSize: 5,
        status: ActivityStatusEnum.OPEN,
      });
      
      if (response.success && response.data) {
        const activities: TeamActivity[] = response.data.content.map((activity: Activity) => ({
          activityId: activity.activityId,
          name: activity.name,
          status: mapActivityStatus(activity.status),
          participantsCount: activity.participantsCount || 0,
          totalTeamMembers: teamMembers || 15, // Use actual team members count
          progress: calculateProgress(activity.startDate, activity.endDate),
          topPerformers: [], // Would need separate API call for leaderboard
        }));
        setTeamActivities(activities);
      }
    } catch (err) {
      console.error('Error fetching team activities:', err);
    } finally {
      setIsLoadingActivities(false);
    }
  }, [activityApi, teamMembers]);

  // Fetch all dashboard data
  useEffect(() => {
    fetchTeamRequests();
    fetchTeamMembers();
    fetchGiftedPoints();
  }, [fetchTeamRequests, fetchTeamMembers, fetchGiftedPoints]);

  // Fetch activities after team members are loaded
  useEffect(() => {
    if (teamMembers > 0) {
      fetchTeamActivities();
    } else {
      fetchTeamActivities();
    }
  }, [teamMembers, fetchTeamActivities]);



  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Manager</h1>
        <p className="text-gray-600">Chào mừng trở lại, {user?.fullName}!</p>
      </div>

      {/* Stats Cards */}
      <ManagerStatsCards
        pendingRequests={pendingRequests}
        teamMembers={teamMembers}
        activeTeamMembers={activeTeamMembers}
        onLeaveToday={onLeaveToday}
        giftedPointsThisMonth={giftedPointsThisMonth}
        budgetRemaining={budgetRemaining}
        onPendingRequestsClick={() => navigate('/requests/manage')}
        onTeamMembersClick={() => navigate('/profile/employees')}
        onLeaveClick={() => navigate('/requests/attendance')}
        onGiftedPointsClick={() => navigate('/rewards/gift')}
      />

      {/* Pending Requests Table */}
      <div className="mb-8">
        <PendingRequestsTable
          requests={requests}
          isLoading={isLoadingRequests}
          isApproving={isApproving}
          isRejecting={isRejecting}
        />
      </div>

      {/* Team Activities Section */}
      <div className="grid grid-cols-1 gap-6">
        <TeamActivitiesWidget
          activities={teamActivities}
          isLoading={isLoadingActivities}
        />
      </div>
    </div>
  );
};

export default ManagerDashboard;
