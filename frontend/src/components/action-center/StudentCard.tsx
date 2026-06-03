import { Mail, GraduationCap, BookOpen, AlertTriangle } from 'lucide-react';
import { UrgencyBadge } from './UrgencyBadge';
import { MomentumIndicator } from './MomentumIndicator';
import { FollowThroughBar } from './FollowThroughBar';
import { AttentionDebtBadge } from './AttentionDebtBadge';
import type { Student, UrgencyResult, MomentumResult, AttentionDebtResult, FollowThroughResult } from '@/types';
import { cn } from '@/lib/utils';

interface StudentCardProps {
  student: Student;
  urgency: UrgencyResult;
  momentum?: MomentumResult;
  attentionDebt?: AttentionDebtResult;
  followThrough?: FollowThroughResult;
}

export function StudentCard({ student, urgency, momentum, attentionDebt, followThrough }: StudentCardProps) {
  const initials = student.name.split(' ').map((n: string) => n[0]).join('');

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div
          className={cn(
            'flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white',
            urgency.level === 'CRITICAL' ? 'bg-red-500' :
            urgency.level === 'HIGH'     ? 'bg-orange-500' :
            urgency.level === 'MEDIUM'   ? 'bg-yellow-500' : 'bg-green-500'
          )}
        >
          {initials}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-semibold text-slate-900">{student.name}</h2>
            <UrgencyBadge level={urgency.level} score={urgency.score} />
            {student.enrollmentStatus === 'at_risk' && (
              <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                <AlertTriangle className="h-3 w-3" />
                At Risk
              </span>
            )}
          </div>

          <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" />
              {student.email}
            </span>
            <span className="flex items-center gap-1.5">
              <GraduationCap className="h-3.5 w-3.5" />
              Grade {student.grade}
            </span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              GPA {student.gpa.toFixed(1)}
            </span>
          </div>

          {/* Attention Debt Row */}
          {attentionDebt && attentionDebt.level !== 'CURRENT' && (
            <div className="mt-2 flex items-center gap-3 text-sm">
              <span className="text-slate-500">Last activity:</span>
              <span className="font-medium text-slate-700">
                {attentionDebt.daysSinceLastAction === 0 ? 'Today' : 
                 attentionDebt.daysSinceLastAction === 1 ? 'Yesterday' : 
                 `${attentionDebt.daysSinceLastAction} days ago`}
              </span>
              <AttentionDebtBadge attentionDebt={attentionDebt} />
            </div>
          )}
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="mt-4 grid grid-cols-4 gap-2 rounded-md border border-slate-100 bg-slate-50 p-3">
        {[
          { label: 'Overdue', value: urgency.breakdown.overdueCount, color: 'text-red-600' },
          { label: 'Urgent Tasks', value: urgency.breakdown.urgentCount, color: 'text-orange-600' },
          { label: 'Unread Msgs', value: urgency.breakdown.unreadCount, color: 'text-blue-600' },
          { label: 'Score', value: urgency.score, color: 'text-slate-700' },
        ].map(({ label, value, color }) => (
          <div key={label} className="text-center">
            <p className={cn('text-xl font-bold', color)}>{value}</p>
            <p className="text-xs text-slate-400">{label}</p>
          </div>
        ))}
      </div>

      {/* Momentum Indicator */}
      {momentum && (
        <MomentumIndicator momentum={momentum} className="mt-3" />
      )}

      {/* Follow-Through Bar */}
      {followThrough && (
        <FollowThroughBar followThrough={followThrough} />
      )}
    </div>
  );
}