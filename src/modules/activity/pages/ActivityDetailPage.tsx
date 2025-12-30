import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "contexts/ApiContext";
import { useAuth } from "contexts/AuthContext";
import {
    ActivityDetailResponse,
    ActivityStatus,
    LeaderboardEntry,
    ActivityLog,
    ActivityLogStatus,
} from "../types/activity.types";
import { LeaderboardTable, ActivityLogCard, EmptyState } from "../components";
import {
    ArrowLeft,
    Calendar,
    Users,
    Trophy,
    ClipboardList,
    Settings,
    UserPlus,
    UserMinus,
    List,
} from "lucide-react";
import { toast } from "react-toastify";

// ========== TYPES ==========

type TabType = "overview" | "leaderboard" | "my-results";

const statusConfig: Record<ActivityStatus, { label: string; className: string }> = {
    [ActivityStatus.DRAFT]: { label: "Nháp", className: "bg-gray-100 text-gray-700" },
    [ActivityStatus.OPEN]: { label: "Đang diễn ra", className: "bg-green-100 text-green-700" },
    [ActivityStatus.CLOSED]: { label: "Đã đóng", className: "bg-orange-100 text-orange-700" },
    [ActivityStatus.COMPLETED]: { label: "Hoàn thành", className: "bg-blue-100 text-blue-700" },
};

const logStatusConfig: Record<ActivityLogStatus, { label: string; className: string }> = {
    [ActivityLogStatus.PENDING]: { label: "Chờ duyệt", className: "bg-yellow-100 text-yellow-700" },
    [ActivityLogStatus.APPROVED]: { label: "Đã duyệt", className: "bg-green-100 text-green-700" },
    [ActivityLogStatus.REJECTED]: { label: "Từ chối", className: "bg-red-100 text-red-700" },
};

// ========== HELPER FUNCTIONS ==========

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

// ========== SUB-COMPONENTS ==========

// Banner Component
interface BannerProps {
    activity: ActivityDetailResponse;
}

const ActivityBanner: React.FC<BannerProps> = ({ activity }) => {
    const status = statusConfig[activity.status] || statusConfig[ActivityStatus.DRAFT];

    return (
        <div className="h-48 md:h-64 bg-gradient-to-r from-blue-500 to-purple-600 relative">
            {activity.bannerUrl ? (
                <img
                    src={activity.bannerUrl}
                    alt={activity.name}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white text-6xl font-bold opacity-20">
                        {activity.type}
                    </span>
                </div>
            )}
            <div className="absolute top-4 right-4">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${status.className}`}>
                    {status.label}
                </span>
            </div>
        </div>
    );
};

// Header Info Component
interface HeaderInfoProps {
    activity: ActivityDetailResponse;
}

const ActivityHeaderInfo: React.FC<HeaderInfoProps> = ({ activity }) => (
    <div className="flex-1">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{activity.name}</h1>
        {activity.description && (
            <p className="text-gray-600 mb-4">{activity.description}</p>
        )}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
                <Calendar size={16} className="text-gray-400" />
                <span>{formatDate(activity.startDate)} - {formatDate(activity.endDate)}</span>
            </div>
            <div className="flex items-center gap-2">
                <Users size={16} className="text-gray-400" />
                <span>{activity.participantsCount || 0} người tham gia</span>
            </div>
        </div>
    </div>
);

// Action Buttons Component
interface ActionButtonsProps {
    activity: ActivityDetailResponse;
    canRegister: boolean;
    canManage: boolean;
    registering: boolean;
    onToggleRegistration: () => void;
    onManage: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
    activity,
    canRegister,
    canManage,
    registering,
    onToggleRegistration,
    onManage,
}) => (
    <div className="flex gap-2">
        {canRegister && (
            <button
                onClick={onToggleRegistration}
                disabled={registering}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activity.isRegistered
                        ? "bg-red-50 text-red-600 hover:bg-red-100"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    } disabled:opacity-50`}
            >
                {registering ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current"></div>
                ) : activity.isRegistered ? (
                    <>
                        <UserMinus size={18} />
                        <span>Hủy đăng ký</span>
                    </>
                ) : (
                    <>
                        <UserPlus size={18} />
                        <span>Đăng ký tham gia</span>
                    </>
                )}
            </button>
        )}

        {canManage && (
            <button
                onClick={onManage}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
                <Settings size={18} />
                <span>Quản lý</span>
            </button>
        )}
    </div>
);

// My Stats Component
interface MyStatsProps {
    activity: ActivityDetailResponse;
}

