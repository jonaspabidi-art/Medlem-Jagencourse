import { createClient } from '@/lib/supabase/server';
import { TopNav } from '@/components/TopNav';
import { ApproveButton } from '@/components/ApproveButton';
import { InviteForm } from '@/components/InviteForm';

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  // proxy.ts already redirects non-admins away from /admin, but this page
  // (and every /api/admin/* handler) verifies is_admin independently too.
  const { data: profile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!profile?.is_admin) return null;

  const { data: applications } = await supabase
    .from('applications')
    .select('*')
    .order('created_at', { ascending: false });

  const pending = (applications ?? []).filter((a) => a.status === 'pending');
  const decided = (applications ?? []).filter((a) => a.status !== 'pending');

  return (
    <div style={{ minHeight: '100vh' }}>
      <TopNav isAdmin={true} />

      <main className="container" style={{ maxWidth: 880, padding: '48px 24px 80px' }}>
        <div className="kicker" style={{ marginBottom: 12 }}>Admin</div>
        <h1 className="h1" style={{ fontSize: 34, margin: '0 0 32px' }}>Ansökningar</h1>

        <InviteForm />

        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, marginBottom: 14 }}>
          Väntar på godkännande ({pending.length})
        </h2>
        {pending.length === 0 && (
          <p style={{ color: 'var(--text-3)', fontSize: 14, marginBottom: 32 }}>Inga väntande ansökningar.</p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 48 }}>
          {pending.map((app) => (
            <div
              key={app.id}
              className="card admin-card-row"
              style={{ padding: 20, display: 'flex', justifyContent: 'space-between', gap: 20, alignItems: 'center' }}
            >
              <div>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 600, fontSize: 16 }}>{app.name}</div>
                <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 2 }}>{app.email}</div>
                {app.phone && <div style={{ fontSize: 13, color: 'var(--text-3)' }}>{app.phone}</div>}
                {app.weekly_hours && (
                  <div style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 6 }}>
                    Tid per vecka: {app.weekly_hours}
                  </div>
                )}
                {app.goal && (
                  <div style={{ fontSize: 13, color: 'var(--text-2)', marginTop: 8, maxWidth: 480 }}>{app.goal}</div>
                )}
              </div>
              <ApproveButton applicationId={app.id} />
            </div>
          ))}
        </div>

        {decided.length > 0 && (
          <>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 18, marginBottom: 14 }}>Avgjorda</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {decided.map((app) => (
                <div
                  key={app.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: 6,
                    padding: '12px 16px',
                    border: '1px solid var(--border)',
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                >
                  <span>{app.name} · {app.email}</span>
                  <span style={{ color: app.status === 'approved' ? 'var(--accent)' : 'var(--text-3)' }}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
