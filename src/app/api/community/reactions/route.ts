import { NextRequest, NextResponse } from 'next/server';
import {
  createServiceRoleClient,
  requireAuthenticatedUser,
} from '@/lib/supabase/route';

function getAdmin() {
  return createServiceRoleClient();
}

export async function POST(req: NextRequest) {
  const auth = await requireAuthenticatedUser();
  if (auth.error) return auth.error;

  const supabase = getAdmin();
  const body = await req.json();
  const postId = body.post_id;

  if (!postId) {
    return NextResponse.json({ error: 'post_id required' }, { status: 400 });
  }

  const { data: post, error: postError } = await supabase
    .from('community_posts')
    .select('id, user_id, status')
    .eq('id', postId)
    .maybeSingle();

  if (postError) {
    return NextResponse.json({ error: postError.message }, { status: 500 });
  }

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  const canReact =
    auth.role === 'admin' ||
    post.status === 'published' ||
    post.user_id === auth.user.id;

  if (!canReact) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data: existingReaction, error: existingReactionError } = await supabase
    .from('community_reactions')
    .select('id')
    .eq('user_id', auth.user.id)
    .eq('post_id', postId)
    .maybeSingle();

  if (existingReactionError) {
    return NextResponse.json({ error: existingReactionError.message }, { status: 500 });
  }

  if (existingReaction) {
    const { error: deleteError } = await supabase
      .from('community_reactions')
      .delete()
      .eq('id', existingReaction.id);

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }
  } else {
    const { error: insertError } = await supabase
      .from('community_reactions')
      .insert([{ user_id: auth.user.id, post_id: postId }]);

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }
  }

  const { count, error: countError } = await supabase
    .from('community_reactions')
    .select('*', { count: 'exact', head: true })
    .eq('post_id', postId);

  if (countError) {
    return NextResponse.json({ error: countError.message }, { status: 500 });
  }

  const reactionCount = count ?? 0;
  const { error: updateError } = await supabase
    .from('community_posts')
    .update({
      reactions: reactionCount,
      updated_at: new Date().toISOString(),
    })
    .eq('id', postId);

  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }

  return NextResponse.json({
    data: {
      post_id: postId,
      reacted: !existingReaction,
      reactions: reactionCount,
    },
  });
}
