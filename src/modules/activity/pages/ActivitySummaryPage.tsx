import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useApi } from "contexts/ApiContext";
import {
    ActivityDetailResponse,
    ActivityStatistics,
    LeaderboardEntry,
    ActivityStatus,
} from "../types/activity.types";
import { LeaderboardTable } from "../components";
import {
    ArrowLeft,
    Users,
    Activity,
    MapPin,
    CheckCircle,
    Download,
    TrendingUp,
    Calendar,
} from "lucide-react";
import { toast } from "react-toastify";

// ========== SUB-COMPONENTS ==========

// Stat Card Component
interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    subValue?: string;
    colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, subValue, colorClass }) => (
    <div className="bg-white rounded-xl shadow-sm p-5">
        <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${colorClass}`}>{icon}</div>
            <div>
                <div className="text-sm text-gray-500">{label}</div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                {subValue && <div className="text-sm text-gray-500">{subValue}</div>}
            </div>
        </div>
    </div>
);

// Log Status Breakdown Component
interface LogStatusBreakdownProps {
    stats: ActivityStatistics;
}

const LogStatusBreakdown: React.FC<LogStatusBreakdownProps> = ({ stats }) => {
    const total = stats.totalLogs || 1;
    const approvedPercent = ((stats.approvedLogs / total) * 100).toFixed(1);
    const pendingPercent = ((stats.pendingLogs / total) * 100).toFixed(1);
    const rejectedPercent = ((stats.rejectedLogs / total) * 100).toFixed(1);

    return (
        <div className="bg-white rounded-xl shadow-sm p-5">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái kết quả</h3>

            <div className="space-y-4">
                {/* Progress bar */}
                <div className="h-4 bg-gray-100 rounded-full overflow-hidden flex">
                    <div
                        className="bg-green-500 h-full"
                        style={{ width: `${approvedPercent}%` }}
                    />
                    <div
                        className="bg-yellow-500 h-full"
                        style={{ width: `${pendingPercent}%` }}
                    />
                    <div
                        className="bg-red-500 h-full"
                        style={{ width: `${rejectedPercent}%` }}
                    />
                </div>

                {/* Legend */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <div>
                            <div className="text-sm text-gray-600">Đã duyệt</div>
                            <div className="font-semibold">{stats.approvedLogs}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div>
                            <div className="text-sm text-gray-600">Chờ duyệt</div>
                            <div className="font-semibold">{stats.pendingLogs}</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div>
                            <div className="text-sm text-gray-600">Từ chối</div>
                            <div className="font-semibold">{stats.rejectedLogs}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Activity Info Header Component
interface ActivityInfoHeaderProps {
    activity: ActivityDetailResponse;
    onExport: () => void;
    exporting: boolean;
}

const ActivityInfoHeader: React.FC<ActivityInfoHeaderProps> = ({
    activity,
    onExport,
    exporting,
}) => {
    const statusConfig: Record<ActivityStatus, { label: string; className: string }> = {
        [ActivityStatus.DRAFT]: { label: "Nháp", className: "bg-gray-100 text-gray-700" },
        [ActivityStatus.OPEN]: { label: "Sắp diễn ra", className: "bg-green-100 text-green-700" },
        [ActivityStatus.CLOSED]: { label: "Đã đóng", className: "bg-orange-100 text-orange-700" },
        [ActivityStatus.COMPLETED]: { label: "Hoàn thành", className: "bg-blue-100 text-blue-700" },
        [ActivityStatus.IN_PROGRESS]: { label: "Đang diễn ra", className: "bg-blue-100 text-blue-700" },
    };

    const status = statusConfig[activity.status] || statusConfig[ActivityStatus.DRAFT];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                    {activity.bannerUrl ? (
                        <img
                            src={activity.bannerUrl}
                            alt={activity.name}
                            className="w-24 h-24 rounded-lg object-cover"
                        />
                    ) : (
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <Activity size={32} className="text-white" />
                        </div>
                    )}
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl font-bold text-gray-900">{activity.name}</h1>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${status.className}`}>
                                {status.label}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {formatDate(activity.startDate)} - {formatDate(activity.endDate)}
                            </span>
                            <span className="flex items-center gap-1">
                                <Users size={14} />
                                {activity.participantsCount || 0} người tham gia
                            </span>
                        </div>
                    </div>
                </div>

                <button
                    onClick={onExport}
                    disabled={exporting}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {exporting ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                        <Download size={18} />
                    )}
                    <span>Xuất báo cáo</span>
                </button>
            </div>
        </div>
    );
};

// Top Performers Section Component
interface TopPerformersProps {
    entries: LeaderboardEntry[];
}

