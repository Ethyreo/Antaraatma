import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient, requireAuthenticatedUser } from '@/lib/supabase/route';

const supabase = createServiceRoleClient();

// PATCH /api/students/update-profile
export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireAuthenticatedUser();
    if (auth.error) return auth.error;

    const body = await req.json();
    const { userId, ...profileFields } = body;

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    if (auth.user.id !== userId && auth.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...profileFields,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ profile: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
