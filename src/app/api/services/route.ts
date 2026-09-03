import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient, getRouteAuthContext, requireAdminUser } from '@/lib/supabase/route';

function getAdmin() {
  return createServiceRoleClient();
}

export async function GET() {
  const { role } = await getRouteAuthContext();
  const supabase = getAdmin();
  let query = supabase.from('services').select('*').order('sort_order', { ascending: true });
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
    .from('services')
    .insert([{
      title: body.title,
      slug: body.slug,
      summary: body.summary ?? '',
      description: body.description ?? '',
      image_url: body.image_url || null,
      image_alt: body.image_alt || null,
      cta_label: body.cta_label ?? 'Learn More',
      cta_href: body.cta_href ?? '/',
      status: body.status ?? 'draft',
      featured: body.featured ?? false,
      sort_order: body.sort_order ?? 0,
      seo_title: body.seo_title || null,
      seo_description: body.seo_description || null,
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
    .from('services')
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
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
