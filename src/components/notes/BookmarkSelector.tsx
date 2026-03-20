'use client';

import { useState } from 'react';
import { ChevronsUpDown, X } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useBookmarks } from '@/hooks/useBookmarks';

interface Props {
  value: string | undefined;
  onChange: (id: string | undefined) => void;
}

export default function BookmarkSelector({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { data } = useBookmarks({ search: search || undefined, limit: 20 });
  const bookmarks = data?.data ?? [];
  const selected = bookmarks.find((b) => b.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="w-full h-9 px-3 rounded-md border bg-background text-sm text-left flex items-center justify-between gap-2 outline-none focus:ring-2 focus:ring-ring transition-all"
        >
          <span className={selected ? 'text-foreground truncate' : 'text-muted-foreground'}>
            {selected ? selected.title : 'Select bookmark…'}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            {value && (
              <span
                role="button"
                onClick={(e) => { e.stopPropagation(); onChange(undefined); }}
                className="p-0.5 rounded hover:text-destructive transition-colors text-muted-foreground"
              >
                <X className="w-3 h-3" />
              </span>
            )}
            <ChevronsUpDown className="w-3.5 h-3.5 text-muted-foreground" />
          </div>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-2 space-y-1.5">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search bookmarks…"
          className="w-full h-8 px-2 rounded border bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
          autoFocus
        />
        <div className="max-h-48 overflow-y-auto space-y-0.5">
          {bookmarks.length === 0 ? (
            <p className="text-xs text-muted-foreground px-2 py-1.5">No bookmarks found</p>
          ) : (
            bookmarks.map((bm) => (
              <button
                key={bm.id}
                type="button"
                onClick={() => { onChange(bm.id === value ? undefined : bm.id); setOpen(false); }}
                className="w-full flex flex-col items-start px-2 py-1.5 rounded text-sm hover:bg-accent transition-colors text-left"
              >
                <span className="font-medium line-clamp-1">{bm.title}</span>
                <span className="text-[10px] text-muted-foreground truncate w-full">{bm.url}</span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
