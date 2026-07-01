import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // proxy.ts already gates /api/lessons/*, but verify independently — a Route
  // Handler must never trust that proxy ran (see Next.js auth guide: proxy
  // matcher changes can silently drop coverage).
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const { data: lesson, error: lessonError } = await supabase
    .from('lessons')
    .select('video_path')
    .eq('id', id)
    .single();

  if (lessonError || !lesson) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  // Bucket is fully private — only the service role can mint signed URLs.
  const admin = createAdminClient();
  const { data: signed, error: signError } = await admin.storage
    .from('lesson-videos')
    .createSignedUrl(lesson.video_path, 120);

  if (signError || !signed) {
    return NextResponse.json({ error: 'video_unavailable' }, { status: 500 });
  }

  return NextResponse.json({ url: signed.signedUrl });
}
