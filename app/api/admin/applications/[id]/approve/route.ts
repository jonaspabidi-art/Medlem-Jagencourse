import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Verify the CALLER's own session is admin — proxy.ts already checks this
  // for page navigation, but a Route Handler must verify independently.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { data: callerProfile } = await supabase.from('profiles').select('is_admin').eq('id', user.id).single();
  if (!callerProfile?.is_admin) {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  const admin = createAdminClient();

  const { data: application, error: fetchError } = await admin
    .from('applications')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !application) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  // Idempotent: a double-click (or retry) on an already-approved application is a no-op.
  if (application.status !== 'pending') {
    return NextResponse.json({ ok: true, alreadyDecided: true });
  }

  const { error: inviteError } = await admin.auth.admin.inviteUserByEmail(application.email, {
    data: { full_name: application.name },
  });

  if (inviteError) {
    return NextResponse.json({ error: inviteError.message }, { status: 500 });
  }

  // profiles row is created by the on_auth_user_created trigger (0001_init.sql).

  const { error: updateError } = await admin
    .from('applications')
    .update({
      status: 'approved',
      approved_at: new Date().toISOString(),
      approved_by: user.id, // server-verified session id — never client input
    })
    .eq('id', id);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
