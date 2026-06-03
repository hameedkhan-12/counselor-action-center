
interface MomentumResult {
  level: 'ACTIVE' | 'MOVING' | 'SLOWING' | 'STALLED';
  averageDriftDays: number;
  frozenTaskCount: number;
  color: string;
}

interface MomentumIndicatorProps {
  momentum: MomentumResult;
}

export function MomentumIndicator({ momentum }: MomentumIndicatorProps) {
  const colorMap: Record<string, string> = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
  };

  const barColor = colorMap[momentum.color] || 'bg-gray-500';

  return (
    <div className="mt-3 space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">Momentum</span>
        <span className="text-xs font-semibold text-gray-800">
          {momentum.level}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all`}
          style={{ width: '100%' }}
        />
      </div>
      <div className="text-xs text-gray-500">
        Avg drift: {momentum.averageDriftDays} days · {momentum.frozenTaskCount}{' '}
        frozen
      </div>
    </div>
  );
}
