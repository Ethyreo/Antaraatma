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
    .from('programs')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const supabase = getAdmin();
  const body = await req.json();
  const { data, error } = await supabase
    .from('programs')
    .insert([{
      title: body.title,
      slug: body.slug,
      tagline: body.tagline ?? '',
      description: body.description ?? '',
      long_description: body.long_description ?? '',
      image_url: body.image_url || null,
      image_alt: body.image_alt || null,
      duration: body.duration ?? '',
      price: body.price ?? 0,
      price_label: body.price_label ?? '',
      price_note: body.price_note || null,
      payment_type: body.payment_type ?? 'one_time',
      status: body.status ?? 'draft',
      featured: body.featured ?? false,
      sort_order: body.sort_order ?? 0,
      outcomes: body.outcomes ?? [],
      who_is_it_for: body.who_is_it_for ?? [],
      seo_title: body.seo_title || null,
      seo_description: body.seo_description || null,
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
    .from('programs')
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
  const { error } = await supabase.from('programs').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
