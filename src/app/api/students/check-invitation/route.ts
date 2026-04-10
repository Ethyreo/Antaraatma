import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/students/check-invitation?email=...
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('student_invitations')
      .select('id, email, full_name, status')
      .eq('email', email.toLowerCase().trim())
      .single();

    if (error || !data) {
      return NextResponse.json({ invited: false });
    }

    return NextResponse.json({ invited: true, invitation: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
