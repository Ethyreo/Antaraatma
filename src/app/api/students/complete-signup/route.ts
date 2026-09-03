import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient, requireAuthenticatedUser } from '@/lib/supabase/route';

const supabase = createServiceRoleClient();

// POST /api/students/complete-signup
export async function POST(req: NextRequest) {
  try {
    const auth = await requireAuthenticatedUser();
    if (auth.error) return auth.error;

    const body = await req.json();
    const { userId, email, fullName, phone } = body;

    if (!userId || !email) {
      return NextResponse.json({ error: 'userId and email are required' }, { status: 400 });
    }

    if (auth.user.id !== userId && auth.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (
      auth.role !== 'admin' &&
      auth.user.email?.toLowerCase() !== email.toLowerCase().trim()
    ) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Upsert user_profiles with student role
    const { error: profileError } = await supabase
      .from('user_profiles')
      .upsert({
        id: userId,
        email: email.toLowerCase().trim(),
        full_name: fullName || '',
        phone: phone || null,
        role: 'student',
        is_active: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'id' });

    if (profileError) throw profileError;

    // Mark invitation as accepted
    await supabase
      .from('student_invitations')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('email', email.toLowerCase().trim());

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
