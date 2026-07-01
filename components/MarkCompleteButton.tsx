'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export function MarkCompleteButton({
  lessonId,
  userId,
  initialCompleted,
}: {
  lessonId: string;
  userId: string;
  initialCompleted: boolean;
}) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggle() {
    setLoading(true);
    const supabase = createClient();

    if (completed) {
      await supabase.from('lesson_progress').delete().eq('user_id', userId).eq('lesson_id', lessonId);
    } else {
      await supabase.from('lesson_progress').insert({ user_id: userId, lesson_id: lessonId });
    }

    setCompleted(!completed);
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={completed ? 'btn-secondary' : 'btn-primary'}
      style={{ opacity: loading ? 0.6 : 1 }}
    >
      {completed ? '✓ Klar — klicka för att avmarkera' : 'Markera som klar'}
    </button>
  );
}
