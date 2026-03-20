'use client';

import { useState, useRef } from 'react';
import { Plus, Search, PlayCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useVideos } from '@/hooks/useVideos';
import VideoCard from '@/components/videos/VideoCard';
import VideoDialog from '@/components/videos/VideoDialog';
import type { Video, LearningStatus } from '@/types';
import { cn } from '@/lib/utils';

const STATUS_FILTERS: { value: LearningStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'not_started', label: 'Not Started' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

export default function VideosPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<LearningStatus | 'all'>('all');
  const [page, setPage] = useState(1);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>();

  const handleSearch = (value: string) => {
    setSearch(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 400);
  };

  const { data, isLoading, isFetching } = useVideos({
    search: debouncedSearch || undefined,
    learningStatus: statusFilter !== 'all' ? statusFilter : undefined,
    page,
    limit: 12,
  });

  const videos = data?.data ?? [];
  const pagination = data?.pagination;

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingVideo(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Videos</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {pagination ? `${pagination.total} saved` : 'Your YouTube learning library'}
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingVideo(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add video
        </Button>
      </div>

      {/* Search + status filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by title or channel…"
            className="w-full h-9 pl-9 pr-8 rounded-md border bg-background text-sm outline-none focus:ring-2 focus:ring-ring transition-all"
          />
          {isFetching && !isLoading && (
            <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground animate-spin" />
          )}
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => {
                setStatusFilter(value);
                setPage(1);
              }}
              className={cn(
                'h-9 px-3 rounded-md text-sm font-medium border transition-colors',
                statusFilter === value
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-muted-foreground border-border hover:bg-accent',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-video rounded-xl" />
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <PlayCircle className="w-7 h-7 text-primary" />
          </div>
          <h3 className="font-semibold mb-1">
            {debouncedSearch || statusFilter !== 'all' ? 'No videos found' : 'No videos yet'}
          </h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-xs">
            {debouncedSearch || statusFilter !== 'all'
              ? 'Try a different search or filter'
              : 'Paste a YouTube URL to save videos and track your learning progress'}
          </p>
          {!debouncedSearch && statusFilter === 'all' && (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add your first video
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} onEdit={handleEdit} />
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

      <VideoDialog open={dialogOpen} onClose={handleClose} video={editingVideo} />
    </div>
  );
}
