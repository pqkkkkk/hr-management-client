import React, { useState, useCallback } from "react";
import { useApi } from "contexts/ApiContext";
import {
    ActivityLog,
    ActivityLogStatus,
    ActivityLogFilter,
} from "../types/activity.types";
import { useFetchList } from "shared/hooks/use-fetch-list";
import { useQuery } from "shared/hooks/use-query";
import { Pagination, EmptyState, ActivityLogCard } from "../components";
import { toast } from "react-toastify";
import { useAuth } from "contexts/AuthContext";

const PAGE_SIZE = 10;

const PendingLogsPage: React.FC = () => {
    const { activityApi } = useApi();
    const { user } = useAuth();
    const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
    const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

    // Query state - only pending logs
    const { query, updateQuery } = useQuery<ActivityLogFilter>({
        pageNumber: 1,
        pageSize: PAGE_SIZE,
        status: ActivityLogStatus.PENDING,
    });

    // Fetch pending logs
    const {
        data: logs,
        page: pageData,
        isFetching,
        error,
        refetch,
    } = useFetchList<ActivityLogFilter, ActivityLog>(
        activityApi.getActivityLogs.bind(activityApi),
        query
    );

    const handlePageChange = useCallback(
        (page: number) => {
            updateQuery({ pageNumber: page });
        },
        [updateQuery]
    );

    // Approve log
    const handleApprove = async (logId: string) => {
        setProcessingIds((prev) => new Set(prev).add(logId));
        try {
            const response = await activityApi.approveActivityLog(logId, user?.userId);
            if (response.success) {
                toast.success("Đã phê duyệt kết quả");
                refetch();
            } else {
                toast.error(response.message || "Có lỗi xảy ra");
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setProcessingIds((prev) => {
                const next = new Set(prev);
                next.delete(logId);
                return next;
            });
        }
    };

    // Reject log
    const handleReject = async (logId: string) => {
        const reason = window.prompt("Nhập lý do từ chối:");
        if (reason === null) return; // User cancelled

        setProcessingIds((prev) => new Set(prev).add(logId));
        try {
            const response = await activityApi.rejectActivityLog(logId, user?.userId, reason);
            if (response.success) {
                toast.success("Đã từ chối kết quả");
                refetch();
            } else {
                toast.error(response.message || "Có lỗi xảy ra");
            }
        } catch (error) {
            toast.error("Đã có lỗi xảy ra");
        } finally {
            setProcessingIds((prev) => {
                const next = new Set(prev);
                next.delete(logId);
                return next;
            });
        }
    };

    const toggleExpand = (logId: string) => {
        setExpandedLogId((prev) => (prev === logId ? null : logId));
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Phê duyệt kết quả hoạt động</h1>
                <p className="text-gray-600 mt-1">
                    Xem xét và phê duyệt kết quả chạy bộ của nhân viên
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-yellow-400">
                    <div className="text-sm text-gray-600">Chờ phê duyệt</div>
                    <div className="text-2xl font-bold text-yellow-600">
                        {pageData?.totalElements || 0}
                    </div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-400">
                    <div className="text-sm text-gray-600">Đã xử lý hôm nay</div>
                    <div className="text-2xl font-bold text-green-600">--</div>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-blue-400">
                    <div className="text-sm text-gray-600">Tổng quãng đường (pending)</div>
                    <div className="text-2xl font-bold text-blue-600">
                        {logs.reduce((sum, l) => sum + l.distance, 0).toFixed(1)} km
                    </div>
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
            ) : logs.length === 0 ? (
                <EmptyState
                    title="Không có kết quả chờ phê duyệt"
                    description="Tất cả kết quả đã được xử lý."
                />
            ) : (
                <div className="space-y-4">
                    {logs.map((log) => (
                        <ActivityLogCard
                            key={log.activityLogId}
                            log={log}
                            isExpanded={expandedLogId === log.activityLogId}
                            isProcessing={processingIds.has(log.activityLogId)}
                            onToggleExpand={toggleExpand}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            showQuickActions={true}
                            showExpandedActions={true}
                        />
                    ))}

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
                </div>
            )}
        </div>
    );
};

export default PendingLogsPage;
