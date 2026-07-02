import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

// Returns a short-lived signed upload URL/token for a lesson's video_path.
// The browser then uploads the file bytes directly to Supabase Storage using
// that token — the file never passes through our own server/serverless
// function, which matters since video files can easily exceed typical
// function payload limits.
export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
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

  const admin = createAdminClient();

  const { data: lesson, error: lessonError } = await admin
    .from('lessons')
    .select('video_path')
    .eq('id', id)
    .single();

  if (lessonError || !lesson) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const { data: signed, error: signError } = await admin.storage
    .from('lesson-videos')
    .createSignedUploadUrl(lesson.video_path, { upsert: true });

  if (signError || !signed) {
    return NextResponse.json({ error: signError?.message ?? 'upload_url_failed' }, { status: 500 });
  }

  return NextResponse.json({ path: signed.path, token: signed.token });
}