const MyStatsCard: React.FC<MyStatsProps> = ({ activity }) => {
    if (!activity.isRegistered) return null;

    return (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-3">Thành tích của bạn</h3>
            <div className="flex gap-8">
                <div>
                    <div className="text-2xl font-bold text-blue-600">
                        {activity.myTotalDistance?.toFixed(1) || 0}
                    </div>
                    <div className="text-sm text-blue-700">km đã chạy</div>
                </div>
                <div>
                    <div className="text-2xl font-bold text-blue-600">
                        {activity.myTotalLogs || 0}
                    </div>
                    <div className="text-sm text-blue-700">lần ghi nhận</div>
                </div>
            </div>
        </div>
    );
};

// Tab Navigation Component
interface TabNavigationProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    showMyResults: boolean;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange, showMyResults }) => {
    const tabClass = (tab: TabType) =>
        `flex items-center gap-2 px-6 py-4 font-medium transition-colors border-b-2 ${activeTab === tab
            ? "text-blue-600 border-blue-600"
            : "text-gray-600 border-transparent hover:text-gray-900"
        }`;

    return (
        <div className="border-b border-gray-200">
            <div className="flex">
                <button onClick={() => onTabChange("overview")} className={tabClass("overview")}>
                    <ClipboardList size={18} />
                    <span>Tổng quan</span>
                </button>
                <button onClick={() => onTabChange("leaderboard")} className={tabClass("leaderboard")}>
                    <Trophy size={18} />
                    <span>Bảng xếp hạng</span>
                </button>
                {showMyResults && (
                    <button onClick={() => onTabChange("my-results")} className={tabClass("my-results")}>
                        <List size={18} />
                        <span>Kết quả của tôi</span>
                    </button>
                )}
            </div>
        </div>
    );
};

// Overview Tab Component
interface OverviewTabProps {
    activity: ActivityDetailResponse;
    onSubmitResult: () => void;
}

const OverviewTab: React.FC<OverviewTabProps> = ({ activity, onSubmitResult }) => (
    <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin hoạt động</h2>
        <div className="prose max-w-none text-gray-600">
            <p>{activity.description || "Chưa có mô tả chi tiết."}</p>
        </div>

        {activity.isRegistered && activity.status === ActivityStatus.OPEN && (
            <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Hành động nhanh</h3>
                <button
                    onClick={onSubmitResult}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                    <ClipboardList size={18} />
                    <span>Ghi nhận kết quả</span>
                </button>
            </div>
        )}
    </div>
);

// Leaderboard Tab Component
interface LeaderboardTabProps {
    entries: LeaderboardEntry[];
    currentUserId?: string;
}

const LeaderboardTab: React.FC<LeaderboardTabProps> = ({ entries, currentUserId }) => (
    <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bảng xếp hạng</h2>
        <LeaderboardTable entries={entries} currentUserId={currentUserId} />
    </div>
);

// My Results Tab Component
interface MyResultsTabProps {
    logs: ActivityLog[];
    loading: boolean;
    expandedLogId: string | null;
    activityStatus: ActivityStatus;
    onToggleExpand: (logId: string) => void;
    onSubmitResult: () => void;
}

