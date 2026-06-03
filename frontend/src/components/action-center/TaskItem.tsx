import { Check, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDate, isOverdue } from '@/utils/formatDate';
import type { EnrichedTask, TaskStatus, TaskPriority } from '@/types';
import { TaskDriftBadge } from './TaskDriftBadge';

interface TaskItemProps {
  task: EnrichedTask;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
  isUpdating?: boolean;
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; className: string }> = {
  urgent: { label: 'Urgent', className: 'bg-red-100 text-red-700 border-red-200' },
  high:   { label: 'High',   className: 'bg-orange-100 text-orange-700 border-orange-200' },
  medium: { label: 'Medium', className: 'bg-blue-100 text-blue-700 border-blue-200' },
  low:    { label: 'Low',    className: 'bg-slate-100 text-slate-600 border-slate-200' },
};

const STATUS_CONFIG: Record<TaskStatus, { label: string; className: string }> = {
  todo:        { label: 'To Do',       className: 'bg-slate-100 text-slate-600' },
  in_progress: { label: 'In Progress', className: 'bg-blue-100 text-blue-700' },
  completed:   { label: 'Done',        className: 'bg-green-100 text-green-700' },
};

export function TaskItem({ task, onStatusChange, isUpdating }: TaskItemProps) {
  const overdue = task.status !== 'completed' && isOverdue(task.dueDate);
  const priorityCfg = PRIORITY_CONFIG[task.priority];
  const statusCfg = STATUS_CONFIG[task.status];

  return (
    <div
      className={cn(
        'group rounded-md border bg-white p-3.5 transition-all hover:shadow-sm',
        overdue ? 'border-red-200 bg-red-50/30' : 'border-slate-200',
        task.status === 'completed' && 'opacity-60',
        (task.drift.driftLevel === 'FROZEN' || task.drift.driftLevel === 'STALE') && 'border-red-300 bg-red-50/20'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Status indicator circle */}
        <button
          disabled={task.status === 'completed' || isUpdating}
          onClick={() => {
            if (task.status === 'todo') onStatusChange(task.id, 'in_progress');
            else if (task.status === 'in_progress') onStatusChange(task.id, 'completed');
          }}
          className={cn(
            'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
            task.status === 'completed'
              ? 'border-green-500 bg-green-500'
              : task.status === 'in_progress'
              ? 'border-blue-400 bg-blue-50 hover:bg-blue-100'
              : 'border-slate-300 bg-white hover:border-slate-400',
            'disabled:cursor-default'
          )}
          title={task.status === 'completed' ? 'Completed' : 'Click to advance status'}
        >
          {task.status === 'completed' && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
          {task.status === 'in_progress' && <div className="h-2 w-2 rounded-full bg-blue-500" />}
        </button>

        <div className="flex-1 min-w-0">
          {/* Title + badges */}
          <div className="flex flex-wrap items-center gap-2">
            <p className={cn('text-sm font-medium text-slate-900', task.status === 'completed' && 'line-through text-slate-400')}>
              {task.title}
            </p>
            <span className={cn('rounded border px-1.5 py-0.5 text-xs font-medium', priorityCfg.className)}>
              {priorityCfg.label}
            </span>
            <TaskDriftBadge
              driftLevel={task.drift.driftLevel}
              driftDays={task.drift.driftDays}
              warningMessage={task.drift.warningMessage}
            />
            <span className={cn('rounded px-1.5 py-0.5 text-xs font-medium', statusCfg.className)}>
              {statusCfg.label}
            </span>
          </div>

          <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">{task.description}</p>

          <div className="mt-2 flex items-center gap-3">
            <span className={cn('flex items-center gap-1 text-xs', overdue ? 'text-red-600 font-medium' : 'text-slate-400')}>
              {overdue ? <AlertCircle className="h-3.5 w-3.5" /> : <Clock className="h-3.5 w-3.5" />}
              {overdue ? 'Overdue · ' : 'Due '}
              {formatDate(task.dueDate)}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        {task.status !== 'completed' && (
          <div className="flex shrink-0 gap-1.5">
            {task.status === 'todo' && (
              <button
                onClick={() => onStatusChange(task.id, 'in_progress')}
                disabled={isUpdating}
                className="rounded px-2.5 py-1 text-xs font-medium text-blue-600 border border-blue-200 bg-blue-50 hover:bg-blue-100 disabled:opacity-50 transition-colors"
              >
                Start
              </button>
            )}
            <button
              onClick={() => onStatusChange(task.id, 'completed')}
              disabled={isUpdating}
              className="rounded px-2.5 py-1 text-xs font-medium text-green-700 border border-green-200 bg-green-50 hover:bg-green-100 disabled:opacity-50 transition-colors"
            >
              Done
            </button>
          </div>
        )}

        {task.status === 'completed' && (
          <span className="flex shrink-0 items-center gap-1 text-xs text-green-600 font-medium">
            <Check className="h-3.5 w-3.5" />
            Completed
          </span>
        )}
      </div>
    </div>
  );
}