'use client';

import Link from 'next/link';
import { Bookmark, PlaySquare, FileText, CheckSquare } from 'lucide-react';

const ACTIONS = [
  {
    label: 'Add Bookmark',
    icon: Bookmark,
    href: '/bookmarks',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 dark:bg-indigo-950',
  },
  {
    label: 'Add YouTube Video',
    icon: PlaySquare,
    href: '/videos',
    color: 'text-rose-600',
    bg: 'bg-rose-50 dark:bg-rose-950',
  },
  {
    label: 'Create Note',
    icon: FileText,
    href: '/notes/new',
    color: 'text-violet-600',
    bg: 'bg-violet-50 dark:bg-violet-950',
  },
  {
    label: 'Add Todo',
    icon: CheckSquare,
    href: '/todos',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950',
  },
] as const;

export function QuickActions() {
  return (
    <div className="rounded-xl border bg-card p-5 space-y-4">
      <h2 className="font-semibold text-sm">Quick Actions</h2>
      <div className="space-y-2">
        {ACTIONS.map(({ label, icon: Icon, href, color, bg }) => (
          <Link
            key={label}
            href={href}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-dashed hover:border-solid hover:bg-muted/50 transition-all group"
          >
            <div
              className={`w-7 h-7 rounded-md ${bg} flex items-center justify-center shrink-0`}
            >
              <Icon className={`w-3.5 h-3.5 ${color}`} />
            </div>
            <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              + {label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
