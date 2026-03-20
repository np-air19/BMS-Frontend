'use client';

import { useState } from 'react';
import { Expand, Trash2 } from 'lucide-react';
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
import { useDeleteScreenshot } from '@/hooks/useScreenshots';
import ScreenshotLightbox from './ScreenshotLightbox';
import type { Screenshot } from '@/types';

interface Props {
  screenshot: Screenshot;
}

export default function ScreenshotCard({ screenshot }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const deleteMutation = useDeleteScreenshot();

  return (
    <>
      <div className="group relative aspect-square rounded-xl overflow-hidden border bg-muted cursor-pointer">
        <img
          src={screenshot.imageUrl}
          alt={screenshot.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex flex-col justify-between p-2.5">
          {/* Action buttons */}
          <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setLightboxOpen(true)}
              className="p-1.5 rounded-md bg-white/15 hover:bg-white/25 text-white backdrop-blur-sm transition-colors"
              title="View"
            >
              <Expand className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="p-1.5 rounded-md bg-white/15 hover:bg-red-500/80 text-white backdrop-blur-sm transition-colors"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Title */}
          <p className="text-white text-xs font-medium line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity drop-shadow">
            {screenshot.title}
          </p>
        </div>
      </div>

      {lightboxOpen && (
        <ScreenshotLightbox
          screenshot={screenshot}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete screenshot?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{screenshot.title}&rdquo; will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteMutation.mutate(screenshot.id)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
