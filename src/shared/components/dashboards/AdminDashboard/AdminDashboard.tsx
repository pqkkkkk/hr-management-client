import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';
import { useApi } from 'contexts/ApiContext';
import { Users, FileText, Activity as ActivityIcon, Gift, ListTodo, UserCog, Clock, User, CheckCircle, Settings } from 'lucide-react';
import { Activity, ActivityStatus } from 'modules/activity/types/activity.types';
import { RequestStatus, Request, RequestType } from 'modules/request/types/request.types';
import { RewardProgramDetail } from 'modules/reward/types/reward.types';

// Stats Card Component
interface StatsCardProps {
    title: string;
    value: number;
    icon: React.ReactNode;
    bgColor: string;
    iconColor: string;
    onClick?: () => void;
    isLoading?: boolean;
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon,
    bgColor,
    iconColor,
    onClick,
    isLoading = false,
}) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="flex items-center justify-between">
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-16"></div>
                    </div>
                    <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`bg-white rounded-lg shadow p-6 ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
            onClick={onClick}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`${bgColor} p-3 rounded-full`}>
                    <div className={iconColor}>{icon}</div>
                </div>
            </div>
        </div>
    );
};

// Status Badge Component for Activities
const getActivityStatusBadge = (status: ActivityStatus) => {
    const badges: Record<ActivityStatus, { bg: string; text: string }> = {
        [ActivityStatus.DRAFT]: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
        [ActivityStatus.OPEN]: { bg: 'bg-green-100', text: 'text-green-800' },
        [ActivityStatus.IN_PROGRESS]: { bg: 'bg-blue-100', text: 'text-blue-800' },
        [ActivityStatus.CLOSED]: { bg: 'bg-gray-100', text: 'text-gray-800' },
        [ActivityStatus.COMPLETED]: { bg: 'bg-gray-100', text: 'text-gray-800' },
    };
    return badges[status] || { bg: 'bg-gray-100', text: 'text-gray-800' };
};

const getActivityStatusText = (status: ActivityStatus) => {
    const texts: Record<ActivityStatus, string> = {
        [ActivityStatus.DRAFT]: 'Nháp',
        [ActivityStatus.OPEN]: 'Mở đăng ký',
        [ActivityStatus.IN_PROGRESS]: 'Đang diễn ra',
        [ActivityStatus.CLOSED]: 'Đã đóng',
        [ActivityStatus.COMPLETED]: 'Hoàn thành',
    };
    return texts[status] || status;
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
};

const getRequestTypeText = (type: RequestType) => {
    const texts = {
        [RequestType.LEAVE]: 'Nghỉ phép',
        [RequestType.CHECK_IN]: 'Check-in',
        [RequestType.CHECK_OUT]: 'Check-out',
        [RequestType.TIMESHEET]: 'Cập nhật chấm công',
        [RequestType.WFH]: 'Làm việc tại nhà',
    };
    return texts[type] || type;
};

const getRequestTypeColor = (type: RequestType) => {
    const colors = {
        [RequestType.LEAVE]: 'text-purple-600 bg-purple-100',
        [RequestType.CHECK_IN]: 'text-green-600 bg-green-100',
        [RequestType.CHECK_OUT]: 'text-orange-600 bg-orange-100',
        [RequestType.TIMESHEET]: 'text-blue-600 bg-blue-100',
        [RequestType.WFH]: 'text-indigo-600 bg-indigo-100',
    };
    return colors[type] || 'text-gray-600 bg-gray-100';
};

// Quick Action Button Component
interface QuickActionButtonProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    bgColor: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
    title,
    description,
    icon,
    onClick,
    bgColor,
}) => {
    return (
        <button
            onClick={onClick}
            className="w-full flex items-center gap-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left"
        >
            <div className={`${bgColor} p-3 rounded-lg`}>{icon}</div>
            <div>
                <p className="font-medium text-gray-900">{title}</p>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
        </button>
    );
};

// Main AdminDashboard Component
const AdminDashboard: React.FC = () => {
    const { user } = useAuth();
    const { profileApi, requestApi, activityApi, rewardApi } = useApi();
    const navigate = useNavigate();

    // Stats state
    const [totalUsers, setTotalUsers] = useState(0);
    const [delegatedRequests, setDelegatedRequests] = useState(0);
    const [ongoingActivities, setOngoingActivities] = useState(0);

    // Data state
    const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
    const [pendingRequests, setPendingRequests] = useState<Request[]>([]);
    const [currentActiveRewardProgram, setCurrentActiveRewardProgram] = useState<RewardProgramDetail>();


    // Loading states
    const [loadingStats, setLoadingStats] = useState(true);
    const [loadingActivities, setLoadingActivities] = useState(true);
    const [loadingRequests, setLoadingRequests] = useState(true);

    // Fetch stats
    useEffect(() => {
        const fetchStats = async () => {
            if (!user?.userId) return;

            setLoadingStats(true);

            try {
                // Fetch all stats in parallel
                const [allUsersRes, delegatedRes, activitiesRes, activeRewardProgramRes] = await Promise.all([
                    // Total Users
                    profileApi.getProfiles({ pageSize: 1, currentPage: 1 }),
                    // Delegated Requests (pending)
                    requestApi.getTeamRequests({ processorId: user.userId, status: RequestStatus.PENDING, pageSize: 1, currentPage: 1 }),
                    // Ongoing Activities (IN_PROGRESS)
                    activityApi.getActivities(undefined, { status: ActivityStatus.IN_PROGRESS, pageSize: 1, pageNumber: 1 }),
                    // Active Reward Program
                    rewardApi.getActiveRewardProgram(),
                ]);

                if (allUsersRes.success && allUsersRes.data) {
                    setTotalUsers(allUsersRes.data.totalElements || 0);
                }

                if (delegatedRes.success && delegatedRes.data) {
                    setDelegatedRequests(delegatedRes.data.totalElements || 0);
                }

                if (activitiesRes.success && activitiesRes.data) {
                    setOngoingActivities(activitiesRes.data.totalElements || 0);
                }

                if (activeRewardProgramRes.success && activeRewardProgramRes.data) {
                    setCurrentActiveRewardProgram(activeRewardProgramRes.data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStats();
    }, [user?.userId, profileApi, requestApi, activityApi]);

    // Fetch recent activities
    useEffect(() => {
        const fetchActivities = async () => {
            setLoadingActivities(true);

            try {
                const response = await activityApi.getActivities(undefined, {
                    pageSize: 6,
                    pageNumber: 1,
                });

                if (response.success && response.data?.content) {
                    setRecentActivities(response.data.content);
                }
            } catch (error) {
                console.error('Error fetching activities:', error);
            } finally {
                setLoadingActivities(false);
            }
        };

        fetchActivities();
    }, [activityApi]);

    // Fetch pending delegated requests
    useEffect(() => {
        const fetchRequests = async () => {
            if (!user?.userId) return;

            setLoadingRequests(true);

            try {
                const response = await requestApi.getTeamRequests({
                    processorId: user.userId,
                    status: RequestStatus.PENDING,
                    pageSize: 5,
                    currentPage: 1,
                });

                if (response.success && response.data?.content) {
                    setPendingRequests(response.data.content);
                }
            } catch (error) {
                console.error('Error fetching requests:', error);
            } finally {
                setLoadingRequests(false);
            }
        };

        fetchRequests();
    }, [user?.userId, requestApi]);

    return (
        <div>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
                <p className="text-gray-600">Chào mừng trở lại, {user?.fullName}!</p>
            </div>

            {/* Stats Cards - 3 cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <StatsCard
                    title="Tổng số người dùng"
                    value={totalUsers}
                    icon={<Users className="w-6 h-6" />}
                    bgColor="bg-blue-100"
                    iconColor="text-blue-600"
                    onClick={() => navigate('/profile/users')}
                    isLoading={loadingStats}
                />
                <StatsCard
                    title="Yêu cầu được ủy quyền"
                    value={delegatedRequests}
                    icon={<FileText className="w-6 h-6" />}
                    bgColor={delegatedRequests > 0 ? "bg-red-100" : "bg-gray-100"}
                    iconColor={delegatedRequests > 0 ? "text-red-600" : "text-gray-600"}
                    onClick={() => navigate('/requests/delegated')}
                    isLoading={loadingStats}
                />
                <StatsCard
                    title="Hoạt động đang diễn ra"
                    value={ongoingActivities}
                    icon={<ActivityIcon className="w-6 h-6" />}
                    bgColor="bg-green-100"
                    iconColor="text-green-600"
                    onClick={() => navigate('/activities/manage')}
                    isLoading={loadingStats}
                />
            </div>

            {/* Quick Actions - Horizontal */}
            <div className="mb-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                        onClick={() => navigate(`/rewards/programs/${currentActiveRewardProgram?.rewardProgramId}`)}
                        className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left"
                    >
                        <div className="bg-yellow-500 p-2 rounded-lg">
                            <Gift className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-gray-900 text-sm">Xem chương trình thưởng</span>
                    </button>
                    <button
                        onClick={() => navigate('/activities/manage')}
                        className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left"
                    >
                        <div className="bg-blue-500 p-2 rounded-lg">
                            <Settings className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-gray-900 text-sm">Quản lý hoạt động</span>
                    </button>
                    <button
                        onClick={() => navigate('/requests/delegated')}
                        className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left"
                    >
                        <div className="bg-green-500 p-2 rounded-lg">
                            <ListTodo className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-gray-900 text-sm">Yêu cầu được ủy quyền</span>
                    </button>
                    <button
                        onClick={() => navigate('/profile/users')}
                        className="flex items-center gap-3 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left"
                    >
                        <div className="bg-purple-500 p-2 rounded-lg">
                            <UserCog className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-medium text-gray-900 text-sm">Quản lý nhân viên</span>
                    </button>
                </div>
            </div>

            {/* Delegated Requests Table */}
            <div className="mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Yêu cầu chờ phê duyệt</h3>
                        <div className="flex items-center space-x-3">
                            {pendingRequests.length > 0 && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                    {delegatedRequests} yêu cầu
                                </span>
                            )}
                            <button
                                onClick={() => navigate('/requests/delegated')}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                Xem tất cả
                            </button>
                        </div>
                    </div>

                    {loadingRequests ? (
                        <div className="animate-pulse space-y-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-16 bg-gray-200 rounded"></div>
                            ))}
                        </div>
                    ) : pendingRequests.length === 0 ? (
                        <div className="text-center py-8">
                            <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                            <p className="text-gray-500">Không có yêu cầu chờ duyệt</p>
                            <p className="text-sm text-gray-400 mt-1">Tất cả yêu cầu đã được xử lý</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nhân viên
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Loại yêu cầu
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ngày gửi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pendingRequests.map((request) => (
                                        <tr
                                            key={request.requestId}
                                            onClick={() => navigate(`/requests/${request.requestId}?requestType=${request.requestType}`)}
                                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-8 w-8">
                                                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                            <User className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium text-gray-900">
                                                            {request.employeeFullName}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRequestTypeColor(request.requestType)}`}>
                                                    {getRequestTypeText(request.requestType)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(request.createdAt)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Activities Table - Full width */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Hoạt động gần đây</h3>
                    <button
                        onClick={() => navigate('/activities/manage')}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Xem tất cả
                    </button>
                </div>

                {loadingActivities ? (
                    <div className="animate-pulse space-y-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="h-12 bg-gray-200 rounded"></div>
                        ))}
                    </div>
                ) : recentActivities.length === 0 ? (
                    <div className="text-center py-8">
                        <ActivityIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">Chưa có hoạt động nào</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Ngày tạo
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tên hoạt động
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Người tạo
                                    </th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {recentActivities.map((activity) => {
                                    const badge = getActivityStatusBadge(activity.status);
                                    return (
                                        <tr
                                            key={activity.activityId}
                                            onClick={() => navigate(`/activities/${activity.activityId}`)}
                                            className="hover:bg-gray-50 cursor-pointer transition-colors"
                                        >
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(activity.createdAt)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                                                    {activity.name}
                                                </p>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                                {activity.creatorName || 'N/A'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                                                    {getActivityStatusText(activity.status)}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
