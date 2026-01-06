// Activity API Service

import { ApiResponse, Page } from "shared/types";
import { dotnetApiClient } from "./api.client";
import {
    Activity,
    ActivityLog,
    ActivityTemplate,
    LeaderboardEntry,
    ActivityStatistics,
    ActivityFilter,
    ActivityLogFilter,
    CreateActivityRequest,
    UpdateActivityRequest,
    CreateActivityLogRequest,
    ActivityStatus,
    ActivityLogStatus,
    ActivityDetailResponse,
    ConfigSchemaResponse,
} from "modules/activity/types/activity.types";
import {
    mockActivities,
    mockActivityLogs,
    mockActivityTemplates,
    mockLeaderboard,
    mockActivityStatistics,
} from "shared/data/activity.data";

// ========== API INTERFACE ==========

export interface ActivityApi {
    // Activities CRUD
    getActivities(employeeId?: string, filter?: ActivityFilter): Promise<ApiResponse<Page<Activity>>>;
    getMyActivities(employeeId: string, filter?: ActivityFilter): Promise<ApiResponse<Page<Activity>>>;
    getActivityById(id: string, employeeId?: string): Promise<ApiResponse<ActivityDetailResponse>>;
    createActivity(data: CreateActivityRequest): Promise<ApiResponse<Activity>>;
    updateActivity(id: string, data: UpdateActivityRequest): Promise<ApiResponse<Activity>>;
    deleteActivity(id: string): Promise<ApiResponse<void>>;

    // Registration
    registerForActivity(activityId: string, employeeId: string): Promise<ApiResponse<void>>;
    unregisterFromActivity(activityId: string, employeeId: string): Promise<ApiResponse<void>>;

    // Status management
    updateActivityStatus(id: string, status: ActivityStatus): Promise<ApiResponse<Activity>>;

    // Statistics & Leaderboard
    getActivityStatistics(id: string): Promise<ApiResponse<ActivityStatistics>>;
    getActivityLeaderboard(id: string): Promise<ApiResponse<LeaderboardEntry[]>>;

    // Activity Logs
    getActivityLogs(filter?: ActivityLogFilter): Promise<ApiResponse<Page<ActivityLog>>>;
    createActivityLog(data: CreateActivityLogRequest): Promise<ApiResponse<ActivityLog>>;
    approveActivityLog(id: string, reviewerId: string): Promise<ApiResponse<ActivityLog>>;
    rejectActivityLog(id: string, reviewerId: string, reason: string): Promise<ApiResponse<ActivityLog>>;

    // Templates
    getActivityTemplates(): Promise<ApiResponse<ActivityTemplate[]>>;
    getTemplateSchema(templateId: string): Promise<ApiResponse<ConfigSchemaResponse>>;
}

// ========== MOCK API IMPLEMENTATION ==========

export class MockActivityApi implements ActivityApi {
    // GET /api/v1/activities
    async getActivities(employeeId?: string, filter?: ActivityFilter): Promise<ApiResponse<Page<Activity>>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const page: Page<Activity> = {
                    content: mockActivities,
                    totalElements: mockActivities.length,
                    totalPages: 1,
                    size: filter?.pageSize || 10,
                    number: filter?.pageNumber || 1,
                    first: true,
                    last: true,
                    numberOfElements: mockActivities.length,
                    empty: mockActivities.length === 0,
                    pageable: {
                        pageNumber: filter?.pageNumber || 1,
                        pageSize: filter?.pageSize || 10,
                        offset: 0,
                        paged: true,
                        unpaged: false,
                        sort: { sorted: false, unsorted: true, empty: true },
                    },
                    sort: { sorted: false, unsorted: true, empty: true },
                };

