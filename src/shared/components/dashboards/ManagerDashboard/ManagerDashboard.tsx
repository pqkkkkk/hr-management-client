import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import ManagerStatsCards from './components/ManagerStatsCards';
import PendingRequestsTable from './components/PendingRequestsTable';
import TeamAttendanceChart from './components/TeamAttendanceChart';
import TeamActivitiesWidget from './components/TeamActivitiesWidget';
import { RequestStatus, RequestType } from 'modules/request/types/request.types';
import { ActivityStatus } from 'shared/types/common.types';

// Mock data interfaces
interface PendingRequest {
  requestId: string;
  employeeName: string;
  employeeAvatar?: string;
  type: RequestType;
  status: RequestStatus;
  submittedDate: string;
  createdAt: string;
}

interface AttendanceData {
  day: string;
  date: string;
  onTimeRate: number;
  lateCount: number;
  absentCount: number;
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
  const navigate = useNavigate();

  // Stats state
  const [pendingRequests, setPendingRequests] = useState(8);
  const [teamMembers, setTeamMembers] = useState(15);
  const [activeTeamMembers, setActiveTeamMembers] = useState(14);
  const [onLeaveToday, setOnLeaveToday] = useState(2);
  const [giftedPointsThisMonth, setGiftedPointsThisMonth] = useState(450);
  const [budgetRemaining] = useState(550);

  // Pending requests state
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  // Attendance data state
  const [attendanceData, setAttendanceData] = useState<AttendanceData[]>([]);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(true);
  const [weeklyAverage, setWeeklyAverage] = useState(88);
  const [onTimeToday, setOnTimeToday] = useState(12);
  const [notCheckedInToday, setNotCheckedInToday] = useState(3);

  // Team activities state
  const [teamActivities, setTeamActivities] = useState<TeamActivity[]>([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // TODO: Replace with actual API calls when backend is ready
        setTimeout(() => {
          // Mock pending requests, use mock profile api instead of hardcoded data in the component
          setRequests([
            {
              requestId: '1',
              employeeName: 'Nguyễn Văn A',
              type: RequestType.LEAVE,
              status: RequestStatus.PENDING,
              submittedDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            },
            {
              requestId: '2',
              employeeName: 'Trần Thị B',
              type: RequestType.TIMESHEET,
              status: RequestStatus.PENDING,
              submittedDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
            },
            {
              requestId: '3',
              employeeName: 'Lê Văn C',
              type: RequestType.WFH,
              status: RequestStatus.PENDING,
              submittedDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            },
            {
              requestId: '4',
              employeeName: 'Phạm Thị D',
              type: RequestType.LEAVE,
              status: RequestStatus.PENDING,
              submittedDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            },
            {
              requestId: '5',
              employeeName: 'Hoàng Văn E',
              type: RequestType.CHECK_IN,
              status: RequestStatus.PENDING,
              submittedDate: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            },
          ]);
          setIsLoadingRequests(false);

          // Mock attendance data (last 7 days), use mock attendance api instead of hardcoded data in the component
          const days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
          const mockAttendance: AttendanceData[] = days.map((day, index) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - index));
            return {
              day,
              date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' }),
              onTimeRate: 75 + Math.floor(Math.random() * 20),
              lateCount: Math.floor(Math.random() * 3),
              absentCount: Math.floor(Math.random() * 2),
            };
          });
          setAttendanceData(mockAttendance);
          setIsLoadingAttendance(false);

          // Mock team activities, use mock activities api instead of hardcoded data in the component
          setTeamActivities([
            {
              activityId: '1',
              name: 'Chạy bộ Marathon 2025',
              status: 'ONGOING' as ActivityStatus,
              participantsCount: 12,
              totalTeamMembers: 15,
              progress: 45,
              topPerformers: [
                { employeeId: '1', employeeName: 'Nguyễn Văn A', score: 125, rank: 1 },
                { employeeId: '2', employeeName: 'Trần Thị B', score: 98, rank: 2 },
                { employeeId: '3', employeeName: 'Lê Văn C', score: 87, rank: 3 },
              ],
            },
            {
              activityId: '2',
              name: 'Giải Cầu lông nội bộ',
              status: 'UPCOMING' as ActivityStatus,
              participantsCount: 8,
              totalTeamMembers: 15,
              progress: 0,
              topPerformers: [],
            },
            {
              activityId: '3',
              name: 'Yoga buổi sáng',
              status: 'ONGOING' as ActivityStatus,
              participantsCount: 10,
              totalTeamMembers: 15,
              progress: 60,
              topPerformers: [
                { employeeId: '4', employeeName: 'Phạm Thị D', score: 156, rank: 1 },
                { employeeId: '5', employeeName: 'Hoàng Văn E', score: 142, rank: 2 },
                { employeeId: '1', employeeName: 'Nguyễn Văn A', score: 138, rank: 3 },
              ],
            },
          ]);
          setIsLoadingActivities(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setIsLoadingRequests(false);
        setIsLoadingAttendance(false);
        setIsLoadingActivities(false);
      }
    };

    fetchDashboardData();
  }, []);



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

      {/* Team Performance Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TeamAttendanceChart
          data={attendanceData}
          isLoading={isLoadingAttendance}
          weeklyAverage={weeklyAverage}
          onTimeToday={onTimeToday}
          notCheckedInToday={notCheckedInToday}
        />
        <TeamActivitiesWidget
          activities={teamActivities}
          isLoading={isLoadingActivities}
        />
      </div>
    </div>
  );
};

export default ManagerDashboard;
