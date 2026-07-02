'use client';

import { useEffect, useState } from 'react';

export function VideoPlayer({ lessonId }: { lessonId: string }) {
  const [src, setSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/lessons/${lessonId}/video-url`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Kunde inte hämta videon.');
        const data = await res.json();
        if (!cancelled) setSrc(data.url);
      })
      .catch(() => {
        if (!cancelled) setError('Kunde inte hämta videolänken. Prova att ladda om sidan.');
      });

    return () => {
      cancelled = true;
    };
  }, [lessonId]);

  return (
    <div
      style={{
        aspectRatio: '16/9',
        background: '#000',
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {error && (
        <p style={{ color: 'var(--text-2)', fontSize: 14, padding: '0 24px', textAlign: 'center' }}>{error}</p>
      )}
      {!error && !src && <p style={{ color: 'var(--text-3)', fontSize: 14 }}>Laddar video…</p>}
      {src && (
        <video
          src={src}
          controls
          style={{ width: '100%', height: '100%' }}
          onError={() => setError('Den här lektionen har ingen video uppladdad än.')}
        />
      )}
    </div>
  );
}
