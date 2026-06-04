import { UrgencyResult } from "../types/actionCenter";
import { Message } from "../types/message";
import { Student } from "../types/students";
import { Task } from "../types/task";

const TEACHER_PATTERNS =
  /Mrs\.|Mr\.|Ms\.|Dr\.|\(Math\)|\(English\)|\(Science\)|\(History\)/;

function isTeacherMessage(message: Message): boolean {
  return TEACHER_PATTERNS.test(message.from);
}

function getTopDriver(urgency: UrgencyResult): string {
  const { breakdown } = urgency;

  const drivers: Array<[string, number]> = [
    ["overdue tasks", breakdown.overdueTaskPoints],
    ["urgent tasks", breakdown.urgentTaskPoints],
    ["at-risk enrollment status", breakdown.atRiskBonus],
    ["high priority tasks", breakdown.highPriorityPoints],
    ["unread messages", breakdown.unreadMessagePoints],
  ];

  const [topLabel] = drivers.sort((a, b) => b[1] - a[1])[0] as [string, number];

  return topLabel;
}

export function generateInsight(
  student: Student,
  tasks: Task[],
  messages: Message[],
  urgency: UrgencyResult,
): string {
    const { breakdown, level } = urgency;
    const { overdueCount, unreadCount } = breakdown;
    const name = student.name.split(" ")[0];

    const completedCount = tasks.filter(t => t.status === 'completed').length;
    const openTaskCount = tasks.filter(t => t.status !== 'completed').length;
    const unreadMessages = messages.filter(m => !m.read);
    const hasUnreadTeacherMessage = unreadMessages.some(isTeacherMessage);

     // PATTERN 1 — Disengagement
  if (overdueCount >= 2 && unreadCount >= 2 && student.enrollmentStatus === 'at_risk') {
    return (
      `Multiple simultaneous warning signs suggest active disengagement. ` +
      `${name} is missing deadlines while teacher messages go unread. ` +
      `Direct outreach required — task reminders alone are insufficient.`
    );
  }

  // PATTERN 2 — Academic Crisis
  if (overdueCount >= 1 && hasUnreadTeacherMessage) {
    return (
      `Academic performance is at a critical point. ${name} has overdue work ` +
      `and unread communications from teaching staff. ` +
      `A structured support plan should be initiated this week.`
    );
  }

  // PATTERN 3 — At-Risk but Progressing
  if (
    student.enrollmentStatus === 'at_risk' &&
    completedCount >= 1 &&
    overdueCount === 0
  ) {
    return (
      `${name} is flagged at-risk but demonstrating progress — ${completedCount} task(s) completed ` +
      `with no current overdue items. Maintain check-ins to sustain momentum.`
    );
  }

  // PATTERN 4 — Senior Urgency
  if (student.grade >= 12 && (level === 'HIGH' || level === 'CRITICAL')) {
    return (
      `Senior-year urgency detected. Outstanding tasks at this stage carry ` +
      `direct college application consequences. Immediate counselor involvement is recommended.`
    );
  }

  // PATTERN 5 — High score, no specific pattern
  if (level === 'HIGH' || level === 'CRITICAL') {
    const topDriver = getTopDriver(urgency);
    return (
      `Urgency score is ${urgency.score} (${level}). Key driver: ${topDriver}. ` +
      `Review all open tasks and schedule a check-in this week.`
    );
  }

  // PATTERN 6 — Default
  return (
    `${name} is currently stable with ${openTaskCount} open task(s) and ` +
    `${unreadCount} unread message(s). No immediate intervention required.`
  );
}
