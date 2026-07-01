'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CopyableLink } from './CopyableLink';

export function ApproveButton({ applicationId }: { applicationId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);
  const router = useRouter();

  async function handleApprove() {
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/admin/applications/${applicationId}/approve`, {
      method: 'POST',
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(body.error ?? 'Något gick fel.');
      setLoading(false);
      return;
    }

    // Hold off refreshing (which would move this application out of the
    // pending list and unmount this component) until the admin has copied
    // the link — otherwise it flashes away before they can grab it.
    setLink(body.link ?? null);
    setLoading(false);
  }

  if (link) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, minWidth: 260 }}>
        <CopyableLink link={link} />
        <button onClick={() => router.refresh()} className="btn-secondary" style={{ padding: '6px 14px', fontSize: 12 }}>
          Klart
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
      <button onClick={handleApprove} disabled={loading} className="btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>
        {loading ? 'Godkänner…' : 'Godkänn'}
      </button>
      {error && <span style={{ fontSize: 12, color: '#d98a5a' }}>{error}</span>}
    </div>
  );
}
