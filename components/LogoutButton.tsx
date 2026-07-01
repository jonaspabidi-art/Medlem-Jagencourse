'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      style={{
        background: 'transparent',
        border: '1px solid var(--border-2)',
        color: 'var(--text-2)',
        fontSize: 13,
        padding: '8px 16px',
        borderRadius: 6,
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}
    >
      Logga ut
    </button>
  );
}
