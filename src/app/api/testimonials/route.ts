import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { getRouteAuthContext, requireAdminUser } from '@/lib/supabase/route';

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET() {
  const { role } = await getRouteAuthContext();
  const supabase = getAdmin();
  let query = supabase
    .from('testimonials')
    .select('*')
    .order('sort_order', { ascending: true });
  if (role !== 'admin') {
    query = query.eq('status', 'published');
  }
  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminUser();
  if (auth.error) return auth.error;

  const supabase = getAdmin();
  const body = await req.json();
  const { data, error } = await supabase
    .from('testimonials')
    .insert([{
      name: body.name,
      role: body.role || null,
      avatar_url: body.avatar_url || null,
      content: body.content,
      program_id: body.program_id || null,
      rating: body.rating ?? 5,
      featured: body.featured ?? false,
      status: body.status ?? 'draft',
      sort_order: body.sort_order ?? 0,
    }])
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdminUser();
  if (auth.error) return auth.error;

  const supabase = getAdmin();
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const { data, error } = await supabase
    .from('testimonials')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdminUser();
  if (auth.error) return auth.error;

  const supabase = getAdmin();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
