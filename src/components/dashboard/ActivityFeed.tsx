'use client';

import Link from 'next/link';
import { Bookmark, FileText, PlaySquare } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { ActivityItem } from '@/api/dashboard';

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

const TYPE_CONFIG = {
  bookmark: {
    icon: Bookmark,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 dark:bg-indigo-950',
    label: 'Bookmark',
    href: (_id: string) => `/bookmarks`,
  },
  note: {
    icon: FileText,
    color: 'text-violet-600',
    bg: 'bg-violet-50 dark:bg-violet-950',
    label: 'Note',
    href: (id: string) => `/notes/${id}/edit`,
  },
  video: {
    icon: PlaySquare,
    color: 'text-rose-600',
    bg: 'bg-rose-50 dark:bg-rose-950',
    label: 'Video',
    href: (_id: string) => `/videos`,
  },
} as const;

interface ActivityFeedProps {
  items: ActivityItem[] | undefined;
  isLoading: boolean;
}

export function ActivityFeed({ items, isLoading }: ActivityFeedProps) {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-sm">Recent Activity</h2>
        {!isLoading && (
          <span className="text-xs text-muted-foreground">{items?.length ?? 0} items</span>
        )}
        {isLoading && <Skeleton className="h-4 w-14" />}
      </div>

      <div className="space-y-3">
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3.5 rounded" style={{ width: `${55 + i * 8}%` }} />
                <Skeleton className="h-2.5 w-20 rounded" />
              </div>
            </div>
          ))}

        {!isLoading && (!items || items.length === 0) && (
          <p className="text-sm text-muted-foreground py-4 text-center">
            No activity yet. Start by adding a bookmark or note.
          </p>
        )}

        {!isLoading &&
          items?.map((item) => {
            const cfg = TYPE_CONFIG[item.type];
            const Icon = cfg.icon;
            return (
              <Link
                key={`${item.type}-${item.id}`}
                href={cfg.href(item.id)}
                className="flex items-center gap-3 group"
              >
                <div
                  className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0`}
                >
                  <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {cfg.label} · {timeAgo(item.createdAt)}
                  </p>
                </div>
              </Link>
            );
          })}
      </div>
    </div>
  );
}
