
interface AttentionDebtResult {
  lastActionDate: string;
  daysSinceLastAction: number;
  level: 'CURRENT' | 'DUE' | 'OVERDUE' | 'CRITICAL';
  message: string | null;
}

interface AttentionDebtBadgeProps {
  attentionDebt: AttentionDebtResult;
}

export function AttentionDebtBadge({ attentionDebt }: AttentionDebtBadgeProps) {
  if (attentionDebt.level === 'CURRENT') {
    return null;
  }

  let badgeClass = '';
  let displayText = '';
  let icon = '';

  if (attentionDebt.level === 'DUE') {
    badgeClass = 'bg-blue-100 text-blue-800';
    displayText = `Last seen ${attentionDebt.daysSinceLastAction}d ago`;
  } else if (attentionDebt.level === 'OVERDUE') {
    badgeClass = 'bg-amber-100 text-amber-800';
    icon = '⏰ ';
    displayText = `${attentionDebt.daysSinceLastAction}d no activity`;
  } else if (attentionDebt.level === 'CRITICAL') {
    badgeClass = 'bg-red-100 text-red-800';
    icon = '🚨 ';
    displayText = `${attentionDebt.daysSinceLastAction}d ignored`;
  }

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badgeClass}`}
      title={attentionDebt.message || ''}
    >
      {icon}
      {displayText}
    </div>
  );
}
