import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { createClient as createServiceClient } from '@supabase/supabase-js';
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

// Service-role client — bypasses RLS for trusted server-side writes
function createServiceSupabase() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET /api/progress?program_id=xxx — fetch progress records for the authenticated user
export async function GET(req: NextRequest) {
  try {
    const supabase = createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const programId = searchParams.get('program_id');

    let query = supabase
      .from('progress_records')
      .select('id, lesson_id, module_id, course_id, program_id, is_completed, progress_percent, completed_at, last_accessed_at')
      .eq('user_id', user.id);

    if (programId) {
      query = query.eq('program_id', programId);
    }

    const { data, error } = await query;
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ records: data ?? [] });
  } catch (err) {
    console.error('Progress GET error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/progress — upsert a progress record
// Body: { lesson_id, module_id, course_id, program_id, action: 'access' | 'complete' }
export async function POST(req: NextRequest) {
  try {
    // Authenticate via cookie-based client
    const supabase = createSupabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { lesson_id, module_id, course_id, program_id, action } = body;

    if (!lesson_id || !program_id || !action) {
      return NextResponse.json({ error: 'Missing required fields: lesson_id, program_id, action' }, { status: 400 });
    }

    if (!['access', 'complete'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be "access" or "complete"' }, { status: 400 });
    }

    const now = new Date().toISOString();
    const isComplete = action === 'complete';

    // Use service-role client to bypass RLS for the upsert
    const serviceSupabase = createServiceSupabase();

    // First check if a record already exists
    const { data: existing } = await serviceSupabase
      .from('progress_records')
      .select('id, is_completed')
      .eq('user_id', user.id)
      .eq('lesson_id', lesson_id)
      .maybeSingle();

    // Don't downgrade a completed lesson back to incomplete
    if (existing?.is_completed && !isComplete) {
      // Just update last_accessed_at
      await serviceSupabase
        .from('progress_records')
        .update({ last_accessed_at: now, updated_at: now })
        .eq('user_id', user.id)
        .eq('lesson_id', lesson_id);

      return NextResponse.json({ success: true, action, already_completed: true });
    }

    const upsertPayload: Record<string, unknown> = {
      user_id: user.id,
      lesson_id,
      module_id: module_id ?? null,
      course_id: course_id ?? null,
      program_id,
      last_accessed_at: now,
      updated_at: now,
    };

    if (isComplete) {
      upsertPayload.is_completed = true;
      upsertPayload.progress_percent = 100;
      upsertPayload.completed_at = now;
    } else {
      // Access action — ensure progress_percent is at least 0 (don't overwrite if already higher)
      if (!existing) {
        upsertPayload.is_completed = false;
        upsertPayload.progress_percent = 0;
      }
    }

    const { error } = await serviceSupabase
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
