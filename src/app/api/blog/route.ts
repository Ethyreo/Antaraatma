import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

function getAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const slug = searchParams.get('slug');
    const limit = searchParams.get('limit');
    const featured = searchParams.get('featured');

    const supabase = getAdmin();

    let query = supabase
      .from('blog_posts')
      .select(`
        id, title, slug, excerpt, body, cover_image_url, cover_image_alt,
        author_id, author_name, author_avatar_url, category_id,
        published_at, status, featured, word_count, read_time_minutes,
        seo_title, seo_description, seo_keywords, created_at, updated_at,
        blog_categories ( id, name, slug )
      `)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    if (slug) query = query.eq('slug', slug).single() as typeof query;
    if (featured === 'true') query = query.eq('featured', true);
    if (limit) query = query.limit(parseInt(limit));

    const { data, error } = await query;

    if (error) {
      console.error('[API /blog] Fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error('[API /blog] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title, slug, excerpt, body: postBody, cover_image_url, cover_image_alt,
      author_name, category_id, status, featured,
      seo_title, seo_description, seo_keywords, tag_ids
    } = body;

    if (!title || !slug || !category_id) {
      return NextResponse.json({ error: 'Title, slug, and category are required' }, { status: 400 });
    }

    const supabase = getAdmin();
    const wordCount = postBody ? postBody.trim().split(/\s+/).length : 0;
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    const { data: post, error } = await supabase
      .from('blog_posts')
      .insert({
        title,
        slug,
        excerpt: excerpt || '',
        body: postBody || '',
        cover_image_url: cover_image_url || null,
        cover_image_alt: cover_image_alt || null,
        author_name: author_name || 'Dr. Vijay Singla',
        category_id,
        status: status || 'draft',
        featured: featured || false,
        word_count: wordCount,
        read_time_minutes: readTime,
        seo_title: seo_title || null,
        seo_description: seo_description || null,
        seo_keywords: seo_keywords || null,
        published_at: status === 'published' ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (error) {
      console.error('[API /blog] Insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Insert tags if provided
    if (tag_ids && tag_ids.length > 0 && post) {
      const tagRows = tag_ids.map((tag_id: string) => ({ post_id: post.id, tag_id }));
      await supabase.from('blog_post_tags').insert(tagRows);
    }

    return NextResponse.json({ data: post }, { status: 200 });
  } catch (err) {
    console.error('[API /blog] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, tag_ids, body: postBody, status, ...rest } = body;

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const supabase = getAdmin();
    const updateData: Record<string, unknown> = { ...rest, updated_at: new Date().toISOString() };

    if (postBody !== undefined) {
      const wordCount = postBody.trim().split(/\s+/).length;
      updateData.body = postBody;
      updateData.word_count = wordCount;
      updateData.read_time_minutes = Math.max(1, Math.ceil(wordCount / 200));
    }

    if (status !== undefined) {
      updateData.status = status;
      if (status === 'published') {
        updateData.published_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('blog_posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[API /blog] Update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Update tags if provided
    if (tag_ids !== undefined) {
      await supabase.from('blog_post_tags').delete().eq('post_id', id);
      if (tag_ids.length > 0) {
        const tagRows = tag_ids.map((tag_id: string) => ({ post_id: id, tag_id }));
        await supabase.from('blog_post_tags').insert(tagRows);
      }
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error('[API /blog] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    const supabase = getAdmin();

    // Delete tags first
    await supabase.from('blog_post_tags').delete().eq('post_id', id);

    const { error } = await supabase.from('blog_posts').delete().eq('id', id);

    if (error) {
      console.error('[API /blog] Delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('[API /blog] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
