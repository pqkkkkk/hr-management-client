// Mock data for Activity module

import {
    Activity,
    ActivityLog,
    ActivityTemplate,
    ActivityParticipant,
    LeaderboardEntry,
    ActivityStatistics,
    ActivityStatus,
    ActivityLogStatus,
} from "modules/activity/types/activity.types";

// ========== MOCK ACTIVITIES ==========

export const mockActivities: Activity[] = [
    {
        activityId: "ACT001",
        name: "Chạy bộ mùa xuân 2025",
        type: "RUNNING",
        description: "Hoạt động chạy bộ chào đón năm mới 2025. Hãy cùng nhau rèn luyện sức khỏe và tích lũy điểm thưởng!",
        bannerUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800",
        startDate: "2025-01-01T00:00:00Z",
        endDate: "2025-01-31T23:59:59Z",
        status: ActivityStatus.OPEN,
        createdAt: "2024-12-20T08:00:00Z",
        participantsCount: 45,
        creatorId: "NV002",
        creatorName: "Trần Thị B",
    },
    {
        activityId: "ACT002",
        name: "Marathon tháng 2",
        type: "RUNNING",
        description: "Thử thách marathon tháng 2 - Vượt qua giới hạn bản thân với mục tiêu 100km/tháng",
        bannerUrl: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800",
        startDate: "2025-02-01T00:00:00Z",
        endDate: "2025-02-28T23:59:59Z",
        status: ActivityStatus.DRAFT,
        createdAt: "2024-12-25T10:00:00Z",
        participantsCount: 0,
        creatorId: "NV002",
        creatorName: "Trần Thị B",
    },
    {
        activityId: "ACT003",
        name: "Chạy bộ cuối năm 2024",
        type: "RUNNING",
        description: "Hoạt động chạy bộ kết thúc năm 2024 thành công với hơn 50 người tham gia",
        bannerUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=800",
        startDate: "2024-12-01T00:00:00Z",
        endDate: "2024-12-31T23:59:59Z",
        status: ActivityStatus.COMPLETED,
        createdAt: "2024-11-25T08:00:00Z",
        participantsCount: 52,
        creatorId: "NV003",
        creatorName: "Lê Văn C",
    },
    {
        activityId: "ACT004",
        name: "Thử thách 30 ngày",
        type: "RUNNING",
        description: "Hoạt động đã kết thúc sớm do điều kiện thời tiết",
        bannerUrl: "https://images.unsplash.com/photo-1461896836934- voices?w=800",
        startDate: "2024-11-01T00:00:00Z",
        endDate: "2024-11-30T23:59:59Z",
        status: ActivityStatus.CLOSED,
        createdAt: "2024-10-25T08:00:00Z",
        participantsCount: 28,
        creatorId: "NV002",
        creatorName: "Trần Thị B",
    },
];

// ========== MOCK ACTIVITY LOGS ==========

export const mockActivityLogs: ActivityLog[] = [
    {
        activityLogId: "LOG001",
        participantId: "PART001",
        employeeId: "NV001",
        employeeName: "Nguyễn Văn A",
        activityId: "ACT001",
        activityName: "Chạy bộ mùa xuân 2025",
        distance: 5.5,
        durationMinutes: 35,
        proofUrl: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400",
        logDate: "2025-01-05",
        status: ActivityLogStatus.PENDING,
        createdAt: "2025-01-05T07:00:00Z",
        paceMinPerKm: 6.36,
    },
    {
        activityLogId: "LOG002",
        participantId: "PART001",
        employeeId: "NV001",
        employeeName: "Nguyễn Văn A",
        activityId: "ACT001",
        activityName: "Chạy bộ mùa xuân 2025",
        distance: 3.2,
        durationMinutes: 22,
        proofUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400",
        logDate: "2025-01-06",
        status: ActivityLogStatus.APPROVED,
        reviewerId: "NV002",
        reviewerName: "Trần Thị B",
        createdAt: "2025-01-06T06:30:00Z",
        paceMinPerKm: 6.88,
    },
    {
        activityLogId: "LOG003",
        participantId: "PART002",
        employeeId: "NV003",
        employeeName: "Lê Văn C",
        activityId: "ACT001",
        activityName: "Chạy bộ mùa xuân 2025",
        distance: 10.0,
        durationMinutes: 65,
        proofUrl: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400",
        logDate: "2025-01-07",
        status: ActivityLogStatus.PENDING,
        createdAt: "2025-01-07T08:00:00Z",
        paceMinPerKm: 6.5,
    },
    {
        activityLogId: "LOG004",
        participantId: "PART003",
        employeeId: "NV004",
        employeeName: "Phạm Thị D",
        activityId: "ACT001",
        activityName: "Chạy bộ mùa xuân 2025",
        distance: 2.5,
        durationMinutes: 20,
        proofUrl: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400",
        logDate: "2025-01-04",
        status: ActivityLogStatus.REJECTED,
        rejectReason: "Ảnh chụp không rõ thông tin",
        reviewerId: "NV002",
        reviewerName: "Trần Thị B",
        createdAt: "2025-01-04T07:30:00Z",
        paceMinPerKm: 8.0,
    },
];

