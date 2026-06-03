import { useState } from 'react';
import { CheckSquare, ChevronDown } from 'lucide-react';
import { TaskItem } from './TaskItem';
import { useUpdateTaskStatus } from '@/hooks/useUpdateTaskStatus';
import type { EnrichedTask, TaskStatus, UrgencyResult } from '@/types';
import { cn } from '@/lib/utils';

interface TaskListProps {
  tasks: EnrichedTask[];
  onUrgencyUpdate: (urgency: UrgencyResult) => void;
  onTaskStatusChange: (taskId: string, status: TaskStatus) => void;
}

export function TaskList({ tasks, onUrgencyUpdate, onTaskStatusChange }: TaskListProps) {
  const { updateStatus, loading } = useUpdateTaskStatus();
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  const activeTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    setUpdatingId(taskId);
    try {
      const result = await updateStatus(taskId, status);
      onTaskStatusChange(taskId, status);
      onUrgencyUpdate(result.newUrgency);
    } catch (_) {
      // Error is surfaced in useUpdateTaskStatus
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <CheckSquare className="h-4 w-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-700">Tasks</h3>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
            {activeTasks.length} open
          </span>
        </div>
        {completedTasks.length > 0 && (
          <span className="text-xs text-slate-400">{completedTasks.length} completed</span>
        )}
      </div>

      {/* Active tasks */}
      <div className="space-y-2 p-3">
        {activeTasks.length === 0 ? (
          <p className="py-4 text-center text-sm text-slate-400">No open tasks</p>
        ) : (
          activeTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              isUpdating={updatingId === task.id || (loading && updatingId === task.id)}
            />
          ))
        )}
      </div>

      {completedTasks.length > 0 && (
        <>
          <button
            onClick={() => setShowCompleted((v) => !v)}
            className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-xs text-slate-400 hover:bg-slate-50 transition-colors"
          >
            <ChevronDown
              className={cn('h-3.5 w-3.5 transition-transform', showCompleted && 'rotate-180')}
            />
            {showCompleted ? 'Hide' : 'Show'} {completedTasks.length} completed
          </button>
          {showCompleted && (
            <div className="space-y-2 p-3 pt-0">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  isUpdating={updatingId === task.id}
                />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}