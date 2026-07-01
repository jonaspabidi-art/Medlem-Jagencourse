import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { TopNav } from '@/components/TopNav';
import { VideoPlayer } from '@/components/VideoPlayer';
import { MarkCompleteButton } from '@/components/MarkCompleteButton';
import type { ModuleWithLessons } from '@/lib/types';

export default async function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [{ data: profile }, { data: modules }, { data: progressRows }] = await Promise.all([
    supabase.from('profiles').select('is_admin').eq('id', user.id).single(),
    supabase
      .from('modules')
      .select('id, title, description, sort_order, lessons(id, module_id, title, description, video_path, duration_sec, sort_order)')
      .order('sort_order', { ascending: true })
      .order('sort_order', { referencedTable: 'lessons', ascending: true }),
    supabase.from('lesson_progress').select('lesson_id').eq('user_id', user.id),
  ]);

  const typedModules = (modules ?? []) as unknown as ModuleWithLessons[];
  const completedIds = new Set((progressRows ?? []).map((r) => r.lesson_id));

  const currentModule = typedModules.find((m) => m.lessons.some((l) => l.id === id));
  const lesson = currentModule?.lessons.find((l) => l.id === id);
  if (!lesson || !currentModule) notFound();

  // Flatten in course order to find the true "next lesson" across module boundaries.
  const flat = typedModules.flatMap((m) => m.lessons);
  const flatIndex = flat.findIndex((l) => l.id === id);
  const nextLesson = flatIndex >= 0 ? flat[flatIndex + 1] : undefined;

  const lessonIndexInModule = currentModule.lessons.findIndex((l) => l.id === id);

  return (
    <div style={{ minHeight: '100vh' }}>
      <TopNav isAdmin={!!profile?.is_admin} />

      <main
        className="container"
        style={{
          maxWidth: 1080,
          padding: '40px 24px 80px',
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: 40,
          alignItems: 'start',
        }}
      >
        <div>
          <div className="kicker" style={{ marginBottom: 10 }}>
            {currentModule.title} · {lessonIndexInModule + 1} av {currentModule.lessons.length}
          </div>
          <h1 className="h1" style={{ fontSize: 28, margin: '0 0 20px' }}>{lesson.title}</h1>

          <VideoPlayer key={lesson.id} lessonId={lesson.id} />

          {lesson.description && (
            <p style={{ fontSize: 15, color: 'var(--text-2)', lineHeight: 1.6, marginTop: 22 }}>
              {lesson.description}
            </p>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
            <MarkCompleteButton
              lessonId={lesson.id}
              userId={user.id}
              initialCompleted={completedIds.has(lesson.id)}
            />
            {nextLesson && (
              <Link href={`/lektion/${nextLesson.id}`} className="btn-secondary">
                Nästa lektion →
              </Link>
            )}
          </div>
        </div>

        <aside className="card" style={{ padding: 20, position: 'sticky', top: 84 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-3)', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            {currentModule.title}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {currentModule.lessons.map((l) => {
              const isCurrent = l.id === lesson.id;
              const isDone = completedIds.has(l.id);
              return (
                <Link
                  key={l.id}
                  href={`/lektion/${l.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '9px 10px',
                    borderRadius: 6,
                    fontSize: 14,
                    color: isCurrent ? 'var(--accent)' : 'var(--text-2)',
                    background: isCurrent ? 'rgba(91,141,239,0.1)' : 'transparent',
                  }}
                >
                  <span style={{ flexShrink: 0, width: 16 }}>{isDone ? '✓' : ''}</span>
                  <span>{l.title}</span>
                </Link>
              );
            })}
          </div>
        </aside>
      </main>
    </div>
  );
}
