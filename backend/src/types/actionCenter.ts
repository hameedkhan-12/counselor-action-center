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

export interface ActionCenterResponse {
  student: Student;
  tasks: Task[];
  messages: Message[];
  urgency: UrgencyResult;
  insight: string;
  nextBaseAction: string;
}

export interface TriageEntry {
  student: Student;
  urgency: UrgencyResult;
  overdueTaskCount: number;
  unreadMessageCount: number;
}

export interface TriageResponse {
  counselorId: string;
  entries: TriageEntry[];
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