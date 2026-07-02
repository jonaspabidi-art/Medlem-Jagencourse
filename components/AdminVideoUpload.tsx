'use client';

import { useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function AdminVideoUpload({ lessonId }: { lessonId: string }) {
  const [status, setStatus] = useState<'idle' | 'uploading' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setStatus('uploading');
    setError(null);

    const urlRes = await fetch(`/api/admin/lessons/${lessonId}/upload-url`, { method: 'POST' });
    const urlBody = await urlRes.json().catch(() => ({}));

    if (!urlRes.ok) {
      setError(urlBody.error ?? 'Kunde inte förbereda uppladdning.');
      setStatus('error');
      return;
    }

    const supabase = createClient();
    const { error: uploadError } = await supabase.storage
      .from('lesson-videos')
      .uploadToSignedUrl(urlBody.path, urlBody.token, file);

    if (uploadError) {
      setError(uploadError.message);
      setStatus('error');
      return;
    }

    setStatus('done');
    // Full reload so the video player fetches a fresh signed URL for the newly uploaded file.
    window.location.reload();
  }

  return (
    <div
      style={{
        marginTop: 14,
        padding: '12px 14px',
        border: '1px dashed var(--border-2)',
        borderRadius: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        flexWrap: 'wrap',
      }}
    >
      <span style={{ fontSize: 12, color: 'var(--text-3)', flexShrink: 0 }}>Admin</span>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={status === 'uploading'}
        className="btn-secondary"
        style={{ padding: '8px 16px', fontSize: 13 }}
      >
        {status === 'uploading' ? 'Laddar upp…' : 'Ladda upp / byt video'}
      </button>
      <input ref={inputRef} type="file" accept="video/*" onChange={handleFileChange} style={{ display: 'none' }} />
      {status === 'error' && <span style={{ fontSize: 12, color: '#d98a5a' }}>{error}</span>}
    </div>
  );
}
