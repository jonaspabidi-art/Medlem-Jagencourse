import type { SupabaseClient } from '@supabase/supabase-js';

// Generates an invite link without sending an email. Supabase's shared SMTP
// on the free tier has a very low send rate limit — generateLink sidesteps
// that entirely, and lets the admin send the link however they prefer
// (WhatsApp, email, SMS) instead of depending on Supabase's mailer.
export async function createInviteLink(admin: SupabaseClient, email: string, fullName?: string | null) {
  // NEXT_PUBLIC_SITE_URL must point at the deployed app (e.g. https://your-site.netlify.app)
  // so the invite link's PKCE callback lands back on our /auth/confirm route
  // instead of localhost.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  const { data, error } = await admin.auth.admin.generateLink({
    type: 'invite',
    email,
    options: {
      ...(fullName ? { data: { full_name: fullName } } : {}),
      redirectTo: `${siteUrl}/auth/confirm`,
    },
  });

  if (error || !data?.properties?.action_link) {
    return { link: null, error: error?.message ?? 'Kunde inte skapa inbjudningslänk.' };
  }

  return { link: data.properties.action_link, error: null };
}