const TopPerformersSection: React.FC<TopPerformersProps> = ({ entries }) => {
    const top5 = entries.slice(0, 5);

    return (
        <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Top 5 Performers</h3>
                <TrendingUp size={20} className="text-green-600" />
            </div>

            {top5.length === 0 ? (
                <div className="text-center py-4 text-gray-500">Chưa có dữ liệu</div>
            ) : (
                <div className="space-y-3">
                    {top5.map((entry, index) => (
                        <div
                            key={entry.employeeId}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${index === 0
                                        ? "bg-yellow-100 text-yellow-700"
                                        : index === 1
                                            ? "bg-gray-200 text-gray-700"
                                            : index === 2
                                                ? "bg-amber-100 text-amber-700"
                                                : "bg-blue-50 text-blue-600"
                                        }`}
                                >
                                    {entry.rank}
                                </div>
                                <img
                                    src={entry.avatarUrl || `https://i.pravatar.cc/40?u=${entry.employeeId}`}
                                    alt={entry.employeeName}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <div className="font-medium text-gray-900">{entry?.employeeName}</div>
                            </div>
                            <div className="text-right">
                                <div className="font-semibold text-gray-900">{entry?.totalScore} điểm</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// ========== MAIN COMPONENT ==========

const ActivitySummaryPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { activityApi } = useApi();

    const [activity, setActivity] = useState<ActivityDetailResponse | null>(null);
    const [stats, setStats] = useState<ActivityStatistics | null>(null);
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [exporting, setExporting] = useState(false);

    // Fetch data
    const fetchData = useCallback(async () => {
        if (!id) return;

        setLoading(true);
        try {
            const [activityRes, statsRes, leaderboardRes] = await Promise.all([
                activityApi.getActivityById(id),
                activityApi.getActivityStatistics(id),
                activityApi.getActivityLeaderboard(id),
            ]);

            if (activityRes.success && activityRes.data) {
                setActivity(activityRes.data);
            }
            if (statsRes.success && statsRes.data) {
                setStats(statsRes.data);
            }
            if (leaderboardRes.success && leaderboardRes.data) {
                setLeaderboard(leaderboardRes.data);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Không thể tải dữ liệu tổng kết");
        } finally {
            setLoading(false);
        }
    }, [id, activityApi]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Export handler
    const handleExport = async () => {
        setExporting(true);
        try {
            // Simulate export - in real app, call API to generate report
            await new Promise((resolve) => setTimeout(resolve, 1500));
            toast.success("Đã tải xuống báo cáo thành công");
        } catch (error) {
            toast.error("Lỗi khi xuất báo cáo");
        } finally {
            setExporting(false);
        }
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
    if (!activity || !stats) {
        return (
            <div className="p-6">
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                    Không tìm thấy dữ liệu hoạt động
                </div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Back Button */}
            <button
                onClick={() => navigate("/activities/manage")}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
            >
                <ArrowLeft size={20} />
                <span>Quay lại quản lý hoạt động</span>
            </button>

            {/* Activity Info Header */}
            <ActivityInfoHeader
                activity={activity}
                onExport={handleExport}
                exporting={exporting}
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <StatCard
                    icon={<Users size={24} className="text-blue-600" />}
                    label="Số người tham gia"
                    value={stats?.totalParticipants}
                    colorClass="bg-blue-100"
                />
                <StatCard
                    icon={<MapPin size={24} className="text-green-600" />}
                    label="Tổng quãng đường"
                    value={`${stats?.totalDistance?.toFixed(1)} km`}
                    subValue={`TB: ${stats?.averageDistancePerParticipant?.toFixed(2)} km/người`}
                    colorClass="bg-green-100"
                />
                <StatCard
                    icon={<Activity size={24} className="text-purple-600" />}
                    label="Tổng lần ghi nhận"
                    value={stats?.totalLogs}
                    colorClass="bg-purple-100"
                />
                <StatCard
                    icon={<CheckCircle size={24} className="text-emerald-600" />}
                    label="Tỉ lệ duyệt"
                    value={`${stats?.totalLogs > 0 ? ((stats?.approvedLogs / stats?.totalLogs) * 100).toFixed(0) : 0}%`}
                    subValue={`${stats?.approvedLogs}/${stats?.totalLogs} kết quả`}
                    colorClass="bg-emerald-100"
                />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Log Status Breakdown */}
                <LogStatusBreakdown stats={stats} />

                {/* Top Performers */}
                <TopPerformersSection entries={leaderboard} />
            </div>

            {/* Full Leaderboard */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bảng xếp hạng đầy đủ</h3>
                <LeaderboardTable entries={leaderboard} />
            </div>
        </div>
    );
};

export default ActivitySummaryPage;
