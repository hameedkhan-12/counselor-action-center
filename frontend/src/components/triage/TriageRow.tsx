import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { UrgencyBadge } from '@/components/action-center/UrgencyBadge';
import { AttentionDebtBadge } from '@/components/action-center/AttentionDebtBadge';
import { MomentumIndicator } from '@/components/action-center/MomentumIndicator';
import type { AttentionDebtResult, TriageStudentItem } from '@/types';
import { cn } from '@/lib/utils';

interface TriageRowProps {
  entry: TriageStudentItem;
  rank: number;
}


function getFollowThroughLabel(rate: number | null): string {
  if (rate === null) return 'No data';
  if (rate <= 24) return 'Low';
  if (rate <= 49) return 'Below average';
  if (rate <= 74) return 'Moderate';
  if (rate <= 89) return 'Good';
  return 'High';
}

function getFollowThroughTextClass(rate: number | null): string {
  if (rate === null) return 'text-slate-400';
  if (rate <= 24) return 'text-red-600';
  if (rate <= 49) return 'text-orange-600';
  if (rate <= 74) return 'text-amber-600';
  if (rate <= 89) return 'text-green-600';
  return 'text-emerald-600';
}

function urgencyBarWidth(score: number): string {
  return `${Math.min(100, Math.max(8, Math.round((score / 150) * 100)))}%`;
}

function toAttentionDebtResult(
  attentionDebt: TriageStudentItem['attentionDebt']
): AttentionDebtResult {
  return {
    lastActionDate: new Date(0).toISOString(),
    daysSinceLastAction: attentionDebt.daysSinceLastAction,
    level: attentionDebt.level as AttentionDebtResult['level'],
    message: attentionDebt.message,
  };
}

export function TriageRow({ entry, rank }: TriageRowProps) {
  const {
    student,
    urgency,
    momentum,
    attentionDebt,
    followThroughRate,
    overdueTaskCount,
    unreadMessageCount,
  } = entry;

  const followLabel = getFollowThroughLabel(followThroughRate);
  const followClass = getFollowThroughTextClass(followThroughRate);

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50/80">
      <td className="py-3 pl-4 pr-2 text-sm font-medium text-slate-400">{rank}</td>
      <td className="py-3 pr-4">
        <div className="font-medium text-slate-900">{student.name}</div>
        <div className="text-xs text-slate-500">
          Grade {student.grade}
          {student.enrollmentStatus === 'at_risk' ? ' · At risk' : ''}
        </div>
        {attentionDebt.level !== 'CURRENT' && (
          <div className="mt-1.5">
            <AttentionDebtBadge attentionDebt={toAttentionDebtResult(attentionDebt)} />
          </div>
        )}
      </td>
      <td className="hidden py-3 pr-4 sm:table-cell">
        <span
          className={cn(
            'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
            student.enrollmentStatus === 'at_risk'
              ? 'bg-amber-50 text-amber-700'
              : 'bg-green-50 text-green-700'
          )}
        >
          {student.enrollmentStatus === 'at_risk' ? 'At risk' : 'Active'}
        </span>
      </td>
      <td className="py-3 pr-4">
        <div className="flex flex-col gap-1.5 min-w-[140px]">
          <UrgencyBadge level={urgency.level} score={urgency.score} />
          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-slate-400"
              style={{ width: urgencyBarWidth(urgency.score) }}
            />
          </div>
        </div>
      </td>
      <td className="hidden py-3 pr-4 lg:table-cell">
        <div className="space-y-2 min-w-[160px]">
          <MomentumIndicator momentum={momentum} />
          <p className={cn('text-xs', followClass)}>
            {followThroughRate === null
              ? 'Follow-through: No data'
              : `Follow-through: ${followThroughRate}% (${followLabel})`}
          </p>
          <p className="text-xs text-slate-400">
            {overdueTaskCount} overdue · {unreadMessageCount} unread
          </p>
        </div>
      </td>
      <td className="py-3 pr-4 text-right">
        <Link
          to={`/student/${student.id}`}
          className="inline-flex items-center gap-0.5 text-xs font-medium text-blue-600 hover:text-blue-800"
        >
          View
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </td>
    </tr>
  );
}
