import { UrgencyBreakdown, UrgencyLevel, UrgencyResult } from "../types/actionCenter";
import { Message } from "../types/message";
import { Student } from "../types/students";
import { Task } from "../types/task";
import { isOverdue } from "../utils/date.utils";

const POINTS = {
  AT_RISK_BONUS: 30,
  URGENT_TASK: 20,
  OVERDUE_TASK: 25,
  HIGH_PRIORITY: 10,
  UNREAD_MESSAGE: 5,
} as const;

function scoreToLevel(score: number): UrgencyLevel {
  if (score >= 86) return "CRITICAL";
  if (score >= 61) return "HIGH";
  if (score >= 31) return "MEDIUM";
  return "LOW";
}

export function calculateUrgency(
  student: Student,
  tasks: Task[],
  messages: Message[],
): UrgencyResult {
  const activeTasks = tasks.filter((t) => t.status !== "completed");

  const overdueCount = activeTasks.filter((t) => isOverdue(t.dueDate)).length;
  const urgentCount = activeTasks.filter(t => t.priority === 'urgent').length;
  const highCount = activeTasks.filter(t => t.priority === 'high').length;
  const unreadCount = messages.filter(m => !m.read).length;

  const atRiskBonus = student.enrollmentStatus === 'at_risk' ? POINTS.AT_RISK_BONUS : 0;
  const urgentTaskPoints = urgentCount * POINTS.URGENT_TASK;
  const overdueTaskPoints = overdueCount * POINTS.OVERDUE_TASK;
  const highPriorityPoints = highCount * POINTS.HIGH_PRIORITY;
  const unreadMessagePoints = unreadCount * POINTS.UNREAD_MESSAGE;

  const score = atRiskBonus + urgentTaskPoints + overdueTaskPoints + highPriorityPoints + unreadMessagePoints;

  const breakdown: UrgencyBreakdown = {
    atRiskBonus,
    urgentTaskPoints,
    overdueTaskPoints,
    highPriorityPoints,
    unreadMessagePoints,
    overdueCount,
    urgentCount,
    unreadCount,
  };

  return {
    score,
    level: scoreToLevel(score),
    breakdown,
  };
}
