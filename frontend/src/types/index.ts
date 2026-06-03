export type EnrollmentStatus = 'active' | 'at_risk';
export type TaskStatus = 'todo' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type UrgencyLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Student {
    id: string;
    name: string;
    email: string;
    grade: number;
    gpa: number;
    counselorId: string;
    enrollmentStatus: EnrollmentStatus;
}

export interface Task {
    id: string;
    studentId: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface TaskDriftInfo {
    driftDays: number;
    driftLevel: 'FRESH' | 'AGEING' | 'STALE' | 'FROZEN';
    warningMessage: string | null;
}

export interface EnrichedTask extends Task {
    drift: TaskDriftInfo;
}

export interface Message {
    id: string;
    studentId: string;
    from: string;
    subject: string;
    preview: string;
    read: boolean;
    receivedAt: string;
}

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


export interface TriageStudentItem {
    student: Student;
    urgency: UrgencyResult;
    overdueTaskCount: number;
    unreadMessageCount: number;
    momentum: MomentumInfo;
    attentionDebt: AttentionDebtResult;
    followThroughRate: number | null;
}

export interface TriageEntry {
    student: Student;
    urgency: UrgencyResult;
    overdueTaskCount: number;
    unreadMessageCount: number;
}

export interface TriageResponse {
    counselorId: string;
    totalStudents: number;
    criticalCount: number;
    highCount: number;
    attentionDebtCount: number;
    students: TriageStudentItem[];
    rankedStudents?: TriageEntry[];
    generatedAt: string;
}

export interface UpdateTaskStatusResponse {
    success: boolean;
    taskId: string;
    updateStatus: TaskStatus;
    updatedAt: string;
    newUrgency: UrgencyResult;
}