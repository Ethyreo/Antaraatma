import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function GET() {
  const supabase = getAdmin();
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const supabase = getAdmin();
  const body = await req.json();
  // For admin-created posts, we need a user_id. Use a placeholder admin approach.
  // We'll look up the first admin user or use a fixed admin user_id from env.
  // For now, we'll require user_id to be passed or find an admin.
  const { data: adminUser } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('role', 'admin')
    .limit(1)
    .single();

  const userId = body.user_id || adminUser?.id;
  if (!userId) return NextResponse.json({ error: 'No admin user found. Please ensure an admin user exists.' }, { status: 400 });

  const { data, error } = await supabase
    .from('community_posts')
    .insert([{
      user_id: userId,
      author_name: body.author_name ?? 'Admin',
      category: body.category ?? 'Gratitude',
      title: body.title,
      body: body.body,
      is_pinned: body.is_pinned ?? false,
      status: body.status ?? 'published',
    }])
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PATCH(req: NextRequest) {
  const supabase = getAdmin();
  const body = await req.json();
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const { data, error } = await supabase
    .from('community_posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(req: NextRequest) {
  const supabase = getAdmin();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const { error } = await supabase.from('community_posts').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
