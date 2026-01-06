import React from "react";
import { LeaderboardEntry } from "../types/activity.types";
import { Trophy, Medal, TrendingUp } from "lucide-react";

interface LeaderboardTableProps {
    entries: LeaderboardEntry[];
    currentUserId?: string;
}

// ========== CURRENT USER RANK CARD ==========

interface CurrentUserRankProps {
    entry: LeaderboardEntry;
    totalParticipants: number;
}

const CurrentUserRankCard: React.FC<CurrentUserRankProps> = ({ entry, totalParticipants }) => {
    const getRankLabel = (rank: number) => {
        if (rank === 1) return "🥇 Hạng nhất";
        if (rank === 2) return "🥈 Hạng nhì";
        if (rank === 3) return "🥉 Hạng ba";
        return `Hạng ${rank}`;
    };



    return (
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-4 mb-6 text-white">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                        {entry.rank <= 3 ? (
                            <Trophy size={32} className="text-yellow-300" />
                        ) : (
                            <span className="text-2xl font-bold">{entry.rank}</span>
                        )}
                    </div>
                    <div>
                        <div className="text-sm text-white/80">Xếp hạng của bạn</div>
                        <div className="text-2xl font-bold">{getRankLabel(entry.rank)}</div>
                        <div className="text-sm text-white/80">
                            trong {totalParticipants} người tham gia
                        </div>
                    </div>
                </div>

                <div className="flex gap-6 text-right">
                    <div>
                        <div className="text-2xl font-bold">{entry?.totalScore}</div>
                        <div className="text-sm text-white/80">điểm</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ========== LEADERBOARD TABLE ==========

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
    entries,
    currentUserId,
}) => {
    const getRankIcon = (rank: number) => {
        if (rank === 1) return <Trophy size={20} className="text-yellow-500" />;
        if (rank === 2) return <Medal size={20} className="text-gray-400" />;
        if (rank === 3) return <Medal size={20} className="text-amber-600" />;
        return <span className="text-gray-600 font-medium">{rank}</span>;
    };

    const getRankBgColor = (rank: number) => {
        if (rank === 1) return "bg-yellow-50";
        if (rank === 2) return "bg-gray-50";
        if (rank === 3) return "bg-amber-50";
        return "";
    };



    // Find current user's entry
    const currentUserEntry = currentUserId
        ? entries.find((e) => e.employeeId === currentUserId)
        : undefined;

    if (entries.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                Chưa có dữ liệu bảng xếp hạng
            </div>
        );
    }

    return (
        <div>
            {/* Current User Rank Card */}
            {currentUserEntry && (
                <CurrentUserRankCard
                    entry={currentUserEntry}
                    totalParticipants={entries.length}
                />
            )}

            {/* Leaderboard Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 w-16">
                                Hạng
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600">
                                Thành viên
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600">
                                Tổng điểm
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {entries.map((entry) => {
                            const isCurrentUser = entry.employeeId === currentUserId;
                            return (
                                <tr
                                    key={entry.employeeId}
                                    className={`border-b border-gray-100 ${getRankBgColor(entry.rank)} ${isCurrentUser ? "ring-2 ring-blue-500 ring-inset" : ""
                                        }`}
                                >
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center w-8 h-8">
                                            {getRankIcon(entry.rank)}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={entry.avatarUrl || `https://i.pravatar.cc/40?u=${entry.employeeId}`}
                                                alt={entry.employeeName}
                                                className="w-10 h-10 rounded-full object-cover"
                                            />
                                            <div>
                                                <div className={`font-medium ${isCurrentUser ? "text-blue-600" : "text-gray-900"}`}>
                                                    {entry.employeeName}
                                                    {isCurrentUser && (
                                                        <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                                                            Bạn
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <span className="font-semibold text-gray-900">
                                            {entry?.totalScore}
                                        </span>
                                        <span className="text-gray-500 text-sm ml-1">điểm</span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LeaderboardTable;
