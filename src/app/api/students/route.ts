import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient, requireAdminUser } from '@/lib/supabase/route';

const supabase = createServiceRoleClient();

// GET /api/students — list all students (user_profiles with role=student) + invitations
export async function GET() {
  try {
    const auth = await requireAdminUser();
    if (auth.error) return auth.error;

    const { data: students, error: studentsError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'student')
      .order('created_at', { ascending: false });

    if (studentsError) throw studentsError;

    const { data: invitations, error: invError } = await supabase
      .from('student_invitations')
      .select('*')
      .order('created_at', { ascending: false });

    if (invError) throw invError;

    return NextResponse.json({ students: students || [], invitations: invitations || [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST /api/students — admin adds a new student invitation
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAdminUser();
    if (auth.error) return auth.error;

    const body = await req.json();
    const { email, full_name, notes } = body;

    if (!email || !full_name) {
      return NextResponse.json({ error: 'Email and full name are required' }, { status: 400 });
    }

    // Check if invitation already exists
    const { data: existing } = await supabase
      .from('student_invitations')
      .select('id, status')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (existing) {
      return NextResponse.json({ error: 'An invitation for this email already exists' }, { status: 409 });
    }

    const { data, error } = await supabase
      .from('student_invitations')
      .insert({
        email: email.toLowerCase().trim(),
        full_name: full_name.trim(),
        notes: notes || null,
        status: 'pending',
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ invitation: data }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PATCH /api/students — update invitation status or student profile
export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAdminUser();
    if (auth.error) return auth.error;

    const body = await req.json();
    const { id, type, ...updates } = body;

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    if (type === 'invitation') {
      const { data, error } = await supabase
        .from('student_invitations')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ invitation: data });
    } else {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ student: data });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE /api/students — delete invitation
export async function DELETE(req: NextRequest) {
  try {
    const auth = await requireAdminUser();
    if (auth.error) return auth.error;

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const type = searchParams.get('type') || 'invitation';

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    if (type === 'invitation') {
      const { error } = await supabase.from('student_invitations').delete().eq('id', id);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('user_profiles')
        .update({ is_active: false })
        .eq('id', id);
      if (error) throw error;
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
