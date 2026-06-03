interface TaskDriftBadgeProps {
  driftLevel: 'FRESH' | 'AGEING' | 'STALE' | 'FROZEN';
  driftDays: number;
  warningMessage: string | null;
}

export function TaskDriftBadge({
  driftLevel,
  driftDays,
  warningMessage,
}: TaskDriftBadgeProps) {
  if (driftLevel === 'FRESH') {
    return null;
  }

  let badgeClass = '';
  let displayText = '';
  let icon = '';

  if (driftLevel === 'AGEING') {
    badgeClass = 'bg-gray-200 text-gray-700';
    displayText = `${driftDays}d`;
  } else if (driftLevel === 'STALE') {
    badgeClass = 'bg-amber-100 text-amber-800';
    displayText = `${driftDays}d stale`;
  } else if (driftLevel === 'FROZEN') {
    badgeClass = 'bg-red-100 text-red-800';
    icon = '⚠️ ';
    displayText = `${driftDays}d frozen`;
  }

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}
      title={warningMessage || ''}
    >
      {icon}
      {displayText}
    </div>
  );
}
