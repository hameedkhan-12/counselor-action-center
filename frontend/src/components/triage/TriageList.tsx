import { TriageRow } from './TriageRow';
import type { TriageStudentItem } from '@/types';

interface TriageListProps {
  entries: TriageStudentItem[];
}

export function TriageList({ entries }: TriageListProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <th className="py-2.5 pl-4 pr-2 text-xs font-semibold uppercase tracking-wider text-slate-400">#</th>
            <th className="py-2.5 pr-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Student</th>
            <th className="hidden py-2.5 pr-4 text-xs font-semibold uppercase tracking-wider text-slate-400 sm:table-cell">Status</th>
            <th className="py-2.5 pr-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Urgency</th>
            <th className="hidden py-2.5 pr-4 text-xs font-semibold uppercase tracking-wider text-slate-400 lg:table-cell">Signals</th>
            <th className="py-2.5 pr-4" />
          </tr>
        </thead>
        <tbody>
          {entries.map((entry, i) => (
            <TriageRow key={entry.student.id} entry={entry} rank={i + 1} />
          ))}
        </tbody>
      </table>
    </div>
  );
}