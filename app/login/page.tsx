'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      setError('Fel e-post eller lösenord.');
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <Image src="/logo.png" alt="JAgencourse" width={150} height={32} style={{ height: 32, width: 'auto', marginBottom: 28 }} />
      <div className="card" style={{ width: '100%', maxWidth: 400, padding: '34px' }}>
        <h1 className="h1" style={{ fontSize: 26, margin: '0 0 6px' }}>Logga in</h1>
        <p style={{ fontSize: 15, color: 'var(--text-2)', margin: '0 0 26px' }}>
          Medlemsområdet för JAgencourse-elever.
        </p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <label className="field-label">
            E-post
            <input
              className="field-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="du@exempel.se"
            />
          </label>
          <label className="field-label">
            Lösenord
            <input
              className="field-input"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>
          {error && <p style={{ color: '#d98a5a', fontSize: 14, margin: 0 }}>{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: 8 }}>
            {loading ? 'Loggar in…' : 'Logga in'}
          </button>
        </form>
        <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 22, textAlign: 'center' }}>
          Fått en inbjudan? Sätt ditt lösenord via länken i mejlet, logga sedan in här.
        </p>
      </div>
    </div>
  );
}
