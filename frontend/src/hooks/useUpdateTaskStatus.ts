import { useState } from 'react';
import { api } from '@/api/client';
import type { TaskStatus, UpdateTaskStatusResponse } from '@/types';

interface UseUpdateTaskStatusResult {
  updateStatus: (taskId: string, status: TaskStatus) => Promise<UpdateTaskStatusResponse>;
  loading: boolean;
  error: string | null;
}

export function useUpdateTaskStatus(): UseUpdateTaskStatusResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateStatus = async (
    taskId: string,
    status: TaskStatus
  ): Promise<UpdateTaskStatusResponse> => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.updateTaskStatus(taskId, status);
      return result;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Update failed';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, loading, error };
}