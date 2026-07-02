import Image from 'next/image';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { SetPasswordForm } from '@/components/SetPasswordForm';

export default async function SetPasswordPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // No session means the invite link was invalid, expired, or already used.
  if (!user) redirect('/login');

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
      <div className="card auth-card" style={{ width: '100%', maxWidth: 400, padding: '34px' }}>
        <h1 className="h1" style={{ fontSize: 26, margin: '0 0 6px' }}>Välkommen!</h1>
        <p style={{ fontSize: 15, color: 'var(--text-2)', margin: '0 0 26px' }}>
          Sätt ett lösenord för {user.email} så är du redo.
        </p>
        <SetPasswordForm />
      </div>
    </div>
  );
}
