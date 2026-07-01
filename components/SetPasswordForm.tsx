'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function SetPasswordForm() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('Lösenordet måste vara minst 8 tecken.');
      return;
    }
    if (password !== confirm) {
      setError('Lösenorden matchar inte.');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError('Kunde inte sätta lösenordet. Prova igen.');
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <label className="field-label">
        Nytt lösenord
        <input
          className="field-input"
          type="password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Minst 8 tecken"
        />
      </label>
      <label className="field-label">
        Bekräfta lösenord
        <input
          className="field-input"
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Skriv lösenordet igen"
        />
      </label>
      {error && <p style={{ color: '#d98a5a', fontSize: 14, margin: 0 }}>{error}</p>}
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Sparar…' : 'Sätt lösenord och fortsätt'}
      </button>
    </form>
  );
}