const MyResultsTab: React.FC<MyResultsTabProps> = ({
    logs,
    loading,
    expandedLogId,
    activityStatus,
    onToggleExpand,
    onSubmitResult,
}) => (
    <div>
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Kết quả của tôi</h2>
            {activityStatus === ActivityStatus.OPEN && (
                <button
                    onClick={onSubmitResult}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                    <ClipboardList size={16} />
                    <span>Ghi nhận kết quả mới</span>
                </button>
            )}
        </div>

        {loading ? (
            <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        ) : logs.length === 0 ? (
            <EmptyState
                title="Chưa có kết quả"
                description="Bạn chưa ghi nhận kết quả nào cho hoạt động này."
            />
        ) : (
            <div className="space-y-4">
                {logs.map((log) => (
                    <div key={log.activityLogId} className="relative">
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4 z-10">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${logStatusConfig[log.status]?.className || "bg-gray-100 text-gray-600"
                                    }`}
                            >
                                {logStatusConfig[log.status]?.label || log.status}
                            </span>
                        </div>

                        <ActivityLogCard
                            log={log}
                            isExpanded={expandedLogId === log.activityLogId}
                            isProcessing={false}
                            onToggleExpand={onToggleExpand}
                            showQuickActions={false}
                            showExpandedActions={false}
                        />

                        {/* Rejection reason */}
                        {log.status === ActivityLogStatus.REJECTED && log.rejectReason && (
                            <div className="mt-2 p-3 bg-red-50 rounded-lg text-sm text-red-700">
                                <strong>Lý do từ chối:</strong> {log.rejectReason}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
    </div>
);

// ========== MAIN COMPONENT ==========

const ActivityDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { activityApi } = useApi();
    const { user } = useAuth();

    const [activity, setActivity] = useState<ActivityDetailResponse | null>(null);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [myLogs, setMyLogs] = useState<ActivityLog[]>([]);
    const [activeTab, setActiveTab] = useState<TabType>("overview");
    const [loading, setLoading] = useState(true);
    const [loadingLogs, setLoadingLogs] = useState(false);
    const [registering, setRegistering] = useState(false);
    const [expandedLogId, setExpandedLogId] = useState<string | null>(null);

    const canManageActivity =
        user?.role === "MANAGER" || user?.role === "HR" || user?.role === "ADMIN";
    const canRegister = activity?.status === ActivityStatus.OPEN;

    // Fetch activity details
    const fetchActivityDetails = useCallback(async () => {
        if (!id) return;
        setLoading(true);
        try {
            const response = await activityApi.getActivityById(id);
            if (response.success && response.data) {
                setActivity(response.data);
            }
        } catch (error) {
            console.error("Error fetching activity:", error);
            toast.error("Không thể tải thông tin hoạt động");
        } finally {
            setLoading(false);
        }
    }, [id, activityApi]);

    // Fetch leaderboard
    const fetchLeaderboard = useCallback(async () => {
        if (!id) return;
        try {
            const response = await activityApi.getActivityLeaderboard(id);
            if (response.success && response.data) {
                setLeaderboard(response.data);
            }
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        }
    }, [id, activityApi]);

    // Fetch my logs
    const fetchMyLogs = useCallback(async () => {
        if (!id) return;
        setLoadingLogs(true);
        try {
            const response = await activityApi.getActivityLogs({
                activityId: id,
                employeeId: user?.userId,
                pageNumber: 1,
                pageSize: 50,
            });
            if (response.success && response.data) {
                setMyLogs(response.data.content || []);
            }
        } catch (error) {
            console.error("Error fetching my logs:", error);
        } finally {
            setLoadingLogs(false);
        }
    }, [id, activityApi, user?.userId]);

    useEffect(() => {
        fetchActivityDetails();
        fetchLeaderboard();
    }, [fetchActivityDetails, fetchLeaderboard]);

    useEffect(() => {
        if (activeTab === "my-results" && myLogs.length === 0) {
            fetchMyLogs();
        }
    }, [activeTab, myLogs.length, fetchMyLogs]);

    // Handlers
    const handleToggleRegistration = async () => {
        if (!id || !activity) return;
        setRegistering(true);
        try {
            if (activity.isRegistered) {
                const response = await activityApi.unregisterFromActivity(id);
                if (response.success) {
                    toast.success("Hủy đăng ký thành công");
                    setActivity({ ...activity, isRegistered: false });
                }
            } else {
                const response = await activityApi.registerForActivity(id);
                if (response.success) {
                    toast.success("Đăng ký thành công");
                    setActivity({ ...activity, isRegistered: true });
                }
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setRegistering(false);
        }
    };

    const handleSubmitResult = () => navigate(`/activities/${id}/submit`);
    const handleManage = () => navigate(`/activities/manage/${id}/edit`);
    const toggleLogExpand = (logId: string) => {
        setExpandedLogId((prev) => (prev === logId ? null : logId));
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    // Not found state
    if (!activity) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                    Không tìm thấy hoạt động
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Back Button */}
            <button
                onClick={() => navigate("/activities")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Quay lại danh sách</span>
            </button>

            {/* Banner & Header Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                <ActivityBanner activity={activity} />

                <div className="p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <ActivityHeaderInfo activity={activity} />
                        <ActionButtons
                            activity={activity}
                            canRegister={canRegister || false}
                            canManage={canManageActivity}
                            registering={registering}
                            onToggleRegistration={handleToggleRegistration}
                            onManage={handleManage}
                        />
                    </div>
                    <MyStatsCard activity={activity} />
                </div>
            </div>

            {/* Tabs Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <TabNavigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    showMyResults={activity.isRegistered || false}
                />

                <div className="p-6">
                    {activeTab === "overview" && (
                        <OverviewTab activity={activity} onSubmitResult={handleSubmitResult} />
                    )}

                    {activeTab === "leaderboard" && (
                        <LeaderboardTab entries={leaderboard} currentUserId={user?.userId} />
                    )}

                    {activeTab === "my-results" && (
                        <MyResultsTab
                            logs={myLogs}
                            loading={loadingLogs}
                            expandedLogId={expandedLogId}
                            activityStatus={activity.status}
                            onToggleExpand={toggleLogExpand}
                            onSubmitResult={handleSubmitResult}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityDetailPage;