                resolve({
                    data: page,
                    success: true,
                    statusCode: 200,
                    message: "Activities retrieved successfully",
                });
            }, 500);
        });
    }

    // GET /api/v1/activities/me
    async getMyActivities(employeeId: string, filter?: ActivityFilter): Promise<ApiResponse<Page<Activity>>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Return subset as "my activities"
                const myActivities = mockActivities.slice(0, 2);
                const page: Page<Activity> = {
                    content: myActivities,
                    totalElements: myActivities.length,
                    totalPages: 1,
                    size: filter?.pageSize || 10,
                    number: filter?.pageNumber || 1,
                    first: true,
                    last: true,
                    numberOfElements: myActivities.length,
                    empty: myActivities.length === 0,
                    pageable: {
                        pageNumber: filter?.pageNumber || 1,
                        pageSize: filter?.pageSize || 10,
                        offset: 0,
                        paged: true,
                        unpaged: false,
                        sort: { sorted: false, unsorted: true, empty: true },
                    },
                    sort: { sorted: false, unsorted: true, empty: true },
                };

                resolve({
                    data: page,
                    success: true,
                    statusCode: 200,
                    message: "My activities retrieved successfully",
                });
            }, 500);
        });
    }

    // GET /api/v1/activities/:id
    async getActivityById(id: string): Promise<ApiResponse<ActivityDetailResponse>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const activity = mockActivities.find((a) => a.activityId === id) || mockActivities[0];
                resolve({
                    data: {
                        ...activity,
                        isRegistered: true,
                        myTotalDistance: 8.7,
                        myTotalLogs: 2,
                    },
                    success: true,
                    statusCode: 200,
                    message: "Activity retrieved successfully",
                });
            }, 300);
        });
    }

    // POST /api/v1/activities
    async createActivity(data: CreateActivityRequest): Promise<ApiResponse<Activity>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newActivity: Activity = {
                    activityId: `ACT${Date.now()}`,
                    ...data,
                    status: ActivityStatus.DRAFT,
                    createdAt: new Date().toISOString(),
                    participantsCount: 0,
                };

                resolve({
                    data: newActivity,
                    success: true,
                    statusCode: 201,
                    message: "Activity created successfully",
                });
            }, 800);
        });
    }

    // PUT /api/v1/activities/:id
    async updateActivity(id: string, data: UpdateActivityRequest): Promise<ApiResponse<Activity>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: { ...mockActivities[0], ...data },
                    success: true,
                    statusCode: 200,
                    message: "Activity updated successfully",
                });
            }, 500);
        });
    }

    // DELETE /api/v1/activities/:id
    async deleteActivity(id: string): Promise<ApiResponse<void>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: undefined,
                    success: true,
                    statusCode: 204,
                    message: "Activity deleted successfully",
                });
            }, 500);
        });
    }

    // POST /api/v1/activities/:id/register
    async registerForActivity(activityId: string, employeeId: string): Promise<ApiResponse<void>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: undefined,
                    success: true,
                    statusCode: 200,
                    message: "Đăng ký thành công",
                });
            }, 500);
        });
    }

    // DELETE /api/v1/activities/:id/unregister
    async unregisterFromActivity(activityId: string, employeeId: string): Promise<ApiResponse<void>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: undefined,
                    success: true,
                    statusCode: 200,
                    message: "Hủy đăng ký thành công",
                });
            }, 500);
        });
    }

    // PATCH /api/v1/activities/:id/status
    async updateActivityStatus(id: string, status: ActivityStatus): Promise<ApiResponse<Activity>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: { ...mockActivities[0], status },
                    success: true,
                    statusCode: 200,
                    message: "Activity status updated successfully",
                });
            }, 500);
        });
    }

    // GET /api/v1/activities/:id/statistics
    async getActivityStatistics(id: string): Promise<ApiResponse<ActivityStatistics>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: mockActivityStatistics,
                    success: true,
                    statusCode: 200,
                    message: "Statistics retrieved successfully",
                });
            }, 300);
        });
    }

    // GET /api/v1/activities/:id/leaderboard
    async getActivityLeaderboard(id: string): Promise<ApiResponse<LeaderboardEntry[]>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: mockLeaderboard,
                    success: true,
                    statusCode: 200,
                    message: "Leaderboard retrieved successfully",
                });
            }, 300);
        });
    }

    // GET /api/v1/activity-logs
    async getActivityLogs(filter?: ActivityLogFilter): Promise<ApiResponse<Page<ActivityLog>>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const page: Page<ActivityLog> = {
                    content: mockActivityLogs,
                    totalElements: mockActivityLogs.length,
                    totalPages: 1,
                    size: filter?.pageSize || 10,
                    number: filter?.pageNumber || 1,
                    first: true,
                    last: true,
                    numberOfElements: mockActivityLogs.length,
                    empty: mockActivityLogs.length === 0,
                    pageable: {
                        pageNumber: filter?.pageNumber || 1,
                        pageSize: filter?.pageSize || 10,
                        offset: 0,
                        paged: true,
                        unpaged: false,
                        sort: { sorted: false, unsorted: true, empty: true },
                    },
                    sort: { sorted: false, unsorted: true, empty: true },
                };

                resolve({
                    data: page,
                    success: true,
                    statusCode: 200,
                    message: "Activity logs retrieved successfully",
                });
            }, 500);
        });
    }

    // POST /api/v1/activity-logs
    async createActivityLog(data: CreateActivityLogRequest): Promise<ApiResponse<ActivityLog>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                const newLog: ActivityLog = {
                    activityLogId: `LOG${Date.now()}`,
                    participantId: `PART${Date.now()}`,
                    employeeId: "NV001",
                    employeeName: "Nguyễn Văn A",
                    activityName: "Chạy bộ mùa xuân 2025",
                    ...data,
                    status: ActivityLogStatus.PENDING,
                    createdAt: new Date().toISOString(),
                    paceMinPerKm: data.durationMinutes / data.distance,
                };

                resolve({
                    data: newLog,
                    success: true,
                    statusCode: 201,
                    message: "Ghi nhận kết quả thành công",
                });
            }, 800);
        });
    }

    // PATCH /api/v1/activity-logs/:id/approve
    async approveActivityLog(id: string, reviewerId: string): Promise<ApiResponse<ActivityLog>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: { ...mockActivityLogs[0], status: ActivityLogStatus.APPROVED },
                    success: true,
                    statusCode: 200,
                    message: "Đã phê duyệt kết quả",
                });
            }, 500);
        });
    }

    // PATCH /api/v1/activity-logs/:id/reject
    async rejectActivityLog(id: string, reviewerId: string, reason: string): Promise<ApiResponse<ActivityLog>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        ...mockActivityLogs[0],
                        status: ActivityLogStatus.REJECTED,
                        rejectReason: reason,
                    },
                    success: true,
                    statusCode: 200,
                    message: "Đã từ chối kết quả",
                });
            }, 500);
        });
    }

    // GET /api/v1/activity-templates
    async getActivityTemplates(): Promise<ApiResponse<ActivityTemplate[]>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: mockActivityTemplates,
                    success: true,
                    statusCode: 200,
                    message: "Templates retrieved successfully",
                });
            }, 300);
        });
    }

    // GET /api/v1/activity-templates/:id/schema
    async getTemplateSchema(templateId: string): Promise<ApiResponse<ConfigSchemaResponse>> {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock schema for RUNNING_SIMPLE template
                const mockSchema: ConfigSchemaResponse = {
                    fields: [
                        {
                            name: "min_pace",
                            type: "number",
                            label: "Pace tối thiểu (phút/km)",
                            defaultValue: 4.0,
                            required: true,
                            description: "Pace tối thiểu cho phép. Pace = thời gian / khoảng cách"
                        },
                        {
                            name: "max_pace",
                            type: "number",
                            label: "Pace tối đa (phút/km)",
                            defaultValue: 15.0,
                            required: true,
                            description: "Pace tối đa cho phép"
                        },
                        {
                            name: "min_distance_per_log",
                            type: "number",
                            label: "Khoảng cách tối thiểu/lần (km)",
                            defaultValue: 1.0,
                            required: true,
                            description: "Khoảng cách tối thiểu cho mỗi lần ghi nhận"
                        },
                        {
                            name: "max_distance_per_day",
                            type: "number",
                            label: "Khoảng cách tối đa/ngày (km)",
                            defaultValue: 42.0,
                            required: true,
                            description: "Khoảng cách tối đa được tính điểm trong một ngày"
                        },
                        {
                            name: "points_per_km",
                            type: "number",
                            label: "Điểm/km",
                            defaultValue: 10,
                            required: true,
                            description: "Số điểm nhận được cho mỗi km chạy"
                        },
                        {
                            name: "bonus_weekend_multiplier",
                            type: "number",
                            label: "Hệ số cuối tuần",
                            defaultValue: 1.5,
                            required: true,
                            description: "Hệ số nhân điểm cho hoạt động vào Thứ 7 và Chủ Nhật"
                        }
                    ]
                };

                resolve({
                    data: mockSchema,
                    success: true,
                    statusCode: 200,
                    message: "Template schema retrieved successfully",
                });
            }, 300);
        });
    }
}

