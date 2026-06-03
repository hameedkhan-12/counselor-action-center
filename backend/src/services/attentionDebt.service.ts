import { Task } from '../types/task';
import { Message } from '../types/message';

export function getLastActionDate(tasks: Task[], messages: Message[]): Date {
  const actionDates: Date[] = [];

  // Step 1: Collect touched task dates (updatedAt !== createdAt)
  for (const task of tasks) {
    if (task.updatedAt !== task.createdAt) {
      actionDates.push(new Date(task.updatedAt));
    }
  }

  // Step 2: Collect read message dates
  for (const message of messages) {
    if (message.read) {
      actionDates.push(new Date(message.receivedAt));
    }
  }

  // Step 3: Return max date
  if (actionDates.length > 0) {
    return new Date(Math.max(...actionDates.map((d) => d.getTime())));
  }

  // Step 4: If no action dates, return earliest task createdAt
  if (tasks.length > 0) {
    const earliestTask = tasks.reduce((earliest, task) => {
      const taskDate = new Date(task.createdAt);
      return taskDate < earliest ? taskDate : earliest;
    }, new Date(tasks[0].createdAt));
    return earliestTask;
  }

  // Fallback: return today
  return new Date();
}

export function getAttentionDebtDays(tasks: Task[], messages: Message[]): number {
  const lastActionDate = getLastActionDate(tasks, messages);
  const now = new Date();
  const diffMs = now.getTime() - lastActionDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getAttentionDebtLevel(
  days: number
): 'CURRENT' | 'DUE' | 'OVERDUE' | 'CRITICAL' {
  if (days <= 3) return 'CURRENT';
  if (days <= 7) return 'DUE';
  if (days <= 14) return 'OVERDUE';
  return 'CRITICAL';
}

export function getAttentionDebtMessage(
  level: string,
  days: number,
  studentName: string
): string | null {
  switch (level) {
    case 'CURRENT':
      return null;
    case 'DUE':
      return `No activity on ${studentName} in ${days} days — check in soon`;
    case 'OVERDUE':
      return `${studentName} hasn't been touched in ${days} days — may be slipping through`;
    case 'CRITICAL':
      return `${studentName} has had no counselor activity for ${days} days`;
    default:
      return null;
  }
}
