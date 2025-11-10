import { ActivityStatus } from 'shared/types';

export interface Activity {
  id: string;
  title: string;
  description: string;
  benefits: string;
  status: ActivityStatus;
  registrationDeadline: Date | string;
  startDate: Date | string;
  endDate: Date | string;
  maxParticipants?: number;
  currentParticipants: number;
  points: number;
  createdBy: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ActivityParticipant {
  id: string;
  activityId: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  registeredAt: Date | string;
  achievement?: number;
  rank?: number;
  certificateUrl?: string;
  pointsEarned?: number;
}

export interface ActivityRegistration {
  activityId: string;
  employeeId: string;
}

export interface ActivityResult {
  activityId: string;
  employeeId: string;
  achievement: number;
  notes?: string;
}

export interface ActivitySummary {
  activity: Activity;
  participants: ActivityParticipant[];
  totalParticipants: number;
  averageAchievement?: number;
}

export interface ActivityRanking {
  activityId: string;
  rankings: ActivityParticipant[];
}

export interface ActivityFilterOptions {
  status?: ActivityStatus;
  isRegistered?: boolean;
  searchQuery?: string;
}

export interface ActivityCertificate {
  id: string;
  activityId: string;
  activityName: string;
  employeeId: string;
  employeeName: string;
  employeeCode: string;
  achievement: number;
  issuedDate: Date | string;
  certificateUrl: string;
}
