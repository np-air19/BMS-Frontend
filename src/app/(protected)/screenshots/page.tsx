'use client';

import { useState, useRef } from 'react';
import { Plus, Search, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useScreenshots } from '@/hooks/useScreenshots';
import ScreenshotCard from '@/components/screenshots/ScreenshotCard';
import ScreenshotUploadDialog from '@/components/screenshots/ScreenshotUploadDialog';

export default function ScreenshotsPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const [uploadOpen, setUploadOpen] = useState(false);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = (value: string) => {
    setSearch(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
  };

  const { data, isLoading, isFetching } = useScreenshots({
    search: debouncedSearch || undefined,
    page,
    limit: 16,
  });

  const screenshots = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Screenshots</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {pagination ? `${pagination.total} image${pagination.total !== 1 ? 's' : ''}` : ''}
          </p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Upload
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search screenshots…"
          className="w-full h-9 pl-9 pr-8 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
        />
        {isFetching && !isLoading && (
          <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground animate-spin" />
        )}
      </div>

      {/* Gallery */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square rounded-xl" />
          ))}
        </div>
      ) : screenshots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
            <ImageIcon className="w-6 h-6 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">
            {debouncedSearch ? 'No screenshots match your search' : 'No screenshots yet'}
          </p>
          {!debouncedSearch && (
            <Button variant="outline" size="sm" onClick={() => setUploadOpen(true)}>
              Upload your first screenshot
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {screenshots.map((s) => (
            <ScreenshotCard key={s.id} screenshot={s} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasPrevPage}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            {pagination.page} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      <ScreenshotUploadDialog open={uploadOpen} onClose={() => setUploadOpen(false)} />
    </div>
  );
}
