'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function ApproveButton({ applicationId }: { applicationId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleApprove() {
    setLoading(true);
    setError(null);

    const res = await fetch(`/api/admin/applications/${applicationId}/approve`, {
      method: 'POST',
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? 'Något gick fel.');
      setLoading(false);
      return;
    }

    router.refresh();
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
