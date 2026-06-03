import { Users, RefreshCw, Calendar } from 'lucide-react';
import { TriageList } from '@/components/triage/TriageList';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorBanner } from '@/components/shared/ErrorBanner';
import { formatDateTime } from '@/utils/formatDate';
import { useTriageList } from '@/hooks/useTriagleList';

const COUNSELOR_ID = 'csl_001';

export function TriagePage() {
  const { data, loading, error } = useTriageList(COUNSELOR_ID);

  // Handle both old (rankedStudents) and new (students) response formats
  const students = data?.students ?? data?.rankedStudents ?? [];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top nav bar — JIRA-style */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-0">
          <div className="flex h-14 items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-600">
              <Users className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-slate-900">Counselor Action Center</h1>
              <p className="text-xs text-slate-400">Student Success Dashboard</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Triage Board</h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Students ranked by urgency — highest priority first
            </p>
          </div>
          {data && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="h-3.5 w-3.5" />
              Updated {formatDateTime(data.generatedAt)}
            </div>
          )}
        </div>

        {/* Summary chips */}
        {!loading && !error && data && (
          <div className="mb-5 flex flex-wrap gap-2">
            <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs">
              <span className="font-medium text-slate-700">{data.totalStudents ?? students.length}</span>
              <span className="text-slate-400">Students assigned</span>
            </div>
            {(data.criticalCount ?? 0) > 0 && (
              <div className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs">
                <span className="font-semibold text-red-700">🔴 {data.criticalCount}</span>
                <span className="text-red-500">Critical</span>
              </div>
            )}
            {(data.highCount ?? 0) > 0 && (
              <div className="flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs">
                <span className="font-semibold text-orange-700">🟠 {data.highCount}</span>
                <span className="text-orange-500">High priority</span>
              </div>
            )}
            {(data.attentionDebtCount ?? 0) > 0 && (
              <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs">
                <span className="font-semibold text-amber-700">⏰ {data.attentionDebtCount}</span>
                <span className="text-amber-600">Need check-in</span>
              </div>
            )}
          </div>
        )}

        {loading && <LoadingSpinner label="Loading student triage data..." />}
        {error && <ErrorBanner message={error} onRetry={() => window.location.reload()} />}
        {!loading && !error && data && (
          students.length === 0 ? (
            <div className="rounded-lg border border-slate-200 bg-white py-16 text-center">
              <RefreshCw className="mx-auto h-8 w-8 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-500">No students assigned</p>
            </div>
          ) : (
            <TriageList entries={students} />
          )
        )}
      </main>
    </div>
  );
}