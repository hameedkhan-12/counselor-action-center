import { cn } from '@/lib/utils';
import type { UrgencyLevel } from '@/types';

interface UrgencyBadgeProps {
  level: UrgencyLevel;
  score?: number;
  className?: string;
}

const LEVEL_CONFIG: Record<UrgencyLevel, { bg: string; text: string; dot: string; label: string }> = {
  CRITICAL: { bg: 'bg-red-100 border-red-300', text: 'text-red-700', dot: 'bg-red-500', label: 'Critical' },
  HIGH:     { bg: 'bg-orange-100 border-orange-300', text: 'text-orange-700', dot: 'bg-orange-500', label: 'High' },
  MEDIUM:   { bg: 'bg-yellow-100 border-yellow-300', text: 'text-yellow-700', dot: 'bg-yellow-500', label: 'Medium' },
  LOW:      { bg: 'bg-green-100 border-green-300', text: 'text-green-700', dot: 'bg-green-500', label: 'Low' },
};

export function UrgencyBadge({ level, score, className }: UrgencyBadgeProps) {
  const config = LEVEL_CONFIG[level];
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold',
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dot)} />
      {config.label}{score !== undefined ? ` · ${score}` : ''}
    </span>
  );
}
