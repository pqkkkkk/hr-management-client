import React, { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "contexts/ApiContext";
import { useQuery } from "shared/hooks/use-query";
import { useFetchList } from "shared/hooks/use-fetch-list";
import {
    Activity,
    ActivityStatus,
    ActivityFilter as ActivityFilterType,
} from "../types/activity.types";
import { Pagination, EmptyState } from "../components";
import {
    BarChart3,
    Calendar,
    Users,
    Activity as ActivityIcon,
    Search,
} from "lucide-react";

const PAGE_SIZE = 10;

// ========== STATUS CONFIG ==========

const statusConfig: Record<ActivityStatus, { label: string; className: string }> = {
    [ActivityStatus.DRAFT]: { label: "Nháp", className: "bg-gray-100 text-gray-700" },
    [ActivityStatus.OPEN]: { label: "Sắp diễn ra", className: "bg-green-100 text-green-700" },
    [ActivityStatus.CLOSED]: { label: "Đã đóng", className: "bg-orange-100 text-orange-700" },
    [ActivityStatus.COMPLETED]: { label: "Hoàn thành", className: "bg-blue-100 text-blue-700" },
    [ActivityStatus.IN_PROGRESS]: { label: "Đang diễn ra", className: "bg-blue-100 text-blue-700" },
};

// ========== ACTIVITY ROW COMPONENT ==========

interface ActivityRowProps {
    activity: Activity;
    onViewSummary: (id: string) => void;
}

const ActivityRow: React.FC<ActivityRowProps> = ({ activity, onViewSummary }) => {
    const status = statusConfig[activity.status] || statusConfig[ActivityStatus.DRAFT];

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
            <td className="px-4 py-4">
                <div className="flex items-center gap-3">
                    {activity.bannerUrl ? (
                        <img
                            src={activity.bannerUrl}
                            alt={activity.name}
                            className="w-12 h-12 rounded-lg object-cover"
                        />
                    ) : (
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                            <ActivityIcon size={20} className="text-white" />
                        </div>
                    )}
                    <div>
                        <div className="font-medium text-gray-900">{activity.name}</div>
                        <div className="text-sm text-gray-500">{activity.type}</div>
                    </div>
                </div>
            </td>
            <td className="px-4 py-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.className}`}>
                    {status.label}
                </span>
            </td>
            <td className="px-4 py-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{formatDate(activity.startDate)} - {formatDate(activity.endDate)}</span>
                </div>
            </td>
            <td className="px-4 py-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                    <Users size={14} />
                    <span>{activity.participantsCount || "Chưa xác định"} người</span>
                </div>
            </td>
            <td className="px-4 py-4">
                <button
                    onClick={() => onViewSummary(activity.activityId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                    <BarChart3 size={16} />
                    <span>Xem thống kê</span>
                </button>
            </td>
        </tr>
    );
};

// ========== MAIN COMPONENT ==========

const ActivityOverviewPage: React.FC = () => {
    const navigate = useNavigate();
    const { activityApi } = useApi();

    // Query state
    const { query, updateQuery } = useQuery<ActivityFilterType>({
        pageNumber: 1,
        pageSize: PAGE_SIZE,
    });

    // Fetch data
    const {
        data: activities,
        page: pageData,
        isFetching,
        error,
    } = useFetchList<ActivityFilterType, Activity>(
        activityApi.getActivities.bind(activityApi),
        query
    );



    // Handlers
    const handleSearch = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            updateQuery({
                pageNumber: 1,
                nameContains: e.target.value || undefined,
            });
        },
        [updateQuery]
    );

    const handleStatusFilter = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            updateQuery({
                pageNumber: 1,
                status: e.target.value ? (e.target.value as ActivityStatus) : undefined,
            });
        },
        [updateQuery]
    );

    const handlePageChange = useCallback(
        (page: number) => {
            updateQuery({ pageNumber: page });
        },
        [updateQuery]
    );

    const handleViewSummary = (activityId: string) => {
        navigate(`/activities/manage/${activityId}/summary`);
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Tổng kết hoạt động</h1>
                <p className="text-gray-600 mt-1">
                    Xem thống kê và báo cáo của các hoạt động chạy bộ
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-500">
                    <div className="text-sm text-gray-600">Đang diễn ra</div>
                    <div className="text-2xl font-bold text-green-600">
                        {activities.filter((a) => a.status === ActivityStatus.OPEN).length}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-500">
                    <div className="text-sm text-gray-600">Đã hoàn thành</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {activities.filter((a) => a.status === ActivityStatus.COMPLETED).length}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-purple-500">
                    <div className="text-sm text-gray-600">Tổng người tham gia</div>
                    <div className="text-2xl font-bold text-purple-600">
                        {activities.reduce((sum, a) => sum + (a.participantsCount || 0), 0)}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <div className="flex flex-wrap gap-4">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm hoạt động..."
                            value={query.nameContains || ""}
                            onChange={handleSearch}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={query.status || ""}
                        onChange={handleStatusFilter}
                        className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value={ActivityStatus.OPEN}>Đang diễn ra</option>
                        <option value={ActivityStatus.COMPLETED}>Đã hoàn thành</option>
                        <option value={ActivityStatus.CLOSED}>Đã đóng</option>
                        <option value={ActivityStatus.DRAFT}>Nháp</option>
                    </select>
                </div>
            </div>

            {/* Content */}
            {isFetching ? (
                <div className="flex items-center justify-center py-16">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center">
                    Đã có lỗi xảy ra: {error}
                </div>
            ) : activities.length === 0 ? (
                <EmptyState
                    title="Không tìm thấy hoạt động"
                    description="Chưa có hoạt động nào phù hợp với bộ lọc của bạn."
                />
            ) : (
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                    Hoạt động
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                    Trạng thái
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                    Thời gian
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                    Người tham gia
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                    Hành động
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {activities.map((activity) => (
                                <ActivityRow
                                    key={activity.activityId}
                                    activity={activity}
                                    onViewSummary={handleViewSummary}
                                />
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {pageData && (
                        <div className="p-4 border-t border-gray-100">
                            <Pagination
                                currentPage={query.pageNumber || 1}
                                totalPages={pageData.totalPages}
                                totalElements={pageData.totalElements}
                                pageSize={PAGE_SIZE}
                                onPageChange={handlePageChange}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ActivityOverviewPage;
