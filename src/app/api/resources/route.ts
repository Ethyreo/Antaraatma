import { NextRequest, NextResponse } from 'next/server';
import {
  createServiceRoleClient,
  getRouteAuthContext,
  requireAdminUser,
} from '@/lib/supabase/route';

function getAdmin() {
  return createServiceRoleClient();
}

export async function GET() {
  const supabase = getAdmin();
  const { role, user } = await getRouteAuthContext();

  const { data: resources, error } = await supabase
    .from('resources')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (role === 'admin') {
    return NextResponse.json({ data: resources ?? [] });
  }

  const publishedResources = (resources ?? []).filter((resource) => resource.status === 'published');
  const programIds = Array.from(
    new Set(
      publishedResources
        .map((resource) => resource.program_id)
        .filter((programId): programId is string => Boolean(programId))
    )
  );

  let accessibleProgramIds = new Set<string>();

  if (user) {
    const { data: enrollments, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('program_id')
      .eq('user_id', user.id)
      .eq('enrollment_status', 'active');

    if (enrollmentError) {
      return NextResponse.json({ error: enrollmentError.message }, { status: 500 });
    }

    accessibleProgramIds = new Set(
      (enrollments ?? [])
        .map((enrollment) => enrollment.program_id)
        .filter((programId): programId is string => Boolean(programId))
    );
  }

  const programTitleMap = new Map<string, string>();
  if (programIds.length > 0) {
    const { data: programs, error: programError } = await supabase
      .from('programs')
      .select('id, title')
      .in('id', programIds);

    if (programError) {
      return NextResponse.json({ error: programError.message }, { status: 500 });
    }

    (programs ?? []).forEach((program) => {
      programTitleMap.set(program.id, program.title);
    });
  }

  const data = publishedResources.map((resource) => {
    const isAccessible =
      resource.access_level === 'free' ||
      (resource.program_id ? accessibleProgramIds.has(resource.program_id) : false);

    return {
      ...resource,
      file_url: isAccessible ? resource.file_url : '',
      is_accessible: isAccessible,
      program_title: resource.program_id ? programTitleMap.get(resource.program_id) ?? null : null,
    };
  });

  return NextResponse.json({ data });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdminUser();
  if (auth.error) return auth.error;

  const supabase = getAdmin();
  const body = await req.json();
  const { data, error } = await supabase
    .from('resources')
    .insert([{
      title: body.title,
      description: body.description ?? '',
      cover_image_url: body.cover_image_url || null,
      cover_image_alt: body.cover_image_alt || null,
      resource_type: body.resource_type,
      file_url: body.file_url ?? '',
      access_level: body.access_level ?? 'free',
      program_id: body.program_id || null,
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
    .from('resources')
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
  const { error } = await supabase.from('resources').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
