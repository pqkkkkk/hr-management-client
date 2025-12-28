import React from "react";
import { ActivityLog } from "../types/activity.types";
import { Clock, MapPin, Calendar, User, Check, X, Image } from "lucide-react";
import { formatDuration } from "shared/utils/date-utils";

// ========== UTILITY FUNCTIONS ==========

export const calculatePace = (distance: number, durationMinutes: number): string => {
    if (distance <= 0) return "--:-- /km";
    const paceMinPerKm = durationMinutes / distance;
    const mins = Math.floor(paceMinPerKm);
    const secs = Math.round((paceMinPerKm - mins) * 60);
    return `${mins}:${secs.toString().padStart(2, "0")} /km`;
};

// ========== EXPANDED CONTENT COMPONENT ==========

interface ExpandedLogContentProps {
    log: ActivityLog;
    isProcessing: boolean;
    onApprove?: (logId: string) => void;
    onReject?: (logId: string) => void;
    showActions?: boolean;
}

export const ExpandedLogContent: React.FC<ExpandedLogContentProps> = ({
    log,
    isProcessing,
    onApprove,
    onReject,
    showActions = true,
}) => {
    return (
        <div className="px-4 pb-4 border-t border-gray-100">
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Details */}
                <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Chi tiết</h4>
                    <div className="text-sm space-y-2">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Hoạt động:</span>
                            <span className="font-medium">{log.activityName || log.activityId}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Quãng đường:</span>
                            <span className="font-medium">{log.distance} km</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Thời gian:</span>
                            <span className="font-medium">{formatDuration(log.durationMinutes)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Tốc độ:</span>
                            <span className="font-medium">
                                {calculatePace(log.distance, log.durationMinutes)}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Ngày chạy:</span>
                            <span className="font-medium">
                                {new Date(log.logDate).toLocaleDateString("vi-VN")}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500">Ngày gửi:</span>
                            <span className="font-medium">
                                {new Date(log.createdAt).toLocaleDateString("vi-VN")}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Proof */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-3">Ảnh chứng minh</h4>
                    {log.proofUrl ? (
                        <a
                            href={log.proofUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <img
                                src={log.proofUrl}
                                alt="Proof"
                                className="w-full h-48 object-cover rounded-lg border hover:opacity-90 transition-opacity"
                            />
                        </a>
                    ) : (
                        <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg text-gray-400">
                            <div className="text-center">
                                <Image size={40} className="mx-auto mb-2" />
                                <span className="text-sm">Không có ảnh</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Action buttons at bottom */}
            {showActions && onApprove && onReject && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
                    <button
                        onClick={() => onApprove(log.activityLogId)}
                        disabled={isProcessing}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                        <Check size={18} />
                        Phê duyệt
                    </button>
                    <button
                        onClick={() => onReject(log.activityLogId)}
                        disabled={isProcessing}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                        <X size={18} />
                        Từ chối
                    </button>
                </div>
            )}
        </div>
    );
};

// ========== ACTIVITY LOG CARD COMPONENT ==========

interface ActivityLogCardProps {
    log: ActivityLog;
    isExpanded: boolean;
    isProcessing: boolean;
    onToggleExpand: (logId: string) => void;
    onApprove?: (logId: string) => void;
    onReject?: (logId: string) => void;
    showQuickActions?: boolean;
    showExpandedActions?: boolean;
}

const ActivityLogCard: React.FC<ActivityLogCardProps> = ({
    log,
    isExpanded,
    isProcessing,
    onToggleExpand,
    onApprove,
    onReject,
    showQuickActions = true,
    showExpandedActions = true,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {/* Main Row */}
            <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onToggleExpand(log.activityLogId)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {/* Avatar placeholder */}
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <User size={24} className="text-blue-600" />
                        </div>

                        {/* Info */}
                        <div>
                            <div className="font-medium text-gray-900">
                                {log.employeeName || `Nhân viên ${log.employeeId}`}
                            </div>
                            <div className="text-sm text-gray-500 flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    {new Date(log.logDate).toLocaleDateString("vi-VN")}
                                </span>
                                <span className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    {log.distance} km
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock size={14} />
                                    {formatDuration(log.durationMinutes)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Pace badge */}
                        <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                            {calculatePace(log.distance, log.durationMinutes)}
                        </div>

                        {/* Quick Actions */}
                        {showQuickActions && onApprove && onReject && (
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                <button
                                    onClick={() => onApprove(log.activityLogId)}
                                    disabled={isProcessing}
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                    title="Phê duyệt"
                                >
                                    <Check size={20} />
                                </button>
                                <button
                                    onClick={() => onReject(log.activityLogId)}
                                    disabled={isProcessing}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                    title="Từ chối"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        )}

                        {/* Expand indicator */}
                        <svg
                            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Expanded Content */}
            {isExpanded && (
                <ExpandedLogContent
                    log={log}
                    isProcessing={isProcessing}
                    onApprove={onApprove}
                    onReject={onReject}
                    showActions={showExpandedActions}
                />
            )}
        </div>
    );
};

export default ActivityLogCard;
