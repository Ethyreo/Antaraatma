import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// GET /api/lessons?module_id=xxx or ?program_id=xxx
export async function GET(req: NextRequest) {
  const supabase = getAdmin();
  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get('module_id');
  const programId = searchParams.get('program_id');

  let query = supabase
    .from('lessons')
    .select('*')
    .order('sort_order', { ascending: true });

  if (moduleId) query = query.eq('module_id', moduleId);
  if (programId) query = query.eq('program_id', programId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST /api/lessons — create a new lesson
export async function POST(req: NextRequest) {
  const supabase = getAdmin();
  const body = await req.json();

  if (!body.title?.trim()) return NextResponse.json({ error: 'Title is required' }, { status: 400 });
  if (!body.module_id) return NextResponse.json({ error: 'module_id is required' }, { status: 400 });
  if (!body.course_id) return NextResponse.json({ error: 'course_id is required' }, { status: 400 });
  if (!body.program_id) return NextResponse.json({ error: 'program_id is required' }, { status: 400 });

  const { data, error } = await supabase
    .from('lessons')
    .insert([{
      title: body.title,
      description: body.description ?? '',
      content: body.content || null,
      video_url: body.video_url || null,
      duration: body.duration || null,
      module_id: body.module_id,
      course_id: body.course_id,
      program_id: body.program_id,
      sort_order: body.sort_order ?? 0,
      status: body.status ?? 'draft',
      access_level: body.access_level ?? 'enrolled',
      unlock_type: body.unlock_type ?? 'sequential',
      is_free: body.is_free ?? false,
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// PATCH /api/lessons — update a lesson
export async function PATCH(req: NextRequest) {
  const supabase = getAdmin();
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { data, error } = await supabase
    .from('lessons')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// DELETE /api/lessons?id=xxx
export async function DELETE(req: NextRequest) {
  const supabase = getAdmin();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { error } = await supabase.from('lessons').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
