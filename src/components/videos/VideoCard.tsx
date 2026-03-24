'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ExternalLink, Pencil, Trash2, MoreHorizontal, PlayCircle, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useUpdateVideo, useDeleteVideo } from '@/hooks/useVideos';
import type { Video, LearningStatus } from '@/types';
import { cn } from '@/lib/utils';

// ── Status config ──────────────────────────────────────────────────────────
const STATUS = {
  not_started: {
    label: 'Not Started',
    cls: 'bg-slate-100 text-slate-600 border-slate-200',
    dot: 'bg-slate-400',
  },
  in_progress: {
    label: 'In Progress',
    cls: 'bg-amber-50 text-amber-700 border-amber-200',
    dot: 'bg-amber-500',
  },
  completed: {
    label: 'Completed',
    cls: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
} as const;

// ── Date formatter ─────────────────────────────────────────────────────────
function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Component ──────────────────────────────────────────────────────────────
interface Props {
  video: Video;
  onEdit: (v: Video) => void;
}

export default function VideoCard({ video, onEdit }: Props) {
  const [imgError, setImgError] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const updateMutation = useUpdateVideo();
  const deleteMutation = useDeleteVideo();

  const displayTitle = video.customTitle ?? video.title;
  const cfg = STATUS[video.learningStatus];

  const changeStatus = (status: LearningStatus) => {
    if (status === video.learningStatus) return;
    updateMutation.mutate({ id: video.id, data: { learningStatus: status } });
  };

  return (
    <>
      <div className="group flex flex-col rounded-xl border bg-card overflow-hidden hover:shadow-md transition-all duration-200">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-muted overflow-hidden">
          {video.thumbnailUrl && !imgError ? (
            <Image
              src={video.thumbnailUrl}
              alt={displayTitle}
              fill
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100">
              <PlayCircle className="w-10 h-10 text-slate-300" />
            </div>
          )}

          {/* Play overlay */}
          <a
            href={video.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors group/play"
            aria-label="Watch on YouTube"
          >
            <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover/play:opacity-100 scale-90 group-hover/play:scale-100 transition-all shadow-md">
              <PlayCircle className="w-5 h-5 text-red-600 fill-red-600" />
            </div>
          </a>

          {/* 3-dot menu overlay */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-7 h-7 rounded-md bg-black/60 hover:bg-black/80 flex items-center justify-center text-white transition-colors">
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem asChild>
                  <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Watch
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onEdit(video)}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setConfirmDelete(true)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col gap-2 p-3 flex-1">
          {/* Title + channel */}
          <div className="space-y-0.5">
            <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">
              {displayTitle}
            </p>
            {video.channelName && (
              <p className="text-xs text-muted-foreground">{video.channelName}</p>
            )}
          </div>

          {/* Notes preview */}
          {video.notes && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {video.notes}
            </p>
          )}

          {/* Footer: status dropdown + date */}
          <div className="flex items-center justify-between gap-2 mt-auto pt-1">
            {/* Inline status change */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold border transition-colors hover:opacity-80',
                    cfg.cls,
                  )}
                >
                  <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', cfg.dot)} />
                  {cfg.label}
                  <ChevronDown className="w-2.5 h-2.5 ml-0.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-36">
                {(Object.keys(STATUS) as LearningStatus[]).map((s) => (
                  <DropdownMenuItem
                    key={s}
                    onClick={() => changeStatus(s)}
                    className={cn(s === video.learningStatus && 'font-medium')}
                  >
                    <span
                      className={cn('w-2 h-2 rounded-full mr-2 shrink-0', STATUS[s].dot)}
                    />
                    {STATUS[s].label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <time className="text-[10px] text-muted-foreground shrink-0">
              {formatDate(video.createdAt)}
            </time>
          </div>
        </div>
      </div>

      {/* Delete confirm */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove video?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{displayTitle}&rdquo; will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate(video.id)}
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
