import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient, requireAdminUser } from '@/lib/supabase/route';

function getAdmin() {
  return createServiceRoleClient();
}

// GET /api/modules?program_id=xxx
export async function GET(req: NextRequest) {
  const auth = await requireAdminUser();
  if (auth.error) return auth.error;

  const supabase = getAdmin();
  const { searchParams } = new URL(req.url);
  const programId = searchParams.get('program_id');

  let query = supabase
    .from('modules')
    .select('*, lessons(id, title, duration, status, sort_order, video_url, module_id)')
    .order('sort_order', { ascending: true });

  if (programId) query = query.eq('program_id', programId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST /api/modules — create a new module
export async function POST(req: NextRequest) {
  const auth = await requireAdminUser();
  if (auth.error) return auth.error;

  const supabase = getAdmin();
  const body = await req.json();

  if (!body.title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  if (!body.program_id) return NextResponse.json({ error: 'program_id is required' }, { status: 400 });
  if (!body.course_id) return NextResponse.json({ error: 'course_id is required' }, { status: 400 });

  const { data, error } = await supabase
    .from('modules')
    .insert([{
      title: body.title,
      description: body.description ?? '',
      program_id: body.program_id,
      course_id: body.course_id,
      sort_order: body.sort_order ?? 0,
      status: body.status ?? 'draft',
      focus_area: body.focus_area || null,
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// PATCH /api/modules — update a module
export async function PATCH(req: NextRequest) {
  const auth = await requireAdminUser();
  if (auth.error) return auth.error;

  const supabase = getAdmin();
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { data, error } = await supabase
    .from('modules')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// DELETE /api/modules?id=xxx
export async function DELETE(req: NextRequest) {
  const auth = await requireAdminUser();
  if (auth.error) return auth.error;

  const supabase = getAdmin();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { error } = await supabase.from('modules').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