// ========== REST API IMPLEMENTATION ==========

export class RestActivityApi implements ActivityApi {
    async getActivities(employeeId?: string, filter?: ActivityFilter): Promise<ApiResponse<Page<Activity>>> {
        return dotnetApiClient.get(`/activities`, { params: { ...filter, employeeId } });
    }

    async getMyActivities(employeeId: string, filter?: ActivityFilter): Promise<ApiResponse<Page<Activity>>> {
        return dotnetApiClient.get(`/activities/me`, { params: { ...filter, employeeId } });
    }

    async getActivityById(id: string, employeeId?: string): Promise<ApiResponse<ActivityDetailResponse>> {
        return dotnetApiClient.get(`/activities/${id}`, { params: { employeeId } });
    }

    async createActivity(data: CreateActivityRequest): Promise<ApiResponse<Activity>> {
        return dotnetApiClient.post(`/activities`, data);
    }

    async updateActivity(id: string, data: UpdateActivityRequest): Promise<ApiResponse<Activity>> {
        return dotnetApiClient.put(`/activities/${id}`, data);
    }

    async deleteActivity(id: string): Promise<ApiResponse<void>> {
        return dotnetApiClient.delete(`/activities/${id}`);
    }

    async registerForActivity(activityId: string, employeeId: string): Promise<ApiResponse<void>> {
        return dotnetApiClient.post(`/activities/${activityId}/register?employeeId=${employeeId}`);
    }

