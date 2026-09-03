import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient, requireAdminUser } from '@/lib/supabase/route';

function getAdmin() {
  return createServiceRoleClient();
}

// GET /api/admin/student-progress?user_id=xxx
// Returns all enrollments for a student with full program → module → lesson structure + progress records
export async function GET(req: NextRequest) {
  const auth = await requireAdminUser();
  if (auth.error) return auth.error;

  const supabase = getAdmin();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id');

  if (!userId) {
    return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
  }

  try {
    // 1. Get all enrollments for this student
    const { data: enrollments, error: enrollErr } = await supabase
      .from('enrollments')
      .select('id, program_id, enrolled_at, enrollment_status, programs(id, title, slug)')
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false });

    if (enrollErr) throw enrollErr;

    if (!enrollments || enrollments.length === 0) {
      return NextResponse.json({ programs: [] });
    }

    const programIds = enrollments.map((e: any) => e.program_id);

    // 2. Get all modules with their lessons for these programs
    const { data: modules, error: modErr } = await supabase
      .from('modules')
      .select('id, title, program_id, sort_order, lessons(id, title, sort_order, duration, module_id, program_id, course_id)')
      .in('program_id', programIds)
      .order('sort_order', { ascending: true });

    if (modErr) throw modErr;

    // 3. Get all progress records for this student across these programs
    const { data: progressRecords, error: progErr } = await supabase
      .from('progress_records')
      .select('id, lesson_id, module_id, program_id, is_completed, progress_percent, completed_at, last_accessed_at')
      .eq('user_id', userId)
      .in('program_id', programIds);

    if (progErr) throw progErr;

    // Build a map of lesson_id -> progress record
    const progressMap: Record<string, any> = {};
    (progressRecords || []).forEach((r: any) => {
      progressMap[r.lesson_id] = r;
    });

    // Build structured response: program → modules → lessons with progress
    const programs = enrollments.map((enrollment: any) => {
      const program = enrollment.programs;
      const programModules = (modules || [])
        .filter((m: any) => m.program_id === enrollment.program_id)
        .map((mod: any) => {
          const lessons = ((mod.lessons as any[]) || [])
            .sort((a: any, b: any) => a.sort_order - b.sort_order)
            .map((lesson: any) => {
              const progress = progressMap[lesson.id];
              return {
                id: lesson.id,
                title: lesson.title,
                duration: lesson.duration,
                sort_order: lesson.sort_order,
                module_id: lesson.module_id,
                course_id: lesson.course_id,
                program_id: lesson.program_id,
                is_completed: progress?.is_completed ?? false,
                progress_percent: progress?.progress_percent ?? 0,
                completed_at: progress?.completed_at ?? null,
                last_accessed_at: progress?.last_accessed_at ?? null,
                has_record: !!progress,
              };
            });

          const completedCount = lessons.filter((l: any) => l.is_completed).length;
          return {
            id: mod.id,
            title: mod.title,
            sort_order: mod.sort_order,
            lessons,
            total_lessons: lessons.length,
            completed_lessons: completedCount,
          };
        });

      const totalLessons = programModules.reduce((sum: number, m: any) => sum + m.total_lessons, 0);
      const completedLessons = programModules.reduce((sum: number, m: any) => sum + m.completed_lessons, 0);
      const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        enrollment_id: enrollment.id,
        enrollment_status: enrollment.enrollment_status,
        enrolled_at: enrollment.enrolled_at,
        program_id: program?.id,
        program_title: program?.title ?? 'Unknown Program',
        modules: programModules,
        total_lessons: totalLessons,
        completed_lessons: completedLessons,
        progress_percent: progressPercent,
      };
    });

    return NextResponse.json({ programs });
  } catch (err: any) {
    console.error('Admin student progress GET error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/admin/student-progress — admin toggles a lesson's completion for a student
// Body: { user_id, lesson_id, module_id, course_id, program_id, is_completed }
export async function PATCH(req: NextRequest) {
  const auth = await requireAdminUser();
  if (auth.error) return auth.error;

  const supabase = getAdmin();

  try {
    const body = await req.json();
    const { user_id, lesson_id, module_id, course_id, program_id, is_completed } = body;

    if (!user_id || !lesson_id || !program_id) {
      return NextResponse.json({ error: 'user_id, lesson_id, and program_id are required' }, { status: 400 });
    }

    const now = new Date().toISOString();

    const upsertPayload: Record<string, unknown> = {
      user_id,
      lesson_id,
      module_id: module_id ?? null,
      course_id: course_id ?? null,
      program_id,
      is_completed,
      progress_percent: is_completed ? 100 : 0,
      completed_at: is_completed ? now : null,
      last_accessed_at: now,
      updated_at: now,
    };

    const { error } = await supabase
      .from('progress_records')
      .upsert(upsertPayload, { onConflict: 'user_id,lesson_id' });

    if (error) {
      console.error('Admin progress upsert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, is_completed });
  } catch (err: any) {
    console.error('Admin student progress PATCH error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
