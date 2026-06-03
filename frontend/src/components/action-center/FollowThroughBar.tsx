
interface FollowThroughResult {
  totalTasks: number;
  completedTasks: number;
  rate: number | null;
  label: string;
  interpretation: string;
}

interface FollowThroughBarProps {
  followThrough: FollowThroughResult;
}

export function FollowThroughBar({ followThrough }: FollowThroughBarProps) {
  if (followThrough.rate === null) {
    return (
      <div className="mt-3 p-2 bg-gray-50 rounded">
        <p className="text-xs text-gray-500">No task history yet</p>
      </div>
    );
  }

  const colorMap: Record<string, string> = {
    Low: 'bg-red-500',
    'Below average': 'bg-orange-500',
    Moderate: 'bg-amber-500',
    Good: 'bg-green-500',
    High: 'bg-emerald-500',
  };

  const barColor = colorMap[followThrough.label] || 'bg-gray-500';

  return (
    <div className="mt-3 space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-600">
          Task follow-through
        </span>
        <span className="text-xs font-semibold text-gray-800">
          {followThrough.rate}% · {followThrough.label}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full ${barColor} transition-all`}
          style={{ width: `${followThrough.rate}%` }}
        />
      </div>
      <div className="text-xs text-gray-500">
        {followThrough.interpretation}
      </div>
    </div>
  );
}