    async unregisterFromActivity(activityId: string, employeeId: string): Promise<ApiResponse<void>> {
        return dotnetApiClient.delete(`/activities/${activityId}/unregister?employeeId=${employeeId}`);
    }

    async updateActivityStatus(id: string, status: ActivityStatus): Promise<ApiResponse<Activity>> {
        return dotnetApiClient.patch(`/activities/${id}/status`, { status });
    }

    async getActivityStatistics(id: string): Promise<ApiResponse<ActivityStatistics>> {
        return dotnetApiClient.get(`/activities/${id}/statistics`);
    }

    async getActivityLeaderboard(id: string): Promise<ApiResponse<LeaderboardEntry[]>> {
        return dotnetApiClient.get(`/activities/${id}/leaderboard`);
    }

    async getActivityLogs(filter?: ActivityLogFilter): Promise<ApiResponse<Page<ActivityLog>>> {
        return dotnetApiClient.get(`/activity-logs`, { params: filter });
    }

    async createActivityLog(data: CreateActivityLogRequest): Promise<ApiResponse<ActivityLog>> {
        return dotnetApiClient.post(`/activity-logs`, data);
    }

    async approveActivityLog(id: string, reviewerId: string): Promise<ApiResponse<ActivityLog>> {
        return dotnetApiClient.patch(`/activity-logs/${id}/approve?reviewerId=${reviewerId}`);
    }

    async rejectActivityLog(id: string, reviewerId: string, reason: string): Promise<ApiResponse<ActivityLog>> {
        return dotnetApiClient.patch(`/activity-logs/${id}/reject?reviewerId=${reviewerId}`, { reason });
    }

    async getActivityTemplates(): Promise<ApiResponse<ActivityTemplate[]>> {
        return dotnetApiClient.get(`/activity-templates`);
    }

    async getTemplateSchema(templateId: string): Promise<ApiResponse<ConfigSchemaResponse>> {
        return dotnetApiClient.get(`/activity-templates/${templateId}/schema`);
    }
}
