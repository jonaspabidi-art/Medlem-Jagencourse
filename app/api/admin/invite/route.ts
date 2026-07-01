import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createInviteLink } from '@/lib/invite';

// Standalone invite: lets an admin invite someone directly (e.g. a friend or
// beta tester) without them having gone through the landing page application
// form first. Distinct from the applications-approval flow.
export async function POST(req: Request) {
  const supabase = await createClient();

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

  const body = await req.json().catch(() => null);
  const email = typeof body?.email === 'string' ? body.email.trim() : '';
  const fullName = typeof body?.full_name === 'string' ? body.full_name.trim() : '';

  if (!email) {
    return NextResponse.json({ error: 'E-post krävs.' }, { status: 400 });
  }

  const admin = createAdminClient();
  const { link, error } = await createInviteLink(admin, email, fullName || undefined);

  if (error || !link) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, link });
}
