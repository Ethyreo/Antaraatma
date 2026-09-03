import { NextRequest, NextResponse } from 'next/server';
import {
  createServiceRoleClient,
  getRouteAuthContext,
  requireAdminUser,
  requireAuthenticatedUser,
} from '@/lib/supabase/route';

function getAdmin() {
  return createServiceRoleClient();
}

export async function GET() {
  const auth = await requireAuthenticatedUser();
  if (auth.error) return auth.error;

  const supabase = getAdmin();
  let query = supabase
    .from('community_posts')
    .select('*')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  if (auth.role !== 'admin') {
    query = query.or(`status.eq.published,user_id.eq.${auth.user.id}`);
  }

  const { data: posts, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const postIds = (posts ?? []).map((post) => post.id);
  let reactedPostIds: string[] = [];

  if (postIds.length > 0) {
    const { data: reactions, error: reactionsError } = await supabase
      .from('community_reactions')
      .select('post_id')
      .eq('user_id', auth.user.id)
      .in('post_id', postIds);

    if (reactionsError) {
      return NextResponse.json({ error: reactionsError.message }, { status: 500 });
    }

    reactedPostIds = (reactions ?? [])
      .map((reaction) => reaction.post_id)
      .filter((postId): postId is string => Boolean(postId));
  }

  return NextResponse.json({
    data: posts ?? [],
    reacted_post_ids: reactedPostIds,
  });
}

export async function POST(req: NextRequest) {
  const auth = await requireAuthenticatedUser();
  if (auth.error) return auth.error;

  const supabase = getAdmin();
  const body = await req.json();

  const payload = {
    user_id: auth.role === 'admin' && body.user_id ? body.user_id : auth.user.id,
    author_name:
      typeof body.author_name === 'string' && body.author_name.trim()
        ? body.author_name.trim()
        : auth.user.user_metadata?.full_name || auth.user.email || 'Community Member',
    category: body.category ?? 'Gratitude',
    title: body.title,
    body: body.body,
    is_pinned: auth.role === 'admin' ? body.is_pinned ?? false : false,
    status: auth.role === 'admin' ? body.status ?? 'published' : 'published',
  };

  const { data, error } = await supabase
    .from('community_posts')
    .insert([payload])
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

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
    .from('community_posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdminUser();
  if (auth.error) return auth.error;

  const supabase = getAdmin();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const { error } = await supabase.from('community_posts').delete().eq('id', id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
