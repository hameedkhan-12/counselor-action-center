import { Task } from '../types/task';

export interface FollowThroughResult {
  totalTasks: number;
  completedTasks: number;
  rate: number | null;
  label: string;
  interpretation: string;
}

export function getFollowThroughRate(tasks: Task[]): FollowThroughResult {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;

  let rate: number | null = null;
  if (totalTasks > 0) {
    rate = Math.round((completedTasks / totalTasks) * 100);
  }

  const label = getFollowThroughLabel(rate);
  const interpretation = getFollowThroughInterpretation(
    rate,
    label,
    totalTasks,
    completedTasks
  );

  return {
    totalTasks,
    completedTasks,
    rate,
    label,
    interpretation,
  };
}

export function getFollowThroughLabel(rate: number | null): string {
  if (rate === null) return 'No data';
  if (rate <= 24) return 'Low';
  if (rate <= 49) return 'Below average';
  if (rate <= 74) return 'Moderate';
  if (rate <= 89) return 'Good';
  return 'High';
}

export function getFollowThroughInterpretation(
  rate: number | null,
  label: string,
  totalTasks: number,
  completedTasks: number
): string {
  if (rate === null) {
    return 'No task history yet';
  }

  switch (label) {
    case 'Low':
      return `Completes ${rate}% of tasks — may signal disengagement or external barriers`;
    case 'Below average':
      return `Completes ${rate}% of tasks — follow-through is inconsistent`;
    case 'Moderate':
      return `Completes ${rate}% of tasks — making progress but room to improve`;
    case 'Good':
      return `Completes ${rate}% of tasks — strong follow-through`;
    case 'High':
      return `Completes ${rate}% of tasks — excellent task ownership`;
    default:
      return 'Task follow-through data available';
  }
}
