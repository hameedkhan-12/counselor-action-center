import { Mail } from 'lucide-react';
import { formatDateTime } from '@/utils/formatDate';
import type { Message } from '@/types';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
        <Mail className="h-4 w-4 text-slate-500" />
        <h3 className="text-sm font-semibold text-slate-700">Messages</h3>
        {unreadCount > 0 && (
          <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-semibold text-white">
            {unreadCount} unread
          </span>
        )}
      </div>

      {/* Message list */}
      <div className="divide-y divide-slate-100">
        {messages.length === 0 ? (
          <p className="py-6 text-center text-sm text-slate-400">No messages</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                'flex items-start gap-3 px-4 py-3 transition-colors hover:bg-slate-50',
                !msg.read && 'bg-blue-50/40'
              )}
            >
              {/* Read indicator */}
              <div className="mt-1.5 flex h-2 w-2 shrink-0 items-center justify-center">
                {msg.read ? (
                  <span className="h-2 w-2 rounded-full border border-slate-300" title="Read" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-blue-500" title="Unread" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className={cn('truncate text-sm', !msg.read ? 'font-semibold text-slate-900' : 'font-medium text-slate-600')}>
                    {msg.from}
                  </p>
                  <time className="shrink-0 text-xs text-slate-400">
                    {formatDateTime(msg.receivedAt)}
                  </time>
                </div>
                <p className={cn('text-sm', !msg.read ? 'text-slate-800' : 'text-slate-500')}>
                  {msg.subject}
                </p>
                <p className="mt-0.5 truncate text-xs text-slate-400">{msg.preview}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}