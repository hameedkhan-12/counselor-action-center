import type { Task } from '../types/task';
import type { Message } from '../types/message';
import type { UrgencyResult } from '../types/actionCenter';
import { daysUntilDue } from '../utils/date.utils';
import { Student } from '../types/students';

const TEACHER_PATTERNS = /Mrs\.|Mr\.|Ms\.|Dr\.|\(Math\)|\(English\)|\(Science\)|\(History\)/;

function isTeacherMessage(message: Message): boolean {
  return TEACHER_PATTERNS.test(message.from);
}

export function getNextBestAction(
  student: Student,
  tasks: Task[],
  messages: Message[],
  urgency: UrgencyResult
): string {
  const { breakdown, level } = urgency;
  const { overdueCount, unreadCount } = breakdown;
  const name = student.name.split(' ')[0];

  // RULE 1 — Critical Score
  if (level === 'CRITICAL') {
    return 'Immediate intervention required — contact parent and schedule a same-day counselor meeting.';
  }

  // RULE 2 — Multiple Overdue Tasks
  if (overdueCount > 2) {
    return `Call parent today — ${name} has ${overdueCount} overdue tasks requiring guardian awareness.`;
  }

  // RULE 3 — At-Risk + Unread Teacher Message
  const unreadMessages = messages.filter((m) => !m.read);
  const hasUnreadTeacherMessage = unreadMessages.some(isTeacherMessage);
  if (student.enrollmentStatus === 'at_risk' && hasUnreadTeacherMessage) {
    return `Schedule counselor meeting within 48 hours — at-risk student has unread communications from teaching staff.`;
  }

  // RULE 4 — At-Risk (no teacher message)
  if (student.enrollmentStatus === 'at_risk') {
    return `Schedule a counselor check-in this week to review ${name}'s current standing.`;
  }

  // RULE 5 — Many Unread Messages
  if (unreadCount > 3) {
    return `Follow up with ${name} — ${unreadCount} messages are awaiting a response.`;
  }

  // RULE 6 — Upcoming Urgent Deadline within 48 hours
  const urgentActiveTasks = tasks.filter(
    (t) => t.status !== 'completed' && t.priority === 'urgent'
  );
  for (const task of urgentActiveTasks) {
    const days = daysUntilDue(task.dueDate);
    if (days >= 0 && days <= 2) {
      const dayLabel = days === 0 ? 'today' : days === 1 ? 'tomorrow' : `in ${days} days`;
      return `Remind ${name} of upcoming urgent deadline: '${task.title}' is due ${dayLabel}.`;
    }
  }

  // RULE 7 — Default
  return `Monitor regularly — no immediate action required for ${name}.`;
}