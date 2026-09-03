import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient, requireAdminUser } from '@/lib/supabase/route';

function getAdmin() {
  return createServiceRoleClient();
}

// GET /api/enrollments?user_id=xxx or ?program_id=xxx
export async function GET(req: NextRequest) {
  const auth = await requireAdminUser();
  if (auth.error) return auth.error;

  const supabase = getAdmin();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('user_id');
  const programId = searchParams.get('program_id');

  let query = supabase
    .from('enrollments')
    .select('*, user_profiles(full_name, email), programs(title)')
    .order('enrolled_at', { ascending: false });

  if (userId) query = query.eq('user_id', userId);
  if (programId) query = query.eq('program_id', programId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// POST /api/enrollments — enroll a student in a program
export async function POST(req: NextRequest) {
  const auth = await requireAdminUser();
  if (auth.error) return auth.error;

  const supabase = getAdmin();
  const body = await req.json();

  if (!body.user_id) return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
  if (!body.program_id) return NextResponse.json({ error: 'program_id is required' }, { status: 400 });

  // Check for existing active enrollment
  const { data: existing } = await supabase
    .from('enrollments')
    .select('id')
    .eq('user_id', body.user_id)
    .eq('program_id', body.program_id)
    .eq('enrollment_status', 'active')
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ error: 'Student is already enrolled in this program' }, { status: 409 });
  }

  const { data, error } = await supabase
    .from('enrollments')
    .insert([{
      user_id: body.user_id,
      program_id: body.program_id,
      order_id: body.order_id || null,
      enrollment_status: body.enrollment_status ?? 'active',
      expires_at: body.expires_at || null,
    }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// PATCH /api/enrollments — update enrollment status
export async function PATCH(req: NextRequest) {
  const auth = await requireAdminUser();
  if (auth.error) return auth.error;

  const supabase = getAdmin();
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { data, error } = await supabase
    .from('enrollments')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

// DELETE /api/enrollments?id=xxx
export async function DELETE(req: NextRequest) {
  const auth = await requireAdminUser();
  if (auth.error) return auth.error;

  const supabase = getAdmin();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { error } = await supabase.from('enrollments').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
