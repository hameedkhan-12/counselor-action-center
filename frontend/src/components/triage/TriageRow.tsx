import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, Mail, ChevronRight } from 'lucide-react';
import type { TriageStudentItem, TriageEntry } from '@/types';
import { cn } from '@/lib/utils';
import { UrgencyBadge } from '../action-center/UrgencyBadge';
import { AttentionDebtBadge } from '../action-center/AttentionDebtBadge';

interface TriageRowProps {
  entry: TriageStudentItem | TriageEntry;
  rank: number;
}

const LEVEL_BAR: Record<string, string> = {
  CRITICAL: 'bg-red-500',
  HIGH:     'bg-orange-400',
  MEDIUM:   'bg-yellow-400',
  LOW:      'bg-green-400',
};

const MOMENTUM_COLOR: Record<string, string> = {
  ACTIVE: 'bg-green-500',
  MOVING: 'bg-blue-500',
  SLOWING: 'bg-amber-500',
  STALLED: 'bg-red-500',
};

const FOLLOW_THROUGH_COLOR: Record<string, string> = {
  Low: 'text-red-600',
  'Below average': 'text-orange-600',
  Moderate: 'text-amber-600',
  Good: 'text-green-600',
  High: 'text-emerald-600',
};

export function TriageRow({ entry, rank }: TriageRowProps) {
  const navigate = useNavigate();
  const { student, urgency, overdueTaskCount, unreadMessageCount } = entry;
  // Handle both old and new response formats
  const momentum = 'momentum' in entry ? entry.momentum : undefined;
  const attentionDebt = 'attentionDebt' in entry ? entry.attentionDebt : undefined;
  const followThroughRate = 'followThroughRate' in entry ? entry.followThroughRate : undefined;
  
  const barWidth = `${Math.min((urgency.score / 120) * 100, 100).toFixed(1)}%`;

  const followThroughLabel = followThroughRate === null ? 'No data' :
    followThroughRate === undefined ? 'N/A' :
    followThroughRate <= 24 ? 'Low' :
    followThroughRate <= 49 ? 'Below average' :
    followThroughRate <= 74 ? 'Moderate' :
    followThroughRate <= 89 ? 'Good' : 'High';

  return (
    <tr
      onClick={() => navigate(`/student/${student.id}`)}
      className="group cursor-pointer border-b border-slate-100 hover:bg-slate-50 transition-colors"
    >
      {/* Rank */}
      <td className="w-10 py-3 pl-4 pr-2 text-center">
        <span className="text-sm font-medium text-slate-400">{rank}</span>
      </td>

      {/* Student */}
      <td className="py-3 pr-4">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white',
              urgency.level === 'CRITICAL' ? 'bg-red-500' :
              urgency.level === 'HIGH'     ? 'bg-orange-400' :
              urgency.level === 'MEDIUM'   ? 'bg-yellow-400' : 'bg-green-500'
            )}
          >
            {student.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
              {student.name}
            </p>
            <p className="text-xs text-slate-400">
              Grade {student.grade} · GPA {student.gpa.toFixed(1)}
            </p>
          </div>
        </div>
      </td>

      {/* Status */}
      <td className="hidden py-3 pr-4 sm:table-cell">
        {student.enrollmentStatus === 'at_risk' ? (
          <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
            <AlertTriangle className="h-3 w-3" />
            At Risk
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-green-300 bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
            Active
          </span>
        )}
      </td>

      {/* Score + urgency bar + momentum */}
      <td className="py-3 pr-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-3">
            <div className="hidden sm:block h-1.5 w-24 overflow-hidden rounded-full bg-slate-100">
              <div
                className={cn('h-full rounded-full transition-all', LEVEL_BAR[urgency.level])}
                style={{ width: barWidth }}
              />
            </div>
            <UrgencyBadge level={urgency.level} score={urgency.score} />
          </div>
          
          {/* Momentum bar */}
          {momentum && (
            <div className="hidden lg:flex items-center gap-2">
              <div className="h-1 w-16 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={cn('h-full rounded-full', MOMENTUM_COLOR[momentum.level])}
                  style={{ width: '100%' }}
                />
              </div>
              <span className="text-xs text-slate-500 whitespace-nowrap">{momentum.level}</span>
            </div>
          )}
        </div>
      </td>

      {/* Signals */}
      <td className="hidden py-3 pr-4 lg:table-cell">
        <div className="flex flex-col gap-2">
          {/* Task & Message Signals */}
          <div className="flex items-center gap-3">
            {overdueTaskCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-red-600">
                <Clock className="h-3.5 w-3.5" />
                {overdueTaskCount} overdue
              </span>
            )}
            {unreadMessageCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-blue-600">
                <Mail className="h-3.5 w-3.5" />
                {unreadMessageCount} unread
              </span>
            )}
            {overdueTaskCount === 0 && unreadMessageCount === 0 && (
              <span className="text-xs text-slate-400">—</span>
            )}
          </div>

          {/* Attention Debt Badge */}
          {attentionDebt && (
            <div>
              <AttentionDebtBadge attentionDebt={attentionDebt} />
            </div>
          )}

          {/* Follow-Through Rate */}
          {followThroughRate !== null && followThroughRate !== undefined && (
            <span className={cn('text-xs font-medium', FOLLOW_THROUGH_COLOR[followThroughLabel])}>
              Follow-through: {followThroughRate}% ({followThroughLabel})
            </span>
          )}
        </div>
      </td>

      {/* Arrow */}
      <td className="w-10 py-3 pr-4">
        <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
      </td>
    </tr>
  );
}
