import { Users } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorBanner } from '@/components/shared/ErrorBanner';
import { TriageList } from '@/components/triage/TriageList';
import { useTriageList } from '@/hooks/useTriagleList';

const COUNSELOR_ID = 'csl_001';

export function TriagePage() {
  const { data, loading, error } = useTriageList(COUNSELOR_ID);

  const mediumCount =
    data?.students?.filter((s) => s.urgency.level === 'MEDIUM').length ?? 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex h-14 items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-600">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900">Counselor Action Center</h1>
              <p className="text-xs text-slate-400">Student Triage Queuee</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        {loading && <LoadingSpinner label="Loading triage queue..." />}

        {error && (
          <ErrorBanner
            message={error}
            onRetry={() => window.location.reload()}
            className="mb-4"
          />
        )}

        {!loading && !error && data && (
          <>
            <div className="mb-4 flex flex-wrap gap-4 text-sm text-slate-600">
              <span>🔴 {data.criticalCount} critical</span>
              <span>🟠 {mediumCount} medium</span>
              <span>⏰ {data.attentionDebtCount} need check-in</span>
            </div>
            <TriageList entries={data.students} />
          </>
        )}
      </main>
    </div>
  );
}
