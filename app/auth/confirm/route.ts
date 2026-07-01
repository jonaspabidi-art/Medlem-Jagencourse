import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// Invite links (generated via lib/invite.ts) point here after Supabase's own
// /auth/v1/verify endpoint validates the token. @supabase/ssr uses the PKCE
// flow, so what arrives is a `?code=` param — not a URL hash — which must be
// exchanged for a session server-side so the resulting cookie is set correctly.
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}/set-password`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=invite_link_invalid`);
}
