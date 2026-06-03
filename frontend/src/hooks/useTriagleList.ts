import { useState, useEffect } from 'react';
import { api } from '@/api/client';
import type { TriageResponse } from '@/types';

interface UseTriageListResult {
  data: TriageResponse | null;
  loading: boolean;
  error: string | null;
}

export function useTriageList(counselorId: string): UseTriageListResult {
  const [data, setData] = useState<TriageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    api
      .getTriageList(counselorId)
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err: Error) => { if (!cancelled) setError(err.message); })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [counselorId]);

  return { data, loading, error };
}
