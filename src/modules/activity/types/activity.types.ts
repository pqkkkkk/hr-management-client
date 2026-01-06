// Activity module types

// ========== ENUMS ==========

export enum ActivityStatus {
    DRAFT = "DRAFT",
    OPEN = "OPEN",
    IN_PROGRESS = "IN_PROGRESS",
    CLOSED = "CLOSED",
    COMPLETED = "COMPLETED",
}

export enum ActivityLogStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
}

export enum ActivityType {
    RUNNING = "RUNNING",
}

// ========== MAIN ENTITIES ==========

export interface Activity {
    activityId: string;
    name: string;
    type: string;
    templateId?: string;
    description?: string;
    bannerUrl?: string;
    startDate: string;
    endDate: string;
    status: ActivityStatus;
    createdAt: string;
    updatedAt?: string;
    config?: Record<string, any>;
    participantsCount?: number;
    creatorId?: string;
    creatorName?: string;
    isRegistered?: boolean;
}

export interface ActivityLog {
    activityLogId: string;
    participantId: string;
    employeeId: string;
    employeeName?: string;
    activityId: string;
    activityName?: string;
    distance: number;
    durationMinutes: number;
    proofUrl?: string;
    logDate: string;
    status: ActivityLogStatus;
    rejectReason?: string;
    reviewerId?: string;
    reviewerName?: string;
    createdAt: string;
    updatedAt?: string;
    paceMinPerKm?: number;
}

export interface ActivityTemplate {
    templateId: string;
    templateName: string;
    type: string;
    description?: string;
    schema?: Record<string, any>;
    createdAt: string;
}

export interface ConfigFieldResponse {
    name: string;
    type: string;
    label: string;
    defaultValue?: any;
    required: boolean;
    description?: string;
}

export interface ConfigSchemaResponse {
    fields: ConfigFieldResponse[];
}

export interface ActivityParticipant {
    participantId: string;
    activityId: string;
    employeeId: string;
    employeeName?: string;
    registeredAt: string;
    totalDistance?: number;
    totalLogs?: number;
}

export interface LeaderboardEntry {
    rank: number;
    employeeId: string;
    employeeName: string;
    avatarUrl?: string;
    totalScore: number;
}

export interface ActivityStatistics {
    activityId: string;
    totalParticipants: number;
    activeParticipants?: number;
    totalLogs: number;
    totalDistance: number;
    averageDistancePerParticipant: number;
    pendingLogs: number;
    approvedLogs: number;
    rejectedLogs: number;
}

// ========== FILTER TYPES ==========

export interface ActivityFilter {
    pageNumber?: number;
    pageSize?: number;
    nameContains?: string;
    type?: string;
    status?: string;
    isActive?: boolean;
    creatorId?: string;
}

export interface ActivityLogFilter {
    pageNumber?: number;
    pageSize?: number;
    activityId?: string;
    employeeId?: string;
    status?: string;
    fromDate?: string;
    toDate?: string;
}

// ========== REQUEST TYPES ==========

export interface CreateActivityRequest {
    name: string;
    type: string;
    templateId?: string;
    description?: string;
    bannerUrl?: string;
    startDate: string;
    endDate: string;
    config?: Record<string, any>;
}

export interface UpdateActivityRequest {
    name?: string;
    description?: string;
    bannerUrl?: string;
    startDate?: string;
    endDate?: string;
    config?: Record<string, any>;
}

export interface UpdateActivityStatusRequest {
    status: ActivityStatus;
}

export interface CreateActivityLogRequest {
    activityId: string;
    employeeId: string;
    employeeName?: string;
    distance: number;
    durationMinutes: number;
    logDate: string;
    proofUrl?: string;
}

export interface RejectActivityLogRequest {
    reason: string;
}

// ========== RESPONSE TYPES ==========

export interface ActivityDetailResponse extends Activity {
    isRegistered?: boolean;
    myTotalDistance?: number;
    myTotalLogs?: number;
}