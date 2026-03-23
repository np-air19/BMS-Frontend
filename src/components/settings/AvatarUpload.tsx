'use client';

import { useRef, useState } from 'react';
import { Camera, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUploadAvatar, useRemoveAvatar } from '@/hooks/useSettings';

interface AvatarUploadProps {
  currentAvatar: string | null | undefined;
  initials: string;
}

export function AvatarUpload({ currentAvatar, initials }: AvatarUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const { mutate: uploadAvatar, isPending: isUploading } = useUploadAvatar();
  const { mutate: removeAvatar, isPending: isRemoving } = useRemoveAvatar();

  const isBusy = isUploading || isRemoving;
  const displaySrc = preview ?? currentAvatar ?? null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    uploadAvatar(file, {
      onSuccess: () => {
        URL.revokeObjectURL(objectUrl);
        setPreview(null);
      },
      onError: () => {
        URL.revokeObjectURL(objectUrl);
        setPreview(null);
      },
    });

    e.target.value = '';
  };

  const handleRemove = () => {
    setPreview(null);
    removeAvatar();
  };

  return (
    <div className="flex items-center gap-5">
      <div className="relative group shrink-0">
        <div
          className={cn(
            'w-20 h-20 rounded-full overflow-hidden border-2 border-border',
            'flex items-center justify-center bg-primary text-primary-foreground text-2xl font-semibold',
          )}
        >
          {displaySrc ? (
            <img
              src={displaySrc}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          ) : (
            <span>{initials}</span>
          )}
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isBusy}
          className={cn(
            'absolute inset-0 rounded-full flex items-center justify-center',
            'bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity',
            isBusy && 'opacity-100 cursor-not-allowed',
          )}
          aria-label="Upload avatar"
        >
          {isUploading ? (
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          ) : (
            <Camera className="w-5 h-5 text-white" />
          )}
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        <Button
          variant="outline"
          size="sm"
          className="gap-2 w-fit"
          onClick={() => fileInputRef.current?.click()}
          disabled={isBusy}
        >
          <Camera className="w-3.5 h-3.5" />
          {currentAvatar || preview ? 'Change Photo' : 'Upload Photo'}
        </Button>

        {(currentAvatar || preview) && (
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 w-fit text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleRemove}
            disabled={isBusy}
          >
            {isRemoving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Trash2 className="w-3.5 h-3.5" />
            )}
            Remove Photo
          </Button>
        )}

        <p className="text-xs text-muted-foreground">JPG, PNG or WebP · Max 5 MB</p>
      </div>
    </div>
  );
}
