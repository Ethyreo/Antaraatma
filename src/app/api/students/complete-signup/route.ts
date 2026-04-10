import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/students/complete-signup
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, email, fullName, phone } = body;

    if (!userId || !email) {
      return NextResponse.json({ error: 'userId and email are required' }, { status: 400 });
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
