'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import {
  Bookmark,
  FileText,
  PlaySquare,
  CheckSquare,
  Image,
  Search,
  Loader2,
  X,
  ArrowRight,
} from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import type { SearchResultItem, SearchResultType } from '@/api/search';
import { cn } from '@/lib/utils';

const TYPE_CONFIG: Record<
  SearchResultType,
  { label: string; icon: React.ElementType; color: string; bg: string; href: (id: string) => string }
> = {
  bookmark: {
    label: 'Bookmarks',
    icon: Bookmark,
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 dark:bg-indigo-950',
    href: () => '/bookmarks',
  },
  note: {
    label: 'Notes',
    icon: FileText,
    color: 'text-violet-600',
    bg: 'bg-violet-50 dark:bg-violet-950',
    href: (id) => `/notes/${id}/edit`,
  },
  video: {
    label: 'Videos',
    icon: PlaySquare,
    color: 'text-rose-600',
    bg: 'bg-rose-50 dark:bg-rose-950',
    href: () => '/videos',
  },
  todo: {
    label: 'Todos',
    icon: CheckSquare,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 dark:bg-emerald-950',
    href: () => '/todos',
  },
  screenshot: {
    label: 'Screenshots',
    icon: Image,
    color: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-950',
    href: () => '/screenshots',
  },
};

const GROUP_ORDER: SearchResultType[] = ['bookmark', 'note', 'video', 'todo', 'screenshot'];

function flattenResults(results: Record<string, SearchResultItem[]>): SearchResultItem[] {
  return GROUP_ORDER.flatMap((type) => (results[`${type}s`] as SearchResultItem[]) ?? []);
}

function ResultRow({
  item,
  isActive,
  onSelect,
}: {
  item: SearchResultItem;
  isActive: boolean;
  onSelect: (item: SearchResultItem) => void;
}) {
  const cfg = TYPE_CONFIG[item.type];
  const Icon = cfg.icon;
  const rowRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isActive) rowRef.current?.scrollIntoView({ block: 'nearest' });
  }, [isActive]);

  return (
    <button
      ref={rowRef}
      onClick={() => onSelect(item)}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors',
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'hover:bg-accent hover:text-accent-foreground',
      )}
    >
      <div
        className={cn(
          'w-7 h-7 rounded-md flex items-center justify-center shrink-0',
          isActive ? 'bg-white/20' : cfg.bg,
        )}
      >
        <Icon className={cn('w-3.5 h-3.5', isActive ? 'text-primary-foreground' : cfg.color)} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{item.title}</p>
        {item.subtitle && (
          <p
            className={cn(
              'text-xs truncate',
              isActive ? 'text-primary-foreground/70' : 'text-muted-foreground',
            )}
          >
            {item.subtitle}
          </p>
        )}
      </div>
      <ArrowRight
        className={cn('w-3.5 h-3.5 shrink-0', isActive ? 'text-primary-foreground/70' : 'text-muted-foreground')}
      />
    </button>
  );
}

function GroupHeader({ type }: { type: SearchResultType }) {
  const cfg = TYPE_CONFIG[type];
  const Icon = cfg.icon;
  return (
    <div className="flex items-center gap-1.5 px-3 py-1 mt-1">
      <Icon className={cn('w-3 h-3', cfg.color)} />
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {cfg.label}
      </span>
    </div>
  );
}

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const { results, isLoading, isFetching, debouncedQuery } = useSearch(query);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIdx(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setActiveIdx(0);
  }, [results]);

  const flatItems: SearchResultItem[] = results
    ? flattenResults(results as unknown as Record<string, SearchResultItem[]>)
    : [];

  const handleSelect = useCallback(
    (item: SearchResultItem) => {
      const href = TYPE_CONFIG[item.type].href(item.id);
      router.push(href);
      onClose();
    },
    [router, onClose],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && flatItems[activeIdx]) {
      handleSelect(flatItems[activeIdx]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!open || typeof document === 'undefined') return null;

  const hasResults = results && results.total > 0;
  const hasQuery = debouncedQuery.trim().length >= 2;

  const groups = GROUP_ORDER.map((type) => {
    const key = `${type}s` as keyof typeof results;
    const items = (results?.[key] as unknown as SearchResultItem[]) ?? [];
    return { type, items };
  }).filter((g) => g.items.length > 0);

  let flatOffset = 0;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />

      {/* Dialog */}
      <div className="fixed left-1/2 top-[15%] z-50 w-full max-w-[560px] -translate-x-1/2 px-4">
        <div className="rounded-xl border bg-background shadow-2xl overflow-hidden">

          {/* Input row */}
          <div className="flex items-center gap-3 px-4 py-3 border-b">
            {isFetching && hasQuery ? (
              <Loader2 className="w-4 h-4 text-muted-foreground shrink-0 animate-spin" />
            ) : (
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            )}
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search bookmarks, notes, videos, todos…"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="hidden sm:inline-flex items-center rounded border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
              ESC
            </kbd>
          </div>

          {/* Results area */}
          <div className="max-h-[400px] overflow-y-auto p-2">

            {/* Empty / hint states */}
            {!hasQuery && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Type at least 2 characters to search…
              </p>
            )}

            {hasQuery && isLoading && (
              <p className="py-8 text-center text-sm text-muted-foreground">Searching…</p>
            )}

            {hasQuery && !isLoading && !hasResults && (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No results for <span className="font-medium text-foreground">"{debouncedQuery}"</span>
              </p>
            )}

            {/* Grouped results */}
            {groups.map(({ type, items }) => {
              const groupStart = flatOffset;
              flatOffset += items.length;
              return (
                <div key={type}>
                  <GroupHeader type={type} />
                  {items.map((item, i) => (
                    <ResultRow
                      key={item.id}
                      item={item}
                      isActive={activeIdx === groupStart + i}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          {hasResults && (
            <div className="border-t px-4 py-2 flex items-center gap-4 text-[11px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="rounded border bg-muted px-1 py-0.5 font-mono">↑↓</kbd> navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border bg-muted px-1 py-0.5 font-mono">↵</kbd> open
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border bg-muted px-1 py-0.5 font-mono">esc</kbd> close
              </span>
              <span className="ml-auto">{results.total} result{results.total !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>
      </div>
    </>,
    document.body,
  );
}
