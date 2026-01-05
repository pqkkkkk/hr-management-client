import React, { useState, useRef, useEffect } from "react";
import { Activity, ActivityStatus } from "../types/activity.types";
import {
    Calendar,
    Users,
    UserPlus,
    UserMinus,
    Eye,
    Settings,
    BarChart3,
    MoreVertical,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "contexts/AuthContext";

interface ActivityCardProps {
    activity: Activity;
    onRegister?: (activityId: string) => void;
    onUnregister?: (activityId: string) => void;
    isRegistering?: boolean;
}

const statusConfig: Record<ActivityStatus, { label: string; className: string }> = {
    [ActivityStatus.DRAFT]: {
        label: "Nháp",
        className: "bg-gray-100 text-gray-700",
    },
    [ActivityStatus.OPEN]: {
        label: "Sắp diễn ra",
        className: "bg-green-100 text-green-700",
    },
    [ActivityStatus.CLOSED]: {
        label: "Đã đóng",
        className: "bg-orange-100 text-orange-700",
    },
    [ActivityStatus.COMPLETED]: {
        label: "Hoàn thành",
        className: "bg-blue-100 text-blue-700",
    },
    [ActivityStatus.IN_PROGRESS]: {
        label: "Đang diễn ra",
        className: "bg-green-100 text-green-700",
    },
};

// ========== DROPDOWN MENU COMPONENT ==========

interface DropdownMenuProps {
    isOpen: boolean;
    onClose: () => void;
    items: { label: string; icon: React.ReactNode; onClick: () => void }[];
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ isOpen, onClose, items }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen || items.length === 0) return null;

    return (
        <div
            ref={menuRef}
            className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20"
        >
            {items.map((item, index) => (
                <button
                    key={index}
                    onClick={(e) => {
                        e.stopPropagation();
                        item.onClick();
                        onClose();
                    }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    {item.icon}
                    <span>{item.label}</span>
                </button>
            ))}
        </div>
    );
};

// ========== MAIN COMPONENT ==========

const ActivityCard: React.FC<ActivityCardProps> = ({
    activity,
    onRegister,
    onUnregister,
    isRegistering = false,
}) => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [menuOpen, setMenuOpen] = useState(false);

    const status = statusConfig[activity.status] || statusConfig[ActivityStatus.DRAFT];
    const isAdmin = user?.role === "MANAGER" || user?.role === "HR" || user?.role === "ADMIN";
    const canRegister = activity.status === ActivityStatus.OPEN || activity.status === ActivityStatus.IN_PROGRESS;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const handleCardClick = () => {
        navigate(`/activities/${activity.activityId}`);
    };

    const handleViewDetail = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/activities/${activity.activityId}`);
    };

    const handleRegister = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onRegister) {
            onRegister(activity.activityId);
        }
    };

    const handleUnregister = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onUnregister) {
            onUnregister(activity.activityId);
        }
    };

    const handleManage = () => {
        navigate(`/activities/manage/${activity.activityId}/edit`);
    };

    const handleViewStats = () => {
        navigate(`/activities/manage/${activity.activityId}/summary`);
    };

    // Build dropdown menu items for admin
    const menuItems = [];
    if (isAdmin) {
        menuItems.push({
            label: "Quản lý",
            icon: <Settings size={16} />,
            onClick: handleManage,
        });
        menuItems.push({
            label: "Xem thống kê",
            icon: <BarChart3 size={16} />,
            onClick: handleViewStats,
        });
    }

    return (
        <div
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
            onClick={handleCardClick}
        >
            {/* Banner */}
            <div className="h-40 bg-gradient-to-r from-blue-500 to-purple-600 relative overflow-hidden">
                {activity.bannerUrl ? (
                    <img
                        src={activity.bannerUrl}
                        alt={activity.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-4xl font-bold opacity-20">
                            {activity.type}
                        </span>
                    </div>
                )}
                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.className}`}>
                        {status.label}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {activity.name}
                </h3>

                {activity.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {activity.description}
                    </p>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    {/* Date Range */}
                    <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                            {formatDate(activity.startDate)} - {formatDate(activity.endDate)}
                        </span>
                    </div>

                    {/* Participants */}
                    <div className="flex items-center gap-1">
                        <Users size={14} />
                        <span>{activity.participantsCount || 0} người</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                    {/* Primary Action - Register/Unregister */}
                    {canRegister && onRegister && onUnregister && (
                        <>
                            {activity.isRegistered ? (
                                <button
                                    onClick={handleUnregister}
                                    disabled={isRegistering}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                                >
                                    {isRegistering ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                                    ) : (
                                        <>
                                            <UserMinus size={16} />
                                            <span>Hủy đăng ký</span>
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={handleRegister}
                                    disabled={isRegistering}
                                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                                >
                                    {isRegistering ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <>
                                            <UserPlus size={16} />
                                            <span>Đăng ký</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </>
                    )}

                    {/* View Detail Button */}
                    <button
                        onClick={handleViewDetail}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <Eye size={16} />
                        <span>Chi tiết</span>
                    </button>

                    {/* Spacer */}
                    <div className="flex-1"></div>

                    {/* More Menu - Admin only */}
                    {isAdmin && menuItems.length > 0 && (
                        <div className="relative">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setMenuOpen(!menuOpen);
                                }}
                                className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <MoreVertical size={18} />
                            </button>
                            <DropdownMenu
                                isOpen={menuOpen}
                                onClose={() => setMenuOpen(false)}
                                items={menuItems}
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActivityCard;
