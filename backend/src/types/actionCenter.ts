import { Message } from "./message";
import { Student } from "./students";
import { Task, TaskStatus } from "./task";

export type UrgencyLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface UrgencyBreakdown {
  atRiskBonus: number;
  urgentTaskPoints: number;
  overdueTaskPoints: number;
  highPriorityPoints: number;
  unreadMessagePoints: number;
  overdueCount: number;
  urgentCount: number;
  unreadCount: number;
}

export interface UrgencyResult {
  score: number;
  level: UrgencyLevel;
  breakdown: UrgencyBreakdown;
}

export interface TaskDriftInfo {
  driftDays: number;
  driftLevel: 'FRESH' | 'AGEING' | 'STALE' | 'FROZEN';
  warningMessage: string | null;
}

export interface EnrichedTask extends Task {
  drift: TaskDriftInfo;
}

export interface MomentumResult {
  level: 'ACTIVE' | 'MOVING' | 'SLOWING' | 'STALLED';
  averageDriftDays: number;
  frozenTaskCount: number;
  color: string;
}

export interface AttentionDebtResult {
  lastActionDate: string;
  daysSinceLastAction: number;
  level: 'CURRENT' | 'DUE' | 'OVERDUE' | 'CRITICAL';
  message: string | null;
}

export interface FollowThroughResult {
  totalTasks: number;
  completedTasks: number;
  rate: number | null;
  label: string;
  interpretation: string;
}

export interface ActionCenterResponse {
  student: Student;
  tasks: EnrichedTask[];
  messages: Message[];
  urgency: UrgencyResult;
  momentum: MomentumResult;
  insight: string;
  nextBestAction: string;
  attentionDebt: AttentionDebtResult;
  followThrough: FollowThroughResult;
}

export interface MomentumInfo {
  level: string;
  averageDriftDays: number;
  frozenTaskCount: number;
}

export interface AttentionDebtInfo {
  daysSinceLastAction: number;
  level: string;
  message: string | null;
  lastActionDate: string | null;
}

export interface TriageStudentItem {
  student: Student;
  urgency: UrgencyResult;
  overdueTaskCount: number;
  unreadMessageCount: number;
  momentum: MomentumInfo;
  attentionDebt: AttentionDebtInfo;
  followThroughRate: number | null;
}

export interface TriageResponse {
  counselorId: string;
  totalStudents: number;
  criticalCount: number;
  highCount: number;
  attentionDebtCount: number;
  students: TriageStudentItem[];
  generatedAt: string;
}

export interface UpdateTaskStatusResponse {
  success: boolean;
  taskId: string;
  updatedSuccess: TaskStatus;
  updatedAt: string;
  newUrgency: UrgencyResult;
}

export interface ErrorResponse {
    requestId: string;
    error: string;
}