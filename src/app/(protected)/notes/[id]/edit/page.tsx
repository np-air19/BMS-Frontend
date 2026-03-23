'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';
import TagsInput from '@/components/notes/TagsInput';
import BookmarkSelector from '@/components/notes/BookmarkSelector';
import { useNote, useUpdateNote } from '@/hooks/useNotes';
import type { Note } from '@/types';

const TipTapEditor = dynamic(() => import('@/components/notes/TipTapEditor'), {
  ssr: false,
  loading: () => <Skeleton className="h-80 w-full rounded-md" />,
});

function NoteEditForm({ note }: { note: Note }) {
  const router = useRouter();
  const updateMutation = useUpdateNote();

  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [tags, setTags] = useState<string[]>(note.tags ?? []);
  const [bookmarkId, setBookmarkId] = useState<string | undefined>(note.bookmarkId ?? undefined);
  const [titleError, setTitleError] = useState('');

  const handleSubmit = async () => {
    if (!title.trim()) {
      setTitleError('Title is required');
      return;
    }
    setTitleError('');
    await updateMutation.mutateAsync({
      id: note.id,
      data: {
        title: title.trim(),
        content,
        tags: tags.length ? tags : [],
        bookmarkId: bookmarkId ?? null,
      },
    });
    router.push('/notes');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-xl font-bold tracking-tight">Edit note</h1>
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <Label htmlFor="note-title">Title</Label>
        <Input
          id="note-title"
          value={title}
          onChange={(e) => { setTitle(e.target.value); setTitleError(''); }}
          placeholder="Note title…"
        />
        {titleError && <p className="text-xs text-destructive">{titleError}</p>}
      </div>

      {/* Editor */}
      <div className="space-y-1.5">
        <Label>Content</Label>
        <TipTapEditor content={content} onChange={setContent} placeholder="Write your note…" />
      </div>

      {/* Tags */}
      <div className="space-y-1.5">
        <Label>
          Tags <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <TagsInput tags={tags} onChange={setTags} />
      </div>

      {/* Linked Bookmark */}
      <div className="space-y-1.5">
        <Label>
          Linked bookmark <span className="font-normal text-muted-foreground">(optional)</span>
        </Label>
        <BookmarkSelector value={bookmarkId} onChange={setBookmarkId} />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={updateMutation.isPending}>
          {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save changes
        </Button>
      </div>
    </div>
  );
}

export default function EditNotePage() {
  const { id } = useParams<{ id: string }>();
  const { data: note, isLoading } = useNote(id);

  if (isLoading || !note) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-full" />
        <Skeleton className="h-80 w-full rounded-xl" />
        <Skeleton className="h-9 w-full" />
      </div>
    );
  }

  return <NoteEditForm note={note} />;
}
