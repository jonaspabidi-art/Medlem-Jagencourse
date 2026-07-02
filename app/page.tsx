import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { TopNav } from '@/components/TopNav';
import { ProgressRing } from '@/components/ProgressRing';
import type { ModuleWithLessons } from '@/lib/types';

export default async function DashboardPage() {
  const supabase = await createClient();

  // proxy.ts already redirects unauthenticated visitors to /login, but every
  // protected surface must verify its own session too (defense in depth).
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

  const completedIds = new Set((progressRows ?? []).map((r) => r.lesson_id));
  const typedModules = (modules ?? []) as unknown as ModuleWithLessons[];

  const totalLessons = typedModules.reduce((sum, m) => sum + m.lessons.length, 0);
  const totalCompleted = typedModules.reduce(
    (sum, m) => sum + m.lessons.filter((l) => completedIds.has(l.id)).length,
    0
  );

  return (
    <div style={{ minHeight: '100vh' }}>
      <TopNav isAdmin={!!profile?.is_admin} />

      <main className="container" style={{ maxWidth: 960, padding: '48px 24px 80px' }}>
        <div className="kicker" style={{ marginBottom: 12 }}>Ditt medlemsområde</div>
        <h1 className="h1" style={{ fontSize: 34, margin: '0 0 8px' }}>Kursinnehåll</h1>
        <p style={{ fontSize: 15, color: 'var(--text-2)', margin: '0 0 8px' }}>
          Hoppa fritt mellan delarna — inget är låst. {totalCompleted} av {totalLessons} lektioner klara.
        </p>

        <div
          className="module-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 16,
            marginTop: 36,
          }}
        >
          {typedModules.map((mod, idx) => {
            const total = mod.lessons.length;
            const completed = mod.lessons.filter((l) => completedIds.has(l.id)).length;
            const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
            const firstLesson = mod.lessons[0];

            return (
              <Link
                key={mod.id}
                href={firstLesson ? `/lektion/${firstLesson.id}` : '#'}
                className="card"
                style={{
                  display: 'block',
                  padding: 26,
                  transition: 'border-color 150ms',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 32,
                      fontWeight: 700,
                      color: 'var(--border-2)',
                      letterSpacing: '-0.03em',
                    }}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <ProgressRing percent={percent} />
                </div>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 19, fontWeight: 600, margin: '0 0 8px', color: 'var(--text)' }}>
                  {mod.title}
                </h3>
                <p style={{ fontSize: 13, color: 'var(--text-3)', margin: 0 }}>
                  {completed} av {total} lektioner
                </p>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
