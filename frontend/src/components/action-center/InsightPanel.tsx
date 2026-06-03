import { Lightbulb, ArrowRight } from 'lucide-react';

interface InsightPanelProps {
  insight: string;
  nextBestAction: string;
}

export function InsightPanel({ insight, nextBestAction }: InsightPanelProps) {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600">
          <Lightbulb className="h-4 w-4 text-white" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 mb-1">
            Counselor Insight
          </p>
          <p className="text-sm text-slate-700 leading-relaxed">{insight}</p>
        </div>
      </div>
      <div className="ml-10 flex items-start gap-2 rounded-md border border-blue-200 bg-white px-3 py-2.5">
        <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" />
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Recommended Action:
          </span>
          <p className="mt-0.5 text-sm font-medium text-slate-800">{nextBestAction}</p>
        </div>
      </div>
    </div>
  );
}