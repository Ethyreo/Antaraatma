import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

function createSupabaseServer() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}

// POST /api/progress — upsert a progress record
// Body: { lesson_id, module_id, course_id, program_id, action: 'access' | 'complete' }
export async function POST(req: NextRequest) {
  try {
    const supabase = createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { lesson_id, module_id, course_id, program_id, action } = body;

    if (!lesson_id || !program_id || !action) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const isComplete = action === 'complete';

    const upsertPayload: Record<string, unknown> = {
      user_id: user.id,
      lesson_id,
      module_id: module_id ?? null,
      course_id: course_id ?? null,
      program_id,
      last_accessed_at: now,
    };

    if (isComplete) {
      upsertPayload.is_completed = true;
      upsertPayload.progress_percent = 100;
      upsertPayload.completed_at = now;
    }

    const { error } = await supabase
      .from('progress_records')
      .upsert(upsertPayload, { onConflict: 'user_id,lesson_id' });

    if (error) {
      console.error('Progress upsert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, action });
  } catch (err) {
    console.error('Progress route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
