import { Task } from '../types/task';

export function getTaskDriftDays(task: Task): number {
  if (task.status === 'completed') {
    return 0;
  }

  const now = new Date();
  const updatedAt = new Date(task.updatedAt);
  const diffMs = now.getTime() - updatedAt.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}

export function getTaskDriftLevel(
  driftDays: number
): 'FRESH' | 'AGEING' | 'STALE' | 'FROZEN' {
  if (driftDays <= 2) return 'FRESH';
  if (driftDays <= 6) return 'AGEING';
  if (driftDays <= 13) return 'STALE';
  return 'FROZEN';
}

export function getMomentumLevel(
  tasks: Task[]
): 'ACTIVE' | 'MOVING' | 'SLOWING' | 'STALLED' {
  const nonCompletedTasks = tasks.filter((t) => t.status !== 'completed');

  if (nonCompletedTasks.length === 0) {
    return 'ACTIVE';
  }

  const totalDriftDays = nonCompletedTasks.reduce((sum, task) => {
    return sum + getTaskDriftDays(task);
  }, 0);

  const averageDriftDays = Math.floor(totalDriftDays / nonCompletedTasks.length);

  if (averageDriftDays <= 2) return 'ACTIVE';
  if (averageDriftDays <= 6) return 'MOVING';
  if (averageDriftDays <= 13) return 'SLOWING';
  return 'STALLED';
}

export function getMomentumColor(level: string): string {
  switch (level) {
    case 'ACTIVE':
      return 'green';
    case 'MOVING':
      return 'blue';
    case 'SLOWING':
      return 'amber';
    case 'STALLED':
      return 'red';
    default:
      return 'gray';
  }
}
