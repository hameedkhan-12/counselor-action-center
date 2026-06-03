import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { ErrorBanner } from '@/components/shared/ErrorBanner';
import { useActionCenter } from '@/hooks/useActionCenter';
import type { TaskStatus, UrgencyResult } from '@/types';
import { StudentCard } from '@/components/action-center/StudentCard';
import { InsightPanel } from '@/components/action-center/InsightPanel';
import { TaskList } from '@/components/action-center/TaskList';
import { MessageList } from '@/components/action-center/MessageList';

export function ActionCenterPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const { data, loading, error, updateUrgency, updateTaskStatus } = useActionCenter(
    studentId ?? ''
  );

  const handleUrgencyUpdate = (newUrgency: UrgencyResult) => {
    updateUrgency(newUrgency);
  };

  const handleTaskStatusChange = (taskId: string, status: TaskStatus) => {
    updateTaskStatus(taskId, status);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-0">
          <div className="flex h-14 items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-blue-600">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div>
                <h1 className="text-sm font-semibold text-slate-900">Counselor Action Center</h1>
                <p className="text-xs text-slate-400">Student Deep View</p>
              </div>
            </div>
            <Link
              to="/"
              className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Triage
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {loading && <LoadingSpinner label="Loading student data..." />}

        {error && (
          <ErrorBanner
            message={error}
            onRetry={() => window.location.reload()}
            className="mb-4"
          />
        )}

        {!loading && !error && data && (
          <div className="space-y-4">
            <nav className="flex items-center gap-1.5 text-xs text-slate-400">
              <Link to="/" className="hover:text-blue-600 transition-colors">Triage</Link>
              <span>/</span>
              <span className="text-slate-600">{data.student.name}</span>
            </nav>

            {/* Student summary card */}
            <StudentCard 
              student={data.student} 
              urgency={data.urgency}
              momentum={data.momentum}
              attentionDebt={data.attentionDebt}
              followThrough={data.followThrough}
            />

            {/* AI Insight + Next Best Action */}
            <InsightPanel
              insight={data.insight}
              nextBestAction={data.nextBestAction}
            />

            <div className="grid gap-4 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <TaskList
                  tasks={data.tasks}
                  onUrgencyUpdate={handleUrgencyUpdate}
                  onTaskStatusChange={handleTaskStatusChange}
                />
              </div>

              <div className="lg:col-span-2">
                <MessageList messages={data.messages} />
              </div>
            </div>
          </div>
        )}

        {!loading && !error && !data && (
          <div className="rounded-lg border border-slate-200 bg-white py-16 text-center">
            <p className="text-sm text-slate-500">Student not found</p>
            <Link to="/" className="mt-3 inline-block text-sm text-blue-600 hover:underline">
              Return to Triage
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}