import React, { useMemo, useCallback, useState } from "react";
import { useApi } from "contexts/ApiContext";
import { useQuery } from "shared/hooks/use-query";
import { useFetchList } from "shared/hooks/use-fetch-list";
import { ActivityFilter as ActivityFilterType, ActivityStatus } from "../types/activity.types";
import { Activity } from "../types/activity.types";
import {
    ActivityCard,
    ActivityFilter,
    Pagination,
    EmptyState,
} from "../components";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";
import { ApiResponse, Page } from "shared/types";
import { toast } from "react-toastify";

const PAGE_SIZE = 6;

export interface ActivityListPageProps {
    title?: string;
    description?: string;
    showStatusFilter?: boolean;
    defaultStatus?: ActivityStatus;
    showCreateButton?: boolean;
    myActivitiesOnly?: boolean;
    fetchFn?: (filter: ActivityFilterType) => Promise<ApiResponse<Page<Activity>>>;
}

const ActivityListPage: React.FC<ActivityListPageProps> = ({
    title = "Hoạt động",
    description = "Danh sách các hoạt động chạy bộ của công ty",
    showStatusFilter = true,
    defaultStatus,
    showCreateButton = false,
    myActivitiesOnly = false,
    fetchFn,
}) => {
    const navigate = useNavigate();
    const { activityApi } = useApi();
    const { user } = useAuth();
    const [registeringId, setRegisteringId] = useState<string | null>(null);

    const canCreateActivity =
        showCreateButton &&
        (user?.role === "MANAGER" || user?.role === "HR" || user?.role === "ADMIN");

    // Query state
    const { query, updateQuery } = useQuery<ActivityFilterType>({
        pageNumber: 1,
        pageSize: PAGE_SIZE,
        status: defaultStatus,
    });

    // Fetch function
    const fetchActivities = useMemo(() => {
        if (fetchFn) return fetchFn;
        if (myActivitiesOnly) return activityApi.getMyActivities.bind(activityApi, user?.userId);
        return activityApi.getActivities.bind(activityApi);
    }, [activityApi, myActivitiesOnly, fetchFn]);

    // Fetch data
    const {
        data: activities,
        page: pageData,
        isFetching,
        error,
        refetch,
    } = useFetchList<ActivityFilterType, Activity>(fetchActivities, query);

    // Handlers
    const handleFilterChange = useCallback(
        (newFilters: any) => {
            updateQuery({
                pageNumber: 1,
                nameContains: newFilters.search,
                status: showStatusFilter ? newFilters.status : defaultStatus,
                type: newFilters.type,
            });
        },
        [updateQuery, showStatusFilter, defaultStatus]
    );

    const handlePageChange = useCallback(
        (page: number) => {
            updateQuery({ pageNumber: page });
        },
        [updateQuery]
    );

    const handleCreateActivity = () => {
        navigate("/activities/create");
    };

    // Register handler
    const handleRegister = async (activityId: string) => {
        setRegisteringId(activityId);
        try {
            const response = await activityApi.registerForActivity(activityId, user?.userId);
            if (response.success) {
                toast.success("Đăng ký thành công!");
                refetch();
            } else {
                toast.error(response.message || "Đăng ký thất bại");
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setRegisteringId(null);
        }
    };

    // Unregister handler
    const handleUnregister = async (activityId: string) => {
        setRegisteringId(activityId);
        try {
            const response = await activityApi.unregisterFromActivity(activityId, user?.userId);
            if (response.success) {
                toast.success("Hủy đăng ký thành công!");
                refetch();
            } else {
                toast.error(response.message || "Hủy đăng ký thất bại");
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setRegisteringId(null);
        }
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                    <p className="text-gray-600 mt-1">{description}</p>
                </div>

                {canCreateActivity && (
                    <button
                        onClick={handleCreateActivity}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={20} />
                        <span>Tạo hoạt động</span>
                    </button>
                )}
            </div>

            {/* Filters */}
            <ActivityFilter
                filters={{
                    search: query.nameContains,
                    status: query.status,
                    type: query.type,
                }}
                onFilterChange={handleFilterChange}
                showStatusFilter={showStatusFilter}
            />

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
                    action={
                        canCreateActivity ? (
                            <button
                                onClick={handleCreateActivity}
                                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Plus size={18} />
                                <span>Tạo hoạt động mới</span>
                            </button>
                        ) : undefined
                    }
                />
            ) : (
                <>
                    {/* Activity Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activities.map((activity) => (
                            <ActivityCard
                                key={activity.activityId}
                                activity={activity}
                                onRegister={handleRegister}
                                onUnregister={handleUnregister}
                                isRegistering={registeringId === activity.activityId}
                            />
                        ))}
                    </div>

                    {/* Pagination */}
                    {pageData && (
                        <Pagination
                            currentPage={query.pageNumber || 1}
                            totalPages={pageData.totalPages}
                            totalElements={pageData.totalElements}
                            pageSize={PAGE_SIZE}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default ActivityListPage;
