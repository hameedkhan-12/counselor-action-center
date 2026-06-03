import type { MomentumResult, MomentumInfo } from '@/types';
import { cn } from '@/lib/utils';

interface MomentumIndicatorProps {
  momentum: MomentumResult | MomentumInfo;
  className?: string;
}

export function MomentumIndicator({ momentum, className }: MomentumIndicatorProps) {
  const colorMap: Record<string, string> = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    ACTIVE: 'bg-green-500',
    MOVING: 'bg-blue-500',
    SLOWING: 'bg-amber-500',
    STALLED: 'bg-red-500',
  };

  const colorKey = ('color' in momentum && momentum.color) || momentum.level;
  const barColor = colorMap[colorKey] || 'bg-gray-500';

  return (
    <div className={cn('space-y-1', className)}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">Momentum</span>
        <span className="text-xs font-semibold text-slate-800">
          {momentum.level}
        </span>
      </div>
      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all`}
          style={{ width: '100%' }}
        />
      </div>
      <div className="text-xs text-slate-400">
        Avg drift: {momentum.averageDriftDays}d · {momentum.frozenTaskCount}{' '}
        frozen
      </div>
    </div>
  );
}

