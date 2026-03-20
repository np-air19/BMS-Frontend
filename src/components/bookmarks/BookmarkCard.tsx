'use client';

import { useState } from 'react';
import { ExternalLink, Copy, Bell, Trash2, MoreHorizontal, Globe, Pencil } from 'lucide-react';
import { toast } from 'sonner';
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
import { useDeleteBookmark } from '@/hooks/useBookmarks';
import type { Bookmark } from '@/types';

// ── Helpers ────────────────────────────────────────────────────────────────
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return url;
  }
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 2) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── Component ──────────────────────────────────────────────────────────────
interface Props {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
}

export default function BookmarkCard({ bookmark, onEdit }: Props) {
  const [faviconError, setFaviconError] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteMutation = useDeleteBookmark();

  const domain = extractDomain(bookmark.url);

  const handleCopy = () => {
    navigator.clipboard.writeText(bookmark.url);
    toast.success('URL copied');
  };

  return (
    <>
      <div className="group relative flex flex-col gap-3 rounded-xl border bg-card p-4 hover:shadow-md hover:border-border/80 transition-all duration-200">
        {/* Header row */}
        <div className="flex items-start gap-3">
          {/* Favicon */}
          <div className="mt-0.5 w-8 h-8 rounded-lg border bg-muted flex items-center justify-center shrink-0 overflow-hidden">
            {bookmark.favicon && !faviconError ? (
              <img
                src={bookmark.favicon}
                alt=""
                className="w-4 h-4 object-contain"
                onError={() => setFaviconError(true)}
              />
            ) : (
              <Globe className="w-4 h-4 text-muted-foreground" />
            )}
          </div>

          {/* Title + domain */}
          <div className="flex-1 min-w-0">
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-sm text-foreground hover:text-primary transition-colors line-clamp-2 leading-snug"
            >
              {bookmark.title}
            </a>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">{domain}</p>
          </div>

          {/* 3-dot menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="opacity-0 group-hover:opacity-100 -mt-0.5 -mr-1 p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-all">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem asChild>
                <a href={bookmark.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open link
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(bookmark)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCopy}>
                <Copy className="w-4 h-4 mr-2" />
                Copy URL
              </DropdownMenuItem>
              <DropdownMenuItem disabled className="text-muted-foreground">
                <Bell className="w-4 h-4 mr-2" />
                Set reminder
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

        {/* Purpose */}
        {bookmark.purpose && (
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed -mt-1">
            {bookmark.purpose}
          </p>
        )}

        {/* Footer: categories + date */}
        <div className="flex items-center justify-between gap-2 mt-auto pt-1">
          <div className="flex flex-wrap gap-1 min-w-0">
            {bookmark.categories?.slice(0, 2).map((cat) => (
              <span
                key={cat.id}
                className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium"
                style={{ backgroundColor: `${cat.color}1a`, color: cat.color }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                {cat.name}
              </span>
            ))}
            {(bookmark.categories?.length ?? 0) > 2 && (
              <span className="text-[10px] text-muted-foreground self-center">
                +{(bookmark.categories?.length ?? 0) - 2}
              </span>
            )}
          </div>
          <time className="text-[10px] text-muted-foreground shrink-0">
            {formatDate(bookmark.createdAt)}
          </time>
        </div>
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete bookmark?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{bookmark.title}&rdquo; will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate(bookmark.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
