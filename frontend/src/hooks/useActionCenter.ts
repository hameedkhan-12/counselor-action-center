import { useState, useEffect, useCallback } from 'react';
import { api } from '@/api/client';
import type { ActionCenterResponse, UrgencyResult } from '@/types';

interface UseActionCenterResult {
  data: ActionCenterResponse | null;
  loading: boolean;
  error: string | null;
  updateUrgency: (newUrgency: UrgencyResult) => void;
  updateTaskStatus: (taskId: string, newStatus: ActionCenterResponse['tasks'][number]['status']) => void;
}

export function useActionCenter(studentId: string): UseActionCenterResult {
  const [data, setData] = useState<ActionCenterResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .getActionCenter(studentId)
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err: Error) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [studentId]);

  const updateUrgency = useCallback((newUrgency: UrgencyResult) => {
    setData((prev) => prev ? { ...prev, urgency: newUrgency } : prev);
  }, []);

  const updateTaskStatus = useCallback(
    (taskId: string, newStatus: ActionCenterResponse['tasks'][number]['status']) => {
      setData((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          tasks: prev.tasks.map((t) =>
            t.id === taskId ? { ...t, status: newStatus } : t
          ),
        };
      });
    },
    []
  );

  return { data, loading, error, updateUrgency, updateTaskStatus };
}