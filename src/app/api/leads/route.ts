import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient, requireAdminUser } from '@/lib/supabase/route';

function getAdmin() {
  return createServiceRoleClient();
}

export async function GET() {
  try {
    const auth = await requireAdminUser();
    if (auth.error) return auth.error;

    const supabaseAdmin = getAdmin();
    const { data, error } = await supabaseAdmin
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[API /leads] Fetch error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error('[API /leads] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, source, lead_status } = body;

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const supabaseAdmin = getAdmin();
    const { data, error } = await supabaseAdmin
      .from('leads')
      .insert({
        name,
        email,
        phone: phone || null,
        source: source || 'Awareness Session',
        lead_status: lead_status || 'new',
      })
      .select()
      .single();

    if (error) {
      console.error('[API /leads] Insert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error('[API /leads] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const auth = await requireAdminUser();
    if (auth.error) return auth.error;

    const body = await request.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const supabaseAdmin = getAdmin();
    const { data, error } = await supabaseAdmin
      .from('leads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[API /leads] Update error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    console.error('[API /leads] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await requireAdminUser();
    if (auth.error) return auth.error;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

    const supabaseAdmin = getAdmin();
    const { error } = await supabaseAdmin.from('leads').delete().eq('id', id);

    if (error) {
      console.error('[API /leads] Delete error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error('[API /leads] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