// ========== MOCK TEMPLATES ==========

export const mockActivityTemplates: ActivityTemplate[] = [
    {
        templateId: "TPL001",
        name: "Chạy bộ cơ bản",
        type: "RUNNING",
        description: "Template cho hoạt động chạy bộ với các trường cơ bản",
        schema: {
            fields: ["distance", "duration", "pace"],
        },
        createdAt: "2024-01-01T00:00:00Z",
    },
    {
        templateId: "TPL002",
        name: "Chạy bộ nâng cao",
        type: "RUNNING",
        description: "Template cho hoạt động chạy bộ với theo dõi calories",
        schema: {
            fields: ["distance", "duration", "pace", "calories", "heartRate"],
        },
        createdAt: "2024-06-01T00:00:00Z",
    },
];

// ========== MOCK PARTICIPANTS ==========

export const mockParticipants: ActivityParticipant[] = [
    {
        participantId: "PART001",
        activityId: "ACT001",
        employeeId: "NV001",
        employeeName: "Nguyễn Văn A",
        registeredAt: "2025-01-01T08:00:00Z",
        totalDistance: 8.7,
        totalLogs: 2,
    },
    {
        participantId: "PART002",
        activityId: "ACT001",
        employeeId: "NV003",
        employeeName: "Lê Văn C",
        registeredAt: "2025-01-02T09:00:00Z",
        totalDistance: 10.0,
        totalLogs: 1,
    },
    {
        participantId: "PART003",
        activityId: "ACT001",
        employeeId: "NV004",
        employeeName: "Phạm Thị D",
        registeredAt: "2025-01-03T10:00:00Z",
        totalDistance: 0,
        totalLogs: 1,
    },
];

// ========== MOCK LEADERBOARD ==========

export const mockLeaderboard: LeaderboardEntry[] = [
    {
        rank: 1,
        employeeId: "u5e6f7a8-c9d0-1234-ef01-345678901234",
        employeeName: "Lê Văn C",
        avatarUrl: "https://i.pravatar.cc/150?u=nv003",
        totalDistance: 45.5,
        totalLogs: 8,
        averagePace: 6.2,
    },
    {
        rank: 2,
        employeeId: "NV001",
        employeeName: "Nguyễn Văn A",
        avatarUrl: "https://i.pravatar.cc/150?u=nv001",
        totalDistance: 38.2,
        totalLogs: 6,
        averagePace: 6.5,
    },
    {
        rank: 3,
        employeeId: "NV005",
        employeeName: "Hoàng Văn E",
        avatarUrl: "https://i.pravatar.cc/150?u=nv005",
        totalDistance: 32.0,
        totalLogs: 5,
        averagePace: 7.0,
    },
    {
        rank: 4,
        employeeId: "NV004",
        employeeName: "Phạm Thị D",
        avatarUrl: "https://i.pravatar.cc/150?u=nv004",
        totalDistance: 25.5,
        totalLogs: 4,
        averagePace: 7.5,
    },
    {
        rank: 5,
        employeeId: "NV006",
        employeeName: "Nguyễn Văn G",
        avatarUrl: "https://i.pravatar.cc/150?u=nv006",
        totalDistance: 18.0,
        totalLogs: 3,
        averagePace: 8.0,
    },
];

// ========== MOCK STATISTICS ==========

export const mockActivityStatistics: ActivityStatistics = {
    activityId: "ACT001",
    totalParticipants: 45,
    totalLogs: 128,
    totalDistance: 542.5,
    averageDistance: 12.06,
    pendingLogsCount: 15,
    approvedLogsCount: 105,
    rejectedLogsCount: 8,
};
