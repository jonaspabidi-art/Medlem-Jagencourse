'use client';

import { useState } from 'react';
import { CopyableLink } from './CopyableLink';

export function InviteForm() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [link, setLink] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setLink(null);

    const res = await fetch('/api/admin/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, full_name: name }),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setError(body.error ?? 'Något gick fel.');
      setLoading(false);
      return;
    }

    setLink(body.link);
    setEmail('');
    setName('');
    setLoading(false);
  }

  return (
    <div className="card" style={{ padding: 24, marginBottom: 40 }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 16, margin: '0 0 4px' }}>
        Bjud in en elev direkt
      </h2>
      <p style={{ fontSize: 13, color: 'var(--text-3)', margin: '0 0 18px' }}>
        Skapar en inbjudningslänk du kopierar och skickar själv — inget mejl skickas automatiskt.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--text-2)', flex: '1 1 200px' }}>
          E-post
          <input
            className="field-input"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="elev@exempel.se"
          />
        </label>
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12, color: 'var(--text-2)', flex: '1 1 160px' }}>
          Namn (valfritt)
          <input
            className="field-input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="För- och efternamn"
          />
        </label>
        <button type="submit" disabled={loading} className="btn-primary" style={{ padding: '13px 22px', fontSize: 14 }}>
          {loading ? 'Skapar…' : 'Skapa inbjudningslänk'}
        </button>
      </form>
      {error && <p style={{ color: '#d98a5a', fontSize: 13, marginTop: 12 }}>{error}</p>}
      {link && (
        <div style={{ marginTop: 16 }}>
          <CopyableLink link={link} />
        </div>
      )}
    </div>
  );
}
