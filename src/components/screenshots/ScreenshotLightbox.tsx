'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import type { Screenshot } from '@/types';
import { Button } from '../ui/button';

interface Props {
  screenshot: Screenshot;
  onClose: () => void;
}

export default function ScreenshotLightbox({ screenshot, onClose }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <Button
        onClick={onClose}
        className="absolute top-4 right-4 px-3 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <X className="w-5 h-5" />
      </Button>

      {/* Image */}
      <div
        className="relative max-w-[90vw] max-h-[90vh] flex flex-col gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={screenshot.imageUrl}
          alt={screenshot.title}
          width={1200}
          height={800}
          unoptimized
          className="max-w-full max-h-[80vh] rounded-lg object-contain shadow-2xl w-auto h-auto"
        />
        <div className="text-center">
          <p className="text-white font-medium text-sm">{screenshot.title}</p>
          {screenshot.description && (
            <p className="text-white/60 text-xs mt-0.5">{screenshot.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
