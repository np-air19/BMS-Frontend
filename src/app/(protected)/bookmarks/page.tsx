'use client';

import { useState, useRef } from 'react';
import { Plus, Search, Bookmark as BookmarkIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useBookmarks } from '@/hooks/useBookmarks';
import { useCategories } from '@/hooks/useCategories';
import BookmarkCard from '@/components/bookmarks/BookmarkCard';
import BookmarkDialog from '@/components/bookmarks/BookmarkDialog';
import { type CategoryTree } from '@/api/categories';
import type { Bookmark } from '@/types';
import { cn } from '@/lib/utils';

function flattenTree(nodes: CategoryTree[]): CategoryTree[] {
  return nodes.flatMap((node) => [node, ...flattenTree(node.children ?? [])]);
}

export default function BookmarksPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = (value: string) => {
    setSearch(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
  };

  const { data, isLoading, isFetching } = useBookmarks({
    search: debouncedSearch || undefined,
    categoryId,
    page,
    limit: 12,
  });

  const { data: catTree = [] } = useCategories();
  const flatCats = flattenTree(catTree as CategoryTree[]);

  const bookmarks = data?.data ?? [];
  const pagination = data?.pagination;

  const handleEdit = (bookmark: Bookmark) => {
    setEditingBookmark(bookmark);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBookmark(null);
  };

  const handleCategoryFilter = (id: string) => {
    setCategoryId((prev) => (prev === id ? undefined : id));
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Bookmarks</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {pagination ? `${pagination.total} saved` : 'Your saved links'}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingBookmark(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add bookmark
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <input
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search by title, URL, or purpose…"
          className="w-full h-9 pl-9 pr-8 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
        />
        {isFetching && !isLoading && (
          <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground animate-spin" />
        )}
      </div>

      {/* Category filter pills */}
      {flatCats.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide -mt-2">
          <button
            onClick={() => {
              setCategoryId(undefined);
              setPage(1);
            }}
            className={cn(
              'shrink-0 h-7 px-3 rounded-full text-xs font-medium border transition-colors',
              !categoryId
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:bg-accent',
            )}
          >
            All
          </button>
          {flatCats.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryFilter(cat.id)}
              className={cn(
                'shrink-0 inline-flex items-center gap-1.5 h-7 px-3 rounded-full text-xs font-medium border transition-colors',
                categoryId === cat.id
                  ? 'text-white border-transparent'
                  : 'bg-background text-muted-foreground border-border hover:bg-accent',
              )}
              style={
                categoryId === cat.id
                  ? { backgroundColor: cat.color, borderColor: cat.color }
                  : {}
              }
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  backgroundColor: categoryId === cat.id ? 'rgba(255,255,255,0.7)' : cat.color,
                }}
              />
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* Bookmark grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <BookmarkIcon className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-semibold mb-1">
            {debouncedSearch || categoryId ? 'No bookmarks found' : 'No bookmarks yet'}
          </h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-xs">
            {debouncedSearch || categoryId
              ? 'Try a different search or category filter'
              : 'Start saving links with titles, categories, and notes on why they matter'}
          </p>
          {!debouncedSearch && !categoryId && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add your first bookmark
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} onEdit={handleEdit} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
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

      {/* Add / Edit dialog */}
      <BookmarkDialog open={dialogOpen} onClose={handleCloseDialog} bookmark={editingBookmark} />
    </div>
  );
}
